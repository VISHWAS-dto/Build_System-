"""Shared helpers for safety hooks. Standard library only.

Exit code 2 blocks a tool call in Claude Code. The stderr message is shown to Claude.
"""
import json
import os
import re
import sys

PROJECT_DIR = os.path.realpath(
    os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()
)

# Paths outside the project that are allowed (exact prefix match, real paths).
# Claude Code's own memory folder for this project.
ALLOWED_OUTSIDE = [
    "/dev/null",
    os.path.expanduser(
        "~/.claude/projects/-Users-vishwas-Downloads-Build-System-/memory"
    ),
]

FILE_TOOLS = {"Read", "Write", "Edit", "NotebookEdit", "Glob", "Grep"}


def load_input():
    try:
        return json.load(sys.stdin)
    except Exception:
        return {}


def block(rule, reason):
    sys.stderr.write(
        "BLOCKED by safety hook (%s): %s\n"
        "Do not work around this. Report it to the owner and ask for approval.\n"
        % (rule, reason)
    )
    sys.exit(2)


def ask(reason):
    print(
        json.dumps(
            {
                "hookSpecificOutput": {
                    "hookEventName": "PreToolUse",
                    "permissionDecision": "ask",
                    "permissionDecisionReason": reason,
                }
            }
        )
    )
    sys.exit(0)


def bash_command(data):
    if data.get("tool_name") != "Bash":
        return None
    return (data.get("tool_input") or {}).get("command") or ""


def tool_paths(data):
    """Return file paths a non-Bash tool wants to touch."""
    ti = data.get("tool_input") or {}
    out = []
    for key in ("file_path", "path", "notebook_path"):
        v = ti.get(key)
        if isinstance(v, str) and v:
            out.append(v)
    return out


def resolve(path, cwd=None):
    path = os.path.expanduser(path)
    if not os.path.isabs(path):
        path = os.path.join(cwd or PROJECT_DIR, path)
    return os.path.realpath(path)


def is_inside(path, base):
    return path == base or path.startswith(base.rstrip("/") + "/")


def is_allowed_path(real):
    if is_inside(real, PROJECT_DIR):
        return True
    for a in ALLOWED_OUTSIDE:
        if is_inside(real, os.path.realpath(a)):
            return True
    return False


def safety_rules_text():
    """Return the Safety Rules section of AGENTS.md."""
    p = os.path.join(PROJECT_DIR, "AGENTS.md")
    try:
        txt = open(p, encoding="utf-8").read()
    except Exception:
        return "Read AGENTS.md in the project root. Follow all Safety Rules."
    m = re.search(r"## Safety Rules.*?(?=\n## (?!#))", txt, re.S)
    return m.group(0) if m else txt
