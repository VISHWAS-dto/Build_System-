#!/usr/bin/env python3
"""Rule 1: at the end of each turn, show the owner what changed state."""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from common import PROJECT_DIR, load_input

data = load_input()
if data.get("stop_hook_active"):
    sys.exit(0)

sid = data.get("session_id")
log = os.environ.get("AUDIT_LOG") or os.path.join(PROJECT_DIR, ".claude", "audit.log")
writes = bash = 0
try:
    with open(log, encoding="utf-8") as f:
        for line in f:
            try:
                e = json.loads(line)
            except Exception:
                continue
            if e.get("session") != sid:
                continue
            if e.get("tool") in ("Write", "Edit", "NotebookEdit"):
                writes += 1
            elif e.get("tool") == "Bash":
                bash += 1
except Exception:
    pass

msg = (
    "Safety check: this session had %d file write/edit and %d shell calls. "
    "Confirm each was approved. See .claude/audit.log." % (writes, bash)
)
print(json.dumps({"systemMessage": msg}))
sys.exit(0)
