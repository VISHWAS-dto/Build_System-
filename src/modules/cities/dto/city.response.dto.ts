import { z } from "zod";

export const cityResponseDto = z.object({
  id: z.uuid(),
  name: z.string(),
  state: z.string(),
  createdAt: z.coerce.date(),
});

export type CityResponse = z.infer<typeof cityResponseDto>;
