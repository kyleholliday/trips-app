import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import TripsIndex from './pages/trips';
import TripDetails from './pages/trips/[id]';
import NewTrip from './pages/trips/new';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <TripsIndex /> },
      { path: 'trips/new', element: <NewTrip /> },
      { path: 'trips/:id', element: <TripDetails /> },
    ],
  },
]);

const queryClient = new QueryClient();

// Start MSW mock API when in dev mode and no backend is set
if (import.meta.env.DEV && !import.meta.env.VITE_API_URL) {
  const { worker } = await import('./mocks/browser');
  await worker.start();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
