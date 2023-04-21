import { Publisher, TicketCreatedEvent, Subjects } from '@mirval/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}