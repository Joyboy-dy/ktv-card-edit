export interface TmdbMedia {
  id: number;
  title?: string;
  name?: string;
  media_type: 'movie' | 'tv' | 'person';
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  overview?: string;
  vote_average?: number;
  vote_count?: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  production_companies?: { id: number; name: string; logo_path: string | null; origin_country: string }[];
  networks?: { id: number; name: string; logo_path: string | null; origin_country: string }[];
  spoken_languages?: { english_name: string; iso_639_1: string; name: string }[];
  watch_providers?: WatchProviders;
}

export interface TmdbSearchResponse {
  page: number;
  results: TmdbMedia[];
  total_pages: number;
  total_results: number;
}

export interface WatchProviders {
  id: number;
  results: {
    [countryCode: string]: {
      link: string;
      flatrate?: Array<{
        display_priority: number;
        logo_path: string;
        provider_id: number;
        provider_name: string;
      }>;
      rent?: Array<{
        display_priority: number;
        logo_path: string;
        provider_id: number;
        provider_name: string;
      }>;
      buy?: Array<{
        display_priority: number;
        logo_path: string;
        provider_id: number;
        provider_name: string;
      }>;
    };
  };
}