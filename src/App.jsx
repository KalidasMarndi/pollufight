import React, { useState } from 'react'; // Added useState
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Camera, Map, Wallet } from 'lucide-react';

import Dashboard from './screens/Dashboard';
import AILens from './screens/AILens';
import MapView from './screens/MapView';
import EcoWallet from './screens/EcoWallet';
import Success from './screens/Success'; // Import your success screen

const Navigation = () => {
  const location = useLocation();
  const navItems = [
    { path: '/', icon: Home, label: 'Pulse' },
    { path: '/lens', icon: Camera, label: 'AI Lens' },
    { path: '/map', icon: Map, label: 'Guilty Map' },
    { path: '/wallet', icon: Wallet, label: 'Wallet' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 px-6 py-3 pb-8 flex justify-between items-center z-[5000]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`flex flex-col items-center space-y-1 transition-all ${isActive ? 'text-emerald-400 scale-110' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

function App() {
  // --- GLOBAL STATE ---
  const [points, setPoints] = useState(750);
  const [reportCount, setReportCount] = useState(12);

  // Function that runs when the user successfully uploads a report
  // uploadedUrl: optional Cloudinary URL of the uploaded image
  const handleReportSuccess = (uploadedUrl) => {
    setPoints(prev => prev + 100);
    setReportCount(prev => prev + 1);
    if (uploadedUrl) {
      console.log('Report image uploaded to:', uploadedUrl);
    }
  };

  return (
    <Router>
      <div className="bg-slate-900 min-h-screen text-white">
        <Routes>
          {/* Pass data as PROPS to the screens */}
          <Route path="/" element={<Dashboard reportCount={reportCount} />} />
          <Route path="/lens" element={<AILens onReportSuccess={handleReportSuccess} />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/wallet" element={<EcoWallet points={points} />} />
          <Route path="/success" element={<Success />} />
        </Routes>

        <Navigation />
      </div>
    </Router>
  );
}

export default App;