import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx seeds/index.ts",
  },
  datasource: {
    // Read lazily so `prisma generate` works without a DB configured.
    url: process.env["DATABASE_URL"] ?? "",
  },
});
