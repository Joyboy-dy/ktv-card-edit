import React from 'react';
import Image from 'next/image';
import { useCardData } from '@/lib/card-data-context';

const CardPreview: React.FC = () => {
    const { cardData } = useCardData();

    const renderStars = (rating: number) => {
        // 5 étoiles, chaque étoile = 20 points
        const stars = [];
        for (let i = 0; i < 5; i++) {
            const starValue = Math.min(Math.max(rating - i * 20, 0), 20);
            const percent = (starValue / 20) * 100;
            stars.push(
                <svg key={i} className="w-10 h-10" viewBox="0 0 20 20" fill="none">
                    <defs>
                        <linearGradient id={`star-gradient-${i}`} x1="0" x2="20" y1="0" y2="0" gradientUnits="userSpaceOnUse">
                            <stop offset={`${percent}%`} stopColor="#D75252" />
                            <stop offset={`${percent}%`} stopColor="#e5e7eb" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        fill={`url(#star-gradient-${i})`}
                        stroke="#D75252"
                        strokeWidth="0.5"
                    />
                </svg>
            );
        }
        return stars;
    };

    const genresArray = cardData.genres ? cardData.genres.split(', ') : [];
    const platformsArray = cardData.platforms ? cardData.platforms.split(', ') : [];

    return (
        <div className="relative w-[1280px] h-[720px] overflow-hidden shadow-2xl">
            <div className="absolute inset-0 z-0">
                {cardData.backgroundImage ? (
                    <Image src={cardData.backgroundImage} alt="Arrière-plan flouté" fill className="w-full h-full object-cover scale-110 blur-xl" />
                ) : (
                    <Image src="https://i.pinimg.com/736x/f4/d4/5f/f4d45fa97cb72a5a979dbd99e49a8d56.jpg" alt="Arrière-plan flouté" fill className="w-full h-full object-cover scale-110 blur-xl" />
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-[#2a2731]/90 to-[#1e1c22]/95"></div>
            </div>

            <div className="relative z-10 grid h-full grid-cols-[7fr_5fr] gap-x-12">

                <div className="flex flex-col h-full py-16 pl-20 pr-4">

                    <div>
                        <div className="flex items-center gap-3">
                            {cardData.season && <span className="bg-[#B91C1C] text-white text-2xs font-semibold px-3 py-1 rounded-full">{cardData.season}</span>}
                            {cardData.releaseYear && <span className="bg-white/25 text-white text-2xs font-semibold px-3 py-1 rounded-full">{cardData.releaseYear}</span>}
                        </div>
                        <h1 className="text-6xl font-extrabold mt-5 tracking-tight text-white">{cardData.programName || "Titre non défini"}</h1>
                        <p className="text-3xl text-neutral-300 mt-3 pl-4 border-l-4 border-[#B91C1C]">{cardData.studio || "Studio de réalisation"}</p>
                        <div className="flex items-center gap-4 mt-8">
                            <div className="flex items-center">
                                {renderStars(cardData.rating)}
                            </div>
                            <span className="text-2xl font-semibold text-neutral-200">Recommandé à {cardData.rating}%</span>
                        </div>
                    </div>

                    <div className="flex-grow flex items-center">
                        <p className="text-neutral-300 text-lg leading-relaxed italic">
                            {cardData.synopsis || "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat quisquam dolore doloribus minus, quas fugiat minima, labore laboriosam nesciunt dolores numquam perspiciatis quidem eveniet enim suscipit cumque fuga, ducimus veritatis."}
                        </p>
                    </div>

                    <div>
                        <div className="flex items-center gap-3">
                            {genresArray.map((genre, index) => (
                                <span key={index} className="bg-white/10 text-neutral-300 text-2xs font-medium px-4 py-2 rounded-lg">{genre.trim()}</span>
                            ))}
                        </div>

                        <div className="flex items-center mt-6">
                            <svg className="w-5 h-5" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
                                <defs>
                                    <linearGradient id="a" x1="50%" x2="50%" y1="0%" y2="100%">
                                        <stop offset="0%" stopColor="#2AABEE" />
                                        <stop offset="100%" stopColor="#229ED9" />
                                    </linearGradient>
                                </defs>
                                <path fill="url(#a)" d="M128 0C94.06 0 61.48 13.494 37.5 37.49A128.038 128.038 0 0 0 0 128c0 33.934 13.5 66.514 37.5 90.51C61.48 242.506 94.06 256 128 256s66.52-13.494 90.5-37.49c24-23.996 37.5-56.576 37.5-90.51 0-33.934-13.5-66.514-37.5-90.51C194.52 13.494 161.94 0 128 0Z" />
                                <path fill="#FFF" d="M57.94 126.648c37.32-16.256 62.2-26.974 74.64-32.152 35.56-14.786 42.94-17.354 47.76-17.441 1.06-.017 3.42.245 4.96 1.49 1.28 1.05 1.64 2.47 1.82 3.467.16.996.38 3.266.2 5.038-1.92 20.24-10.26 69.356-14.5 92.026-1.78 9.592-5.32 12.808-8.74 13.122-7.44.684-13.08-4.912-20.28-9.63-11.26-7.386-17.62-11.982-28.56-19.188-12.64-8.328-4.44-12.906 2.76-20.386 1.88-1.958 34.64-31.748 35.26-34.45.08-.338.16-1.598-.6-2.262-.74-.666-1.84-.438-2.64-.258-1.14.256-19.12 12.152-54 35.686-5.1 3.508-9.72 5.218-13.88 5.128-4.56-.098-13.36-2.584-19.9-4.708-8-2.606-14.38-3.984-13.82-8.41.28-2.304 3.46-4.662 9.52-7.072Z" />
                            </svg>
                            <p className="ml-3 text-3xs font-bold text-neutral-400 tracking-wider">
                                @kakumeitv | @moviepaneljpm | @otakunewsgg | @animelisting_oc
                            </p>
                        </div>

                    </div>

                </div>
                <div className="flex flex-col items-center justify-center p-12 relative">
                    {cardData.promoImage ? (
                        <Image src={cardData.promoImage} alt="Affiche de l'anime" width={736} height={1104}
                            className="w-full h-auto rounded-2xl shadow-xl shadow-black/30 object-cover" />
                    ) : (
                        <Image src="https://i.pinimg.com/736x/2f/7a/a1/2f7aa1302944149ac8f55e40acf87108.jpg"
                            alt="Affiche de l'anime" width={736} height={1104}
                            className="w-full h-auto rounded-2xl shadow-xl shadow-black/30 object-cover" />
                    )}

                    {platformsArray.length > 0 && (
                        <p className="text-3xs font-bold text-neutral-400 mt-4 text-center tracking-wide">
                            {platformsArray.join(' | ')}
                        </p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default CardPreview;