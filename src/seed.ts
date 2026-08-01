import "dotenv/config"
import mongoose from "mongoose"
import "./models/index.js" // <-- add this line
import { connectDB } from "./config/db.js"
import { Genre } from "./models/Genre.js"
import { Tag } from "./models/Tag.js"
import { Novel } from "./models/Novel.js"
import { Chapter } from "./models/Chapter.js"

async function seed() {
	await connectDB()

	// Clear existing data
	await Promise.all([
		Genre.deleteMany({}),
		Tag.deleteMany({}),
		Novel.deleteMany({}),
		Chapter.deleteMany({}),
	])

	// Genres & tags
	const [fantasy, cultivation, scifi] = await Genre.insertMany([
		{ name: "Fantasy" },
		{ name: "Cultivation" },
		{ name: "Sci-Fi" },
	])

	const [system, rebirth, isekai] = await Tag.insertMany([
		{ name: "System" },
		{ name: "Rebirth" },
		{ name: "Isekai" },
	])

	// Novel 1
	const novel1 = await Novel.create({
		slug: "the-last-forge-of-mount-veyra",
		title: "The Last Forge of Mount Veyra",
		author: "J. Renn",
		coverUrl: "https://placehold.co/400x600?text=Veyra",
		description:
			"A disgraced blacksmith discovers his forge is bound to an ancient mountain spirit, and every blade he tempers now carries a piece of its power.",
		status: "ongoing",
		chapterCount: 3,
		rating: 4.6,
		genres: [fantasy._id, cultivation._id],
		tags: [system._id, rebirth._id],
	})

	await Chapter.insertMany([
		{
			novel: novel1._id,
			order: 1,
			code: "c1",
			name: "锻炉苏醒",
			title: "Chapter 1: The Forge Awakens",
			content:
				"The coals had gone cold three winters ago, but tonight they glowed without a single spark struck. Toren stood in the doorway of his father's forge, hammer loose in his hand, watching the light pulse like something breathing beneath the ash...",
			charCount: 320,
			locked: false,
			released: true,
		},
		{
			novel: novel1._id,
			order: 2,
			code: "c2",
			name: "第一把剑",
			title: "Chapter 2: The First Blade",
			content:
				"By dawn the metal had taken a shape Toren hadn't hammered into it. The edge caught the weak morning light and threw it back silver-blue, like the underside of a glacier. He did not remember quenching it...",
			charCount: 295,
			locked: false,
			released: true,
		},
		{
			novel: novel1._id,
			order: 3,
			code: "c3",
			name: "山的低语",
			title: "Chapter 3: The Mountain Speaks",
			content:
				'The voice came from nowhere and everywhere, the way thunder seems to come from the whole sky at once. "You have my name now," it said. "Use it carefully."',
			charCount: 210,
			locked: false,
			released: true,
		},
	])

	// Novel 2
	const novel2 = await Novel.create({
		slug: "null-signal",
		title: "Null Signal",
		author: "M. Okafor",
		coverUrl: "https://placehold.co/400x600?text=Null+Signal",
		description:
			"A washed-up satellite technician intercepts a transmission that shouldn't exist — one broadcasting from a version of Earth that ended differently.",
		status: "ongoing",
		chapterCount: 2,
		rating: 4.2,
		genres: [scifi._id],
		tags: [isekai._id, system._id],
	})

	await Chapter.insertMany([
		{
			novel: novel2._id,
			order: 1,
			code: "c1",
			name: null,
			title: "Chapter 1: Static",
			content:
				"The signal shouldn't have been there. Priya checked the frequency twice, then a third time, fingers cold on the console. Nothing broadcast on 121.7 anymore — nothing had, not since the towers came down...",
			charCount: 340,
			locked: false,
			released: true,
		},
		{
			novel: novel2._id,
			order: 2,
			code: "c2",
			name: null,
			title: "Chapter 2: The Other Frequency",
			content:
				"It took her six hours to decode the first ten seconds. What she found was a weather report — for a city that, in her world, had never been built.",
			charCount: 260,
			locked: false,
			released: true,
		},
	])

	console.log("Seed complete:")
	console.log(`- ${await Novel.countDocuments()} novels`)
	console.log(`- ${await Chapter.countDocuments()} chapters`)

	await mongoose.disconnect()
}

seed().catch((err) => {
	console.error(err)
	process.exit(1)
})
