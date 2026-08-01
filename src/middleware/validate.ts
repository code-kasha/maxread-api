import { Request, Response, NextFunction } from "express"
import { ZodType } from "zod"

type ValidateTarget = "body" | "params" | "query"

export function validate(schema: ZodType, target: ValidateTarget = "body") {
	return (req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req[target])
		if (!result.success) {
			return res.status(400).json({
				message: "Validation failed",
				errors: result.error.flatten().fieldErrors,
			})
		}
		req[target] = result.data
		next()
	}
}
