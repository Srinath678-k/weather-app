import React from 'react';
import { WeatherIcon } from './WeatherIcon';
import { getRainCountdown } from '../utils/rainCountdown';

export function RainCountdown({ current, hourly, currentTimeStr }) {
  const countdown = getRainCountdown(current, hourly, currentTimeStr);

  const getIconName = () => {
    switch (countdown.status) {
      case 'rain_soon':
      case 'raining_continuous':
        return 'rain-heavy';
      case 'raining_easing':
      case 'rain_later':
        return 'rain-light';
      default:
        return 'umbrella';
    }
  };

  return (
    <div className="rain-banner" role="status" aria-live="polite">
      <div className="rain-icon-box">
        <WeatherIcon name={getIconName()} size={19} />
      </div>
      <div className="rain-banner-content">
        <h4 className="rain-banner-title">{countdown.headline}</h4>
        <p className="rain-banner-desc">{countdown.subtext}</p>
      </div>
    </div>
  );
}
