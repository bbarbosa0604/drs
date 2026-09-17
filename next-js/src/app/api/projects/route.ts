import { NextResponse } from 'next/server';

import { getSessionToken } from '@/services/auth/session';
import { toErrorResponse } from '@/services/http/backend-client';
import { createProject, type ProjectInput } from '@/services/projects/projects.service';

export async function POST(request: Request) {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: 'Sessao expirada.' }, { status: 401 });
  }

  const input = (await request.json()) as ProjectInput;

  try {
    const project = await createProject(token, input);

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    const { status, message } = toErrorResponse(error);

    return NextResponse.json({ message }, { status });
  }
}
