import React, { useState } from 'react';
import { getComfortTimeline } from '../utils/comfortScore';
import { WeatherIcon } from './WeatherIcon';
import { getWeatherCondition } from '../utils/weatherCodes';
import { cToF, kmhToMph } from '../utils/formatters';

export function BestTimeBar({ hourly, currentTimeStr, unit = 'C' }) {
  const { timeline, bestWindow } = getComfortTimeline(hourly, currentTimeStr);
  const [activeHour, setActiveHour] = useState(null);

  if (!timeline || timeline.length === 0) return null;

  // Selected hour defaults to the active hovered/clicked hour or the first one in the best window or first hour
  const inspected = activeHour || timeline[0];
  const inspectedCondition = getWeatherCondition(inspected.weatherCode, inspected.isDay);

  const bestWindowFeels = bestWindow != null
    ? Math.round(unit === 'F' ? cToF(bestWindow.avgFeels) : bestWindow.avgFeels)
    : null;
  const bestWindowSummary = bestWindow != null
    ? `Feels like ${bestWindowFeels}°, ${bestWindow.maxRain > 25 ? `${bestWindow.maxRain}% rain risk` : 'low rain risk'}`
    : '';

  return (
    <section className="best-time-section" aria-labelledby="best-time-title">
      <div className="best-time-header">
        <div>
          <span className="section-label">Activity Planner</span>
          <h3 id="best-time-title" className="best-time-title">Best Time to Go Out</h3>
        </div>

        {bestWindow && (
          <div className="best-window-highlight">
            <WeatherIcon name="check" size={15} strokeWidth={2.2} />
            <span>
              Prime window: {bestWindow.start} – {bestWindow.end} ({bestWindowSummary})
            </span>
          </div>
        )}
      </div>

      <div className="comfort-bar-wrapper">
        <div className="comfort-track" role="list" aria-label="Hourly comfort scale for the next 24 hours">
          {timeline.map((hour, idx) => (
            <div
              key={idx}
              className={`comfort-cell ${hour.level}`}
              style={{
                outline: activeHour?.isoTime === hour.isoTime ? '2px solid var(--text-primary)' : 'none'
              }}
              onMouseEnter={() => setActiveHour(hour)}
              onClick={() => setActiveHour(hour)}
              role="listitem"
              tabIndex={0}
              onFocus={() => setActiveHour(hour)}
              title={`${hour.hourLabel}: ${hour.label} (${Math.round(unit === 'F' ? cToF(hour.feelsLike) : hour.feelsLike)}° feels like, ${hour.rainChance}% rain)`}
            />
          ))}
        </div>

        <div className="comfort-time-axis">
          <span>
            <span className="axis-long">Now ({timeline[0]?.hourLabel})</span>
            <span className="axis-short">{timeline[0]?.hourLabel || 'Now'}</span>
          </span>
          <span>
            <span className="axis-long">+6h ({timeline[6]?.hourLabel})</span>
            <span className="axis-short">{timeline[6]?.hourLabel || '+6h'}</span>
          </span>
          <span>
            <span className="axis-long">+12h ({timeline[12]?.hourLabel})</span>
            <span className="axis-short">{timeline[12]?.hourLabel || '+12h'}</span>
          </span>
          <span>
            <span className="axis-long">+18h ({timeline[18]?.hourLabel})</span>
            <span className="axis-short">{timeline[18]?.hourLabel || '+18h'}</span>
          </span>
          <span>+24h</span>
        </div>
      </div>

      {/* Inspected Hour Interactive Detail Card */}
      {inspected && (
        <div className="active-hour-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <WeatherIcon name={inspectedCondition.icon} size={20} />
            <strong>{inspected.hourLabel}</strong>
            <span>•</span>
            <span style={{ color: inspected.badgeColor, fontWeight: 600 }}>{inspected.label} Comfort</span>
          </div>

          <div className="active-hour-stats">
            <span>Feels like {Math.round(unit === 'F' ? cToF(inspected.feelsLike) : inspected.feelsLike)}°{unit}</span>
            <span>•</span>
            <span>{inspected.rainChance}% Rain Risk</span>
            <span>•</span>
            <span>Wind {Math.round(unit === 'F' ? kmhToMph(inspected.wind) : inspected.wind)} {unit === 'F' ? 'mph' : 'km/h'}</span>
          </div>
        </div>
      )}

      <div className="comfort-legend">
        <span className="comfort-legend-scale-title">Scale:</span>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#2D6A4F' }}></span>
          <span>Prime (Ideal outdoor)</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#52796F' }}></span>
          <span>Pleasant</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#BC6C25' }}></span>
          <span>Fair</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#9A3A26' }}></span>
          <span>Harsh / Chilly</span>
        </div>
      </div>
    </section>
  );
}
