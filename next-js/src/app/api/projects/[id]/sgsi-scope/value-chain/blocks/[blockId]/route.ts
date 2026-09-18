import { NextResponse } from 'next/server';

import { getSessionToken } from '@/services/auth/session';
import { toErrorResponse } from '@/services/http/backend-client';
import {
  deleteValueChainBlock,
  updateValueChainBlock,
  type ValueChainBlockInput,
} from '@/services/sgsi-scope/scope-engine.service';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; blockId: string }> },
) {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: 'Sessao expirada.' }, { status: 401 });
  }

  const { id, blockId } = await params;
  const input = (await request.json()) as Partial<ValueChainBlockInput>;

  try {
    const block = await updateValueChainBlock(token, id, blockId, input);

    return NextResponse.json(block);
  } catch (error) {
    const { status, message } = toErrorResponse(error);

    return NextResponse.json({ message }, { status });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; blockId: string }> },
) {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: 'Sessao expirada.' }, { status: 401 });
  }

  const { id, blockId } = await params;

  try {
    await deleteValueChainBlock(token, id, blockId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const { status, message } = toErrorResponse(error);

    return NextResponse.json({ message }, { status });
  }
}
