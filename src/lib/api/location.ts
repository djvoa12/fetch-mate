import type { Location } from '$lib/types';
import { locationServiceClient } from './http-client';

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
  const { data } = await locationServiceClient.post('', body);
  return data;
};

export const queryLocations = async (body: QueryBody): Promise<Location[]> => {
  const { data } = await locationServiceClient.post('/search', body);
  return data.results;
};
