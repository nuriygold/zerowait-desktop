import React from 'react';
import { Mic, Loader2, Volume2, MoreHorizontal, AlertCircle } from 'lucide-react';
import { VoiceState } from '../../types';

interface Props {
  state: VoiceState;
  isActive: boolean;
  onStart: () => void;
  onStop: () => void;
}

export default function VoiceButton({ state, isActive, onStart, onStop }: Props) {
  const isListening = state === 'listening' || state === 'speaking' || state === 'connecting' || state === 'processing';
  
  const getIcon = () => {
    switch (state) {
      case 'idle':
        return <Mic size={32} />;
      case 'connecting':
      case 'processing':
        return <Loader2 size={32} className="animate-spin" />;
      case 'listening':
        return <MoreHorizontal size={32} className="animate-pulse" />;
      case 'speaking':
      case 'assistant':
        return <Volume2 size={32} />;
      case 'error':
        return <AlertCircle size={32} className="text-red-500" />;
      default:
        return <Mic size={32} />;
    }
  };

  const handleClick = () => {
    if (isActive) {
      onStop();
    } else {
      onStart();
    }
  };

  return (
    <div className={`voice-button-wrapper ${isListening ? 'listening' : ''}`}>
      <div className="voice-ring"></div>
      <button 
        className={`voice-button ${isListening ? 'listening' : ''}`}
        aria-label="Toggle Voice Control"
        onClick={handleClick}
      >
        {getIcon()}
      </button>
    </div>
  );
}
