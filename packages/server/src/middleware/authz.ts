import { NextFunction, Request, Response } from 'express';
import prisma from '../client/prisma';
import HttpException from '../models/http-exception.model';

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        throw new HttpException(401, 'You are not authorised to perform this action');
    }

    const user = await prisma.user.findUnique({
        where: {
            id: req.user.uid
        }
    });

    if (!user || (user && user.role !== 'ADMIN')) {
        throw new HttpException(403, 'You are not authorised to perform this action');
    }

    next();
};

export const inUsersNetwork = async (req: Request, res: Response, next: NextFunction) => {
    // Get user id from request params or body
    const userId = req.params.userId || req.body.userId;

    if (!userId) {
        throw new HttpException(400, 'User id is required');
    }

    if (!req.user) {
        throw new HttpException(401, 'You are not authorised to perform this action');
    }

    // Check if the user is an admin
    const user = await prisma.user.findUnique({
        where: {
            id: req.user.uid
        }
    });

    if (user && user.role === 'ADMIN') {
        next();
    }

    // Check if the user is in the mentor's network
    const connection = await prisma.network.findFirst({
        where: {
            AND: [
                {
                    mentor: {
                        id: req.user.uid
                    }
                },
                {
                    user: {
                        id: userId
                    }
                }
            ]
        }
    });

    if (!connection) {
        throw new HttpException(403, 'You are not authorised to perform this action');
    }

    next();
};

