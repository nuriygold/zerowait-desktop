import React from 'react';
import { ConversationStage } from '../../types';

interface Props {
  currentStage: ConversationStage;
}

const STAGES: { id: ConversationStage; label: string }[] = [
  { id: 'connect', label: 'Connect' },
  { id: 'confirm', label: 'Confirm' },
  { id: 'check_status', label: 'Check Status' },
  { id: 'coordinate', label: 'Coordinate' },
  { id: 'done', label: 'Done' },
];

const TOTAL = STAGES.length;

export default function ProgressBar({ currentStage }: Props) {
  const rawIndex = STAGES.findIndex((s) => s.id === currentStage);
  const currentIndex = rawIndex >= 0 ? rawIndex : 0;
  const step = currentIndex + 1;
  const percent = Math.round((step / TOTAL) * 100);

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-meta">
        <span className="progress-bar-step-text">Step {step} of {TOTAL}</span>
        <span className="progress-bar-percent">{percent}%</span>
      </div>
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin={1}
          aria-valuemax={TOTAL}
          aria-label={`Step ${step} of ${TOTAL}, ${percent}% complete`}
        />
      </div>
      <div className="progress-bar-labels">
        {STAGES.map((stage, index) => (
          <span
            key={stage.id}
            className={`progress-bar-label ${index === currentIndex ? 'active' : ''}`}
          >
            {stage.label}
          </span>
        ))}
      </div>
    </div>
  );
}
