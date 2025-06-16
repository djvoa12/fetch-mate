import axios from 'axios';
import type { AxiosInstance } from 'axios';

const BASE_API_URL = 'https://frontend-take-home-service.fetch.com';

function createAxiosClient(baseURL: string): AxiosInstance {
  return axios.create({ baseURL, withCredentials: true });
}

export const authServiceClient = createAxiosClient(`${BASE_API_URL}/auth`);

export const dogServiceClient = createAxiosClient(`${BASE_API_URL}/dogs`);

export const locationServiceClient = createAxiosClient(`${BASE_API_URL}/locations`);
