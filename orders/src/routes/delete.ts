import express, { Request, Response } from 'express';
import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, currentUser, requireAuth, validateRequest } from "@mirval/common";
import { Order } from './../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete('/api/orders/:id', async (req: Request, res: Response) => {
    const { id: orderId } = req.params;

    const order = await Order.findById(orderId).populate('ticket');

    if(!order) {
        throw new NotFoundError();
    }

    if(order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        ticket: {
            id: order.ticket.id
        }
    })

    res.status(204).send(order);
});

export { router as deleteOrderRouter };