import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Scan, PhoneCall, Stethoscope, Users, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * MobileAppBottomNav
 * Fixed, thumb-optimized native mobile bottom navigation bar.
 * Replaces cluttered desktop header interactions with 1-thumb native mobile app navigation.
 */
export default function MobileAppBottomNav({
  onOpenSanjivani,
  onOpenDoctorAuth,
  onOpenPatientAuth
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { doctorProfile, patientProfile } = useApp();

  const currentPath = location.pathname;

  const [isMobileScreen, setIsMobileScreen] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768;
    }
    return false;
  });

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(typeof window !== 'undefined' && window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Strictly disabled on laptop/desktop view (only active on mobile devices <= 768px)
  if (!isMobileScreen) {
    return null;
  }

  // Don't render inside full-screen modals or portals that have their own sub-nav
  const isDedicatedPortal = 
    currentPath.startsWith('/doctor-portal') || 
    currentPath.startsWith('/patient-portal') || 
    currentPath.startsWith('/clinical-console') ||
    currentPath === '/sanjivani';

  if (isDedicatedPortal) {
    return null;
  }

  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(12); } catch {}
    }
  };

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      isActive: currentPath === '/',
      action: () => {
        triggerHaptic();
        navigate('/');
      }
    },
    {
      id: 'scanner',
      label: 'Scan Rx',
      icon: Scan,
      isActive: currentPath === '/scanner',
      action: () => {
        triggerHaptic();
        navigate('/scanner');
      }
    },
    {
      id: 'sos',
      label: '108 SOS',
      isCenterEmergency: true,
      icon: PhoneCall,
      action: () => {
        triggerHaptic();
        if (onOpenSanjivani) onOpenSanjivani();
        else navigate('/sanjivani');
      }
    },
    {
      id: 'doctor',
      label: 'Doctor',
      icon: Stethoscope,
      isActive: currentPath.startsWith('/doctor-portal'),
      badge: doctorProfile ? 'Active' : null,
      action: () => {
        triggerHaptic();
        if (doctorProfile) {
          navigate('/doctor-portal');
        } else if (onOpenDoctorAuth) {
          onOpenDoctorAuth();
        } else {
          navigate('/auth/doctor');
        }
      }
    },
    {
      id: 'patient',
      label: 'Patient',
      icon: Users,
      isActive: currentPath.startsWith('/patient-portal'),
      badge: patientProfile ? 'ABHA' : null,
      action: () => {
        triggerHaptic();
        if (patientProfile) {
          navigate('/patient-portal');
        } else if (onOpenPatientAuth) {
          onOpenPatientAuth();
        } else {
          navigate('/auth/patient');
        }
      }
    }
  ];

  return (
    <nav
      className="global-mobile-bottom-nav"
      aria-label="Mobile Bottom Navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'calc(62px + env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid #E2E8F0',
        boxShadow: '0 -4px 20px rgba(10, 37, 64, 0.08)',
        zIndex: 900,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingLeft: '6px',
        paddingRight: '6px'
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;

        if (item.isCenterEmergency) {
          return (
            <button
              key={item.id}
              type="button"
              onClick={item.action}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                top: '-14px',
                padding: '0 6px'
              }}
              aria-label="Emergency 108 SOS"
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 6px 20px rgba(220, 38, 38, 0.45)',
                  border: '3px solid #ffffff',
                  position: 'relative'
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    inset: -3,
                    borderRadius: '50%',
                    border: '2px solid rgba(239, 68, 68, 0.6)',
                    animation: 'radarWave 1.8s infinite'
                  }}
                />
                <PhoneCall size={22} style={{ animation: 'sanjivaniEmergencyPulse 1.2s infinite' }} />
              </div>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: '#DC2626',
                  marginTop: '3px',
                  letterSpacing: '0.2px'
                }}
              >
                108 SOS
              </span>
            </button>
          );
        }

        const activeColor = item.id === 'patient' ? '#D97706' : '#0F4C5C';

        return (
          <button
            key={item.id}
            type="button"
            onClick={item.action}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 4px',
              position: 'relative',
              color: item.isActive ? activeColor : '#64748B',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon size={20} strokeWidth={item.isActive ? 2.5 : 1.9} />
              {item.badge && (
                <span
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -10,
                    fontSize: '8px',
                    fontWeight: 800,
                    padding: '1px 4px',
                    borderRadius: '6px',
                    background: item.id === 'patient' ? '#F59E0B' : '#0F4C5C',
                    color: '#ffffff'
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: item.isActive ? 750 : 500,
                letterSpacing: '-0.1px'
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
