import { NextFunction, Request, Response, Router } from 'express';
import { createUser } from '../functions/auth.function';
import { isAuthorized } from '../middleware/authn';
import { clear, fill } from '../functions/network.function';

const router = Router();

/**
 * Fills a User's Network
 * @auth none
 * @route {POST} /network/fill
 * @bodyparam user User
 * @returns user User
 */
router.post('/fill', isAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const network = await fill({
            userId: req.user?.uid,
        });
        res.json({
            status: 'success',
            data: {
                network,
            },
        });
    } catch (error) {
        next(error);
    }
});

router.delete('/clear', isAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const count = await clear({
            userId: req.user?.uid,
        });
        res.json({
            status: 'success',
            data: {
                count,
            },
        });
    } catch (error) {
        next(error);
    }
});

export default router;