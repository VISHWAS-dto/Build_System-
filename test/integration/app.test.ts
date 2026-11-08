import type { FastifyInstance } from "fastify";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { bootstrap } from "../../src/bootstrap/index.js";

// These tests never touch the database: they cover wiring, validation and error shape.
describe("app wiring", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await bootstrap();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /health returns ok", async () => {
    const res = await app.inject({ method: "GET", url: "/health" });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: "ok" });
  });

  it("returns a consistent 404 body for unknown routes", async () => {
    const res = await app.inject({ method: "GET", url: "/nope" });
    expect(res.statusCode).toBe(404);
    expect(res.json().error.code).toBe("ROUTE_NOT_FOUND");
  });

  it("returns 400 VALIDATION_ERROR for an invalid body", async () => {
    const res = await app.inject({ method: "POST", url: "/api/v1/cities", payload: { name: "" } });
    expect(res.statusCode).toBe(400);
    expect(res.json().error.code).toBe("VALIDATION_ERROR");
  });

  it("returns 400 for a non-uuid id", async () => {
    const res = await app.inject({ method: "GET", url: "/api/v1/shows/not-a-uuid" });
    expect(res.statusCode).toBe(400);
  });

  it("returns 503 SEARCH_UNAVAILABLE when Elasticsearch is disabled", async () => {
    const res = await app.inject({ method: "GET", url: "/api/v1/movies/search?q=inception" });
    expect(res.statusCode).toBe(503);
    expect(res.json().error.code).toBe("SEARCH_UNAVAILABLE");
  });

  it("serves the OpenAPI document", async () => {
    const res = await app.inject({ method: "GET", url: "/docs/json" });
    expect(res.statusCode).toBe(200);
    const paths = Object.keys(res.json().paths);
    for (const resource of ["cities", "cinemas", "movies", "shows"]) {
      expect(paths.some((p) => p.startsWith(`/api/v1/${resource}`))).toBe(true);
    }
  });
});
