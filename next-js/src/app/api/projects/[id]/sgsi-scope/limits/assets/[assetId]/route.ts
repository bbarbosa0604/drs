import { NextResponse } from 'next/server';

import { getSessionToken } from '@/services/auth/session';
import { toErrorResponse } from '@/services/http/backend-client';
import {
  deleteScopeAsset,
  updateScopeAsset,
  type ScopeAssetInput,
} from '@/services/sgsi-scope/limits.service';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; assetId: string }> },
) {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: 'Sessao expirada.' }, { status: 401 });
  }

  const { id, assetId } = await params;
  const input = (await request.json()) as Partial<ScopeAssetInput>;

  try {
    const asset = await updateScopeAsset(token, id, assetId, input);

    return NextResponse.json(asset);
  } catch (error) {
    const { status, message } = toErrorResponse(error);

    return NextResponse.json({ message }, { status });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; assetId: string }> },
) {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: 'Sessao expirada.' }, { status: 401 });
  }

  const { id, assetId } = await params;

  try {
    await deleteScopeAsset(token, id, assetId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const { status, message } = toErrorResponse(error);

    return NextResponse.json({ message }, { status });
  }
}
