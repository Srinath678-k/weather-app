// Calculates outdoor comfort scores and identifies the best time to go outside

/**
 * Score an individual hour for outdoor activities
 * @param {number} feelsLike - Apparent temperature in Celsius
 * @param {number} rainChance - Precipitation probability (0-100)
 * @param {number} windSpeed - Wind speed in km/h
 * @param {number} uv - UV Index
 */
export function calculateComfortScore(feelsLike, rainChance = 0, windSpeed = 0, uv = 0) {
  let score = 100;
  const feelsLikeC = feelsLike;
  const windKmh = windSpeed;

  // Temperature comfort penalty (ideal is 18°C to 24°C)
  if (feelsLikeC >= 18 && feelsLikeC <= 24) {
    score -= 0;
  } else if (feelsLikeC >= 15 && feelsLikeC < 18) {
    score -= 10;
  } else if (feelsLikeC > 24 && feelsLikeC <= 27) {
    score -= 10;
  } else if (feelsLikeC >= 11 && feelsLikeC < 15) {
    score -= 25;
  } else if (feelsLikeC > 27 && feelsLikeC <= 31) {
    score -= 25;
  } else if (feelsLikeC >= 5 && feelsLikeC < 11) {
    score -= 45;
  } else if (feelsLikeC > 31 && feelsLikeC <= 35) {
    score -= 45;
  } else if (feelsLikeC < 5) {
    score -= Math.min(75, 45 + (5 - feelsLikeC) * 2.5);
  } else if (feelsLikeC > 35) {
    score -= Math.min(75, 45 + (feelsLikeC - 35) * 3);
  }

  // Rain probability penalty
  if (rainChance > 70) {
    score -= 55;
  } else if (rainChance > 50) {
    score -= 40;
  } else if (rainChance > 30) {
    score -= 25;
  } else if (rainChance > 15) {
    score -= 10;
  }

  // Wind penalty
  if (windKmh > 45) {
    score -= 30;
  } else if (windKmh > 30) {
    score -= 18;
  } else if (windKmh > 20) {
    score -= 8;
  }

  // Extreme UV midday penalty
  if (uv > 8) {
    score -= 15;
  } else if (uv > 6) {
    score -= 8;
  }

  // Clamp 0-100
  const finalScore = Math.max(0, Math.min(100, Math.round(score)));

  let level = 'uncomfortable';
  let label = 'Harsh';
  let badgeColor = '#9A3A26';

  if (finalScore >= 78) {
    level = 'optimal';
    label = 'Prime';
    badgeColor = '#2D6A4F';
  } else if (finalScore >= 60) {
    level = 'pleasant';
    label = 'Pleasant';
    badgeColor = '#52796F';
  } else if (finalScore >= 42) {
    level = 'fair';
    label = 'Fair';
    badgeColor = '#BC6C25';
  }

  return {
    score: finalScore,
    level,
    label,
    badgeColor
  };
}

/**
 * Process hourly forecast to generate the day's comfort timeline
 * @param {Object} hourlyData Open-Meteo hourly object
 * @param {string} currentIsoTime Current time string
 */
export function getComfortTimeline(hourlyData, currentIsoTime) {
  if (!hourlyData || !hourlyData.time || !hourlyData.time.length) {
    return { timeline: [], bestWindow: null };
  }

  // Find index of current hour or start from 0
  let startIndex = 0;
  if (currentIsoTime) {
    const currentPrefix = currentIsoTime.slice(0, 13); // "YYYY-MM-DDTHH"
    const found = hourlyData.time.findIndex(t => t.startsWith(currentPrefix));
    if (found !== -1) startIndex = found;
  }

  // Take the next 24 hours
  const hours = hourlyData.time.slice(startIndex, startIndex + 24);
  const timeline = hours.map((timeStr, offset) => {
    const idx = startIndex + offset;
    const feelsLike = hourlyData.apparent_temperature?.[idx] ?? hourlyData.temperature_2m?.[idx] ?? 20;
    const temp = hourlyData.temperature_2m?.[idx] ?? 20;
    const rainChance = hourlyData.precipitation_probability?.[idx] ?? 0;
    const wind = hourlyData.wind_speed_10m?.[idx] ?? 0;
    const uv = hourlyData.uv_index?.[idx] ?? 0;
    const weatherCode = hourlyData.weather_code?.[idx] ?? 0;
    const isDay = hourlyData.is_day?.[idx] ?? 1;

    const evaluation = calculateComfortScore(feelsLike, rainChance, wind, uv);

    const date = new Date(timeStr);
    const hour12 = date.toLocaleTimeString([], { hour: 'numeric', hour12: true });

    return {
      isoTime: timeStr,
      hourLabel: hour12,
      rawHour: date.getHours(),
      temp,
      feelsLike,
      rainChance,
      wind,
      uv,
      weatherCode,
      isDay,
      ...evaluation
    };
  });

  // Calculate best outdoor window
  let bestWindow = null;
  let bestScoreAvg = -1;
  let bestStartIdx = 0;
  let bestLength = 0;

  // Search for the top contiguous 2-4 hour window between 7 AM and 9 PM
  for (let len = 3; len >= 2; len--) {
    for (let i = 0; i <= timeline.length - len; i++) {
      const slice = timeline.slice(i, i + len);
      const isDaylightHours = slice.some(h => h.rawHour >= 7 && h.rawHour <= 21);
      if (!isDaylightHours && timeline.some(h => h.rawHour >= 7 && h.rawHour <= 21)) {
        continue;
      }
      const avg = slice.reduce((acc, h) => acc + h.score, 0) / len;
      if (avg > bestScoreAvg) {
        bestScoreAvg = avg;
        bestStartIdx = i;
        bestLength = len;
      }
    }
  }

  if (bestLength > 0 && timeline[bestStartIdx]) {
    const startHour = timeline[bestStartIdx].hourLabel;
    const endSlice = timeline[bestStartIdx + bestLength - 1];
    const endHourDate = new Date(endSlice.isoTime);
    endHourDate.setHours(endHourDate.getHours() + 1);
    const endHour = endHourDate.toLocaleTimeString([], { hour: 'numeric', hour12: true });

    const avgFeels = Math.round(
      timeline.slice(bestStartIdx, bestStartIdx + bestLength).reduce((acc, h) => acc + h.feelsLike, 0) / bestLength
    );
    const maxRain = Math.max(
      ...timeline.slice(bestStartIdx, bestStartIdx + bestLength).map(h => h.rainChance)
    );

    let summaryText = `Feels like ${avgFeels}°, `;
    if (maxRain > 25) summaryText += `${maxRain}% rain risk`;
    else summaryText += `low rain risk`;

    bestWindow = {
      start: startHour,
      end: endHour,
      score: Math.round(bestScoreAvg),
      avgFeels,
      maxRain,
      summaryText
    };
  }

  return { timeline, bestWindow };
}
