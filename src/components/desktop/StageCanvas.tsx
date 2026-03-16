import React from 'react';
import { AssistPanelType, ZeroWaitDesktopState } from '../../types';
import AssistPanelRenderer from '../panels/AssistPanelRenderer';

interface Props {
  assistPanel: AssistPanelType;
  state: ZeroWaitDesktopState;
}

export default function StageCanvas({ assistPanel, state }: Props) {
  return (
    <div className="stage-canvas">
      {assistPanel !== 'none' && (
        <AssistPanelRenderer panelType={assistPanel} state={state} />
      )}
    </div>
  );
}
