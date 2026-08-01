import express from "express"
import cors from "cors"
import novelRoutes from "./routes/novels.js"
import chapterRoutes from "./routes/chapters.js"
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/novels", novelRoutes)
app.use("/api/chapters", chapterRoutes)

app.get("/health", (_req, res) => res.json({ status: "ok" }))

app.use(notFoundHandler)
app.use(errorHandler)

export default app
