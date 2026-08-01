import request from "supertest"
import app from "../app.js"
import { Novel } from "../models/Novel.js"
import { Chapter } from "../models/Chapter.js"
import { Genre } from "../models/Genre.js"
import { Tag } from "../models/Tag.js"

describe("GET /api/novels", () => {
	it("returns an empty array when no novels exist", async () => {
		const res = await request(app).get("/api/novels")
		expect(res.status).toBe(200)
		expect(res.body).toEqual([])
	})

	it("returns novels that exist", async () => {
		await Novel.create({
			slug: "test-novel",
			title: "Test Novel",
			description: "A test",
		})

		const res = await request(app).get("/api/novels")
		expect(res.status).toBe(200)
		expect(res.body).toHaveLength(1)
		expect(res.body[0].slug).toBe("test-novel")
	})
})

describe("GET /api/novels/:slug", () => {
	it("returns 404 for a missing novel", async () => {
		const res = await request(app).get("/api/novels/does-not-exist")
		expect(res.status).toBe(404)
		expect(res.body.message).toBe("Novel not found")
	})

	it("returns the novel when it exists", async () => {
		await Novel.create({ slug: "my-novel", title: "My Novel" })

		const res = await request(app).get("/api/novels/my-novel")
		expect(res.status).toBe(200)
		expect(res.body.title).toBe("My Novel")
	})
})

describe("GET /api/chapters/:slug/:order", () => {
	it("returns 400 for invalid order param", async () => {
		const res = await request(app).get("/api/chapters/some-slug/not-a-number")
		expect(res.status).toBe(400)
	})

	it("returns 404 when novel does not exist", async () => {
		const res = await request(app).get("/api/chapters/no-novel/1")
		expect(res.status).toBe(404)
		expect(res.body.message).toBe("Novel not found")
	})

	it("returns the chapter when it exists", async () => {
		const novel = await Novel.create({
			slug: "chaptered-novel",
			title: "Chaptered",
		})
		await Chapter.create({
			novel: novel._id,
			order: 1,
			code: "c1",
			title: "Chapter 1",
			content: "Once upon a time...",
		})

		const res = await request(app).get("/api/chapters/chaptered-novel/1")
		expect(res.status).toBe(200)
		expect(res.body.content).toBe("Once upon a time...")
	})
})

describe("GET /api/novels (pagination)", () => {
	beforeEach(async () => {
		// seed 15 novels for pagination tests
		const novels = Array.from({ length: 15 }, (_, i) => ({
			slug: `novel-${i + 1}`,
			title: `Novel ${i + 1}`,
		}))
		await Novel.insertMany(novels)
	})

	it("defaults to page 1, limit 10", async () => {
		const res = await request(app).get("/api/novels")
		expect(res.status).toBe(200)
		expect(res.body.data).toHaveLength(10)
		expect(res.body.pagination).toEqual({
			page: 1,
			limit: 10,
			total: 15,
			totalPages: 2,
		})
	})

	it("respects page and limit query params", async () => {
		const res = await request(app).get("/api/novels?page=2&limit=5")
		expect(res.status).toBe(200)
		expect(res.body.data).toHaveLength(5)
		expect(res.body.pagination.page).toBe(2)
		expect(res.body.pagination.totalPages).toBe(3)
	})

	it("rejects a limit above the max", async () => {
		const res = await request(app).get("/api/novels?limit=999")
		expect(res.status).toBe(400)
	})

	it("rejects a non-numeric page", async () => {
		const res = await request(app).get("/api/novels?page=abc")
		expect(res.status).toBe(400)
	})
})

describe("GET /api/novels (search)", () => {
	beforeEach(async () => {
		await Novel.create([
			{
				slug: "forge-of-veyra",
				title: "The Last Forge of Mount Veyra",
				author: "J. Renn",
			},
			{ slug: "null-signal", title: "Null Signal", author: "M. Okafor" },
		])
	})

	it("matches on title (case-insensitive)", async () => {
		const res = await request(app).get("/api/novels?search=forge")
		expect(res.status).toBe(200)
		expect(res.body.data).toHaveLength(1)
		expect(res.body.data[0].slug).toBe("forge-of-veyra")
	})

	it("matches on author", async () => {
		const res = await request(app).get("/api/novels?search=okafor")
		expect(res.status).toBe(200)
		expect(res.body.data).toHaveLength(1)
		expect(res.body.data[0].slug).toBe("null-signal")
	})

	it("returns empty array for no matches", async () => {
		const res = await request(app).get("/api/novels?search=nonexistentterm")
		expect(res.status).toBe(200)
		expect(res.body.data).toHaveLength(0)
	})

	it("treats regex special characters as literal text", async () => {
		// should not throw or match everything due to unescaped regex
		const res = await request(app).get("/api/novels?search=.*")
		expect(res.status).toBe(200)
		expect(res.body.data).toHaveLength(0)
	})
})

describe("GET /api/novels (genre/tag filter)", () => {
	it("filters by genre name", async () => {
		const fantasy = await Genre.create({ name: "Fantasy" })
		await Novel.create([
			{ slug: "fantasy-novel", title: "Fantasy Novel", genres: [fantasy._id] },
			{ slug: "other-novel", title: "Other Novel" },
		])

		const res = await request(app).get("/api/novels?genre=fantasy")
		expect(res.status).toBe(200)
		expect(res.body.data).toHaveLength(1)
		expect(res.body.data[0].slug).toBe("fantasy-novel")
	})

	it("returns empty array for a genre that does not exist", async () => {
		const res = await request(app).get("/api/novels?genre=doesnotexist")
		expect(res.status).toBe(200)
		expect(res.body.data).toHaveLength(0)
		expect(res.body.pagination.total).toBe(0)
	})

	it("filters by tag name", async () => {
		const system = await Tag.create({ name: "System" })
		await Novel.create([
			{ slug: "system-novel", title: "System Novel", tags: [system._id] },
			{ slug: "other-novel", title: "Other Novel" },
		])

		const res = await request(app).get("/api/novels?tag=system")
		expect(res.status).toBe(200)
		expect(res.body.data).toHaveLength(1)
		expect(res.body.data[0].slug).toBe("system-novel")
	})
})
