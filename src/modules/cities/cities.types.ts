import type { Paginated } from "../../common/schemas/common.dto.js";
import type { CityResponse } from "./dto/city.response.dto.js";
import type { CreateCityInput } from "./dto/create-city.dto.js";
import type { ListCitiesQuery } from "./dto/list-cities.query.dto.js";

export type City = CityResponse;

export interface CitiesRepository {
  findMany(query: ListCitiesQuery): Promise<{ data: City[]; total: number }>;
  findById(id: string): Promise<City | null>;
  findByNameAndState(name: string, state: string): Promise<City | null>;
  create(input: CreateCityInput): Promise<City>;
}

export interface CitiesService {
  list(query: ListCitiesQuery): Promise<Paginated<City>>;
  getById(id: string): Promise<City>;
  create(input: CreateCityInput): Promise<City>;
}
