import React from 'react';
import { WeatherIcon } from './WeatherIcon';
import { getBeaufortDescription, getWindDirection, getUvCategory, formatTime12, kmhToMph } from '../utils/formatters';

export function AtmosphereDetails({ current, daily, unit = 'C' }) {
  if (!current) return null;

  const humidity = current.relative_humidity_2m ?? 0;
  const windKmh = current.wind_speed_10m ?? 0;
  const displayWind = Math.round(unit === 'F' ? kmhToMph(windKmh) : windKmh);
  const windDir = getWindDirection(current.wind_direction_10m);
  const beaufort = getBeaufortDescription(windKmh);
  const uv = current.uv_index ?? 0;
  const uvCat = getUvCategory(uv);
  const pressure = current.surface_pressure ? Math.round(current.surface_pressure) : null;

  const sunrise = daily?.sunrise?.[0] ? formatTime12(daily.sunrise[0]) : '--';
  const sunset = daily?.sunset?.[0] ? formatTime12(daily.sunset[0]) : '--';

  return (
    <div className="atmosphere-card" aria-labelledby="atmosphere-heading">
      <div>
        <span className="section-label">Atmosphere</span>
        <h3 id="atmosphere-heading" className="forecast-title">Key Readings</h3>
      </div>

      <div className="metrics-grid">
        {/* Humidity */}
        <div className="metric-box">
          <div className="metric-label">
            <WeatherIcon name="droplet" size={14} />
            <span>Humidity</span>
          </div>
          <div className="metric-value">{humidity}%</div>
          <div className="metric-sub">
            {humidity > 70 ? 'Moist & sticky feel' : humidity < 35 ? 'Dry and crisp air' : 'Comfortable balance'}
          </div>
        </div>

        {/* Wind */}
        <div className="metric-box">
          <div className="metric-label">
            <WeatherIcon name="wind" size={14} />
            <span>Wind & Breeze</span>
          </div>
          <div className="metric-value">
            {displayWind} <span style={{ fontSize: '0.9rem', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>{unit === 'F' ? 'mph' : 'km/h'}</span>
          </div>
          <div className="metric-sub">
            {beaufort} {windDir && `• ${windDir}`}
          </div>
        </div>

        {/* UV Index */}
        <div className="metric-box">
          <div className="metric-label">
            <WeatherIcon name="sun" size={14} />
            <span>UV Index</span>
          </div>
          <div className="metric-value">{uv}</div>
          <div className="metric-sub">{uvCat.level} — {uvCat.advice}</div>
        </div>

        {/* Daylight / Sun cycle */}
        <div className="metric-box">
          <div className="metric-label">
            <WeatherIcon name="sunrise" size={14} />
            <span>Sun Cycle</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '2px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              ↑ {sunrise}
            </span>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              ↓ {sunset}
            </span>
          </div>
          <div className="metric-sub">Local solar times</div>
        </div>
      </div>

      {pressure && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', paddingTop: '4px' }}>
          <span>Barometric Pressure</span>
          <strong>{pressure} hPa</strong>
        </div>
      )}
    </div>
  );
}
