import { NextResponse } from 'next/server';
import { getStatus } from '@/lib/batches';

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json(getStatus());
}