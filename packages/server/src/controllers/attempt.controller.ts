import { NextFunction, Request, Response, Router } from 'express';
import { validate } from '../utils/validate.utils';
import { attemptSchema } from '../models/attempt.model';
import { create, get, getAll, getAllForTask, deleteAttempt } from '../functions/attempt.function';
import { isAuthorized } from '../middleware/authn';

const router = Router();

/**
 * Create an attempt
 * @auth required
 * @route {POST} /attempt/create
 * @bodyparam attempt Attempt
 * @returns attempt Attempt
 */
router.post('/create', isAuthorized, validate(attemptSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const attempt = await create({
            userId: req.user?.uid,
            ...req.body,
        });
        res.json({
            status: 'success',
            data: {
                attempt
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * Get an attempt
 * @auth required
 * @route {GET} /attempt/:id
 * @returns attempt Attempt
 */
router.get('/:id', isAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const attempt = await get({
            id: req.params.id,
        });
        res.json({
            status: 'success',
            data: {
                attempt
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * Get all attempts for a user
 * @auth required
 * @route {GET} /attempt
 * @returns attempts Attempt[]
 */
router.get('/', isAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const attempts = await getAll({
            userId: req.user?.uid,
        });
        res.json({
            status: 'success',
            data: {
                attempts
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * Get all attempts for a task
 * @auth required
 * @route {GET} /attempt/task/:taskId
 * @returns attempts Attempt[]
 */
router.get('/task/:taskId', isAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const attempts = await getAllForTask({
            userId: req.user?.uid,
            taskId: req.params.taskId,
        });
        res.json({
            status: 'success',
            data: {
                attempts
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * Delete an attempt
 * @auth required
 * @route {DELETE} /attempt/:id
 * @returns attempt Attempt
 */
router.delete('/:id', isAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const attempt = await deleteAttempt({
            id: req.params.id,
        });
        res.json({
            status: 'success',
            data: {
                attempt
            }
        });
    } catch (error) {
        next(error);
    }
});

export default router;