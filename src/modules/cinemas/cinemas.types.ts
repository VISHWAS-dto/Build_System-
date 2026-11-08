import type { Paginated } from "../../common/schemas/common.dto.js";
import type { CinemaResponse } from "./dto/cinema.response.dto.js";
import type { CreateCinemaInput } from "./dto/create-cinema.dto.js";
import type { ListCinemasQuery } from "./dto/list-cinemas.query.dto.js";

export type Cinema = CinemaResponse;

export interface Screen {
  id: string;
  name: string;
  cinemaId: string;
}

export interface CinemasRepository {
  findMany(query: ListCinemasQuery): Promise<{ data: Cinema[]; total: number }>;
  findById(id: string): Promise<Cinema | null>;
  findScreenById(id: string): Promise<Screen | null>;
  create(input: CreateCinemaInput): Promise<Cinema>;
}

export interface CinemasService {
  list(query: ListCinemasQuery): Promise<Paginated<Cinema>>;
  getById(id: string): Promise<Cinema>;
  getScreen(id: string): Promise<Screen>;
  create(input: CreateCinemaInput): Promise<Cinema>;
}
