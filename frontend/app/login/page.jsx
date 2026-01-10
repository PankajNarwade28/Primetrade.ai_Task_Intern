"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// Ensure lucide-react is installed: npm install lucide-react
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors 

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (res.ok) {
        // Securely store JWT and user info for protected access [cite: 22, 26]
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">PrimeTrade Login</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Text colors set to black for better readability */}
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-black" 
            onChange={(e) => setCredentials({...credentials, email: e.target.value})} 
            required 
          />

          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-black" 
              onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
              required 
            />
            <button 
              type="button"
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition duration-200 shadow-md">
            Sign In
          </button>
        </div>
        
        <p className="mt-6 text-center text-sm text-black">
          New to PrimeTrade? <a href="/signup" className="text-blue-500 font-semibold hover:underline">Create an account</a>
        </p>
      </form>
    </div>
  );
}