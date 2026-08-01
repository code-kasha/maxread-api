import { Router } from "express"
import { getNovels, getNovelBySlug } from "../controllers/novelController.js"
import { validate } from "../middleware/validate.js"
import { novelSlugParams, novelQuery } from "../schemas/novelSchemas.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const router = Router()

router.get("/", validate(novelQuery, "query"), asyncHandler(getNovels))
router.get(
	"/:slug",
	validate(novelSlugParams, "params"),
	asyncHandler(getNovelBySlug),
)

export default router
