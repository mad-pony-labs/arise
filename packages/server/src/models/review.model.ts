import { z } from 'zod';

export const reviewSchema = z.object({
    submissionId: z.string(),
    userId: z.string(),
    content: z.string(),
    fields: z.record(z.number()),
});