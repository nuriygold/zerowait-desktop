import React from 'react';

const OPTIONS = [
  "Notify office I'm running late",
  "Wait in car",
  "Request telehealth",
  "Ask if appointment can still be honored",
  "Reschedule"
];

export default function AccommodationOptionsPanel() {
  return (
    <div className="assist-panel pt-8">
      <h2 style={{ marginBottom: '24px' }}>How can we help coordinate?</h2>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {OPTIONS.map(opt => (
          <button key={opt} className="btn-option" onClick={() => console.log(opt)}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
