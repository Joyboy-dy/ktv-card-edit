'use client';

import React from 'react';
import * as htmlToImage from 'html-to-image';
import { useCardRef } from '@/lib/card-ref-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, ImageIcon } from 'lucide-react';

export function DownloadButton() {
  const { cardRef } = useCardRef();

  const downloadPng = () => {
    if (cardRef.current) {
      const node = cardRef.current.firstElementChild;
      if (node instanceof HTMLElement) {
        htmlToImage.toPng(node, { quality: 1 })
          .then((dataUrl) => {
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'card-preview.png';
            link.click();
          })
          .catch((error) => {
            alert('Erreur lors de la génération du PNG : ' + error);
          });
      } else {
        alert('Impossible de trouver la carte à exporter.');
      }
    }
  };

  const downloadSvg = () => {
    if (cardRef.current) {
      const node = cardRef.current.firstElementChild;
      if (node instanceof HTMLElement) {
        htmlToImage.toSvg(node)
          .then((dataUrl) => {
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'card-preview.svg';
            link.click();
          })
          .catch((error) => {
            alert('Erreur lors de la génération du SVG : ' + error);
          });
      } else {
        alert('Impossible de trouver la carte à exporter.');
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Download className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Télécharger la carte</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={downloadPng} className="cursor-pointer">
          <ImageIcon className="mr-2 h-4 w-4" /> Télécharger en PNG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={downloadSvg} className="cursor-pointer">
          <FileText className="mr-2 h-4 w-4" /> Télécharger en SVG
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 