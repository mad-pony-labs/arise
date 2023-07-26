import { z } from 'zod';

export const submissionSchema = z.object({
    attemptId: z.string(),
});