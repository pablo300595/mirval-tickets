import { Publisher, OrderCancelledEvent, Subjects } from '@mirval/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}