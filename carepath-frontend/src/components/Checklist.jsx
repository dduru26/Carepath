// src/components/Checklist.jsx
import { useState } from 'react';

function Checklist({ items }) {
  const [checked, setChecked] = useState({});

  const toggle = (index) => {
    setChecked(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (!items.length) return <p>No checklist items yet.</p>;

  return (
    <ul className="checklist">
      {items.map((item, index) => (
        <li key={index}>
          <label>
            <input
              type="checkbox"
              checked={!!checked[index]}
              onChange={() => toggle(index)}
            />
            <span>{item}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}

export default Checklist;
