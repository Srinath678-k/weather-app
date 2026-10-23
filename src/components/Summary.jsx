import React from 'react';
import { generateWeatherSummary } from '../utils/summary';
import { RainCountdown } from './RainCountdown';

export function Summary({ current, hourly, unit = 'C', currentTimeStr }) {
  const summary = generateWeatherSummary({ current, hourly, unit, currentTimeStr });

  return (
    <div className="verdict-card">
      <div>
        <div className="verdict-header">
          <span className="verdict-kicker">Today's Verdict</span>
        </div>

        <h2 className="verdict-headline">{summary.headline}</h2>
        <p className="verdict-body">{summary.verdict}</p>

        {summary.chips && summary.chips.length > 0 && (
          <div className="verdict-chips">
            {summary.chips.map((chip, idx) => (
              <span key={idx} className={`editorial-chip ${chip.type}`}>
                {chip.text}
              </span>
            ))}
          </div>
        )}
      </div>

      <RainCountdown current={current} hourly={hourly} currentTimeStr={currentTimeStr} />
    </div>
  );
}
