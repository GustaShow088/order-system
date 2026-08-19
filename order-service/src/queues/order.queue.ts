import Queue from 'bull';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const orderQueue = new Queue('order-processing', redisUrl);

export const publishOrderCreated = (orderId: string, userId: string) => {
  return orderQueue.add('order.created', {
    orderId,
    userId,
    timestamp: new Date().toISOString(),
  });
};