import React from 'react';
import { WeatherIcon } from './WeatherIcon';

export function ErrorState({ title = 'Atmospheric readings unavailable', message, onRetry, onSelectFallback }) {
  const fallbackCities = [
    { name: 'London', country: 'United Kingdom', latitude: 51.5085, longitude: -0.1257 },
    { name: 'Tokyo', country: 'Japan', latitude: 35.6895, longitude: 139.6917 },
    { name: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.0060 }
  ];

  return (
    <div className="error-state-card" role="alert">
      <div style={{ color: 'var(--accent)', marginBottom: '4px' }}>
        <WeatherIcon name="overcast" size={42} strokeWidth={1.5} />
      </div>
      <h3 className="error-title">{title}</h3>
      <p className="error-message">
        {message || 'We could not reach the meteorological sensors right now. Please check your network connection or try another location.'}
      </p>

      {onRetry && (
        <button type="button" className="retry-btn" onClick={onRetry}>
          Try Again
        </button>
      )}

      {onSelectFallback && (
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Or check conditions in:</span>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {fallbackCities.map(city => (
              <button
                key={city.name}
                type="button"
                className="recent-chip"
                onClick={() => onSelectFallback(city)}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
