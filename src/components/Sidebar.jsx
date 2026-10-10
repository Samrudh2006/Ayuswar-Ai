import React, { useState } from 'react';
import { 
  Home, 
  Stethoscope, 
  User, 
  Cpu, 
  Bell, 
  ChevronLeft, 
  ChevronRight, 
  Activity, 
  ShieldCheck, 
  QrCode, 
  Sparkles,
  Users,
  Pill,
  Radio
} from 'lucide-react';

/**
 * Sidebar Component
 * Senior-level enterprise clinical navigation drawer.
 * Provides instant switching between Public Showcase, Doctor OPD Workspace,
 * Patient Citizen Portal, and Deep-Tech Architecture Telemetry.
 */
export default function Sidebar({ 
  activeView, 
  setActiveView, 
  onOpenNotifications, 
  unreadNotificationsCount, 
  doctorProfile,
  isCollapsed,
  setIsCollapsed 
}) {
  return (
    <aside style={{
      width: isCollapsed ? '72px' : '260px',
      background: '#071A2E',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'width 220ms cubic-bezier(0.23, 1, 0.32, 1)',
      borderRight: '1px solid rgba(0, 139, 139, 0.2)',
      position: 'relative',
      zIndex: 90,
      flexShrink: 0
    }}>
      {/* Top Branding Section */}
      <div>
        <div style={{
          padding: '18px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {!isCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '11px', overflow: 'hidden' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: '#061626',
                overflow: 'hidden',
                flexShrink: 0,
                border: '2px solid #00D2D3',
                boxShadow: '0 2px 10px rgba(0, 210, 211, 0.3)'
              }}>
                <img src="/assets/ayuswar_master_emblem.png" alt="AyuSwar AI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ whiteSpace: 'nowrap' }}>
                <div style={{ fontSize: '18px', fontWeight: 850, fontFamily: 'Outfit, sans-serif' }}>
                  Ayu<span style={{ color: '#00D2D3' }}>Swar</span> AI
                </div>
                <div style={{ fontSize: '9px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: '-2px' }}>
                  Clinical OS
                </div>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: '#061626',
              overflow: 'hidden',
              border: '2px solid #00D2D3',
              boxShadow: '0 2px 10px rgba(0, 210, 211, 0.3)'
            }}>
              <img src="/assets/ayuswar_master_emblem.png" alt="AyuSwar AI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: '#94A3B8',
              cursor: 'pointer',
              display: isCollapsed ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px'
            }}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <ChevronLeft size={16} />
          </button>
        </div>

        {/* Primary Navigation Item List */}
        <div style={{ padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {/* Item 1: Public Overview & Landing */}
          <button
            onClick={() => setActiveView('landing')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '11px 12px',
              borderRadius: '10px',
              border: 'none',
              background: activeView === 'landing' ? 'rgba(0, 139, 139, 0.18)' : 'transparent',
              color: activeView === 'landing' ? '#00D2D3' : '#CBD5E1',
              cursor: 'pointer',
              fontSize: '13.5px',
              fontWeight: activeView === 'landing' ? 700 : 500,
              fontFamily: 'Outfit, sans-serif',
              textAlign: 'left',
              transition: 'all 160ms ease'
            }}
            title="Public Overview & Solutions"
          >
            <Home size={18} />
            {!isCollapsed && <span>Public Showcase</span>}
          </button>

          {/* Item 2: Doctor Portal (OPD Clinical Workspace) */}
          <button
            onClick={() => setActiveView('doctor_portal')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '11px 12px',
              borderRadius: '10px',
              border: 'none',
              background: activeView === 'doctor_portal' ? 'rgba(0, 139, 139, 0.18)' : 'transparent',
              color: activeView === 'doctor_portal' ? '#00D2D3' : '#CBD5E1',
              cursor: 'pointer',
              fontSize: '13.5px',
              fontWeight: activeView === 'doctor_portal' ? 700 : 500,
              fontFamily: 'Outfit, sans-serif',
              textAlign: 'left',
              transition: 'all 160ms ease'
            }}
            title="Doctor Portal (OPD Queue & Consultations)"
          >
            <Stethoscope size={18} />
            {!isCollapsed && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span>Doctor Portal</span>
                <span style={{ fontSize: '10px', background: '#008B8B', color: '#ffffff', padding: '1px 6px', borderRadius: '8px' }}>
                  OPD
                </span>
              </div>
            )}
          </button>

          {/* Item 3: Live Clinical Studio (Ambient Scribe Console) */}
          <button
            onClick={() => setActiveView('console')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '11px 12px',
              borderRadius: '10px',
              border: 'none',
              background: activeView === 'console' ? 'rgba(0, 139, 139, 0.18)' : 'transparent',
              color: activeView === 'console' ? '#00D2D3' : '#CBD5E1',
              cursor: 'pointer',
              fontSize: '13.5px',
              fontWeight: activeView === 'console' ? 700 : 500,
              fontFamily: 'Outfit, sans-serif',
              textAlign: 'left',
              transition: 'all 160ms ease'
            }}
            title="Live Clinical Studio & Scribe"
          >
            <Radio size={18} />
            {!isCollapsed && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span>Clinical Studio</span>
                <span style={{ fontSize: '9px', background: '#10B981', color: '#ffffff', padding: '1px 5px', borderRadius: '8px', fontWeight: 800 }}>
                  LIVE
                </span>
              </div>
            )}
          </button>

          {/* Item 4: Patient Citizen Portal (Ayu-Seva) */}
          <button
            onClick={() => setActiveView('patient_portal')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '11px 12px',
              borderRadius: '10px',
              border: 'none',
              background: activeView === 'patient_portal' ? 'rgba(0, 139, 139, 0.18)' : 'transparent',
              color: activeView === 'patient_portal' ? '#00D2D3' : '#CBD5E1',
              cursor: 'pointer',
              fontSize: '13.5px',
              fontWeight: activeView === 'patient_portal' ? 700 : 500,
              fontFamily: 'Outfit, sans-serif',
              textAlign: 'left',
              transition: 'all 160ms ease'
            }}
            title="Patient Portal (Spoken Audio-Rx & Pill Box)"
          >
            <Pill size={18} />
            {!isCollapsed && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span>Patient Portal</span>
                <span style={{ fontSize: '10px', background: '#D97706', color: '#ffffff', padding: '1px 6px', borderRadius: '8px' }}>
                  Audio-Rx
                </span>
              </div>
            )}
          </button>

          {/* Item 5: Architecture & HLD Specs */}
          <button
            onClick={() => setActiveView('tech_specs')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '11px 12px',
              borderRadius: '10px',
              border: 'none',
              background: activeView === 'tech_specs' ? 'rgba(0, 139, 139, 0.18)' : 'transparent',
              color: activeView === 'tech_specs' ? '#00D2D3' : '#CBD5E1',
              cursor: 'pointer',
              fontSize: '13.5px',
              fontWeight: activeView === 'tech_specs' ? 700 : 500,
              fontFamily: 'Outfit, sans-serif',
              textAlign: 'left',
              transition: 'all 160ms ease'
            }}
            title="Deep-Tech Architecture & HLD"
          >
            <Cpu size={18} />
            {!isCollapsed && <span>Technology & HLD</span>}
          </button>
        </div>
      </div>

      {/* Bottom Actions & Notifications Drawer Trigger */}
      <div style={{
        padding: '16px 12px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {/* Real-time Clinical Notifications Trigger */}
        <button
          onClick={onOpenNotifications}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            padding: '10px 12px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.04)',
            color: '#E2E8F0',
            cursor: 'pointer',
            fontSize: '13px'
          }}
          title="Clinical Alerts & Logs"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative' }}>
              <Bell size={17} color="#00D2D3" />
              {unreadNotificationsCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#EF4444'
                }} />
              )}
            </div>
            {!isCollapsed && <span>Clinical Alerts</span>}
          </div>
          {!isCollapsed && unreadNotificationsCount > 0 && (
            <span style={{
              background: '#EF4444',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 800,
              padding: '1px 6px',
              borderRadius: '10px'
            }}>
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Collapsed Toggle Button */}
        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              padding: '6px'
            }}
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </aside>
  );
}
