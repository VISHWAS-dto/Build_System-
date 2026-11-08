#!/usr/bin/env python3
"""Rules 1 and 7: force an approval prompt for anything that changes state."""
import os
import re
import sys

sys.path.insert(0, os.path.dirname(__file__))
from common import ask, bash_command, load_input

READ_ONLY = {
    "ls", "pwd", "cat", "head", "tail", "wc", "file", "stat", "grep", "rg",
    "find", "tree", "which", "whoami", "date", "echo", "diff", "sort", "uniq",
    "basename", "dirname", "realpath", "du", "df", "uname",
}
# Operators or flags that can write or run other things.
UNSAFE = re.compile(r"[>]|\btee\b|\|\s*(sh|bash|zsh|python3?|node)\b|\$\(|`|\s-(exec|execdir|ok|fprint\w*|fls)\b|;|&&|\|\|")

data = load_input()
tool = data.get("tool_name", "")

if tool in ("Write", "Edit", "NotebookEdit"):
    ask("Rule 1: Approve this change before it runs.")

if tool in ("Agent", "Task"):
    ask("Rule 7: Approve spawning this sub-agent. It must follow all Safety Rules.")

cmd = bash_command(data)
if cmd is not None:
    first = cmd.strip().split()[0] if cmd.strip() else ""
    first = os.path.basename(first)
    if first in READ_ONLY and not UNSAFE.search(cmd):
        sys.exit(0)  # read-only, allowed
    ask("Rule 1: Approve this shell command before it runs.")

sys.exit(0)
