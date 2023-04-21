import { Publisher, TicketUpdatedEvent, Subjects } from '@mirval/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}