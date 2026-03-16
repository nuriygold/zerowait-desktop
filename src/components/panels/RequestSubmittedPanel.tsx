import React from 'react';
import { ZeroWaitDesktopState } from '../../types';
import { CheckCircle } from 'lucide-react';

export default function RequestSubmittedPanel({ state }: { state: ZeroWaitDesktopState }) {
  const { patientCoordination } = state;
  let message = "Your coordination request has been sent to Dr. Sanchez’s office. They will update you shortly.";

  if (patientCoordination?.reportedDelay) {
    message = `Dr. Sanchez’s office has been notified that you are running late.`;
  }
  if (patientCoordination?.requestType) {
    message = `Your request to ${patientCoordination.requestType.toLowerCase()} has been sent.`;
  }

  return (
    <div className="assist-panel pt-8" style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "flex-start" }}>
      <CheckCircle size={40} style={{ color: "var(--color-success)" }} />
      <h2>Request Sent</h2>
      <p>{message}</p>
    </div>
  );
}
