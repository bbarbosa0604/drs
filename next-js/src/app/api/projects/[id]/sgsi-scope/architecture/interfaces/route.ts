import { NextResponse } from 'next/server';

import { getSessionToken } from '@/services/auth/session';
import { toErrorResponse } from '@/services/http/backend-client';
import {
  createArchitectureInterface,
  type ArchitectureInterfaceInput,
} from '@/services/sgsi-scope/scope-engine.service';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: 'Sessao expirada.' }, { status: 401 });
  }

  const { id } = await params;
  const input = (await request.json()) as ArchitectureInterfaceInput;

  try {
    const architectureInterface = await createArchitectureInterface(token, id, input);

    return NextResponse.json(architectureInterface, { status: 201 });
  } catch (error) {
    const { status, message } = toErrorResponse(error);

    return NextResponse.json({ message }, { status });
  }
}
