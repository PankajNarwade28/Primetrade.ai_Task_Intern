"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, Database, Server, BarChart3, TrendingUp, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';

interface User {
  username: string;
  role: string;
}

export default function Home() {
  const [status, setStatus] = useState({ backend: 'testing', database: 'testing' });
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for user session
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(storedUser);

    async function checkHealth() {
      try { 
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/health`);
        const data = await response.json(); 
        setStatus({
          backend: 'Connected',
          database: data.database ? 'Connected' : 'Disconnected'
        });
      } catch (error) {
        setStatus({ backend: 'Disconnected', database: 'Disconnected' });
      }
    }
    checkHealth();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* 1. Shared Responsive Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-600 tracking-tight">PrimeTrade</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => router.push("/")} className="text-sm font-bold text-blue-600">Home</button>
              <button onClick={() => router.push("/dashboard")} className="flex items-center text-sm font-medium text-slate-600 hover:text-blue-600">
                <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
              </button>
              {user ? (
                <div className="flex items-center space-x-4 border-l pl-6 border-slate-200">
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-semibold text-slate-900">{user.username}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{user.role}</span>
                  </div>
                  <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="space-x-4">
                  <button onClick={() => router.push("/login")} className="text-sm font-semibold text-slate-600 hover:text-blue-600">Login</button>
                  <button onClick={() => router.push("/signup")} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700">Signup</button>
                </div>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-500">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-6 space-y-2">
             <button onClick={() => router.push("/")} className="block w-full text-left px-3 py-2 text-base font-medium text-blue-600">Home</button>
             <button onClick={() => router.push("/dashboard")} className="block w-full text-left px-3 py-2 text-base font-medium text-slate-700">Dashboard</button>
             {user ? (
               <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-base font-medium text-red-600">Logout</button>
             ) : (
               <button onClick={() => router.push("/login")} className="block w-full text-left px-3 py-2 text-base font-medium text-blue-600">Login</button>
             )}
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 2. System Status Section */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <Activity className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">System Connectivity [Developer Purpose Only]</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-start">
              <div className="p-3 bg-blue-50 rounded-xl mr-5">
                <Server className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Express API Service</h3>
                <p className={`text-2xl font-black ${status.backend === 'Connected' ? 'text-green-600' : 'text-red-600'}`}>
                  {status.backend}
                </p>
                <p className="text-slate-500 text-sm mt-2 font-medium italic">Version: v1 [cite: 14]</p>
              </div>
            </div>

            <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-start">
              <div className="p-3 bg-orange-50 rounded-xl mr-5">
                <Database className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">MySQL Database</h3>
                <p className={`text-2xl font-black ${status.database === 'Connected' ? 'text-green-600' : 'text-red-600'}`}>
                  {status.database}
                </p>
                <p className="text-slate-500 text-sm mt-2 font-medium italic">Schema: PrimeTrade [cite: 16]</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Analysis Demo Section */}
        <section>
          <div className="flex items-center mb-6">
            <BarChart3 className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Market Intelligence Demo</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h3 className="text-lg font-bold">BTC/USDT Performance</h3>
                  <p className="text-slate-400 text-sm">Historical volatility analysis</p>
                </div>
                <div className="text-right">
                  <span className="text-green-500 font-bold flex items-center justify-end">
                    <TrendingUp className="w-4 h-4 mr-1" /> +12.4%
                  </span>
                  <p className="text-xs text-slate-400">Last 24 hours</p>
                </div>
              </div>
              {/* Mock Analysis Graphic */}
              <div className="h-48 w-full bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center">
                 <p className="text-slate-400 font-medium italic">Graphical analysis module: scalability note (Redis/caching) </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-xl shadow-slate-200">
                <h4 className="font-bold text-sm mb-4 text-blue-400 uppercase tracking-tighter">Quick Audit</h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">JWT Security [cite: 26]</span>
                    <span className="text-green-400 font-bold">Enabled</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Hashing [cite: 11]</span>
                    <span className="text-green-400 font-bold">Bcrypt</span>
                  </li>
                  <li className="flex justify-between pb-2">
                    <span className="text-slate-400">RBAC [cite: 12]</span>
                    <span className="text-blue-400 font-bold">Active</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-blue-600 p-6 rounded-2xl text-white">
                <h4 className="font-bold mb-2">Ready to trade?</h4>
                <p className="text-blue-100 text-xs leading-relaxed mb-4">Execute orders and manage your portfolio via the secure dashboard.</p>
                <button onClick={() => router.push('/dashboard')} className="w-full bg-white text-blue-600 py-2 rounded-lg text-sm font-bold">Go to Dashboard</button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}