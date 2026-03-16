import React from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface Props {
  isActive: boolean;
  hasStartedOnce: boolean;
  onStart: () => void;
  micMuted: boolean;
  speakerMuted: boolean;
  onToggleMicMute: () => void;
  onToggleSpeakerMute: () => void;
}

export default function AudioControls({ isActive: _isActive, hasStartedOnce, onStart, micMuted, speakerMuted, onToggleMicMute, onToggleSpeakerMute }: Props) {
  if (!hasStartedOnce) {
    return (
      <div className="audio-controls">
        <button
          type="button"
          className="start-chat-cta"
          onClick={onStart}
          aria-label="Start chat"
        >
          Start chat
        </button>
      </div>
    );
  }

  return (
    <div className="audio-controls audio-controls--spread">
      <button
        className={`audio-btn ${speakerMuted ? 'audio-btn--speaker-active' : ''}`}
        onClick={onToggleSpeakerMute}
        aria-label={speakerMuted ? "Unmute Speaker" : "Mute Speaker"}
      >
        {speakerMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
      <button
        className={`audio-btn ${micMuted ? 'audio-btn--mic-active' : ''}`}
        onClick={onToggleMicMute}
        aria-label={micMuted ? "Unmute Microphone" : "Mute Microphone"}
      >
        {micMuted ? <MicOff size={18} /> : <Mic size={18} />}
      </button>
    </div>
  );
}
