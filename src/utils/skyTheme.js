// Sky theme calculator based on actual sunrise and sunset times
// Strictly adheres to natural earth-and-sky palettes (no purple/blue neon gradients)

export const SKY_THEMES = {
  dawn: {
    id: 'dawn',
    name: 'Dawn Mist',
    isDark: false,
    gradient: 'linear-gradient(175deg, #F0E6DC 0%, #DECDBE 100%)',
    bgBase: '#EBE2D8',
    card: '#FAF4EE',
    cardSubtle: '#EBE0D3',
    cardHover: '#F4ECE4',
    text: '#2E2520',
    textMuted: '#756357',
    accent: '#B85D36',
    accentBg: 'rgba(184, 93, 54, 0.12)',
    border: 'rgba(46, 37, 32, 0.11)',
    tagBg: '#E4D5C5'
  },
  day: {
    id: 'day',
    name: 'Natural Daylight',
    isDark: false,
    gradient: 'linear-gradient(175deg, #F7F4EE 0%, #E5DDD0 100%)',
    bgBase: '#F3EFE7',
    card: '#FFFFFF',
    cardSubtle: '#ECE4D6',
    cardHover: '#F7F2E8',
    text: '#221F1C',
    textMuted: '#6D655C',
    accent: '#2B574D',
    accentBg: 'rgba(43, 87, 77, 0.12)',
    border: 'rgba(34, 31, 28, 0.10)',
    tagBg: '#E2DACB'
  },
  goldenHour: {
    id: 'goldenHour',
    name: 'Golden Hour',
    isDark: false,
    gradient: 'linear-gradient(175deg, #F4E5D4 0%, #DDBF9E 100%)',
    bgBase: '#EEDCC8',
    card: '#FCF6EE',
    cardSubtle: '#E8D2BB',
    cardHover: '#F5E8D8',
    text: '#2A1E16',
    textMuted: '#725B49',
    accent: '#C45A25',
    accentBg: 'rgba(196, 90, 37, 0.14)',
    border: 'rgba(42, 30, 22, 0.12)',
    tagBg: '#DFC5AA'
  },
  dusk: {
    id: 'dusk',
    name: 'Twilight Dusk',
    isDark: true,
    gradient: 'linear-gradient(175deg, #332B29 0%, #1F1918 100%)',
    bgBase: '#292321',
    card: '#38302D',
    cardSubtle: '#28211F',
    cardHover: '#423936',
    text: '#F7EFEB',
    textMuted: '#B7A69E',
    accent: '#DE8A59',
    accentBg: 'rgba(222, 138, 89, 0.18)',
    border: 'rgba(247, 239, 235, 0.09)',
    tagBg: '#443B38'
  },
  night: {
    id: 'night',
    name: 'Starry Obsidian',
    isDark: true,
    gradient: 'linear-gradient(175deg, #1C1A18 0%, #0F0E0D 100%)',
    bgBase: '#151413',
    card: '#22201D',
    cardSubtle: '#181615',
    cardHover: '#2A2724',
    text: '#ECE5DE',
    textMuted: '#999086',
    accent: '#D49A62',
    accentBg: 'rgba(212, 154, 98, 0.15)',
    border: 'rgba(236, 229, 222, 0.08)',
    tagBg: '#2E2B27'
  }
};

/**
 * Calculates the sky phase using city's local sunrise and sunset strings
 * @param {string} currentTimeStr ISO or "YYYY-MM-DDTHH:MM" local string
 * @param {string} sunriseStr "YYYY-MM-DDTHH:MM"
 * @param {string} sunsetStr "YYYY-MM-DDTHH:MM"
 */
export function getSkyTheme(currentTimeStr, sunriseStr, sunsetStr) {
  if (!sunriseStr || !sunsetStr) {
    return SKY_THEMES.day;
  }

  try {
    const parseMinutes = (timeStr) => {
      // Handles both ISO strings with T and plain times
      const date = new Date(timeStr);
      if (!isNaN(date.getTime())) {
        return date.getHours() * 60 + date.getMinutes();
      }
      // Fallback manual parse for "YYYY-MM-DDTHH:MM"
      const match = timeStr.match(/T(\d{2}):(\d{2})/);
      if (match) {
        return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
      }
      return 12 * 60;
    };

    const currentMin = currentTimeStr ? parseMinutes(currentTimeStr) : (() => {
      const d = new Date();
      return d.getHours() * 60 + d.getMinutes();
    })();

    const sunriseMin = parseMinutes(sunriseStr);
    const sunsetMin = parseMinutes(sunsetStr);

    // Dawn: 45 min before sunrise to 25 min after sunrise
    const dawnStart = sunriseMin - 45;
    const dawnEnd = sunriseMin + 25;

    // Golden Hour: 70 min before sunset to 15 min after sunset
    const goldenStart = sunsetMin - 70;
    const goldenEnd = sunsetMin + 15;

    // Dusk: 15 min after sunset to 65 min after sunset
    const duskEnd = sunsetMin + 65;

    if (currentMin >= dawnStart && currentMin < dawnEnd) {
      return SKY_THEMES.dawn;
    }
    if (currentMin >= dawnEnd && currentMin < goldenStart) {
      return SKY_THEMES.day;
    }
    if (currentMin >= goldenStart && currentMin < goldenEnd) {
      return SKY_THEMES.goldenHour;
    }
    if (currentMin >= goldenEnd && currentMin < duskEnd) {
      return SKY_THEMES.dusk;
    }
    return SKY_THEMES.night;
  } catch {
    return SKY_THEMES.day;
  }
}
