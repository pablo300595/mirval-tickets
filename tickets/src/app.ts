import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { creteTicketRouter } from './routes/new-ticket';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes/index';
import { updateTicketRouter } from './routes/update';
import { errorHandler, NotFoundError, currentUser } from '@mirval/common';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test'
    })
);

app.use(currentUser);

app.use(creteTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all('*', async (req: Request, res: Response, next: NextFunction) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };