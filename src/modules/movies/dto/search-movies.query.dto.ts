import { z } from "zod";
import { paginationQueryDto } from "../../../common/schemas/common.dto.js";

export const searchMoviesQueryDto = paginationQueryDto.extend({
  q: z.string().trim().min(1).max(100),
});

export type SearchMoviesQuery = z.infer<typeof searchMoviesQueryDto>;
