import express, { Request, Response } from 'express';

import { currentUser } from '@mirval/common';

const router = express.Router();

router.get('/api/users/currentuser', [
    currentUser,
], (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null});
});

export { router as currentuserRouter };