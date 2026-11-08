import { describe, expect, it } from "vitest";
import { createCitiesService } from "../../src/modules/cities/cities.service.js";
import type { City, CitiesRepository } from "../../src/modules/cities/cities.types.js";

const city: City = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "Mumbai",
  state: "Maharashtra",
  createdAt: new Date(),
};

const fakeRepo = (overrides: Partial<CitiesRepository> = {}): CitiesRepository => ({
  findMany: async () => ({ data: [city], total: 1 }),
  findById: async () => null,
  findByNameAndState: async () => null,
  create: async () => city,
  ...overrides,
});

describe("cities service", () => {
  it("throws CITY_NOT_FOUND when the city does not exist", async () => {
    const service = createCitiesService(fakeRepo());
    await expect(service.getById(city.id)).rejects.toMatchObject({
      code: "CITY_NOT_FOUND",
      statusCode: 404,
    });
  });

  it("throws CITY_ALREADY_EXISTS for a duplicate city", async () => {
    const service = createCitiesService(fakeRepo({ findByNameAndState: async () => city }));
    await expect(service.create({ name: "Mumbai", state: "Maharashtra" })).rejects.toMatchObject({
      code: "CITY_ALREADY_EXISTS",
      statusCode: 409,
    });
  });

  it("returns paginated results", async () => {
    const service = createCitiesService(fakeRepo());
    const result = await service.list({ page: 1, limit: 20 });
    expect(result.meta).toEqual({ page: 1, limit: 20, total: 1 });
    expect(result.data).toHaveLength(1);
  });
});
