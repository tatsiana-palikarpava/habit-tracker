import { z } from 'zod';

export const createHabitSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  frequency: z.number(),
  deadline: z.string().date(),
});
