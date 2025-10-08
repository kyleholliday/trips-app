import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTrip } from '@/services/trips';
import { useNavigate } from 'react-router-dom';

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
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-lg space-y-4 rounded-xl border bg-white p-6"
    >
      <h1 className="text-xl font-semibold">Create a new trip</h1>

      <input
        name="name"
        placeholder="Trip name"
        className="w-full rounded-lg border p-2"
        required
      />
      <input
        name="destination"
        placeholder="Destination"
        className="w-full rounded-lg border p-2"
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <input
          type="date"
          name="startDate"
          className="rounded-lg border p-2"
          required
        />
        <input
          type="date"
          name="endDate"
          className="rounded-lg border p-2"
          required
        />
      </div>

      <textarea
        name="notes"
        placeholder="Notes"
        className="w-full rounded-lg border p-2"
      />

      <button
        type="submit"
        disabled={mutation.isPending}
        className="rounded-lg bg-black px-4 py-2 text-white"
      >
        {mutation.isPending ? 'Saving…' : 'Save trip'}
      </button>

      {mutation.isError && (
        <p className="text-sm text-red-600">Failed to save trip.</p>
      )}
    </form>
  );
}
