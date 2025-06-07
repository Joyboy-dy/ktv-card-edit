'use client';

import { useState, useRef, useEffect } from 'react';
import { SearchBar } from '@/components/search-bar';
import { EditForm } from '@/components/edit-form';
import { TmdbMedia } from '@/lib/tmdb-types';
import CardPreview from '@/components/card-preview';
import { useCardRef } from '@/lib/card-ref-context';
import { CardDataProvider } from '@/lib/card-data-context';

export default function Home() {
  const [selectedMedia, setSelectedMedia] = useState<TmdbMedia | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const { cardRef } = useCardRef();

  const handleSearch = (item: TmdbMedia) => {
    console.log('Selected media:', item);
    setSelectedMedia(item);
  };

  useEffect(() => {
    const calculateScale = () => {
      if (previewRef.current) {
        const containerWidth = previewRef.current.clientWidth;
        const containerHeight = previewRef.current.clientHeight;

        const cardOriginalWidth = 1280;
        const cardOriginalHeight = 720;

        const scaleX = containerWidth / cardOriginalWidth;
        const scaleY = containerHeight / cardOriginalHeight;

        setScale(Math.min(scaleX, scaleY) * 0.8);
      }
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  return (
    <CardDataProvider>
      <div className="flex h-screen relative z-10">
        <div className="w-[35%] p-4 flex flex-col items-center justify-start gap-4 pt-8 overflow-y-auto">
          <SearchBar onSearch={handleSearch} />
          <div className="mt-8">
            <EditForm initialData={selectedMedia} />
          </div>
          {/* Contenu de la section gauche */}
        </div>
        <div className="border-l border-gray-300 dark:border-gray-700"></div>
        <div
          ref={previewRef}
          className="w-[70%] p-4 flex items-center justify-center overflow-hidden relative"
        >
          <div
            ref={cardRef}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) scale(${scale})`,
              transformOrigin: 'center center',
            }}
          >
            <CardPreview />
          </div>
        </div>
      </div>
    </CardDataProvider>
  );
}
