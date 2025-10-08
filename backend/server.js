import express from 'express';
import cors from 'cors';
import { v4 as uuid } from 'uuid';

const app = express();
const PORT = 4000;

// Enable JSON parsing and CORS
app.use(express.json());
app.use(cors());

// Mock trip data
let trips = [
  {
    id: uuid(),
    name: 'Italy 2026',
    destination: 'Rome & Florence',
    startDate: '2026-05-10',
    endDate: '2026-05-20',
    notes: 'Gelato tour 🍦',
  },
  {
    id: uuid(),
    name: 'Japan Adventure',
    destination: 'Tokyo & Kyoto',
    startDate: '2025-11-02',
    endDate: '2025-11-15',
    notes: 'Autumn leaves & sushi 🍣',
  },
];

// Routes
app.get('/trips', (req, res) => {
  res.json(trips);
});

app.get('/trips/:id', (req, res) => {
  const trip = trips.find((t) => t.id === req.params.id);
  if (!trip) return res.status(404).json({ error: 'Not found' });
  res.json(trip);
});

app.post('/trips', (req, res) => {
  const { name, destination, startDate, endDate, notes } = req.body;
  const newTrip = { id: uuid(), name, destination, startDate, endDate, notes };
  trips.unshift(newTrip);
  res.status(201).json(newTrip);
});

app.listen(PORT, () => {
  console.log(`✅ API running at http://localhost:${PORT}`);
});
