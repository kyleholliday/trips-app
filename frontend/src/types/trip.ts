import { z } from 'zod';

export const TripSchema = z.object({
  id: z.string(),
  name: z.string(),
  destination: z.string(),
  startDate: z.string(), // ISO date
  endDate: z.string(),
  notes: z.string().optional(),
});

export type Trip = z.infer<typeof TripSchema>;
