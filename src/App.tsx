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
  const { isActive, startSession, stopSession } = useGeminiLive(setState);

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
      onStart={startSession}
      onStop={stopSession}
    />
  )
}

export default App
