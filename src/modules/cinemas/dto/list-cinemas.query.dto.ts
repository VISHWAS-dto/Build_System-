import { z } from "zod";
import { paginationQueryDto } from "../../../common/schemas/common.dto.js";

export const listCinemasQueryDto = paginationQueryDto.extend({
  cityId: z.uuid().optional(),
});

export type ListCinemasQuery = z.infer<typeof listCinemasQueryDto>;
