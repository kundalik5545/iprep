# Task 07 - Status And Sessions

**Phase:** api-commands  
**Priority:** 🟢 Medium (useful once server and diagnostics are in place)  
**Estimated Tokens:** ~4,500  
**Depends On:** Tasks 04, 06  
**Ref:** [CLI-PLAN.md](../../cli-docs/CLI-PLAN.md) §Expected User Outcomes; [PLAN.md](../../architecture/PLAN.md) §Phase 5

---

## Objective

Implement `iprep status` and `iprep sessions` so users can quickly understand local readiness and find recent session IDs from the terminal. These commands should prefer the backend API when available and degrade gracefully when it is offline.

---

## Deliverables

### 1. `status.ts` - `iprep status`

**Path:** `apps/cli/src/commands/status.ts`  
**Est. tokens:** ~1,600

- Add `--json` and optional `--verbose` flags.
- Show server health, configured port, DB status, configured keys, and provider/CLI availability summary.
- Reuse `api.ts` and `process.ts` helpers instead of duplicating checks.
- Prefer backend `/api/providers/status` when available; fall back to local detection if not.
- Include a single readiness verdict such as `ready`, `needs setup`, or `server offline`.

### 2. `sessions.ts` - `iprep sessions`

**Path:** `apps/cli/src/commands/sessions.ts`  
**Est. tokens:** ~1,500

- Add options: `--limit <number>`, `--json`, and optional status filter.
- Fetch recent sessions from the local backend once the route exists.
- Render session ID, package, tutor, mode, status, duration, and analysis state.
- Handle no sessions with a concise empty state and next step.
- Surface backend offline errors without stack traces by default.

### 3. API Helper Coverage

**Path:** `apps/cli/src/utils/api.ts`  
**Est. tokens:** ~700

- Add typed response shapes for health, provider status, sessions, and generic API errors.
- Add query-string support for session limit/filter.
- Normalize non-2xx responses.

### 4. Modifications to Existing Files

**Est. tokens:** ~700

| File | Change | Tokens |
| ---- | ------ | ------ |
| `apps/cli/src/utils/table.ts` | Add compact table presets for session rows | ~300 |
| `apps/cli/README.md` | Document status and sessions commands | ~400 |

---

## Acceptance Criteria

- [ ] `iprep status` works when the server is offline and says so clearly.
- [ ] `iprep status --json` includes server, local, providers, and verdict fields.
- [ ] `iprep sessions --limit 5` requests and renders at most five sessions.
- [ ] Empty sessions output gives a useful next action.
- [ ] Backend API errors do not leak raw stack traces by default.
- [ ] Table and JSON outputs expose the same core session fields.

---

## Files Changed

| Action | File |
| ------ | ---- |
| MODIFY | `apps/cli/src/commands/status.ts` |
| MODIFY | `apps/cli/src/commands/sessions.ts` |
| MODIFY | `apps/cli/src/utils/api.ts` |
| MODIFY | `apps/cli/src/utils/table.ts` |
| MODIFY | `apps/cli/README.md` |

**Total files:** 0 created, 5 modified
