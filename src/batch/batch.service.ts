import { Injectable } from '@nestjs/common';

export interface Batch {
  id: number;
  name: string;
  start: number;
  end: number;
}

export type Phase = 'running' | 'upcoming';

@Injectable()
export class BatchService {
  private readonly batches: Batch[] = [
    { id: 1, name: 'Batch 1', start: 9, end: 12 },
    { id: 2, name: 'Batch 2', start: 12, end: 15 },
    { id: 3, name: 'Batch 3', start: 15, end: 18 },
    { id: 4, name: 'Batch 4', start: 18, end: 21 },
  ];

  getAll(): Batch[] {
    return this.batches;
  }

  getStatus(now: Date = new Date()) {
    const hour = now.getHours();
    let batch = this.batches.find((b) => hour >= b.start && hour < b.end);
    let phase: Phase = 'running';
    let isNextDay = false;

    if (!batch) {
      batch = this.batches[0];
      phase = 'upcoming';
      if (hour >= 21) isNextDay = true;
    }

    const start = new Date(now);
    start.setHours(batch.start, 0, 0, 0);
    if (phase === 'upcoming' && start <= now) {
      start.setDate(start.getDate() + 1);
    }

    const end = new Date(start);
    end.setHours(batch.end, 0, 0, 0);

    const target = phase === 'running' ? end : start;
    const remainingMs = Math.max(0, target.getTime() - now.getTime());

    return {
      batch,
      phase,
      isNextDay,
      startISO: start.toISOString(),
      endISO: end.toISOString(),
      targetISO: target.toISOString(),
      serverTime: now.toISOString(),
      remainingMs,
    };
  }
}
