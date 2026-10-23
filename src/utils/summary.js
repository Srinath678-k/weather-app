// Generates a human, editorial plain-language weather verdict
// Answers: "What should I do with today's weather?"
import { formatCityHour } from './formatters';
import { getRainCountdown } from './rainCountdown';

/**
 * Generate human weather summary with actionable daily advice
 */
export function generateWeatherSummary({ current, hourly, currentTimeStr }) {
  if (!current) {
    return {
      headline: 'Awaiting local observations.',
      verdict: 'Check back in a moment as atmospheric readings refresh.',
      recommendations: [],
      chips: []
    };
  }

  const rawTemp = current.temperature_2m ?? 18;
  const rawFeelsLike = current.apparent_temperature ?? rawTemp;
  const temp = rawTemp;
  const feelsLike = rawFeelsLike;
  const humidity = current.relative_humidity_2m ?? 50;
  const rawWind = current.wind_speed_10m ?? 10;
  const windKmh = rawWind;
  const uv = current.uv_index ?? 0;
  const weatherCode = current.weather_code ?? 0;

  const referenceTime = current.time || currentTimeStr;

  // Find index of current hour by matching the first 13 characters (YYYY-MM-DDTHH)
  let currentHourIdx = 0;
  if (referenceTime && hourly && hourly.time) {
    const prefix = referenceTime.slice(0, 13);
    const found = hourly.time.findIndex(t => t.startsWith(prefix));
    if (found !== -1) currentHourIdx = found;
  }

  // Scan the next 12 hours from that index
  let firstRainHourIdx = null;
  let maxRainChance12h = 0;

  if (hourly && hourly.time) {
    const endIdx = Math.min(hourly.time.length, currentHourIdx + 12);
    for (let i = currentHourIdx; i < endIdx; i++) {
      const prob = hourly.precipitation_probability?.[i] ?? 0;
      const precip = hourly.precipitation?.[i] ?? 0;
      if (prob > maxRainChance12h) maxRainChance12h = prob;
      if ((prob >= 40 || precip >= 0.2) && firstRainHourIdx === null) {
        firstRainHourIdx = i;
      }
    }
  }

  // Synchronize strictly with the RainCountdown utility to guarantee no contradictions
  const countdown = getRainCountdown(current, hourly, referenceTime);

  const isSnowing = weatherCode >= 71 && weatherCode <= 77;
  const isStorm = weatherCode >= 95;

  // 1. Atmosphere sensation descriptor
  let feelPhrase = '';
  if (feelsLike >= 33) {
    feelPhrase = 'Blistering afternoon heat';
  } else if (feelsLike >= 28) {
    feelPhrase = humidity > 68 ? 'Sticky, sweltering air' : 'Hot and dry conditions';
  } else if (feelsLike >= 22) {
    feelPhrase = humidity > 70 ? 'Muggy and warm' : 'Comfortable, balmy daylight';
  } else if (feelsLike >= 16) {
    feelPhrase = windKmh > 24 ? 'Brisk and breezy' : 'Mild and pleasant';
  } else if (feelsLike >= 10) {
    feelPhrase = 'Crisp, cool air';
  } else if (feelsLike >= 4) {
    feelPhrase = windKmh > 20 ? 'Sharp, biting chill' : 'Cold and overcast';
  } else {
    feelPhrase = 'Sub-zero freezing chill';
  }

  // 2. Rain & Sky timing descriptor using city's local hour from hourly.time
  let rainTimingPhrase = '';
  if (isStorm) {
    rainTimingPhrase = 'thunderstorms rolling through';
  } else if (isSnowing) {
    rainTimingPhrase = 'snow showers accumulating';
  } else if (countdown.status === 'raining_continuous') {
    rainTimingPhrase = 'steady rain currently falling';
  } else if (countdown.status === 'raining_easing') {
    const easeTime = countdown.stopHour || (hourly?.time?.[currentHourIdx + 2] ? formatCityHour(hourly.time[currentHourIdx + 2]) : 'later');
    rainTimingPhrase = `rain falling now, easing around ${easeTime}`;
  } else if (countdown.status === 'rain_soon') {
    rainTimingPhrase = 'showers developing very soon';
  } else if (countdown.status === 'rain_later') {
    const targetIdx = firstRainHourIdx !== null ? firstRainHourIdx : countdown.rainStartIdx;
    const rainTimeLabel = targetIdx !== undefined && hourly?.time?.[targetIdx]
      ? formatCityHour(hourly.time[targetIdx])
      : countdown.rainHourStr || 'later';
    rainTimingPhrase = `rain likely around ${rainTimeLabel}`;
  } else {
    // countdown.status === 'no_rain'
    rainTimingPhrase = 'dry skies holding through tonight';
  }

  // 3. Clothing and preparation guidance
  let clothingAdvice = '';
  if (feelsLike >= 28) {
    clothingAdvice = 'Stick to loose linen and breathable cottons.';
  } else if (feelsLike >= 21) {
    clothingAdvice = 'A light t-shirt or airy shirt is all you need.';
  } else if (feelsLike >= 15) {
    clothingAdvice = 'Toss on a light overshirt or cardigan.';
  } else if (feelsLike >= 9) {
    clothingAdvice = 'A proper jacket or warm sweater is essential.';
  } else if (feelsLike >= 3) {
    clothingAdvice = 'Layer up with an insulated coat and knit scarf.';
  } else {
    clothingAdvice = 'Heavy thermal layers, gloves, and a warm beanie required.';
  }

  // 4. Action recommendations & chips (guaranteed consistent with RainCountdown)
  const recommendations = [];
  const chips = [];

  if (countdown.status === 'no_rain') {
    recommendations.push('Leave the umbrella behind—zero rain expected.');
    chips.push({ text: 'No umbrella needed', type: 'positive' });
  } else {
    recommendations.push('Keep an umbrella within reach.');
    chips.push({ text: 'Carry umbrella', type: 'warning' });
  }

  // UV / Sun
  if (uv >= 6) {
    recommendations.push('Midday UV is intense; pack sunglasses and SPF 30.');
    chips.push({ text: `High UV (${uv})`, type: 'warning' });
  } else if (uv >= 3) {
    chips.push({ text: `Moderate UV (${uv})`, type: 'neutral' });
  }

  // Wind
  if (windKmh >= 38) {
    recommendations.push('Gusty winds; secure lightweight outdoor items.');
    chips.push({ text: 'High winds', type: 'warning' });
  } else if (windKmh >= 22) {
    chips.push({ text: 'Brisk breeze', type: 'neutral' });
  }

  // Humidity note
  if (humidity >= 78 && temp >= 20) {
    chips.push({ text: 'High humidity', type: 'neutral' });
  } else if (humidity <= 25) {
    chips.push({ text: 'Dry air', type: 'neutral' });
  }

  // Headline composition
  const headline = `${feelPhrase}, ${rainTimingPhrase}.`;
  
  // Editorial verdict composition
  const verdict = `${clothingAdvice} ${recommendations.slice(0, 2).join(' ')}`;

  return {
    headline,
    verdict,
    recommendations,
    chips
  };
}
