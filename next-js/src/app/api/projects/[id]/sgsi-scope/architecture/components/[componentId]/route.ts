import { NextResponse } from 'next/server';

import { getSessionToken } from '@/services/auth/session';
import { toErrorResponse } from '@/services/http/backend-client';
import {
  deleteArchitectureComponent,
  updateArchitectureComponent,
  type ArchitectureComponentInput,
} from '@/services/sgsi-scope/scope-engine.service';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; componentId: string }> },
) {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: 'Sessao expirada.' }, { status: 401 });
  }

  const { id, componentId } = await params;
  const input = (await request.json()) as Partial<ArchitectureComponentInput>;

  try {
    const component = await updateArchitectureComponent(token, id, componentId, input);

    return NextResponse.json(component);
  } catch (error) {
    const { status, message } = toErrorResponse(error);

    return NextResponse.json({ message }, { status });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; componentId: string }> },
) {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: 'Sessao expirada.' }, { status: 401 });
  }

  const { id, componentId } = await params;

  try {
    await deleteArchitectureComponent(token, id, componentId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const { status, message } = toErrorResponse(error);

    return NextResponse.json({ message }, { status });
  }
}
