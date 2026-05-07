# iPrep CLI - Task Index

**Feature:** Implement the local-first `iprep` command-line control panel for setup, readiness checks, server launch, sessions, analysis, export, and BYOK key management.  
**Source Spec:** [CLI-PLAN.md](../../cli-docs/CLI-PLAN.md), [PLAN.md](../../architecture/PLAN.md), [ARCHITECTURE.md](../../architecture/ARCHITECTURE.md)  
**Created:** 2026-05-06  
**Total Estimated Tokens:** ~43,300

---

## Task Overview

| #   | Task                                             | Phase          | Priority | Est. Tokens | Depends On | Status |
| --- | ------------------------------------------------ | -------------- | -------- | ----------- | ---------- | ------ |
| 01  | [CLI Command Shell](01-cli-command-shell.md)     | cli-shell      | 🔴       | ~4,600      | None       | ⬜ TODO |
| 02  | [Output Utilities](02-output-utilities.md)       | cli-utils      | 🟡       | ~4,400      | Task 01    | ⬜ TODO |
| 03  | [Local Home Init](03-local-home-init.md)         | local-home     | 🔴       | ~6,100      | Task 02    | ⬜ TODO |
| 04  | [Readiness Detection](04-readiness-detection.md) | diagnostics    | 🟡       | ~6,300      | Task 03    | ⬜ TODO |
| 05  | [Setup And Keys](05-setup-and-keys.md)           | setup          | 🟡       | ~6,400      | Task 03    | ⬜ TODO |
| 06  | [Server Control](06-server-control.md)           | launch         | 🟡       | ~5,900      | Tasks 03-04 | ⬜ TODO |
| 07  | [Status And Sessions](07-status-and-sessions.md) | api-commands   | 🟢       | ~4,500      | Tasks 04, 06 | ⬜ TODO |
| 08  | [Analysis And Export](08-analysis-and-export.md) | analysis-export | 🟢      | ~5,100      | Tasks 06-07 | ⬜ TODO |

---

## Dependency Graph

```text
Architecture + CLI docs reviewed
     |
     v
  Task 01: CLI Command Shell  [CRITICAL PATH]
     |
     v
  Task 02: Output Utilities
     |
     v
  Task 03: Local Home Init  [CRITICAL PATH]
     |
     +--> Task 04: Readiness Detection
     |         |
     |         +--> Task 06: Server Control
     |                   |
     |                   +--> Task 07: Status And Sessions
     |                             |
     |                             +--> Task 08: Analysis And Export
     |
     +--> Task 05: Setup And Keys
```

---

## Execution Order (Recommended)

### Sprint 1 - CLI Base (Tasks 01, 02, 03)

1. **Task 01** - CLI Command Shell (~4,600 tokens)
2. **Task 02** - Output Utilities (~4,400 tokens)
3. **Task 03** - Local Home Init (~6,100 tokens)

**Sprint total:** ~15,100 tokens

### Sprint 2 - Local Configuration And Diagnostics (Tasks 04, 05)

4. **Task 04** - Readiness Detection (~6,300 tokens)
5. **Task 05** - Setup And Keys (~6,400 tokens)

**Sprint total:** ~12,700 tokens

### Sprint 3 - Runtime Commands (Tasks 06, 07, 08)

6. **Task 06** - Server Control (~5,900 tokens)
7. **Task 07** - Status And Sessions (~4,500 tokens)
8. **Task 08** - Analysis And Export (~5,100 tokens)

**Sprint total:** ~15,500 tokens

---

## Token Estimation Method

| Factor                 | Basis                                      |
| ---------------------- | ------------------------------------------ |
| **JSX components**     | ~25 tokens/line                            |
| **CSS files**          | ~15 tokens/line                            |
| **Context/hooks**      | ~30 tokens/line                            |
| **Backend routes**     | ~28 tokens/line                            |
| **File modifications** | ~20 tokens/line                            |
| **Config/JSON**        | ~10 tokens/line                            |
| **Overhead**           | +15% for imports, error handling, comments |

---

## Files Impact Summary

### New Files (Total: 3)

| Category       | Files |
| -------------- | ----- |
| **CLI Utils**  | `apps/cli/src/utils/api.ts`, `apps/cli/src/utils/process.ts`, `apps/cli/src/utils/table.ts` |

### Modified Files (Total: 16)

| File | Tasks |
| ---- | ----- |
| `apps/cli/src/index.ts` | 01 |
| `apps/cli/src/commands/init.ts` | 01, 03 |
| `apps/cli/src/commands/doctor.ts` | 01, 04 |
| `apps/cli/src/commands/setup.ts` | 01, 05 |
| `apps/cli/src/commands/status.ts` | 01, 07 |
| `apps/cli/src/commands/start.ts` | 01, 06 |
| `apps/cli/src/commands/sessions.ts` | 01, 07 |
| `apps/cli/src/commands/analyze.ts` | 01, 08 |
| `apps/cli/src/commands/export.ts` | 01, 08 |
| `apps/cli/src/commands/keys.ts` | 01, 05 |
| `apps/cli/src/utils/display.ts` | 02 |
| `apps/cli/src/utils/spinner.ts` | 02 |
| `apps/cli/src/utils/prompts.ts` | 05 |
| `apps/cli/src/utils/home-dir.ts` | 03, 05, 08 |
| `apps/cli/package.json` | 01, 06 |
| `apps/cli/README.md` | 01, 08 |
