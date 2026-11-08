import { z } from "zod";
import { paginationQueryDto } from "../../../common/schemas/common.dto.js";

export const listShowsQueryDto = paginationQueryDto.extend({
  cinemaId: z.uuid().optional(),
  movieId: z.uuid().optional(),
  date: z.iso.date().optional(), // YYYY-MM-DD, interpreted as a UTC day
});

export type ListShowsQuery = z.infer<typeof listShowsQueryDto>;
