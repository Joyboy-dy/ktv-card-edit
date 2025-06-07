'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface CardData {
  season: string;
  releaseYear: number | null;
  programName: string;
  studio: string;
  platforms: string;
  rating: number;
  synopsis: string;
  genres: string;
  promoImage: string;
  backgroundImage: string;
}

const defaultCardData: CardData = {
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
};

interface CardDataContextType {
  cardData: CardData;
  setCardData: React.Dispatch<React.SetStateAction<CardData>>;
}

const CardDataContext = createContext<CardDataContextType | undefined>(undefined);

export function CardDataProvider({ children }: { children: ReactNode }) {
  const [cardData, setCardData] = useState<CardData>(defaultCardData);

  return (
    <CardDataContext.Provider value={{ cardData, setCardData }}>
      {children}
    </CardDataContext.Provider>
  );
}

export function useCardData() {
  const context = useContext(CardDataContext);
  if (context === undefined) {
    throw new Error('useCardData must be used within a CardDataProvider');
  }
  return context;
} 