import { useState } from 'react'
import ZeroWaitDesktopShell from './components/desktop/ZeroWaitDesktopShell'
import { ZeroWaitDesktopState } from './types'

const INITIAL_STATE: ZeroWaitDesktopState = {
  stage: "connect",
  assistPanel: "welcome",
  voiceState: "idle",
  assistantMessage: "Ready when you are.",
};

function App() {
  const [state, setState] = useState<ZeroWaitDesktopState>(INITIAL_STATE);

  // For demonstration, expose setState to window
  if (typeof window !== "undefined") {
    (window as any).setZeroWaitState = (newState: Partial<ZeroWaitDesktopState>) => {
      setState(prev => ({ ...prev, ...newState }));
    };
  }

  return (
    <ZeroWaitDesktopShell state={state} />
  )
}

export default App
