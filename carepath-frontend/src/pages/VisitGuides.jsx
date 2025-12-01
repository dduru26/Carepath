// src/pages/VisitGuides.jsx
import { useState } from 'react';

const VISIT_TYPES = [
  { id: 'antenatal', label: 'Antenatal (pregnancy visit)' },
  { id: 'child-immunization', label: 'Child immunization' },
  { id: 'malaria-fever', label: 'Fever / suspected malaria' },
  { id: 'general-checkup', label: 'General check-up' },
];

const CHECKLISTS = {
  'antenatal': [
    'ANC card or any previous clinic documents',
    'Clean drinking water and a light snack if the wait is long',
    'List of any symptoms you’ve noticed (pain, bleeding, dizziness, etc.)',
    'List of current medications or herbal remedies you’re using',
    'Money for transport and basic tests (where applicable)',
    'Your partner or trusted support person, if possible',
  ],
  'child-immunization': [
    'Child’s vaccination card (or clinic book)',
    'Clean clothes and a warm cover for the child',
    'Any previous prescriptions or test results',
    'A small snack / milk / water for the child',
    'Diapers or extra cloth in case of accidents',
    'Note down any reactions to vaccines in the past',
  ],
  'malaria-fever': [
    'Note when the fever started and how high it gets',
    'List medicines already taken (especially any anti-malarials)',
    'Bring any lab results or rapid test results you already have',
    'Carry drinking water and light clothing for comfort',
    'Note other symptoms (vomiting, headache, chills, cough, etc.)',
  ],
  'general-checkup': [
    'Any chronic medication you use (e.g. hypertension, diabetes)',
    'Previous clinic or hospital documents if you have them',
    'List of questions or worries you want to ask the health worker',
    'Glasses or aids you need to read forms or signs',
    'Transport money and any insurance details (if applicable)',
  ],
};

export default function VisitGuides() {
  const [selectedId, setSelectedId] = useState('antenatal');
  const checklist = CHECKLISTS[selectedId] || [];

  return (
    <main style={{ padding: '1.5rem', maxWidth: 960, margin: '0 auto' }}>
      <h2>Visit checklists</h2>
      <p style={{ fontSize: '0.9rem', color: '#4b5563', marginBottom: '1rem' }}>
        Choose a common clinic visit below to see a simple checklist that helps
        patients from underserved communities prepare better.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 260px) minmax(0, 1fr)',
          gap: '1.5rem',
        }}
      >
        {/* Left: visit types */}
        <div
          style={{
            borderRadius: '0.75rem',
            border: '1px solid #e5e7eb',
            padding: '0.75rem',
            background: '#f9fafb',
          }}
        >
          <h3
            style={{
              fontSize: '0.9rem',
              marginBottom: '0.5rem',
              color: '#374151',
            }}
          >
            Common clinic visits
          </h3>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'grid',
              gap: '0.35rem',
            }}
          >
            {VISIT_TYPES.map((type) => (
              <li key={type.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(type.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    borderRadius: 999,
                    border: 'none',
                    padding: '0.4rem 0.75rem',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    background:
                      selectedId === type.id ? '#047857' : 'transparent',
                    color: selectedId === type.id ? '#ffffff' : '#111827',
                  }}
                >
                  {type.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: checklist */}
        <div
          style={{
            borderRadius: '0.75rem',
            border: '1px solid #e5e7eb',
            padding: '0.9rem',
          }}
        >
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
            {VISIT_TYPES.find((t) => t.id === selectedId)?.label}
          </h3>
          {checklist.length === 0 ? (
            <p style={{ fontSize: '0.9rem', color: '#4b5563' }}>
              Select a visit type on the left to see what to bring and how to
              prepare.
            </p>
          ) : (
            <ol style={{ paddingLeft: '1.25rem', fontSize: '0.9rem' }}>
              {checklist.map((item, idx) => (
                <li key={idx} style={{ marginBottom: '0.3rem' }}>
                  {item}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </main>
  );
}
