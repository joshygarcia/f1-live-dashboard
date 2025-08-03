import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('demo');
  const [password, setPassword] = useState('password');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      const data = await res.json();
      login(data.token);
    } else {
      alert('Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded space-y-4">
        <h1 className="text-xl">Login</h1>
        <input
          className="w-full p-2 text-black"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          className="w-full p-2 text-black"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className="bg-red-600 px-4 py-2 rounded" type="submit">
          Sign in
        </button>
      </form>
    </div>
  );
}
