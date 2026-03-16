import React from 'react';
import { ZeroWaitDesktopState } from '../../types';

interface Props {
  state: ZeroWaitDesktopState;
}

export default function ContextPane({ state }: Props) {
  const { appointmentContext, timingStatus, patientCoordination } = state;

  return (
    <aside className="context-pane">
      {appointmentContext && (
        <div className="context-section">
          <div className="context-section-title">Appointment Context</div>
          <div className="context-card">
            {appointmentContext.patientName && (
              <div className="context-line">
                <span className="context-value">{appointmentContext.patientName}</span>
              </div>
            )}
            {appointmentContext.appointmentTime && (
              <div className="context-line">
                Time: <span className="context-value">{appointmentContext.appointmentTime}</span>
              </div>
            )}
            {appointmentContext.provider && (
              <div className="context-line">
                Provider: <span className="context-value">{appointmentContext.provider}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {timingStatus && (
        <div className="context-section">
          <div className="context-section-title">Current Wait Status</div>
          <div className="context-card">
            <div className="context-line">
              <span className="context-value">
                {timingStatus.text || `Dr. Sanchez: ${timingStatus.delayMinutes ? timingStatus.delayMinutes + ' minutes behind' : 'On time'}`}
              </span>
            </div>
          </div>
        </div>
      )}

      {patientCoordination && (
        <div className="context-section">
          <div className="context-section-title">Patient Coordination</div>
          <div className="context-card">
            {patientCoordination.reportedDelay && (
              <div className="context-line">
                Reported delay: <span className="context-value">{patientCoordination.reportedDelay} minutes</span>
              </div>
            )}
            <div className="context-line">
              Office notified: <span className="context-value">Yes</span>
            </div>
            {patientCoordination.status && (
              <div className="context-line">
                Request status: <span className="context-value capitalize">{patientCoordination.status}</span>
              </div>
            )}
            {patientCoordination.requestType && (
              <div className="context-line">
                Accommodation: <span className="context-value">{patientCoordination.requestType}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
