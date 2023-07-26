/*
    Seed some random users
*/

import { InstitutionRole, PrismaClient } from "@prisma/client";
import { faker } from '@faker-js/faker';

export async function seedUsers(prisma: PrismaClient) {
    // Get all institutions
    const institutions = await prisma.institution.findMany();

    // Create 10 users
    const users = [];
    for (let i = 0; i < institutions.length; i++) {
        // Create a user
        const user = await prisma.user.create({
            data: {
                name: faker.person.fullName(),
                email: faker.internet.email(),
            },
        });

        users.push(user);
    }

    const institutionRoles = [
        "MEMBER",
        "FACILITATOR",
        "ADMIN"
    ]

    // Have each of the users join a random institution with a random role
    for (const user of users) {
        const institution = institutions[Math.floor(Math.random() * institutions.length)];
        const role = institutionRoles[Math.floor(Math.random() * institutionRoles.length)] as InstitutionRole;

        await prisma.userInstitutions.create({
            data: {
                userId: user.id,
                institutionId: institution.id,
                role
            }
        });
    }
}

