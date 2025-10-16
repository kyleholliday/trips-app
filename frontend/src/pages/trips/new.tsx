import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTrip } from '@/services/trips';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, MapPin, Calendar, FileText } from 'lucide-react';

export default function NewTrip() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: createTrip,
    onSuccess: (trip) => {
      // Refresh trip list
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      // Navigate to new trip details
      navigate(`/trips/${trip.id}`);
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newTrip = {
      name: String(fd.get('name') || ''),
      destination: String(fd.get('destination') || ''),
      startDate: String(fd.get('startDate') || ''),
      endDate: String(fd.get('endDate') || ''),
      notes: String(fd.get('notes') || ''),
    };
    mutation.mutate(newTrip as any);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl mx-auto"
      >
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to trips</span>
        </button>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 sm:p-10 border-b border-gray-100">
            <h1 className="text-3xl font-bold text-gray-900">
              Create a New Trip
            </h1>
            <p className="text-gray-500 mt-2">
              Start planning your next adventure
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-6">
            {/* Trip name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FileText className="w-4 h-4 text-gray-400" />
                Trip Name
              </label>
              <input
                name="name"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition outline-none"
                placeholder="Summer in Europe"
                required
              />
            </div>

            {/* Destination */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                Destination
              </label>
              <input
                name="destination"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition outline-none"
                placeholder="Paris, France"
                required
              />
            </div>

            {/* Dates */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                Dates
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Notes
              </label>
              <textarea
                name="notes"
                rows={6}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition outline-none resize-none"
                placeholder="Add any additional details about your trip..."
              />
            </div>

            {/* Error message */}
            {mutation.isError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4"
              >
                <p className="text-sm text-red-600 font-medium">
                  Failed to create trip. Please try again.
                </p>
              </motion.div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
              <motion.button
                type="submit"
                disabled={mutation.isPending}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 flex-1 rounded-xl bg-blue-600 px-5 py-3 text-white font-medium hover:bg-blue-700 transition shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                {mutation.isPending ? 'Creating...' : 'Create Trip'}
              </motion.button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="rounded-xl border-2 border-gray-200 px-5 py-3 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
