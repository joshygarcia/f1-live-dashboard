import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';
import TelemetryPanel from './TelemetryPanel';
import LapTimeChart from './LapTimeChart';
import Navbar from './Navbar';
import DriverStats from './DriverStats';

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
      <Navbar
        favoriteDriver={favoriteDriver}
        onFavoriteChange={setFavoriteDriver}
        onSave={handleSave}
      />
      <div className="grid grid-cols-2 gap-4 auto-rows-fr">
        <DriverStats
          favoriteDriver={favoriteDriver}
          lap={laps.length ? laps[laps.length - 1] : null}
        />
        <TelemetryPanel telemetry={telemetry} />
        <div className="col-span-2">
          <LapTimeChart laps={laps} />
        </div>
      </div>
    </div>
  );
}
