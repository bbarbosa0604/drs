import { NextResponse } from 'next/server';

import { getSessionToken } from '@/services/auth/session';
import { toErrorResponse } from '@/services/http/backend-client';
import {
  deleteScopeEmployeeGroup,
  updateScopeEmployeeGroup,
  type ScopeEmployeeGroupInput,
} from '@/services/sgsi-scope/limits.service';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; groupId: string }> },
) {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: 'Sessao expirada.' }, { status: 401 });
  }

  const { id, groupId } = await params;
  const input = (await request.json()) as Partial<ScopeEmployeeGroupInput>;

  try {
    const group = await updateScopeEmployeeGroup(token, id, groupId, input);

    return NextResponse.json(group);
  } catch (error) {
    const { status, message } = toErrorResponse(error);

    return NextResponse.json({ message }, { status });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; groupId: string }> },
) {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: 'Sessao expirada.' }, { status: 401 });
  }

  const { id, groupId } = await params;

  try {
    await deleteScopeEmployeeGroup(token, id, groupId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const { status, message } = toErrorResponse(error);

    return NextResponse.json({ message }, { status });
  }
}
