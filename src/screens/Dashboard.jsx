import React, { useState, useEffect } from 'react';
import { AlertCircle, Activity, Zap, Wind } from 'lucide-react';

// Destructure reportCount from props
const Dashboard = ({ reportCount }) => {
  const [threat, setThreat] = useState(0);
  
  // Animation for the gauge on load
  useEffect(() => { 
    setTimeout(() => setThreat(78), 300); 
  }, []);

  return (
    <div className="min-h-screen pb-28 p-6 bg-gradient-to-b from-slate-900 to-[#0f172a]">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-[10px] font-black tracking-[0.2em] text-emerald-500 uppercase">System Active</h2>
          <h1 className="text-3xl font-black tracking-tighter italic">POLLU<span className="text-emerald-500">FIGHT</span></h1>
        </div>
        <div className="glass p-3 rounded-2xl">
          <Activity className="text-emerald-500 animate-[pulse_2s_infinite]" size={20} />
        </div>
      </div>

      {/* Hero Gauge */}
      <div className="glass rounded-[40px] p-10 relative flex flex-col items-center justify-center mb-8 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
        
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-emerald-500/10 animate-pulse" />
          
          <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]">
            <circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800/50" />
            <circle
              cx="128"
              cy="128"
              r="110"
              stroke="url(#gradient)"
              strokeWidth="14"
              fill="transparent"
              strokeDasharray={691}
              strokeDashoffset={691 - (691 * threat) / 100}
              strokeLinecap="round"
              className="transition-all duration-[1.5s] ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute flex flex-col items-center">
            <span className="text-7xl font-black tracking-tighter">{threat}</span>
            <span className="text-red-500 font-bold text-xs tracking-[0.3em] uppercase">Critical</span>
          </div>
        </div>
      </div>

      {/* Local Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* DYNAMIC RADIUS REPORTS */}
        <div className="glass-emerald p-5 rounded-3xl">
          <Wind className="text-emerald-400 mb-2" size={20} />
          <p className="text-slate-400 text-[10px] font-bold uppercase">Radius Reports</p>
          <h3 className="text-2xl font-black italic">
            {/* Displaying the prop here */}
            {reportCount < 10 ? `0${reportCount}` : reportCount}
          </h3>
        </div>

        <div className="glass p-5 rounded-3xl border-orange-500/20">
          <Zap className="text-orange-400 mb-2" size={20} />
          <p className="text-slate-400 text-[10px] font-bold uppercase">Active Sites</p>
          <h3 className="text-2xl font-black italic">04</h3>
        </div>
      </div>
      
      {/* Alerts */}
      <div className="mt-6 glass rounded-2xl p-4 flex items-center space-x-4 border-l-4 border-l-red-500">
        <div className="bg-red-500/20 p-2 rounded-lg">
          <AlertCircle className="text-red-500" size={20} />
        </div>
        <p className="text-xs font-medium text-slate-300 italic">"Illegal factory discharge detected in Udyog Vihar..."</p>
      </div>
    </div>
  );
};

export default Dashboard;