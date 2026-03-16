import React from 'react';
import { ZeroWaitDesktopState } from '../../types';

export default function WaitTimeStatusPanel({ state }: { state: ZeroWaitDesktopState }) {
  const { timingStatus } = state;

  let displayMessage = "We are checking Dr. Sanchez's status...";
  if (timingStatus?.text) {
    displayMessage = timingStatus.text;
  } else if (timingStatus?.delayMinutes !== undefined) {
    if (timingStatus.delayMinutes === 0) {
      displayMessage = "Dr. Sanchez is on time.";
    } else {
      displayMessage = `Dr. Sanchez is about ${timingStatus.delayMinutes} minutes behind schedule.`;
    }
  }

  return (
    <div className="assist-panel">
      <h2>Wait Time Status</h2>
      <p style={{ fontWeight: 500, color: 'var(--color-primary)' }}>{displayMessage}</p>
    </div>
  );
}
