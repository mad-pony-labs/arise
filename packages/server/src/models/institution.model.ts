import { z } from 'zod';

export const createSchema = z.object({
    name: z.string().min(3).max(255).optional(),
    logo: z.string().optional(),
});

export const updateSchema = z.object({
    name: z.string().min(3).max(255).optional(),
    logo: z.string().optional(),
});