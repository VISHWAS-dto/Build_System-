import { z } from "zod";

export const createMovieDto = z.object({
  title: z.string().trim().min(1).max(200),
  language: z.string().trim().min(1).max(50),
  durationMin: z.number().int().min(1).max(600),
});

export type CreateMovieInput = z.infer<typeof createMovieDto>;
