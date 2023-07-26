import prisma from '../client/prisma';
import HttpException from '../models/http-exception.model';
import type { User } from '@prisma/client';

const MAX_MENTORS = 5;

// Function to fill a network with mentors for a given user
export const fill = async (payload: {
    userId: string;
}) => {
    const { userId } = payload;

    // Get the user from the database
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            network: {
                include: {
                    mentor: true,
                },
            },
            institutions: {
                include: {
                    institution: true,
                },
            }
        },
    });

    // If the user doesn't exist, throw an error
    if (!user) {
        throw new HttpException(404, 'User not found');
    }

    // If the user already has a full network, throw an error
    if (user.network.length >= MAX_MENTORS) {
        throw new HttpException(422, 'Network already full');
    }

    const newMentors: User[] = [];

    // Find all the mentors in the user's institutions
    const institutionMentors = await prisma.userInstitutions.findMany({
        distinct: ['userId'],
        where: {
            institutionId: {
                in: user.institutions.map((userInstitution) => userInstitution.institutionId),
            },
            userId: {
                not: userId,
            },
            role: 'FACILITATOR',
        },
        include: {
            user: true,
        },
        take: MAX_MENTORS - user.network.length,
    });
    newMentors.push(...institutionMentors.map((institutionMentor) => institutionMentor.user));

    // If the user's network is still not full, find mentors from other institutions
    if (newMentors.length + user.network.length < MAX_MENTORS) {
        const otherMentors = await prisma.userInstitutions.findMany({
            distinct: ['userId'],
            where: {
                institutionId: {
                    notIn: user.institutions.map((userInstitution) => userInstitution.institutionId),
                },
                userId: {
                    not: userId,
                },
                role: 'FACILITATOR',
            },
            include: {
                user: true,
            },
            take: MAX_MENTORS - user.network.length - newMentors.length,
        });
        newMentors.push(...otherMentors.map((otherMentor) => otherMentor.user));
    }

    // Add the mentors to the user's network
    await prisma.network.createMany({
        data: newMentors.map((newMentor) => ({
            userId,
            mentorId: newMentor.id,
        })),
    });

    return newMentors;
}

export const clear = async (payload: {
    userId: string;
}) => {
    const { userId } = payload;

    // Get the user from the database
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            network: {
                include: {
                    mentor: true,
                },
            },
        },
    });

    // If the user doesn't exist, throw an error
    if (!user) {
        throw new HttpException(404, 'User not found');
    }

    // Delete the user's network
    const result = await prisma.network.deleteMany({
        where: {
            userId,
        },
    });

    return result.count;
}