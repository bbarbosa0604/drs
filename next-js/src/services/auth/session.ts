import { cookies } from 'next/headers';

/**
 * O backend (Task 003) so retorna um bearer JWT no corpo de `/auth/login`,
 * sem suportar cookie httpOnly nativamente. Para seguir a preferencia de
 * `next-js/docs/ai/SECURITY.md` ("preferir cookies httpOnly quando o backend
 * suportar"), o proprio Next.js atua como BFF: guarda o token recebido do
 * backend num cookie httpOnly seu, nunca expondo-o ao client bundle. Toda
 * leitura de sessao acontece em Server Components/Route Handlers.
 */
const SESSION_COOKIE_NAME = 'dsr_session';

export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();

  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function setSessionToken(token: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export async function clearSessionToken(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE_NAME);
}
