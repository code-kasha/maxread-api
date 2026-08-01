import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi"
import { z } from "zod"

extendZodWithOpenApi(z)

export const novelSlugParams = z.object({
	slug: z.string().min(1).openapi({ example: "the-last-forge-of-mount-veyra" }),
})

export const chapterParams = z.object({
	slug: z.string().min(1).openapi({ example: "the-last-forge-of-mount-veyra" }),
	order: z.coerce.number().int().positive().openapi({ example: 1 }),
})

export const novelResponseSchema = z
	.object({
		_id: z.string().openapi({ example: "6710a1f2b3c4d5e6f7a8b9c0" }),
		slug: z.string().openapi({ example: "the-last-forge-of-mount-veyra" }),
		title: z.string().openapi({ example: "The Last Forge of Mount Veyra" }),
		author: z.string().optional().openapi({ example: "J. Renn" }),
		coverUrl: z
			.string()
			.optional()
			.openapi({ example: "https://placehold.co/400x600" }),
		description: z.string().optional().openapi({
			example:
				"A disgraced blacksmith discovers his forge is bound to an ancient mountain spirit.",
		}),
		status: z.enum(["ongoing", "completed"]).openapi({ example: "ongoing" }),
		chapterCount: z.number().openapi({ example: 3 }),
		rating: z.number().optional().openapi({ example: 4.6 }),
	})
	.openapi("Novel")

export const chapterResponseSchema = z
	.object({
		_id: z.string().openapi({ example: "6710a1f2b3c4d5e6f7a8b9c1" }),
		novel: z.string().openapi({ example: "6710a1f2b3c4d5e6f7a8b9c0" }),
		order: z.number().openapi({ example: 1 }),
		code: z.string().openapi({ example: "c1" }),
		name: z.string().optional().openapi({ example: "锻炉苏醒" }),
		title: z
			.string()
			.optional()
			.openapi({ example: "Chapter 1: The Forge Awakens" }),
		content: z
			.string()
			.openapi({ example: "The coals had gone cold three winters ago..." }),
		charCount: z.number().optional().openapi({ example: 320 }),
		locked: z.boolean().openapi({ example: false }),
		released: z.boolean().openapi({ example: true }),
	})
	.openapi("Chapter")
export const errorResponseSchema = z
	.object({
		message: z.string(),
	})
	.openapi("Error")
