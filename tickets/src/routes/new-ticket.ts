import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { requireAuth, validateRequest } from '@mirval/common';
import { Ticket } from './../models/ticket';

const router = express.Router();

router.post('/api/tickets', requireAuth, [
    body('title')
        .notEmpty()
        .withMessage('Title is required'),
    body('price')
        .isFloat({ gt: 0 })
        .withMessage('Price must greater than 0'),
    validateRequest
], async (req: Request, res: Response) => {
    const  { title, price } = req.body;

    const ticket =  Ticket.build({ title, price, userId: req.currentUser!.id });

    await ticket.save();

    res.status(201).send(ticket)
});

export { router as creteTicketRouter };