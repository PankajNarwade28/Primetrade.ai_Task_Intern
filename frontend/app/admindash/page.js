"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, ShieldAlert, Trash2, LayoutDashboard, LogOut, ArrowLeft } from "lucide-react";

export default function AdminDashboard() {
  const [allTrades, setAllTrades] = useState([]);
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState({ msg: "", type: "" });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserStr = localStorage.getItem("user");
    const storedUser = JSON.parse(storedUserStr || "{}");

    // 1. Strict Authentication & Role Check
    if (!token) {
      router.push("/login");
      return;
    }

    if (storedUser.role !== 'admin') {
      router.push("/dashboard");
      return;
    }

    // 2. Set user data to state so it appears in Navbar
    setUser(storedUser);

    // 3. Trigger data load automatically on mount
    loadGlobalData(token);
  }, []);

  const loadGlobalData = async (token) => {
    try {
      // Admin API: Fetches all trades across the system
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/trades`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      
      // Ensure data is an array before setting state to avoid .map errors
      setAllTrades(Array.isArray(data) ? data : []);
    } catch (err) {
      setStatus({ msg: "Failed to load administrative data", type: "error" });
    }
  };

  const handleAdminDelete = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/trades/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setStatus({ msg: "Administrative deletion successful", type: "success" });
      loadGlobalData(token); // Refresh data after deletion
    } else {
      setStatus({ msg: "Unauthorized action", type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-black">
      {/* Admin Navbar */}
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 text-white">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldAlert className="text-red-500 w-6 h-6" />
            <span className="text-xl font-bold tracking-tighter">PrimeTrade Admin</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => router.push("/")} className="flex items-center text-sm font-medium text-slate-600 hover:text-blue-600">
                <LayoutDashboard className="w-4 h-4 mr-2" /> Home
              </button>
            {/* Displaying User Data */}
            <span className="text-sm text-slate-400">
              Logged in as: <span className="text-white font-bold">{user?.username || 'Admin'}</span>
            </span>
            <button 
              onClick={() => { localStorage.clear(); router.push("/login"); }} 
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900">Global Oversight</h1>
          <p className="text-slate-500 mt-2 font-medium">Monitoring all entity transactions across the platform.</p>
        </header>

        {status.msg && (
          <div className={`mb-6 p-4 rounded-xl border font-bold ${status.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
            {status.msg}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" /> System-Wide Transactions
              </h3>
              <span className="bg-blue-600 text-white text-[10px] px-2 py-1 rounded-full font-black tracking-widest">ADMIN MODE</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">User ID</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Asset</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Type</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allTrades.length > 0 ? (
                    allTrades.map((trade) => (
                      <tr key={trade.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-blue-600">USR-{trade.user_id}</td>
                        <td className="px-6 py-4 font-bold">{trade.asset_name}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${trade.trade_type === 'buy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {trade.trade_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleAdminDelete(trade.id)} 
                            className="inline-flex items-center gap-1 text-red-500 hover:text-red-700 font-bold text-sm transition-colors"
                          >
                            <Trash2 className="w-4 h-4" /> Force Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-10 text-center text-slate-400 italic">
                        No transactions found in the system.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}