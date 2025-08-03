import React from 'react';

export default function TelemetryPanel({ telemetry }) {
  if (!telemetry)
    return <div className="bg-gray-800 p-4 rounded h-full">Waiting for telemetry...</div>;
  return (
    <div className="grid grid-cols-5 gap-4 bg-gray-800 p-4 rounded h-full">
      <div>Speed: {telemetry.speed}</div>
      <div>RPM: {telemetry.rpm}</div>
      <div>Throttle: {telemetry.throttle}</div>
      <div>Gear: {telemetry.n_gear}</div>
      <div>DRS: {telemetry.drs}</div>
    </div>
  );
}
