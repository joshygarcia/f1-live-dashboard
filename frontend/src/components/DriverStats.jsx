import React from 'react';

export default function DriverStats({ favoriteDriver, lap }) {
  return (
    <div className="bg-gray-800 p-4 rounded flex flex-col justify-center h-full">
      <h2 className="text-xl mb-2">Driver #{favoriteDriver || 'N/A'}</h2>
      <div className="space-y-1">
        <div>Last Lap: {lap ? lap.lap_number : 'N/A'}</div>
        <div>Last Lap Time: {lap ? lap.lap_time : 'N/A'}</div>
      </div>
    </div>
  );
}
