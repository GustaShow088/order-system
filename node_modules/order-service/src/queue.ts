import Redis from 'ioredis';
import { ORDER_CREATED_QUEUE, OrderCreatedEvent } from '../../shared/src/events';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export async function publishOrderCreated(event: OrderCreatedEvent): Promise<void> {
  await redis.lpush(ORDER_CREATED_QUEUE, JSON.stringify(event));
  console.log(`Event published: order.created [${event.eventId}] for order ${event.orderId}`);
}