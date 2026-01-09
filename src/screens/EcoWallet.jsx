import React, { useState, useEffect } from 'react';
import { Award, Wallet, TrendingUp, Clock, Zap, Plus, Minus, Loader2 } from 'lucide-react';
import { getUserCredits, incrementCredits, decrementCredits, getUserId } from '../services/userCredits';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

// Destructure points from props (keeping for backward compatibility, but will use Firebase)
const EcoWallet = ({ points: propsPoints }) => {
  const [credits, setCredits] = useState(propsPoints || 0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Get user ID
    const uid = getUserId();
    setUserId(uid);

    // Subscribe to real-time updates
    const userRef = doc(db, 'user_credits', uid);
    const unsubscribe = onSnapshot(
      userRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCredits(data.credits || 0);
        } else {
          // User doesn't exist yet, fetch initial credits
          getUserCredits(uid).then((result) => {
            if (result.success) {
              setCredits(result.credits || 0);
            }
          });
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error in credits subscription:', error);
        // Fallback to fetching credits
        getUserCredits(uid).then((result) => {
          if (result.success) {
            setCredits(result.credits || 0);
          }
        });
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleIncrement = async (amount = 100) => {
    setUpdating(true);
    try {
      const result = await incrementCredits(amount);
      if (!result.success) {
        alert(`Failed to increment credits: ${result.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleDecrement = async (amount = 100) => {
    setUpdating(true);
    try {
      const result = await decrementCredits(amount);
      if (!result.success) {
        alert(`Failed to decrement credits: ${result.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  // Use Firebase credits if available, otherwise fall back to props
  const displayCredits = loading ? (propsPoints || 0) : credits;

  return (
    <div className="min-h-screen pb-28 p-6 bg-[#0f172a]">
      <h1 className="text-2xl font-black italic mb-8 uppercase tracking-tighter">
        Eco<span className="text-emerald-500">Wallet</span>
      </h1>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-700 rounded-[32px] p-8 shadow-2xl shadow-emerald-500/20 mb-8 relative overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="absolute top-0 right-0 p-4 opacity-20 rotate-12">
          <TrendingUp size={120} />
        </div>

        <p className="text-emerald-100/70 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
          Available Bounty
        </p>

        {/* Dynamic Points Display */}
        <h2 className="text-5xl font-black text-white italic tracking-tighter">
          {loading ? (
            <Loader2 size={48} className="animate-spin inline-block" />
          ) : (
            `${displayCredits.toLocaleString()} credits`
          )}
        </h2>

        <div className="mt-8 flex justify-between items-center">
          <div className="glass bg-white/20 px-4 py-2 rounded-xl text-[9px] font-black uppercase text-white tracking-widest border border-white/20">
            Elite Scout Tier
          </div>
          <Award className="text-white" size={24} />
        </div>
      </div>

      {/* Test Buttons Section */}
      <div className="mb-6 glass p-5 rounded-3xl border border-blue-500/30">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-4">
          Test Controls (Firebase)
        </h3>
        {userId && (
          <p className="text-[8px] text-slate-500 mb-4 font-mono">
            User ID: {userId}
          </p>
        )}
        <div className="flex space-x-3">
          <button
            onClick={() => handleIncrement(100)}
            disabled={updating || loading}
            className="flex-1 bg-emerald-500/80 hover:bg-emerald-500 text-white px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all"
          >
            {updating ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Plus size={14} />
                <span>+100 credits</span>
              </>
            )}
          </button>
          <button
            onClick={() => handleDecrement(100)}
            disabled={updating || loading}
            className="flex-1 bg-red-500/80 hover:bg-red-500 text-white px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all"
          >
            {updating ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Minus size={14} />
                <span>-100 credits</span>
              </>
            )}
          </button>
        </div>
        <div className="flex space-x-3 mt-3">
          <button
            onClick={() => handleIncrement(50)}
            disabled={updating || loading}
            className="flex-1 bg-emerald-500/60 hover:bg-emerald-500/80 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all"
          >
            <Plus size={12} />
            <span>+50 credits</span>
          </button>
          <button
            onClick={() => handleDecrement(50)}
            disabled={updating || loading}
            className="flex-1 bg-red-500/60 hover:bg-red-500/80 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all"
          >
            <Minus size={12} />
            <span>-50 credits</span>
          </button>
        </div>
      </div>

      {/* Verification History Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Verification History
          </h3>
          <Clock size={14} className="text-slate-500" />
        </div>

        {/* Dynamic Transaction List */}
        <div className="space-y-3">
          {/* Mocking the most recent report based on point growth */}
          {displayCredits > 750 && (
            <div className="glass-emerald p-5 rounded-3xl flex justify-between items-center border-emerald-500/30 animate-in slide-in-from-left duration-500">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-slate-900 shadow-lg shadow-emerald-500/40">
                  <Zap size={20} fill="currentColor" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Latest Bounty</h4>
                  <p className="text-[10px] text-emerald-400 font-black uppercase tracking-tighter">Verified • Just Now</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-emerald-400 text-lg">+100 credits</p>
              </div>
            </div>
          )}

          {/* Standard History */}
          <div className="glass p-5 rounded-3xl flex justify-between items-center opacity-60">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400">
                <Wallet size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white text-opacity-80">Vehicle Emission</h4>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Verified • 2h ago</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black text-slate-400">+150 credits</p>
            </div>
          </div>
        </div>
      </div>

      <button className="mt-8 w-full glass border-emerald-500/20 py-5 rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] text-emerald-400 hover:bg-emerald-500/10 transition-colors active:scale-95">
        Redeem to Bank Account
      </button>
    </div>
  );
};

export default EcoWallet;
