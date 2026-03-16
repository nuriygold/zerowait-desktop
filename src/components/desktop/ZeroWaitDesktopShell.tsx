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
  hasStartedOnce: boolean;
  onStart: () => void;
  onStop: () => void;
  micMuted: boolean;
  speakerMuted: boolean;
  onToggleMicMute: () => void;
  onToggleSpeakerMute: () => void;
}

export default function ZeroWaitDesktopShell({ state, isActive, hasStartedOnce, onStart, onStop, micMuted, speakerMuted, onToggleMicMute, onToggleSpeakerMute }: Props) {
  const hasContextData = !!(state.appointmentContext || state.timingStatus || state.patientCoordination);

  return (
    <div className="desktop-shell-layout">
      <LeftRail
        voiceState={state.voiceState}
        isActive={isActive}
        hasStartedOnce={hasStartedOnce}
        onStart={onStart}
        onStop={onStop}
        micMuted={micMuted}
        speakerMuted={speakerMuted}
        onToggleMicMute={onToggleMicMute}
        onToggleSpeakerMute={onToggleSpeakerMute}
      />

      <main className="main-workspace">
        <div className="main-header">
          <button
            type="button"
            className="main-header-back"
            aria-label="Back"
            // Future: hook into navigation when multi-screen
          >
            ←
          </button>
          <div className="main-header-right" />
        </div>

        {hasStartedOnce && <ProgressBar currentStage={state.stage} />}
        
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
