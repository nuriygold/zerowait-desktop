import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function SessionStatus() {
  return (
    <div className="session-status">
      <div className="session-dot"></div>
      <span>Secure Session</span>
      <ShieldCheck size={14} className="text-muted" />
    </div>
  );
}
