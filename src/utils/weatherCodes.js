// WMO Weather interpretation codes (WW)
// Reference: Open-Meteo Documentation
export const WEATHER_CODES = {
  0: { label: 'Clear sky', icon: 'clear', isRain: false, isSnow: false, isSevere: false },
  1: { label: 'Mainly clear', icon: 'mostly-clear', isRain: false, isSnow: false, isSevere: false },
  2: { label: 'Partly cloudy', icon: 'partly-cloudy', isRain: false, isSnow: false, isSevere: false },
  3: { label: 'Overcast', icon: 'overcast', isRain: false, isSnow: false, isSevere: false },
  45: { label: 'Foggy', icon: 'fog', isRain: false, isSnow: false, isSevere: false },
  48: { label: 'Depositing rime fog', icon: 'fog', isRain: false, isSnow: false, isSevere: false },
  51: { label: 'Light drizzle', icon: 'drizzle', isRain: true, isSnow: false, isSevere: false },
  53: { label: 'Moderate drizzle', icon: 'drizzle', isRain: true, isSnow: false, isSevere: false },
  55: { label: 'Dense drizzle', icon: 'drizzle', isRain: true, isSnow: false, isSevere: false },
  56: { label: 'Light freezing drizzle', icon: 'sleet', isRain: true, isSnow: true, isSevere: false },
  57: { label: 'Dense freezing drizzle', icon: 'sleet', isRain: true, isSnow: true, isSevere: false },
  61: { label: 'Slight rain', icon: 'rain-light', isRain: true, isSnow: false, isSevere: false },
  63: { label: 'Moderate rain', icon: 'rain', isRain: true, isSnow: false, isSevere: false },
  65: { label: 'Heavy rain', icon: 'rain-heavy', isRain: true, isSnow: false, isSevere: true },
  66: { label: 'Light freezing rain', icon: 'sleet', isRain: true, isSnow: true, isSevere: false },
  67: { label: 'Heavy freezing rain', icon: 'sleet', isRain: true, isSnow: true, isSevere: true },
  71: { label: 'Slight snow fall', icon: 'snow', isRain: false, isSnow: true, isSevere: false },
  73: { label: 'Moderate snow fall', icon: 'snow', isRain: false, isSnow: true, isSevere: false },
  75: { label: 'Heavy snow fall', icon: 'snow-heavy', isRain: false, isSnow: true, isSevere: true },
  77: { label: 'Snow grains', icon: 'snow', isRain: false, isSnow: true, isSevere: false },
  80: { label: 'Slight rain showers', icon: 'rain-light', isRain: true, isSnow: false, isSevere: false },
  81: { label: 'Moderate rain showers', icon: 'rain', isRain: true, isSnow: false, isSevere: false },
  82: { label: 'Violent rain showers', icon: 'rain-heavy', isRain: true, isSnow: false, isSevere: true },
  85: { label: 'Slight snow showers', icon: 'snow', isRain: false, isSnow: true, isSevere: false },
  86: { label: 'Heavy snow showers', icon: 'snow-heavy', isRain: false, isSnow: true, isSevere: true },
  95: { label: 'Thunderstorm', icon: 'thunderstorm', isRain: true, isSnow: false, isSevere: true },
  96: { label: 'Thunderstorm with slight hail', icon: 'thunderstorm-hail', isRain: true, isSnow: true, isSevere: true },
  99: { label: 'Thunderstorm with heavy hail', icon: 'thunderstorm-hail', isRain: true, isSnow: true, isSevere: true }
};

export function getWeatherCondition(code, isDay = 1) {
  const info = WEATHER_CODES[code] || {
    label: 'Variable conditions',
    icon: isDay ? 'partly-cloudy' : 'clear-night',
    isRain: false,
    isSnow: false,
    isSevere: false
  };

  // Adjust icon for night when clear or partly cloudy
  let iconName = info.icon;
  if (!isDay) {
    if (code === 0 || code === 1) iconName = 'clear-night';
    else if (code === 2) iconName = 'partly-cloudy-night';
  }

  return {
    ...info,
    icon: iconName
  };
}
