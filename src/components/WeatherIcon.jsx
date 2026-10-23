import React from 'react';

/**
 * Cohesive architectural inline SVG weather icons
 * Minimalist, elegant line art with consistent 1.75px stroke
 */
export function WeatherIcon({ name, size = 24, strokeWidth = 1.75, className = '', color = 'currentColor' }) {
  const commonProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className,
    'aria-hidden': 'true'
  };

  switch (name) {
    case 'clear':
    case 'sun':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="4.5" />
          <line x1="12" y1="2" x2="12" y2="4.5" />
          <line x1="12" y1="19.5" x2="12" y2="22" />
          <line x1="4.93" y1="4.93" x2="6.7" y2="6.7" />
          <line x1="17.3" y1="17.3" x2="19.07" y2="19.07" />
          <line x1="2" y1="12" x2="4.5" y2="12" />
          <line x1="19.5" y1="12" x2="22" y2="12" />
          <line x1="4.93" y1="19.07" x2="6.7" y2="17.3" />
          <line x1="17.3" y1="6.7" x2="19.07" y2="4.93" />
        </svg>
      );

    case 'clear-night':
    case 'moon':
      return (
        <svg {...commonProps}>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      );

    case 'mostly-clear':
    case 'partly-cloudy':
      return (
        <svg {...commonProps}>
          <path d="M12 4V2" />
          <path d="M4.93 4.93l1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M17.5 10a4 4 0 0 0-7.2-2.3A5.5 5.5 0 0 0 5 15h13a3.5 3.5 0 0 0-.5-5z" />
          <path d="M16 3.5l.8 1.4" />
        </svg>
      );

    case 'partly-cloudy-night':
      return (
        <svg {...commonProps}>
          <path d="M16.5 4.5a5.5 5.5 0 0 1-5.5 5.5c-.7 0-1.4-.1-2-.4" />
          <path d="M17.5 13a3.5 3.5 0 0 0-3.5-3.5 4 4 0 0 0-7.2 2.3A5.5 5.5 0 0 0 3 17h14a3.5 3.5 0 0 0 .5-4z" />
        </svg>
      );

    case 'overcast':
    case 'cloudy':
      return (
        <svg {...commonProps}>
          <path d="M17.5 19H6.5a4.5 4.5 0 0 1-.8-8.9A5.5 5.5 0 0 1 16.5 9a4.5 4.5 0 0 1 1 10z" />
        </svg>
      );

    case 'fog':
      return (
        <svg {...commonProps}>
          <path d="M4 14h16" />
          <path d="M3 10h18" />
          <path d="M6 18h12" />
          <path d="M7 6h10" />
        </svg>
      );

    case 'drizzle':
      return (
        <svg {...commonProps}>
          <path d="M17.5 14H6.5a4.5 4.5 0 0 1-.8-8.9A5.5 5.5 0 0 1 16.5 4a4.5 4.5 0 0 1 1 10z" />
          <line x1="8" y1="17" x2="8" y2="19" />
          <line x1="12" y1="18" x2="12" y2="20" />
          <line x1="16" y1="17" x2="16" y2="19" />
        </svg>
      );

    case 'rain-light':
      return (
        <svg {...commonProps}>
          <path d="M17 13.5H6.5a4.5 4.5 0 0 1-.8-8.9A5.5 5.5 0 0 1 16.5 4a4.5 4.5 0 0 1 .5 9.5z" />
          <line x1="9" y1="16" x2="7.5" y2="20" />
          <line x1="15" y1="16" x2="13.5" y2="20" />
        </svg>
      );

    case 'rain':
      return (
        <svg {...commonProps}>
          <path d="M17 13H6.5a4.5 4.5 0 0 1-.8-8.9A5.5 5.5 0 0 1 16.5 3.5a4.5 4.5 0 0 1 .5 9.5z" />
          <line x1="8" y1="16" x2="6.5" y2="20.5" />
          <line x1="12" y1="16" x2="10.5" y2="20.5" />
          <line x1="16" y1="16" x2="14.5" y2="20.5" />
        </svg>
      );

    case 'rain-heavy':
      return (
        <svg {...commonProps}>
          <path d="M17 12H6.5a4.5 4.5 0 0 1-.8-8.9A5.5 5.5 0 0 1 16.5 2.5a4.5 4.5 0 0 1 .5 9.5z" />
          <line x1="7" y1="15" x2="5" y2="21" />
          <line x1="11" y1="15" x2="9" y2="21" />
          <line x1="15" y1="15" x2="13" y2="21" />
          <line x1="19" y1="15" x2="17" y2="21" />
        </svg>
      );

    case 'snow':
    case 'snow-heavy':
      return (
        <svg {...commonProps}>
          <path d="M17 12.5H6.5a4.5 4.5 0 0 1-.8-8.9A5.5 5.5 0 0 1 16.5 3a4.5 4.5 0 0 1 .5 9.5z" />
          <path d="M8 17h.01M8 20h.01M12 16h.01M12 19h.01M16 17h.01M16 20h.01" />
        </svg>
      );

    case 'sleet':
      return (
        <svg {...commonProps}>
          <path d="M17 13H6.5a4.5 4.5 0 0 1-.8-8.9A5.5 5.5 0 0 1 16.5 3.5a4.5 4.5 0 0 1 .5 9.5z" />
          <line x1="8" y1="16" x2="6.5" y2="20.5" />
          <circle cx="12" cy="18" r="1" />
          <line x1="16" y1="16" x2="14.5" y2="20.5" />
        </svg>
      );

    case 'thunderstorm':
    case 'thunderstorm-hail':
      return (
        <svg {...commonProps}>
          <path d="M17 12H6.5a4.5 4.5 0 0 1-.8-8.9A5.5 5.5 0 0 1 16.5 2.5a4.5 4.5 0 0 1 .5 9.5z" />
          <polyline points="13 13 10 18 13.5 18 11.5 23" />
        </svg>
      );

    case 'umbrella':
      return (
        <svg {...commonProps}>
          <path d="M12 3a9 9 0 0 0-9 9h18a9 9 0 0 0-9-9z" />
          <path d="M12 12v6a2.5 2.5 0 0 0 5 0" />
        </svg>
      );

    case 'wind':
      return (
        <svg {...commonProps}>
          <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
        </svg>
      );

    case 'droplet':
      return (
        <svg {...commonProps}>
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      );

    case 'compass':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      );

    case 'sunrise':
      return (
        <svg {...commonProps}>
          <path d="M12 2v6" />
          <path d="M4.93 10.93l1.41 1.41" />
          <path d="M20 18h2" />
          <path d="M2 18h2" />
          <path d="M19.07 10.93l-1.41 1.41" />
          <path d="M22 22H2" />
          <path d="M8 18a4 4 0 0 1 8 0" />
          <polyline points="9 5 12 2 15 5" />
        </svg>
      );

    case 'sunset':
      return (
        <svg {...commonProps}>
          <path d="M12 8V2" />
          <path d="M4.93 10.93l1.41 1.41" />
          <path d="M20 18h2" />
          <path d="M2 18h2" />
          <path d="M19.07 10.93l-1.41 1.41" />
          <path d="M22 22H2" />
          <path d="M8 18a4 4 0 0 1 8 0" />
          <polyline points="9 5 12 8 15 5" />
        </svg>
      );

    case 'location':
      return (
        <svg {...commonProps}>
          <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );

    case 'search':
      return (
        <svg {...commonProps}>
          <circle cx="11" cy="11" r="7.5" />
          <line x1="21" y1="21" x2="16.5" y2="16.5" />
        </svg>
      );

    case 'check':
      return (
        <svg {...commonProps}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );

    case 'clock':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );

    case 'cross':
      return (
        <svg {...commonProps}>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      );

    default:
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
        </svg>
      );
  }
}
