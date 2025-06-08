"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, Film, XCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { TmdbMedia, TmdbSearchResponse } from '@/lib/tmdb-types';

interface MovieSearchProps {
  onSearch: (item: TmdbMedia) => void;
}

export default function MovieSearch({ onSearch }: MovieSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [isMac, setIsMac] = useState(false)
  const [suggestions, setSuggestions] = useState<Array<TmdbMedia>>([])
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;

  // Detect user's operating system
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0)
  }, [])

  // Fetch suggestions from TMDB
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!TMDB_API_KEY || !TMDB_BASE_URL) return;
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${query}&language=fr-FR`
      );
      const data: TmdbSearchResponse = await response.json();
      const filteredResults = data.results.filter(
        (item: TmdbMedia) => item.media_type === 'movie' || item.media_type === 'tv'
      );
      setSuggestions(filteredResults.slice(0, 8));
    } catch {
      setSuggestions([]);
    }
  }, [TMDB_API_KEY, TMDB_BASE_URL]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current)
      debounceTimeoutRef.current = setTimeout(() => {
        fetchSuggestions(searchQuery)
      }, 500)
    } else {
      setSuggestions([])
    }
    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current)
    }
  }, [searchQuery, fetchSuggestions])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Handle selection
  const handleSelect = async (item: TmdbMedia) => {
    if (!TMDB_API_KEY || !TMDB_BASE_URL) return;
    try {
      const mediaType = item.media_type === 'movie' ? 'movie' : 'tv';
      const response = await fetch(
        `${TMDB_BASE_URL}/${mediaType}/${item.id}?api_key=${TMDB_API_KEY}&language=fr-FR`
      );
      const fullDetails: TmdbMedia = await response.json();
      onSearch(fullDetails);
      setSearchQuery(fullDetails.title || fullDetails.name || '');
      setIsFocused(false);
    } catch {
      onSearch(item);
      setSearchQuery(item.title || item.name || '');
      setIsFocused(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          ref={inputRef}
          id="search-input"
          type="text"
          placeholder="Rechercher des films ou séries"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="pl-10 pr-32 h-12 text-base"
          onKeyDown={e => {
            if (e.key === 'Enter' && suggestions.length > 0) handleSelect(suggestions[0]);
          }}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("")
              inputRef.current?.focus()
            }}
            className="absolute right-20 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-muted/80 transition-colors group cursor-pointer"
            aria-label="Effacer la recherche"
          >
            <XCircle className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
          </button>
        )}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-xs font-medium text-muted-foreground">
            {isMac ? "⌘" : "Ctrl"} K
          </kbd>
        </div>
      </div>
      {isFocused && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            <div className="divide-y">
              {suggestions.map((item) => {
                const mediaTitle = item.title || item.name;
                const releaseYear = (item.release_date || item.first_air_date)?.substring(0, 4);
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleSelect(item)}
                  >
                    <div className="flex-shrink-0">
                      {item.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                          alt={mediaTitle || 'Poster'}
                          width={40}
                          height={60}
                          className="w-10 h-15 object-cover rounded border"
                        />
                      ) : (
                        <Film className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm truncate">{mediaTitle}</h4>
                        {releaseYear && <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{releaseYear}</span>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{item.media_type === 'movie' ? 'Film' : 'Série'}</p>
                    </div>
                    <Film className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
      {isFocused && searchQuery.trim() && suggestions.length === 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50">
          <CardContent className="p-4 text-center text-muted-foreground">
            <Film className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucun résultat trouvé pour &quot;{searchQuery}&quot;</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
