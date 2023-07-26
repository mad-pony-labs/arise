import prisma from '../client/prisma';
import HttpException from '../models/http-exception.model';
import type { User } from '@prisma/client';
import { auth } from '../client/firebase';

// Get all the attempts for a user and whether they have submissions
export const getHistory = async (payload: {
    userId: string;
}) => {
    const { userId } = payload;

    const attempts = await prisma.taskAttempt.findMany({
        where: {
            userId,
        },
        include: {
            submissions: true,
        },
        orderBy: {
            startedAt: 'desc',
        }
    });

    return attempts;
}

export const getHistoryByTask = async (payload: {
    userId: string;
    taskId: string;
}) => {
    const { userId, taskId } = payload;

    const attempts = await prisma.taskAttempt.findMany({
        where: {
            userId,
            taskId,
        },
        include: {
            submissions: true,
        },
        orderBy: {
            startedAt: 'desc',
        }
    });

    return attempts;
}
