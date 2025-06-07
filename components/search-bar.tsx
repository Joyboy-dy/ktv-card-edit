'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { TmdbMedia, TmdbSearchResponse } from '@/lib/tmdb-types';
import { X, Search } from 'lucide-react';
import Image from 'next/image';

interface SearchBarProps {
  onSearch: (item: TmdbMedia) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Array<TmdbMedia>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null); 
  const wrapperRef = useRef<HTMLDivElement>(null);

  const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;

  const fetchSuggestions = useCallback(async (query: string) => {
    if (!TMDB_API_KEY || !TMDB_BASE_URL) {
      console.error('TMDB API key or base URL is not defined.');
      return;
    }

    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${query}&language=fr-FR`
      );
      const data: TmdbSearchResponse = await response.json();
      const filteredResults = data.results.filter(
        (item: TmdbMedia) => item.media_type === 'movie' || item.media_type === 'tv'
      );
      setSuggestions(filteredResults);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [TMDB_API_KEY, TMDB_BASE_URL]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      debounceTimeoutRef.current = setTimeout(() => {
        fetchSuggestions(searchTerm);
      }, 500);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchTerm, fetchSuggestions]);

  // Keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCtrlK = event.ctrlKey && event.key === 'k';
      const isCmdK = isMac && event.metaKey && event.key === 'k';

      if (isCtrlK || isCmdK) {
        event.preventDefault(); // Prevent browser's default shortcut behavior
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const handleSearchSubmit = async (suggestion: TmdbMedia) => {
    if (!TMDB_API_KEY || !TMDB_BASE_URL) {
      console.error('TMDB API key or base URL is not defined.');
      return;
    }

    try {
      const mediaType = suggestion.media_type === 'movie' ? 'movie' : 'tv';
      const response = await fetch(
        `${TMDB_BASE_URL}/${mediaType}/${suggestion.id}?api_key=${TMDB_API_KEY}&language=fr-FR`
      );
      const fullDetails: TmdbMedia = await response.json();
      onSearch(fullDetails);
      setSearchTerm(fullDetails.title || fullDetails.name || '');
      setSuggestions([]);
      setShowSuggestions(false);
    } catch (error) {
      console.error('Error fetching full details:', error);
      onSearch(suggestion); // Fallback to partial data if full details fail
      setSearchTerm(suggestion.title || suggestion.name || '');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (suggestions.length > 0) {
        handleSearchSubmit(suggestions[0]);
      } else {
        return;
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }
  };

  const getPlatformKey = () => {
    if (typeof navigator === 'undefined') return 'Ctrl+K';
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    return isMac ? '⌘K' : 'Ctrl+K';
  };

  // Fermer la bulle de suggestions si on clique à l'extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSuggestions]);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={`Rechercher des films ou séries... (${getPlatformKey()})`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-10"
        />
        {searchTerm && (
          <X
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 cursor-pointer"
            onClick={handleClearSearch}
          />
        )}
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
          {suggestions.map((item) => {
            const mediaTitle = item.title || item.name;
            const releaseYear = (item.release_date || item.first_air_date)?.substring(0, 4);
            return (
              <li
                key={item.id}
                className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center"
                onClick={() => handleSearchSubmit(item)}
              >
                {item.poster_path && (
                  <Image
                    src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                    alt={mediaTitle || 'Poster'}
                    width={32}
                    height={48}
                    className="w-8 h-12 mr-2 object-cover rounded"
                  />
                )}
                <div>
                  <span className="font-medium">{mediaTitle}</span>
                  {releaseYear && <span className="text-gray-500 text-sm ml-2">({releaseYear})</span>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}