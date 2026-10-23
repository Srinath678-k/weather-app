import React, { useState, useEffect, useRef, useCallback } from 'react';
import { WeatherIcon } from './WeatherIcon';

export function SearchBar({ onSelectCity }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchGeocoding = useCallback(async (searchTerm) => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        searchTerm.trim()
      )}&count=5&language=en&format=json`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const results = data.results || [];
        setSuggestions(results);
        setIsOpen(results.length > 0);
        setSelectedIndex(-1);
      }
    } catch (err) {
      console.warn('Geocoding search failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      searchGeocoding(val);
    }, 280);
  };

  const handleSelect = (item) => {
    const selectedLocation = {
      name: item.name,
      country: item.country || '',
      admin1: item.admin1 || '',
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone || 'auto'
    };
    onSelectCity(selectedLocation);
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelect(suggestions[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div className="search-wrapper" ref={wrapperRef}>
      <div className="search-input-box">
        <WeatherIcon name="search" size={17} color="var(--text-secondary)" />
        <input
          type="text"
          className="search-input"
          placeholder="Search city or region..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          aria-label="Search city"
          aria-autocomplete="list"
          aria-expanded={isOpen}
        />
        {loading ? (
          <span className="search-loading-indicator" aria-label="Searching..." />
        ) : query ? (
          <button
            type="button"
            className="search-clear-btn"
            onClick={handleClear}
            aria-label="Clear search query"
          >
            <WeatherIcon name="cross" size={14} />
          </button>
        ) : null}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className="search-suggestions-dropdown" role="listbox">
          {suggestions.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            const regionDetails = [item.admin1, item.country].filter(Boolean).join(', ');

            return (
              <li
                key={`${item.id}-${idx}`}
                className={`suggestion-item ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(item)}
                role="option"
                aria-selected={isSelected}
              >
                <span className="suggestion-name">{item.name}</span>
                {regionDetails && <span className="suggestion-country">{regionDetails}</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
