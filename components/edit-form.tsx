'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SelectYear } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { TmdbMedia } from '@/lib/tmdb-types';
import { useCardData } from '@/lib/card-data-context';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface EditFormProps {
  initialData: TmdbMedia | null;
}

export function EditForm({ initialData }: EditFormProps) {
  const { cardData, setCardData } = useCardData();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const formatGenres = (genresString: string) => {
    let formatted = genresString.replace(/&/g, ', ');
    formatted = formatted.replace(/Science-Fiction/g, 'S-F');
    return formatted;
  };

  const handleSummarizeSynopsis = async () => {
    if (!cardData.synopsis) return;

    setIsLoading(true);
    setHasError(false);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Résumez le synopsis suivant si il est trop long (plus de 200 mots). Sinon, retournez le texte original.
      
      Synopsis: ${cardData.synopsis}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (text) {
        setCardData(prevData => ({ ...prevData, synopsis: text }));
      }
    } catch (error) {
      console.error("Erreur lors de la résumé du synopsis:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      // Année de sortie
      const year = initialData.release_date
        ? parseInt(initialData.release_date.substring(0, 4))
        : initialData.first_air_date
          ? parseInt(initialData.first_air_date.substring(0, 4))
          : null;

      // Date pour la saison
      const dateStr = initialData.release_date || initialData.first_air_date;
      let deducedSeason = '';
      if (dateStr) {
        const month = new Date(dateStr).getMonth() + 1;
        if (month >= 3 && month <= 5) {
          deducedSeason = 'Printemps';
        } else if (month >= 6 && month <= 8) {
          deducedSeason = 'Été';
        } else if (month >= 9 && month <= 11) {
          deducedSeason = 'Automne';
        } else {
          deducedSeason = 'Hiver';
        }
      }

      // Studio
      const studio = initialData.production_companies && initialData.production_companies.length > 0
        ? initialData.production_companies[0].name
        : '';

      // Plateformes (networks pour séries, production_companies pour films si pas de networks)
      let platforms = '';
      if (initialData.networks && initialData.networks.length > 0) {
        platforms = initialData.networks.map(n => n.name).join(', ');
      } else if (initialData.media_type === 'movie' && initialData.production_companies && initialData.production_companies.length > 0) {
        platforms = initialData.production_companies.map(n => n.name).join(', ');
      }

      setCardData(prevData => ({
        ...prevData,
        programName: initialData.title || initialData.name || '',
        synopsis: initialData.overview || '',
        promoImage: initialData.poster_path ? `https://image.tmdb.org/t/p/w500${initialData.poster_path}` : '',
        backgroundImage: initialData.backdrop_path ? `https://image.tmdb.org/t/p/original${initialData.backdrop_path}` : '',
        releaseYear: year,
        rating: initialData.vote_average ? Math.round(initialData.vote_average * 10) : 0,
        genres: initialData.genres ? formatGenres(initialData.genres.map(genre => genre.name).join(', ')) : '',
        studio,
        platforms,
        season: deducedSeason,
      }));
    }
  }, [initialData, setCardData]);

  const handleClear = () => {
    setCardData({
      season: '',
      releaseYear: null,
      programName: '',
      studio: '',
      platforms: '',
      rating: 0,
      synopsis: '',
      genres: '',
      promoImage: '',
      backgroundImage: '',
    });
  };

  // Pour désactiver toutes les suggestions du navigateur, il faut utiliser autoComplete="off" ET name="random" (ou un nom unique) sur chaque champ.
  // Pour les champs de type texte, email, url, etc., il faut aussi ajouter autoCorrect="off" et spellCheck={false} pour être exhaustif.

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold -mt-4 pb-4">Formulaire d&apos;édition</h2>

      <div className="flex space-x-4">
        <div className="flex-1">
          <Label htmlFor="season" className='mb-2'>Saison de sortie</Label>
          <Input
            id="season"
            name="season-random"
            type="text"
            placeholder='Automne'
            value={cardData.season}
            onChange={(e) => setCardData(prevData => ({ ...prevData, season: e.target.value }))}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="releaseYear" className='mb-2'>Année de sortie</Label>
          <SelectYear
            years={years}
            selectedYear={cardData.releaseYear}
            onSelectYear={(year) => setCardData(prevData => ({ ...prevData, releaseYear: year }))}
          />
        </div>
      </div>

      <div>
        <Input
          id="programName"
          name="programName-random"
          placeholder='Nom du programme'
          value={cardData.programName}
          onChange={(e) => setCardData(prevData => ({ ...prevData, programName: e.target.value }))}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>

      <div className="flex space-x-4">
        <div className="flex-1">
          <Label htmlFor="studio" className='mb-2'>Studio de réalisation</Label>
          <Input
            id="studio"
            name="studio-random"
            placeholder='MAPA Studio'
            value={cardData.studio}
            onChange={(e) => setCardData(prevData => ({ ...prevData, studio: e.target.value }))}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="platforms" className='mb-2'>Plateformes de diffusion</Label>
          <Input
            id="platforms"
            name="platforms-random"
            placeholder='Crunchyroll, Netflix'
            value={cardData.platforms}
            onChange={(e) => setCardData(prevData => ({ ...prevData, platforms: e.target.value }))}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="rating" className='mb-2'>Note/Score ({cardData.rating}%)</Label>
        <Input
          id="rating"
          name="rating-random"
          type="range"
          min="0"
          max="100"
          value={cardData.rating}
          onChange={(e) => setCardData(prevData => ({ ...prevData, rating: Number(e.target.value) }))}
          className="cursor-grab active:cursor-grabbing"
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <Label htmlFor="synopsis" className='mb-2'>Synopsis</Label>
        <Textarea
          id="synopsis"
          name="synopsis-random"
          value={cardData.synopsis}
          onChange={(e) => setCardData(prevData => ({ ...prevData, synopsis: e.target.value }))}
          rows={5}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <Button onClick={handleSummarizeSynopsis} disabled={isLoading || !cardData.synopsis} className={`w-full ${hasError ? 'animate-shake' : ''}`}>
          {isLoading ? 'Résumé...' : hasError ? 'Réessayer' : 'Résumer avec IA'}
        </Button>
      </div>

      <div>
        <Label htmlFor="genres" className='mb-2'>Genres et catégories</Label>
        <Input
          id="genres"
          name="genres-random"
          placeholder='Action, Aventure, Shonen'
          value={cardData.genres}
          onChange={(e) => setCardData(prevData => ({ ...prevData, genres: formatGenres(e.target.value) }))}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>

      <div>
        <Input
          id="promoImage"
          name="promoImage-random"
          placeholder='Image promotionnelle (URL)'
          value={cardData.promoImage}
          onChange={(e) => setCardData(prevData => ({ ...prevData, promoImage: e.target.value }))}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>

      <div>
        <Input
          id="backgroundImage"
          name="backgroundImage-random"
          placeholder="Image de fond de carte (URL)"
          value={cardData.backgroundImage}
          onChange={(e) => setCardData(prevData => ({ ...prevData, backgroundImage: e.target.value }))}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>

      <Button onClick={handleClear} className="w-full cursor-pointer">Nettoyer le formulaire</Button>
    </div>
  );
}