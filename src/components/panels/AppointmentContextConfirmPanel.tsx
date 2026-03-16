import React, { useState, useEffect } from 'react';
import { Shield, Lock, User, Clock, Info } from 'lucide-react';
import { ZeroWaitDesktopState } from '../../types';

function formatAppointmentDisplay(time: string | undefined): string {
  if (!time) return '';
  return time.includes('at') || time.includes(',') ? time : `Today at ${time}`;
}

export default function AppointmentContextConfirmPanel({ state }: { state: ZeroWaitDesktopState }) {
  const { appointmentContext } = state;
  const [name, setName] = useState(appointmentContext?.patientName ?? '');
  const [appointmentTime, setAppointmentTime] = useState(formatAppointmentDisplay(appointmentContext?.appointmentTime));

  useEffect(() => {
    if (appointmentContext?.patientName) setName(appointmentContext.patientName);
    if (appointmentContext?.appointmentTime) setAppointmentTime(formatAppointmentDisplay(appointmentContext.appointmentTime));
  }, [appointmentContext?.patientName, appointmentContext?.appointmentTime]);

  return (
    <div className="assist-panel confirm-identity-panel">
      <div className="confirm-identity-layout">
        <div className="confirm-identity-left">
          <div className="confirm-identity-card">
            <Shield className="confirm-identity-icon" size={28} strokeWidth={1.5} />
            <h3 className="confirm-identity-title">Identity Confirmation</h3>
            <p className="confirm-identity-desc">
              We take your privacy seriously. Before accessing your health information, we need to verify your identity to comply with HIPAA regulations.
            </p>
          </div>
          <div className="confirm-hipaa-card">
            <h4 className="confirm-hipaa-title">
              <Lock size={16} aria-hidden /> HIPAA Compliance
            </h4>
            <ul className="confirm-hipaa-list">
              <li>
                <span className="confirm-hipaa-check" aria-hidden>✓</span>
                <span><strong>Secure Authentication:</strong> Multi-factor verification protects your sensitive health data</span>
              </li>
              <li>
                <span className="confirm-hipaa-check" aria-hidden>✓</span>
                <span><strong>Encrypted Connection:</strong> All data transmitted through secure, encrypted channels</span>
              </li>
              <li>
                <span className="confirm-hipaa-check" aria-hidden>✓</span>
                <span><strong>Audit Trail:</strong> Every access is logged for security and compliance</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="confirm-identity-right">
          <h2 className="confirm-form-title">Confirm Your Information</h2>
          <p className="confirm-form-subtitle">Please verify your name and appointment time.</p>
          <div className="confirm-form-fields">
            <label className="confirm-form-label">
              <User size={18} aria-hidden />
              Your Name
            </label>
            <input
              type="text"
              className="confirm-form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah Johnson"
              aria-label="Your name"
            />
            <label className="confirm-form-label">
              <Clock size={18} aria-hidden />
              Appointment Time
            </label>
            <input
              type="text"
              className="confirm-form-input"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              placeholder="e.g. March 15, 2026 at 2:30 PM"
              aria-label="Appointment time"
            />
          </div>
          <div className="confirm-form-alert" role="status">
            <Info size={20} aria-hidden />
            <span>Please ensure your information is correct before proceeding to the voice agent.</span>
          </div>
          <div className="confirm-form-actions">
            <button type="button" className="confirm-btn confirm-btn--secondary">
              Cancel
            </button>
            <button type="button" className="confirm-btn confirm-btn--primary">
              Confirm & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
