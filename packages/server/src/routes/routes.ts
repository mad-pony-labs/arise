import { Router } from 'express';
import authController from '../controllers/auth.controller';
import institutionController from '../controllers/institution.controller';
import networkController from '../controllers/network.controller';
import attemptController from '../controllers/attempt.controller';
import submissionController from '../controllers/submission.controller';
import reviewController from '../controllers/review.controller';

const api = Router()
    .use('/users', authController)
    .use('/institutions', institutionController)
    .use('/network', networkController)
    .use('/attempts', attemptController)
    .use('/submissions', submissionController)
    .use('/reviews', reviewController);

export default Router().use('/api', api);