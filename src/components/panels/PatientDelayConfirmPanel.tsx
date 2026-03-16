import React from 'react';
import { ZeroWaitDesktopState } from '../../types';

export default function PatientDelayConfirmPanel({ state }: { state: ZeroWaitDesktopState }) {
  const { patientCoordination, appointmentContext } = state;
  const mins = patientCoordination?.reportedDelay || 0;
  const time = appointmentContext?.appointmentTime || '';
  const provider = appointmentContext?.provider || 'Dr. Sanchez';

  return (
    <div className="assist-panel pt-8">
      <h2>Confirm Delay</h2>
      <p style={{ marginBottom: "16px" }}>
        You're reporting that you'll be about {mins} minutes late
        for your {time} appointment with {provider}.
      </p>
    </div>
  );
}
