// Temperature formatting and unit helpers
export function cToF(c) {
  return (c * 9) / 5 + 32;
}

export function fToC(f) {
  return ((f - 32) * 5) / 9;
}

export function kmhToMph(kmh) {
  return kmh * 0.621371;
}

export function mphToKmh(mph) {
  return mph / 0.621371;
}

export function formatTemp(value, unit = 'C', showDegree = true) {
  if (value === undefined || value === null || isNaN(value)) return '--';
  const val = unit === 'F' ? cToF(value) : value;
  const rounded = Math.round(val);
  return `${rounded}${showDegree ? '°' : ''}`;
}

export function formatWindSpeed(kmh, unit = 'C') {
  if (kmh === undefined || kmh === null || isNaN(kmh)) return '--';
  if (unit === 'F') {
    const mph = kmhToMph(kmh);
    return `${Math.round(mph)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function getWindDirection(degrees) {
  if (degrees === undefined || degrees === null) return '';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}

export function getBeaufortDescription(kmh) {
  if (kmh < 1) return 'Calm';
  if (kmh <= 5) return 'Light air';
  if (kmh <= 11) return 'Light breeze';
  if (kmh <= 19) return 'Gentle breeze';
  if (kmh <= 28) return 'Moderate breeze';
  if (kmh <= 38) return 'Fresh breeze';
  if (kmh <= 49) return 'Strong breeze';
  if (kmh <= 61) return 'Near gale';
  if (kmh <= 74) return 'Gale force';
  return 'Storm wind';
}

export function getUvCategory(uv) {
  if (uv === undefined || uv === null) return { level: 'Low', advice: 'No protection needed' };
  if (uv < 3) return { level: 'Low', advice: 'Minimal sun risk' };
  if (uv < 6) return { level: 'Moderate', advice: 'Sunscreen recommended during midday' };
  if (uv < 8) return { level: 'High', advice: 'Hat and SPF 30+ advised' };
  if (uv < 11) return { level: 'Very High', advice: 'Seek shade around noon' };
  return { level: 'Extreme', advice: 'Avoid direct midday sun' };
}

// Time formatters using standard Date objects
export function formatCityHour(isoString) {
  if (!isoString) return '';
  const match = isoString.match(/T(\d{2}):(\d{2})/);
  if (match) {
    let hour = parseInt(match[1], 10);
    const minute = match[2];
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return minute === '00' ? `${hour} ${ampm}` : `${hour}:${minute} ${ampm}`;
  }
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
}

export function formatHourOnly(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
}

export function formatTime24(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function formatTime12(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
}

export function formatDayName(isoString, index = 0) {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  const date = new Date(isoString);
  return date.toLocaleDateString([], { weekday: 'short' });
}

export function formatFullDate(isoString) {
  const date = isoString ? new Date(isoString) : new Date();
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
}
