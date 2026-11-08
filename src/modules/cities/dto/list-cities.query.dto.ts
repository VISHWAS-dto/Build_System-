import type { z } from "zod";
import { paginationQueryDto } from "../../../common/schemas/common.dto.js";

export const listCitiesQueryDto = paginationQueryDto;

export type ListCitiesQuery = z.infer<typeof listCitiesQueryDto>;
