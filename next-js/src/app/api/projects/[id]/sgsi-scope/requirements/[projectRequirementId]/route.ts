import { NextResponse } from 'next/server';

import { getSessionToken } from '@/services/auth/session';
import { toErrorResponse } from '@/services/http/backend-client';
import { deleteProjectRequirement } from '@/services/sgsi-scope/requirements.service';

export async function DELETE(
  _request: Request,
  {
    params,
  }: { params: Promise<{ id: string; projectRequirementId: string }> },
) {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: 'Sessao expirada.' }, { status: 401 });
  }

  const { id, projectRequirementId } = await params;

  try {
    await deleteProjectRequirement(token, id, projectRequirementId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const { status, message } = toErrorResponse(error);

    return NextResponse.json({ message }, { status });
  }
}
