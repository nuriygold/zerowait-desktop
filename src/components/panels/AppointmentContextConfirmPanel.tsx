import React from 'react';
import { ZeroWaitDesktopState } from '../../types';

export default function AppointmentContextConfirmPanel({ state }: { state: ZeroWaitDesktopState }) {
  const { appointmentContext } = state;

  return (
    <div className="assist-panel pt-8">
      <h2>Appointment Details</h2>
      {appointmentContext ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p><strong>Provider:</strong> {appointmentContext.provider || 'Dr. Sanchez'}</p>
          <p><strong>Time:</strong> {appointmentContext.appointmentTime || 'Today'}</p>
        </div>
      ) : (
        <p>Loading your appointment details...</p>
      )}
    </div>
  );
}
