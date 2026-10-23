import React, { useState, useCallback } from 'react';
import { useWeather } from './hooks/useWeather';
import { useGeolocation } from './hooks/useGeolocation';
import { useLocalStorage } from './hooks/useLocalStorage';

import { SkyBackground } from './components/SkyBackground';
import { SearchBar } from './components/SearchBar';
import { CurrentWeather } from './components/CurrentWeather';
import { Summary } from './components/Summary';
import { BestTimeBar } from './components/BestTimeBar';
import { HourlyStrip } from './components/HourlyStrip';
import { DailyForecast } from './components/DailyForecast';
import { AtmosphereDetails } from './components/AtmosphereDetails';
import { Skeleton } from './components/Skeleton';
import { ErrorState } from './components/ErrorState';
import { WeatherIcon } from './components/WeatherIcon';
import { formatFullDate } from './utils/formatters';

// Clean initial default city (Chennai)
const DEFAULT_CITY = {
  name: 'Chennai',
  country: 'India',
  admin1: 'Tamil Nadu',
  latitude: 13.0827,
  longitude: 80.2707,
  timezone: 'Asia/Kolkata'
};

export default function App() {
  const [unit, setUnit] = useLocalStorage('outlook_temp_unit', 'C');
  const [currentLocation, setCurrentLocation] = useLocalStorage('outlook_current_city', DEFAULT_CITY);
  const [recentCities, setRecentCities] = useLocalStorage('outlook_recent_cities', [
    { name: 'Chennai', country: 'India', latitude: 13.0827, longitude: 80.2707 },
    { name: 'Bengaluru', country: 'India', latitude: 12.9716, longitude: 77.5946 },
    { name: 'Mumbai', country: 'India', latitude: 19.0760, longitude: 72.8777 }
  ]);

  const [activeSkyTheme, setActiveSkyTheme] = useState(null);

  // Ensure default city updates cleanly if previously cached as Kyoto
  React.useEffect(() => {
    if (
      currentLocation?.name === 'Kyoto' ||
      currentLocation?.name === 'chennai' ||
      currentLocation?.timezone === 'Asia/chennai'
    ) {
      setCurrentLocation(DEFAULT_CITY);
    }
  }, [currentLocation, setCurrentLocation]);

  // Weather data hook
  const { data: weatherData, loading, error, refetch } = useWeather(currentLocation, unit);

  // Geolocation hook
  const { getCurrentLocation, loading: geoLoading, error: geoError, clearError: clearGeoError } = useGeolocation();

  // Handle selecting city from search or recents
  const handleSelectCity = useCallback((newLoc) => {
    setCurrentLocation(newLoc);
    clearGeoError();

    // Add to recents, keep up to 5 unique cities
    setRecentCities((prev) => {
      const filtered = prev.filter(
        (c) => !(Math.abs(c.latitude - newLoc.latitude) < 0.05 && Math.abs(c.longitude - newLoc.longitude) < 0.05)
      );
      return [newLoc, ...filtered].slice(0, 5);
    });
  }, [clearGeoError, setCurrentLocation, setRecentCities]);

  // Handle GPS location click
  const handleUseMyLocation = () => {
    getCurrentLocation((loc) => {
      handleSelectCity(loc);
    });
  };

  // Toggle °C / °F
  const toggleUnit = () => {
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  };

  const currentObs = weatherData?.current;
  const hourlyObs = weatherData?.hourly;
  const dailyObs = weatherData?.daily;

  const sunriseStr = dailyObs?.sunrise?.[0];
  const sunsetStr = dailyObs?.sunset?.[0];
  const currentTimeStr = currentObs?.time;

  return (
    <>
      {/* Dynamic sky background synchronizing palette with sun phase */}
      <SkyBackground
        currentTimeStr={currentTimeStr}
        sunriseStr={sunriseStr}
        sunsetStr={sunsetStr}
        onThemeChange={setActiveSkyTheme}
      />

      <div className="app-container">
        {/* Top Editorial Navigation */}
        <header className="top-nav" role="banner">
          <div className="brand-meta">
            <h1 className="brand-title">Outlook</h1>
            <span className="brand-tagline">Daily Activity Forecast</span>
          </div>

          <div className="nav-actions">
            {/* Search with autocomplete suggestions */}
            <SearchBar onSelectCity={handleSelectCity} />

            <div className="nav-controls-group">
              {/* Geolocation Button */}
              <button
                type="button"
                className="location-btn"
                onClick={handleUseMyLocation}
                disabled={geoLoading}
                title="Use current GPS location"
                aria-label="Use current location"
              >
                <WeatherIcon name="location" size={15} />
                <span>{geoLoading ? 'Locating...' : 'Near Me'}</span>
              </button>

              {/* °C / °F Unit Switcher */}
              <button
                type="button"
                className="unit-toggle-btn"
                onClick={toggleUnit}
                aria-label={`Switch temperature unit to ${unit === 'C' ? 'Fahrenheit' : 'Celsius'}`}
                title="Toggle °C / °F"
              >
                <span className={unit === 'C' ? 'unit-active' : 'unit-inactive'}>°C</span>
                <span style={{ opacity: 0.3 }}>/</span>
                <span className={unit === 'F' ? 'unit-active' : 'unit-inactive'}>°F</span>
              </button>
            </div>
          </div>
        </header>

        {/* Location permission error banner if any */}
        {geoError && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface-card)',
              border: '1px solid var(--accent)',
              fontSize: '0.85rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
            role="status"
          >
            <span>{geoError}</span>
            <button type="button" onClick={clearGeoError} style={{ fontWeight: 600, padding: '2px 8px' }}>
              Dismiss
            </button>
          </div>
        )}

        {/* Recent Searches Quick-Strip */}
        {recentCities.length > 0 && (
          <nav className="recent-searches-bar" aria-label="Recent cities">
            <span className="recent-searches-label">Recent:</span>
            {recentCities.map((city, idx) => {
              const isActive =
                Math.abs(city.latitude - currentLocation.latitude) < 0.05 &&
                Math.abs(city.longitude - currentLocation.longitude) < 0.05;

              return (
                <button
                  key={`${city.name}-${idx}`}
                  type="button"
                  className="recent-chip"
                  style={{
                    borderColor: isActive ? 'var(--accent)' : 'var(--border)',
                    fontWeight: isActive ? 600 : 400
                  }}
                  onClick={() => handleSelectCity(city)}
                >
                  {city.name}
                </button>
              );
            })}
          </nav>
        )}

        {/* Main Content Area */}
        <main id="main-content">
          {loading && <Skeleton />}

          {!loading && error && (
            <ErrorState
              title="Unable to load forecast"
              message={error}
              onRetry={refetch}
              onSelectFallback={handleSelectCity}
            />
          )}

          {!loading && !error && weatherData && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
              {/* Asymmetric Hero Section */}
              <section className="hero-asymmetric" aria-label="Current conditions and verdict">
                <CurrentWeather
                  location={currentLocation}
                  current={currentObs}
                  daily={dailyObs}
                  unit={unit}
                  skyTheme={activeSkyTheme}
                />

                <Summary
                  current={currentObs}
                  hourly={hourlyObs}
                  unit={unit}
                  currentTimeStr={currentTimeStr}
                />
              </section>

              {/* Best Time To Go Out (Activity Planner) */}
              <BestTimeBar
                hourly={hourlyObs}
                currentTimeStr={currentTimeStr}
                unit={unit}
              />

              {/* 24-Hour Hourly Strip */}
              <HourlyStrip
                hourly={hourlyObs}
                currentTimeStr={currentTimeStr}
                unit={unit}
              />

              {/* Bottom Asymmetric Split: 7-Day Forecast + Atmospheric Metrics */}
              <section className="bottom-split" aria-label="Forecast and atmospheric metrics">
                <DailyForecast
                  daily={dailyObs}
                  unit={unit}
                />

                <AtmosphereDetails
                  current={currentObs}
                  daily={dailyObs}
                  unit={unit}
                />
              </section>
            </div>
          )}
        </main>

        {/* Editorial Footer */}
        <footer className="app-footer">
          <div>
            <strong>Outlook</strong> • Real-time meteorological data via Open-Meteo. No tracker cookies.
          </div>
          <div>
            Updated: {formatFullDate(currentTimeStr)}
          </div>
        </footer>
      </div>
    </>
  );
}
