import { z } from "zod";

export const movieResponseDto = z.object({
  id: z.uuid(),
  title: z.string(),
  language: z.string(),
  durationMin: z.number().int(),
  createdAt: z.coerce.date(),
});

export type MovieResponse = z.infer<typeof movieResponseDto>;
