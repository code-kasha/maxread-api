import { Router } from "express"
import { getChapter } from "../controllers/chapterController.js"
import { validate } from "../middleware/validate.js"
import { chapterParams } from "../schemas/novelSchemas.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const router = Router()

router.get(
	"/:slug/:order",
	validate(chapterParams, "params"),
	asyncHandler(getChapter),
)

export default router
