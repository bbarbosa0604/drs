import { backendFetch } from '../http/backend-client';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
}

interface LoginResponse {
  accessToken: string;
  user: AuthenticatedUser;
}

export function login(email: string, password: string): Promise<LoginResponse> {
  return backendFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function getCurrentUser(token: string): Promise<AuthenticatedUser> {
  return backendFetch<AuthenticatedUser>('/auth/me', { token });
}
