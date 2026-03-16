import React, { useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

export default function AudioControls() {
  const [micMuted, setMicMuted] = useState(false);
  const [speakerMuted, setSpeakerMuted] = useState(false);

  return (
    <div className="audio-controls">
      <button 
        className="audio-btn" 
        onClick={() => setMicMuted(!micMuted)}
        aria-label={micMuted ? "Unmute Microphone" : "Mute Microphone"}
      >
        {micMuted ? <MicOff size={18} /> : <Mic size={18} />}
      </button>
      <button 
        className="audio-btn" 
        onClick={() => setSpeakerMuted(!speakerMuted)}
        aria-label={speakerMuted ? "Unmute Speaker" : "Mute Speaker"}
      >
        {speakerMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
    </div>
  );
}
