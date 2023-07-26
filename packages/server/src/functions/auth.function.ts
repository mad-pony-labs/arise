import prisma from '../client/prisma';
import HttpException from '../models/http-exception.model';
import type { User } from '@prisma/client';
import { auth } from '../client/firebase';

export const createUser = async (input: {
    email: string;
    name: string;
    password: string;
}): Promise<Partial<User>> => {
    const { email, name, password } = input;

    const userRecord = await auth.createUser({
        email,
        password,
        displayName: name,
    }).catch((error) => {
        throw new HttpException(422, { email: [error.message] });
    });

    const user = await prisma.user.create({
        data: {
            id: userRecord.uid,
            email,
            name,
        },
        select: {
            email: true,
            name: true,
        },
    });

    return {
        ...user
    };
};

export const get = async (payload: {
    email: string;
}) => {
    const { email } = payload;

    const user = auth.getUserByEmail(email).catch((error) => {
        throw new HttpException(422, { email: [error.message] });
    });

    if (!user) {
        throw new HttpException(404, { email: ['not found'] });
    }

    return user;
};