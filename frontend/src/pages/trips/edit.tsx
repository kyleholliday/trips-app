import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTrip, updateTrip } from '@/services/trips';
import { motion, useAnimation } from 'framer-motion';

export default function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const controls = useAnimation();

  const { data, isLoading } = useQuery({
    queryKey: ['trip', id],
    queryFn: () => fetchTrip(id!),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: (updates: any) => updateTrip(id!, updates),
    onSuccess: async () => {
      await controls.start({
        opacity: 0,
        y: -20,
        transition: { duration: 0.3 },
      });
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      navigate(`/trips/${id}`);
    },
  });

  if (isLoading) return <p>Loading trip...</p>;
  if (!data) return <p>Trip not found</p>;

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

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="mx-auto max-w-xl space-y-4 bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-md"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <h1 className="text-xl font-semibold">Edit Trip</h1>
      <input
        name="name"
        defaultValue={data.name}
        className="w-full rounded-lg border p-2"
        required
      />
      <input
        name="destination"
        defaultValue={data.destination}
        className="w-full rounded-lg border p-2"
        required
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          type="date"
          name="startDate"
          defaultValue={data.startDate}
          className="rounded-lg border p-2"
        />
        <input
          type="date"
          name="endDate"
          defaultValue={data.endDate}
          className="rounded-lg border p-2"
        />
      </div>
      <textarea
        name="notes"
        defaultValue={data.notes}
        className="w-full rounded-lg border p-2"
      />
      <motion.button
        type="submit"
        className="rounded-lg bg-blue-500 px-4 py-2 text-white font-medium hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 transition"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? 'Saving…' : 'Save changes'}
      </motion.button>
    </motion.form>
  );
}
