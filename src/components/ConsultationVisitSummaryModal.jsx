import React, { useState } from 'react';
import { Download, X, CheckCircle2, Clock } from 'lucide-react';
import AuthenticQrCode from './AuthenticQrCode';
import { escapeHtml } from '../utils/escapeHtml';

/**
 * AyuSwar AI — Post-Consultation Visit Summary (Modal / Standalone Card)
 * Matches visit-summary.png layout specifications.
 */
export default function ConsultationVisitSummaryModal({
  summary,
  isOpen = true,
  onClose,
  isModal = true,
  initialApproved = false
}) {
  const [isDemoApproved, setIsDemoApproved] = useState(initialApproved);

  if (!summary || (!isOpen && isModal)) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ayuswar-ai.vercel.app';
  const qrPayload = `${origin}/`;

  const patientDisplay = `${summary.patientName || 'Ananya Rao'} · ${summary.patientAge || 28} ${summary.patientGender || 'F'}`;
  const visitRef = summary.ref || summary.visitRef || 'VS-DEMO-1105';
  const dateStr = summary.date || 'Fri, 6 Nov 2026';
  const doctorName = summary.doctorName || 'Dr. Demo Sharma';
  
  const doctorNotes = summary.notes || 'Doctor-reviewed consultation notes appear here after the visit is completed.';
  const hasCustomNotes = summary.notes && summary.notes.trim().length > 0;

  const prescriptionText = isDemoApproved
    ? (summary.medications && summary.medications.length > 0 
        ? summary.medications.join(', ')
        : 'Tab Pantoprazole 40mg (1-0-0, Before Food), Tab Paracetamol 650mg (SOS for fever)')
    : 'No medicines listed. The prescription is filled in only after the doctor reviews and approves the visit notes.';

  const followUpText = summary.followUp || 'Follow-up date and instructions appear here if the doctor advises a review.';

  const handlePrintPdf = () => {
    const printWindow = window.open('', '_blank', 'width=760,height=880');
    if (!printWindow) {
      window.print();
      return;
    }

    const approvalBlockHtml = isDemoApproved
      ? `
        <div style="color: #059669; font-weight: 800; font-size: 13px; display: flex; align-items: center; gap: 6px;">
          <span style="font-size: 16px;">&#8226;</span> Demo review completed - not clinical sign-off
        </div>
        <div style="font-size: 11px; color: #475569; margin-top: 4px; line-height: 1.45;">
          Reviewed in demo flow by <strong>${escapeHtml(doctorName)}</strong> on ${escapeHtml(dateStr)}. AI-drafted notes are never shown as a final prescription without doctor review.
        </div>
      `
      : `
        <div style="color: #B45309; font-weight: 800; font-size: 13px; display: flex; align-items: center; gap: 6px;">
          <span style="font-size: 16px;">&#8226;</span> Pending doctor review
        </div>
        <div style="font-size: 11px; color: #64748B; margin-top: 4px; line-height: 1.45;">
          The prescription section becomes final only after the doctor reviews and approves it in the app. AI-drafted notes are never shown as a final prescription.
        </div>
      `;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>AyuSwar AI — Consultation Visit Summary (${escapeHtml(visitRef)})</title>
          <style>
            @page { size: A4 portrait; margin: 15mm; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
              color: #081C24;
              margin: 0;
              padding: 20px;
              background: #ffffff;
            }
            .summary-card {
              max-width: 660px;
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
            .meta-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 10px;
              margin-bottom: 20px;
            }
            .meta-box {
              background: #FAF8F5;
              border: 1px solid #E2E8F0;
              border-radius: 10px;
              padding: 8px 10px;
            }
            .meta-label {
              font-size: 9px;
              font-weight: 800;
              color: #64748B;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 2px;
            }
            .meta-val {
              font-size: 12.5px;
              font-weight: 800;
              color: #081C24;
            }
            .section-header {
              font-size: 11px;
              font-weight: 800;
              color: #081C24;
              text-transform: uppercase;
              letter-spacing: 0.8px;
              margin: 16px 0 6px 0;
              display: flex;
              align-items: center;
              gap: 6px;
            }
            .gold-bar {
              width: 3px;
              height: 12px;
              background: #D4AF37;
              display: inline-block;
            }
            .section-box {
              background: #FAF8F5;
              border: 1px solid #E2E8F0;
              border-radius: 10px;
              padding: 12px 14px;
              font-size: 12.5px;
              color: #334155;
              line-height: 1.5;
            }
            .signoff-grid {
              display: grid;
              grid-template-columns: 1fr 180px;
              gap: 18px;
              margin-top: 20px;
            }
            .signoff-box {
              background: #FAF8F5;
              border: 1.5px dashed #D4AF37;
              border-radius: 12px;
              padding: 14px;
            }
            .signoff-label {
              font-size: 9.5px;
              font-weight: 800;
              color: #64748B;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 4px;
            }
            .qr-col {
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
            }
            .qr-frame {
              border: 1.5px solid #0F4C5C;
              border-radius: 12px;
              padding: 8px;
              background: #ffffff;
            }
            .qr-caption {
              font-size: 11px;
              font-weight: 800;
              color: #081C24;
              margin-top: 6px;
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
          <div class="summary-card">
            <div class="header">
              <div class="brand">AYUSWAR &#9670; AI</div>
              <h1 class="title">Consultation Visit Summary</h1>
              <div class="subtitle">Given to the patient after the OPD visit is completed</div>
            </div>
            <div class="demo-band">
              DEMO &#183; PROTOTYPE PREVIEW &#183; SAMPLE DETAILS &#183; NOT A MEDICAL DOCUMENT
            </div>
            <div class="body">
              <div class="meta-grid">
                <div class="meta-box">
                  <div class="meta-label">Patient (Sample)</div>
                  <div class="meta-val">${escapeHtml(patientDisplay)}</div>
                </div>
                <div class="meta-box">
                  <div class="meta-label">Visit Ref</div>
                  <div class="meta-val">${escapeHtml(visitRef)}</div>
                </div>
                <div class="meta-box">
                  <div class="meta-label">Date</div>
                  <div class="meta-val">${escapeHtml(dateStr)}</div>
                </div>
                <div class="meta-box">
                  <div class="meta-label">Doctor (Sample)</div>
                  <div class="meta-val">${escapeHtml(doctorName)}</div>
                </div>
              </div>

              <div class="section-header">
                <span class="gold-bar"></span> Doctor's Notes (Sample)
              </div>
              <div class="section-box">${escapeHtml(doctorNotes)}</div>

              <div class="section-header">
                <span class="gold-bar"></span> Prescription &#183; Enters Only After Doctor Sign-Off
              </div>
              <div class="section-box">${escapeHtml(prescriptionText)}</div>

              <div class="section-header">
                <span class="gold-bar"></span> Follow-Up
              </div>
              <div class="section-box">${escapeHtml(followUpText)}</div>

              <div class="signoff-grid">
                <div class="signoff-box">
                  <div class="signoff-label">Doctor Sign-Off</div>
                  ${approvalBlockHtml}
                </div>

                <div class="qr-col">
                  <div class="qr-frame">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=115x115&data=${encodeURIComponent(qrPayload)}" width="115" height="115" alt="Demo summary QR" />
                  </div>
                  <div class="qr-caption">Demo summary QR</div>
                  <div class="qr-subtext">Opens the AyuSwar demo page. No health details stored in this code.</div>
                </div>
              </div>

              <div class="divider"></div>
              <div class="footer-text">
                Prototype summary with sample details. A real visit summary is generated only from an actual completed consultation reviewed by the doctor.
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
        console.warn('Print popup issue:', err);
      }
    }, 350);
  };

  const cardContent = (
    <div
      className="visit-summary-card"
      style={{
        background: '#ffffff',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid #CBD5E1',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.12)',
        maxWidth: '720px',
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
            title="Close Summary"
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
          Consultation Visit Summary
        </h2>
        <div style={{
          fontSize: '13px',
          color: '#A5F3FC',
          marginTop: '4px'
        }}>
          Given to the patient after the OPD visit is completed
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
        DEMO &#183; PROTOTYPE PREVIEW &#183; SAMPLE DETAILS &#183; NOT A MEDICAL DOCUMENT
      </div>

      {/* Summary Body */}
      <div style={{ padding: '24px' }}>
        {/* Metadata Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{ background: '#FAF8F5', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '8px 10px' }}>
            <div style={{ fontSize: '9px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Patient (Sample)
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#081C24', marginTop: '2px' }}>
              {patientDisplay}
            </div>
          </div>

          <div style={{ background: '#FAF8F5', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '8px 10px' }}>
            <div style={{ fontSize: '9px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Visit Ref
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#081C24', marginTop: '2px' }}>
              {visitRef}
            </div>
          </div>

          <div style={{ background: '#FAF8F5', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '8px 10px' }}>
            <div style={{ fontSize: '9px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Date
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#081C24', marginTop: '2px' }}>
              {dateStr}
            </div>
          </div>

          <div style={{ background: '#FAF8F5', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '8px 10px' }}>
            <div style={{ fontSize: '9px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Doctor (Sample)
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#081C24', marginTop: '2px' }}>
              {doctorName}
            </div>
          </div>
        </div>

        {/* Section 1: Doctor's Notes */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#081C24',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ width: '3px', height: '13px', background: '#D4AF37', display: 'inline-block', borderRadius: '1px' }} />
            <span>Doctor's Notes (Sample)</span>
          </div>
          <div style={{
            background: '#FAF8F5',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            padding: '12px 14px',
            fontSize: '13px',
            color: hasCustomNotes ? '#081C24' : '#64748B',
            lineHeight: 1.5
          }}>
            {doctorNotes}
          </div>
        </div>

        {/* Section 2: Prescription */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#081C24',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ width: '3px', height: '13px', background: '#D4AF37', display: 'inline-block', borderRadius: '1px' }} />
            <span>Prescription &#183; Enters Only After Doctor Sign-Off</span>
          </div>
          <div style={{
            background: isDemoApproved ? '#F0FDF4' : '#FAF8F5',
            border: isDemoApproved ? '1px solid #BBF7D0' : '1px solid #E2E8F0',
            borderRadius: '10px',
            padding: '12px 14px',
            fontSize: '13px',
            color: isDemoApproved ? '#166534' : '#64748B',
            fontWeight: isDemoApproved ? 600 : 400,
            lineHeight: 1.5
          }}>
            {prescriptionText}
          </div>
        </div>

        {/* Section 3: Follow-Up */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#081C24',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ width: '3px', height: '13px', background: '#D4AF37', display: 'inline-block', borderRadius: '1px' }} />
            <span>Follow-Up</span>
          </div>
          <div style={{
            background: '#FAF8F5',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            padding: '12px 14px',
            fontSize: '13px',
            color: '#64748B',
            lineHeight: 1.5
          }}>
            {followUpText}
          </div>
        </div>

        {/* Section 4: Sign-Off Box & QR */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 180px',
          gap: '18px',
          alignItems: 'center'
        }}>
          {/* Doctor Sign-off Box */}
          <div style={{
            background: isDemoApproved ? '#F0FDF4' : '#FAF8F5',
            border: isDemoApproved ? '1.5px dashed #10B981' : '1.5px dashed #D4AF37',
            borderRadius: '12px',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '4px'
            }}>
              <div style={{ fontSize: '9.5px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Doctor Sign-Off
              </div>
              <button
                onClick={() => setIsDemoApproved(!isDemoApproved)}
                style={{
                  background: 'none',
                  border: '1px solid #D0DFE2',
                  borderRadius: '6px',
                  padding: '2px 8px',
                  fontSize: '10px',
                  color: '#0F4C5C',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                title="Toggle client-side demo approval state for testing"
              >
                {isDemoApproved ? 'Reset to Pending' : 'Simulate Doctor Sign-Off'}
              </button>
            </div>

            {isDemoApproved ? (
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <CheckCircle2 size={15} color="#059669" />
                  <span>Demo review completed - not clinical sign-off</span>
                </div>
                <div style={{ fontSize: '11px', color: '#475569', lineHeight: 1.45, marginTop: '4px' }}>
                  Reviewed in demo flow by <strong>{doctorName}</strong> on {dateStr}. AI-drafted notes are never shown as a final prescription without doctor review.
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#B45309', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ color: '#D97706', fontSize: '16px' }}>&#8226;</span>
                  <span>Pending doctor review</span>
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.45, marginTop: '4px' }}>
                  The prescription section becomes final only after the doctor reviews and approves it in the app. AI-drafted notes are never shown as a final prescription.
                </div>
              </div>
            )}
          </div>

          {/* Right: Demo Summary QR */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}>
            <div style={{
              border: '1.5px solid #0F4C5C',
              borderRadius: '12px',
              padding: '8px',
              background: '#ffffff',
              boxShadow: '0 4px 12px rgba(15, 76, 92, 0.08)'
            }}>
              <AuthenticQrCode 
                value={qrPayload}
                size={110}
                isDoctor={false}
                showCenterBadge={false}
              />
            </div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#081C24', marginTop: '6px' }}>
              Demo summary QR
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
            Prototype summary with sample details. A real visit summary is generated only from an actual completed consultation reviewed by the doctor.
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

