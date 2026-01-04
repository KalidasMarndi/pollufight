import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { AlertTriangle, Factory, Construction, Navigation, Info } from 'lucide-react';

// Custom Marker Creator with Glowing Aura
const createMarkerIcon = (colorHex) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-8 h-8 rounded-full bg-${colorHex}-500/30 animate-ping"></div>
        <div class="relative w-4 h-4 rounded-full bg-${colorHex}-500 border-2 border-white shadow-[0_0_10px_rgba(0,0,0,0.5)]"></div>
      </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

const MapView = () => {
  const center = [28.4595, 77.0266]; // Cyber City, Gurugram

  const pollutionHotspots = [
    { id: 1, type: 'Industrial', pos: [28.4744, 77.0652], level: 'Critical', site: "Udyog Vihar Factory Cluster" },
    { id: 2, type: 'Construction', pos: [28.4505, 77.0266], level: 'High', site: "Sector 29 Luxury Heights" },
    { id: 3, type: 'Industrial', pos: [28.4850, 77.0850], level: 'Critical', site: "DLF Cyber Hub Backlane" }
  ];

  return (
    <div className="h-screen w-full relative bg-[#0f172a] pb-24 overflow-hidden">
      {/* Top HUD Overlay */}
      <div className="absolute top-6 left-6 right-6 z-[1000] space-y-3 pointer-events-none">
        <div className="glass p-5 rounded-[24px] flex justify-between items-center pointer-events-auto">
          <div>
            <h2 className="text-white font-black italic tracking-tighter">GUILTY MAP</h2>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">3 active violations</p>
          </div>
          <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
            <Navigation className="text-white" size={18} />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex space-x-2 pointer-events-auto">
          <div className="glass-emerald px-4 py-2 rounded-full text-[9px] font-black text-emerald-400 border-emerald-500/30">ALL THREATS</div>
          <div className="glass px-4 py-2 rounded-full text-[9px] font-black text-slate-400 uppercase">Industrial</div>
          <div className="glass px-4 py-2 rounded-full text-[9px] font-black text-slate-400 uppercase">Construction</div>
        </div>
      </div>

      {/* Map Container */}
      <MapContainer 
        center={center} 
        zoom={13} 
        zoomControl={false}
        className="h-full w-full grayscale-[0.9] invert-[0.95] contrast-[1.1]"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />

        {pollutionHotspots.map((spot) => (
          <React.Fragment key={spot.id}>
            {/* Heat Ring Overlay */}
            <Circle 
              center={spot.pos} 
              radius={500} 
              pathOptions={{ 
                fillColor: spot.type === 'Industrial' ? '#ef4444' : '#f97316',
                color: 'transparent',
                fillOpacity: 0.15
              }} 
            />
            
            <Marker 
              position={spot.pos} 
              icon={createMarkerIcon(spot.type === 'Industrial' ? 'red' : 'orange')}
            >
              <Popup className="custom-popup">
                <div className="p-3 w-48 bg-slate-900 text-white rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    {spot.type === 'Industrial' ? <Factory size={16} className="text-red-500"/> : <Construction size={16} className="text-orange-500"/>}
                    <span className="font-black text-xs uppercase italic">{spot.type} Alert</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mb-4">{spot.site}</p>
                  <button className="w-full bg-emerald-500 text-slate-900 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    Sign Petition
                  </button>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}
      </MapContainer>

      {/* Bottom Floating Info Card */}
      <div className="absolute bottom-32 left-6 right-6 z-[1000] glass p-4 rounded-2xl flex items-center space-x-4 border-l-4 border-emerald-500">
        <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-500">
          <Info size={18} />
        </div>
        <div>
          <h4 className="text-[10px] font-black text-white uppercase tracking-wider">Crowdsource Data Active</h4>
          <p className="text-[9px] text-slate-400 italic font-medium">Verified by 14 users in Cyber City</p>
        </div>
      </div>
    </div>
  );
};

export default MapView;