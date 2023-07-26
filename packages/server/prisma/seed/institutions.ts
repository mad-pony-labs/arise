/*
Seed institutions from the old database
*/

import { PrismaClient } from "@prisma/client";
import admin from 'firebase-admin';

export async function seedInstitutions(prisma: PrismaClient, app: admin.app.App) {
    const db = app.firestore();

    const institutions: any[] = []
    await db.collection('institutions').get().then((snapshot) => {
        snapshot.forEach((doc) => institutions.push({
            id: doc.id,
            ...doc.data()
        }));
    });

    for (const institution of institutions) {
        await prisma.institution.upsert({
            where: {
                id: institution.id
            },
            update: {
                name: institution.name,
                logo: institution.logo
            },
            create: {
                id: institution.id,
                name: institution.name,
                logo: institution.logo
            }
        });
    }
}