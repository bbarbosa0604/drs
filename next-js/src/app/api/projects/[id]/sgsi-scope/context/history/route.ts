import { NextResponse } from 'next/server';

import { getSessionToken } from '@/services/auth/session';
import { toErrorResponse } from '@/services/http/backend-client';
import { updateOrganizationContextHistory } from '@/services/sgsi-scope/context.service';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: 'Sessao expirada.' }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json()) as { historyHtml?: string | null };

  try {
    const organizationContext = await updateOrganizationContextHistory(
      token,
      id,
      body.historyHtml ?? null,
    );

    return NextResponse.json(organizationContext);
  } catch (error) {
    const { status, message } = toErrorResponse(error);

    return NextResponse.json({ message }, { status });
  }
}
