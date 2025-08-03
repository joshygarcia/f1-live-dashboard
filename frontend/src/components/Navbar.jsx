import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ favoriteDriver, onFavoriteChange, onSave }) {
  const { logout } = useAuth();
  return (
    <div className="flex items-center justify-between bg-gray-900 p-4 rounded">
      <div className="flex items-center space-x-2">
        <input
          className="text-black p-2"
          value={favoriteDriver}
          onChange={(e) => onFavoriteChange(e.target.value)}
          placeholder="Driver number e.g. 1"
        />
        <button className="bg-red-600 px-3 py-2 rounded" onClick={onSave}>
          Save
        </button>
      </div>
      <button
        className="bg-gray-700 px-3 py-2 rounded"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}
