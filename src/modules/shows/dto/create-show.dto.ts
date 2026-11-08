import { z } from "zod";

export const createShowDto = z.object({
  movieId: z.uuid(),
  screenId: z.uuid(),
  startsAt: z.coerce.date(),
  price: z.number().int().positive(),
});

export type CreateShowInput = z.infer<typeof createShowDto>;
