import {
	OpenAPIRegistry,
	OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi"
import {
	novelSlugParams,
	chapterParams,
	novelResponseSchema,
	chapterResponseSchema,
	errorResponseSchema,
} from "../schemas/novelSchemas.js"

const registry = new OpenAPIRegistry()

registry.registerPath({
	method: "get",
	path: "/api/novels",
	summary: "List all novels",
	description:
		"Returns every novel in the catalog, including populated genre and tag data.",
	tags: ["Novels"],
	responses: {
		200: {
			description: "A list of novels",
			content: { "application/json": { schema: novelResponseSchema.array() } },
		},
	},
})

registry.registerPath({
	method: "get",
	path: "/api/novels/{slug}",
	summary: "Get a novel by slug",
	description:
		"Returns a single novel and its metadata. Returns 404 if the slug does not match any novel.",
	tags: ["Novels"],
	request: { params: novelSlugParams },
	responses: {
		200: {
			description: "The requested novel",
			content: { "application/json": { schema: novelResponseSchema } },
		},
		404: {
			description: "Novel not found",
			content: { "application/json": { schema: errorResponseSchema } },
		},
	},
})

registry.registerPath({
	method: "get",
	path: "/api/chapters/{slug}/{order}",
	summary: "Get a specific chapter of a novel",
	description:
		"Fetches a single chapter by its position (order) within a novel. `order` starts at 1.",
	tags: ["Chapters"],
	request: { params: chapterParams },
	responses: {
		200: {
			description: "The requested chapter",
			content: { "application/json": { schema: chapterResponseSchema } },
		},
		400: {
			description: "Invalid params (e.g. non-numeric order)",
			content: { "application/json": { schema: errorResponseSchema } },
		},
		404: {
			description: "Novel or chapter not found",
			content: { "application/json": { schema: errorResponseSchema } },
		},
	},
})

export function generateOpenApiDocument() {
	const generator = new OpenApiGeneratorV3(registry.definitions)
	return generator.generateDocument({
		openapi: "3.0.0",
		info: {
			title: "MaxRead API",
			version: "1.0.0",
			description:
				"REST API for a novel reading platform. Provides endpoints for browsing novels and reading chapters.",
			contact: {
				name: "API Support",
			},
			license: {
				name: "ISC",
			},
		},
		servers: [{ url: "/" }],
		tags: [
			{ name: "Novels", description: "Browse and retrieve novel metadata" },
			{ name: "Chapters", description: "Retrieve individual chapter content" },
		],
	})
}
