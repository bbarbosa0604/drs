import { NextResponse } from 'next/server';

import { BackendApiError } from '@/services/http/backend-client';
import { login } from '@/services/auth/auth.service';
import { setSessionToken } from '@/services/auth/session';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
    password?: string;
  } | null;

  if (!body?.email || !body.password) {
    return NextResponse.json(
      { message: 'Email e senha sao obrigatorios.' },
      { status: 400 },
    );
  }

  try {
    const { accessToken } = await login(body.email, body.password);

    await setSessionToken(accessToken);

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof BackendApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode },
      );
    }

    return NextResponse.json(
      { message: 'Falha ao autenticar.' },
      { status: 502 },
    );
  }
}
