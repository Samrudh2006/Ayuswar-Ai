import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Stethoscope, Activity, FileText, Cpu, Search } from 'lucide-react';
import AyuSwarLogoReveal from '../components/AyuSwarLogoReveal';

export default function NotFoundView() {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'radial-gradient(circle at 50% 20%, rgba(0, 210, 211, 0.08) 0%, rgba(10, 37, 64, 0.02) 70%)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '640px',
        width: '100%',
        textAlign: 'center',
        background: '#FFFFFF',
        borderRadius: '24px',
        border: '1px solid #CBD5E1',
        boxShadow: '0 20px 40px -15px rgba(10, 37, 64, 0.1)',
        padding: '48px 36px'
      }}>
        {/* Animated Emblem */}
        <div style={{ display: 'inline-block', marginBottom: '20px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: '#F0FDFA',
            border: '2px solid #00D2D3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            boxShadow: '0 10px 25px rgba(0, 210, 211, 0.25)'
          }}>
            <span style={{ fontSize: '32px', fontWeight: 900, color: '#008B8B', fontFamily: 'serif' }}>404</span>
          </div>
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#0A2540', marginBottom: '10px' }}>
          Clinical Route Not Found
        </h1>

        <p style={{ fontSize: '14.5px', color: '#64748B', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto 30px auto' }}>
          The clinical page, diagnostic specimen, or endpoint you requested does not exist or has been relocated to another FHIR registry block.
        </p>

        {/* Quick Launch Shortcuts */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          marginBottom: '32px',
          textAlign: 'left'
        }}>
          <Link
            to="/acoustic-lab"
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.15s ease'
            }}
          >
            <Activity size={20} color="#008B8B" />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0A2540' }}>Acoustic Lab</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>Real-time voice DSP</div>
            </div>
          </Link>

          <Link
            to="/prescription/preview"
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.15s ease'
            }}
          >
            <FileText size={20} color="#059669" />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0A2540' }}>Jan Aushadhi Rx</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>data.gov.in formulary</div>
            </div>
          </Link>

          <Link
            to="/technology"
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.15s ease'
            }}
          >
            <Cpu size={20} color="#2563EB" />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0A2540' }}>Deep-Tech Specs</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>Architecture & models</div>
            </div>
          </Link>

          <Link
            to="/scanner"
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.15s ease'
            }}
          >
            <Search size={20} color="#D97706" />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0A2540' }}>Blister OCR</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>Scan strip medications</div>
            </div>
          </Link>
        </div>

        {/* Back to Home Button */}
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '12px',
            background: '#008B8B',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 800,
            textDecoration: 'none',
            boxShadow: '0 4px 15px rgba(0, 139, 139, 0.3)',
            transition: 'transform 0.15s ease'
          }}
        >
          <Home size={16} />
          <span>Return to AyuSwar AI Home</span>
        </Link>
      </div>
    </div>
  );
}
