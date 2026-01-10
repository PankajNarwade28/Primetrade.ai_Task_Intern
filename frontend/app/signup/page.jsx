"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// Use Lucide-react for the eye icons (standard in Next.js/Tailwind projects)
import { Eye, EyeOff } from 'lucide-react';

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
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSignup} className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Create PrimeTrade Account</h2>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input type="text" placeholder="Username" className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400" 
            onChange={(e) => setFormData({...formData, username: e.target.value})} required />
          
          <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400" 
            onChange={(e) => setFormData({...formData, email: e.target.value})} required />

          {/* Password Input with Eye Icon */}
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              required 
            />
            <button 
              type="button"
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <input 
            type="password" 
            placeholder="Confirm Password" 
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400" 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />

          <select className="w-full p-3 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-400" 
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition duration-200">
            Register
          </button>
        </div>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <a href="/login" className="text-blue-500 hover:underline">Log in</a>
        </p>
      </form>
    </div>
  );
}