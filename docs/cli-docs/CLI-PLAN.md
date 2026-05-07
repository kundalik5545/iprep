# iPrep CLI Plan

> Last updated: 2026-05-06
> Scope: CLI folder structure, files, libraries, commands, and expected outcomes.

---

## CLI Goal

The iPrep CLI is the user's local control panel. It should prepare the machine, manage local iPrep files, check provider readiness, start the backend/server, open the web app, and expose useful session/analysis/export commands from the terminal.

## CLI Stack

| Area | Library / Package | Used For |
| --- | --- | --- |
| Runtime | Node.js 20+ | Runs the published `iprep` command. |
| Language | TypeScript | Keeps commands, options, and utilities typed. |
| Command framework | `commander` | Defines `iprep <command>` syntax, options, help text, and command dispatch. |
| Terminal colors | `chalk` | Prints readable success, warning, error, and info messages. |
| Interactive prompts | `inquirer` | Collects setup choices such as provider keys, default tutor, and preferences. |
| Spinners | `ora` | Shows progress while checking CLIs, server status, DB setup, and provider readiness. |
| Browser opener | `open` | Opens the local web UI after `iprep start`. |
| Logging | `winston` | Future structured CLI logs, especially for debug output and support bundles. |
| Shared contracts | `@iprep/shared` | Reuses paths, constants, schemas, provider slugs, tutor slugs, and validation. |
| Backend API | Local HTTP calls | CLI commands can call the local server for sessions, status, analysis, and exports. |

## CLI Folder Structure

```text
apps/cli/
├── package.json                         # CLI package config, dependencies, scripts, and "iprep" bin mapping
├── tsconfig.json                        # TypeScript build config for compiling src/ into dist/
├── README.md                            # CLI package readme; should match the final v1 command shape
│
├── bin/
│   └── iprep.js                         # Published executable entry; imports ../dist/index.js
│
└── src/
    ├── index.ts                         # Commander root; registers commands and handles global errors
    │
    ├── commands/
    │   ├── init.ts                      # iprep init: creates local ~/.iprep structure and default config
    │   ├── doctor.ts                    # iprep doctor: checks local readiness, DB, server, keys, and CLIs
    │   ├── setup.ts                     # iprep setup: interactive provider keys and preference wizard
    │   ├── status.ts                    # iprep status: shows server, DB, provider, and CLI readiness
    │   ├── start.ts                     # iprep start: starts backend and opens the local web app
    │   ├── sessions.ts                  # iprep sessions: lists recent interview sessions
    │   ├── analyze.ts                   # iprep analyze <sessionId>: triggers/reruns analysis
    │   ├── export.ts                    # iprep export <sessionId>: exports transcript and analysis
    │   └── keys.ts                      # iprep keys: manages BYOK provider key configuration
    │
    └── utils/
        ├── display.ts                   # Chalk output helpers: success, error, warn, info, headings
        ├── spinner.ts                   # Ora spinner wrapper for long-running CLI checks/actions
        ├── prompts.ts                   # Inquirer prompt helpers for setup and key management
        ├── home-dir.ts                  # ~/.iprep folder/config creation and lookup helpers
        ├── api.ts                       # Planned local backend HTTP client helper
        ├── process.ts                   # Planned process/server/provider CLI detection helper
        └── table.ts                     # Planned reusable terminal table formatting helper
```

## Command Files

| File | Command | What It Achieves |
| --- | --- | --- |
| `commands/init.ts` | `iprep init` | Creates the local iPrep home directory, DB/log/export folders, default config, and first-run files. |
| `commands/doctor.ts` | `iprep doctor` | Checks Node, pnpm/npm environment, iPrep home, database readiness, server availability, provider keys, and local CLIs. |
| `commands/setup.ts` | `iprep setup` | Interactive setup wizard for API keys, default provider, tutor, mode, and local preferences. |
| `commands/status.ts` | `iprep status` | Shows current server status, configured providers, installed CLIs, DB status, and recent readiness summary. |
| `commands/start.ts` | `iprep start` | Starts the local backend, waits for `/health`, then opens the web app in the browser. |
| `commands/sessions.ts` | `iprep sessions` | Lists recent local interview sessions with status, tutor, package, duration, and analysis state. |
| `commands/analyze.ts` | `iprep analyze <sessionId>` | Triggers or reruns analysis for a completed session from the terminal. |
| `commands/export.ts` | `iprep export <sessionId>` | Exports transcript and analysis to Markdown first, with PDF later. |
| `commands/keys.ts` | `iprep keys` | Manages BYOK provider keys or key metadata through local config/settings. |

## Utility Files

| File | Responsibility | Used By |
| --- | --- | --- |
| `utils/display.ts` | Terminal output helpers such as `success`, `error`, `warn`, `info`, section headers, and tables. | All commands |
| `utils/spinner.ts` | Small wrapper around `ora` for consistent loading states. | `doctor`, `start`, `setup`, `analyze`, `export` |
| `utils/prompts.ts` | Reusable `inquirer` prompts for provider keys, default tutor, default mode, confirmation, and choices. | `init`, `setup`, `keys` |
| `utils/home-dir.ts` | Creates and reads local iPrep directories and config files under the iPrep home path. | `init`, `doctor`, `setup`, `keys`, `export` |
| `utils/api.ts` | Planned helper for local server HTTP requests. | `status`, `sessions`, `analyze`, `export`, `keys` |
| `utils/process.ts` | Planned helper for spawning/checking server and provider CLIs. | `doctor`, `start`, `status` |
| `utils/table.ts` | Planned helper for clean table rendering without duplicating formatting logic. | `doctor`, `status`, `sessions` |

## Local iPrep Home Structure

```text
~/.iprep/
├── config.json                          # Created by init/setup; default tutor, provider, mode, server port
├── keys.json                            # Created by setup/keys; BYOK key metadata or encrypted key storage
├── sessions.json                        # Used by adapters; optional Claude/Gemini/Codex session mapping
│
├── db/
│   └── iprep.db                         # Local SQLite database created by DB setup/server startup
│
├── logs/
│   ├── cli.log                          # CLI troubleshooting logs
│   └── server.log                       # Local backend/server logs
│
├── skills/
│   └── <skill-id>/                      # AI skill packs used by tutors/providers during sessions
│
├── docs/
│   └── <document-id>/                   # User-uploaded docs/resumes/JDs used as interview context
│
├── interview-data/
│   └── <session-id>/                    # Stored after each interview for future analysis/export/review
│       ├── recordings/                  # Audio recordings captured during the interview
│       ├── transcripts/                 # Raw and cleaned transcript files
│       ├── analysis/                    # Generated feedback, scores, and analysis snapshots
│       └── metadata.json                # Session package, tutor, provider, timing, and status metadata
│
├── exports/
│   └── <session-id>.md                  # Markdown exports from iprep export
│
└── backups/
    └── iprep-backup-YYYY-MM-DD.zip      # Future backup archive from iprep backup
```

## Command Behavior Plan

| Command | Inputs | Output | Success Criteria |
| --- | --- | --- | --- |
| `iprep --help` | None | Command list and global options. | All v1 commands appear with short descriptions. |
| `iprep init` | Optional `--force` | Created folder summary. | Local iPrep home exists and is safe to rerun. |
| `iprep doctor` | Optional `--json` | Readiness checklist. | Shows pass/fail for Node, local files, DB, server, keys, and CLIs. |
| `iprep setup` | Interactive answers | Saved config summary. | User can configure minimum provider settings without editing files manually. |
| `iprep status` | Optional `--json` | Server/provider/DB status. | Clearly shows whether the app is ready to start an interview. |
| `iprep start` | Optional `--port`, `--no-open` | Server URL and startup state. | Backend starts, `/health` passes, browser opens unless disabled. |
| `iprep sessions` | Optional `--limit`, `--json` | Recent sessions table. | User can identify a session ID for analysis/export. |
| `iprep analyze <sessionId>` | Session ID, optional `--provider` | Analysis progress and result summary. | Completed session receives a stored analysis result. |
| `iprep export <sessionId>` | Session ID, optional `--format md/pdf` | Export file path. | Transcript and analysis are written to `~/.iprep/exports/`. |
| `iprep keys` | Subcommands or prompts | Provider key status. | User can add, update, remove, or inspect provider key configuration. |

## Implementation Phases

| Phase | Focus | Files | Done When |
| --- | --- | --- | --- |
| 1 | CLI shell | `src/index.ts`, all command files | `iprep --help` shows all planned commands. |
| 2 | Display utilities | `utils/display.ts`, `utils/spinner.ts`, `utils/table.ts` | Commands share consistent output formatting. |
| 3 | Local home setup | `commands/init.ts`, `utils/home-dir.ts` | `iprep init` creates the full local folder/config structure safely. |
| 4 | Readiness checks | `commands/doctor.ts`, `utils/process.ts` | `iprep doctor` reports Node, iPrep home, DB, server, keys, and provider CLIs. |
| 5 | Interactive setup | `commands/setup.ts`, `commands/keys.ts`, `utils/prompts.ts` | User can configure provider keys and defaults from terminal prompts. |
| 6 | Server control | `commands/start.ts`, `utils/api.ts`, `utils/process.ts` | `iprep start` launches backend and opens the web UI. |
| 7 | Session commands | `commands/status.ts`, `commands/sessions.ts` | CLI can read server/session status from the local API. |
| 8 | Analysis and export | `commands/analyze.ts`, `commands/export.ts` | CLI can trigger analysis and export results. |

## CLI and Backend Relationship

| CLI Area | Backend Dependency | Notes |
| --- | --- | --- |
| `init` | Low | Can run before backend exists; prepares local folders/config. |
| `doctor` | Medium | Checks backend availability but should still work when server is offline. |
| `setup` | Low/medium | Can write local config directly first; later can call settings API when server is running. |
| `start` | High | Needs server package build/start command and `/health`. |
| `status` | High | Best result comes from backend `/health` and provider status API. |
| `sessions` | High | Reads session data from backend or DB query layer. |
| `analyze` | High | Calls backend analysis endpoint or provider service. |
| `export` | Medium/high | Can export via API once analysis/session APIs exist. |

## Expected User Outcomes

| User Need | CLI Support |
| --- | --- |
| First-time setup | `iprep init` and `iprep setup` prepare local files and provider config. |
| Troubleshooting | `iprep doctor` gives a readable checklist and next action hints. |
| Daily launch | `iprep start` starts the local app and opens the browser. |
| Quick readiness check | `iprep status` confirms server, DB, and provider state. |
| Session lookup | `iprep sessions` shows recent interview sessions. |
| Terminal analysis | `iprep analyze <sessionId>` runs analysis without opening the UI. |
| Portability | `iprep export <sessionId>` creates shareable transcript/feedback files. |
| Provider management | `iprep keys` and `iprep setup` manage BYOK configuration. |

## Notes

- The existing `apps/cli/README.md` still mentions older commands like `onboard` and `chat`; it should be updated after the v1 command shape is implemented.
- `init`, `doctor`, and `setup` should work even when the backend server is not running.
- Commands that require session or analysis data should prefer the local backend API once it exists.
- CLI output should stay compact by default, with `--json` available for automation where useful.
