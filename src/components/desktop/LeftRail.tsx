import React from 'react';
import { VoiceState } from '../../types';
import AudioControls from './AudioControls';
import SessionStatus from './SessionStatus';
import zwLogo from '../../assets/ZW.png';

interface Props {
  voiceState: VoiceState;
  isActive: boolean;
  hasStartedOnce: boolean;
  onStart: () => void;
  onStop: () => void;
  micMuted: boolean;
  speakerMuted: boolean;
  onToggleMicMute: () => void;
  onToggleSpeakerMute: () => void;
}

const WAVEFORM_BAR_COUNT = 9;

export default function LeftRail({ voiceState, isActive, hasStartedOnce, onStart, onStop: _onStop, micMuted, speakerMuted, onToggleMicMute, onToggleSpeakerMute }: Props) {
  const isListening =
    voiceState === 'listening' ||
    voiceState === 'speaking' ||
    (hasStartedOnce && voiceState === 'idle');

  return (
    <aside className="left-rail">
      <div className="brand-block">
        <div className="brand-icon">
          <img src={zwLogo} alt="ZeroWait" className="brand-icon-img" />
        </div>
        <div className="brand-wordmark">ZeroWait Health</div>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-48 h-48 particle-circle-container">
          {/* Outer solid stroke (like Container.svg) */}
          <div className="particle-circle-outer-stroke absolute inset-0 rounded-full" aria-hidden />
          {/* Inner subtle ring (opacity 0.2) */}
          <div className="particle-circle-inner-ring absolute inset-0 rounded-full" aria-hidden />
          {/* 60 dots around the circle */}
          {Array.from({ length: 60 }).map((_, i) => {
            const angle = (i / 60) * Math.PI * 2;
            const radius = 80;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const delay = i * 0.05;
            const opacity = 0.5 + (0.1 * (i % 10)) / 10;

            return (
              <div
                key={i}
                className="particle-dot absolute rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                  animation: `pulse 2s ease-in-out ${delay}s infinite`,
                  opacity
                }}
                aria-hidden
              />
            );
          })}
          {/* Center: default (empty) or listening waveform */}
          <div className="particle-circle-center" aria-hidden>
            {isListening && (
              <div className="voice-waveform" role="img" aria-label="Listening to your voice">
                {Array.from({ length: WAVEFORM_BAR_COUNT }).map((_, i) => (
                  <div
                    key={i}
                    className="voice-waveform-bar"
                    style={{ animationDelay: `${i * 0.06}s` }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AudioControls
        isActive={isActive}
        hasStartedOnce={hasStartedOnce}
        onStart={onStart}
        micMuted={micMuted}
        speakerMuted={speakerMuted}
        onToggleMicMute={onToggleMicMute}
        onToggleSpeakerMute={onToggleSpeakerMute}
      />
      <SessionStatus />
    </aside>
  );
}
