"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, User, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'user' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Client-side Validation: Check if passwords match 
    if (formData.password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Something went wrong');
      }

      router.push('/login');
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Could not connect to the server.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">PrimeTrade</h1>
        <h2 className="mt-2 text-xl font-bold text-slate-900">Create your account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100 sm:px-10">
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-700 text-sm font-medium">
              <span className="shrink-0">⚠️</span>
              {error} [cite: 24]
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  className="block w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl leading-5 text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white focus:border-blue-400 transition-all sm:text-sm" 
                  placeholder="johndoe"
                  onChange={(e) => setFormData({...formData, username: e.target.value})} 
                  required 
                />
              </div>
            </div>

            {/* Email Input */}
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
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  required 
                />
              </div>
            </div>

            {/* Password Input */}
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
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  required 
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ShieldCheck className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="password" 
                  className="block w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl leading-5 text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white focus:border-blue-400 transition-all sm:text-sm" 
                  placeholder="••••••••"
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1">
                Account Role
              </label>
              <select 
                className="block w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl leading-5 text-black focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white focus:border-blue-400 transition-all sm:text-sm" 
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <button className="group relative w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-100 transition-all transform active:scale-[0.98]">
                Create Account
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-sm text-slate-600 font-medium">
              Already have an account?{' '}
              <button 
                onClick={() => router.push('/login')} 
                className="text-blue-600 font-bold hover:text-blue-500 hover:underline transition-all"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}