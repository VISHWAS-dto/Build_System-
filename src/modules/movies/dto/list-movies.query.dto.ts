import type { z } from "zod";
import { paginationQueryDto } from "../../../common/schemas/common.dto.js";

export const listMoviesQueryDto = paginationQueryDto;

export type ListMoviesQuery = z.infer<typeof listMoviesQueryDto>;
