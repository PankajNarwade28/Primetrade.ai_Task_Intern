"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (res.ok) {
        // Securely store JWT and user info for protected access
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard'); 
      } else {
        // Show error messages from API response
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError("Could not connect to the server.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">PrimeTrade</h1>
        <h2 className="mt-2 text-xl font-bold text-slate-900">Sign in to your account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100 sm:px-10">
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-700 text-sm font-medium">
              <span className="shrink-0">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="email" 
                  className="block w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl leading-5 text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white focus:border-blue-400 transition-all sm:text-sm" 
                  placeholder="name@company.com"
                  onChange={(e) => setCredentials({...credentials, email: e.target.value})} 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="block w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl leading-5 text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white focus:border-blue-400 transition-all sm:text-sm" 
                  placeholder="••••••••"
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
                  required 
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <button className="group relative w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-100 transition-all transform active:scale-[0.98]">
                Sign In
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600 font-medium">
              New to PrimeTrade?{' '}
              <button 
                onClick={() => router.push('/signup')} 
                className="text-blue-600 font-bold hover:text-blue-500 hover:underline transition-all"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}