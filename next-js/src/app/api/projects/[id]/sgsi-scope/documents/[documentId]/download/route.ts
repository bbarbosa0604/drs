import { NextResponse } from 'next/server';

import { getSessionToken } from '@/services/auth/session';
import { getBackendUrl } from '@/services/http/backend-client';

/**
 * Proxy autenticado do download de documento gerado (Task 026). O backend
 * exige bearer token (nunca chega ao bundle do client, ver
 * next-js/docs/ai/SECURITY.md) - por isso o link de download nunca aponta
 * direto para o backend, sempre para esta rota.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; documentId: string }> },
) {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: 'Sessao expirada.' }, { status: 401 });
  }

  const { id, documentId } = await params;

  const backendResponse = await fetch(
    `${getBackendUrl()}/projects/${id}/sgsi-scope/documents/${documentId}/download`,
    { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' },
  );

  if (!backendResponse.ok) {
    const body = (await backendResponse.json().catch(() => null)) as {
      message?: string;
    } | null;

    return NextResponse.json(
      { message: body?.message ?? 'Nao foi possivel baixar o documento.' },
      { status: backendResponse.status },
    );
  }

  const buffer = await backendResponse.arrayBuffer();

  return new NextResponse(buffer, {
    headers: {
      'Content-Type':
        backendResponse.headers.get('Content-Type') ?? 'application/octet-stream',
      'Content-Disposition':
        backendResponse.headers.get('Content-Disposition') ?? 'attachment',
    },
  });
}
