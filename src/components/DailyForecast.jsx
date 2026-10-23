import React from 'react';
import { WeatherIcon } from './WeatherIcon';
import { getWeatherCondition } from '../utils/weatherCodes';
import { formatDayName, cToF } from '../utils/formatters';

export function DailyForecast({ daily, unit = 'C' }) {
  if (!daily || !daily.time || !daily.time.length) return null;

  // Calculate global min and max across all 7 days for proportional bar rendering
  const allMins = daily.temperature_2m_min || [];
  const allMaxs = daily.temperature_2m_max || [];
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const totalSpread = Math.max(1, globalMax - globalMin);

  return (
    <div className="forecast-card" aria-labelledby="forecast-heading">
      <div>
        <span className="section-label">Week Ahead</span>
        <h3 id="forecast-heading" className="forecast-title">7-Day Forecast</h3>
      </div>

      <div className="forecast-list" role="list">
        {daily.time.map((timeStr, idx) => {
          const rawMin = daily.temperature_2m_min[idx];
          const rawMax = daily.temperature_2m_max[idx];
          const min = Math.round(unit === 'F' ? cToF(rawMin) : rawMin);
          const max = Math.round(unit === 'F' ? cToF(rawMax) : rawMax);
          const code = daily.weather_code[idx];
          const rainProb = daily.precipitation_probability_max?.[idx] ?? 0;
          const condition = getWeatherCondition(code, 1);
          const dayName = formatDayName(timeStr, idx);

          // Bar positioning
          const leftPercent = Math.max(0, ((min - globalMin) / totalSpread) * 100);
          const barWidthPercent = Math.max(8, ((max - min) / totalSpread) * 100);

          return (
            <div key={timeStr} className="forecast-row" role="listitem">
              <span className="forecast-day-name">{dayName}</span>

              <WeatherIcon name={condition.icon} size={20} strokeWidth={1.8} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                <span className="forecast-condition-desc">{condition.label}</span>
                {rainProb >= 20 && (
                  <span style={{ fontSize: '0.72rem', color: '#2D6A4F', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <WeatherIcon name="droplet" size={10} strokeWidth={2} />
                    {rainProb}% rain
                  </span>
                )}
              </div>

              <div className="forecast-temp-range">
                <span className="temp-min">{min}°</span>
                <div
                  style={{
                    width: '44px',
                    height: '4px',
                    background: 'var(--surface-card-subtle)',
                    borderRadius: '2px',
                    position: 'relative'
                  }}
                  title={`Range: ${min}° to ${max}°`}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: `${leftPercent}%`,
                      width: `${barWidthPercent}%`,
                      height: '100%',
                      background: 'var(--accent)',
                      borderRadius: '2px'
                    }}
                  />
                </div>
                <span className="temp-max">{max}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
