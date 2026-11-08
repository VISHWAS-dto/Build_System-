import { z } from "zod";

export const createCinemaDto = z.object({
  name: z.string().trim().min(1).max(150),
  address: z.string().trim().min(1).max(300),
  cityId: z.uuid(),
});

export type CreateCinemaInput = z.infer<typeof createCinemaDto>;
