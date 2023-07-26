import { NextFunction, Request, Response, Router } from 'express';
import { validate } from '../utils/validate.utils';
import { review, getFields, getReviews, getAllReviews } from '../functions/review.function';
import { inUsersNetwork } from '../middleware/authz';
import { reviewSchema } from '../models/review.model';
import { isAuthorized } from '../middleware/authn';

const router = Router();

/**
 * Create a review
 * @auth In user's network or admin
 * @route {POST} /review/create
 * @bodyparam review Review
 * @returns review Review
 */
router.post('/create', inUsersNetwork, validate(reviewSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await review({
            userId: req.user?.uid,
            ...req.body,
        });
        res.json({
            status: 'success',
            data: {
                result
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * Get the template for a review
 * @auth Required
 * @route {GET} /review/template
 * @returns review Review
 */
router.get('/template', isAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const review = await getFields();
        res.json({
            status: 'success',
            data: {
                review
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * Get all reviews for a user
 * @auth required
 * @route {GET} /review
 * @returns reviews Review[]
 * @returns count number
 */
router.get('/', isAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviews = await getAllReviews({
            userId: req.user?.uid,
        });
        res.json({
            status: 'success',
            data: {
                reviews,
                count: reviews.length
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * Get all reviews for a submission
 * @auth required
 * @route {GET} /review/submission/:id
 * @returns reviews Review[]
 * @returns count number
 */
router.get('/submission/:id', isAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviews = await getReviews({
            submissionId: req.params.id,
        });
        res.json({
            status: 'success',
            data: {
                reviews,
                count: reviews.length
            }
        });
    } catch (error) {
        next(error);
    }
});

export default router;