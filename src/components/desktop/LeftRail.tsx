import React from 'react';
import { VoiceState } from '../../types';
import VoiceButton from './VoiceButton';
import AudioControls from './AudioControls';
import SessionStatus from './SessionStatus';

interface Props {
  voiceState: VoiceState;
  isActive: boolean;
  onStart: () => void;
  onStop: () => void;
}

export default function LeftRail({ voiceState, isActive, onStart, onStop }: Props) {
  return (
    <aside className="left-rail">
      <div className="brand-block">
        <div className="brand-icon">
          <span>ZW</span>
        </div>
        <div className="brand-wordmark">ZeroWait</div>
      </div>
      
      <div className="voice-area">
        <VoiceButton 
          state={voiceState} 
          isActive={isActive}
          onStart={onStart}
          onStop={onStop} 
        />
        <span className="voice-status-label">{voiceState === 'idle' ? 'Ready' : voiceState}</span>
      </div>

      <AudioControls />
      <SessionStatus />
    </aside>
  );
}
