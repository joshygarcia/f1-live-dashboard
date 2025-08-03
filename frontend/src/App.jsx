import React from 'react';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './components/Dashboard';

export default function App() {
  const { token } = useAuth();
  return token ? <Dashboard /> : <Login />;
}
