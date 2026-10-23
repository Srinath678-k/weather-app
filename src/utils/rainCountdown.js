// Rain countdown utility: calculates exact or human-friendly rain timing
// Answers: "Rain starts in 42 minutes" or "No rain expected today"

import { formatCityHour } from './formatters';

export function getRainCountdown(current, hourly, currentIsoTime) {
  if (!hourly || !hourly.time || !hourly.time.length) {
    return {
      status: 'no_rain',
      headline: 'No rain expected today',
      subtext: 'Atmospheric moisture remains low across the region.'
    };
  }

  const weatherCode = current?.weather_code ?? 0;
  const currentPrecip = current?.precipitation ?? 0;
  const isRainingNow = currentPrecip > 0.1 || 
    (weatherCode >= 51 && weatherCode <= 67) || 
    (weatherCode >= 80 && weatherCode <= 82) ||
    weatherCode >= 95;

  // Find index of current hour
  let currentHourIdx = 0;
  if (currentIsoTime) {
    const prefix = currentIsoTime.slice(0, 13);
    const found = hourly.time.findIndex(t => t.startsWith(prefix));
    if (found !== -1) currentHourIdx = found;
  }

  // Parse reference date
  const now = currentIsoTime ? new Date(currentIsoTime) : new Date();

  if (isRainingNow) {
    // Look ahead to see when it stops
    let stopIdx = -1;
    for (let i = currentHourIdx + 1; i < Math.min(hourly.time.length, currentHourIdx + 12); i++) {
      const prob = hourly.precipitation_probability?.[i] ?? 0;
      const precip = hourly.precipitation?.[i] ?? 0;
      if (prob < 25 && precip < 0.1) {
        stopIdx = i;
        break;
      }
    }

    if (stopIdx !== -1) {
      const stopHour = formatCityHour(hourly.time[stopIdx]);
      return {
        status: 'raining_easing',
        headline: 'Rain currently falling',
        subtext: `Expected to taper off around ${stopHour}.`,
        stopHour
      };
    }

    return {
      status: 'raining_continuous',
      headline: 'Steady rain in progress',
      subtext: 'Precipitation will continue through the upcoming hours.'
    };
  }

  // Not raining now: look for the first rain event
  let rainStartIdx = -1;
  for (let i = currentHourIdx; i < Math.min(hourly.time.length, currentHourIdx + 24); i++) {
    const prob = hourly.precipitation_probability?.[i] ?? 0;
    const precip = hourly.precipitation?.[i] ?? 0;
    if (prob >= 40 || precip >= 0.2) {
      rainStartIdx = i;
      break;
    }
  }

  if (rainStartIdx === -1) {
    return {
      status: 'no_rain',
      headline: 'No rain expected today',
      subtext: 'Clear skies and dry ground over the next 24 hours.'
    };
  }

  const rainDate = new Date(hourly.time[rainStartIdx]);
  const diffMs = rainDate.getTime() - now.getTime();
  const diffMinutes = Math.round(diffMs / 60000);
  const rainProb = hourly.precipitation_probability?.[rainStartIdx] ?? 60;

  if (diffMinutes > 0 && diffMinutes <= 90) {
    return {
      status: 'rain_soon',
      headline: `Rain starts in ~${diffMinutes} minutes`,
      subtext: `${rainProb}% probability of precipitation arriving soon.`
    };
  }

  const rainHourStr = formatCityHour(hourly.time[rainStartIdx]);
  return {
    status: 'rain_later',
    headline: `Rain expected around ${rainHourStr}`,
    subtext: `${rainProb}% chance of rain later in the day.`,
    rainHourStr,
    rainStartIdx
  };
}
