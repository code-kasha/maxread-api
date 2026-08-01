import { Request, Response } from "express"
import { Novel } from "../models/Novel.js"
import { AppError } from "../utils/AppError.js"

export async function getNovels(_req: Request, res: Response) {
	const novels = await Novel.find().populate("genres tags")
	res.json(novels)
}

export async function getNovelBySlug(req: Request, res: Response) {
	const novel = await Novel.findOne({ slug: req.params.slug }).populate(
		"genres tags",
	)
	if (!novel) throw new AppError("Novel not found", 404)
	res.json(novel)
}
