import { Request, Response } from "express"
import { Novel } from "../models/Novel.js"
import { Genre } from "../models/Genre.js"
import { Tag } from "../models/Tag.js"
import { AppError } from "../utils/AppError.js"
import { escapeRegex } from "../utils/escapeRegex.js"
import type { NovelQuery } from "../schemas/novelSchemas.js"

export async function getNovels(_req: Request, res: Response) {
	const { page, limit, search, genre, tag } = res.locals.query as NovelQuery

	const filter: Record<string, unknown> = {}

	if (search) {
		const safe = escapeRegex(search)
		filter.$or = [
			{ title: { $regex: safe, $options: "i" } },
			{ author: { $regex: safe, $options: "i" } },
		]
	}

	if (genre) {
		const genreDoc = await Genre.findOne({
			name: { $regex: `^${escapeRegex(genre)}$`, $options: "i" },
		})
		if (!genreDoc) {
			return res.json({
				data: [],
				pagination: { page, limit, total: 0, totalPages: 0 },
			})
		}
		filter.genres = genreDoc._id
	}

	if (tag) {
		const tagDoc = await Tag.findOne({
			name: { $regex: `^${escapeRegex(tag)}$`, $options: "i" },
		})
		if (!tagDoc) {
			return res.json({
				data: [],
				pagination: { page, limit, total: 0, totalPages: 0 },
			})
		}
		filter.tags = tagDoc._id
	}

	const skip = (page - 1) * limit

	const [novels, total] = await Promise.all([
		Novel.find(filter)
			.populate("genres tags")
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit),
		Novel.countDocuments(filter),
	])

	res.json({
		data: novels,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	})
}

export async function getNovelBySlug(req: Request, res: Response) {
	const novel = await Novel.findOne({ slug: req.params.slug }).populate(
		"genres tags",
	)
	if (!novel) throw new AppError("Novel not found", 404)
	res.json(novel)
}
