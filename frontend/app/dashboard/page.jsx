"use client";
import { useState, useEffect } from 'react';

export default function ConnectionTest() {
  const [status, setStatus] = useState({ backend: 'testing', database: 'testing' });

  useEffect(() => {
    async function checkHealth() {
      try {
        const response = await fetch('http://localhost:8000/api/v1/health');
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">PrimeTrade Connectivity Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Backend Status Card */}
        <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-sm font-semibold text-gray-500 uppercase">Express Server</h2>
          <p className={`text-xl font-bold ${status.backend === 'Connected' ? 'text-green-600' : 'text-red-600'}`}>
            {status.backend}
          </p>
        </div>

        {/* Database Status Card */}
        <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-orange-500">
          <h2 className="text-sm font-semibold text-gray-500 uppercase">MySQL (PrimeTrade)</h2>
          <p className={`text-xl font-bold ${status.database === 'Connected' ? 'text-green-600' : 'text-red-600'}`}>
            {status.database}
          </p>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 text-blue-700 rounded-md">
        <p className="text-sm italic">If both show "Connected", your API versioning and database schema are correctly integrated[cite: 14, 16].</p>
      </div>
    </div>
  );
}