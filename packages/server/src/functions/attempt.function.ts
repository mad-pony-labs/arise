import prisma from '../client/prisma';
import HttpException from '../models/http-exception.model';
import type { TaskAttempt } from '@prisma/client';

export const create = async (payload: {
    taskId: string;
    userId: string;
    startedAt: Date;
    endedAt: Date;
    videoUrl?: string;
    form: {
        [key: string]: any;
    };
}): Promise<TaskAttempt> => {
    const { taskId, userId, startedAt, endedAt, videoUrl, form } = payload;

    const task = await prisma.task.findUnique({
        where: {
            id: taskId,
        },
        include: {
            form: true,
        },
    });

    if (!task) {
        throw new HttpException(404, 'Task not found');
    }

    // Ensure that the form is valid
    const formKeys = Object.keys(form);
    const formValues = Object.values(form);

    if (formKeys.length !== task.form.length) {
        throw new HttpException(422, `Invalid form: ${formKeys.length} keys, ${task.form.length} expected`);
    }

    // Ensure that the form is valid
    for (let i = 0; i < formKeys.length; i++) {
        const formKey = formKeys[i];
        const formValue = formValues[i];

        const formField = task.form.find((formField) => formField.slug === formKey);

        if (!formField) {
            throw new HttpException(422, `Invalid form: ${formKey} not found`);
        }

        if (formField.type === 'BOOLEAN') {
            if (typeof formValue !== 'boolean') {
                throw new HttpException(422, `Invalid form: ${formKey} is not a boolean`);
            }
        } else if (formField.type === 'NUMBER') {
            if (typeof formValue !== 'number') {
                throw new HttpException(422, `Invalid form: ${formKey} is not a number`);
            }
        }
    }

    const taskAttempt = await prisma.taskAttempt.create({
        data: {
            taskId,
            userId,
            startedAt,
            endedAt,
            videoUrl,
            form,
        },
    });

    return taskAttempt;
}

export const get = async (payload: {
    id: string;
}) => {
    const { id } = payload;

    const taskAttempt = await prisma.taskAttempt.findUnique({
        where: {
            id,
        }
    });

    if (!taskAttempt) {
        throw new HttpException(404, "Task attempt not found");
    }

    return taskAttempt;
}

export const getAll = async (payload: {
    userId: string;
}) => {
    const taskAttempts = await prisma.taskAttempt.findMany({
        where: {
            userId: payload.userId,
        },
        orderBy: {
            startedAt: 'desc',
        },
    });

    return taskAttempts;
}

export const getAllForTask = async (payload: {
    userId: string;
    taskId: string;
}) => {
    const { userId, taskId } = payload;

    const taskAttempts = await prisma.taskAttempt.findMany({
        where: {
            userId,
            taskId,
        },
        orderBy: {
            startedAt: 'desc',
        },
    });

    return taskAttempts;
}

export const deleteAttempt = async (payload: {
    id: string;
}) => {
    const { id } = payload;

    const taskAttempt = await prisma.taskAttempt.delete({
        where: {
            id,
        },
    });

    return taskAttempt;
}



