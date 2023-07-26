import { NextFunction, Request, Response, Router } from 'express';
import { getHistory, getHistoryByTask } from '../functions/history.function';
import { isAuthorized } from '../middleware/authn';

const router = Router();

/**
 * Get all the attempt history for a user 
 * @auth required
 * @route {GET} /attempt/
 * @bodyparam attempt Attempt[]
 * @returns attempt Attempt[]
 */
router.get('/', isAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const history = await getHistory({
            userId: req.user?.uid,
        });
        res.json({
            status: 'success',
            data: {
                history
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * Get all the attempt history for a user
 * @auth required
 * @route {GET} /attempt/:taskId
 * @bodyparam attempt Attempt[]
 * @returns attempt Attempt[]
 * @returns count number
 */
router.get('/:taskId', isAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const history = await getHistoryByTask({
            userId: req.user?.uid,
            taskId: req.params.taskId,
        });
        res.json({
            status: 'success',
            data: {
                history
            }
        });
    } catch (error) {
        next(error);
    }
});