// Guarda os IDs de eventos já processados.
// Em produção, isso seria uma tabela no PostgreSQL com UNIQUE constraint.
const processedEvents = new Set<string>();

export function alreadyProcessed(eventId: string): boolean {
  return processedEvents.has(eventId);
}

export function markAsProcessed(eventId: string): void {
  processedEvents.add(eventId);
}