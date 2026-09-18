import { NextResponse } from 'next/server';

import { getSessionToken } from '@/services/auth/session';
import { toErrorResponse } from '@/services/http/backend-client';
import {
  deleteContextAspect,
  updateContextAspect,
  type ContextAspectInput,
} from '@/services/sgsi-scope/context.service';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; aspectId: string }> },
) {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: 'Sessao expirada.' }, { status: 401 });
  }

  const { id, aspectId } = await params;
  const input = (await request.json()) as Partial<ContextAspectInput>;

  try {
    const aspect = await updateContextAspect(token, id, aspectId, input);

    return NextResponse.json(aspect);
  } catch (error) {
    const { status, message } = toErrorResponse(error);

    return NextResponse.json({ message }, { status });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; aspectId: string }> },
) {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: 'Sessao expirada.' }, { status: 401 });
  }

  const { id, aspectId } = await params;

  try {
    await deleteContextAspect(token, id, aspectId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const { status, message } = toErrorResponse(error);

    return NextResponse.json({ message }, { status });
  }
}
