#!/usr/bin/env python3
"""Rule 5: stay inside the project folder."""
import os
import re
import shlex
import sys

sys.path.insert(0, os.path.dirname(__file__))
from common import (
    FILE_TOOLS,
    PROJECT_DIR,
    block,
    bash_command,
    is_allowed_path,
    load_input,
    resolve,
    tool_paths,
)

data = load_input()
tool = data.get("tool_name", "")
cwd = data.get("cwd") or PROJECT_DIR

# The shell must also be inside the project.
if tool in FILE_TOOLS or tool == "Bash":
    if not is_allowed_path(resolve(cwd)):
        block("Rule 5: Project folder only", "Working directory is outside the project: %s" % cwd)

if tool in FILE_TOOLS:
    for p in tool_paths(data):
        real = resolve(p, cwd)
        if not is_allowed_path(real):
            block("Rule 5: Project folder only", "Path is outside the project: %s" % p)

cmd = bash_command(data)
if cmd:
    try:
        tokens = shlex.split(cmd, posix=True)
    except ValueError:
        tokens = cmd.split()
    # Also split on shell operators glued to words.
    extra = re.split(r"[;&|<>()`$]+", cmd)
    for raw in tokens + [t for e in extra for t in e.split()]:
        t = raw.strip("\"'")
        if not t or t.startswith("-") and "/" not in t and ".." not in t:
            continue
        looks_like_path = (
            t.startswith(("/", "~", "./", "../"))
            or t in ("..", "~")
            or "/../" in t
            or t.endswith("/..")
        )
        if not looks_like_path:
            continue
        # Skip bare option values like --flag=/path by splitting on '='.
        for part in t.split("="):
            if not part.startswith(("/", "~", ".")):
                continue
            real = resolve(part, cwd)
            if not is_allowed_path(real):
                block(
                    "Rule 5: Project folder only",
                    "Command touches a path outside the project: %s" % part,
                )
sys.exit(0)
