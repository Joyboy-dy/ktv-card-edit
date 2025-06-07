'use client';

import { useEffect, useState } from 'react';

export default function MobileBlocker() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (!isMobile) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white text-center p-8">
            <h1 className="text-3xl font-bold mb-4">Accès non autorisé</h1>
            <p className="text-lg">L&apos;application n&apos;est pas accessible sur mobile ou tablette.<br />Merci d&apos;utiliser un ordinateur pour y accéder.</p>
        </div>
    );
} 