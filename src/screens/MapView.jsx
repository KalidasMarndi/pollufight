import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { AlertTriangle, Factory, Construction, Navigation, Info, Loader2, CheckCircle2, Clock } from 'lucide-react';
import { subscribeToReports, updateReportStatus } from '../services/pollutionReports';

// Custom Marker Creator with Glowing Aura
const createMarkerIcon = (color) => {
  // Map status to color hex codes
  const colorMap = {
    red: '#ef4444',
    orange: '#f97316',
    green: '#10b981'
  };

  const colorHex = colorMap[color] || colorMap.red;

  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-8 h-8 rounded-full animate-ping" style="background-color: ${colorHex}30;"></div>
        <div class="relative w-4 h-4 rounded-full border-2 border-white shadow-[0_0_10px_rgba(0,0,0,0.5)]" style="background-color: ${colorHex};"></div>
      </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

// Map status to color
const getStatusColor = (status) => {
  switch (status) {
    case 'detected':
      return 'red';
    case 'in_progress':
      return 'orange';
    case 'resolved':
      return 'green';
    default:
      return 'red';
  }
};

// Map status to display name
const getStatusDisplay = (status) => {
  switch (status) {
    case 'detected':
      return 'Detected';
    case 'in_progress':
      return 'In Progress';
    case 'resolved':
      return 'Resolved';
    default:
      return 'Unknown';
  }
};

// Hardcoded demo spots for demonstration
const DEMO_SPOTS = [
  {
    id: 'demo-1',
    status: 'detected',
    location: {
      latitude: 28.4744,
      longitude: 77.0652
    },
    metadata: {
      site: 'Udyog Vihar Factory Cluster',
      type: 'Industrial'
    },
    imageUrl: null,
    createdAt: { toDate: () => new Date() },
    updatedAt: { toDate: () => new Date() },
    isDemo: true
  },
  {
    id: 'demo-2',
    status: 'in_progress',
    location: {
      latitude: 28.4505,
      longitude: 77.0266
    },
    metadata: {
      site: 'Sector 29 Luxury Heights Construction',
      type: 'Construction'
    },
    imageUrl: null,
    createdAt: { toDate: () => new Date() },
    updatedAt: { toDate: () => new Date() },
    isDemo: true
  },
  {
    id: 'demo-3',
    status: 'resolved',
    location: {
      latitude: 28.4850,
      longitude: 77.0850
    },
    metadata: {
      site: 'DLF Cyber Hub Backlane',
      type: 'Industrial'
    },
    imageUrl: null,
    createdAt: { toDate: () => new Date() },
    updatedAt: { toDate: () => new Date() },
    isDemo: true
  },
  {
    id: 'demo-4',
    status: 'detected',
    location: {
      latitude: 28.4420,
      longitude: 77.0400
    },
    metadata: {
      site: 'Sector 18 Industrial Area',
      type: 'Industrial'
    },
    imageUrl: null,
    createdAt: { toDate: () => new Date() },
    updatedAt: { toDate: () => new Date() },
    isDemo: true
  }
];

const MapView = () => {
  const center = [28.4595, 77.0266]; // Cyber City, Gurugram
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null); // Track which report is being updated

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = subscribeToReports((reportsData) => {
      // Filter out reports without valid location data
      const validReports = reportsData.filter(
        report => report.location &&
          report.location.latitude &&
          report.location.longitude
      );
      // Merge demo spots with Firestore reports (demo spots first, then real reports)
      const allReports = [...DEMO_SPOTS, ...validReports];
      setReports(allReports);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleStatusUpdate = async (reportId, newStatus) => {
    // Check if it's a demo spot
    const report = reports.find(r => r.id === reportId);
    if (report?.isDemo) {
      // For demo spots, update local state only
      setReports(prevReports =>
        prevReports.map(r =>
          r.id === reportId ? { ...r, status: newStatus } : r
        )
      );
      return;
    }

    // For real reports, update in Firestore
    setUpdatingStatus(reportId);
    try {
      const result = await updateReportStatus(reportId, newStatus);
      if (!result.success) {
        console.error('Failed to update status:', result.error);
        alert('Failed to update status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Count active violations (detected + in_progress)
  const activeViolations = reports.filter(
    report => report.status === 'detected' || report.status === 'in_progress'
  ).length;

  return (
    <div className="h-screen w-full relative bg-[#0f172a] pb-24 overflow-hidden">
      {/* Top HUD Overlay */}
      <div className="absolute top-6 left-6 right-6 z-[1000] space-y-3 pointer-events-none">
        <div className="glass p-5 rounded-[24px] flex justify-between items-center pointer-events-auto">
          <div>
            <h2 className="text-white font-black italic tracking-tighter">GUILTY MAP</h2>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
              {loading ? 'Loading...' : `${activeViolations} active violation${activeViolations !== 1 ? 's' : ''}`}
            </p>
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

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-2000 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-slate-800/90 p-6 rounded-2xl border border-slate-700 flex flex-col items-center space-y-3">
            <Loader2 size={24} className="text-emerald-400 animate-spin" />
            <span className="text-emerald-400 font-mono text-[10px] uppercase tracking-widest">Loading Reports</span>
          </div>
        </div>
      )}

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

        {reports.map((report) => {
          const statusColor = getStatusColor(report.status);
          const colorHex = statusColor === 'red' ? '#ef4444' : statusColor === 'orange' ? '#f97316' : '#10b981';
          const position = [report.location.latitude, report.location.longitude];

          return (
            <React.Fragment key={report.id}>
              {/* Heat Ring Overlay */}
              <Circle
                center={position}
                radius={500}
                pathOptions={{
                  fillColor: colorHex,
                  color: 'transparent',
                  fillOpacity: 0.15
                }}
              />

              <Marker
                position={position}
                icon={createMarkerIcon(statusColor)}
              >
                <Popup className="custom-popup">
                  <div className="p-3 w-56 bg-slate-900 text-white rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      {report.status === 'resolved' ? (
                        <CheckCircle2 size={16} className="text-green-500" />
                      ) : report.status === 'in_progress' ? (
                        <Clock size={16} className="text-orange-500" />
                      ) : (
                        <Factory size={16} className="text-red-500" />
                      )}
                      <span className="font-black text-xs uppercase italic">
                        {getStatusDisplay(report.status)} Alert
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-3">
                      <span
                        className={`inline-block px-2 py-1 rounded text-[9px] font-black uppercase ${report.status === 'detected' ? 'bg-red-500/20 text-red-400' :
                          report.status === 'in_progress' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-green-500/20 text-green-400'
                          }`}
                      >
                        {getStatusDisplay(report.status)}
                      </span>
                    </div>

                    {report.metadata?.site && (
                      <p className="text-[10px] text-slate-400 mb-3">{report.metadata.site}</p>
                    )}

                    {/* Status Update Buttons */}
                    <div className="space-y-2">
                      {report.status === 'detected' && (
                        <button
                          onClick={() => handleStatusUpdate(report.id, 'in_progress')}
                          disabled={updatingStatus === report.id}
                          className="w-full bg-orange-500 text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          {updatingStatus === report.id ? (
                            <>
                              <Loader2 size={12} className="animate-spin" />
                              <span>Updating...</span>
                            </>
                          ) : (
                            <>
                              <Clock size={12} />
                              <span>Mark as In Progress</span>
                            </>
                          )}
                        </button>
                      )}

                      {(report.status === 'detected' || report.status === 'in_progress') && (
                        <button
                          onClick={() => handleStatusUpdate(report.id, 'resolved')}
                          disabled={updatingStatus === report.id}
                          className="w-full bg-emerald-500 text-slate-900 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          {updatingStatus === report.id ? (
                            <>
                              <Loader2 size={12} className="animate-spin" />
                              <span>Updating...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 size={12} />
                              <span>Mark as Resolved</span>
                            </>
                          )}
                        </button>
                      )}

                      {report.status === 'resolved' && (
                        <div className="text-center py-2">
                          <p className="text-[9px] text-green-400 font-bold uppercase">Issue Resolved</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Bottom Floating Info Card */}
      <div className="absolute bottom-32 left-6 right-6 z-[1000] glass p-4 rounded-2xl flex items-center space-x-4 border-l-4 border-emerald-500">
        <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-500">
          <Info size={18} />
        </div>
        <div>
          <h4 className="text-[10px] font-black text-white uppercase tracking-wider">Crowdsource Data Active</h4>
          <p className="text-[9px] text-slate-400 italic font-medium">
            {reports.length} report{reports.length !== 1 ? 's' : ''} tracked in real-time
          </p>
        </div>
      </div>
    </div>
  );
};

export default MapView;
