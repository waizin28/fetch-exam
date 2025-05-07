import axios from 'axios';
import type {
  Dog,
  Match,
  SearchParams,
  SearchResponse,
  LocationSearchParams,
  LocationSearchResponse,
} from '../types/models';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Login user using name and email
export const login = async (name: string, email: string) => {
  return api.post('/auth/login', { name, email });
};

// Logout user
export const logout = async () => {
  return api.post('/auth/logout');
};

// Returns an array of all possible breed names.
export const getBreeds = async (): Promise<string[]> => {
  const response = await api.get('/dogs/breeds');
  return response.data;
};

// Return an array of dogs that match the search parameters
export const searchDogs = async (
  params: SearchParams
): Promise<SearchResponse> => {
  const queryParams = new URLSearchParams();

  // will keep apending as query params if valid
  if (params.breeds) {
    params.breeds.forEach((breed) => queryParams.append('breeds', breed));
  }
  if (params.zipCodes) {
    params.zipCodes.forEach((zip) => queryParams.append('zipCodes', zip));
  }
  if (params.ageMin !== undefined) {
    queryParams.append('ageMin', params.ageMin.toString());
  }
  if (params.ageMax !== undefined) {
    queryParams.append('ageMax', params.ageMax.toString());
  }
  if (params.size) {
    queryParams.append('size', params.size.toString());
  }
  if (params.from) {
    queryParams.append('from', params.from.toString());
  }
  if (params.sort) {
    queryParams.append('sort', params.sort);
  }

  const response = await api.get(`/dogs/search?${queryParams.toString()}`);
  return response.data;
};

// Returns an array of dog objects
export const getDogs = async (dogIds: string[]): Promise<Dog[]> => {
  const response = await api.post('/dogs', dogIds);
  return response.data;
};

// Return a single ID from the provided list of dog IDs. This ID represents the dog the user has been matched with for adoption.
export const getMatch = async (dogIds: string[]): Promise<Match> => {
  const response = await api.post('/dogs/match', dogIds);
  return response.data;
};

// Returns an array of Location objects.
export const getLocations = async (zipCodes: string[]): Promise<Location[]> => {
  const response = await api.post('/locations', zipCodes);
  return response.data;
};

// Return an array of Location objects and total number of results for the query
export const searchLocations = async (
  params: LocationSearchParams
): Promise<LocationSearchResponse> => {
  const response = await api.post('/locations/search', params);
  return response.data;
};
