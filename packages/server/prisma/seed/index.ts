import { PrismaClient } from "@prisma/client";
import admin from 'firebase-admin';
import serviceAccount from "../../service-account.json";

// Seeders
import { seedInstitutions } from "./institutions";
import { seedTasks } from "./tasks";
import { seedUsers } from "./users";
import { seedReviewFields } from "./reviewFields";

const prisma = new PrismaClient();
const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});

async function main() {
    await seedInstitutions(prisma, app);
    await seedTasks(prisma, app);
    await seedUsers(prisma);
    await seedReviewFields(prisma, app);
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

