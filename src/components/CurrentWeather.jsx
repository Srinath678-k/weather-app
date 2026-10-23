import React, { useEffect, useState, useRef } from 'react';
import { WeatherIcon } from './WeatherIcon';
import { getWeatherCondition } from '../utils/weatherCodes';
import { cToF } from '../utils/formatters';

function useCountUp(targetValue, duration = 450) {
  const [displayValue, setDisplayValue] = useState(targetValue);
  const prevValueRef = useRef(targetValue);

  useEffect(() => {
    const startVal = prevValueRef.current ?? targetValue;
    const diff = targetValue - startVal;
    if (diff === 0) return;

    let startTime = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + diff * ease);
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        prevValueRef.current = targetValue;
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetValue, duration]);

  return displayValue;
}

export function CurrentWeather({ location, current, daily, unit = 'C', skyTheme }) {
  const currentTempC = current?.temperature_2m ?? 0;
  const targetTemp = unit === 'F' ? cToF(currentTempC) : currentTempC;
  const animatedTemp = useCountUp(Math.round(targetTemp));

  if (!current) return null;

  const rawFeels = current.apparent_temperature ?? currentTempC;
  const feelsLike = Math.round(unit === 'F' ? cToF(rawFeels) : rawFeels);
  const condition = getWeatherCondition(current.weather_code, current.is_day);

  const rawMax = daily?.temperature_2m_max?.[0];
  const rawMin = daily?.temperature_2m_min?.[0];
  const maxTemp = rawMax != null ? Math.round(unit === 'F' ? cToF(rawMax) : rawMax) : null;
  const minTemp = rawMin != null ? Math.round(unit === 'F' ? cToF(rawMin) : rawMin) : null;

  // Format local observation time
  const localTimeFormatted = current.time
    ? new Date(current.time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
    : '';

  const locationSubtitle = [location.admin1, location.country].filter(Boolean).join(', ');

  return (
    <div className="hero-editorial-left">
      <div className="location-stamp">
        <div className="location-subtext">
          <span>{localTimeFormatted} Local</span>
          <span>•</span>
          <span className="sky-phase-pill">
            <WeatherIcon name="sparkles" size={12} strokeWidth={2} />
            {skyTheme?.name || 'Atmosphere'}
          </span>
        </div>
        <h1 className="location-city">{location.name}</h1>
        {locationSubtitle && <p className="location-subtext">{locationSubtitle}</p>}
      </div>

      <div className="temp-display-wrap">
        <span className="giant-temp">{animatedTemp}</span>
        <span className="temp-unit-mark">°{unit}</span>

        <div className="temp-condition-meta">
          <div className="condition-headline">
            <WeatherIcon name={condition.icon} size={26} strokeWidth={1.8} />
            <span>{condition.label}</span>
          </div>

          <div className="condition-stats">
            <span>Feels like {feelsLike}°</span>
            {maxTemp != null && minTemp != null && (
              <>
                <span>•</span>
                <span>H: {maxTemp}° / L: {minTemp}°</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
