import React, { useState } from 'react';
import { Screen } from '../types';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';

interface AuthFlowProps {
  onNavigate: (screen: Screen) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const AuthFlow: React.FC<AuthFlowProps> = ({ onNavigate, showToast }) => {
  const { login, loading } = useAuth();
  const [creds, setCreds] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const errs: Record<string, string> = {};
    if (!creds.email) errs.email = 'Email is required';
    else if (!validateEmail(creds.email)) errs.email = 'Invalid email format';
    if (!creds.password) errs.password = 'Password is required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const success = await login(creds.email, creds.password);
    if (success) {
      showToast('Login successful', 'success');
      onNavigate(Screen.IMPORTANT_NOTICE);
    } else {
      showToast('Invalid credentials', 'error');
    }
  };

  const fillDemo = () => {
    setCreds({ email: 'monalisabargman58@gmail.com', password: 'Pass123' });
  };

  return (
    <div className="flex flex-col min-h-full p-6 bg-white">
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h1>
        <p className="text-slate-500 mb-8">Sign in to continue your health journey</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <Input
            name="email"
            type="email"
            label="Email"
            placeholder="Enter email"
            value={creds.email}
            onChange={(e) => setCreds({ ...creds, email: e.target.value })}
            error={errors.email}
          />
          <Input
            name="password"
            type="password"
            label="Password"
            placeholder="Enter password"
            value={creds.password}
            onChange={(e) => setCreds({ ...creds, password: e.target.value })}
            error={errors.password}
          />

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={(e) => { e.preventDefault(); fillDemo(); }}
            className="text-blue-600 text-sm font-medium"
          >
            Use Demo Account
          </button>
        </div>
      </div>
    </div>
  );
};
