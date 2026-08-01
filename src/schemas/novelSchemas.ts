import { z } from "zod"

export const novelSlugParams = z.object({
	slug: z.string().min(1),
})

export const chapterParams = z.object({
	slug: z.string().min(1),
	order: z.coerce.number().int().positive(),
})
