#!/usr/bin/env python3
"""Extra: block reading or writing secrets and credential files."""
import os
import re
import sys

sys.path.insert(0, os.path.dirname(__file__))
from common import FILE_TOOLS, block, bash_command, load_input, tool_paths

# File name patterns. .env.example and similar templates are allowed.
SECRET_NAME = re.compile(
    r"(^|/)(\.env(\.(?!example$|sample$|template$)[\w.-]+)?|"
    r"id_(rsa|dsa|ecdsa|ed25519)(\.pub)?|\.npmrc|\.netrc|\.pypirc|"
    r"credentials(\.json)?|secrets?\.(json|ya?ml|toml)|"
    r"[\w.-]+\.(pem|key|p12|pfx|keystore|jks))$"
)
SECRET_DIR = re.compile(r"(^|/)(\.ssh|\.aws|\.gnupg|\.kube|\.docker)(/|$)")

BASH_PATTERN = re.compile(
    r"(?<![\w-])\.env(?!\.(example|sample|template)\b)(\.[\w.-]+)?(?=[\s\"';|&)]|$)"
    r"|id_(rsa|dsa|ecdsa|ed25519)"
    r"|\.(ssh|aws|gnupg|kube)/"
    r"|\.npmrc|\.netrc|\.pypirc"
    r"|\.(pem|p12|pfx|jks)\b"
)

data = load_input()
tool = data.get("tool_name", "")

if tool in FILE_TOOLS:
    for p in tool_paths(data):
        if SECRET_NAME.search(p) or SECRET_DIR.search(p):
            block("Secrets", "Secret or credential files are off limits: %s" % p)

cmd = bash_command(data)
if cmd and BASH_PATTERN.search(cmd):
    block("Secrets", "Command refers to a secret or credential file.")
sys.exit(0)
