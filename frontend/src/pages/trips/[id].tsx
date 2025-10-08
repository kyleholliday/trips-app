import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchTrip } from '@/services/trips';

export default function TripDetails() {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ['trip', id],
    queryFn: () => fetchTrip(id!),
    enabled: !!id,
  });

  if (isLoading) return <p>Loading trip...</p>;
  if (error || !data) return <p className="text-red-600">Trip not found.</p>;

  return (
    <article className="rounded-xl border bg-white p-6">
      <h1 className="text-2xl font-bold">{data.name}</h1>
      <p className="text-neutral-700">{data.destination}</p>
      <p className="text-sm text-neutral-500">
        {new Date(data.startDate).toLocaleDateString()} –{' '}
        {new Date(data.endDate).toLocaleDateString()}
      </p>
      {data.notes && <p className="mt-4">{data.notes}</p>}
    </article>
  );
}
