import prisma from '../client/prisma';
import HttpException from '../models/http-exception.model';
import type { Institution } from '@prisma/client';

export const create = async (input: {
    name: string;
}): Promise<Institution> => {
    const { name } = input;

    const institution = await prisma.institution.create({
        data: {
            name,
        },
    });

    return institution;
}

export const get = async (payload: {
    id: string;
}) => {
    const { id } = payload;

    const institution = await prisma.institution.findUnique({
        where: {
            id,
        },
    });

    if (!institution) {
        throw new HttpException(404, "Institution not found");
    }

    return institution;
}

export const getAll = async () => {
    const institutions = await prisma.institution.findMany();

    return institutions;
}

export const update = async (payload: {
    id: string;
    name: string;
    logo: string;
}) => {
    const { id, name, logo } = payload;

    const institution = await prisma.institution.update({
        where: {
            id,
        },
        data: {
            name,
            logo,
        },
    });

    return institution;
}

export const join = async (payload: {
    id: string;
    userId: string;
}) => {
    const { id, userId } = payload;

    const institution = await prisma.institution.findUnique({
        where: {
            id,
        },
    });

    if (!institution) {
        throw new HttpException(404, "Institution not found");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
        throw new HttpException(404, "User not found");
    }

    const userInstitution = await prisma.userInstitutions.create({
        data: {
            userId,
            institutionId: id,
        },
    }).catch((error) => {
        throw new HttpException(422, "User already joined this institution");
    });

    return userInstitution;
}

export const leave = async (payload: {
    id: string;
    userId: string;
}) => {
    const { id, userId } = payload;

    const userInstitution = await prisma.userInstitutions.delete({
        where: {
            userId_institutionId: {
                userId,
                institutionId: id,
            },
        },
    });

    return userInstitution;
}

export const getMembers = async (payload: {
    id: string;
}) => {
    const { id } = payload;

    const userInstitutions = await prisma.userInstitutions.findMany({
        where: {
            institutionId: id,
        },
        include: {
            user: true,
        },
    });

    return userInstitutions;
}
