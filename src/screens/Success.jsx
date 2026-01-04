import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, ShieldCheck, Map, Home, FileText } from 'lucide-react';

const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 flex flex-col items-center justify-center pb-32">
      {/* 1. Success Animation Header */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-emerald-500 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="relative bg-emerald-500/10 p-6 rounded-full border-2 border-emerald-500/20 animate-in zoom-in duration-500">
          <CheckCircle size={80} className="text-emerald-500" />
        </div>
      </div>

      <h1 className="text-3xl font-black italic text-white tracking-tighter mb-2 uppercase">
        Violation <span className="text-emerald-500">Logged</span>
      </h1>
      <p className="text-slate-400 text-center text-sm font-medium px-8 mb-10">
        AI analysis verified. Your report has been dispatched to the <span className="text-white">Central Pollution Board</span>.
      </p>

      {/* 2. Impact Summary Card */}
      <div className="w-full glass rounded-[32px] p-6 mb-6 space-y-6 border-emerald-500/20">
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500/20 p-2 rounded-lg">
              <ShieldCheck size={20} className="text-emerald-500" />
            </div>
            <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Bounty Earned</span>
          </div>
          <span className="text-2xl font-black text-emerald-400 italic">+₹100</span>
        </div>

        {/* AI Generated Snippet */}
        <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
          <div className="flex items-center space-x-2 mb-2 text-slate-500">
            <FileText size={14} />
            <span className="text-[9px] font-black uppercase">Auto-Generated Complaint</span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono italic leading-relaxed">
            "Formal report #PF-9921: Industrial particulate emission detected at [Current GPS]. Plume density exceeds legal threshold of 20% opacity..."
          </p>
        </div>
      </div>

      {/* 3. Action Buttons */}
      <div className="w-full space-y-3">
        <button 
          onClick={() => navigate('/map')}
          className="w-full bg-emerald-500 text-slate-900 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center space-x-2 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
        >
          <Map size={18} />
          <span>Track on Guilty Map</span>
        </button>

        <button 
          onClick={() => navigate('/')}
          className="w-full glass border-white/10 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center space-x-2 active:scale-95 transition-all"
        >
          <Home size={18} />
          <span>Back to Dashboard</span>
        </button>
      </div>
      
      {/* Social Proof */}
      <p className="mt-8 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
        Joined by 1,240 Scouts in your city
      </p>
    </div>
  );
};

export default Success; 