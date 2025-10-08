import { useQuery } from '@tanstack/react-query';
import { fetchTrips } from '@/services/trips';
import { Link } from 'react-router-dom';

export default function TripsIndex() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['trips'],
    queryFn: fetchTrips,
  });

  if (isLoading) return <p>Loading trips...</p>;
  if (error) return <p className="text-red-600">Error loading trips</p>;

  if (!data?.length)
    return (
      <div className="rounded-xl border bg-white p-6">
        <p>No trips yet.</p>
        <Link
          to="/trips/new"
          className="mt-3 inline-block rounded-lg bg-black px-4 py-2 text-white"
        >
          Create your first trip
        </Link>
      </div>
    );

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {data.map((trip) => (
        <Link
          key={trip.id}
          to={`/trips/${trip.id}`}
          className="block rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition"
        >
          <div className="text-lg font-semibold">{trip.name}</div>
          <div className="text-sm text-neutral-600">
            {trip.destination} • {new Date(trip.startDate).toLocaleDateString()}{' '}
            → {new Date(trip.endDate).toLocaleDateString()}
          </div>
          {trip.notes && (
            <p className="mt-2 text-sm text-neutral-700">{trip.notes}</p>
          )}
        </Link>
      ))}
    </div>
  );
}
