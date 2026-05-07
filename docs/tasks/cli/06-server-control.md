# Task 06 - Server Control

**Phase:** launch  
**Priority:** 🟡 High (daily launch flow depends on a reliable local server start)  
**Estimated Tokens:** ~5,900  
**Depends On:** Tasks 03-04  
**Ref:** [CLI-PLAN.md](../../cli-docs/CLI-PLAN.md) §Command Behavior Plan, §CLI and Backend Relationship; [PLAN.md](../../architecture/PLAN.md) §Phase 9

---

## Objective

Implement `iprep start` and the local API helper needed to launch the Express backend, wait for `/health`, and open the local web app. This should support development and packaged execution paths as the build pipeline matures.

---

## Deliverables

### 1. `api.ts` - Local Backend HTTP Client

**Path:** `apps/cli/src/utils/api.ts`  
**Est. tokens:** ~1,500

- Implement a typed `requestLocalApi()` helper using Node 20 `fetch`.
- Add `getHealth()`, `getProviderStatus()`, `getSessions()`, `triggerAnalysis()`, and `getAnalysis()` stubs or wrappers needed by later commands.
- Support configurable port from `~/.iprep/config.json` and CLI options.
- Normalize connection refused and timeout errors into friendly CLI errors.

### 2. `start.ts` - `iprep start`

**Path:** `apps/cli/src/commands/start.ts`  
**Est. tokens:** ~2,000

- Add options: `--port <number>`, `--no-open`, `--dev`, and `--json`.
- If the server is already healthy, reuse it and print the URL.
- Otherwise spawn the local server process using the appropriate package command or built `dist/index.js`.
- Wait for `/health` with timeout and spinner feedback.
- Open the web app URL with `open` unless `--no-open` is set.

### 3. Server Start Integration Notes

**Path:** `apps/cli/src/utils/process.ts`, `apps/cli/package.json`  
**Est. tokens:** ~1,100

- Add a helper for spawning long-lived server processes with inherited or log-file output.
- Respect the local `~/.iprep/logs/server.log` path for captured output where practical.
- Keep dev-mode support compatible with `pnpm --filter @iprep/server dev`.
- Ensure package scripts support compiled CLI execution.

### 4. Modifications to Existing Files

**Est. tokens:** ~1,300

| File | Change | Tokens |
| ---- | ------ | ------ |
| `apps/cli/src/commands/status.ts` | Reuse API health helper | ~300 |
| `apps/cli/src/commands/doctor.ts` | Reuse API health helper | ~300 |
| `apps/cli/src/utils/home-dir.ts` | Read configured default port | ~300 |
| `apps/cli/README.md` | Document start options and development behavior | ~400 |

---

## Acceptance Criteria

- [ ] `iprep start --no-open` starts or reuses a healthy local backend.
- [ ] `iprep start --port 3000` waits for `http://localhost:3000/health`.
- [ ] Server startup failures include the log path or next debug step.
- [ ] `--json` output is parseable and contains server URL plus health status.
- [ ] Existing healthy server detection avoids spawning a duplicate process.
- [ ] Browser opening is skipped reliably when `--no-open` is used.

---

## Files Changed

| Action | File |
| ------ | ---- |
| CREATE | `apps/cli/src/utils/api.ts` |
| MODIFY | `apps/cli/src/commands/start.ts` |
| MODIFY | `apps/cli/src/utils/process.ts` |
| MODIFY | `apps/cli/package.json` |
| MODIFY | `apps/cli/src/commands/status.ts` |
| MODIFY | `apps/cli/src/commands/doctor.ts` |
| MODIFY | `apps/cli/src/utils/home-dir.ts` |
| MODIFY | `apps/cli/README.md` |

**Total files:** 1 created, 7 modified
