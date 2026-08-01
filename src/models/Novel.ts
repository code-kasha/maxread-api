import { Schema, model } from "mongoose"

const novelSchema = new Schema(
	{
		slug: { type: String, required: true, unique: true },
		title: { type: String, required: true },
		author: String,
		coverUrl: String,
		description: String,
		status: {
			type: String,
			enum: ["ongoing", "completed"],
			default: "ongoing",
		},
		chapterCount: { type: Number, default: 0 },
		rating: Number,
		isAdult: { type: Boolean, default: false },
		genres: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
		tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
	},
	{ timestamps: true },
)

export const Novel = model("Novel", novelSchema)
