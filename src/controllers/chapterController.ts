import { Request, Response } from "express"
import { Chapter } from "../models/Chapter.js"
import { Novel } from "../models/Novel.js"
import { AppError } from "../utils/AppError.js"

export async function getChapter(req: Request, res: Response) {
	const { slug, order } = req.params
	const novel = await Novel.findOne({ slug })
	if (!novel) throw new AppError("Novel not found", 404)

	const chapter = await Chapter.findOne({
		novel: novel._id,
		order: Number(order),
	})
	if (!chapter) throw new AppError("Chapter not found", 404)

	res.json(chapter)
}
