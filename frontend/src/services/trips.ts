import { api } from './api';
import { TripSchema } from '@/types/trip';
import type { Trip } from '@/types/trip';

export async function fetchTrips(): Promise<Trip[]> {
  const { data } = await api.get('/trips');
  return TripSchema.array().parse(data);
}

export async function fetchTrip(id: string): Promise<Trip> {
  const { data } = await api.get(`/trips/${id}`);
  return TripSchema.parse(data);
}

export async function createTrip(input: Omit<Trip, 'id'>): Promise<Trip> {
  const { data } = await api.post('/trips', input);
  return TripSchema.parse(data);
}

export async function updateTrip(
  id: string,
  updates: Partial<Trip>
): Promise<Trip> {
  const { data } = await api.put(`/trips/${id}`, updates);
  return TripSchema.parse(data);
}

export async function deleteTrip(id: string): Promise<void> {
  await api.delete(`/trips/${id}`);
}
