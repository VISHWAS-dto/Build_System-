import { z } from "zod";

export const cinemaResponseDto = z.object({
  id: z.uuid(),
  name: z.string(),
  address: z.string(),
  cityId: z.uuid(),
  createdAt: z.coerce.date(),
});

export type CinemaResponse = z.infer<typeof cinemaResponseDto>;
