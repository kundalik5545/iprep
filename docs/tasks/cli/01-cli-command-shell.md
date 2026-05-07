# Task 01 - CLI Command Shell

**Phase:** cli-shell  
**Priority:** 🔴 Critical (all command implementations need a registered Commander entrypoint)  
**Estimated Tokens:** ~4,600  
**Depends On:** None  
**Ref:** [CLI-PLAN.md](../../cli-docs/CLI-PLAN.md) §CLI Folder Structure, §Command Behavior Plan; [PLAN.md](../../architecture/PLAN.md) §Phase 3

---

## Objective

Build the actual Commander root for `apps/cli` so `iprep --help` exposes the planned v1 command shape and every command file exports a typed registration function. This turns the current placeholder CLI into a usable shell that later tasks can fill with behavior.

---

## Deliverables

### 1. `index.ts` - Commander Program Root

**Path:** `apps/cli/src/index.ts`  
**Est. tokens:** ~1,800

- Create a `Command` instance with name `iprep`, package version, description, and global options such as `--json` where appropriate.
- Register `init`, `doctor`, `setup`, `status`, `start`, `sessions`, `analyze`, `export`, and `keys`.
- Add a top-level async error boundary that prints a concise error and exits with code `1`.
- Keep imports ESM-compatible with the existing `"type": "module"` package.
- Ensure `iprep --help` and `pnpm --filter @iprep/cli dev -- --help` display all v1 commands.

### 2. Command Registration Exports

**Path:** `apps/cli/src/commands/*.ts`  
**Est. tokens:** ~1,600

- Replace placeholder `export {}` statements with `registerXCommand(program: Command): void` exports.
- Add each command description and initial options from `docs/cli-docs/CLI-PLAN.md`.
- Use placeholder command actions only where behavior belongs to later tasks, but keep the user-facing command stable.
- Define arguments for `analyze <sessionId>` and `export <sessionId>`.
- Define `keys` subcommands: `list`, `set <provider>`, `remove <provider>`, and `show <provider>`.

### 3. CLI Package Metadata And README Alignment

**Path:** `apps/cli/package.json`, `apps/cli/README.md`  
**Est. tokens:** ~1,200

- Confirm `bin.iprep` points to `./bin/iprep.js` and `bin/iprep.js` imports `../dist/index.js`.
- Add script coverage for `dev`, `build`, and `typecheck`; keep existing scripts unless they are wrong.
- Update README command list from older `onboard` and `chat` commands to the v1 command set.
- Document local development commands using `pnpm --filter @iprep/cli`.

---

## Acceptance Criteria

- [ ] `pnpm --filter @iprep/cli typecheck` passes.
- [ ] `pnpm --filter @iprep/cli dev -- --help` lists all planned v1 commands.
- [ ] Each command file exports one named registration function.
- [ ] Unknown command errors are handled by Commander with a non-zero exit.
- [ ] The README no longer references retired `onboard` or `chat` commands.
- [ ] No command behavior depends on the backend server in this task.

---

## Files Changed

| Action | File |
| ------ | ---- |
| MODIFY | `apps/cli/src/index.ts` |
| MODIFY | `apps/cli/src/commands/init.ts` |
| MODIFY | `apps/cli/src/commands/doctor.ts` |
| MODIFY | `apps/cli/src/commands/setup.ts` |
| MODIFY | `apps/cli/src/commands/status.ts` |
| MODIFY | `apps/cli/src/commands/start.ts` |
| MODIFY | `apps/cli/src/commands/sessions.ts` |
| MODIFY | `apps/cli/src/commands/analyze.ts` |
| MODIFY | `apps/cli/src/commands/export.ts` |
| MODIFY | `apps/cli/src/commands/keys.ts` |
| MODIFY | `apps/cli/package.json` |
| MODIFY | `apps/cli/README.md` |

**Total files:** 0 created, 12 modified
