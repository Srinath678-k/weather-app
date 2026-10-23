import React from 'react';
import { WeatherIcon } from './WeatherIcon';
import { getWeatherCondition } from '../utils/weatherCodes';
import { cToF } from '../utils/formatters';

export function HourlyStrip({ hourly, currentTimeStr, unit = 'C' }) {
  if (!hourly || !hourly.time || !hourly.time.length) return null;

  // Determine starting hour
  let startIdx = 0;
  if (currentTimeStr) {
    const prefix = currentTimeStr.slice(0, 13);
    const found = hourly.time.findIndex(t => t.startsWith(prefix));
    if (found !== -1) startIdx = found;
  }

  const hoursToDisplay = hourly.time.slice(startIdx, startIdx + 24).map((timeStr, offset) => {
    const idx = startIdx + offset;
    const isFirst = offset === 0;
    const date = new Date(timeStr);
    const hourLabel = isFirst
      ? 'Now'
      : date.toLocaleTimeString([], { hour: 'numeric', hour12: true });

    const rawTemp = hourly.temperature_2m?.[idx] ?? 0;
    const temp = Math.round(unit === 'F' ? cToF(rawTemp) : rawTemp);
    const code = hourly.weather_code?.[idx] ?? 0;
    const isDay = hourly.is_day?.[idx] ?? 1;
    const rainProb = hourly.precipitation_probability?.[idx] ?? 0;
    const condition = getWeatherCondition(code, isDay);

    return {
      isoTime: timeStr,
      label: hourLabel,
      temp,
      rainProb,
      condition,
      isFirst
    };
  });

  return (
    <section className="hourly-strip-section" aria-labelledby="hourly-strip-label">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span id="hourly-strip-label" className="section-label">Hourly Timeline (Next 24h)</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Scroll horizontally</span>
      </div>

      <div className="hourly-strip-scroll" role="region" aria-label="Hourly forecasts" tabIndex={0}>
        {hoursToDisplay.map((h, i) => (
          <div
            key={i}
            className={`hourly-item ${h.isFirst ? 'is-current' : ''}`}
            title={`${h.label}: ${h.temp}°${unit}, ${h.condition.label}${h.rainProb > 0 ? `, ${h.rainProb}% rain` : ''}`}
          >
            <span className="hourly-time">{h.label}</span>
            <WeatherIcon name={h.condition.icon} size={22} strokeWidth={1.8} />
            <span className="hourly-temp">{h.temp}°</span>
            {h.rainProb >= 15 ? (
              <span className="hourly-rain-pill">
                <WeatherIcon name="droplet" size={10} strokeWidth={2} />
                {h.rainProb}%
              </span>
            ) : (
              <span style={{ height: '14px' }}></span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
