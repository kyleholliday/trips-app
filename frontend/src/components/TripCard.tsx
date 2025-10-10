import { Trip } from '@/types/trip';
import { Link } from 'react-router-dom';

export default function TripCard({ trip }: { trip: Trip }) {
  return (
    <Link
      to={`/trips/${trip.id}`}
      className="block rounded-xl border bg-white p-5 shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.01]"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{trip.name}</h2>
        <span className="text-sm text-neutral-500">
          {new Date(trip.startDate).toLocaleDateString()}
        </span>
      </div>
      <p className="text-neutral-600">{trip.destination}</p>
      {trip.notes && (
        <p className="mt-2 text-sm text-neutral-700 line-clamp-2">
          {trip.notes}
        </p>
      )}
    </Link>
  );
}
