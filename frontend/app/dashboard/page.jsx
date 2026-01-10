"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PrimeTradeDashboard() {
  const [trades, setTrades] = useState([]);
  const [form, setForm] = useState({
    asset_name: "",
    trade_type: "buy",
    amount: "",
    price: "",
  });
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState({ msg: "", type: "" });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (!token) router.push("/login"); // Redirect if no JWT
    setUser(storedUser);
    loadData(token);
  }, []);

  const loadData = async (token) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/trades`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setTrades(data);
    } catch (err) {
      setStatus({ msg: "Failed to load trades", type: "error" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/trades`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      }
    );

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
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      {/* Header with Role Display  */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            PrimeTrade Terminal
          </h1>
          <p className="text-slate-500">
            Welcome, {user?.username} ({user?.role})
          </p>
        </div>
        <button
          onClick={() => {
            localStorage.clear();
            router.push("/login");
          }}
          className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium"
        >
          Logout
        </button>
      </div>

      {status.msg && (
        <div
          className={`mb-6 p-4 rounded-lg border ${
            status.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {status.msg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Entity Form [cite: 23] */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-4 text-slate-700">
            New Trade Order
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Asset Name (e.g. BTC)"
              className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-black-500  text-black"
              value={form.asset_name}
              onChange={(e) => setForm({ ...form, asset_name: e.target.value })}
              required
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, trade_type: "buy" })}
                className={`flex-1 py-2 rounded-lg font-bold  text-black border ${
                  form.trade_type === "buy"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                BUY
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, trade_type: "sell" })}
                className={`flex-1 py-2 rounded-lg font-bold text-black border ${
                  form.trade_type === "sell"
                    ? "bg-red-500 text-white border-black-500"
                    : "bg-gray-100"
                }`}
              >
                SELL
              </button>
            </div>
            <input
              type="number"
              placeholder="Amount"
              className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-black-500  text-black"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Price"
              className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-black-500  text-black"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
            <button className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition">
              Execute Order
            </button>
          </form>
        </div>

        {/* Data Table with Role-Based Controls [cite: 12, 13] */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 text-slate-600 font-semibold">Asset</th>
                <th className="p-4 text-slate-600 font-semibold">Type</th>
                <th className="p-4 text-slate-600 font-semibold">Total</th>
                <th className="p-4 text-slate-600 font-semibold text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {/* 2. Use optional chaining or check if trades is an array */}
              {Array.isArray(trades) ? (
                trades.map((trade) => (
                  <tr key={trade.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{trade.asset_name}</td>
                    <td className="p-2 uppercase text-xs font-bold text-green-600">
                      {trade.trade_type}
                    </td>
                    <td className="p-2">{trade.amount}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleDelete(trade.id)}
                        className="text-red-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No trades found or data error.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
