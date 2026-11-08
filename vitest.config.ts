import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    env: {
      NODE_ENV: "test",
      LOG_LEVEL: "silent",
      // Force integrations off so a local .env can never make tests hit real services.
      REDIS_ENABLED: "false",
      ELASTICSEARCH_ENABLED: "false",
      TELEMETRY_ENABLED: "false",
      MONITORING_ENABLED: "false",
      // Dummy URL: tests never open a real DB connection.
      DATABASE_URL: "postgresql://test:test@localhost:5432/book_show_test",
    },
  },
});
