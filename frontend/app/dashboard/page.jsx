"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, PlusCircle, User, Menu, X } from "lucide-react";

export default function PrimeTradeDashboard() {
  const [trades, setTrades] = useState([]);
  const [form, setForm] = useState({ asset_name: "", trade_type: "buy", amount: "", price: "" });
  const [user, setUser] = useState(null); 
  const [status, setStatus] = useState({ msg: "", type: "" });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 1. Retrieve the token and user string from localStorage
    const token = localStorage.getItem("token");
    const storedUserStr = localStorage.getItem("user");

    // 2. Security Check: Redirect if no token
    if (!token) {
      router.push("/login");
      return;
    }

    // 3. Populate User Data: Parse the JSON string back into an object
    if (storedUserStr) {
      const storedUser = JSON.parse(storedUserStr);
      
      // Strict Redirection Rule: Kick admins back to the admin zone
      if (storedUser.role === 'admin') {
        router.push("/admindash");
        return;
      }
      
      // Update state so the UI shows the name and role
      setUser(storedUser);
    }

    // 4. Fetch the specific user's trades
    loadData(token);
  }, []);

  const loadData = async (token) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/trades`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTrades(Array.isArray(data) ? data : []);
    } catch (err) {
      setStatus({ msg: "Failed to load trades", type: "error" });
    }
  };

  // ... (Keep your existing handleLogout, handleSubmit, and handleDelete functions)

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/trades`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setStatus({ msg: "Trade executed successfully!", type: "success" });
      setForm({ asset_name: "", trade_type: "buy", amount: "", price: "" });
      loadData(token);
    } else {
      setStatus({ msg: "Error: Check input validation", type: "error" });
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/trades/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadData(token);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-600 tracking-tight">PrimeTrade</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => router.push("/")} className="flex items-center text-sm font-medium text-slate-600 hover:text-blue-600">
                <LayoutDashboard className="w-4 h-4 mr-2" /> Home
              </button>
              
              {/* FIX: User Identity now displays because 'user' state is set */}
              {user && (
                <div className="flex items-center space-x-4 border-l pl-6 border-slate-200">
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-semibold text-slate-900">{user.username}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{user.role}</span>
                  </div>
                  <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {/* Personalized Greeting with fallback */}
            Good Morning, {user?.username || 'Trader'}!
          </h2>
          <p className="mt-2 text-slate-500">
            Welcome back to your <span className="font-semibold text-blue-600 uppercase">{user?.role || 'user'}</span> command center.
          </p>
        </header>

        {/* ... (Keep the rest of your UI: Status, Form, and Table) */}
        {status.msg && (
          <div className={`mb-8 p-4 rounded-xl border flex items-center ${status.type === "success" ? "bg-green-50 border-green-100 text-green-800" : "bg-red-50 border-red-100 text-red-800"}`}>
            <span className="text-sm font-medium">{status.msg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <section className="lg:col-span-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center mb-6">
                <PlusCircle className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-bold text-slate-800">New Trade Order</h3>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Asset Name</label>
                  <input type="text" placeholder="e.g. BTC" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all text-black" value={form.asset_name} onChange={(e) => setForm({ ...form, asset_name: e.target.value })} required />
                </div>
                <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl">
                  <button type="button" onClick={() => setForm({ ...form, trade_type: "buy" })} className={`py-2 rounded-lg text-xs font-bold transition-all ${form.trade_type === "buy" ? "bg-white text-green-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>BUY</button>
                  <button type="button" onClick={() => setForm({ ...form, trade_type: "sell" })} className={`py-2 rounded-lg text-xs font-bold transition-all ${form.trade_type === "sell" ? "bg-white text-red-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>SELL</button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Amount</label>
                    <input type="number" step="any" placeholder="0.00" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-black" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Price</label>
                    <input type="number" step="any" placeholder="0.00" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-black" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                  </div>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-100 transition-all transform active:scale-[0.98]">
                  Execute Order
                </button>
              </form>
            </div>
          </section>

          <section className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-white flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Transaction History</h3>
                <span className="text-xs font-medium text-slate-400">{trades.length} active records</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Asset</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Amount</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {trades.length > 0 ? (
                      trades.map((trade) => (
                        <tr key={trade.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900">{trade.asset_name}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${trade.trade_type === "buy" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              {trade.trade_type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-medium text-slate-600">{trade.amount}</td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => handleDelete(trade.id)} className="text-red-400 hover:text-red-600 text-sm font-semibold transition-colors">
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center text-slate-400 italic">No trades found. Start trading above!</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}