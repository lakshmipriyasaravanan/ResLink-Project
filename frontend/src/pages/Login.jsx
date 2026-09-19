import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, ArrowRight, ShieldCheck, GraduationCap } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('arun.kumar@reslink.edu');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/projects');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Card */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-purple-500 text-white shadow-xl shadow-brand-500/20 mb-3">
            <Sparkles className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome to <span className="gradient-heading">ResLink</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            AI-Powered Research Team Builder & Collaboration Platform
          </p>
        </div>

        {/* Main Login Form Card */}
        <div className="bg-white rounded-3xl border border-brand-100/80 shadow-xl p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-800">Sign In to Your Account</h2>
            <span className="text-xs bg-brand-50 text-brand-700 font-semibold px-2.5 py-1 rounded-full border border-brand-100">
              Demo Ready
            </span>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                  placeholder="researcher@university.edu"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-brand-600 via-brand-700 to-purple-700 hover:from-brand-700 hover:to-purple-800 text-white rounded-xl font-bold text-sm shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts Helper */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 mb-2">Quick Demo Accounts:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setEmail('arun.kumar@reslink.edu');
                  setPassword('password123');
                }}
                className="p-2 bg-slate-50 hover:bg-brand-50 text-left rounded-lg border border-slate-200 transition-colors"
              >
                <div className="font-bold text-slate-800">Dr. Arun Kumar</div>
                <div className="text-[10px] text-brand-600">Faculty (AI/ML)</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('sarah.chen@reslink.edu');
                  setPassword('password123');
                }}
                className="p-2 bg-slate-50 hover:bg-brand-50 text-left rounded-lg border border-slate-200 transition-colors"
              >
                <div className="font-bold text-slate-800">Prof. Sarah Chen</div>
                <div className="text-[10px] text-brand-600">Scholar (NLP)</div>
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Don't have a research profile yet?{' '}
              <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700 underline">
                Register Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
