import React from 'react';
import { Clock, Shield, Sparkles, Calendar } from 'lucide-react';

const FEATURE_CARDS = [
  {
    icon: Clock,
    title: 'Zero Wait Time',
    description: 'Get instant responses when calling your provider',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'HIPAA-compliant security layer protects your information',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered',
    description: 'Smart agent handles your requests efficiently',
  },
  {
    icon: Calendar,
    title: 'Appointment Management',
    description: 'Schedule, reschedule, or cancel with ease',
  },
];

export default function WelcomePanel() {
  return (
    <div className="assist-panel welcome-panel">
      <h2 className="welcome-panel-title">Healthcare Without the Wait</h2>
      <p className="welcome-panel-subtitle">
        Experience instant, AI-powered appointment scheduling with our intelligent voice agent system
      </p>
      <div className="welcome-feature-cards">
        {FEATURE_CARDS.map(({ icon: Icon, title, description }) => (
          <div key={title} className="welcome-feature-card">
            <div className="welcome-feature-card-icon">
              <Icon size={24} />
            </div>
            <h3 className="welcome-feature-card-title">{title}</h3>
            <p className="welcome-feature-card-desc">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
