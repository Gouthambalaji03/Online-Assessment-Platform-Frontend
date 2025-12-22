import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../Services/api';

const VideoProctor = ({ examId, resultId, isActive, onViolation }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraStatus, setCameraStatus] = useState('initializing'); // initializing, active, error, denied
  const [faceDetected, setFaceDetected] = useState(true);
  const [violations, setViolations] = useState([]);
  const lastSnapshotRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      initializeCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isActive]);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 320, height: 240 },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraStatus('active');
    } catch (error) {
      console.error('Camera access error:', error);
      if (error.name === 'NotAllowedError') {
        setCameraStatus('denied');
      } else {
        setCameraStatus('error');
      }
      logViolation('face_not_detected', 'Camera access denied or unavailable', 'high');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const captureSnapshot = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return null;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 240;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.5);
  }, []);

  const logViolation = async (eventType, description, severity = 'medium') => {
    const snapshot = captureSnapshot();
    try {
      await api.post('/proctoring/log', {
        examId,
        resultId,
        eventType,
        description,
        severity,
        screenshot: snapshot,
        metadata: { timestamp: new Date().toISOString() }
      });
      setViolations(prev => [...prev, { eventType, description, time: new Date() }]);
      if (onViolation) {
        onViolation({ eventType, description, severity });
      }
    } catch (error) {
      console.error('Failed to log violation:', error);
    }
  };

  // Periodic snapshot capture for proctoring review
  useEffect(() => {
    if (cameraStatus !== 'active' || !isActive) return;

    const intervalId = setInterval(() => {
      const snapshot = captureSnapshot();
      if (snapshot) {
        lastSnapshotRef.current = snapshot;
      }
    }, 30000); // Capture every 30 seconds

    return () => clearInterval(intervalId);
  }, [cameraStatus, isActive, captureSnapshot]);

  return (
    <div style={{
      position: 'relative',
      backgroundColor: '#1E293B',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Video Feed */}
      <div style={{ position: 'relative', aspectRatio: '4/3' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scaleX(-1)'
          }}
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Status Overlay */}
        {cameraStatus !== 'active' && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white'
          }}>
            {cameraStatus === 'initializing' && (
              <>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginBottom: '12px'
                }}></div>
                <p style={{ fontSize: '14px' }}>Initializing camera...</p>
              </>
            )}
            {cameraStatus === 'denied' && (
              <>
                <svg style={{ width: '48px', height: '48px', marginBottom: '12px', color: '#EF4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Camera Access Denied</p>
                <p style={{ fontSize: '12px', color: '#94A3B8' }}>Please enable camera permissions</p>
              </>
            )}
            {cameraStatus === 'error' && (
              <>
                <svg style={{ width: '48px', height: '48px', marginBottom: '12px', color: '#F59E0B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Camera Error</p>
                <p style={{ fontSize: '12px', color: '#94A3B8' }}>Could not access camera</p>
              </>
            )}
          </div>
        )}

        {/* Recording Indicator */}
        {cameraStatus === 'active' && (
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            padding: '4px 8px',
            borderRadius: '4px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#EF4444',
              animation: 'pulse 1.5s ease-in-out infinite'
            }}></div>
            <span style={{ fontSize: '11px', color: 'white', fontWeight: '500' }}>REC</span>
          </div>
        )}

        {/* Face Detection Status */}
        {cameraStatus === 'active' && !faceDetected && (
          <div style={{
            position: 'absolute',
            bottom: '8px',
            left: '8px',
            right: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.9)',
            padding: '6px 10px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <svg style={{ width: '16px', height: '16px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span style={{ fontSize: '12px', color: 'white', fontWeight: '500' }}>Face not detected</span>
          </div>
        )}
      </div>

      {/* Violations Count */}
      {violations.length > 0 && (
        <div style={{
          padding: '8px 12px',
          backgroundColor: '#FEF3C7',
          borderTop: '1px solid #FCD34D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{ fontSize: '12px', color: '#92400E', fontWeight: '500' }}>
            Violations: {violations.length}
          </span>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default VideoProctor;
