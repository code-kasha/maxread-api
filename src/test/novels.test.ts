import { describe, it, expect } from "vitest"
import request from "supertest"
import app from "../app.js"
import { Novel } from "../models/Novel.js"
import { Chapter } from "../models/Chapter.js"

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
