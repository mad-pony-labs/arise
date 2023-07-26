import { PrismaClient } from "@prisma/client";
import admin from 'firebase-admin';

export async function seedReviewFields(prisma: PrismaClient, app: admin.app.App) {
    const db = app.firestore();

    for (const [i, field] of REVIEW_FIELDS.entries()) {
        const fieldId = i + 1;
        await prisma.reviewFields.upsert({
            where: {
                slug: field.title.toLowerCase()
            },
            update: {
                title: field.title,
                slug: field.title.toLowerCase(),
                order: fieldId,

                level1_description: field.levels[0].description,
                level2_description: field.levels[1].description,
                level3_description: field.levels[2].description,
            },
            create: {
                title: field.title,
                slug: field.title.toLowerCase(),
                order: fieldId,

                level1_description: field.levels[0].description,
                level2_description: field.levels[1].description,
                level3_description: field.levels[2].description,
            }
        });
    }
}

// Seed data
export const REVIEW_FIELDS = [
    {
        title: "Respect",
        levels: [
            {
                title: "Beginner",
                description:
                    "Beginner: Frequent unnecessary force on tissue or caused damage by inappropriate use of instruments",
            },
            {
                title: "Intermediate",
                description:
                    "Intermediate: Careful handling of tissue but occasionally caused inadvertent damage",
            },
            {
                title: "Expert",
                description:
                    "Expert: Consistently handled tissue appropriately with minimal damage to tissue",
            },
        ],
    },
    {
        title: "Perception",
        levels: [
            {
                title: "Beginner",
                description:
                    "Beginner: Constantly overshoots, swings, wide, slow correction",
            },
            {
                title: "Intermediate",
                description: "Some overshooting but quick to correct",
            },
            {
                title: "Expert",
                description: "Accurately directs instruments in correct plane",
            },
        ],
    },
    {
        title: "Handling",
        levels: [
            {
                title: "Beginner",
                description: "Beginner: Tentative moves / inappropriate use",
            },
            {
                title: "Intermediate",
                description:
                    "Intermediate: Competent use of instruments / occasionally inappropriate",
            },
            {
                title: "Expert",
                description: "Expert: Fluid moves with instruments",
            },
        ],
    },
    {
        title: "Bimanual",
        levels: [
            {
                title: "Beginner",
                description:
                    "Uses only one hand, poor coordination between hands",
            },
            {
                title: "Intermediate",
                description:
                    "Uses both hands but does not optimize their interaction",
            },
            {
                title: "Expert",
                description:
                    "Expertly uses both hands to provide optimal exposure",
            },
        ],
    },
    {
        title: "Time",
        levels: [
            {
                title: "Beginner",
                description: "Beginner: Many unnecessary moves",
            },
            {
                title: "Intermediate",
                description:
                    "Intermediate: Efficient time / motion but some unnecessary moves",
            },
            {
                title: "Expert",
                description:
                    "Expert: Clear economy of movement. Maximum efficiency",
            },
        ],
    },
    {
        title: "Overall",
        levels: [
            {
                title: "Beginner",
                description: "Novice",
            },
            {
                title: "Intermediate",
                description: "Experienced",
            },
            {
                title: "Expert",
                description: "Expert",
            },
        ],
    },
];
