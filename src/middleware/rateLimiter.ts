import rateLimit from "express-rate-limit"

export const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // 100 requests per window per IP
	standardHeaders: "draft-7",
	legacyHeaders: false,
	message: { message: "Too many requests, please try again later." },
})
