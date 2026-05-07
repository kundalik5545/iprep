# Task 04 - Readiness Detection

**Phase:** diagnostics  
**Priority:** 🟡 High (users need clear troubleshooting before starting interviews)  
**Estimated Tokens:** ~6,300  
**Depends On:** Task 03  
**Ref:** [CLI-PLAN.md](../../cli-docs/CLI-PLAN.md) §Command Behavior Plan, §CLI and Backend Relationship; [ARCHITECTURE.md](../../architecture/ARCHITECTURE.md) §Provider Status UI

---

## Objective

Implement `iprep doctor` and process detection helpers that check the local machine, iPrep home, server, database file, configured keys, and provider CLIs. The command should work even when the backend is offline.

---

## Deliverables

### 1. `process.ts` - Local Process And CLI Detection

**Path:** `apps/cli/src/utils/process.ts`  
**Est. tokens:** ~2,100

- Implement safe command availability checks for `node`, `pnpm`, `claude`, `gemini`, `codex`, and `ollama`.
- Use `child_process.execFile` or `spawn` without shell interpolation for provider checks.
- Return typed results with `id`, `label`, `status`, `version`, `path`, `hint`, and optional `error`.
- Add a lightweight HTTP probe helper for server `/health` readiness.
- Include timeouts so missing binaries never hang the CLI.

### 2. `doctor.ts` - `iprep doctor`

**Path:** `apps/cli/src/commands/doctor.ts`  
**Est. tokens:** ~2,000

- Add `--json` and optional `--verbose` flags.
- Check Node version against root `package.json` engines.
- Check local home existence, config readability, keys metadata, DB file or DB folder, server `/health`, and provider CLI availability.
- Show next-action hints for failed checks, including `iprep init`, `iprep setup`, and install hints for CLIs.
- Exit `0` when all critical checks pass and non-zero when critical checks fail.

### 3. Detection Result Types

**Path:** `apps/cli/src/utils/process.ts`, `apps/cli/src/utils/table.ts`  
**Est. tokens:** ~900

- Define reusable readiness status types: `pass`, `warn`, `fail`, and `skip`.
- Render grouped tables for system, local files, backend, providers, and optional keys.
- Support JSON output with the same group structure.

### 4. Modifications to Existing Files

**Est. tokens:** ~1,300

| File | Change | Tokens |
| ---- | ------ | ------ |
| `apps/cli/src/commands/status.ts` | Reuse provider and health check helpers later | ~300 |
| `apps/cli/src/utils/display.ts` | Add status marker formatting helpers | ~300 |
| `apps/cli/src/utils/spinner.ts` | Wrap long-running readiness groups | ~300 |
| `apps/cli/README.md` | Document doctor checks and JSON output | ~400 |

---

## Acceptance Criteria

- [ ] `iprep doctor` works before `iprep init` and suggests running init.
- [ ] `iprep doctor --json` emits valid JSON without spinner characters.
- [ ] Missing provider CLIs are warnings, not fatal errors, unless no usable analysis path exists.
- [ ] Server offline is reported clearly without crashing.
- [ ] Node version check follows the root `package.json` engine requirement.
- [ ] Detection commands use safe spawn/exec APIs and time out.

---

## Files Changed

| Action | File |
| ------ | ---- |
| CREATE | `apps/cli/src/utils/process.ts` |
| MODIFY | `apps/cli/src/commands/doctor.ts` |
| MODIFY | `apps/cli/src/commands/status.ts` |
| MODIFY | `apps/cli/src/utils/display.ts` |
| MODIFY | `apps/cli/src/utils/spinner.ts` |
| MODIFY | `apps/cli/src/utils/table.ts` |
| MODIFY | `apps/cli/README.md` |

**Total files:** 1 created, 6 modified
