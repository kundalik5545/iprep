# Task 03 - Local Home Init

**Phase:** local-home  
**Priority:** 🔴 Critical (first-run setup and later commands depend on canonical local paths)  
**Estimated Tokens:** ~6,100  
**Depends On:** Task 02  
**Ref:** [CLI-PLAN.md](../../cli-docs/CLI-PLAN.md) §Local iPrep Home Structure; [ARCHITECTURE.md](../../architecture/ARCHITECTURE.md) §Key Architecture Principles

---

## Objective

Implement `iprep init` and the local home directory utilities for the `~/.iprep` structure described in the CLI plan. This task should reconcile the older shared path helper names with the current CLI home layout and make initialization idempotent.

---

## Deliverables

### 1. `home-dir.ts` - Local File System Contract

**Path:** `apps/cli/src/utils/home-dir.ts`  
**Est. tokens:** ~2,500

- Export canonical paths for `config.json`, `keys.json`, `sessions.json`, `db`, `logs`, `skills`, `docs`, `interview-data`, `exports`, and `backups`.
- Use `os.homedir()`, `path`, and `fs/promises`; avoid hardcoded separators.
- Implement `ensureIprepHome()`, `readConfig()`, `writeConfig()`, `readKeysMetadata()`, and `writeKeysMetadata()`.
- Seed a default config containing server port, default tutor, default mode, and default provider using `@iprep/shared` constants where available.
- Preserve existing user files unless `--force` is explicitly passed.

### 2. `init.ts` - `iprep init`

**Path:** `apps/cli/src/commands/init.ts`  
**Est. tokens:** ~1,600

- Add `--force` and `--json` options.
- Create the full local folder tree from `docs/cli-docs/CLI-PLAN.md`.
- Print a concise summary of created, existing, and skipped paths.
- Return stable JSON for automation when `--json` is used.
- Make reruns safe and non-destructive by default.

### 3. Shared Path Alignment Notes

**Path:** `packages/shared/src/utils/dir-path.ts`  
**Est. tokens:** ~900

- Update or document path naming drift between `database`/`aitutors` and the CLI plan's `db`/`interview-data` layout.
- Prefer adding aliases over removing existing exports so frontend/server imports remain stable.
- Keep `IPREP_HOME` as the single cross-package root.

### 4. Modifications to Existing Files

**Est. tokens:** ~1,100

| File | Change | Tokens |
| ---- | ------ | ------ |
| `apps/cli/src/commands/doctor.ts` | Use home-dir helpers for future local home checks | ~300 |
| `apps/cli/src/commands/setup.ts` | Use home-dir helpers for config reads/writes | ~300 |
| `apps/cli/src/commands/keys.ts` | Use home-dir helpers for key metadata paths | ~300 |
| `apps/cli/README.md` | Document `iprep init` output and rerun behavior | ~200 |

---

## Acceptance Criteria

- [ ] `iprep init` creates the planned `~/.iprep` folder structure.
- [ ] Running `iprep init` twice does not overwrite user config or keys.
- [ ] `iprep init --force` refreshes default config while preserving sensitive key values unless explicitly designed otherwise.
- [ ] `iprep init --json` emits parseable JSON with path status entries.
- [ ] Local paths work on Windows, macOS, and Linux through Node path APIs.
- [ ] The shared `IPREP_HOME` root remains compatible with server and package imports.

---

## Files Changed

| Action | File |
| ------ | ---- |
| MODIFY | `apps/cli/src/utils/home-dir.ts` |
| MODIFY | `apps/cli/src/commands/init.ts` |
| MODIFY | `packages/shared/src/utils/dir-path.ts` |
| MODIFY | `apps/cli/src/commands/doctor.ts` |
| MODIFY | `apps/cli/src/commands/setup.ts` |
| MODIFY | `apps/cli/src/commands/keys.ts` |
| MODIFY | `apps/cli/README.md` |

**Total files:** 0 created, 7 modified
