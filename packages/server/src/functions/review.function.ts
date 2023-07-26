import prisma from '../client/prisma';
import HttpException from '../models/http-exception.model';
import type { ReviewFields } from '@prisma/client';

export const review = async (payload: {
    submissionId: string;
    userId: string;
    content: string;
    fields: {
        [key: string]: number;
    }
}) => {
    const { submissionId, userId, content, fields } = payload;

    const submission = await prisma.attemptSubmission.findUnique({
        where: {
            id: submissionId,
        },
    });

    if (!submission) {
        throw new HttpException(404, 'Submission not found');
    }

    // Get all of the review fields
    const reviewFields = await prisma.reviewFields.findMany();

    // Ensure that the review contains all of the fields
    const reviewFieldKeys = Object.keys(fields);

    if (reviewFieldKeys.length !== reviewFields.length) {
        throw new HttpException(422, `Invalid review: ${reviewFieldKeys.length} keys, ${reviewFields.length} expected`);
    }

    // Ensure that the review contains valid fields
    for (const reviewFieldKey of reviewFieldKeys) {
        const reviewField = reviewFields.find((reviewField) => reviewField.slug === reviewFieldKey);
        if (!reviewField) {
            throw new HttpException(422, `Invalid review: ${reviewFieldKey} not found`);
        }
    }

    // Ensure that the review contains values between 0 and 2
    const reviewFieldValues = Object.values(fields);
    for (const reviewFieldValue of reviewFieldValues) {
        if (reviewFieldValue < 0 || reviewFieldValue > 2) {
            throw new HttpException(422, `Invalid review: ${reviewFieldValue} is not between 0 and 2`);
        }
    }

    // Create the review with a transaction
    const review = prisma.$transaction(async (tx) => {
        const review = await tx.submissionReview.create({
            data: {
                submissionId,
                userId,
                content,
            },
        });

        // Create the review fields
        for (const reviewFieldKey of reviewFieldKeys) {
            const reviewField = reviewFields.find((reviewField) => reviewField.slug === reviewFieldKey) as ReviewFields;
            const reviewFieldValue = fields[reviewFieldKey];

            await tx.submissionFieldValues.create({
                data: {
                    submissionReviewId: review.id,
                    reviewFieldId: reviewField.id,
                    value: reviewFieldValue,
                },
            });
        }

        return review;
    });

    return review;
}

export const getFields = async () => {
    const reviewFields = await prisma.reviewFields.findMany({
        orderBy: {
            order: 'asc',
        },
    });

    return reviewFields;
}

export const getReviews = async (payload: {
    submissionId: string;
}) => {
    const { submissionId } = payload;

    const reviews = await prisma.submissionReview.findMany({
        where: {
            submissionId,
        },
        include: {
            fields: true,
        },
    });

    return reviews;
}

export const getAllReviews = async (payload: {
    userId: string;
}) => {
    const { userId } = payload;

    const reviews = await prisma.submissionReview.findMany({
        where: {
            userId,
        },
        include: {
            fields: true,
        },
        orderBy: {
            createdAt: 'desc',
        }
    });

    return reviews;
}
