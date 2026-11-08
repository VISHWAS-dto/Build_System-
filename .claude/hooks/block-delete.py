#!/usr/bin/env python3
"""Rule 4: block deleting files or directories."""
import os
import re
import sys

sys.path.insert(0, os.path.dirname(__file__))
from common import block, bash_command, load_input

PATTERNS = [
    r"(?<![\w./-])(rm|rmdir|unlink|shred|trash|srm)(?=\s|$|;|&|\|)",
    r"\bfind\b.*\s-delete\b",
    r"\b-exec\s+(rm|rmdir|unlink)\b",
    r"\bxargs\s+(-\S+\s+)*(rm|rmdir|unlink)\b",
    r"\.Trash",
    r"\bosascript\b.*\bdelete\b",
    r"\bgit\s+clean\b",
    r"\brsync\b.*--delete",
    r"\bshutil\.rmtree\b|\bos\.(remove|unlink|rmdir)\b|\bfs\.(rm|unlink|rmdir)",
]

data = load_input()
cmd = bash_command(data)
if cmd:
    for p in PATTERNS:
        if re.search(p, cmd):
            block(
                "Rule 4: No deletion",
                "Deleting files or directories needs explicit owner approval.",
            )
sys.exit(0)
