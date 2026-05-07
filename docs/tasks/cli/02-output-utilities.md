# Task 02 - Output Utilities

**Phase:** cli-utils  
**Priority:** 🟡 High (keeps every command readable and consistent)  
**Estimated Tokens:** ~4,400  
**Depends On:** Task 01  
**Ref:** [CLI-PLAN.md](../../cli-docs/CLI-PLAN.md) §CLI Stack, §Utility Files

---

## Objective

Implement shared display, spinner, and table helpers so all CLI commands use one compact terminal output style. This keeps diagnostics, setup, sessions, and export output predictable for users and automation.

---

## Deliverables

### 1. `display.ts` - Terminal Message Helpers

**Path:** `apps/cli/src/utils/display.ts`  
**Est. tokens:** ~1,500

- Export helpers such as `heading`, `success`, `error`, `warn`, `info`, `muted`, and `json`.
- Use `chalk` for color while keeping output readable without color.
- Centralize formatting of file paths, URLs, and next-step hints.
- Include a helper for command failure output that accepts `unknown` errors safely.

### 2. `spinner.ts` - Ora Wrapper

**Path:** `apps/cli/src/utils/spinner.ts`  
**Est. tokens:** ~900

- Wrap `ora` in a tiny API for `start`, `succeed`, `fail`, `warn`, and `stop`.
- Support non-interactive or JSON mode by avoiding animated output when needed.
- Return a typed spinner handle rather than exposing raw `ora` everywhere.

### 3. `table.ts` - Compact Table Renderer

**Path:** `apps/cli/src/utils/table.ts`  
**Est. tokens:** ~1,200

- Create a simple dependency-free table formatter for fixed terminal output.
- Support headers, rows, empty states, and optional row status markers.
- Keep cells from crashing on `undefined` by normalizing values to strings.
- Use this in later `doctor`, `status`, and `sessions` tasks.

### 4. Modifications to Existing Files

**Est. tokens:** ~800

| File | Change | Tokens |
| ---- | ------ | ------ |
| `apps/cli/src/index.ts` | Wire global error output through `display.error` | ~400 |
| `apps/cli/src/commands/*.ts` | Replace ad hoc placeholder output with shared helpers where commands already print | ~400 |

---

## Acceptance Criteria

- [ ] `pnpm --filter @iprep/cli typecheck` passes.
- [ ] Display helpers are imported by at least the CLI root and one command.
- [ ] Table output handles empty rows with a friendly message.
- [ ] Spinner helper does not emit animation in JSON mode.
- [ ] Error formatting never throws when passed a non-`Error` value.
- [ ] No command duplicates color or table formatting logic introduced here.

---

## Files Changed

| Action | File |
| ------ | ---- |
| MODIFY | `apps/cli/src/utils/display.ts` |
| MODIFY | `apps/cli/src/utils/spinner.ts` |
| CREATE | `apps/cli/src/utils/table.ts` |
| MODIFY | `apps/cli/src/index.ts` |
| MODIFY | `apps/cli/src/commands/init.ts` |

**Total files:** 1 created, 4 modified
