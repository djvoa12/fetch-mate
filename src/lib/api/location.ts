import { goto } from '$app/navigation';
import { persistAuth } from '$lib/authentication';
import { store } from '$lib/stores/app.svelte';
import type { Location } from '$lib/types';
import { locationServiceClient } from './http-client';
import axios from 'axios';

interface QueryBody {
  geoBoundingBox: {
    bottom: number;
    left: number;
    right: number;
    top: number;
  };
  size: number;
}

export const queryLocationsByZipCodes = async (body: string[]): Promise<Location[]> => {
  try {
    const { data } = await locationServiceClient.post('', body);
    return data;
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      store.isAuthenticated = false;
      store.showSplashPage = true;
      persistAuth(false);
      goto('/');
    } else {
      console.error(e);
    }
    return [];
  }
};

export const queryLocations = async (body: QueryBody): Promise<Location[]> => {
  const { data } = await locationServiceClient.post('/search', body);
  return data.results;
};
