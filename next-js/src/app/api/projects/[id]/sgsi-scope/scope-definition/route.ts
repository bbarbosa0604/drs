import { NextResponse } from 'next/server';

import { getSessionToken } from '@/services/auth/session';
import { toErrorResponse } from '@/services/http/backend-client';
import {
  updateScopeDefinition,
  type ScopeDefinitionInput,
} from '@/services/sgsi-scope/scope-definition.service';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: 'Sessao expirada.' }, { status: 401 });
  }

  const { id } = await params;
  const input = (await request.json()) as ScopeDefinitionInput;

  try {
    const scopeDefinition = await updateScopeDefinition(token, id, input);

    return NextResponse.json(scopeDefinition);
  } catch (error) {
    const { status, message } = toErrorResponse(error);

    return NextResponse.json({ message }, { status });
  }
}
