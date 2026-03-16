import React from 'react';
import { ConversationStage } from '../../types';

interface Props {
  currentStage: ConversationStage;
}

const STAGES = [
  { id: 'connect', label: 'CONNECT' },
  { id: 'confirm', label: 'CONFIRM' },
  { id: 'check_status', label: 'CHECK STATUS' },
  { id: 'coordinate', label: 'COORDINATE' },
  { id: 'done', label: 'DONE' }
];

export default function ProgressBar({ currentStage }: Props) {
  const currentIndex = STAGES.findIndex(s => s.id === currentStage) || 0;

  return (
    <div className="progress-bar-container">
      {STAGES.map((stage, index) => {
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;
        
        return (
          <React.Fragment key={stage.id}>
            <div className={`progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
              <div className="step-number">{index + 1}</div>
              <span className="step-label">{stage.label}</span>
            </div>
            {index < STAGES.length - 1 && (
              <div className="step-line"></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
