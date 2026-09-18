/**
 * Cliente HTTP compartilhado para o backend NestJS (DRS). So e chamado a
 * partir de Server Components e Route Handlers: o token de sessao nunca
 * chega ao bundle do client (ver next-js/docs/ai/SECURITY.md).
 *
 * `BACKEND_API_URL` e uma variavel server-side (sem prefixo `NEXT_PUBLIC_`)
 * de proposito: nao deve ser exposta ao client.
 */
export class BackendApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'BackendApiError';
  }
}

export function getBackendUrl(): string {
  return process.env.BACKEND_API_URL ?? 'http://localhost:3000';
}

export async function backendFetch<T>(
  path: string,
  init: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, headers, ...rest } = init;

  const response = await fetch(`${getBackendUrl()}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;

    throw new BackendApiError(
      response.status,
      body?.message ?? 'Falha ao comunicar com o backend.',
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

/**
 * Normaliza erro de `backendFetch` para uma resposta de Route Handler,
 * sem vazar stack trace nem detalhe interno (ver docs/ai/SECURITY.md).
 */
export function toErrorResponse(error: unknown): {
  status: number;
  message: string;
} {
  if (error instanceof BackendApiError) {
    return { status: error.statusCode, message: error.message };
  }

  return { status: 502, message: 'Falha ao comunicar com o backend.' };
}
