import Redis from 'ioredis';
import { ORDER_CREATED_QUEUE, OrderCreatedEvent } from '../../shared/src/events';
import { alreadyProcessed, markAsProcessed } from './idempotency';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

async function processPayment(event: OrderCreatedEvent): Promise<void> {
  // IDEMPOTÊNCIA: se já processamos esse evento, ignora
  if (alreadyProcessed(event.eventId)) {
    console.log(`Event ${event.eventId} already processed — skipping (idempotent)`);
    return;
  }

  // Simula o processamento do pagamento
  console.log(`Processing payment for order ${event.orderId} — R$ ${event.total.toFixed(2)}`);
  await new Promise((resolve) => setTimeout(resolve, 1000)); // simula latência

  markAsProcessed(event.eventId);
  console.log(`Payment processed for order ${event.orderId}`);
}

export async function startConsumer(): Promise<void> {
  console.log('Payment consumer listening on queue:order.created ...');

  while (true) {
    // BRPOP bloqueia até chegar um evento (timeout de 5s para não travar)
    const result = await redis.brpop(ORDER_CREATED_QUEUE, 5);
    if (!result) continue;

    const [, raw] = result;
    const event: OrderCreatedEvent = JSON.parse(raw);

    try {
      await processPayment(event);
    } catch (error) {
      console.error(`Failed to process event ${event.eventId}:`, error);
      // Em produção: retry com backoff ou dead letter queue
    }
  }
}