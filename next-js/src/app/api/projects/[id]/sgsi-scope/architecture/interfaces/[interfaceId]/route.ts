import { NextResponse } from 'next/server';

import { getSessionToken } from '@/services/auth/session';
import { toErrorResponse } from '@/services/http/backend-client';
import {
  deleteArchitectureInterface,
  updateArchitectureInterface,
  type ArchitectureInterfaceInput,
} from '@/services/sgsi-scope/scope-engine.service';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; interfaceId: string }> },
) {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: 'Sessao expirada.' }, { status: 401 });
  }

  const { id, interfaceId } = await params;
  const input = (await request.json()) as Partial<ArchitectureInterfaceInput>;

  try {
    const architectureInterface = await updateArchitectureInterface(
      token,
      id,
      interfaceId,
      input,
    );

    return NextResponse.json(architectureInterface);
  } catch (error) {
    const { status, message } = toErrorResponse(error);

    return NextResponse.json({ message }, { status });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; interfaceId: string }> },
) {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: 'Sessao expirada.' }, { status: 401 });
  }

  const { id, interfaceId } = await params;

  try {
    await deleteArchitectureInterface(token, id, interfaceId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const { status, message } = toErrorResponse(error);

    return NextResponse.json({ message }, { status });
  }
}
