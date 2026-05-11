import React, { useState } from 'react';
import axios from 'axios';
import { Shield, UserPlus, LogIn, User, Eye, EyeOff } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const response = await axios.post('http://localhost:8000/api/auth/signup', {
          username,
          full_name: fullName,
          password
        });
        const { access_token } = response.data;
        localStorage.setItem('token', access_token);
        onLoginSuccess(access_token);
      } else {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const response = await axios.post('http://localhost:8000/api/auth/login', formData);
        const { access_token } = response.data;

        localStorage.setItem('token', access_token);
        onLoginSuccess(access_token);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:8000/api/auth/guest');
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      onLoginSuccess(access_token);
    } catch (err) {
      setError('Guest access failed. Please try again.');
      console.error('Guest auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-4 font-inter transition-colors duration-300">
      <div className="w-full max-w-md bg-bg-card border border-border-dim rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(217,255,0,0.3)]">
            <Shield size={32} strokeWidth={2.5} className="text-black" />
          </div>
          <h1 className="text-3xl font-black text-text-header tracking-tighter uppercase">HealthAnalytics</h1>
          <p className="text-text-dim text-xs font-bold uppercase tracking-[0.2em] mt-2">
            {isSignUp ? 'Create New Account' : 'Hello'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 ml-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-bg-input border border-border-dim rounded-lg px-4 py-3 text-text-main text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all"
                placeholder="Enter your full name"
                required={isSignUp}
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 ml-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-bg-input border border-border-dim rounded-lg px-4 py-3 text-text-main text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 ml-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg-input border border-border-dim rounded-lg px-4 py-3 pr-10 text-text-main text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-[10px] font-bold uppercase tracking-wider py-2 px-3 rounded-md text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand hover:bg-[#e6ff33] disabled:bg-[#444] disabled:cursor-not-allowed text-black font-black uppercase tracking-widest py-4 rounded-lg shadow-lg transform transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
          >
            {isLoading ? 'Processing...' : (isSignUp ? <><UserPlus size={18} /> Sign Up</> : <><LogIn size={18} /> Sign In</>)}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full py-3 rounded-lg border border-border-dim text-text-muted text-[11px] font-bold uppercase tracking-widest hover:bg-bg-input transition-all"
          >
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </button>

          <button
            onClick={handleGuestLogin}
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-bg-input border border-border-dim text-text-dim text-[11px] font-bold uppercase tracking-widest hover:text-text-main transition-all flex items-center justify-center gap-2"
          >
            <User size={14} /> Continue as Guest
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-border-dim flex justify-between items-center">
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary"></div>
            <div className="w-2 h-2 rounded-full bg-tertiary"></div>
            <div className="w-2 h-2 rounded-full bg-brand"></div>
          </div>
          <p className="text-text-dim text-[9px] font-bold uppercase tracking-tighter">
            System V2.0.4 • 2026 Edition
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
