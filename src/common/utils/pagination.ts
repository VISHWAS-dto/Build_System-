import type { Paginated, PaginationQuery } from "../schemas/common.dto.js";

export const toSkipTake = ({ page, limit }: PaginationQuery) => ({
  skip: (page - 1) * limit,
  take: limit,
});

export const toPaginated = <T>(data: T[], total: number, query: PaginationQuery): Paginated<T> => ({
  data,
  meta: { page: query.page, limit: query.limit, total },
});
