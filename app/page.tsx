'use client';

import { useEffect, useRef, useState } from 'react';

interface Batch {
  id: number;
  name: string;
  start: number;
  end: number;
}

interface Status {
  batch: Batch;
  phase: 'running' | 'upcoming';
  isNextDay: boolean;
  startISO: string;
  endISO: string;
  targetISO: string;
  serverTime: string;
  remainingMs: number;
}

const BATCHES: Batch[] = [
  { id: 1, name: 'Batch 1', start: 9, end: 12 },
  { id: 2, name: 'Batch 2', start: 12, end: 15 },
  { id: 3, name: 'Batch 3', start: 15, end: 18 },
  { id: 4, name: 'Batch 4', start: 18, end: 21 },
];

interface View {
  batch: Batch;
  phase: 'running' | 'upcoming';
  isNextDay: boolean;
  target: Date;
}

function computeLocal(): View {
  const now = new Date();
  const hour = now.getHours();
  let batch = BATCHES.find((b) => hour >= b.start && hour < b.end);
  let phase: 'running' | 'upcoming' = 'running';
  let isNextDay = false;
  if (!batch) {
    batch = BATCHES[0];
    phase = 'upcoming';
    if (hour >= 21) isNextDay = true;
  }
  const start = new Date(now);
  start.setHours(batch.start, 0, 0, 0);
  if (phase === 'upcoming' && start <= now) start.setDate(start.getDate() + 1);
  const end = new Date(start);
  end.setHours(batch.end, 0, 0, 0);
  const target = phase === 'running' ? end : start;
  return { batch, phase, isNextDay, target };
}

function formatHour(h: number) {
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return hour + ':00 ' + period;
}

export default function Home() {
  const [status, setStatus] = useState<Status | null>(null);
  const [offline, setOffline] = useState(false);
  const [, setNow] = useState(0);
  const [tick, setTick] = useState(false);
  const refreshing = useRef(false);
  const lastSecond = useRef('');

  useEffect(() => {
    let active = true;

    async function fetchStatus() {
      if (refreshing.current) return;
      refreshing.current = true;
      try {
        const res = await fetch('/api/time', { cache: 'no-store' });
        if (!res.ok) throw new Error('bad status');
        const data: Status = await res.json();
        if (active) {
          setStatus(data);
          setOffline(false);
        }
      } catch {
        if (active) setOffline(true);
      } finally {
        refreshing.current = false;
      }
    }

    fetchStatus();
    const statusTimer = setInterval(fetchStatus, 1000);
    const renderTimer = setInterval(() => setNow((n) => n + 1), 250);

    return () => {
      active = false;
      clearInterval(statusTimer);
      clearInterval(renderTimer);
    };
  }, []);

  const view: View =
    status && !offline
      ? {
          batch: status.batch,
          phase: status.phase,
          isNextDay: status.isNextDay,
          target: new Date(status.targetISO),
        }
      : computeLocal();

  const remaining = Math.max(0, view.target.getTime() - Date.now());
  const totalSecs = Math.max(0, Math.floor(remaining / 1000));
  const h = String(Math.floor(totalSecs / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, '0');
  const s = String(totalSecs % 60).padStart(2, '0');

  useEffect(() => {
    if (s === lastSecond.current) return;
    lastSecond.current = s;
    setTick(true);
    const t = setTimeout(() => setTick(false), 100);
    return () => clearTimeout(t);
  }, [s]);

  const unitClass = `time-unit${tick ? ' tick' : ''}`;

  return (
    <div className="container">
      <div className="batch-info">
        <span className="batch-name">{view.batch.name}</span>{' '}
        <span className="batch-time">
          {formatHour(view.batch.start)} &ndash; {formatHour(view.batch.end)}
          {view.isNextDay ? ' (Tomorrow)' : ''}
        </span>
      </div>
      <div className="phase-label">
        {view.phase === 'running' ? 'Ends In' : 'Starts In'}
      </div>
      <div className="countdown">
        <div className={unitClass}>
          <span className="value">{h}</span>
          <span className="label">Hours</span>
        </div>
        <div className="separator">:</div>
        <div className={unitClass}>
          <span className="value">{m}</span>
          <span className="label">Minutes</span>
        </div>
        <div className="separator">:</div>
        <div className={unitClass}>
          <span className="value">{s}</span>
          <span className="label">Seconds</span>
        </div>
      </div>
      <div className="status">
        {offline
          ? 'Offline mode - local clock'
          : status
            ? 'Live - Next.js API'
            : 'Connecting...'}
      </div>
    </div>
  );
}