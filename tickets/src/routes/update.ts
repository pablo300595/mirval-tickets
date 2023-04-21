import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from '@mirval/common';
import { Ticket } from './../models/ticket';
import { TicketUpdatedPublisher } from './../events/publishers/ticket-updated-publisher';
import { natsWrapper } from './../nats-wrapper';

const router = express.Router();

router.put('/api/tickets/:id', requireAuth, [
    body('title')
        .notEmpty()
        .withMessage('Title is required'),
    body('price')
        .isFloat({ gt: 0 })
        .withMessage('Price must greater than 0'),
    validateRequest
], async (req: Request, res: Response) => {
    const ticket = req.body;
    const ticketUpdate = await Ticket.findByIdAndUpdate(req.params.id, ticket);
    
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId
    });

    if(!ticketUpdate) {
        throw new NotFoundError();
    }

    if(ticketUpdate.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    res.status(200).send(ticketUpdate);
});

export { router as updateTicketRouter };