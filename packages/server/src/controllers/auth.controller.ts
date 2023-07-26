import { NextFunction, Request, Response, Router } from 'express';
import { createUser } from '../functions/auth.function';
import { validate } from '../utils/validate.utils';
import { createUserSchema } from '../models/auth.model';
import { isAuthorized } from '../middleware/authn';

const router = Router();

/**
 * Create an user
 * @auth none
 * @route {POST} /users
 * @bodyparam user User
 * @returns user User
 */
router.post('/register', validate(createUserSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await createUser(req.body);
        res.json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * Get current user
 * @auth required
 * @route {GET} /users/me
 * @bodyparam user User
 * @returns user User
 */
router.get('/me', isAuthorized, async (req, res: Response, next: NextFunction) => {
    try {
        res.json({
            status: 'success',
            data: {
                user: req.user
            }
        });
    } catch (error) {
        next(error);
    }
});


export default router;