import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTrip, deleteTrip } from '@/services/trips';
import ConfirmModal from '@/components/ConfirmModal';

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showConfirm, setShowConfirm] = useState(false);
  const [isFading, setIsFading] = useState(false);

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
      <div className="p-10 text-center text-neutral-500 text-lg">
        Loading trip details…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-10 text-center text-red-500 text-lg">
        Trip not found.
      </div>
    );
  }

  return (
    <motion.article
      className="rounded-xl border bg-white p-6 space-y-4 max-w-2xl mx-auto mt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={isFading ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      onAnimationComplete={() => {
        // When fade-out completes, fire the delete if requested
        if (isFading && id) {
          deleteMutation.mutate(id);
        }
      }}
    >
      <h1 className="text-2xl font-bold">{data.name}</h1>
      <p className="text-neutral-700">{data.destination}</p>
      <p className="text-sm text-neutral-500">
        {new Date(data.startDate).toLocaleDateString()} –{' '}
        {new Date(data.endDate).toLocaleDateString()}
      </p>
      {data.notes && (
        <p className="mt-2 text-neutral-700 leading-relaxed">{data.notes}</p>
      )}

      <div className="flex gap-3 pt-4 border-t">
        <button
          onClick={() => navigate(`/trips/${id}/edit`)}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 transition"
        >
          Edit
        </button>
        <button
          onClick={() => setShowConfirm(true)}
          className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>

      <ConfirmModal
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false);
          setIsFading(true);
        }}
        message="Are you sure you want to delete this trip?"
      />
    </motion.article>
  );
}
