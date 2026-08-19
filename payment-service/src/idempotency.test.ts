import { alreadyProcessed, markAsProcessed } from './idempotency';

describe('Idempotency', () => {
  it('should not mark an event as processed initially', () => {
    expect(alreadyProcessed('event-123')).toBe(false);
  });

  it('should recognize an event after marking it as processed', () => {
    markAsProcessed('event-456');
    expect(alreadyProcessed('event-456')).toBe(true);
  });

  it('should not confuse different events', () => {
    markAsProcessed('event-aaa');
    expect(alreadyProcessed('event-bbb')).toBe(false);
  });
});