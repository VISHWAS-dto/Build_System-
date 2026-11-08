# AI tool setup

One rules file, many tools. Edit `AGENTS.md` only.

| Tool | File it reads | How |
|---|---|---|
| Codex, Grok, Antigravity, Cursor, Copilot, most others | `AGENTS.md` | Native |
| Claude Code | `CLAUDE.md` | Imports `@AGENTS.md` |
| Gemini CLI, Antigravity | `GEMINI.md` | Symlink to `AGENTS.md` |
| GitHub Copilot | `.github/copilot-instructions.md` | Symlink to `AGENTS.md` |
| Cursor | `.cursor/rules/project.mdc` | Points to `AGENTS.md` |

## Notes

- Do not edit the symlinks. Edit `AGENTS.md`.
- Tool-specific settings (for example `.claude/settings.json`) stay in their own folders.
- Personal overrides go in gitignored files like `.claude/settings.local.json`.
- If a new tool needs its own file, add a symlink or a one-line pointer and update this table.
