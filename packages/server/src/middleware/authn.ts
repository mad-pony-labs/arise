import { NextFunction, Request, Response } from 'express';
import { auth } from '../client/firebase';

export const decodeFirebaseIdToken = async (req: Request, res: Response, next: NextFunction) => {
    // Get bearer token from the request header
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) return next();

    try {
        // Verify the token
        req.user = await auth.verifyIdToken(token);
        next();
    } catch (error) {
        return res.status(500).json({
            error
        });
    }
};

// Checks if a user is authenticated from firebase admin
export const isAuthorized = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({
            status: 'error',
            error: {
                message: 'You are not authorised to perform this action. Register/Login to continue'
            }
        });
    }
};