#!/usr/bin/env python3
"""Rule 3: block database access and destructive queries."""
import os
import re
import sys

sys.path.insert(0, os.path.dirname(__file__))
from common import block, bash_command, load_input

PATTERNS = [
    # Destructive SQL
    r"(?i)\b(delete\s+from|drop\s+(table|database|schema|index|view)|truncate\s+(table\s+)?\w)",
    # DB clients and CLIs
    r"(?<![\w./-])(psql|mysql|mariadb|sqlite3|mongosh|mongo|redis-cli|sqlcmd|pg_dump|pg_restore|mysqldump|cqlsh)(?=\s|$)",
    # Migration, seed, ORM tools
    r"\b(prisma\s+(migrate|db)|drizzle-kit|sequelize(-cli)?\s|knex\s+(migrate|seed)|typeorm\s+(migration|schema)|alembic\s|flask\s+db|rails\s+db|rake\s+db|manage\.py\s+(migrate|flush|sqlflush|dbshell)|supabase\s+db|neonctl|vercel\s+(env|storage|integration))",
    r"(?i)\b(db:(migrate|seed|drop|reset)|migrate:(fresh|reset)|db\s+(push|reset|seed|migrate))\b",
]

data = load_input()
cmd = bash_command(data)
if cmd:
    for p in PATTERNS:
        if re.search(p, cmd):
            block(
                "Rule 3: Database protection",
                "Database access, DELETE/DROP/TRUNCATE, migrations and seeds need owner approval.",
            )
sys.exit(0)
