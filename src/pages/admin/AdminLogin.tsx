import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
const BASE_URL = import.meta.env.VITE_BASE_BACKEND_URL;
export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/auth/login/`, { email, password });

      const { access } = response.data;
      if (access) {
        localStorage.setItem('admin_token', access);
        toast.success('Admin login successful!');
        navigate('/admin');
      } else {
        toast.error('Login failed, no token received');
      }
    } catch (error) {
      const err = error as { response?: { data?: { detail?: string } } };
      toast.error(err.response?.data?.detail || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] py-12 px-4 sm:px-6 lg:px-8 font-[var(--font-display)]">
      <div className="max-w-md w-full space-y-8 animate-fade-in-up bg-white p-10 rounded-[var(--radius-container)] shadow-[var(--shadow-float)] ghost-border">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-[var(--color-primary)]">
            Crowdly Admin
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--color-text-secondary)]">
            Sign in to manage the platform
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input"
                placeholder="Admin Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center btn-primary ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Authenticating...' : 'Sign In as Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
