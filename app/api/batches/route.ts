import { NextResponse } from 'next/server';
import { getAllBatches } from '@/lib/batches';

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json(getAllBatches());
}