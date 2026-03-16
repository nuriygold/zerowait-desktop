import React from 'react';
import { AssistPanelType, ZeroWaitDesktopState } from '../../types';
import WelcomePanel from './WelcomePanel';
import AppointmentContextConfirmPanel from './AppointmentContextConfirmPanel';
import WaitTimeStatusPanel from './WaitTimeStatusPanel';
import PatientDelayConfirmPanel from './PatientDelayConfirmPanel';
import AccommodationOptionsPanel from './AccommodationOptionsPanel';
import RequestSubmittedPanel from './RequestSubmittedPanel';
import RecoveryPanel from './RecoveryPanel';

interface Props {
  panelType: AssistPanelType;
  state: ZeroWaitDesktopState;
}

export default function AssistPanelRenderer({ panelType, state }: Props) {
  switch (panelType) {
    case 'welcome':
      return <WelcomePanel />;
    case 'appointment_context_confirm':
      return <AppointmentContextConfirmPanel state={state} />;
    case 'wait_time_status':
      return <WaitTimeStatusPanel state={state} />;
    case 'patient_delay_confirm':
      return <PatientDelayConfirmPanel state={state} />;
    case 'accommodation_options':
      return <AccommodationOptionsPanel />;
    case 'request_submitted':
      return <RequestSubmittedPanel state={state} />;
    case 'recovery':
      return <RecoveryPanel />;
    default:
      return null;
  }
}
