import { useState, useEffect, useCallback, useRef } from 'react';

export function useWeather(location, _unit = 'C') {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const fetchWeather = useCallback(async () => {
    if (!location || !location.latitude || !location.longitude) {
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);
    setData(null);

    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', location.latitude);
    url.searchParams.set('longitude', location.longitude);
    url.searchParams.set(
      'current',
      'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,uv_index,surface_pressure'
    );
    url.searchParams.set(
      'hourly',
      'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m,uv_index,is_day'
    );
    url.searchParams.set(
      'daily',
      'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,uv_index_max'
    );
    url.searchParams.set('temperature_unit', 'celsius');
    url.searchParams.set('wind_speed_unit', 'kmh');
    url.searchParams.set('precipitation_unit', 'mm');
    url.searchParams.set('timezone', 'auto');
    url.searchParams.set('forecast_days', '7');

    try {
      const response = await fetch(url.toString(), { signal: controller.signal });
      if (!response.ok) {
        throw new Error(`Weather service responded with status ${response.status}`);
      }
      const json = await response.json();
      setData(json);
      setError(null);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Unable to fetch weather data. Please check your network.');
        setData(null);
      }
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    fetchWeather();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchWeather]);

  return {
    data,
    loading,
    error,
    refetch: fetchWeather
  };
}
