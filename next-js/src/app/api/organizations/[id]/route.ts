import { NextResponse } from 'next/server';

import { getSessionToken } from '@/services/auth/session';
import { toErrorResponse } from '@/services/http/backend-client';
import {
  updateOrganization,
  type OrganizationInput,
} from '@/services/organizations/organizations.service';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: 'Sessao expirada.' }, { status: 401 });
  }

  const { id } = await params;
  const input = (await request.json()) as OrganizationInput;

  try {
    const organization = await updateOrganization(token, id, input);

    return NextResponse.json(organization);
  } catch (error) {
    const { status, message } = toErrorResponse(error);

    return NextResponse.json({ message }, { status });
  }
}
