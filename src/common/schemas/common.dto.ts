import { z } from "zod";

export const idParamsDto = z.object({ id: z.uuid() });
export type IdParams = z.infer<typeof idParamsDto>;

export const paginationQueryDto = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
export type PaginationQuery = z.infer<typeof paginationQueryDto>;

export const paginatedDto = <T extends z.ZodType>(item: T) =>
  z.object({
    data: z.array(item),
    meta: z.object({
      page: z.number().int(),
      limit: z.number().int(),
      total: z.number().int(),
    }),
  });

export interface Paginated<T> {
  data: T[];
  meta: { page: number; limit: number; total: number };
}
