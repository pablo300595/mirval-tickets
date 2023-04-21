import { Publisher, OrderCreatedEvent, Subjects } from '@mirval/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}