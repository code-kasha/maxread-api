export interface Genre {
	_id: string
	name: string
}

export interface Tag {
	_id: string
	name: string
}

export interface Novel {
	_id: string
	slug: string
	title: string
	author?: string
	coverUrl?: string
	description?: string
	status: "ongoing" | "completed"
	chapterCount: number
	rating?: number
	genres: Genre[]
	tags: Tag[]
}

export interface Chapter {
	_id: string
	novel: string
	order: number
	code: string
	name?: string
	title?: string
	content: string
	charCount?: number
	locked: boolean
	released: boolean
}
