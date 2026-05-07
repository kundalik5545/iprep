# Task 05 - Setup And Keys

**Phase:** setup  
**Priority:** 🟡 High (BYOK and defaults are core to local-first onboarding)  
**Estimated Tokens:** ~6,400  
**Depends On:** Task 03  
**Ref:** [CLI-PLAN.md](../../cli-docs/CLI-PLAN.md) §Command Files, §Local iPrep Home Structure; [ARCHITECTURE.md](../../architecture/ARCHITECTURE.md) §BYOK scope, §Key storage

---

## Objective

Implement the interactive setup wizard and `iprep keys` management commands so users can configure provider key metadata, defaults, tutor, mode, and server preferences from the terminal without editing files manually.

---

## Deliverables

### 1. `prompts.ts` - Setup Prompt Helpers

**Path:** `apps/cli/src/utils/prompts.ts`  
**Est. tokens:** ~1,600

- Export typed prompt helpers for provider selection, API key input, default tutor, default mode, default analysis provider, and confirmation.
- Use `inquirer` password prompts for key entry.
- Validate provider slugs against shared provider constants where possible.
- Make prompt helpers easy to bypass in tests by accepting defaults/options as parameters.

### 2. `setup.ts` - `iprep setup`

**Path:** `apps/cli/src/commands/setup.ts`  
**Est. tokens:** ~1,900

- Ensure `~/.iprep` exists by calling the init helper when needed.
- Prompt for Deepgram, Gemini, Anthropic, OpenAI, and optional local CLI preferences.
- Save default tutor, mode, provider, and server port to `config.json`.
- Save key metadata to `keys.json` or the project-approved key file while avoiding accidental terminal echo.
- Detect installed CLIs after setup and summarize what is ready.

### 3. `keys.ts` - `iprep keys`

**Path:** `apps/cli/src/commands/keys.ts`  
**Est. tokens:** ~1,800

- Implement `keys list`, `keys set <provider>`, `keys remove <provider>`, and `keys show <provider>`.
- Show masked key values or metadata only; never print full secret values.
- Support `--json` output for list/show.
- Validate providers: `deepgram`, `gemini`, `anthropic`, and `openai` for BYOK keys.
- Keep removal explicit with a confirmation prompt unless a force option is provided.

### 4. Modifications to Existing Files

**Est. tokens:** ~1,100

| File | Change | Tokens |
| ---- | ------ | ------ |
| `apps/cli/src/utils/home-dir.ts` | Add key metadata read/write helpers and masking helpers | ~500 |
| `apps/cli/src/commands/doctor.ts` | Read configured key metadata for readiness checks | ~300 |
| `apps/cli/README.md` | Document setup and key commands | ~300 |

---

## Acceptance Criteria

- [ ] `iprep setup` can run on a fresh machine and creates required config files.
- [ ] Secret input is never echoed back in full.
- [ ] `iprep keys list` shows configured providers and masked key status.
- [ ] `iprep keys remove <provider>` requires confirmation by default.
- [ ] Provider slug validation rejects unsupported key providers.
- [ ] `iprep doctor` can read the saved key metadata after setup.

---

## Files Changed

| Action | File |
| ------ | ---- |
| MODIFY | `apps/cli/src/utils/prompts.ts` |
| MODIFY | `apps/cli/src/commands/setup.ts` |
| MODIFY | `apps/cli/src/commands/keys.ts` |
| MODIFY | `apps/cli/src/utils/home-dir.ts` |
| MODIFY | `apps/cli/src/commands/doctor.ts` |
| MODIFY | `apps/cli/README.md` |

**Total files:** 0 created, 6 modified
