# Task 08 - Analysis And Export

**Phase:** analysis-export  
**Priority:** 🟢 Medium (extends terminal workflows after core setup and server APIs work)  
**Estimated Tokens:** ~5,100  
**Depends On:** Tasks 06-07  
**Ref:** [CLI-PLAN.md](../../cli-docs/CLI-PLAN.md) §Command Behavior Plan; [PLAN.md](../../architecture/PLAN.md) §Phase 10

---

## Objective

Implement terminal analysis and export workflows so users can trigger analysis for a completed interview and create Markdown exports from local session data. PDF support can be planned behind the same interface but should not block Markdown.

---

## Deliverables

### 1. `analyze.ts` - `iprep analyze <sessionId>`

**Path:** `apps/cli/src/commands/analyze.ts`  
**Est. tokens:** ~1,600

- Add options: `--provider <provider>`, `--rerun`, and `--json`.
- Validate that a session ID was provided and pass it to the backend analysis API.
- Show progress or polling status until analysis completes when the backend supports it.
- Print a compact result summary with provider, overall score, strengths count, and improvement count.
- Handle pending, running, completed, and failed analysis states.

### 2. `export.ts` - `iprep export <sessionId>`

**Path:** `apps/cli/src/commands/export.ts`  
**Est. tokens:** ~1,700

- Add options: `--format md`, `--output <path>`, and `--json`; reserve `pdf` as future or experimental if unsupported.
- Fetch session transcript and analysis from the local backend API.
- Render Markdown containing metadata, transcript, scores, strengths, improvements, answer feedback, and report.
- Default output to `~/.iprep/exports/<sessionId>.md`.
- Refuse to overwrite an existing file unless an explicit overwrite option is added.

### 3. API And Home Helpers

**Path:** `apps/cli/src/utils/api.ts`, `apps/cli/src/utils/home-dir.ts`  
**Est. tokens:** ~900

- Add API helpers for `POST /api/analysis/:sessionId`, `GET /api/analysis/:sessionId`, `GET /api/interview/:id`, and transcript retrieval.
- Add an export path resolver that creates the exports folder if needed.
- Normalize missing session, missing analysis, and unsupported format errors.

### 4. Modifications to Existing Files

**Est. tokens:** ~900

| File | Change | Tokens |
| ---- | ------ | ------ |
| `apps/cli/src/commands/sessions.ts` | Include analysis state in session tables for discoverability | ~300 |
| `apps/cli/src/utils/display.ts` | Add export success formatting | ~200 |
| `apps/cli/README.md` | Document analyze and export workflows | ~400 |

---

## Acceptance Criteria

- [ ] `iprep analyze <sessionId>` calls the backend analysis endpoint with the provided session ID.
- [ ] Completed analysis output includes provider and score summary.
- [ ] Failed or missing sessions produce a clear non-zero CLI error.
- [ ] `iprep export <sessionId> --format md` writes a Markdown file under `~/.iprep/exports` by default.
- [ ] Export refuses unsupported formats with a clear message.
- [ ] Markdown exports include transcript and analysis sections when available.

---

## Files Changed

| Action | File |
| ------ | ---- |
| MODIFY | `apps/cli/src/commands/analyze.ts` |
| MODIFY | `apps/cli/src/commands/export.ts` |
| MODIFY | `apps/cli/src/utils/api.ts` |
| MODIFY | `apps/cli/src/utils/home-dir.ts` |
| MODIFY | `apps/cli/src/commands/sessions.ts` |
| MODIFY | `apps/cli/src/utils/display.ts` |
| MODIFY | `apps/cli/README.md` |

**Total files:** 0 created, 7 modified
