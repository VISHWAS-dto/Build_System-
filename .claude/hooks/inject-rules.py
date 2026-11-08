#!/usr/bin/env python3
"""Rules 7 and 8: put the Safety Rules into the context of every session and sub-agent."""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from common import load_input, safety_rules_text

data = load_input()
event = data.get("hook_event_name") or "SessionStart"
if event not in ("SessionStart", "SubagentStart"):
    event = "SessionStart"

text = (
    "MANDATORY PROJECT SAFETY RULES. Every agent and sub-agent must follow them. "
    "No exceptions. Hooks enforce them. Do not work around a blocked action.\n\n"
    + safety_rules_text()
)
print(
    json.dumps(
        {"hookSpecificOutput": {"hookEventName": event, "additionalContext": text}}
    )
)
sys.exit(0)
