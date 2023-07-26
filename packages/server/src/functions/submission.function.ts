import prisma from '../client/prisma';
import HttpException from '../models/http-exception.model';
import type { AttemptSubmission } from '@prisma/client';

export const create = async (payload: {
    attemptId: string;
    userId: string;
}): Promise<AttemptSubmission> => {
    const { attemptId, userId } = payload;

    const attempt = await prisma.taskAttempt.findUnique({
        where: {
            id: attemptId,
        },
    });

    if (!attempt) {
        throw new HttpException(404, 'Attempt not found');
    }

    const submission = await prisma.attemptSubmission.create({
        data: {
            attemptId,
            userId,
        },
    });

    return submission;
}

export const get = async (payload: {
    id: string;
}) => {
    const { id } = payload;

    const submission = await prisma.attemptSubmission.findUnique({
        where: {
            id,
        },
    });

    if (!submission) {
        throw new HttpException(404, 'Submission not found');
    }

    return submission;
}

export const getAll = async (payload: {
    userId: string;
}) => {
    const { userId } = payload;

    const submissions = await prisma.attemptSubmission.findMany({
        where: {
            userId,
        },
    });

    return submissions;
}

export const getAllForTask = async (payload: {
    userId: string;
    taskId: string;
}) => {
    const { userId, taskId } = payload;

    const submissions = await prisma.attemptSubmission.findMany({
        where: {
            userId,
            attempt: {
                taskId,
            },
        },
    });

    return submissions;
}


