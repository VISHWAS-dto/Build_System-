#!/usr/bin/env python3
"""Extra: append one JSON line per tool call to .claude/audit.log.

Logs tool name, target, and agent info only. Never logs file contents.
"""
import json
import os
import sys
import time

sys.path.insert(0, os.path.dirname(__file__))
from common import PROJECT_DIR, load_input

data = load_input()
ti = data.get("tool_input") or {}
entry = {
    "time": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
    "session": data.get("session_id"),
    "agent": data.get("agent_id") or data.get("agent_type") or "main",
    "tool": data.get("tool_name"),
    "target": ti.get("command") or ti.get("file_path") or ti.get("path") or ti.get("description"),
}
log = os.environ.get("AUDIT_LOG") or os.path.join(PROJECT_DIR, ".claude", "audit.log")
try:
    with open(log, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry) + "\n")
except Exception:
    pass
sys.exit(0)
