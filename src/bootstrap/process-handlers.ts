import type { FastifyInstance } from "fastify";

export const initProcessHandlers = (app: FastifyInstance): void => {
  let closing = false;

  const shutdown = async (reason: string, exitCode: number) => {
    if (closing) return;
    closing = true;
    app.log.info({ reason }, "shutting down");
    try {
      await app.close();
      process.exit(exitCode);
    } catch (err) {
      app.log.error({ err }, "error during shutdown");
      process.exit(1);
    }
  };

  process.on("SIGINT", () => void shutdown("SIGINT", 0));
  process.on("SIGTERM", () => void shutdown("SIGTERM", 0));
  process.on("unhandledRejection", (err) => {
    app.log.error({ err }, "unhandled rejection");
    void shutdown("unhandledRejection", 1);
  });
  process.on("uncaughtException", (err) => {
    app.log.fatal({ err }, "uncaught exception");
    void shutdown("uncaughtException", 1);
  });
};
