# AGENTS.md

Single source of truth for all AI coding assistants in this repo.
Edit rules here only. Other tool files point to this file.

## Project

- Name: Book_Show
- Stack: Node.js, Fastify 5, TypeScript 5, Prisma 7 (PostgreSQL), Zod, Redis (ioredis), Elasticsearch, pnpm, oxlint
- Commands:
  - Install: `pnpm install` (also runs `prisma generate`)
  - Dev: `pnpm run dev`
  - Build / start: `pnpm run build`, `pnpm start`
  - Check: `pnpm run typecheck`, `pnpm run lint`, `pnpm test`
  - Database (needs approval to run): `pnpm run prisma:migrate`, `pnpm run prisma:seed`
  - Local dependencies: `docker compose up -d`

## Safety Rules (mandatory, no exceptions)

These apply to every AI tool, agent, sub-agent, and delegated task.
No agent may bypass, reinterpret, or weaken them.

### 1. Plan first, act after approval

- Do not execute, create, modify, or install anything without explicit approval from the owner.
- Workflow:
  1. Prepare a plan.
  2. Explain what will be created or changed.
  3. Wait for explicit approval.
  4. Only then execute.
- Approval for one task does not carry over to the next task.
- Read-only actions (reading files, searching) are allowed.

### 2. No Git or GitHub commands

- Never run any git or GitHub command. This includes `git add`, `git commit`, `git push`, `git pull`, `git checkout`, `git reset`, `git stash`, `git rebase`, `git merge`, `gh`, and any other git-related command.
- The owner runs all git and GitHub operations.
- If any agent or sub-agent tries to run one, stop that operation immediately and report it.

### 3. Database protection

- Never run DELETE, DROP, TRUNCATE, or any destructive query without explicit approval.
- Never connect to, read from, or modify the database without the owner's instruction and approval.
- Never run migrations or seed scripts without approval.

### 4. No deletion

- Never delete files or directories without explicit approval.
- This includes `rm`, moving files to trash, and overwriting files in a way that loses content.

### 5. Stay inside the project folder

- Work only inside the project folder.
- Never read, write, or navigate outside it without approval.
- If something outside is needed, ask first.

### 6. Ask, do not assume

- Ask questions whenever requirements are unclear.
- Never guess. Never proceed on uncertain requirements.

### 7. Agents and sub-agents

- Every agent and sub-agent must follow all rules in this file.
- When delegating, pass these rules to the sub-agent in full.
- A sub-agent has no extra permissions beyond the owner's approval.

### 8. Enforcement

- Hooks and permission settings enforce these rules automatically (Claude Code only). See `.claude/settings.json` and `.claude/hooks/`.
- If a hook blocks an action, do not work around it. Report it and ask.

## General Rules

- All files in this repo are written in English.
- Keep changes small and focused.
- Do not commit secrets or `.env` files.
- Project guidelines (code style, naming, testing): TBD.

## Where things live

| Path | Purpose |
|---|---|
| `AGENTS.md` | Shared rules for every AI tool |
| `docs/` | Project documentation |
| `docs/ai-setup.md` | How the multi-tool setup works |
