import React from 'react';
import { ZeroWaitDesktopState } from '../../types';
import LeftRail from './LeftRail';
import ProgressBar from './ProgressBar';
import LiveFeedbackStrip from './LiveFeedbackStrip';
import ContextPane from './ContextPane';
import StageCanvas from './StageCanvas';

interface Props {
  state: ZeroWaitDesktopState;
  isActive: boolean;
  onStart: () => void;
  onStop: () => void;
}

export default function ZeroWaitDesktopShell({ state, isActive, onStart, onStop }: Props) {
  const hasContextData = !!(state.appointmentContext || state.timingStatus || state.patientCoordination);

  return (
    <div className="desktop-shell-layout">
      <LeftRail 
        voiceState={state.voiceState} 
        isActive={isActive}
        onStart={onStart}
        onStop={onStop}
      />
      
      <main className="main-workspace">
        <ProgressBar currentStage={state.stage} />
        
        <StageCanvas 
          assistPanel={state.assistPanel} 
          state={state} 
        />
        
        <LiveFeedbackStrip message={state.assistantMessage} voiceState={state.voiceState} />
      </main>

      {hasContextData && (
        <ContextPane state={state} />
      )}
    </div>
  );
}
