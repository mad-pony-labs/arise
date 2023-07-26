import { NextFunction, Request, Response } from 'express';
import prisma from '../client/prisma';


export const addUsersToPrisma = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next();

    const user = await prisma.user.findUnique({
        where: {
            id: req.user?.uid
        }
    });

    if (!user) {
        // TODO: May be useful to add the rest of the user's data from firebase here

        await prisma.user.create({
            data: {
                id: req.user?.uid,
                email: req.user?.email || '',
                name: req.user?.name,
            }
        });
    }

    next();
}