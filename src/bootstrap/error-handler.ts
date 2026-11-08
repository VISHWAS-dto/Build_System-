import type { FastifyError, FastifyInstance } from "fastify";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";
import { Prisma } from "../generated/prisma/client.js";
import { AppError, type ErrorDetail } from "../common/errors/index.js";

interface ErrorBody {
  error: { code: string; message: string; details: ErrorDetail[] };
}

const body = (code: string, message: string, details: ErrorDetail[] = []): ErrorBody => ({
  error: { code, message, details },
});

export const initErrorHandler = (app: FastifyInstance): void => {
  app.setNotFoundHandler((request, reply) => {
    reply
      .code(404)
      .send(body("ROUTE_NOT_FOUND", `Route ${request.method} ${request.url} not found`));
  });

  app.setErrorHandler((error: FastifyError | Error, request, reply) => {
    if (hasZodFastifySchemaValidationErrors(error)) {
      const details = error.validation.map((v) => ({
        path: v.instancePath.replace(/^\//, "").replaceAll("/", "."),
        message: v.message ?? "Invalid value",
      }));
      return reply.code(400).send(body("VALIDATION_ERROR", "Request validation failed", details));
    }

    if (error instanceof AppError) {
      return reply.code(error.statusCode).send(body(error.code, error.message, error.details));
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002")
        return reply.code(409).send(body("CONFLICT", "Resource already exists"));
      if (error.code === "P2025")
        return reply.code(404).send(body("NOT_FOUND", "Resource not found"));
    }

    const statusCode =
      "statusCode" in error && typeof error.statusCode === "number" ? error.statusCode : 500;
    if (statusCode < 500) {
      return reply.code(statusCode).send(body("REQUEST_ERROR", error.message));
    }

    request.log.error({ err: error }, "unhandled error");
    return reply.code(500).send(body("INTERNAL_ERROR", "Something went wrong"));
  });
};
