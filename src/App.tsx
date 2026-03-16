import { useState, useEffect } from 'react'
import ZeroWaitDesktopShell from './components/desktop/ZeroWaitDesktopShell'
import { ZeroWaitDesktopState } from './types'
import { useGeminiLive } from './lib/useGeminiLive'


const INITIAL_STATE: ZeroWaitDesktopState = {
  stage: "connect",
  assistPanel: "welcome",
  voiceState: "idle",
  assistantMessage: "Ready when you are.",
};

function App() {
  const [state, setState] = useState<ZeroWaitDesktopState>(INITIAL_STATE);
  const [hasStartedOnce, setHasStartedOnce] = useState(false);
  const {
    isActive,
    startSession,
    stopSession,
    micMuted,
    speakerMuted,
    toggleMicMute,
    toggleSpeakerMute,
  } = useGeminiLive(setState);

  const handleStart = () => {
    setHasStartedOnce(true);
    startSession();
  };

  // For demonstration, expose setState to window
  if (typeof window !== "undefined") {
    (window as any).setZeroWaitState = (newState: Partial<ZeroWaitDesktopState>) => {
      setState(prev => ({ ...prev, ...newState }));
    };
  }

  return (
    <ZeroWaitDesktopShell
      state={state}
      isActive={isActive}
      hasStartedOnce={hasStartedOnce}
      onStart={handleStart}
      onStop={stopSession}
      micMuted={micMuted}
      speakerMuted={speakerMuted}
      onToggleMicMute={toggleMicMute}
      onToggleSpeakerMute={toggleSpeakerMute}
    />
  );
}

export default App
