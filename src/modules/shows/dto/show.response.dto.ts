import { z } from "zod";

export const showResponseDto = z.object({
  id: z.uuid(),
  movieId: z.uuid(),
  screenId: z.uuid(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  price: z.number().int(),
});

export type ShowResponse = z.infer<typeof showResponseDto>;
