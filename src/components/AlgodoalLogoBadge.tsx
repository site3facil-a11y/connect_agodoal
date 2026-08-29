import React from 'react';

interface AlgodoalLogoBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const AlgodoalLogoBadge: React.FC<AlgodoalLogoBadgeProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true
}) => {
  // Size configurations
  const config = {
    sm: {
      ilhaText: 'text-[9px]',
      tileSize: 'w-6 h-6 text-xs',
      garcaSize: 'w-4 h-4 -top-3.5 right-0',
      subtitle: 'text-[8px]',
      gap: 'gap-1',
      padding: 'p-2.5 rounded-2xl'
    },
    md: {
      ilhaText: 'text-[11px] sm:text-xs',
      tileSize: 'w-7 h-7 sm:w-9 sm:h-9 text-sm sm:text-lg',
      garcaSize: 'w-5 h-5 sm:w-6 sm:h-6 -top-4 sm:-top-5 right-0',
      subtitle: 'text-[10px] sm:text-xs',
      gap: 'gap-1 sm:gap-1.5',
      padding: 'p-3 sm:p-4 rounded-3xl'
    },
    lg: {
      ilhaText: 'text-sm font-black',
      tileSize: 'w-9 h-9 sm:w-12 sm:h-12 text-lg sm:text-2xl',
      garcaSize: 'w-6 h-6 sm:w-8 sm:h-8 -top-5 sm:-top-7 right-0.5',
      subtitle: 'text-xs sm:text-sm',
      gap: 'gap-1.5 sm:gap-2',
      padding: 'p-4 sm:p-6 rounded-3xl'
    }
  }[size];

  return (
    <div 
      className={`bg-[#062c43]/90 backdrop-blur-md border border-sky-400/30 text-white shadow-2xl inline-flex flex-col items-start ${config.padding} ${className}`}
    >
      {/* "ILHA DE" Label */}
      <span className={`font-black uppercase tracking-wider text-amber-400 font-heading mb-1 sm:mb-1.5 ${config.ilhaText}`}>
        ILHA DE
      </span>

      {/* Colorful Letter Tiles Row */}
      <div className={`flex items-center ${config.gap}`}>
        
        {/* A - Red / Pink Coral */}
        <div className={`${config.tileSize} rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#ff3366] to-[#e60049] flex items-center justify-center font-black text-white shadow-md font-heading select-none transform hover:scale-105 transition`}>
          A
        </div>

        {/* L - Sky Blue / Azure */}
        <div className={`${config.tileSize} rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#00b4d8] to-[#0077b6] flex items-center justify-center font-black text-white shadow-md font-heading select-none transform hover:scale-105 transition`}>
          L
        </div>

        {/* G - Emerald Green */}
        <div className={`${config.tileSize} rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#10b981] to-[#059669] flex items-center justify-center font-black text-white shadow-md font-heading select-none transform hover:scale-105 transition`}>
          G
        </div>

        {/* O - Royal / Indigo Blue */}
        <div className={`${config.tileSize} rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#4361ee] to-[#3a0ca3] flex items-center justify-center font-black text-white shadow-md font-heading select-none transform hover:scale-105 transition`}>
          O
        </div>

        {/* D - Amber Orange with WHITE GARÇA (HERON) on top */}
        <div className={`relative ${config.tileSize} rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#fbbf24] to-[#f59e0b] flex items-center justify-center font-black text-[#0b132b] shadow-md font-heading select-none transform hover:scale-105 transition`}>
          
          {/* Garça-Branca (White Heron) perched on top of letter D */}
          <div 
            className={`absolute ${config.garcaSize} pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] z-20 flex items-center justify-center`}
            title="Garça-branca da Ilha de Algodoal"
          >
            <svg 
              viewBox="0 0 40 45" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full filter drop-shadow-xs"
            >
              {/* Garça Legs (thin elegant black/dark legs standing) */}
              <path d="M19 32L19 43M19 43L16 44M19 43L22 44" stroke="#1e293b" strokeWidth="1.6" strokeLinecap="round"/>
              <path d="M24 33L24 43M24 43L21 44M24 43L27 44" stroke="#1e293b" strokeWidth="1.6" strokeLinecap="round"/>
              
              {/* Garça-Branca Body (Pure White) */}
              <path 
                d="M13 24C13 18 19 17 26 21C30 23 31 27 29 31C27 34 21 34 16 32C13.5 30.5 13 27 13 24Z" 
                fill="#FFFFFF" 
                stroke="#e2e8f0" 
                strokeWidth="0.8"
              />
              
              {/* Garça Wing Feathers (Subtle shading) */}
              <path 
                d="M15 25C18 24 24 25 28 29C25 31 18 31 15 28Z" 
                fill="#f8fafc" 
                stroke="#cbd5e1" 
                strokeWidth="0.6"
              />
              
              {/* S-shaped Long Neck (White) */}
              <path 
                d="M26 21C26 15 31 12 28 6C27 4.5 25 4 23 4.5" 
                stroke="#FFFFFF" 
                strokeWidth="3.2" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path 
                d="M26 21C26 15 31 12 28 6C27 4.5 25 4 23 4.5" 
                stroke="#e2e8f0" 
                strokeWidth="0.8" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Garça Head (White) */}
              <circle cx="23" cy="5" r="3.2" fill="#FFFFFF" stroke="#e2e8f0" strokeWidth="0.6"/>
              
              {/* Eye (Tiny Dark Dot) */}
              <circle cx="22" cy="4.5" r="0.7" fill="#0f172a"/>
              
              {/* Beak (Pointed Golden Yellow typical of Garça-Branca-Grande / Ardea alba) */}
              <path 
                d="M20 5.2L11 6.5L20 4.2Z" 
                fill="#FBBF24" 
                stroke="#D97706" 
                strokeWidth="0.5" 
                strokeLinejoin="round"
              />
              
              {/* Crest / Plume subtle feather (White) */}
              <path 
                d="M25 3.5C28 2 30 3 32 4.5" 
                stroke="#FFFFFF" 
                strokeWidth="1" 
                strokeLinecap="round"
              />
            </svg>
          </div>

          D
        </div>

        {/* O - Magenta / Pink */}
        <div className={`${config.tileSize} rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#f72585] to-[#b5179e] flex items-center justify-center font-black text-white shadow-md font-heading select-none transform hover:scale-105 transition`}>
          O
        </div>

        {/* A - Teal / Emerald */}
        <div className={`${config.tileSize} rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#06d6a0] to-[#059669] flex items-center justify-center font-black text-white shadow-md font-heading select-none transform hover:scale-105 transition`}>
          A
        </div>

        {/* L - Orange / Tangerine */}
        <div className={`${config.tileSize} rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#f77f00] to-[#d62828] flex items-center justify-center font-black text-white shadow-md font-heading select-none transform hover:scale-105 transition`}>
          L
        </div>

      </div>

      {/* Subtitle */}
      {showSubtitle && (
        <div className={`mt-2 font-bold text-sky-100 font-sans tracking-wide flex items-center gap-1.5 ${config.subtitle}`}>
          <span>APA Estadual de Algodoal e Maiandeua</span>
        </div>
      )}
    </div>
  );
};
