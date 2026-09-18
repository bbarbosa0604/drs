import { NextResponse } from 'next/server';

import { getSessionToken } from '@/services/auth/session';
import { toErrorResponse } from '@/services/http/backend-client';
import {
  deleteTopologyNode,
  updateTopologyNode,
  type TopologyNodeInput,
} from '@/services/sgsi-scope/scope-engine.service';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; nodeId: string }> },
) {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: 'Sessao expirada.' }, { status: 401 });
  }

  const { id, nodeId } = await params;
  const input = (await request.json()) as Partial<TopologyNodeInput>;

  try {
    const node = await updateTopologyNode(token, id, nodeId, input);

    return NextResponse.json(node);
  } catch (error) {
    const { status, message } = toErrorResponse(error);

    return NextResponse.json({ message }, { status });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; nodeId: string }> },
) {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: 'Sessao expirada.' }, { status: 401 });
  }

  const { id, nodeId } = await params;

  try {
    await deleteTopologyNode(token, id, nodeId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const { status, message } = toErrorResponse(error);

    return NextResponse.json({ message }, { status });
  }
}
