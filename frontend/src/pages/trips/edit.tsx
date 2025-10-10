import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTrip, updateTrip } from '@/services/trips';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, MapPin, Calendar, FileText } from 'lucide-react';

export default function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['trip', id],
    queryFn: () => fetchTrip(id!),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: (updates: any) => updateTrip(id!, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['trip', id] });
      navigate(`/trips/${id}`);
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    mutation.mutate({
      name: fd.get('name'),
      destination: fd.get('destination'),
      startDate: fd.get('startDate'),
      endDate: fd.get('endDate'),
      notes: fd.get('notes'),
    });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Loading trip...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">Trip not found</div>
      </div>
    );
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
          onClick={() => navigate(`/trips/${id}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to trip</span>
        </button>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="p-8 sm:p-10 border-b border-gray-100">
            <h1 className="text-3xl font-bold text-gray-900">Edit Trip</h1>
            <p className="text-gray-500 mt-2">Update your trip details</p>
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
                defaultValue={data.name}
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
                defaultValue={data.destination}
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
                    defaultValue={data.startDate}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    defaultValue={data.endDate}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition outline-none"
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
                defaultValue={data.notes}
                rows={6}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition outline-none resize-none"
                placeholder="Add any additional details about your trip..."
              />
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
              <motion.button
                type="submit"
                disabled={mutation.isPending}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 flex-1 rounded-xl bg-blue-600 px-5 py-3 text-white font-medium hover:bg-blue-700 transition shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                {mutation.isPending ? 'Saving...' : 'Save Changes'}
              </motion.button>
              <button
                type="button"
                onClick={() => navigate(`/trips/${id}`)}
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
