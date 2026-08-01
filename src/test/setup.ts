import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import { beforeAll, afterAll, afterEach } from "vitest"
import "../models/index.js"

let mongod: MongoMemoryServer | undefined

beforeAll(async () => {
	mongod = await MongoMemoryServer.create()
	await mongoose.connect(mongod.getUri())
}, 60000)

afterEach(async () => {
	const collections = mongoose.connection.collections
	for (const key in collections) {
		await collections[key].deleteMany({})
	}
})

afterAll(async () => {
	await mongoose.disconnect()
	if (mongod) await mongod.stop()
})
