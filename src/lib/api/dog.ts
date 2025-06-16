import { goto } from '$app/navigation';
import { store } from '$lib/stores/app.svelte';
import type { Dog, QueryResult } from '$lib/types';
import axios from 'axios';
import { dogServiceClient } from './http-client';

export const getAllBreeds = async (): Promise<string[]> => {
  const { data } = await dogServiceClient.get('/breeds');
  return data;
};

export const queryDogIds = async (
  queryParams: Record<string, string | number | string[]>
): Promise<QueryResult> => {
  const params = new URLSearchParams();

  for (const key in queryParams) {
    const value = queryParams[key];

    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  }

  try {
    const { data } = await dogServiceClient.get(`/search?${params.toString()}`);
    return data;
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      store.isAuthenticated = false;
      goto('/');
    } else {
      console.error(e);
    }
    return { resultIds: [], total: 0 };
  }
};

export const getDogs = async (ids: string[]): Promise<Dog[]> => {
  const { data } = await dogServiceClient.post('', ids);
  return data;
};

export const matchDog = async (ids: string[]): Promise<string> => {
  const { data } = await dogServiceClient.post('/match', ids);
  return data.match;
};
