import { NextResponse } from 'next/server';

import { clearSessionToken } from '@/services/auth/session';

export async function POST() {
  await clearSessionToken();

  return NextResponse.json({ ok: true });
}
