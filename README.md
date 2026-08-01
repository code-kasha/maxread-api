# MaxRead API

A REST API for a novel reading platform, built with Express, TypeScript, and Mongoose (MongoDB). Serves novels, chapters, genres, and tags to a React frontend.

[![CI](https://github.com/code-kasha/maxread-api/actions/workflows/ci.yml/badge.svg)](https://github.com/code-kasha/maxread-api/actions/workflows/ci.yml)
![Tests](https://img.shields.io/badge/tests-7%20passing-brightgreen)
![Node](https://img.shields.io/badge/node-20.x-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)

## Tech Stack

- **Runtime**: Node.js + TypeScript (`tsx` for dev, `tsc` for build)
- **Framework**: Express
- **Database**: MongoDB via Mongoose
- **Validation**: Zod
- **Testing**: Vitest + Supertest + `mongodb-memory-server`
- **CI**: GitHub Actions (lint, type-check, test on every push/PR)

## Features

- **Novels & Chapters** — REST endpoints for browsing novels and reading chapters in order
- **Search & Filtering** — search novels by title/author, filter by genre or tag
- **Pagination** — paginated novel listings with configurable page size
- **Validation** — all inputs validated with Zod; malformed requests return structured 400 errors
- **Rate Limiting** — protects the API from abuse (100 requests / 15 min per IP)
- **Centralized Error Handling** — consistent JSON error shape across all endpoints
- **API Documentation** — interactive Swagger UI (`/docs`) and ReDoc (`/redoc`), generated from the same Zod schemas used for validation
- **Testing** — integration test suite (Vitest + Supertest + in-memory MongoDB) covering all endpoints, edge cases, and error paths
- **CI** — GitHub Actions pipeline runs lint, type-check, and tests on every push/PR

## Project Structure

```
src/
  config/         # DB connection
  models/         # Mongoose schemas (Novel, Chapter, Genre, Tag)
  routes/         # Express route definitions
  controllers/    # Request handlers
  middleware/     # Validation + centralized error handling
  schemas/        # Zod schemas for request validation
  utils/          # AppError, asyncHandler
  test/           # Vitest setup + integration tests
  seed.ts         # Seeds the database with sample novels/chapters
  app.ts          # Express app (no DB connection, testable in isolation)
  server.ts       # Entry point (connects DB, starts server)
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- MongoDB running locally, or a connection string to a hosted instance

### Install

```bash
pnpm install
```

### Environment variables

Create a `.env` file in the project root:

```
MONGODB_URI=mongodb://localhost:27017/novel-api
PORT=4000
```

### Seed the database

```bash
pnpm seed
```

### Run the dev server

```bash
pnpm dev
```

The API will be available at `http://localhost:4000`.

## API Endpoints

| Method | Endpoint                     | Description                |
| ------ | ---------------------------- | -------------------------- |
| GET    | `/health`                    | Health check               |
| GET    | `/api/novels`                | List all novels            |
| GET    | `/api/novels/:slug`          | Get a single novel by slug |
| GET    | `/api/chapters/:slug/:order` | Get a specific chapter     |

All responses are JSON. Errors follow the shape:

```json
{ "message": "Novel not found" }
```

Validation errors additionally include a `errors` field with per-field details.

## Testing

Tests run against an in-memory MongoDB instance (via `mongodb-memory-server`), so no external database is required to run the suite.

```bash
pnpm test
```

**Current status: ✅ 7/7 tests passing**

```
✓ src/test/novels.test.ts (7 tests)
  ✓ GET /api/novels (2)
    ✓ returns an empty array when no novels exist
    ✓ returns novels that exist
  ✓ GET /api/novels/:slug (2)
    ✓ returns 404 for a missing novel
    ✓ returns the novel when it exists
  ✓ GET /api/chapters/:slug/:order (3)
    ✓ returns 400 for invalid order param
    ✓ returns 404 when novel does not exist
    ✓ returns the chapter when it exists

Test Files  1 passed (1)
     Tests  7 passed (7)
```

> Note: the first test run will take longer than usual, since `mongodb-memory-server` downloads a MongoDB binary the first time it's used. Subsequent runs use the cached binary and are fast.

## Scripts

| Script            | Description                            |
| ----------------- | -------------------------------------- |
| `pnpm dev`        | Run the API in watch mode              |
| `pnpm build`      | Compile TypeScript to `dist/`          |
| `pnpm start`      | Run the compiled build                 |
| `pnpm seed`       | Populate the database with sample data |
| `pnpm test`       | Run the test suite once                |
| `pnpm test:watch` | Run tests in watch mode                |
| `pnpm lint`       | Run oxlint against `src/`              |

## CI

Every push and pull request to `main` triggers a GitHub Actions workflow that:

1. Installs dependencies (`pnpm install --frozen-lockfile`)
2. Lints the codebase
3. Type-checks with `tsc --noEmit`
4. Runs the full test suite

See [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

## Notes on Data

Sample novel/chapter content used for local seeding and testing is original, written specifically for this project — no third-party or scraped content is included in this repository.
