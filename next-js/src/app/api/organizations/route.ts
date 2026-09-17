import { NextResponse } from 'next/server';

import { getSessionToken } from '@/services/auth/session';
import { toErrorResponse } from '@/services/http/backend-client';
import {
  createOrganization,
  type OrganizationInput,
} from '@/services/organizations/organizations.service';

/**
 * BFF: o form (client component) nao pode chamar o backend direto (o token
 * de sessao fica num cookie httpOnly, invisivel ao JS do client). Esta rota
 * le o cookie no servidor e repassa a chamada.
 */
export async function POST(request: Request) {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: 'Sessao expirada.' }, { status: 401 });
  }

  const input = (await request.json()) as OrganizationInput;

  try {
    const organization = await createOrganization(token, input);

    return NextResponse.json(organization, { status: 201 });
  } catch (error) {
    const { status, message } = toErrorResponse(error);

    return NextResponse.json({ message }, { status });
  }
}
