import { http, HttpResponse } from 'msw';
import { v4 as uuid } from 'uuid';

let trips = [
  {
    id: uuid(),
    name: 'Italy 2026',
    destination: 'Rome & Florence',
    startDate: '2026-05-10',
    endDate: '2026-05-20',
    notes: 'Gelato tour 🍦',
  },
  {
    id: uuid(),
    name: 'Japan Adventure',
    destination: 'Tokyo & Kyoto',
    startDate: '2025-11-02',
    endDate: '2025-11-15',
    notes: 'Autumn leaves & sushi',
  },
];

export const handlers = [
  http.get('/api/trips', () => HttpResponse.json(trips)),
  http.get('/api/trips/:id', ({ params }) => {
    const found = trips.find((t) => t.id === params.id);
    return found
      ? HttpResponse.json(found)
      : new HttpResponse('Not found', { status: 404 });
  }),
  http.post('/api/trips', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>; // or as any
    const newTrip = { ...(body as object), id: uuid() };
    trips.unshift(newTrip as any);
    return HttpResponse.json(newTrip, { status: 201 });
  }),
];
