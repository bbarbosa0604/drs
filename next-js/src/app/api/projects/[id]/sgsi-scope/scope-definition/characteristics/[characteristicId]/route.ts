import { NextResponse } from 'next/server';

import { getSessionToken } from '@/services/auth/session';
import { toErrorResponse } from '@/services/http/backend-client';
import { deleteScopeCharacteristic } from '@/services/sgsi-scope/scope-definition.service';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; characteristicId: string }> },
) {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: 'Sessao expirada.' }, { status: 401 });
  }

  const { id, characteristicId } = await params;

  try {
    await deleteScopeCharacteristic(token, id, characteristicId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const { status, message } = toErrorResponse(error);

    return NextResponse.json({ message }, { status });
  }
}
