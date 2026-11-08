import { z } from "zod";

export const createCityDto = z.object({
  name: z.string().trim().min(1).max(100),
  state: z.string().trim().min(1).max(100),
});

export type CreateCityInput = z.infer<typeof createCityDto>;
