import { useState, useEffect, useRef } from 'react';
import api from '../Services/api';

const VideoProctor = ({ examId, isActive = true }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const [cameraStatus, setCameraStatus] = useState('initializing');
  const [violations, setViolations] = useState(0);

  useEffect(() => {
    if (isActive) {
      initializeCamera();
      intervalRef.current = setInterval(captureSnapshot, 30000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      stopCamera();
    };
  }, []);

  // Stop camera when isActive becomes false
  useEffect(() => {
    if (!isActive) {
      stopCamera();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [isActive]);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 320, height: 240 }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraStatus('active');
    } catch (error) {
      setCameraStatus('error');
      logViolation('camera_blocked', 'Camera access was denied');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject = null;
    }
    setCameraStatus('stopped');
  };

  const captureSnapshot = async () => {
    if (!videoRef.current || cameraStatus !== 'active') return;
    
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.5);
      
      await api.post('/proctoring/log', {
        examId,
        eventType: 'snapshot',
        screenshot: imageData
      });
    } catch (error) {
      console.error('Failed to capture snapshot:', error);
    }
  };

  const logViolation = async (type, description) => {
    setViolations(prev => prev + 1);
    try {
      await api.post('/proctoring/log', {
        examId,
        eventType: type,
        description,
        severity: 'high'
      });
    } catch (error) {
      console.error('Failed to log violation:', error);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div className="bg-card border border-border rounded-xl shadow-xl overflow-hidden">
        <div className="p-2 bg-surface-secondary flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              cameraStatus === 'active' ? 'bg-success animate-pulse' : 
              cameraStatus === 'error' ? 'bg-error' : 'bg-warning'
            }`}></div>
            <span className="text-xs font-medium text-text-muted">
              {cameraStatus === 'active' ? 'Proctoring Active' : 
               cameraStatus === 'error' ? 'Camera Error' : 'Initializing...'}
            </span>
          </div>
          {violations > 0 && (
            <span className="bg-error text-white text-xs px-2 py-0.5 rounded-full font-medium">
              {violations} warning{violations > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="relative w-[200px] h-[150px] bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {cameraStatus === 'error' && (
            <div className="absolute inset-0 flex items-center justify-center bg-error/90">
              <div className="text-center text-white p-3">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p className="text-xs">Camera blocked</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoProctor;
