import { authServiceClient } from '$lib/api';
import { store } from '$lib/stores/app.svelte';

const AUTH_CACHE_KEY = 'fetch-mate-auth-status';

export async function signIn(body: { email: string; name: string }) {
  const response = await authServiceClient.post('/login', body);
  store.isAuthenticated = response.status === 200;
  persistAuth(store.isAuthenticated);
}

export async function signOut() {
  await authServiceClient.post('/logout');
  store.isAuthenticated = false;
  store.showSplashPage = true;
  persistAuth(false);
}

export function persistAuth(isAuthenticated: boolean) {
  localStorage.setItem(
    AUTH_CACHE_KEY,
    JSON.stringify({ isAuthenticated, timestamp: Date.now() })
  );
}

// Enhancement: Add logic for time expiration
export function validateAuth(): boolean {
  const value: string | null = localStorage.getItem(AUTH_CACHE_KEY);
  return value ? JSON.parse(value).isAuthenticated : false;
}
