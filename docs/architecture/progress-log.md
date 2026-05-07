# iPrep Progress Log

> Last updated: 2026-05-06
> Format: Main component progress table.

---

## Component Progress

| Component | Path | Current Status | Progress | What Is Done | Pending Work | Next Step |
| --- | --- | --- | --- | --- | --- | --- |
| Monorepo root | `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json` | Scaffolded | 70% | Workspace structure, root scripts, TypeScript base config, Prettier, ESLint, AGPL license, app/package folders. | Dependency install and workspace build verification. | Run `pnpm install`, then validate `pnpm -r run build` / typecheck baseline. |
| Documentation | `docs/architecture`, `docs/project-rules`, `docs/knowledge` | Strong | 80% | Architecture, implementation plan, shared package analysis, rules, and project guidance are documented. | Some status tables are older than the current repo shape. | Keep this progress table updated as implementation changes. |
| Shared package | `packages/shared` | Mostly implemented | 75% | Zod schemas, shared types, constants, and formatting utilities exist. | HTTP status constants, role constants, message limits, path helpers, logger/validation utilities. | Finish shared constants and lightweight validation helpers. |
| LLM adapter utils | `packages/llm/adapter-utils` | Scaffolded | 20% | Package structure and files exist for process spawning, parsing, streams, sessions, and errors. | Actual `ProcessSpawner`, stream reader, parser, session manager, and typed error logic. | Implement generic CLI process lifecycle first. |
| CLI adapters | `packages/llm/adapters/*` | Scaffolded | 20% | Claude, Gemini, and Codex adapter folders/files exist. | Provider-specific spawners, parsers, prompt builders, auth errors, and session continuity. | Build one working adapter, preferably Claude CLI or Gemini CLI. |
| LLM providers | `packages/llm/providers` | Scaffolded | 25% | Provider files exist for Claude, Gemini, Codex, Ollama, OpenAI, and Deepgram. | Provider implementations, availability checks, fallback registry, structured analysis output. | Implement one working analysis provider and wire `ProviderRegistry`. |
| Database package | `packages/db` | Scaffolded | 20% | Prisma folder, package config, client/query file layout exists. | Prisma schema models, migrations, Prisma generate, query functions for sessions, analysis, packages, tutors, settings. | Finalize Prisma schema and basic session persistence. |
| Backend app | `apps/server` | Scaffolded | 20% | Route, service, WebSocket, env, and logger file layout exists. | Express app wiring, middleware, REST routes, WebSocket handlers, interview engine, analysis engine, provider registry service. | Implement `/health`, packages/tutors endpoints, then session lifecycle routes. |
| Frontend app | `apps/frontend` | Scaffolded | 20% | Vite/React app layout, pages, components, hooks, stores, context, and lib files exist. | Actual React routes, screens, stores, API client behavior, voice session UI, settings, analysis dashboard. | Build after backend endpoints are available; start with package/tutor selection flow. |
| CLI app | `apps/cli` | Scaffolded | 20% | CLI package, bin entry, command files, and utility files exist. | Command implementation for `init`, `doctor`, `setup`, `status`, `start`, `sessions`, `analyze`, `export`, and `keys`. | Implement `iprep doctor` and `iprep init` after shared paths are finalized. |
| Voice/agent flow | `apps/server/src/ws`, `apps/frontend/src/hooks` | Planned/scaffolded | 15% | WebSocket and Deepgram/OpenAI voice architecture is documented; hook and WS files exist. | Working audio bridge, mic handling, realtime events, transcript capture, session storage. | Defer until backend session and provider foundations are working. |
| Build and release | root scripts, app/package scripts | Planned | 10% | Root build/dev/test/lint scripts are declared. | Dependency install verification, package builds, frontend static serving, npm packaging, release checklist. | Establish a clean local build baseline. |

## Overall Progress

| Area | Status |
| --- | --- |
| Architecture direction | Complete enough for MVP implementation |
| Repository structure | In place |
| Shared contracts | Mostly ready |
| Executable product flow | Not ready yet |
| Main blocker | Core logic is still pending across adapters, database, backend, frontend, and CLI |
| Next milestone | Build one thin vertical slice: start server, load package/tutor data, start session, accept transcript, run one analysis provider, store and return result |

## Priority Order

| Priority | Workstream | Reason |
| --- | --- | --- |
| 1 | Workspace install/build baseline | Confirms the monorepo is technically healthy before deeper work. |
| 2 | Shared package gaps | Other layers depend on constants, paths, schemas, and validation. |
| 3 | Adapter utils | CLI/provider integrations need reliable process spawning and parsing. |
| 4 | One analysis provider | Proves the most important backend value path. |
| 5 | Database persistence | Sessions and analysis need durable local storage. |
| 6 | Backend vertical slice | Gives frontend and CLI a real API to use. |
| 7 | Frontend and CLI UX | Builds on stable backend and shared contracts. |
