import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../Services/api';
import { toast } from 'react-toastify';

const ExamInstructions = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1); // 1: Instructions, 2: System Check, 3: Identity Verification
  const [systemChecks, setSystemChecks] = useState({
    browser: false,
    camera: false,
    fullscreen: false,
    notifications: false
  });
  const [identityVerified, setIdentityVerified] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    fetchExamDetails();
    return () => {
      stopCamera();
    };
  }, [examId]);

  const fetchExamDetails = async () => {
    try {
      const response = await api.get(`/exams/${examId}`);
      setExam(response.data);
    } catch (error) {
      toast.error('Failed to load exam details');
      navigate('/my-exams');
    } finally {
      setLoading(false);
    }
  };

  const runSystemChecks = async () => {
    // Browser check
    const isChrome = /Chrome/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);
    const isEdge = /Edg/.test(navigator.userAgent);
    setSystemChecks(prev => ({ ...prev, browser: isChrome || isFirefox || isEdge }));

    // Camera check (if proctored)
    if (exam?.isProctored && exam?.proctoringSettings?.videoMonitoring) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setSystemChecks(prev => ({ ...prev, camera: true }));
      } catch (error) {
        setSystemChecks(prev => ({ ...prev, camera: false }));
      }
    } else {
      setSystemChecks(prev => ({ ...prev, camera: true }));
    }

    // Fullscreen check
    const fullscreenEnabled = document.fullscreenEnabled || document.webkitFullscreenEnabled;
    setSystemChecks(prev => ({ ...prev, fullscreen: fullscreenEnabled }));

    // Notifications check
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setSystemChecks(prev => ({ ...prev, notifications: permission === 'granted' }));
    } else {
      setSystemChecks(prev => ({ ...prev, notifications: true }));
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const captureIdentityPhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
    setIdentityVerified(true);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setIdentityVerified(false);
  };

  const startExam = async () => {
    if (!agreed) {
      toast.error('Please agree to the exam rules');
      return;
    }

    // Enter fullscreen if browser lockdown is enabled
    if (exam?.proctoringSettings?.browserLockdown) {
      try {
        await document.documentElement.requestFullscreen();
      } catch (error) {
        console.warn('Fullscreen request failed:', error);
      }
    }

    stopCamera();
    navigate(`/exam/${examId}/take`, {
      state: {
        identityImage: capturedImage,
        systemChecksCompleted: true
      }
    });
  };

  const allChecksPassed = Object.values(systemChecks).every(v => v);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #E2E8F0',
            borderTopColor: '#3B82F6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#64748B' }}>Loading exam details...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      padding: '24px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1E293B', marginBottom: '8px' }}>
            {exam?.title}
          </h1>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg style={{ width: '20px', height: '20px', color: '#64748B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span style={{ color: '#64748B' }}>{exam?.duration} minutes</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg style={{ width: '20px', height: '20px', color: '#64748B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span style={{ color: '#64748B' }}>{exam?.totalMarks} marks</span>
            </div>
            {exam?.isProctored && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg style={{ width: '20px', height: '20px', color: '#EF4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span style={{ color: '#EF4444', fontWeight: '500' }}>Proctored Exam</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Steps */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '32px'
        }}>
          {['Instructions', 'System Check', 'Identity Verification'].map((label, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: step > index + 1 ? '#10B981' : step === index + 1 ? '#3B82F6' : '#E2E8F0',
                color: step >= index + 1 ? 'white' : '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: '14px'
              }}>
                {step > index + 1 ? '✓' : index + 1}
              </div>
              <span style={{
                marginLeft: '8px',
                color: step === index + 1 ? '#1E293B' : '#64748B',
                fontWeight: step === index + 1 ? '600' : '400',
                fontSize: '14px'
              }}>
                {label}
              </span>
              {index < 2 && (
                <div style={{
                  width: '60px',
                  height: '2px',
                  backgroundColor: step > index + 1 ? '#10B981' : '#E2E8F0',
                  margin: '0 16px'
                }}></div>
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          {/* Step 1: Instructions */}
          {step === 1 && (
            <>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1E293B', marginBottom: '24px' }}>
                Exam Instructions
              </h2>

              {exam?.instructions && (
                <div style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '24px'
                }}>
                  <p style={{ color: '#475569', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                    {exam.instructions}
                  </p>
                </div>
              )}

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1E293B', marginBottom: '16px' }}>
                  General Rules:
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {[
                    `This exam has ${exam?.questions?.length || 0} questions and must be completed in ${exam?.duration} minutes.`,
                    `You need ${exam?.passingMarks} marks out of ${exam?.totalMarks} to pass.`,
                    exam?.shuffleQuestions && 'Questions will be shuffled randomly.',
                    exam?.maxAttempts > 1 ? `You have ${exam?.maxAttempts} attempts for this exam.` : 'You have only 1 attempt for this exam.',
                    exam?.showResultImmediately ? 'Results will be shown immediately after submission.' : 'Results will be available after review.',
                    exam?.allowReview && 'You can review your answers before final submission.'
                  ].filter(Boolean).map((rule, idx) => (
                    <li key={idx} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '8px 0',
                      color: '#475569'
                    }}>
                      <svg style={{ width: '20px', height: '20px', color: '#10B981', flexShrink: 0, marginTop: '2px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>

              {exam?.isProctored && (
                <div style={{
                  backgroundColor: '#FEF3C7',
                  border: '1px solid #FCD34D',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '24px'
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#92400E', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Proctoring Requirements:
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {[
                      exam?.proctoringSettings?.videoMonitoring && 'Your webcam will be active during the exam.',
                      exam?.proctoringSettings?.browserLockdown && 'Switching tabs or windows is not allowed.',
                      exam?.proctoringSettings?.identityVerification && 'You will need to verify your identity before starting.',
                      `Maximum ${exam?.proctoringSettings?.tabSwitchLimit || 3} tab switches are allowed before auto-submission.`
                    ].filter(Boolean).map((rule, idx) => (
                      <li key={idx} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                        padding: '6px 0',
                        color: '#92400E',
                        fontSize: '14px'
                      }}>
                        <span>•</span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => { setStep(2); runSystemChecks(); }}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                Continue to System Check
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Step 2: System Check */}
          {step === 2 && (
            <>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1E293B', marginBottom: '24px' }}>
                System Compatibility Check
              </h2>

              <div style={{ marginBottom: '24px' }}>
                {[
                  { key: 'browser', label: 'Browser Compatibility', desc: 'Chrome, Firefox, or Edge required' },
                  { key: 'camera', label: 'Camera Access', desc: exam?.isProctored ? 'Required for proctoring' : 'Not required' },
                  { key: 'fullscreen', label: 'Fullscreen Mode', desc: 'Required for exam security' },
                  { key: 'notifications', label: 'Notification Permission', desc: 'For exam alerts' }
                ].map((check) => (
                  <div key={check.key} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    backgroundColor: systemChecks[check.key] ? '#F0FDF4' : '#FEF2F2',
                    borderRadius: '8px',
                    marginBottom: '12px'
                  }}>
                    <div>
                      <p style={{ fontWeight: '600', color: '#1E293B', marginBottom: '4px' }}>{check.label}</p>
                      <p style={{ fontSize: '14px', color: '#64748B' }}>{check.desc}</p>
                    </div>
                    {systemChecks[check.key] ? (
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#10B981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <svg style={{ width: '18px', height: '18px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#EF4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <svg style={{ width: '18px', height: '18px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    flex: 1,
                    padding: '14px 24px',
                    backgroundColor: '#F1F5F9',
                    color: '#475569',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!allChecksPassed}
                  style={{
                    flex: 2,
                    padding: '14px 24px',
                    backgroundColor: allChecksPassed ? '#3B82F6' : '#94A3B8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: allChecksPassed ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {exam?.isProctored && exam?.proctoringSettings?.identityVerification
                    ? 'Continue to Identity Verification'
                    : 'Start Exam'}
                  <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </>
          )}

          {/* Step 3: Identity Verification */}
          {step === 3 && (
            <>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1E293B', marginBottom: '24px' }}>
                Identity Verification
              </h2>

              {exam?.isProctored && exam?.proctoringSettings?.identityVerification ? (
                <>
                  <p style={{ color: '#64748B', marginBottom: '24px' }}>
                    Please position your face in the camera frame and take a photo for identity verification.
                  </p>

                  <div style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '400px',
                    margin: '0 auto 24px',
                    backgroundColor: '#1E293B',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    aspectRatio: '4/3'
                  }}>
                    {!capturedImage ? (
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
                    ) : (
                      <img
                        src={capturedImage}
                        alt="Captured identity"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transform: 'scaleX(-1)'
                        }}
                      />
                    )}

                    {/* Face outline guide */}
                    {!capturedImage && (
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '150px',
                        height: '200px',
                        border: '3px dashed rgba(255,255,255,0.5)',
                        borderRadius: '50%'
                      }}></div>
                    )}
                  </div>

                  {!capturedImage ? (
                    <button
                      onClick={captureIdentityPhoto}
                      style={{
                        width: '100%',
                        maxWidth: '400px',
                        margin: '0 auto 24px',
                        display: 'block',
                        padding: '14px 24px',
                        backgroundColor: '#10B981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Capture Photo
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '12px', maxWidth: '400px', margin: '0 auto 24px' }}>
                      <button
                        onClick={retakePhoto}
                        style={{
                          flex: 1,
                          padding: '14px 24px',
                          backgroundColor: '#F1F5F9',
                          color: '#475569',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Retake
                      </button>
                      <button
                        onClick={() => setIdentityVerified(true)}
                        style={{
                          flex: 1,
                          padding: '14px 24px',
                          backgroundColor: '#10B981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Confirm
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  backgroundColor: '#F0FDF4',
                  borderRadius: '12px',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    <svg style={{ width: '32px', height: '32px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p style={{ color: '#166534', fontWeight: '600' }}>Identity verification not required for this exam</p>
                </div>
              )}

              {/* Agreement Checkbox */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '16px',
                backgroundColor: '#F8FAFC',
                borderRadius: '8px',
                marginBottom: '24px'
              }}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  style={{ width: '20px', height: '20px', marginTop: '2px', cursor: 'pointer' }}
                />
                <label style={{ color: '#475569', fontSize: '14px', lineHeight: '1.5' }}>
                  I confirm that I am the registered student and I agree to follow all exam rules.
                  I understand that any violation may result in disqualification.
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setStep(2)}
                  style={{
                    flex: 1,
                    padding: '14px 24px',
                    backgroundColor: '#F1F5F9',
                    color: '#475569',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Back
                </button>
                <button
                  onClick={startExam}
                  disabled={!agreed || (exam?.isProctored && exam?.proctoringSettings?.identityVerification && !identityVerified)}
                  style={{
                    flex: 2,
                    padding: '14px 24px',
                    backgroundColor: (agreed && (!exam?.isProctored || !exam?.proctoringSettings?.identityVerification || identityVerified)) ? '#10B981' : '#94A3B8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: (agreed && (!exam?.isProctored || !exam?.proctoringSettings?.identityVerification || identityVerified)) ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  Start Exam
                  <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ExamInstructions;
