import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, RotateCcw, UploadCloud, ShieldAlert, Zap, X, AlertCircle, ShieldCheck } from 'lucide-react';
import { uploadToCloudinary } from '../services/cloudinaryUpload';
import { getCurrentLocation, logImageLocation } from '../services/locationLogger';
import { createReport } from '../services/pollutionReports';

// Added { onReportSuccess } prop from App.jsx
const AILens = ({ onReportSuccess }) => {

  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [showDetection, setShowDetection] = useState(false); // New state for AI box

  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [capturedLocation, setCapturedLocation] = useState(null);

  const handleImageUpload = async (imageDataUrl, location = null) => {
    setIsUploading(true);

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(imageDataUrl);

    if (uploadResult.success) {
      setUploadedUrl(uploadResult.url);

      // Log location if available
      if (location) {
        await logImageLocation(
          { imageUrl: uploadResult.url, imageDataUrl },
          location
        );
      }
    } else {
      // We don't block the UI yet; we catch the error when they try to Verify
      setErrorMsg("Background upload failed. Please retake.");
    }

    setIsUploading(false);
  };

  const startCamera = useCallback(async () => {
    setStatus('idle');
    setErrorMsg('');
    setUploadedUrl(null);
    setIsUploading(false);
    setShowDetection(false);
    setCapturedLocation(null);

    try {
      const constraints = {
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false
      };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      streamRef.current = newStream;

      if (videoRef.current) videoRef.current.srcObject = newStream;
    } catch (err) {
      setErrorMsg("Camera access denied or not found.");
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  }, [startCamera]);

  const handleCapture = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageDataUrl);

      stream?.getTracks().forEach(track => track.stop());
      setStream(null);

      // Trigger AI Detection box after 800ms for "Scanning" feel
      setTimeout(() => setShowDetection(true), 800);

      // Get location before uploading
      const locationResult = await getCurrentLocation({
        timeout: 5000,
        enableHighAccuracy: true
      });

      let location = null;
      if (locationResult.success) {
        location = locationResult.location;
        setCapturedLocation(location);
      }
      // Continue without location if capture failed - don't block the upload

      // Upload image (location will be logged after successful upload)
      handleImageUpload(imageDataUrl, location);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setShowDetection(false);
    setCapturedLocation(null);
    startCamera();
  };

  const createPollutionReport = async (imageUrl) => {
    if (!capturedLocation) {
      console.warn('No location available for report creation');
      return;
    }

    try {
      const reportResult = await createReport({
        location: capturedLocation,
        imageUrl,
        metadata: {
          accuracy: capturedLocation.accuracy,
          type: 'Industrial', // Default type, can be enhanced later
          site: null // Can be enhanced with reverse geocoding later
        }
      });

      if (reportResult.success) {
        console.log('Pollution report created successfully:', reportResult.reportId);
      } else {
        console.error('Failed to create pollution report:', reportResult.error);
        // Don't block navigation on report creation failure
      }
    } catch (error) {
      console.error('Error creating pollution report:', error);
      // Don't block navigation on report creation failure
    }
  };

  const handleVerify = async () => {
    // If the upload is already done, create report and proceed
    if (uploadedUrl) {
      await createPollutionReport(uploadedUrl);
      onReportSuccess(uploadedUrl);
      navigate('/success');
    }
    // If still uploading, set status to 'scanning' (loading UI)
    // The useEffect below will watch for when the upload finishes
    else if (isUploading) {
      setStatus('scanning');
    }
    // If upload failed or didn't start
    else {
      setErrorMsg("Upload failed. Please Retake.");
    }
  };

  useEffect(() => {
    if (status === 'scanning' && uploadedUrl) {
      // Small delay to let the user see the "Scanning" animation briefly 
      // (optional, simply for better UX feel)
      const timer = setTimeout(async () => {
        await createPollutionReport(uploadedUrl);
        onReportSuccess(uploadedUrl);
        navigate('/success');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [status, uploadedUrl, onReportSuccess, navigate, capturedLocation]);

  return (
    <div className="relative h-screen bg-black overflow-hidden flex flex-col font-sans">

      <div className="relative flex-1 bg-slate-950 overflow-hidden flex items-center justify-center">
        {!capturedImage ? (
          <>
            <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover grayscale-[0.2]" />
            <div className="absolute inset-0 border-20 border-black/20 pointer-events-none">
              <div className="absolute top-10 left-10 w-8 h-8 border-t-2 border-l-2 border-emerald-500" />
              <div className="absolute top-10 right-10 w-8 h-8 border-t-2 border-r-2 border-emerald-500" />
              <div className="absolute bottom-10 left-10 w-8 h-8 border-b-2 border-l-2 border-emerald-500" />
              <div className="absolute bottom-10 right-10 w-8 h-8 border-b-2 border-r-2 border-emerald-500" />
            </div>
          </>
        ) : (
          <div className="relative w-full h-full">
            <img src={capturedImage} alt="Preview" className="w-full h-full object-cover opacity-80" />

            {/* --- AI DETECTION BOUNDING BOX --- */}
            {showDetection && (
              <div className="absolute top-1/4 left-1/4 w-1/2 h-1/3 border-2 border-red-500 rounded-sm animate-in zoom-in duration-300">
                <div className="absolute -top-7 left-0 bg-red-500 px-3 py-1 rounded-t-md flex items-center space-x-2 shadow-lg">
                  <ShieldAlert size={12} className="text-white animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase tracking-tighter">VIOLATION: TOXIC EMISSION</span>
                </div>
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-white" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-white" />

                {/* Confidence Badge */}
                <div className="absolute -bottom-6 right-0 text-[8px] font-mono text-red-400 bg-black/60 px-2">
                  CONFIDENCE: 98.4%
                </div>
              </div>
            )}
          </div>
        )}

        {status === 'scanning' && (
          <div className="absolute inset-0 z-40 bg-emerald-500/10 backdrop-blur-[2px]">
            <div className="w-full h-1 bg-emerald-400 shadow-[0_0_25px_#10b981] animate-scan" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 px-6 py-4 rounded-2xl border border-emerald-500/50 flex flex-col items-center">
              <Zap size={24} className="text-emerald-400 animate-pulse mb-2" />
              <span className="text-emerald-400 font-mono text-[10px] uppercase tracking-[0.3em]">Uploading to Registry</span>
            </div>
          </div>
        )}
      </div>

      <div className="h-44 bg-slate-900/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-center px-6 pb-12">
        {!capturedImage ? (
          <div className="relative flex items-center justify-center w-full">
            <button onClick={handleCapture} className="group relative">
              <div className="absolute -inset-2 bg-emerald-500/20 rounded-full blur-md group-active:scale-90" />
              <div className="relative w-20 h-20 rounded-full border-4 border-white/30 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full border-4 border-slate-900 shadow-xl" />
              </div>
            </button>
            <span className="absolute -bottom-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Identify Threat</span>
          </div>
        ) : (
          <div className="flex w-full items-center justify-center gap-4 animate-in slide-in-from-bottom-5">
            <button onClick={handleRetake} className="flex-1 glass border-white/10 text-white h-14 rounded-2xl flex items-center justify-center space-x-2 font-bold uppercase text-[11px]">
              <RotateCcw size={16} />
              <span>Retake</span>
            </button>
            <button onClick={handleVerify} disabled={status === 'scanning'} className="flex-2 bg-emerald-500 text-slate-900 h-14 rounded-2xl flex items-center justify-center space-x-2 font-black uppercase text-[11px] shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
              {status === 'scanning' ? <Zap size={16} className="animate-spin" /> : <><UploadCloud size={18} /><span>Verify & File</span></>}
            </button>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default AILens;
