#!/usr/bin/env python3
"""Rule 2: block every git and gh command."""
import os
import re
import sys

sys.path.insert(0, os.path.dirname(__file__))
from common import block, bash_command, load_input

data = load_input()
cmd = bash_command(data)
if cmd:
    # Over-blocks on purpose: any standalone `git` or `gh` word followed by space or end.
    if re.search(r"(?<![\w./-])(git|gh)(?=\s|$|;|&|\|)", cmd):
        block(
            "Rule 2: No Git or GitHub",
            "git and gh commands are not allowed. The owner runs these.",
        )
sys.exit(0)
