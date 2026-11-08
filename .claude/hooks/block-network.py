#!/usr/bin/env python3
"""Extra: block network, installs, and deploys from the shell."""
import os
import re
import sys

sys.path.insert(0, os.path.dirname(__file__))
from common import block, bash_command, load_input

PATTERNS = [
    r"(?<![\w./-])(curl|wget|nc|ncat|netcat|telnet|ssh|scp|sftp|ftp|rsync|http|https|aria2c)(?=\s|$)",
    r"\b(npm|pnpm|yarn|bun)\s+(install|i|add|update|upgrade|remove|rm|uninstall|publish|link|dlx|create)\b",
    r"\b(npx|bunx)\s",
    r"\b(pip|pip3|pipx|uv|poetry|conda)\s+(install|add|remove|uninstall|publish)\b",
    r"\b(brew|apt|apt-get|yum|dnf|gem|cargo|go)\s+(install|add|get|update|upgrade|uninstall)\b",
    r"\b(vercel|vc|netlify|firebase|fly|flyctl|heroku|wrangler|railway|docker|kubectl|terraform|aws|gcloud|az)\s",
    r"(?<![\w./-])sudo(?=\s|$)",
]

data = load_input()
cmd = bash_command(data)
if cmd:
    for p in PATTERNS:
        if re.search(p, cmd):
            block(
                "Network, install, deploy",
                "Network calls, package installs, deploys and sudo need owner approval.",
            )
sys.exit(0)
