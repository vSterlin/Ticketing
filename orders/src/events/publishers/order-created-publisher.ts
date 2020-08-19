import { Publisher, OrderCreatedEvent, Subjects } from '@vsttickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}