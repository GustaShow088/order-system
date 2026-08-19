import { paymentQueue } from '../queues/payment.queue';
import redis from '../redis';

const processPayment = async (job: any) => {
  const { orderId, userId } = job.data;
  
  // IDEMPOTÊNCIA: verifica se já processou...
  const alreadyProcessed = await redis.get(`payment:${orderId}`);
  if (alreadyProcessed) {
    console.log(`Pedido ${orderId} já foi processado. Ignorando.`);
    return { orderId, status: 'already_processed' };
  }

  console.log(`Processando pagamento do pedido ${orderId} (usuário ${userId})...`);
  
  // Simula delay de processamento (2 segundos)
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simula 90% de aprovação
  const approved = Math.random() > 0.1;
  const status = approved ? 'approved' : 'declined';
  
  // Salva no Redis que este pedido foi processado (expira em 24h)
  await redis.setex(`payment:${orderId}`, 86400, status);
  
  console.log(`Pagamento ${status.toUpperCase()} para o pedido ${orderId}`);
  
  return { orderId, status };
};

paymentQueue.process('order.created', processPayment);

console.log('Payment worker iniciado. Aguardando eventos...');