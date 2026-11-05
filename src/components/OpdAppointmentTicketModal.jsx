import React from 'react';
import { Download, X } from 'lucide-react';
import AuthenticQrCode from './AuthenticQrCode';
import { escapeHtml } from '../utils/escapeHtml';

/**
 * AyuSwar AI — OPD Appointment Ticket (Modal / Standalone Card)
 * Matches opd-ticket.png layout specifications.
 */
export default function OpdAppointmentTicketModal({ 
  ticket, 
  isOpen = true, 
  onClose,
  isModal = true 
}) {
  if (!ticket || (!isOpen && isModal)) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ayuswar-ai.vercel.app';
  const qrPayload = `${origin}/`;

  const patientDisplay = `${ticket.patientName || 'Ananya Rao'} · ${ticket.patientAge || 28} ${ticket.patientGender || 'F'}`;
  const bookingRef = ticket.ref || 'AS-DEMO-1105';
  const doctorDept = `${ticket.doctorName || 'Dr. Demo Sharma'} · ${ticket.department || ticket.specialty || 'General Medicine'}`;
  const dateStr = ticket.date || 'Fri, 6 Nov 2026';
  const timeStr = ticket.time || '10:30 AM';
  const modeStr = ticket.mode || 'In-person';
  const opdToken = ticket.token || 'GM-042';
  const statusStr = ticket.status || 'Request sent · hospital confirms';

  const handlePrintPdf = () => {
    const printWindow = window.open('', '_blank', 'width=760,height=820');
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>AyuSwar AI — OPD Appointment Ticket (${escapeHtml(bookingRef)})</title>
          <style>
            @page { size: A4 portrait; margin: 15mm; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
              color: #081C24;
              margin: 0;
              padding: 20px;
              background: #ffffff;
            }
            .ticket-card {
              max-width: 640px;
              margin: 0 auto;
              border-radius: 18px;
              border: 1px solid #CBD5E1;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0,0,0,0.06);
            }
            .header {
              background: #0F4C5C;
              color: #ffffff;
              padding: 20px 24px;
            }
            .brand {
              font-size: 11px;
              font-weight: 800;
              letter-spacing: 2px;
              color: #D4AF37;
              text-transform: uppercase;
              margin-bottom: 4px;
            }
            .title {
              font-size: 24px;
              font-weight: 850;
              margin: 0;
              color: #ffffff;
            }
            .subtitle {
              font-size: 12.5px;
              color: #A5F3FC;
              margin-top: 4px;
            }
            .demo-band {
              background: #722F37;
              color: #ffffff;
              text-align: center;
              font-size: 10px;
              font-weight: 800;
              letter-spacing: 1.2px;
              padding: 7px 12px;
              text-transform: uppercase;
            }
            .body {
              padding: 24px;
              background: #ffffff;
            }
            .content-grid {
              display: grid;
              grid-template-columns: 1fr 180px;
              gap: 20px;
            }
            .fields-col {
              display: flex;
              flex-direction: column;
              gap: 12px;
            }
            .row-2 {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
            }
            .row-3 {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 8px;
            }
            .field-box {
              background: #FAF8F5;
              border: 1px solid #E2E8F0;
              border-radius: 10px;
              padding: 8px 12px;
            }
            .field-label {
              font-size: 9.5px;
              font-weight: 800;
              color: #64748B;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 2px;
            }
            .field-value {
              font-size: 13.5px;
              font-weight: 800;
              color: #081C24;
            }
            .token-box {
              background: #0F4C5C;
              color: #ffffff;
              border-radius: 10px;
              padding: 8px 14px;
              display: flex;
              flex-direction: column;
              justifyContent: center;
            }
            .token-label {
              font-size: 9px;
              font-weight: 800;
              color: #A5F3FC;
              letter-spacing: 1px;
              text-transform: uppercase;
            }
            .token-value {
              font-size: 22px;
              font-weight: 900;
              letter-spacing: 0.5px;
            }
            .status-value {
              font-size: 12px;
              font-weight: 800;
              color: #B45309;
            }
            .qr-col {
              display: flex;
              flex-direction: column;
              align-items: center;
              justifyContent: center;
              text-align: center;
            }
            .qr-frame {
              border: 1.5px solid #0F4C5C;
              border-radius: 12px;
              padding: 10px;
              background: #ffffff;
              display: inline-block;
            }
            .qr-caption {
              font-size: 11px;
              font-weight: 800;
              color: #081C24;
              margin-top: 8px;
            }
            .qr-subtext {
              font-size: 9.5px;
              color: #64748B;
              line-height: 1.35;
              margin-top: 2px;
            }
            .divider {
              border-top: 1.5px dashed #CBD5E1;
              margin: 18px 0 14px 0;
            }
            .footer-text {
              font-size: 10.5px;
              color: #64748B;
              line-height: 1.45;
            }
            @media print {
              body { padding: 0; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="margin-bottom: 16px; text-align: right;">
            <button onclick="window.print()" style="background: #0F4C5C; color: #ffffff; border: none; padding: 8px 18px; border-radius: 6px; font-weight: 750; cursor: pointer;">Print / Save PDF</button>
          </div>
          <div class="ticket-card">
            <div class="header">
              <div class="brand">AYUSWAR &#9670; AI</div>
              <h1 class="title">OPD Appointment Ticket</h1>
              <div class="subtitle">Booking request details</div>
            </div>
            <div class="demo-band">
              DEMO &#183; PROTOTYPE PREVIEW &#183; NOT A REAL HOSPITAL APPOINTMENT
            </div>
            <div class="body">
              <div class="content-grid">
                <div class="fields-col">
                  <div class="row-2">
                    <div class="field-box">
                      <div class="field-label">Patient (Sample)</div>
                      <div class="field-value">${escapeHtml(patientDisplay)}</div>
                    </div>
                    <div class="field-box">
                      <div class="field-label">Booking Ref</div>
                      <div class="field-value">${escapeHtml(bookingRef)}</div>
                    </div>
                  </div>

                  <div class="field-box">
                    <div class="field-label">Doctor &#183; Department (Sample)</div>
                    <div class="field-value">${escapeHtml(doctorDept)}</div>
                  </div>

                  <div class="row-3">
                    <div class="field-box">
                      <div class="field-label">Date</div>
                      <div class="field-value" style="font-size: 12px;">${escapeHtml(dateStr)}</div>
                    </div>
                    <div class="field-box">
                      <div class="field-label">Time</div>
                      <div class="field-value" style="font-size: 12px;">${escapeHtml(timeStr)}</div>
                    </div>
                    <div class="field-box">
                      <div class="field-label">Mode</div>
                      <div class="field-value" style="font-size: 12px;">${escapeHtml(modeStr)}</div>
                    </div>
                  </div>

                  <div class="row-2">
                    <div class="token-box">
                      <div class="token-label">OPD Token</div>
                      <div class="token-value">${escapeHtml(opdToken)}</div>
                    </div>
                    <div class="field-box" style="display: flex; flex-direction: column; justify-content: center;">
                      <div class="field-label">Status</div>
                      <div class="status-value">&#8226; ${escapeHtml(statusStr)}</div>
                    </div>
                  </div>
                </div>

                <div class="qr-col">
                  <div class="qr-frame">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(qrPayload)}" width="130" height="130" alt="Demo preview QR" />
                  </div>
                  <div class="qr-caption">Demo preview QR</div>
                  <div class="qr-subtext">Opens the AyuSwar demo page. No health details stored in this code.</div>
                </div>
              </div>

              <div class="divider"></div>
              <div class="footer-text">
                Prototype ticket with sample details. A real ticket is issued only after the hospital confirms the slot. This image is a layout preview of the planned ticket.
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      try {
        printWindow.print();
      } catch (err) {
        console.warn('Print popup blocked or failed:', err);
      }
    }, 350);
  };

  const cardContent = (
    <div 
      className="opd-ticket-card"
      style={{
        background: '#ffffff',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid #CBD5E1',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.12)',
        maxWidth: '680px',
        width: '100%',
        margin: '0 auto',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
      }}
    >
      {/* Header Band */}
      <div style={{
        background: 'linear-gradient(135deg, #0F4C5C 0%, #092C35 100%)',
        color: '#ffffff',
        padding: '20px 24px',
        position: 'relative'
      }}>
        {isModal && onClose && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Close Ticket"
          >
            <X size={16} />
          </button>
        )}
        <div style={{
          fontSize: '11px',
          fontWeight: 800,
          letterSpacing: '2px',
          color: '#D4AF37',
          textTransform: 'uppercase',
          marginBottom: '4px'
        }}>
          AYUSWAR &#9670; AI
        </div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 850,
          color: '#ffffff',
          margin: 0,
          letterSpacing: '-0.3px'
        }}>
          OPD Appointment Ticket
        </h2>
        <div style={{
          fontSize: '13px',
          color: '#A5F3FC',
          marginTop: '4px'
        }}>
          Booking request details
        </div>
      </div>

      {/* Wine Demo Band */}
      <div style={{
        background: '#722F37',
        color: '#ffffff',
        textAlign: 'center',
        fontSize: '11px',
        fontWeight: 800,
        letterSpacing: '1px',
        padding: '8px 14px',
        textTransform: 'uppercase'
      }}>
        DEMO &#183; PROTOTYPE PREVIEW &#183; NOT A REAL HOSPITAL APPOINTMENT
      </div>

      {/* Ticket Body */}
      <div style={{ padding: '24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 190px',
          gap: '20px',
          alignItems: 'start'
        }}>
          {/* Left Fields Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Row 1: Patient + Booking Ref */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
              <div style={{ background: '#FAF8F5', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '8px 12px' }}>
                <div style={{ fontSize: '9.5px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Patient (Sample)
                </div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#081C24', marginTop: '2px' }}>
                  {patientDisplay}
                </div>
              </div>

              <div style={{ background: '#FAF8F5', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '8px 12px' }}>
                <div style={{ fontSize: '9.5px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Booking Ref
                </div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#081C24', marginTop: '2px' }}>
                  {bookingRef}
                </div>
              </div>
            </div>

            {/* Row 2: Doctor · Department */}
            <div style={{ background: '#FAF8F5', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '8px 12px' }}>
              <div style={{ fontSize: '9.5px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Doctor &#183; Department (Sample)
              </div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#081C24', marginTop: '2px' }}>
                {doctorDept}
              </div>
            </div>

            {/* Row 3: Date, Time, Mode */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '8px' }}>
              <div style={{ background: '#FAF8F5', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '8px 10px' }}>
                <div style={{ fontSize: '9px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</div>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#081C24', marginTop: '2px' }}>{dateStr}</div>
              </div>
              <div style={{ background: '#FAF8F5', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '8px 10px' }}>
                <div style={{ fontSize: '9px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Time</div>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#081C24', marginTop: '2px' }}>{timeStr}</div>
              </div>
              <div style={{ background: '#FAF8F5', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '8px 10px' }}>
                <div style={{ fontSize: '9px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mode</div>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#081C24', marginTop: '2px' }}>{modeStr}</div>
              </div>
            </div>

            {/* Row 4: OPD Token + Status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '12px' }}>
              <div style={{
                background: '#0F4C5C',
                color: '#ffffff',
                borderRadius: '10px',
                padding: '10px 14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: '9px', fontWeight: 800, color: '#A5F3FC', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  OPD Token
                </div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', letterSpacing: '0.5px' }}>
                  {opdToken}
                </div>
              </div>

              <div style={{
                background: '#FAF8F5',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: '9.5px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Status
                </div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#B45309', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ color: '#D97706', fontSize: '16px' }}>&#8226;</span>
                  <span>{statusStr}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: QR Code */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            paddingTop: '4px'
          }}>
            <div style={{
              border: '1.5px solid #0F4C5C',
              borderRadius: '12px',
              padding: '10px',
              background: '#ffffff',
              boxShadow: '0 4px 12px rgba(15, 76, 92, 0.08)'
            }}>
              <AuthenticQrCode 
                value={qrPayload}
                size={120}
                isDoctor={false}
                showCenterBadge={false}
              />
            </div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#081C24', marginTop: '8px' }}>
              Demo preview QR
            </div>
            <div style={{ fontSize: '9.5px', color: '#64748B', lineHeight: 1.35, marginTop: '2px', maxWidth: '170px' }}>
              Opens the AyuSwar demo page. No health details stored in this code.
            </div>
          </div>
        </div>

        {/* Dashed Separator */}
        <div style={{
          borderTop: '1.5px dashed #CBD5E1',
          margin: '20px 0 16px 0'
        }} />

        {/* Footer Area */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div style={{
            fontSize: '11px',
            color: '#64748B',
            lineHeight: 1.45,
            maxWidth: '430px'
          }}>
            Prototype ticket with sample details. A real ticket is issued only after the hospital confirms the slot. This image is a layout preview of the planned ticket.
          </div>

          <button
            onClick={handlePrintPdf}
            style={{
              background: '#0F4C5C',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '9px 18px',
              fontSize: '12.5px',
              fontWeight: 750,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(15, 76, 92, 0.25)'
            }}
          >
            <Download size={14} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (!isModal) {
    return cardContent;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(9, 30, 38, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      {cardContent}
    </div>
  );
}
