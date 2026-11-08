import type { Paginated, PaginationQuery } from "../../common/schemas/common.dto.js";
import type { CreateShowInput } from "./dto/create-show.dto.js";
import type { ListShowsQuery } from "./dto/list-shows.query.dto.js";
import type { ShowResponse } from "./dto/show.response.dto.js";

export type Show = ShowResponse;

export interface ShowFilters extends PaginationQuery {
  cinemaId?: string | undefined;
  movieId?: string | undefined;
  from?: Date | undefined;
  to?: Date | undefined;
}

export interface NewShow extends CreateShowInput {
  endsAt: Date;
}

export interface ShowsRepository {
  findMany(filters: ShowFilters): Promise<{ data: Show[]; total: number }>;
  findById(id: string): Promise<Show | null>;
  findOverlapping(screenId: string, startsAt: Date, endsAt: Date): Promise<Show | null>;
  create(input: NewShow): Promise<Show>;
}

export interface ShowsService {
  list(query: ListShowsQuery): Promise<Paginated<Show>>;
  getById(id: string): Promise<Show>;
  create(input: CreateShowInput): Promise<Show>;
}
