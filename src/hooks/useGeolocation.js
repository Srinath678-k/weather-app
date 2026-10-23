import { useState, useCallback } from 'react';

export function useGeolocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCurrentLocation = useCallback((onSuccess) => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        let placeName = 'My Location';
        let country = '';
        let admin1 = '';

        try {
          // Attempt reverse geocoding via free client endpoint
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          if (res.ok) {
            const geo = await res.json();
            placeName = geo.city || geo.locality || geo.principalSubdivision || 'My Location';
            country = geo.countryName || '';
            admin1 = geo.principalSubdivision || '';
          }
        } catch {
          // Fallback to coordinates label if reverse lookup encounters network block
          placeName = `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`;
        }

        const locationData = {
          name: placeName,
          country,
          admin1,
          latitude,
          longitude,
          timezone: 'auto'
        };

        setLoading(false);
        if (onSuccess) onSuccess(locationData);
      },
      (geoError) => {
        setLoading(false);
        let errorMsg = 'Could not access your location.';
        if (geoError.code === geoError.PERMISSION_DENIED) {
          errorMsg = 'Location permission was denied. You can search your city manually.';
        } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
          errorMsg = 'Location information is unavailable right now.';
        } else if (geoError.code === geoError.TIMEOUT) {
          errorMsg = 'Location request timed out. Please try again.';
        }
        setError(errorMsg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    getCurrentLocation,
    loading,
    error,
    clearError
  };
}
