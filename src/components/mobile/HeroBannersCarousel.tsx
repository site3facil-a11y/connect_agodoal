import React, { useState, useEffect } from 'react';
import { Advertisement } from '../../types/index.ts';
import { MessageCircle, MapPin, Tag, ChevronLeft, ChevronRight, Sparkles, ExternalLink } from 'lucide-react';

interface HeroBannersCarouselProps {
  advertisements: Advertisement[];
  onAdClick?: (ad: Advertisement) => void;
}

const DEFAULT_BANNER_FALLBACKS = [
  {
    id: 'banner-default-1',
    title: 'Associação de Charreteiros #14',
    business_name: 'Charrete do Seu Raimundo',
    tagline: 'Transporte Oficial Credenciado no Porto de Algodoal',
    description: 'Bagagens e passageiros do Porto até a Praia da Princesa com segurança e pontualidade.',
    image_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    whatsapp: '5591981234567',
    location: 'Porto de Algodoal',
    price_starting: 35.00,
    badge: 'Credenciado APA',
    banner_slot: 'banner_1' as const,
    category: 'transporte' as const,
    is_active: true,
    is_highlighted: true,
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    views_count: 1420,
    clicks_count: 310,
    created_at: '2026-01-01',
    updated_at: '2026-01-01'
  },
  {
    id: 'banner-default-2',
    title: 'Restaurante & Bar Peixada da Ilha',
    business_name: 'Peixada do Pescador',
    tagline: 'A Melhor Caldeirada com Jambu & Peixe Fresco',
    description: 'Barraca rústica pé na areia com peixe frito, camarão regional e açaí paraense legítimo.',
    image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    whatsapp: '5591981234567',
    location: 'Praia da Princesa',
    price_starting: 75.00,
    badge: 'Top Escolha',
    banner_slot: 'banner_2' as const,
    category: 'alimentacao' as const,
    is_active: true,
    is_highlighted: true,
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    views_count: 980,
    clicks_count: 215,
    created_at: '2026-01-01',
    updated_at: '2026-01-01'
  },
  {
    id: 'banner-default-3',
    title: 'Depósito de Gelo & Água Mineral Princesa',
    business_name: 'Disk Gelo & Água 20L',
    tagline: 'Entrega Rápida Direto na Sua Barraca ou Pousada',
    description: 'Gelo filtrado em cubos e galões de água mineral 20L entregues de charrete express.',
    image_url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=800&auto=format&fit=crop&q=80',
    whatsapp: '5591981234567',
    location: 'Vila de Algodoal',
    price_starting: 18.00,
    badge: 'Entrega Rápida',
    banner_slot: 'banner_3' as const,
    category: 'compras' as const,
    is_active: true,
    is_highlighted: true,
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    views_count: 1120,
    clicks_count: 270,
    created_at: '2026-01-01',
    updated_at: '2026-01-01'
  },
  {
    id: 'banner-default-4',
    title: 'Passeio de Rabeta Furo Velho & Lago',
    business_name: 'Rabetas Ecológicas Algodoal',
    tagline: 'Travessias Seguras para Fortalezinha e Mangues',
    description: 'Barcos rabetas com coletes salva-vidas e marinheiros experientes nas marés da ilha.',
    image_url: '/assets/images/rabeta_barco_mar_1787985502030.jpg',
    whatsapp: '5591981234567',
    location: 'Praia do Porto',
    price_starting: 25.00,
    badge: 'Ecoturismo',
    banner_slot: 'banner_4' as const,
    category: 'passeios' as const,
    is_active: true,
    is_highlighted: true,
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    views_count: 890,
    clicks_count: 190,
    created_at: '2026-01-01',
    updated_at: '2026-01-01'
  }
];

export const HeroBannersCarousel: React.FC<HeroBannersCarouselProps> = ({
  advertisements,
  onAdClick
}) => {
  const activeBanners = (advertisements && advertisements.length > 0)
    ? advertisements.filter(a => a.is_active)
    : DEFAULT_BANNER_FALLBACKS;

  const displayList = activeBanners.length > 0 ? activeBanners : DEFAULT_BANNER_FALLBACKS;

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (displayList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayList.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [displayList.length]);

  const current = displayList[currentIndex] || displayList[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayList.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + displayList.length) % displayList.length);
  };

  const handleBannerClick = () => {
    if (onAdClick && current) {
      onAdClick(current);
    }
  };

  return (
    <section className="px-4 py-3 bg-slate-950">
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-teal-500/30 bg-slate-900 group">
        {/* Banner Image with subtle zoom */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden">
          <img
            src={current.image_url || '/assets/images/rabeta_barco_mar_1787985502030.jpg'}
            alt={current.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/images/rabeta_barco_mar_1787985502030.jpg';
            }}
          />
          {/* Multi-tone Gradient overlay for maximum readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            {current.badge && (
              <span className="px-2.5 py-1 rounded-xl bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {current.badge}
              </span>
            )}
            <span className="px-2 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-teal-300 font-bold text-[10px] uppercase tracking-wider border border-teal-500/30">
              {current.category}
            </span>
          </div>

          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-black/60 text-slate-300 backdrop-blur-xs">
            {currentIndex + 1} / {displayList.length}
          </span>
        </div>

        {/* Banner Content (Bottom overlay) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10 space-y-2">
          <div>
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wide block line-clamp-1">
              {current.business_name || 'Comércio em Destaque'}
            </span>
            <h3 className="text-base sm:text-lg font-black text-white font-heading leading-tight line-clamp-1">
              {current.title}
            </h3>
            <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
              {current.tagline || current.description}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-700/50">
            <div className="flex items-center gap-1 text-slate-300 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span className="truncate max-w-[130px] sm:max-w-[200px]">{current.location || 'Ilha de Algodoal'}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {current.whatsapp ? (
                <a
                  href={`https://wa.me/${current.whatsapp.replace(/\D/g, '')}?text=Olá! Vi o anúncio de ${encodeURIComponent(current.title)} no Algodoal Connect.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleBannerClick}
                  className="py-1.5 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg transition"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chamar</span>
                </a>
              ) : (
                <button
                  onClick={handleBannerClick}
                  className="py-1.5 px-3 rounded-xl bg-teal-500 text-slate-950 font-black text-xs"
                >
                  Ver Detalhes
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Carousel Arrow Controls */}
        {displayList.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-xs opacity-70 group-hover:opacity-100 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Próximo"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-xs opacity-70 group-hover:opacity-100 transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Slide Indicator Dots */}
      {displayList.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-2">
          {displayList.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-5 bg-teal-400' : 'w-1.5 bg-slate-700'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
