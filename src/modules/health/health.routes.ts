import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

const statusDto = z.object({ status: z.string() });

export const healthRoutes: FastifyPluginAsyncZod = async (app) => {
  // Liveness: process is up.
  app.get("/health", { schema: { tags: ["Health"], response: { 200: statusDto } } }, async () => ({
    status: "ok",
  }));

  // Readiness: process can reach every dependency that is enabled.
  app.get(
    "/health/ready",
    { schema: { tags: ["Health"], response: { 200: statusDto, 503: statusDto } } },
    async (_request, reply) => {
      const checks: Record<string, () => Promise<unknown>> = {
        database: () => app.prisma.$queryRaw`SELECT 1`,
        ...(app.redis ? { redis: () => app.redis!.ping() } : {}),
        ...(app.searchEngine.enabled
          ? {
              elasticsearch: async () => {
                if (!(await app.searchEngine.ping())) throw new Error("ping failed");
              },
            }
          : {}),
      };

      for (const [name, check] of Object.entries(checks)) {
        try {
          await check();
        } catch (err) {
          app.log.error({ err, dependency: name }, "readiness check failed");
          return reply.code(503).send({ status: `${name}_unavailable` });
        }
      }
      return { status: "ok" };
    },
  );
};
