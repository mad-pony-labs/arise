import { NextFunction, Request, Response, Router } from 'express';
import { validate } from '../utils/validate.utils';
import { isAdmin } from '../middleware/authz';
import { create, get, getAll, join, leave, getMembers, update } from '../functions/institution.function';
import { createSchema, updateSchema } from '../models/institution.model';
import { isAuthorized } from '../middleware/authn';

const router = Router();

/**
 * Create an institution
 * @auth ADMIN
 * @route {POST} /institutions/create
 * @returns institution Institution
 */
router.post('/create', isAdmin, validate(createSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const institution = await create(req.body);
        res.json({
            status: 'success',
            data: {
                institution
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * Get all institutions
 * @auth none
 * @route {GET} /institutions
 * @returns institutions Institution[]
 * @returns count number
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const institutions = await getAll();
        res.json({
            status: 'success',
            data: {
                institutions,
                count: institutions.length
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * Get an institution
 * @auth none
 * @route {GET} /institutions/:id
 * @returns institution Institution
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const institution = await get({
            id: req.params.id
        });

        res.json({
            status: 'success',
            data: institution
        });
    } catch (error) {
        next(error);
    }
});

/**
 * Update an institution
 * @auth ADMIN
 * @route {PUT} /institutions/:id
 * @returns institution Institution
 */
router.put('/:id', isAdmin, validate(updateSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const institution = await update({
            id: req.params.id,
            ...req.body
        });

        res.json({
            status: 'success',
            data: institution
        });
    } catch (error) {
        next(error);
    }
});

/**
 * Join an institution
 * @auth required
 * @route {POST} /institutions/:id/join
 * @returns institution Institution
 */
router.post('/:id/join', isAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const institution = await join({
            id: req.params.id,
            userId: req.user.uid
        });

        res.json({
            status: 'success',
            data: institution
        });
    } catch (error) {
        next(error);
    }
});

/**
 * Leave an institution
 * @auth required
 * @route {POST} /institutions/:id/leave
 * @returns institution Institution
 */
router.post('/:id/leave', isAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const institution = await leave({
            id: req.params.id,
            userId: req.user.uid
        });

        res.json({
            status: 'success',
            data: institution
        });
    } catch (error) {
        next(error);
    }
});

/**
 * Get members of an institution
 * @auth required
 * @route {GET} /institutions/:id/members
 * @returns members User[]
 * @returns count number
 */

router.get('/:id/members', isAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const members = await getMembers({
            id: req.params.id
        });

        res.json({
            status: 'success',
            data: {
                members,
                count: members.length
            }
        });
    } catch (error) {
        next(error);
    }
});

export default router;
