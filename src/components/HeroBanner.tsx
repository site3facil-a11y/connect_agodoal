import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Car, 
  Sailboat, 
  ShoppingBag, 
  Utensils, 
  MapPin, 
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  Sun,
  Waves,
  Compass,
  PhoneCall,
  CheckCircle2,
  Hotel,
  PartyPopper,
  Pause,
  Play,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { ServiceCategory, Advertisement } from '../types/index.ts';
import { api } from '../services/api.ts';
import { AlgodoalLogoBadge } from './AlgodoalLogoBadge.tsx';

interface HeroBannerProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSelectCategory: (cat: ServiceCategory) => void;
  onQuickCallCart: () => void;
  advertisements?: Advertisement[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchTerm,
  onSearchChange,
  onSelectCategory,
  onQuickCallCart,
  advertisements = []
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Find custom ads assigned to banner slots by admin
  const ad1 = advertisements.find(a => a.banner_slot === 'banner_1' && a.is_active);
  const ad2 = advertisements.find(a => a.banner_slot === 'banner_2' && a.is_active);
  const ad3 = advertisements.find(a => a.banner_slot === 'banner_3' && a.is_active);
  const ad4 = advertisements.find(a => a.banner_slot === 'banner_4' && a.is_active);

  // Define the comprehensive slide lineup
  const slides = [
    {
      id: 'slide-oficial',
      slot: 'oficial',
      category: 'transporte' as ServiceCategory,
      badgeText: 'APA Estadual de Algodoal e Maiandeua',
      badgeColor: 'bg-amber-400 text-slate-950',
      titleHighlight: 'ALGODOAL',
      titleSuffix: 'CONNECT',
      subtitle: 'O guia completo e catálogo oficial de serviços, charretes, rabetas, pousadas e culinária da Ilha de Algodoal.',
      bgGradient: 'from-[#024976] via-[#075985] to-[#0c4a6e]',
      borderColor: 'border-sky-300/60',
      tagColor: 'text-amber-400',
      accentColor: '#0284c7',
      bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80',
      ctaPrimary: 'Explorar Serviços da Ilha',
      ctaPrimaryAction: () => onSelectCategory('transporte'),
      ctaSecondary: 'Tábua de Marés & Barcos',
      ctaSecondaryAction: () => onSelectCategory('informacoes'),
      priceTag: 'Guia Gratuito Oficial',
      showCategories: true,
      showSearch: true,
    },
    {
      id: 'slide-transporte',
      slot: 'banner_1',
      adRef: ad1,
      category: 'transporte' as ServiceCategory,
      badgeText: 'TRANSPORTE OFICIAL NO PORTO',
      badgeColor: 'bg-amber-400 text-amber-950 font-black',
      titleHighlight: ad1?.title || 'CHARRETES',
      titleSuffix: 'CREDENCIADAS',
      subtitle: ad1?.tagline || ad1?.description || 'Desembarque com tranquilidade e transporte sua bagagem até sua pousada ou praia com preço tabelado e condutores credenciados.',
      businessName: ad1?.business_name || 'Associação dos Condutores de Charrete de Maiandeua',
      bgGradient: 'from-[#0f766e] via-[#008080] to-[#042f2e]',
      borderColor: 'border-amber-400',
      tagColor: 'text-amber-300',
      accentColor: '#f59e0b',
      bgImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600&auto=format&fit=crop&q=80',
      ctaPrimary: 'Chamar Charrete no Porto',
      ctaPrimaryAction: () => {
        if (ad1?.id) api.recordAdMetric(ad1.id, 'click');
        onQuickCallCart();
      },
      ctaSecondary: 'Ver Tabela de Rotas & Preços',
      ctaSecondaryAction: () => {
        if (ad1?.id) api.recordAdMetric(ad1.id, 'click');
        onSelectCategory('transporte');
      },
      priceTag: ad1?.price_starting ? `A partir de R$ ${ad1.price_starting.toFixed(2)}` : 'Preço tabelado a partir de R$ 30,00',
      showCategories: false,
      showSearch: true,
    },
    {
      id: 'slide-alimentacao',
      slot: 'banner_2',
      adRef: ad2,
      category: 'alimentacao' as ServiceCategory,
      badgeText: 'CULINÁRIA TÍPICA DA ILHA',
      badgeColor: 'bg-rose-400 text-rose-950 font-black',
      titleHighlight: ad2?.title || 'PEIXADAS &',
      titleSuffix: 'CALDEIRADAS',
      subtitle: ad2?.tagline || ad2?.description || 'O melhor peixe frito com açaí artesanal, caldeirada com jambu e tucupi e caranguejada fresca nos quiosques das praias e restaurantes da vila.',
      businessName: ad2?.business_name || 'Restaurantes, Quiosques & Barracas de Praia',
      bgGradient: 'from-[#881337] via-[#9f1239] to-[#4c0519]',
      borderColor: 'border-rose-400',
      tagColor: 'text-amber-300',
      accentColor: '#e11d48',
      bgImage: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=1600&auto=format&fit=crop&q=80',
      ctaPrimary: 'Ver Cardápios & Quiosques',
      ctaPrimaryAction: () => {
        if (ad2?.id) api.recordAdMetric(ad2.id, 'click');
        onSelectCategory('alimentacao');
      },
      ctaSecondary: 'Pratos com Jambu & Peixe Frito',
      ctaSecondaryAction: () => {
        if (ad2?.id) api.recordAdMetric(ad2.id, 'click');
        onSelectCategory('alimentacao');
      },
      priceTag: ad2?.badge || 'Pratos a partir de R$ 35,00',
      showCategories: false,
      showSearch: true,
    },
    {
      id: 'slide-compras',
      slot: 'banner_3',
      adRef: ad3,
      category: 'compras' as ServiceCategory,
      badgeText: 'ENTREGA RÁPIDA NA POUSADA',
      badgeColor: 'bg-lime-400 text-lime-950 font-black',
      titleHighlight: ad3?.title || 'ÁGUA 20L &',
      titleSuffix: 'GELO FILTRADO',
      subtitle: ad3?.tagline || ad3?.description || 'Garrafões de água mineral 20L, sacos de gelo filtrado, bebidas geladas, carvão e mercearia entregues onde você estiver hospedado.',
      businessName: ad3?.business_name || 'Depósito de Água Mineral, Gelo & Mercearias',
      bgGradient: 'from-[#365314] via-[#4d7c0f] to-[#142602]',
      borderColor: 'border-lime-400',
      tagColor: 'text-lime-300',
      accentColor: '#84cc16',
      bgImage: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=1600&auto=format&fit=crop&q=80',
      ctaPrimary: 'Pedir Água & Gelo no WhatsApp',
      ctaPrimaryAction: () => {
        if (ad3?.id) api.recordAdMetric(ad3.id, 'click');
        onSelectCategory('compras');
      },
      ctaSecondary: 'Ver Itens de Conveniência',
      ctaSecondaryAction: () => {
        if (ad3?.id) api.recordAdMetric(ad3.id, 'click');
        onSelectCategory('compras');
      },
      priceTag: ad3?.price_starting ? `Garrafão: R$ ${ad3.price_starting.toFixed(2)}` : 'Garrafão 20L: R$ 14,00 | Gelo: R$ 10,00',
      showCategories: false,
      showSearch: true,
    },
    {
      id: 'slide-passeios',
      slot: 'banner_4',
      adRef: ad4,
      category: 'passeios' as ServiceCategory,
      badgeText: 'ECOTURISMO & NAVEGAÇÃO',
      badgeColor: 'bg-sky-400 text-sky-950 font-black',
      titleHighlight: ad4?.title || 'PASSEIOS DE',
      titleSuffix: 'RABETA & LAGO',
      subtitle: ad4?.tagline || ad4?.description || 'Navegue pelo Furo Velho, visite o místico Lago da Princesa, dunas douradas, manguezais preservados, Ilha da Pedra Mole e Fortalezinha.',
      businessName: ad4?.business_name || 'Condutores Náuticos & Roteiros de Rabeta',
      bgGradient: 'from-[#0369a1] via-[#0284c7] to-[#082f49]',
      borderColor: 'border-sky-400',
      tagColor: 'text-amber-300',
      accentColor: '#0ea5e9',
      bgImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=80',
      ctaPrimary: 'Agendar Passeio de Rabeta',
      ctaPrimaryAction: () => {
        if (ad4?.id) api.recordAdMetric(ad4.id, 'click');
        onSelectCategory('passeios');
      },
      ctaSecondary: 'Ver Todos os Roteiros',
      ctaSecondaryAction: () => {
        if (ad4?.id) api.recordAdMetric(ad4.id, 'click');
        onSelectCategory('passeios');
      },
      priceTag: ad4?.price_starting ? `A partir de R$ ${ad4.price_starting.toFixed(2)}` : 'Roteiros a partir de R$ 25,00 por pessoa',
      showCategories: false,
      showSearch: true,
    },
    {
      id: 'slide-pousadas',
      slot: 'pousadas',
      category: 'pousadas' as ServiceCategory,
      badgeText: 'HOSPEDAGEM NA ILHA',
      badgeColor: 'bg-teal-300 text-teal-950 font-black',
      titleHighlight: 'POUSADAS &',
      titleSuffix: 'CHALÉS RÚSTICOS',
      subtitle: 'Encontre pousadas aconchegantes com café da manhã regional, chalés beira-mar e quartos confortáveis na Vila e Praia da Princesa.',
      businessName: 'Guia de Pousadas & Chalés em Algodoal',
      bgGradient: 'from-[#115e59] via-[#0d9488] to-[#134e4a]',
      borderColor: 'border-teal-400',
      tagColor: 'text-amber-300',
      accentColor: '#14b8a6',
      bgImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&auto=format&fit=crop&q=80',
      ctaPrimary: 'Ver Pousadas Disponíveis',
      ctaPrimaryAction: () => onSelectCategory('pousadas'),
      ctaSecondary: 'Falar Direto no WhatsApp',
      ctaSecondaryAction: () => onSelectCategory('pousadas'),
      priceTag: 'Diárias a partir de R$ 120,00',
      showCategories: false,
      showSearch: true,
    }
  ];

  // Auto-play interval
  useEffect(() => {
    if (!isPaused) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
      }, 5500);
    }

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, slides.length]);

  const activeSlide = slides[currentSlide];

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  const handleSelectSlide = (index: number) => {
    setCurrentSlide(index);
    const slide = slides[index];
    if (slide?.adRef?.id) {
      api.recordAdMetric(slide.adRef.id, 'impression');
    }
  };

  return (
    <div 
      className="bg-[#f8fafc] py-4 sm:py-6 border-b border-slate-200"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Top Control Strip */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-black text-slate-800 uppercase tracking-wider text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Destaques & Catálogo da Ilha
            </span>
            <span className="text-[10px] text-slate-400 hidden sm:inline">
              (Clique nos banners laterais para alternar o destaque principal)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Auto play toggle */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition cursor-pointer"
              title={isPaused ? "Retomar rotação automática" : "Pausar rotação automática"}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-600" /> : <Pause className="w-3.5 h-3.5" />}
            </button>

            {/* Slide arrows */}
            <button
              onClick={handlePrevSlide}
              className="p-1 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 shadow-2xs transition cursor-pointer"
              title="Destaque anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextSlide}
              className="p-1 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 shadow-2xs transition cursor-pointer"
              title="Próximo destaque"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Grid: Left Dynamic Showcase Banner + Right Interactive Switcher Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-stretch">
          
          {/* ========================================================= */}
          {/* LEFT SIDE: DYNAMIC MAIN HERO BANNER (TRANSFORMS BY SLIDE) */}
          {/* ========================================================= */}
          <div 
            className={`lg:col-span-8 relative rounded-3xl overflow-hidden shadow-xl border-2 ${activeSlide.borderColor} bg-gradient-to-br ${activeSlide.bgGradient} min-h-[460px] sm:min-h-[510px] flex flex-col justify-between text-white p-5 sm:p-8 transition-all duration-500`}
          >
            
            {/* Background Tropical Landscape */}
            <div 
              className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-25 pointer-events-none transition-all duration-700 transform scale-105"
              style={{ backgroundImage: `url('${activeSlide.bgImage}')` }}
            />
            
            {/* Sun & Sea Graphic Curves in Background */}
            <div className="absolute top-4 right-1/4 sm:right-1/3 pointer-events-none opacity-80">
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-t from-amber-500 via-amber-400 to-yellow-300 shadow-[0_0_50px_rgba(251,191,36,0.5)]"></div>
                <div className="absolute bottom-1 -left-4 right-0 h-8 flex items-center gap-1 opacity-90">
                  <svg viewBox="0 0 100 25" className="w-28 text-white/40 fill-current">
                    <path d="M0 10 Q 25 0, 50 10 T 100 10 L 100 25 L 0 25 Z" opacity="0.7"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Top Bar inside banner: Badge + Slide Indicators */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${activeSlide.badgeColor} text-xs font-black uppercase tracking-wider shadow-md`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{activeSlide.badgeText}</span>
                </div>

                {activeSlide.businessName && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold border border-white/30">
                    <CheckCircle2 className="w-3 h-3 text-amber-300" />
                    {activeSlide.businessName}
                  </span>
                )}
              </div>

              {/* Official Island Block Badge */}
              <div className="shrink-0 hidden sm:block">
                <AlgodoalLogoBadge size="sm" />
              </div>
            </div>

            {/* Middle Section: Big Dynamic Typography & Description */}
            <div className="relative z-10 my-4 space-y-2 max-w-2xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-heading leading-tight drop-shadow-md">
                {activeSlide.titleHighlight} <span className={activeSlide.tagColor}>{activeSlide.titleSuffix}</span>
              </h1>
              
              <p className="text-xs sm:text-sm font-bold text-sky-50 leading-relaxed drop-shadow-xs max-w-xl">
                {activeSlide.subtitle}
              </p>

              {/* Price / Highlight badge */}
              <div className="pt-1 flex items-center gap-2">
                <span className="inline-block px-3 py-1 rounded-xl bg-slate-950/50 backdrop-blur-md text-amber-300 font-extrabold text-xs sm:text-sm border border-amber-300/40 shadow-xs">
                  💰 {activeSlide.priceTag}
                </span>
              </div>
            </div>

            {/* Dynamic Search Bar */}
            <div className="relative z-10 my-2 max-w-xl">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar charrete, rabeta, pousada, peixada, água 20L..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 rounded-2xl text-xs sm:text-sm font-semibold shadow-lg focus:outline-hidden focus:ring-3 focus:ring-amber-400 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Bottom Controls / Actions */}
            <div className="relative z-10 pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              
              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  id="btn-hero-primary-action"
                  onClick={activeSlide.ctaPrimaryAction}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm transition transform active:scale-95 shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>{activeSlide.ctaPrimary}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="btn-hero-secondary-action"
                  onClick={activeSlide.ctaSecondaryAction}
                  className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-xs sm:text-sm border border-white/30 transition transform active:scale-95 cursor-pointer"
                >
                  {activeSlide.ctaSecondary}
                </button>
              </div>

              {/* Carousel Dot Indicators */}
              <div className="flex items-center gap-1.5 self-center sm:self-auto bg-slate-950/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectSlide(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentSlide === idx 
                        ? 'w-6 bg-amber-400' 
                        : 'w-2 bg-white/50 hover:bg-white/80'
                    }`}
                    title={`Ver slide ${idx + 1}`}
                  />
                ))}
              </div>

            </div>

            {/* Native Category Quick Selectors if on official slide */}
            {activeSlide.showCategories && (
              <div className="relative z-10 grid grid-cols-2 sm:grid-cols-5 gap-2 pt-3 mt-2 border-t border-white/15">
                <button
                  id="btn-hero-cat-transporte"
                  onClick={() => handleSelectSlide(1)}
                  className="bg-[#008080] hover:bg-[#006666] p-2.5 rounded-xl text-left text-white transition transform active:scale-95 shadow-md flex flex-col justify-between h-20 border border-teal-300/30 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase text-teal-200">#01</span>
                    <Car className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                  <div>
                    <div className="font-black text-xs leading-tight">TRANSPORTE</div>
                    <div className="text-[9px] text-teal-100">Charretes no Porto</div>
                  </div>
                </button>

                <button
                  id="btn-hero-cat-pousadas"
                  onClick={() => handleSelectSlide(5)}
                  className="bg-[#0d9488] hover:bg-[#0f766e] p-2.5 rounded-xl text-left text-white transition transform active:scale-95 shadow-md flex flex-col justify-between h-20 border border-teal-400/30 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase text-teal-200">#02</span>
                    <Hotel className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                  <div>
                    <div className="font-black text-xs leading-tight">POUSADAS</div>
                    <div className="text-[9px] text-teal-100">Chalés na Ilha</div>
                  </div>
                </button>

                <button
                  id="btn-hero-cat-passeios"
                  onClick={() => handleSelectSlide(4)}
                  className="bg-[#0077b6] hover:bg-[#026aa3] p-2.5 rounded-xl text-left text-white transition transform active:scale-95 shadow-md flex flex-col justify-between h-20 border border-sky-300/30 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase text-sky-200">#03</span>
                    <Sailboat className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                  <div>
                    <div className="font-black text-xs leading-tight">PASSEIOS</div>
                    <div className="text-[9px] text-sky-100">Rabetas & Lago</div>
                  </div>
                </button>

                <button
                  id="btn-hero-cat-alimentacao"
                  onClick={() => handleSelectSlide(2)}
                  className="bg-[#f57c00] hover:bg-[#e65100] p-2.5 rounded-xl text-left text-white transition transform active:scale-95 shadow-md flex flex-col justify-between h-20 border border-orange-300/30 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase text-orange-200">#04</span>
                    <Utensils className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                  <div>
                    <div className="font-black text-xs leading-tight">ALIMENTAÇÃO</div>
                    <div className="text-[9px] text-orange-100">Peixe & Caldeirada</div>
                  </div>
                </button>

                <button
                  id="btn-hero-cat-compras"
                  onClick={() => handleSelectSlide(3)}
                  className="bg-[#558b2f] hover:bg-[#437024] p-2.5 rounded-xl text-left text-white transition transform active:scale-95 shadow-md flex flex-col justify-between h-20 border border-lime-300/30 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase text-lime-200">#05</span>
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                  <div>
                    <div className="font-black text-xs leading-tight">COMPRAS</div>
                    <div className="text-[9px] text-lime-100">Água 20L & Gelo</div>
                  </div>
                </button>
              </div>
            )}

          </div>

          {/* ========================================================= */}
          {/* RIGHT SIDE: 4 INTERACTIVE SWITCHER CARDS (ALTERNAM O BANNER)*/}
          {/* ========================================================= */}
          <div className="lg:col-span-4 flex flex-col gap-3 justify-between">
            
            {/* -------------------------------------------------------- */}
            {/* SWITCHER 1: Transporte / Charrete (Slide 1)              */}
            {/* -------------------------------------------------------- */}
            <div 
              id="hero-banner-switcher-1"
              onClick={() => handleSelectSlide(1)}
              className={`bg-white rounded-2xl p-3 sm:p-3.5 border-[3px] transition-all transform cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                currentSlide === 1 
                  ? 'border-[#f59e0b] shadow-lg ring-2 ring-amber-400 bg-amber-50/40 scale-[1.02]' 
                  : 'border-slate-200 hover:border-amber-400 hover:shadow-md'
              }`}
            >
              {currentSlide === 1 && (
                <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 font-black text-[9px] uppercase px-2 py-0.5 rounded-bl-lg flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-2.5 h-2.5" />
                  Em Destaque Agora
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-950 border border-amber-300">
                    TRANSPORTE
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">Ponto do Porto</span>
                </div>
                <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-tight font-heading group-hover:text-amber-600 transition">
                  {ad1?.title ? (ad1.title.length > 20 ? ad1.title.slice(0, 20) + '...' : ad1.title) : 'Charretes & Bagagem'}
                </h4>
              </div>

              <div className="my-1">
                <h5 className="text-xs font-black text-slate-900">
                  {ad1?.business_name || 'Associação dos Condutores de Charrete'}
                </h5>
                <p className="text-[11px] text-slate-600 leading-tight mt-0.5 line-clamp-1">
                  {ad1?.tagline || ad1?.description || 'Desembarque com tranquilidade e transporte com preço tabelado.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 mt-1">
                <span className="text-[11px] font-black text-amber-700">
                  {ad1?.price_starting ? `A partir de R$ ${ad1.price_starting.toFixed(2)}` : 'A partir de R$ 30,00'}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 group-hover:translate-x-1 transition">
                  {currentSlide === 1 ? 'Exibindo no Banner' : 'Ver no Banner'} <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* -------------------------------------------------------- */}
            {/* SWITCHER 2: Alimentação / Gastronomia (Slide 2)           */}
            {/* -------------------------------------------------------- */}
            <div 
              id="hero-banner-switcher-2"
              onClick={() => handleSelectSlide(2)}
              className={`bg-white rounded-2xl p-3 sm:p-3.5 border-[3px] transition-all transform cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                currentSlide === 2 
                  ? 'border-[#881337] shadow-lg ring-2 ring-rose-400 bg-rose-50/40 scale-[1.02]' 
                  : 'border-slate-200 hover:border-[#881337] hover:shadow-md'
              }`}
            >
              {currentSlide === 2 && (
                <div className="absolute top-0 right-0 bg-rose-700 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded-bl-lg flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-2.5 h-2.5" />
                  Em Destaque Agora
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase px-2 py-0.5 rounded-md bg-rose-100 text-rose-950 border border-rose-300">
                    ALIMENTAÇÃO
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">Pratos Típicos</span>
                </div>
                <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-tight font-heading group-hover:text-rose-800 transition">
                  {ad2?.title ? (ad2.title.length > 20 ? ad2.title.slice(0, 20) + '...' : ad2.title) : 'Peixada & Caldeirada'}
                </h4>
              </div>

              <div className="my-1">
                <h5 className="text-xs font-black text-slate-900">
                  {ad2?.business_name || 'Restaurantes & Quiosques da Praia'}
                </h5>
                <p className="text-[11px] text-slate-600 leading-tight mt-0.5 line-clamp-1">
                  {ad2?.tagline || ad2?.description || 'O melhor peixe frito com açaí e frutos do mar frescos.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 mt-1">
                <span className="text-[11px] font-black text-rose-900">
                  {ad2?.badge || 'Mais Recomendados'}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-900 group-hover:translate-x-1 transition">
                  {currentSlide === 2 ? 'Exibindo no Banner' : 'Ver no Banner'} <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* -------------------------------------------------------- */}
            {/* SWITCHER 3: Compras / Depósito & Água (Slide 3)           */}
            {/* -------------------------------------------------------- */}
            <div 
              id="hero-banner-switcher-3"
              onClick={() => handleSelectSlide(3)}
              className={`bg-white rounded-2xl p-3 sm:p-3.5 border-[3px] transition-all transform cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                currentSlide === 3 
                  ? 'border-[#84cc16] shadow-lg ring-2 ring-lime-400 bg-lime-50/40 scale-[1.02]' 
                  : 'border-slate-200 hover:border-[#84cc16] hover:shadow-md'
              }`}
            >
              {currentSlide === 3 && (
                <div className="absolute top-0 right-0 bg-lime-600 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded-bl-lg flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-2.5 h-2.5" />
                  Em Destaque Agora
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase px-2 py-0.5 rounded-md bg-lime-100 text-lime-950 border border-lime-300">
                    COMPRAS
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">Entrega Expressa</span>
                </div>
                <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-tight font-heading group-hover:text-lime-700 transition">
                  {ad3?.title ? (ad3.title.length > 20 ? ad3.title.slice(0, 20) + '...' : ad3.title) : 'Depósito de Água 20L'}
                </h4>
              </div>

              <div className="my-1">
                <h5 className="text-xs font-black text-slate-900">
                  {ad3?.business_name || 'Depósito Ilha Bela & Gelo'}
                </h5>
                <p className="text-[11px] text-slate-600 leading-tight mt-0.5 line-clamp-1">
                  {ad3?.tagline || ad3?.description || 'Garrafões de água mineral 20L, gelo e conveniência na pousada.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 mt-1">
                <span className="text-[11px] font-black text-lime-800">
                  {ad3?.price_starting ? `Garrafão: R$ ${ad3.price_starting.toFixed(2)}` : 'Garrafão 20L: R$ 14,00'}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-lime-800 group-hover:translate-x-1 transition">
                  {currentSlide === 3 ? 'Exibindo no Banner' : 'Ver no Banner'} <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* -------------------------------------------------------- */}
            {/* SWITCHER 4: Passeios / Ecoturismo (Slide 4)              */}
            {/* -------------------------------------------------------- */}
            <div 
              id="hero-banner-switcher-4"
              onClick={() => handleSelectSlide(4)}
              className={`bg-white rounded-2xl p-3 sm:p-3.5 border-[3px] transition-all transform cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                currentSlide === 4 
                  ? 'border-[#38bdf8] shadow-lg ring-2 ring-sky-400 bg-sky-50/40 scale-[1.02]' 
                  : 'border-slate-200 hover:border-[#38bdf8] hover:shadow-md'
              }`}
            >
              {currentSlide === 4 && (
                <div className="absolute top-0 right-0 bg-sky-600 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded-bl-lg flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-2.5 h-2.5" />
                  Em Destaque Agora
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase px-2 py-0.5 rounded-md bg-sky-100 text-sky-950 border border-sky-300">
                    PASSEIOS
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">Rabetas & Lago</span>
                </div>
                <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-tight font-heading group-hover:text-sky-600 transition">
                  {ad4?.title ? (ad4.title.length > 20 ? ad4.title.slice(0, 20) + '...' : ad4.title) : 'Lago da Princesa'}
                </h4>
              </div>

              <div className="my-1">
                <h5 className="text-xs font-black text-slate-900">
                  {ad4?.business_name || 'Roteiros de Rabeta & Dunas'}
                </h5>
                <p className="text-[11px] text-slate-600 leading-tight mt-0.5 line-clamp-1">
                  {ad4?.tagline || ad4?.description || 'Passeios pelo Furo Velho, manguezais e Fortalezinha.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 mt-1">
                <span className="text-[11px] font-black text-sky-800">
                  {ad4?.price_starting ? `A partir de R$ ${ad4.price_starting.toFixed(2)}` : 'A partir de R$ 25,00'}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-800 group-hover:translate-x-1 transition">
                  {currentSlide === 4 ? 'Exibindo no Banner' : 'Ver no Banner'} <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

