"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, ShoppingCart, TrendingUp, TrendingDown, Wallet,Trash2 } from "lucide-react";

export default function PrimeTradeDashboard() {
  const [user, setUser] = useState(null);
  const [trades, setTrades] = useState([]);
  const [status, setStatus] = useState({ msg: "", type: "" });
  
  // 1. Local Market Catalog State
  const [marketStocks, setMarketStocks] = useState([
    { id: 1, symbol: "AAPL", name: "Apple Inc.", price: 182.50, change: 0 },
    { id: 2, symbol: "TSLA", name: "Tesla Motors", price: 215.30, change: 0 },
    { id: 3, symbol: "BTC", name: "Bitcoin Core", price: 45000.00, change: 0 },
    { id: 4, symbol: "NVDA", name: "Nvidia Corp", price: 540.20, change: 0 },
    { id: 5, symbol: "AMZN", name: "Amazon Web", price: 145.10, change: 0 },
    { id: 6, symbol: "ETH", name: "Ethereum", price: 2450.00, change: 0 }
  ]);
  const [quantities, setQuantities] = useState({});
  const router = useRouter();

  // Inside PrimeTradeDashboard component:
const handleDelete = async (id) => {
  if (!window.confirm("Permanently delete this trade ?")) return;

  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/trades/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setStatus({ msg: "Trade deleted successfully", type: "success" });
      loadTrades(token); // Refresh the table
    }
  } catch (err) {
    setStatus({ msg: "Connection error", type: "error" });
  }
};

  // Initialization & Security Guard
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserStr = localStorage.getItem("user");

    if (!token) {
      router.push("/login");
      return;
    }

    if (storedUserStr) {
      const storedUser = JSON.parse(storedUserStr);
      if (storedUser.role === 'admin') {
        router.push("/admindash");
        return;
      }
      setUser(storedUser);
    }
    loadTrades(token);

    // 2. Real-Time Price Simulation Engine
    const ticker = setInterval(() => {
      setMarketStocks((prev) => prev.map(stock => {
        const fluctuation = (Math.random() - 0.5) * (stock.price * 0.005); // 0.5% max move
        return { 
          ...stock, 
          price: parseFloat((stock.price + fluctuation).toFixed(2)),
          change: fluctuation 
        };
      }));
      
    }, 1000);

    return () => clearInterval(ticker);
  }, []);

  const loadTrades = async (token) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/trades`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTrades(Array.isArray(data) ? data : []);
    } catch (err) {
      setStatus({ msg: "Fetch error", type: "error" });
    }
  };

// 3. Persistent Buy Operation with Confirmation
  const handleBuy = async (stock, qty) => {
    // Calculate total for the confirmation message
    const totalCost = (stock.price * qty).toFixed(2);
    
    // Show confirmation dialog with stock details
    const isConfirmed = window.confirm(
      `Confirm Purchase:\n\n` +
      `Asset: ${stock.symbol}\n` +
      `Quantity: ${qty}\n` +
      `Price per unit: $${stock.price}\n` +
      `Total Cost: $${totalCost}\n\n` +
      `Do you want to proceed?`
    );

    // If user clicks "Cancel", stop the function
    if (!isConfirmed) return;

    const token = localStorage.getItem("token");
    const tradeData = {
      asset_name: stock.symbol,
      trade_type: "buy",
      amount: qty,
      price: stock.price
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/trades`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(tradeData),
      });

      if (res.ok) {
        setStatus({ msg: `Successfully bought ${qty} units of ${stock.symbol}!`, type: "success" });
        loadTrades(token); // Refresh the MySQL ledger
      } else {
        setStatus({ msg: "Transaction failed: Unauthorized or invalid data", type: "error" });
      }
    } catch (err) {
      setStatus({ msg: "Server connection error", type: "error" });
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="text-blue-600" />
            <span className="text-xl font-bold tracking-tight">PrimeTrade</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/")} className="text-sm font-bold text-blue-600">Home&nbsp; &nbsp;</button>
               
            <div className="text-right">
              
              <p className="text-xs font-bold text-black">{user?.username}</p>
              <p className="text-[10px] text-slate-400 uppercase font-black">{user?.role}</p>
            </div>
            <button onClick={() => { localStorage.clear(); router.push("/login"); }} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Market Simulator</h1>
          <p className="text-slate-500 font-medium">Live prices fluctuating per second. Submit trades to MySQL.</p>
        </header>

        {status.msg && (
          <div className={`mb-8 p-4 rounded-xl border font-bold ${status.type === "success" ? "bg-green-50 border-green-100 text-green-700" : "bg-red-50 border-red-100 text-red-700"}`}>
            {status.msg}
          </div>
        )}

        {/* 4. Live Stock Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {marketStocks.map((stock) => (
            <div key={stock.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-400 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-black group-hover:text-blue-600 transition-colors uppercase">{stock.symbol}</h3>
                  <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase">{stock.name}</p>
                </div>
                <div className={`flex items-center text-xs font-black ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stock.change >= 0 ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                  {Math.abs((stock.change / stock.price) * 100).toFixed(2)}%
                </div>
              </div>

              <div className="mb-6">
                <p className="text-2xl font-black text-black">${stock.price.toLocaleString()}</p>
              </div>

              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  min="1"
                  placeholder="One "
                  className="w-20 p-2 bg-slate-50 border rounded-lg text-black font-bold outline-none focus:ring-2 focus:ring-blue-100"
                  onChange={(e) => setQuantities({ ...quantities, [stock.id]: e.target.value })}
                />
                <button 
                  onClick={() => handleBuy(stock, quantities[stock.id] || 1)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100 transform active:scale-95 transition-all"
                >
                  <ShoppingCart size={16} /> Buy
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 5. Trades History Table */} 
<table className="w-full text-left">
  <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
    <tr>
      <th className="px-6 py-4">Asset</th>
      <th className="px-6 py-4">Price</th>
      <th className="px-6 py-4">Qty</th>
      <th className="px-6 py-4 text-center">Action</th>
      <th className="px-6 py-4 text-right">Time</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-slate-100 text-black">
    {trades.map((t) => (
      <tr key={t.id} className="hover:bg-slate-50">
        <td className="px-6 py-4 font-bold text-blue-600">{t.asset_name}</td>
        <td className="px-6 py-4">${t.price}</td>
        <td className="px-6 py-4">{t.amount}</td>
        <td className="px-6 py-4 text-center">
          <button onClick={() => handleDelete(t.id)} className="text-slate-300 hover:text-red-600 p-2">
            <Trash2 size={16} />
          </button>
        </td>
        <td className="px-6 py-4 text-right text-xs text-slate-400">
          {new Date(t.created_at).toLocaleTimeString()}
        </td>
      </tr>
    ))}
  </tbody>
</table>
      </main>
    </div>
  );
}