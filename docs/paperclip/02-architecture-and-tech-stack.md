# iPrep Product Architecture And Tech Stack

## Purpose

iPrep is the company and product. iPrep wants to build a local-first AI interview preparation platform that can be installed from npm, started from a CLI, opened in the browser, and used to practice interviews with AI tutors.

This document is architecture context for Paperclip. Paperclip should use it to understand the intended product direction, API surface, project structure, and technology choices. Paperclip should not start implementation until the founder shares and confirms the architecture details they already have in mind.

## Architecture Direction

iPrep should be a local-first TypeScript monorepo. The product should ship as an npm package, run a local Express server, serve a React browser UI, store user data locally, and connect to AI providers through a provider registry.

The architecture should optimize for:

- Local privacy for sessions, transcripts, uploaded files, and provider keys.
- Low operating cost through BYOK, free tiers, local CLIs, and local models.
- Simple install and startup through `npm install -g iprep` and `iprep start`.
- Shared contracts between frontend, backend, CLI, database, and providers.
- A clear upgrade path from local prototype to paid Pro and Cloud tiers.

## iPrep Project Architecture Tree

```text
iprep/
  package.json
  pnpm-workspace.yaml
  tsconfig.base.json
  eslint.config.mjs
  .prettierrc
  .prettierignore
  .env.example

  apps/
    cli/
      package.json
      bin/
        iprep.js
      src/
        index.ts
        commands/
          init.ts
          start.ts
          doctor.ts
          setup.ts
          status.ts
          sessions.ts
          analyze.ts
          export.ts
          keys.ts
        utils/
          display.ts
          spinner.ts
          prompts.ts
          home-dir.ts

    frontend/
      package.json
      index.html
      vite.config.ts
      src/
        main.tsx
        App.tsx
        pages/
          Dashboard.tsx
          InterviewNew.tsx
          InterviewSession.tsx
          InterviewAnalysis.tsx
          History.tsx
          Files.tsx
          Communication.tsx
          Chat.tsx
          Settings.tsx
        components/
        hooks/
        stores/
        context/
        lib/
          api.ts
          ws.ts

    server/
      package.json
      src/
        index.ts
        app.ts
        routes/
          health.ts
          packages.ts
          tutors.ts
          interview.ts
          analysis.ts
          stats.ts
          providers.ts
          settings.ts
          chat.ts
        services/
          interview-engine.ts
          analysis-engine.ts
          provider-registry.ts
          deepgram-agent-proxy.ts
        ws/
          agent-ws.ts
          analysis-ws.ts
        utils/
          env.ts
          logger.ts

  packages/
    shared/
      package.json
      src/
        constants/
        schemas/
          session.schema.ts
          analysis.schema.ts
          provider.schema.ts
          env.schema.ts
        types/
        utils/

    db/
      package.json
      prisma/
        schema.prisma
      src/
        client.ts
        migrate.ts
        queries/
          sessions.ts
          analysis.ts
          packages.ts
          tutors.ts
          settings.ts

    llm/
      adapter-utils/
        package.json
        src/
          process-spawner.ts
          session-manager.ts
          response-parser.ts
          stream-reader.ts
          error-handler.ts

      adapters/
        claude-local/
        codex/
        gemini/

      providers/
        package.json
        src/
          registry.ts
          types.ts
          claude/
          codex/
          deepgram/
          gemini/
          ollama/
          openai/

  docs/
    architecture/
    demo-app/
    demo-docs/
      postman/
        iprep-demo-api.postman_collection.json
    paperclip/
```

## Application Responsibilities

| Area                         | Responsibility                                                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `apps/cli`                   | User entry point for install, setup, health checks, starting the local server, exports, and key management.                    |
| `apps/frontend`              | Browser UI for dashboard, interview setup, live session, analysis, history, files, communication insights, chat, and settings. |
| `apps/server`                | Local HTTP API, WebSocket server, provider orchestration, session lifecycle, analysis workflow, and static frontend serving.   |
| `packages/shared`            | Zod schemas, TypeScript types, constants, and reusable utilities shared by every layer.                                        |
| `packages/db`                | Prisma schema, SQLite local persistence, migrations, and query functions.                                                      |
| `packages/llm/adapter-utils` | Generic child-process lifecycle for local AI CLI tools.                                                                        |
| `packages/llm/adapters`      | CLI-specific adapters for Claude, Codex, and Gemini.                                                                           |
| `packages/llm/providers`     | Provider registry and implementations for LLM, STT, TTS, and all-in-one voice agent providers.                                 |
| `docs/demo-app`              | Zero-build HTML/CSS/JS prototype used as a design and UX reference.                                                            |
| `docs/demo-docs/postman`     | API collection for local prototype route testing.                                                                              |

## Recommended Tech Stack

| Layer              | Technology                                  | Purpose                                                                                                |
| ------------------ | ------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Runtime            | Node.js 20+                                 | Runs CLI, local server, scripts, adapters, and build tooling.                                          |
| Package manager    | pnpm 9+                                     | Workspace package management and fast monorepo installs.                                               |
| Language           | TypeScript strict mode                      | Type-safe contracts across frontend, server, CLI, DB, and providers.                                   |
| Monorepo           | pnpm workspaces                             | Keeps apps and packages isolated but linked.                                                           |
| Frontend build     | Vite                                        | Fast React dev server and production build.                                                            |
| Frontend UI        | React 18                                    | Component-based browser application.                                                                   |
| Routing            | React Router DOM                            | SPA routing between app views.                                                                         |
| Client state       | Zustand                                     | Lightweight state for session, provider, settings, and UI state.                                       |
| Styling            | Tailwind CSS                                | Utility-first styling for the real React app.                                                          |
| UI system          | shadcn/ui                                   | Practical component baseline for app surfaces.                                                         |
| CSS pipeline       | PostCSS + Autoprefixer                      | Tailwind processing and browser compatibility.                                                         |
| Backend            | Express                                     | Local REST API and frontend static serving.                                                            |
| Realtime           | `ws`                                        | WebSocket transport for voice agent and analysis progress.                                             |
| CORS               | `cors`                                      | Allows local frontend dev server to call the local API.                                                |
| Validation         | Zod                                         | Runtime validation for request bodies, settings, env, and provider responses.                          |
| Database ORM       | Prisma                                      | Schema and query layer for local and future cloud database. With latest prisma 7 changes keep in mind. |
| Local database     | SQLite via `better-sqlite3`                 | Local persistence without managed infrastructure.                                                      |
| Prisma adapter     | `@prisma/adapter-better-sqlite3`            | Prisma 7 SQLite adapter integration.                                                                   |
| CLI framework      | Commander                                   | Defines `iprep` commands and options.                                                                  |
| CLI prompts        | Inquirer                                    | Interactive setup and key configuration.                                                               |
| CLI colors         | Chalk                                       | Readable terminal output.                                                                              |
| CLI spinners       | Ora                                         | Progress indicators for setup, doctor checks, and startup.                                             |
| Browser open       | `open`                                      | Opens local app URL from the CLI.                                                                      |
| Logging            | Winston                                     | Structured server and CLI logging.                                                                     |
| Dev runner         | tsx                                         | Runs TypeScript directly in development.                                                               |
| Type checking      | TypeScript compiler                         | Build and `typecheck` validation.                                                                      |
| Linting            | ESLint                                      | Code quality and rule enforcement.                                                                     |
| TS lint plugins    | `@typescript-eslint/*`, `typescript-eslint` | TypeScript-aware linting.                                                                              |
| ESLint base config | `@eslint/js`                                | Base JavaScript lint rules.                                                                            |
| Formatter          | Prettier                                    | Consistent formatting across the repo.                                                                 |
| Lint-format bridge | `eslint-config-prettier`                    | Prevents ESLint and Prettier rule conflicts.                                                           |
| Type definitions   | `@types/*` packages                         | Type support for Node, React, Express, CORS, WS, and SQLite libraries.                                 |

## Core Runtime Flow

1. User installs iPrep from npm.
2. CLI creates local `~/.iprep` folders and default settings.
3. CLI runs `iprep doctor` to check Node, DB, provider keys, and installed AI CLIs.
4. CLI starts the local Express server.
5. Server runs migrations and seeds packages/tutors if needed.
6. Server serves the built React frontend.
7. Frontend calls local `/api/v1` REST APIs and WebSocket endpoints.
8. Interview session stores metadata, transcript, and provider information locally.
9. Analysis engine selects the cheapest available provider.
10. Provider output is validated with shared Zod schemas.
11. Analysis result is stored in SQLite and shown in the UI.

## API Surface From Postman Collection

Source reference: `docs/demo-docs/postman/iprep-demo-api.postman_collection.json`.

Default variables:

| Variable         | Value                   |
| ---------------- | ----------------------- |
| `baseUrl`        | `http://localhost:3000` |
| `apiPrefix`      | `api/v1`                |
| `packageId`      | `behavioral`            |
| `tutorId`        | `priya`                 |
| `sessionId`      | `sess_001`              |
| `analysisId`     | `anal_001`              |
| `conversationId` | `conv_001`              |
| `provider`       | `deepgram`              |

### Health

| Method | Endpoint  | Purpose                       |
| ------ | --------- | ----------------------------- |
| GET    | `/health` | Check local server readiness. |

### Packages

| Method | Endpoint                      | Purpose                        |
| ------ | ----------------------------- | ------------------------------ |
| GET    | `/api/v1/packages`            | List interview packages.       |
| GET    | `/api/v1/packages/:packageId` | Get one package by ID or slug. |

### Tutors

| Method | Endpoint                  | Purpose                      |
| ------ | ------------------------- | ---------------------------- |
| GET    | `/api/v1/tutors`          | List tutor personas.         |
| GET    | `/api/v1/tutors/:tutorId` | Get one tutor by ID or slug. |

### Interview

| Method | Endpoint                                  | Purpose                                                  |
| ------ | ----------------------------------------- | -------------------------------------------------------- |
| GET    | `/api/v1/interview`                       | List interview sessions for dashboard/history.           |
| POST   | `/api/v1/interview`                       | Start a new interview session using the RESTful v1 path. |
| POST   | `/api/v1/interview/start`                 | Legacy start path kept for architecture compatibility.   |
| GET    | `/api/v1/interview/:sessionId`            | Get interview session details.                           |
| POST   | `/api/v1/interview/:sessionId/end`        | End an active session and optionally trigger analysis.   |
| GET    | `/api/v1/interview/:sessionId/transcript` | Get the full session transcript.                         |
| DELETE | `/api/v1/interview/:sessionId`            | Delete a local session.                                  |

### Analysis

| Method | Endpoint                             | Purpose                                               |
| ------ | ------------------------------------ | ----------------------------------------------------- |
| POST   | `/api/v1/analysis/:sessionId`        | Trigger analysis for a completed session.             |
| GET    | `/api/v1/analysis/:sessionId`        | Fetch analysis result or status by session ID.        |
| GET    | `/api/v1/analysis/by-id/:analysisId` | Demo alias for analysis records keyed by analysis ID. |

### Stats

| Method | Endpoint        | Purpose                                                        |
| ------ | --------------- | -------------------------------------------------------------- |
| GET    | `/api/v1/stats` | Get dashboard stats such as totals, average score, and streak. |

### Providers

| Method | Endpoint                     | Purpose                                                          |
| ------ | ---------------------------- | ---------------------------------------------------------------- |
| GET    | `/api/v1/providers/status`   | Show configured keys, installed CLIs, and provider availability. |
| POST   | `/api/v1/providers/validate` | Validate an API key or local provider configuration.             |

### Settings

| Method | Endpoint                          | Purpose                                                                          |
| ------ | --------------------------------- | -------------------------------------------------------------------------------- |
| GET    | `/api/v1/settings`                | Read local user settings.                                                        |
| PATCH  | `/api/v1/settings`                | Update preferences such as tutor, package, voice mode, theme, and auto-analysis. |
| POST   | `/api/v1/settings/keys`           | Save BYOK provider key metadata.                                                 |
| DELETE | `/api/v1/settings/keys/:provider` | Remove a saved provider key.                                                     |

### Chat Conversations

| Method | Endpoint                                              | Purpose                                     |
| ------ | ----------------------------------------------------- | ------------------------------------------- |
| GET    | `/api/v1/chat/conversations`                          | List AI chat conversations.                 |
| POST   | `/api/v1/chat/conversations`                          | Create a chat conversation.                 |
| GET    | `/api/v1/chat/conversations/:conversationId`          | Get one chat conversation.                  |
| POST   | `/api/v1/chat/conversations/:conversationId/messages` | Add a user or AI message to a conversation. |

### WebSocket Routes

These are architecture routes and are not represented as normal Postman REST requests:

| Method | Endpoint                  | Purpose                                                         |
| ------ | ------------------------- | --------------------------------------------------------------- |
| WS     | `/ws/agent`               | Live voice interview bridge to the active voice agent provider. |
| WS     | `/ws/analysis/:sessionId` | Optional streaming analysis progress endpoint.                  |

## Provider Strategy

iPrep should always try the cheapest and most user-controlled provider first:

1. Gemini free tier.
2. Gemini API BYOK.
3. Claude CLI.
4. Gemini CLI.
5. Codex CLI.
6. Ollama local.
7. Claude API BYOK.
8. OpenAI API BYOK.

This keeps iPrep usable before the company has meaningful paid revenue and reduces the risk of platform-owned AI costs.

## Local Data Strategy

iPrep should store all user-owned local state under `~/.iprep`. The CLI is responsible for creating this structure through `iprep init`, validating it through `iprep doctor`, and updating it through `iprep setup`, `iprep keys`, `iprep export`, and future backup commands.

Use this merged local home structure:

```text
~/.iprep/
  config.json
  keys.json
  sessions.json

  db/
    iprep.db

  logs/
    cli.log
    server.log

  skills/
    <skill-id>/

  docs/
    <document-id>/

  interview-data/
    <session-id>/
      recordings/
      transcripts/
      analysis/
      metadata.json

  exports/
    <session-id>.md

  backups/
    iprep-backup-YYYY-MM-DD.zip
```

### Local File Responsibilities

| Path | Owner | Purpose |
| --- | --- | --- |
| `config.json` | CLI/setup | Default tutor, default package, mode, server port, theme, and local preferences. |
| `keys.json` | CLI/setup/keys | BYOK key metadata or encrypted key storage for Deepgram, Gemini, Anthropic, OpenAI, and future providers. |
| `sessions.json` | Adapter layer | Optional session mapping for Claude/Gemini/Codex CLI continuity. |
| `db/iprep.db` | DB package/server | Local SQLite database for structured app state such as sessions, packages, tutors, settings, and analysis records. |
| `logs/cli.log` | CLI | Troubleshooting log for setup, doctor, provider checks, and startup. |
| `logs/server.log` | Server | Local backend logs for API, WebSocket, provider, and DB behavior. |
| `skills/<skill-id>/` | Product/provider layer | AI skill packs used by tutors, providers, or future customized interview flows. |
| `docs/<document-id>/` | UI/server/CLI | User-uploaded resumes, JDs, notes, and documents used as interview context. |
| `interview-data/<session-id>/recordings/` | Server/voice layer | Audio recordings captured during a voice session, when enabled. |
| `interview-data/<session-id>/transcripts/` | Server/interview engine | Raw and cleaned transcript files for future analysis, export, and review. |
| `interview-data/<session-id>/analysis/` | Analysis engine | Generated feedback snapshots, provider outputs, scores, and report artifacts. |
| `interview-data/<session-id>/metadata.json` | Interview engine | Session package, tutor, provider, timing, mode, and status metadata. |
| `exports/<session-id>.md` | CLI/export | Markdown export generated by `iprep export`; PDF can be added later. |
| `backups/iprep-backup-YYYY-MM-DD.zip` | Future CLI backup | Portable backup archive for local user data. |

### Local Data Rules

- Never expose provider keys to browser code.
- Keep transcripts, uploaded docs, recordings, and exports local by default.
- Store queryable structured data in SQLite through Prisma.
- Store large or file-native artifacts on disk, then reference them from SQLite by path or ID.
- Keep `config.json`, `keys.json`, and `sessions.json` small and purpose-specific.
- Do not store raw provider secrets in plain text unless the user explicitly chooses an insecure local-only mode.
- `iprep init` must be safe to rerun and should not delete existing user data.
- `iprep doctor` should validate required folders, DB readiness, write permissions, provider keys, and local CLI availability.
- Use `@iprep/shared` schemas before writing provider output to DB.
- Let the CLI access `@iprep/db` directly for `doctor`, `status`, and local data commands.
- Let server services own HTTP, WebSocket, provider orchestration, and frontend serving.
- Do not include any `~/.iprep` user data in npm packages, git commits, test fixtures, or support bundles unless explicitly redacted.

## Build And npm Publishing

The npm package should include:

- `iprep` CLI entry point.
- Built server runtime.
- Built frontend assets served by Express.
- Shared runtime code.
- DB package runtime code.
- Provider and adapter package runtime code.
- Prisma schema and migration support.

The npm package should exclude:

- Local `.env` files.
- User-generated `~/.iprep` data.
- Test-only fixtures.
- Internal docs that are not needed by the published package.
- Raw source files if compiled output is enough for runtime.

Prototype publish checklist:

```text
pnpm install
pnpm -r run build
npm pack
npm install -g ./iprep-*.tgz
iprep init
iprep doctor
iprep start
```

## Architecture Risks

| Risk                            | Mitigation                                                                              |
| ------------------------------- | --------------------------------------------------------------------------------------- |
| Provider APIs become expensive  | BYOK, free tier, CLI tools, and Ollama fallback.                                        |
| Local install becomes brittle   | Invest early in `iprep doctor`, clear setup prompts, and actionable errors.             |
| UI and backend contracts drift  | Keep schemas and types in `@iprep/shared`.                                              |
| Voice flow becomes too complex  | Use Deepgram Voice Agent first, then add custom STT/TTS orchestration later.            |
| npm package becomes too large   | Audit package contents before publish.                                                  |
| Secrets leak to frontend        | Keep keys server-side and validate all key operations through settings/provider routes. |
| Cloud tier adds security burden | Keep Phase 1 local-only, add auth and cloud storage later.                              |

## Build Order

Follow the existing architecture plan:

1. Confirm monorepo install and build baseline.
2. Implement adapter utilities.
3. Implement one CLI adapter.
4. Implement CLI commands.
5. Implement database persistence.
6. Implement backend vertical slice.
7. Implement one analysis provider.
8. Implement frontend against real APIs.
9. Wire build pipeline and npm publish.
10. Add billing, exports, polish, and cloud path.
