import React from 'react';
import { VoiceState } from '../../types';
import VoiceButton from './VoiceButton';
import AudioControls from './AudioControls';
import SessionStatus from './SessionStatus';

interface Props {
  voiceState: VoiceState;
}

export default function LeftRail({ voiceState }: Props) {
  return (
    <aside className="left-rail">
      <div className="brand-block">
        <div className="brand-icon">
          <span>ZW</span>
        </div>
        <div className="brand-wordmark">ZeroWait</div>
      </div>
      
      <div className="voice-area">
        <VoiceButton state={voiceState} />
        <span className="voice-status-label">{voiceState === 'idle' ? 'Ready' : voiceState}</span>
      </div>

      <AudioControls />
      <SessionStatus />
    </aside>
  );
}
