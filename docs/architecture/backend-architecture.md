# iPrep Backend Architecture

> Last updated: 2026-05-06 (added two-layer DB split explanation)
> Scope: Backend folder structure, responsibilities, and libraries for the local-first MVP.

---

## Backend Goal

The backend is the local orchestration layer for iPrep. It owns API routes, WebSocket sessions, provider access, database persistence, environment validation, logging, and the bridge between the frontend, CLI, local DB, and external AI providers.

## Backend Stack

| Area | Library / Package | Used In | Purpose |
| --- | --- | --- | --- |
| Runtime | Node.js 20+ | All backend packages | Stable ESM runtime for server, CLI, adapters, and scripts. |
| Language | TypeScript | `apps/server`, `packages/*` | Strict typing across routes, services, providers, and DB queries. |
| HTTP server | `express` | `apps/server` | REST API for sessions, analysis, settings, packages, tutors, providers, and health checks. |
| WebSocket server | `ws` | `apps/server/src/ws` | Realtime voice agent bridge and streaming analysis updates. |
| CORS | `cors` | `apps/server/src/app.ts` | Allows local frontend dev server to call the local backend safely. |
| Validation | `zod` + `@iprep/shared` | Routes, env, provider payloads | Runtime validation for request bodies, env vars, and provider responses. |
| Logging | `winston` | `apps/server/src/utils/logger.ts` | Structured server logs without raw `console.log` in production code. |
| Database ORM | `prisma` + `@prisma/client` | `packages/db` | SQLite local persistence now, Postgres-compatible schema later. |
| DB access layer | `@iprep/db` | `apps/server/src/repositories`, `apps/cli` | Shared Prisma query functions consumed by server repositories and CLI commands directly. Kept as a separate package so both consumers share one schema and one migration runner. |
| Shared contracts | `@iprep/shared` | Server, frontend, CLI, providers | Shared schemas, constants, and TypeScript types. |
| Provider layer | `@iprep/providers` | `apps/server/src/services/provider-registry.ts` | LLM, STT, TTS, and agent provider implementations and fallback resolution. |
| CLI process utilities | `@iprep/adapter-utils` | Provider adapters | Safe child-process spawning, stream reading, parsing, sessions, and errors. |
| Dev runner | `tsx` | `apps/server` scripts | Runs TypeScript directly during development with watch mode. |

## Backend App Folder Structure

| Path | Responsibility | Short Description |
| --- | --- | --- |
| `apps/server/package.json` | Server package config | Declares Express, ws, Zod, Winston, workspace dependencies, and server scripts. |
| `apps/server/tsconfig.json` | TypeScript config | Extends the monorepo TS baseline for the server app. |
| `apps/server/src/index.ts` | Server entry | Loads env, runs startup tasks, creates HTTP server, attaches WebSockets, and starts listening. |
| `apps/server/src/app.ts` | Express app | Configures middleware, JSON parsing, CORS, logging, and REST route registration. |
| `apps/server/src/routes/` | Route registration | Defines URL paths and HTTP methods, then delegates to controllers. No business logic. |
| `apps/server/src/middlewares/` | Express middleware | Shared request logging, validation, error handling, auth placeholders, and request context. |
| `apps/server/src/controllers/` | HTTP controllers | Handles request/response concerns, validates inputs, maps service results to HTTP responses. |
| `apps/server/src/services/` | Backend business logic | Interview lifecycle, analysis orchestration, provider status, Deepgram proxy logic, and DB coordination. |
| `apps/server/src/repositories/` | Data access boundary | Wraps `@iprep/db` query functions and local filesystem reads/writes behind backend-specific interfaces. |
| `apps/server/src/ws/` | WebSocket handlers | Long-lived realtime connections for voice agent and analysis progress streaming. |
| `apps/server/src/utils/` | Server utilities | Environment parsing, logger, and small server-only helpers. |

## Backend Folder Tree

```text
apps/server/
├── package.json                 # Express server package, scripts, and dependencies
├── tsconfig.json                # TypeScript config for the backend app
└── src/
    ├── index.ts                 # Process entry: env, startup tasks, HTTP server, listen
    ├── app.ts                   # Express app: middleware, CORS, JSON parsing, routes
    │
    ├── routes/                  # Route declarations only
    │   ├── health.routes.ts     # GET /health
    │   ├── packages.routes.ts   # GET /api/packages
    │   ├── tutors.routes.ts     # GET /api/tutors
    │   ├── interview.routes.ts  # /api/interview lifecycle + transcript routes
    │   ├── analysis.routes.ts   # /api/analysis trigger + result routes
    │   ├── providers.routes.ts  # /api/providers status + validation routes
    │   ├── settings.routes.ts   # /api/settings preferences + BYOK routes
    │   └── index.ts             # Registers all route groups on the Express app
    │
    ├── middlewares/             # Cross-cutting Express middleware
    │   ├── error.middleware.ts   # Central error response mapper
    │   ├── validate.middleware.ts
    │   │                         # Zod body/query/params validation helper
    │   ├── request-log.middleware.ts
    │   │                         # Request logging and timing
    │   ├── request-context.middleware.ts
    │   │                         # Request ID and local context attachment
    │   ├── auth.middleware.ts    # Local no-op now; cloud auth hook later
    │   └── index.ts              # Middleware exports
    │
    ├── controllers/             # HTTP request/response handlers
    │   ├── health.controller.ts
    │   ├── packages.controller.ts
    │   ├── tutors.controller.ts
    │   ├── interview.controller.ts
    │   ├── analysis.controller.ts
    │   ├── providers.controller.ts
    │   └── settings.controller.ts
    │
    ├── services/                # Business logic and orchestration
    │   ├── interview-engine.ts  # Start/end sessions, transcript state, DB coordination
    │   ├── analysis-engine.ts   # Provider selection, analysis execution, result storage
    │   ├── provider-registry.ts # Server-facing provider availability and fallback wrapper
    │   └── deepgram-agent-proxy.ts
    │                            # Deepgram voice agent bridge used by WS handlers
    │
    ├── repositories/            # Backend data access interfaces
    │   ├── session.repository.ts # Session CRUD, transcript reads/writes
    │   ├── analysis.repository.ts
    │   │                         # Analysis job/result persistence
    │   ├── package.repository.ts # Interview package reads/seeding
    │   ├── tutor.repository.ts   # Tutor persona reads/seeding
    │   ├── settings.repository.ts
    │   │                         # Preferences and BYOK metadata persistence
    │   └── index.ts              # Repository exports/factory
    │
    ├── ws/                      # WebSocket handlers
    │   ├── agent-ws.ts          # WS /ws/agent live voice interview bridge
    │   └── analysis-ws.ts       # WS /ws/analysis/:sessionId progress stream
    │
    └── utils/                   # Server-only utilities
        ├── env.ts               # Zod environment validation and typed config
        └── logger.ts            # Winston logger setup
```

## Route Structure

| File | Route Group | Main Responsibility |
| --- | --- | --- |
| `routes/health.routes.ts` | `GET /health` | Wires health endpoint to `health.controller.ts`. |
| `routes/packages.routes.ts` | `GET /api/packages` | Wires package endpoints to `packages.controller.ts`. |
| `routes/tutors.routes.ts` | `GET /api/tutors` | Wires tutor endpoints to `tutors.controller.ts`. |
| `routes/interview.routes.ts` | `/api/interview/*` | Wires interview lifecycle endpoints to `interview.controller.ts`. |
| `routes/analysis.routes.ts` | `/api/analysis/*` | Wires analysis endpoints to `analysis.controller.ts`. |
| `routes/providers.routes.ts` | `/api/providers/*` | Wires provider status/validation endpoints to `providers.controller.ts`. |
| `routes/settings.routes.ts` | `/api/settings/*` | Wires settings and BYOK endpoints to `settings.controller.ts`. |
| `routes/index.ts` | All route groups | Mounts route groups on the Express app. |

## Middleware Structure

| File | Responsibility | Used By |
| --- | --- | --- |
| `middlewares/error.middleware.ts` | Converts known app errors, Zod errors, and unexpected failures into consistent JSON responses. | `app.ts` final error handler |
| `middlewares/validate.middleware.ts` | Validates `body`, `query`, and `params` with Zod schemas before controller execution. | Route files |
| `middlewares/request-log.middleware.ts` | Logs method, path, status, duration, and request ID without leaking secrets. | `app.ts` global middleware |
| `middlewares/request-context.middleware.ts` | Adds request ID and per-request metadata for logs and diagnostics. | `app.ts` global middleware |
| `middlewares/auth.middleware.ts` | Local-first no-op for MVP; future cloud auth and user context boundary. | Protected route groups later |
| `middlewares/index.ts` | Re-exports shared middleware helpers. | `app.ts`, route files |

## Controller Structure

| File | Responsibility | Depends On |
| --- | --- | --- |
| `controllers/health.controller.ts` | Returns server health and readiness response shape. | Health service or lightweight checks |
| `controllers/packages.controller.ts` | Handles package list/read HTTP requests. | Package service |
| `controllers/tutors.controller.ts` | Handles tutor list/read HTTP requests. | Tutor service |
| `controllers/interview.controller.ts` | Validates interview request bodies, returns session/transcript responses. | Interview service |
| `controllers/analysis.controller.ts` | Triggers analysis, polls result state, maps failures to HTTP errors. | Analysis service |
| `controllers/providers.controller.ts` | Returns provider status and validates provider config/key requests. | Provider registry service |
| `controllers/settings.controller.ts` | Reads/updates preferences and key metadata. | Settings service |

## Service Structure

| File | Responsibility | Depends On |
| --- | --- | --- |
| `services/interview-engine.ts` | Creates sessions, tracks lifecycle, stores transcript state, and finalizes interviews. | Repositories, `@iprep/shared` |
| `services/analysis-engine.ts` | Runs post-interview analysis, chooses provider, validates output, and stores result. | Provider registry, repositories, `@iprep/shared` |
| `services/provider-registry.ts` | Builds provider config and resolves available LLM/STT/TTS/agent providers. | `@iprep/providers`, env/settings |
| `services/deepgram-agent-proxy.ts` | Bridges frontend WebSocket audio/events to Deepgram Agent for voice sessions. | `ws`, provider config |

## Repository Structure

Repositories are a **server-only** layer. They wrap `@iprep/db` query functions and add server-specific concerns that have no place in the shared DB package: filesystem transcript reads/writes, BYOK key file handling, and seeding logic tied to the server startup sequence. The CLI skips this layer and calls `@iprep/db` queries directly.

| File | Responsibility | Depends On |
| --- | --- | --- |
| `repositories/session.repository.ts` | Reads/writes sessions, transcript data, lifecycle status, and delete operations. | `@iprep/db` session queries |
| `repositories/analysis.repository.ts` | Creates analysis jobs, updates status, stores final feedback, and reads analysis results. | `@iprep/db` analysis queries |
| `repositories/package.repository.ts` | Reads and seeds interview packages on first server boot. | `@iprep/db` package queries |
| `repositories/tutor.repository.ts` | Reads and seeds tutor personas on first server boot. | `@iprep/db` tutor queries |
| `repositories/settings.repository.ts` | Reads/writes local preferences and BYOK key file under `~/.iprep/.keys`. | `@iprep/db` settings queries, local key storage |
| `repositories/index.ts` | Exports repository instances or factory helpers. | Repository modules |

## Layering Rule

**Server path (HTTP requests):**
```text
routes -> middlewares -> controllers -> services -> repositories -> @iprep/db queries -> Prisma -> SQLite
                                                        |
                                                        v
                                               provider registry -> @iprep/providers
```

**CLI path (direct DB access, no server running):**
```text
CLI command (init / doctor / status) -> @iprep/db queries -> Prisma -> SQLite
```

Routes only define paths and attach middleware/controller bindings. Middlewares handle cross-cutting request concerns. Controllers handle HTTP details. Services own business workflows. Repositories are the only server layer that should call `@iprep/db` query functions directly.

CLI commands bypass the server entirely and import `@iprep/db` directly — this is why Prisma lives in a separate shared package rather than inside `apps/server`.

## WebSocket Structure

| File | WebSocket Path | Purpose |
| --- | --- | --- |
| `ws/agent-ws.ts` | `WS /ws/agent` | Live voice interview connection. Proxies mic audio and agent events between frontend and provider. |
| `ws/analysis-ws.ts` | `WS /ws/analysis/:sessionId` | Streams analysis progress, status changes, and final result notifications to the frontend. |

## Workspace Backend Packages

| Package | Path | Backend Role |
| --- | --- | --- |
| `@iprep/shared` | `packages/shared` | Single source of truth for Zod schemas, inferred types, constants, and shared utilities. |
| `@iprep/db` | `packages/db` | Prisma schema, Prisma client setup, migrations, and query functions. |
| `@iprep/providers` | `packages/llm/providers` | Provider implementations for LLM, STT, TTS, and voice agents. |
| `@iprep/adapter-utils` | `packages/llm/adapter-utils` | Generic CLI child-process and stream utilities for Claude, Codex, Gemini, and Ollama adapters. |
| CLI adapters | `packages/llm/adapters/*` | Provider-specific wrappers for local CLI tools. Used indirectly through provider implementations. |

## Database Layer

| File / Folder | Purpose | Notes |
| --- | --- | --- |
| `packages/db/prisma/schema.prisma` | Data model | Defines users, settings, API keys, packages, tutors, sessions, and analysis records. |
| `packages/db/src/client.ts` | Prisma client | Creates/reuses the Prisma client for local SQLite. |
| `packages/db/src/migrate.ts` | Migration startup | Runs or coordinates local DB setup during app startup. |
| `packages/db/src/queries/sessions.ts` | Session queries | Create, read, update, end, and delete interview sessions. |
| `packages/db/src/queries/analysis.ts` | Analysis queries | Create analysis jobs, update status, and store final feedback. |
| `packages/db/src/queries/packages.ts` | Package queries | Read and seed interview package definitions. |
| `packages/db/src/queries/tutors.ts` | Tutor queries | Read and seed tutor personas. |
| `packages/db/src/queries/settings.ts` | Settings queries | Read and update local user preferences and key config metadata. |

## Why Two DB Layers (`packages/db` + `repositories/`)

`packages/db` and `apps/server/src/repositories/` solve different problems and are kept separate intentionally.

| | `packages/db/src/queries/` | `apps/server/src/repositories/` |
|---|---|---|
| **What it is** | Raw Prisma operations — `create`, `findById`, `findMany`, `update`, `delete` — one function per DB action. | Server-specific business wrappers that call those query functions and add filesystem I/O, seeding logic, and server-shaped return types. |
| **Who uses it** | Both `apps/server` (via repositories) and `apps/cli` (directly). | Only `apps/server` services. CLI never uses these. |
| **Why it lives here** | Must be shared — CLI runs migrations and reads data before the server starts. Putting Prisma inside `apps/server` would force CLI to depend on the server package. | Belongs in the server — these concerns (HTTP-shaped errors, server boot seeding, key file paths) are not relevant to the CLI. |
| **Example** | `sessions.ts → createSession(data)` writes a row and returns the raw Prisma record. | `session.repository.ts → startSession(input)` calls `createSession`, writes the transcript file to `~/.iprep/sessions/`, and returns a shaped `SessionDTO`. |

**Rule:** `packages/db` knows nothing about the server. Server repositories know nothing about Prisma — they only call named query functions from `@iprep/db`.

## Provider Layer

| Provider Area | Files | Backend Use |
| --- | --- | --- |
| Registry | `packages/llm/providers/src/registry.ts` | Resolves the first available provider for analysis, STT, TTS, or agent workflows. |
| Shared provider types | `packages/llm/providers/src/types.ts` | Defines provider interfaces and capability contracts. |
| Claude | `src/claude/*` | Claude API and Claude CLI analysis providers. |
| Gemini | `src/gemini/*` | Gemini free/API/CLI analysis providers. |
| Codex | `src/codex/*` | Codex CLI analysis provider. |
| Ollama | `src/ollama/*` | Local LLM provider through Ollama. |
| OpenAI | `src/openai/*` | OpenAI LLM, Whisper STT, and TTS providers. |
| Deepgram | `src/deepgram/*` | Deepgram STT, TTS, and all-in-one voice agent provider. |

## Request Flow

| Step | Layer | What Happens |
| --- | --- | --- |
| 1 | Frontend or CLI | Sends an HTTP request or opens a WebSocket connection. |
| 2 | Express route / WS handler | Matches the URL and applies route-level middleware or WebSocket workflow. |
| 3 | Middleware | Adds request context, logs request metadata, validates input, or checks auth where needed. |
| 4 | Controller | Reads validated HTTP input, calls a service, and maps service results to responses. |
| 5 | Service | Runs business logic such as starting a session or triggering analysis. |
| 6 | Repository | Persists or reads local data through `@iprep/db` query functions or approved local storage helpers. |
| 7 | Provider package | Calls an external API, local CLI, or local provider when needed. |
| 8 | Service | Normalizes provider output into shared result shapes. |
| 9 | Controller / WS handler | Returns JSON or streams progress/events back to the client. |

## Initial MVP API Surface

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/health` | Server health and basic readiness. |
| `GET` | `/api/packages` | List interview packages. |
| `GET` | `/api/tutors` | List tutor personas. |
| `POST` | `/api/interview/start` | Start an interview session. |
| `GET` | `/api/interview/:id` | Get session details. |
| `POST` | `/api/interview/:id/end` | End a session and prepare analysis. |
| `GET` | `/api/interview/:id/transcript` | Fetch transcript for a session. |
| `DELETE` | `/api/interview/:id` | Delete a local session. |
| `POST` | `/api/analysis/:sessionId` | Trigger analysis for a completed session. |
| `GET` | `/api/analysis/:sessionId` | Fetch analysis result/status. |
| `GET` | `/api/providers/status` | Show configured keys, installed CLIs, and provider availability. |
| `POST` | `/api/providers/validate` | Validate an API key or provider config. |
| `GET` | `/api/settings` | Read local settings. |
| `PATCH` | `/api/settings` | Update local settings. |
| `POST` | `/api/settings/keys` | Save or update BYOK provider key metadata. |
| `WS` | `/ws/agent` | Live voice agent session. |
| `WS` | `/ws/analysis/:sessionId` | Analysis status streaming. |

## Design Rules

| Rule | Description |
| --- | --- |
| Keep routes thin | Routes should only define paths, middleware, and controller bindings. |
| Keep middleware reusable | Middleware should handle cross-cutting request work only, not feature business logic. |
| Keep controllers HTTP-focused | Controllers validate request input, call services, and map results/errors to HTTP responses. |
| Keep services business-focused | Services own workflows and provider orchestration, but should not directly manage HTTP details. |
| Keep DB access centralized | Repositories should be the only backend layer using `@iprep/db` query functions or local persistence helpers directly. |
| Use shared schemas | Request bodies and provider output should be validated with `@iprep/shared` schemas. |
| Keep secrets server-side | Browser code should never receive provider API keys. |
| Provider-agnostic core | Backend services should call the provider registry, not hardcode Deepgram/OpenAI/Claude directly. |
| Local-first storage | Phase 1 persists to local SQLite and local filesystem paths under the iPrep home directory. |
| Cloud-compatible shape | Avoid local-only assumptions in API contracts so the same backend can later run as a hosted cloud service. |

## Build Order

| Order | Backend Work | Done When |
| --- | --- | --- |
| 1 | Server app baseline | `GET /health` works. |
| 2 | Shared validation in routes | Invalid requests return clear validation errors. |
| 3 | Package and tutor read endpoints | Frontend can load interview options. |
| 4 | Prisma schema and DB queries | Sessions and analysis records can be created/read. |
| 5 | Interview lifecycle service | Session start/end/transcript flow works through HTTP. |
| 6 | One analysis provider | Transcript can produce a structured analysis result. |
| 7 | Provider status endpoint | Settings page and CLI can show available providers. |
| 8 | WebSocket voice bridge | Live interview session can stream audio/events. |
