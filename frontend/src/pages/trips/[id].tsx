import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowLeft, Edit3, Trash2 } from 'lucide-react';
import { fetchTrip, deleteTrip } from '@/services/trips';
import ConfirmModal from '@/components/ConfirmModal';

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showConfirm, setShowConfirm] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['trip', id],
    queryFn: () => fetchTrip(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      navigate('/');
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-lg">Loading trip details…</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500 text-lg">Trip not found.</div>
      </div>
    );
  }

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    return `${startDate.toLocaleDateString(
      'en-US',
      options
    )} – ${endDate.toLocaleDateString('en-US', options)}`;
  };

  const getDuration = (start: string, end: string) => {
    const days = Math.ceil(
      (new Date(end).getTime() - new Date(start).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return `${days} ${days === 1 ? 'day' : 'days'}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to trips</span>
          </button>

          <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header section */}
            <div className="p-8 sm:p-10 border-b border-gray-100">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {data.name}
              </h1>

              {/* Destination and dates */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-lg">{data.destination}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{formatDateRange(data.startDate, data.endDate)}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500">
                    {getDuration(data.startDate, data.endDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes section */}
            {data.notes && (
              <div className="p-8 sm:p-10">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Notes
                </h2>
                <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
                  {data.notes}
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="p-8 sm:p-10 bg-gray-50 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate(`/trips/${id}/edit`)}
                  className="flex items-center justify-center gap-2 flex-1 rounded-xl bg-blue-600 px-5 py-3 text-white font-medium hover:bg-blue-700 transition shadow-sm hover:shadow group"
                >
                  <Edit3 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  Edit Trip
                </button>
                <button
                  onClick={() => setShowConfirm(true)}
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 px-5 py-3 text-gray-700 font-medium hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition group"
                >
                  <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Delete
                </button>
              </div>
            </div>
          </article>
        </motion.div>
        <ConfirmModal
          open={showConfirm}
          onCancel={() => setShowConfirm(false)}
          onConfirm={() => {
            setShowConfirm(false);
            deleteMutation.mutate(id!);
          }}
          message="Are you sure you want to delete this trip? This action cannot be undone."
        />
      </div>
    </div>
  );
}
