import { z } from 'zod';

export const attemptSchema = z.object({
    taskId: z.string(),
    userId: z.string(),
    startedAt: z.date(),
    endedAt: z.date(),
    videoUrl: z.string().optional(),
    form: z.record(z.any()),
});