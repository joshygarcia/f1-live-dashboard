import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';
import TelemetryPanel from './TelemetryPanel';
import LapTimeChart from './LapTimeChart';

export default function Dashboard() {
  const { token } = useAuth();
  const [favoriteDriver, setFavoriteDriver] = useState('');
  const [telemetry, setTelemetry] = useState(null);
  const [laps, setLaps] = useState([]);

  useEffect(() => {
    const fetchFavorite = async () => {
      const res = await fetch('http://localhost:3000/api/favorite', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setFavoriteDriver(data.favoriteDriver || '');
    };
    fetchFavorite();
  }, [token]);

  useEffect(() => {
    const socket = io('http://localhost:3000', { auth: { token } });
    socket.on('telemetry', (data) => {
      setTelemetry(data.telemetry);
      if (data.lap) {
        setLaps((prev) => [...prev.slice(-20), data.lap]);
      }
    });
    return () => socket.disconnect();
  }, [token]);

  const handleSave = async () => {
    await fetch('http://localhost:3000/api/favorite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ favoriteDriver })
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <input
          className="text-black p-2"
          value={favoriteDriver}
          onChange={(e) => setFavoriteDriver(e.target.value)}
          placeholder="Driver number e.g. 1"
        />
        <button className="bg-red-600 px-3 py-2 rounded" onClick={handleSave}>
          Save
        </button>
      </div>
      <TelemetryPanel telemetry={telemetry} />
      <LapTimeChart laps={laps} />
    </div>
  );
}
