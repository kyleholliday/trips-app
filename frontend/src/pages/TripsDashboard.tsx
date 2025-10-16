import { motion } from 'framer-motion';
import { Plus, MapPin, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Variants } from 'framer-motion';
import { useState, useMemo } from 'react';
import SortMenu, { type SortKey } from '../components/SortMenu';

type Trip = {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  notes?: string;
};

const container: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const card: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function TripsDashboard() {
  const navigate = useNavigate();
  const {
    data: trips,
    isLoading,
    error,
  } = useQuery<Trip[]>({
    queryKey: ['trips'],
    queryFn: async () => (await api.get('/trips')).data,
  });

  const [sortBy, setSortBy] = useState<SortKey>('startAsc');

  const sortedTrips = useMemo(() => {
    if (!trips) return [];
    return [...trips].sort((a, b) => {
      switch (sortBy) {
        case 'startAsc':
          return +new Date(a.startDate) - +new Date(b.startDate);
        case 'startDesc':
          return +new Date(b.startDate) - +new Date(a.startDate);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'destination':
          return a.destination.localeCompare(b.destination);
        default:
          return 0;
      }
    });
  }, [trips, sortBy]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getDuration = (start: string, end: string) => {
    const days = Math.ceil(
      (new Date(end).getTime() - new Date(start).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return `${days}d`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Loading trips...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">Failed to load trips.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Your Trips
            </h1>
            <p className="text-gray-500 text-lg">
              Plan, view, and edit your adventures
            </p>
          </div>
          <SortMenu value={sortBy} onChange={setSortBy} />
        </header>

        {sortedTrips && sortedTrips.length > 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            style={{ willChange: 'opacity' }}
          >
            {sortedTrips.map((trip) => (
              <motion.article
                key={trip.id}
                layout="position"
                transition={{
                  layout: { type: 'spring', stiffness: 160, damping: 18 },
                }}
                variants={card}
                whileHover={{ scale: 1.01, y: -4 }}
                onClick={() => navigate(`/trips/${trip.id}`)}
                className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 cursor-pointer group"
                style={{ willChange: 'transform, opacity' }}
              >
                {/* Card header with gradient accent */}
                <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:from-blue-600 group-hover:to-blue-700 transition-all" />

                <div className="p-6">
                  {/* Trip name */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {trip.name}
                  </h3>

                  {/* Destination */}
                  <div className="flex items-start gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600 line-clamp-1">
                      {trip.destination}
                    </span>
                  </div>

                  {/* Date range */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>
                        {formatDate(trip.startDate)} –{' '}
                        {formatDate(trip.endDate)}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                      {getDuration(trip.startDate, trip.endDate)}
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No trips yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start planning your next adventure
            </p>
            <button
              onClick={() => navigate('/trips/new')}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition shadow-sm hover:shadow"
            >
              <Plus className="w-5 h-5" />
              Create your first trip
            </button>
          </div>
        )}

        {/* Floating action button */}
        {/* {trips && trips.length > 0 && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.5,
              type: 'spring',
              stiffness: 260,
              damping: 20,
            }}
            onClick={() => navigate('/trips/new')}
            className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
          </motion.button>
        )} */}
      </div>
    </div>
  );
}
