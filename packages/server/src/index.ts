import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { decodeFirebaseIdToken } from './middleware/authn';
import routes from './routes/routes';
import { addUsersToPrisma } from './middleware/user-migration';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../docs/swagger.json';

const app = express();

/**
 * App Configuration
 */

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serves images
app.use(express.static('public'));

app.get('/', (req: Request, res: Response) => {
    res.json({ status: 'API is running on /api' });
});

// Auth middleware
app.use(decodeFirebaseIdToken);

// MIGRATION: TODO - remove this route
app.use(addUsersToPrisma)

app.use(routes);

// TODO: add swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({
        status: 'error',
        error: err.message,
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.info(`server up on port ${PORT}`);
});