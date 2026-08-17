export interface OrderCreatedEvent {
  eventId: string;      // ID único do evento (chave da idempotência)
  orderId: string;
  userId: string;
  total: number;
  createdAt: string;
}

export const ORDER_CREATED_QUEUE = 'queue:order.created';