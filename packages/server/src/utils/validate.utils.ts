import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export const validate = (schema: AnyZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
        } catch (error: unknown) {
            res.status(401).json({
                status: 'error',
                error: (error as ZodError).errors,
            });
        }
        return next();
    };