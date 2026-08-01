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

		if (target === "query") {
			// Express 5: req.query is a read-only getter, so we can't reassign it.
			// Store the validated/coerced query on res.locals instead.
			res.locals.query = result.data
		} else {
			req[target] = result.data
		}
		next()
	}
}
