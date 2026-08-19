import { paymentQueue } from '../queues/payment.queue';

// Simula processamento de pagamento
const processPayment = async (job: any) => {
  const { orderId, userId } = job.data;
  
  console.log(`Processando pagamento do pedido ${orderId} (usuário ${userId})...`);
  
  // Simula delay de processamento (2 segundos)
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simula 90% de aprovação
  const approved = Math.random() > 0.1;
  
  console.log(`Pagamento ${approved ? 'APROVADO' : 'RECUSADO'} para o pedido ${orderId}`);
  
  return { orderId, status: approved ? 'approved' : 'declined' };
};

paymentQueue.process('order.created', processPayment);

console.log('Payment worker iniciado. Aguardando eventos...');