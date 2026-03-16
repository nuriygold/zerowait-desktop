import React from 'react';
import { VoiceState } from '../../types';

interface Props {
  message: string | null;
  voiceState: VoiceState;
}

export default function LiveFeedbackStrip({ message, voiceState }: Props) {
  const getStatusText = () => {
    switch (voiceState) {
      case 'listening': return 'Listening...';
      case 'processing': return 'Checking...';
      case 'speaking': return 'You said...';
      case 'assistant': return 'Assistant speaking';
      case 'idle': return 'Assistant ready';
      default: return 'Assistant active';
    }
  };

  return (
    <div className="live-feedback-strip" aria-live="polite">
      <div className="feedback-label">{getStatusText()}</div>
      <div className="feedback-text">{message || "I can help you check Dr. Sanchez's schedule."}</div>
    </div>
  );
}
