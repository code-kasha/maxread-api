import express from "express"
import cors from "cors"
import swaggerUi from "swagger-ui-express"
import { createRequire } from "node:module"
import novelRoutes from "./routes/novels.js"
import chapterRoutes from "./routes/chapters.js"
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js"
import { generateOpenApiDocument } from "./docs/registry.js"

const require = createRequire(import.meta.url)
const redoc = require("redoc-express") as (options: {
	title: string
	specUrl: string
}) => (req: express.Request, res: express.Response) => void

const app = express()

app.use(cors())
app.use(express.json())

const openApiDocument = generateOpenApiDocument()
app.get("/api/openapi.json", (_req, res) => res.json(openApiDocument))

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument))

app.get(
	"/redoc",
	redoc({
		title: "MaxRead API Docs",
		specUrl: "/api/openapi.json",
	}),
)

app.use("/api/novels", novelRoutes)
app.use("/api/chapters", chapterRoutes)

app.get("/health", (_req, res) => res.json({ status: "ok" }))

app.use(notFoundHandler)
app.use(errorHandler)

export default app
