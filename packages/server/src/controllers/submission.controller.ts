import { NextFunction, Request, Response, Router } from 'express';
import { validate } from '../utils/validate.utils';
import { submissionSchema } from '../models/submission.model';
import { create, get, getAll, getAllForTask } from '../functions/submission.function';
import { isAuthorized } from '../middleware/authn';

const router = Router();

/**
 * Create a submission
 * @auth required
 * @route {POST} /submissions/create
 * @bodyparam attempt Attempt
 * @returns attempt Attempt
 */
router.post('/create', isAuthorized, validate(submissionSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const submission = await create({
            userId: req.user?.uid,
            ...req.body,
        });
        res.json({
            status: 'success',
            data: {
                submission
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * Get a submission
 * @auth required
 * @route {GET} /submissions/:id
 * @returns submission Submission
 * @returns attempt Attempt
 */
router.get('/:id', isAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const submission = await get({
            id: req.params.id,
        });
        res.json({
            status: 'success',
            data: {
                submission
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * Get all submissions for a user
 * @auth required
 * @route {GET} /submissions
 * @returns submissions Submission[]
 * @returns count number
 */
router.get('/', isAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const submissions = await getAll({
            userId: req.user?.uid,
        });
        res.json({
            status: 'success',
            data: {
                submissions,
                count: submissions.length
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * Get all submissions for a task
 * @auth required
 * @route {GET} /submissions/task/:taskId
 * @returns submissions Submission[]
 * @returns count number
 */
router.get('/task/:taskId', isAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const submissions = await getAllForTask({
            userId: req.user?.uid,
            taskId: req.params.taskId,
        });
        res.json({
            status: 'success',
            data: {
                submissions,
                count: submissions.length
            }
        });
    } catch (error) {
        next(error);
    }
});

export default router;