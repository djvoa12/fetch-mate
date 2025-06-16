import { authServiceClient } from '$lib/api';
import { store } from '$lib/stores/app.svelte';

export async function signIn(body: { email: string; name: string }) {
  const response = await authServiceClient.post('/login', body);
  store.isAuthenticated = response.status === 200;
}

export async function signOut() {
  await authServiceClient.post('/logout');
  store.isAuthenticated = false;
}
