import { Schema, model } from "mongoose"

const chapterSchema = new Schema(
	{
		novel: { type: Schema.Types.ObjectId, ref: "Novel", required: true },
		order: { type: Number, required: true }, // chapter position, was "chapterNum"
		code: { type: String, required: true }, // e.g. "c1"
		name: String, // raw/original-language title
		title: String, // translated title
		content: { type: String, required: true }, // chapter body text
		charCount: Number,
		locked: { type: Boolean, default: false },
		released: { type: Boolean, default: true },
	},
	{ timestamps: true },
)

chapterSchema.index({ novel: 1, order: 1 }, { unique: true })

export const Chapter = model("Chapter", chapterSchema)
