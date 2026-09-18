import { NextResponse } from 'next/server';

import { getSessionToken } from '@/services/auth/session';
import { toErrorResponse } from '@/services/http/backend-client';
import {
  deleteScopeProvider,
  updateScopeProvider,
  type ScopeProviderInput,
} from '@/services/sgsi-scope/limits.service';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; providerId: string }> },
) {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: 'Sessao expirada.' }, { status: 401 });
  }

  const { id, providerId } = await params;
  const input = (await request.json()) as Partial<ScopeProviderInput>;

  try {
    const provider = await updateScopeProvider(token, id, providerId, input);

    return NextResponse.json(provider);
  } catch (error) {
    const { status, message } = toErrorResponse(error);

    return NextResponse.json({ message }, { status });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; providerId: string }> },
) {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: 'Sessao expirada.' }, { status: 401 });
  }

  const { id, providerId } = await params;

  try {
    await deleteScopeProvider(token, id, providerId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const { status, message } = toErrorResponse(error);

    return NextResponse.json({ message }, { status });
  }
}
