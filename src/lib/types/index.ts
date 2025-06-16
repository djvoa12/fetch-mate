declare global {
  interface Window {
    removeFavDog: (dogId: string) => void;
  }
}

export interface Dog {
  age: number;
  breed: string;
  checked?: boolean;
  id: string;
  img: string;
  name: string;
  zip_code: string;
}

export interface Location {
  city: string;
  county: string;
  latitude: number;
  longitude: number;
  state: string;
  zip_code: string;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface QueryResult {
  next?: string;
  prev?: string;
  resultIds: string[];
  total: number;
}

/** Keys in the TableRow type are for intellisense purposes. Since this object is so flexible, must be "any" for value of key */
export interface TableRow {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: symbol | string]: any;
}
