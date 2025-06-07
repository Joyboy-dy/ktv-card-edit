'use client';

import React, { createContext, useRef, useContext, MutableRefObject, ReactNode } from 'react';

interface CardRefContextType {
  cardRef: MutableRefObject<HTMLDivElement | null>;
}

const CardRefContext = createContext<CardRefContextType | undefined>(undefined);

export function CardRefProvider({ children }: { children: ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <CardRefContext.Provider value={{ cardRef }}>
      {children}
    </CardRefContext.Provider>
  );
}

export function useCardRef() {
  const context = useContext(CardRefContext);
  if (context === undefined) {
    throw new Error('useCardRef must be used within a CardRefProvider');
  }
  return context;
} 