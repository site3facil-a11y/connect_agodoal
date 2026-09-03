import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Waves, 
  Moon, 
  Sparkles, 
  Star, 
  ChevronRight, 
  ChevronLeft,
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck, 
  Clock, 
  Heart, 
  Megaphone,
  User,
  Phone,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  X,
  Compass,
  Hotel,
  Utensils,
  ShoppingBag,
  PartyPopper,
  Truck,
  Layers,
  CheckCircle
} from 'lucide-react';
import { Advertisement, Partner, TideDayEntry, UserProfile, WeatherData } from '../../types/index.ts';
import { StoriesRow } from '../mobile/StoriesRow.tsx';

interface AlgodoalRedesignPortalProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenAdmin: () => void;
  onOpenAdminBackground?: () => void;
  onOpenTides: () => void;
  onOpenWeather?: () => void;
  currentUser?: UserProfile | null;
  currentTideSummary?: string;
  weather?: WeatherData | null;
  todayTide?: TideDayEntry | null;
  partners: Partner[];
  advertisements: Advertisement[];
  onOpenAdDetails: (ad: Advertisement) => void;
  heroBackgroundUrl?: string;
}

export const AlgodoalRedesignPortal: React.FC<AlgodoalRedesignPortalProps> = ({
  theme,
  onToggleTheme,
  searchTerm,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onOpenAdmin,
  onOpenAdminBackground,
  onOpenTides,
  onOpenWeather,
  currentUser,
  currentTideSummary = 'Baixa-mar 22:50 (0.5m)',
  weather,
  todayTide,
  partners,
  advertisements,
  onOpenAdDetails,
  heroBackgroundUrl
}) => {
  const [selectedPartnerForModal, setSelectedPartnerForModal] = useState<Partner | null>(null);

  const activeHeroBg = heroBackgroundUrl || localStorage.getItem('algodoal_hero_background') || '/imagens/algodoal.jpg';

  // 8 Essential Island Actions (matching screenshot pastel colors & labels - Compact & Sleek)
  const ESSENTIAL_SERVICES = [
    {
      id: 'charretes',
      title: 'Charretes',
      subtitle: 'Contatos da Ilha',
      badge: 'PORTO ⇄ PRAIA',
      emoji: '🐴',
      // Warm Peach/Amber Tint
      bg: 'bg-[#FEF3C7] hover:bg-[#FDE68A] text-slate-900 border-[#FCD34D]',
      badgeBg: 'bg-white/95 text-amber-950 border-amber-300/80',
      action: () => onSelectCategory('transporte')
    },
    {
      id: 'barcos',
      title: 'Barcos & Rabetas',
      subtitle: 'Travessias & Tours',
      badge: 'MARUDÁ ⇄ ILHA',
      emoji: '🚤',
      // Sky/Teal Tint
      bg: 'bg-[#CCFBF1] hover:bg-[#99F6E4] text-slate-900 border-[#5EEAD4]',
      badgeBg: 'bg-white/95 text-teal-950 border-teal-300/80',
      action: () => onSelectCategory('passeios')
    },
    {
      id: 'pousadas',
      title: 'Pousadas',
      subtitle: 'Chalés & Quartos',
      badge: 'BEIRA-MAR',
      emoji: '🏨',
      // Mint Tint
      bg: 'bg-[#DCFCE7] hover:bg-[#BBF7D0] text-slate-900 border-[#86EFAC]',
      badgeBg: 'bg-white/95 text-emerald-950 border-emerald-300/80',
      action: () => onSelectCategory('pousadas')
    },
    {
      id: 'restaurantes',
      title: 'Onde Comer',
      subtitle: 'Peixada & Açaí',
      badge: 'REGIONAL',
      emoji: '🍲',
      // Rose Tint
      bg: 'bg-[#FFE4E6] hover:bg-[#FECDD3] text-slate-900 border-[#FDA4AF]',
      badgeBg: 'bg-white/95 text-rose-950 border-rose-300/80',
      action: () => onSelectCategory('alimentacao')
    },
    {
      id: 'depositos',
      title: 'Depósitos & Gelo',
      subtitle: 'Bebidas & Água 20L',
      badge: 'DISK PRAIA',
      emoji: '📦',
      // Slate/Blue Tint
      bg: 'bg-[#E0F2FE] hover:bg-[#BAE6FD] text-slate-900 border-[#7DD3FC]',
      badgeBg: 'bg-white/95 text-sky-950 border-sky-300/80',
      action: () => onSelectCategory('compras')
    },
    {
      id: 'mares',
      title: 'Tábua de Marés',
      subtitle: 'Previsão Hoje',
      badge: 'MARAPANIM',
      emoji: '🌊',
      // Ice Blue Tint
      bg: 'bg-[#EFF6FF] hover:bg-[#DBEAFE] text-slate-900 border-[#93C5FD]',
      badgeBg: 'bg-white/95 text-blue-950 border-blue-300/80',
      action: onOpenTides
    },
    {
      id: 'eventos',
      title: 'Luaus & Festas',
      subtitle: 'Carimbó & Reggae',
      badge: 'AGENDA',
      emoji: '🎭',
      // Lavender Tint
      bg: 'bg-[#F3E8FF] hover:bg-[#E9D5FF] text-slate-900 border-[#D8B4FE]',
      badgeBg: 'bg-white/95 text-purple-950 border-purple-300/80',
      action: () => onSelectCategory('eventos')
    },
    {
      id: 'anuncie',
      title: 'Anuncie Conosco',
      subtitle: 'Painel do Gestor',
      badge: 'GESTOR',
      emoji: '🛡️',
      // Indigo Tint
      bg: 'bg-[#EEF2FF] hover:bg-[#E0E7FF] text-slate-900 border-[#C7D2FE]',
      badgeBg: 'bg-white/95 text-indigo-950 border-indigo-300/80',
      action: onOpenAdmin
    }
  ];

  // Active View Tab: 'portal' (All ads categorized on same page) | 'guia' (All partners categorized on same page) | 'todos' (Both on same page)
  const [activeMainView, setActiveMainView] = useState<'portal' | 'guia' | 'todos'>('portal');

  // Category normalization helper
  const normalizeCat = (cat?: string): string => {
    if (!cat) return '';
    const c = cat.toLowerCase().trim();
    if (c === 'pousada' || c === 'pousadas' || c === 'hospedagem' || c === 'hotel' || c === 'chale' || c === 'chalés') return 'pousadas';
    if (c === 'restaurante' || c === 'restaurantes' || c === 'alimentacao' || c === 'alimentação' || c === 'gastronomia' || c === 'culinaria') return 'alimentacao';
    if (c === 'transporte' || c === 'transportes' || c === 'charrete' || c === 'charretes' || c === 'carroca') return 'transporte';
    if (c === 'passeio' || c === 'passeios' || c === 'rabeta' || c === 'rabetas' || c === 'barco' || c === 'barcos') return 'passeios';
    if (c === 'compra' || c === 'compras' || c === 'mercado' || c === 'deposito' || c === 'depósito' || c === 'agua' || c === 'água') return 'compras';
    if (c === 'evento' || c === 'eventos' || c === 'show' || c === 'luau' || c === 'festa') return 'eventos';
    return c;
  };

  // Structured Ad Categories for Categorized Display on the Same Page
  const AD_CATEGORIES = [
    { 
      id: 'pousadas', 
      title: 'Pousadas & Chalés', 
      subtitle: 'Hospedagens confortáveis à beira-mar e vilas tranquilas da ilha', 
      emoji: '🏨', 
      badge: 'HOSPEDAGEM',
      bgHeader: 'from-emerald-950/70 to-slate-900/60 border-emerald-500/30 text-emerald-400'
    },
    { 
      id: 'alimentacao', 
      title: 'Restaurantes, Peixadas & Gastronomia', 
      subtitle: 'Filhote frito, caldeirada com jambu e o melhor da culinária paraense', 
      emoji: '🍲', 
      badge: 'SABORES DA ILHA',
      bgHeader: 'from-rose-950/70 to-slate-900/60 border-rose-500/30 text-rose-400'
    },
    { 
      id: 'transporte', 
      title: 'Charretes & Transporte de Bagagens', 
      subtitle: 'Condutores credenciados do Porto até as pousadas e praias', 
      emoji: '🐎', 
      badge: 'TRANSPORTE OFICIAL',
      bgHeader: 'from-amber-950/70 to-slate-900/60 border-amber-500/30 text-amber-400'
    },
    { 
      id: 'passeios', 
      title: 'Barcos, Rabetas & Ecoturismo', 
      subtitle: 'Lago da Princesa, canais de manguezal e travessias rápidas', 
      emoji: '🚤', 
      badge: 'PASSEIOS NÁUTICOS',
      bgHeader: 'from-teal-950/70 to-slate-900/60 border-teal-500/30 text-teal-400'
    },
    { 
      id: 'compras', 
      title: 'Depósitos de Bebidas, Água 20L & Gelo', 
      subtitle: 'Entrega rápida de água mineral lacrada, sacos de gelo e carvão', 
      emoji: '📦', 
      badge: 'DISK ENTREGA',
      bgHeader: 'from-sky-950/70 to-slate-900/60 border-sky-500/30 text-sky-400'
    },
    { 
      id: 'eventos', 
      title: 'Luaus, Shows & Eventos Culturais', 
      subtitle: 'Carimbó raiz de Marapanim, reggae nas dunas e noites de lua cheia', 
      emoji: '🎉', 
      badge: 'AGENDA CULTURAL',
      bgHeader: 'from-purple-950/70 to-slate-900/60 border-purple-500/30 text-purple-400'
    }
  ];

  // Structured Partner Categories for Guia da Ilha on the Same Page
  const PARTNER_CATEGORIES = [
    { 
      id: 'transporte', 
      title: 'Charretes & Transporte Local', 
      subtitle: 'Transporte tradicional ecológico com tabela oficial de preços', 
      emoji: '🐎',
      tag: 'Condutores Oficiais'
    },
    { 
      id: 'pousadas', 
      title: 'Pousadas, Chalés & Hospedagens', 
      subtitle: 'Praia da Princesa, Vila de Maiandeua, Camboinha e Farol', 
      emoji: '🏨',
      tag: 'Hospedagens'
    },
    { 
      id: 'alimentacao', 
      title: 'Restaurantes, Barracas & Culinária', 
      subtitle: 'Gastronomia paraense pé na areia com peixe fresco e açaí batido', 
      emoji: '🍲',
      tag: 'Gastronomia'
    },
    { 
      id: 'passeios', 
      title: 'Barcos, Rabetas & Passeios', 
      subtitle: 'Mestres experientes para travessias e tours ecológicos', 
      emoji: '🚤',
      tag: 'Rabetas & Barcos'
    },
    { 
      id: 'compras', 
      title: 'Depósitos, Mercearias & Suprimentos', 
      subtitle: 'Disk água 20L, gelo para caixas térmicas e conveniência', 
      emoji: '📦',
      tag: 'Comércio Local'
    },
    { 
      id: 'eventos', 
      title: 'Cultura, Lazer & Carimbó', 
      subtitle: 'Grupos folclóricos de Marapanim, luaus e rodas de carimbó', 
      emoji: '🎭',
      tag: 'Cultura & Lazer'
    }
  ];

  // Filtered ads
  const activeFilteredAds = advertisements.filter((ad) => {
    if (selectedCategory !== 'todos') {
      if (normalizeCat(ad.category) !== normalizeCat(selectedCategory)) return false;
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const mTitle = (ad.title || '').toLowerCase().includes(term);
      const mBus = (ad.business_name || '').toLowerCase().includes(term);
      const mDesc = (ad.description || '').toLowerCase().includes(term);
      const mLoc = (ad.location || '').toLowerCase().includes(term);
      const mTag = (ad.tagline || '').toLowerCase().includes(term);
      if (!mTitle && !mBus && !mDesc && !mLoc && !mTag) return false;
    }
    return true;
  });

  // Tides data formatted for the 4 columns
  const highTides = todayTide?.high_tides || [
    { time: '04:12', height: '4.2m' },
    { time: '16:38', height: '4.4m' }
  ];
  const lowTides = todayTide?.low_tides || [
    { time: '10:25', height: '0.4m' },
    { time: '22:50', height: '0.5m' }
  ];
  const moonPhase = todayTide?.moon_phase || 'Cheia';
  const coefficient = todayTide?.coefficient || 88;

  // Filtered partners if a category or search term is selected
  const activeFilteredPartners = partners.filter((p) => {
    if (selectedCategory !== 'todos') {
      if (normalizeCat(p.category) !== normalizeCat(selectedCategory)) return false;
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchName = (p.name || '').toLowerCase().includes(term);
      const matchDesc = (p.description || '').toLowerCase().includes(term);
      const matchLoc = (p.location || '').toLowerCase().includes(term);
      if (!matchName && !matchDesc && !matchLoc) return false;
    }
    return true;
  });

  return (
    <div className="w-full min-h-screen bg-[#060a12] text-white flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      
      {/* ======================================================== */}
      {/* 1. TOP NAVBAR (DARK ATMOSPHERIC)                         */}
      {/* ======================================================== */}
      <header className="w-full bg-[#060a12]/95 border-b border-slate-800/80 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Location */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => {
              onSelectCategory('todos');
              onSearchChange('');
            }}
          >
            <div className="w-10 h-10 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-xl shadow-inner">
              🌴
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black font-heading tracking-tight text-white">
                  Algodoal<span className="text-amber-500">Connect</span>
                </span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md bg-teal-500/20 text-teal-400 border border-teal-500/30">
                  GUIA
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                <MapPin className="w-3 h-3 text-amber-500" />
                Ilha de Maiandeua, Pará
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <button 
              onClick={() => {
                setActiveMainView('portal');
                onSelectCategory('todos');
                onSearchChange('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`hover:text-amber-400 transition cursor-pointer ${
                activeMainView === 'portal' && selectedCategory === 'todos' && !searchTerm ? 'text-amber-400 font-bold' : ''
              }`}
            >
              Início
            </button>
            <button 
              id="nav-btn-portal"
              onClick={() => {
                setActiveMainView('portal');
                onSelectCategory('todos');
                onSearchChange('');
                document.getElementById('secao-portal-anuncios')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`hover:text-amber-400 transition cursor-pointer flex items-center gap-1.5 ${
                activeMainView === 'portal' ? 'text-amber-400 font-bold' : ''
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Portal (Anúncios)</span>
            </button>
            <button 
              id="nav-btn-guia"
              onClick={() => {
                setActiveMainView('guia');
                onSelectCategory('todos');
                onSearchChange('');
                document.getElementById('secao-guia-parceiros')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`hover:text-teal-300 transition cursor-pointer flex items-center gap-1.5 ${
                activeMainView === 'guia' ? 'text-teal-400 font-bold' : ''
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-teal-400" />
              <span>Guia da Ilha (Parceiros)</span>
            </button>
            <button 
              onClick={() => {
                setActiveMainView('portal');
                onSelectCategory('eventos');
                onSearchChange('');
              }}
              className={`hover:text-amber-400 transition cursor-pointer ${
                selectedCategory === 'eventos' ? 'text-amber-400 font-bold' : ''
              }`}
            >
              Agenda
            </button>
            <button 
              onClick={onOpenAdmin}
              className="hover:text-amber-400 transition cursor-pointer text-slate-300"
            >
              Anuncie
            </button>
          </nav>

          {/* Right Action: Gold Pill Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAdmin}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-4 sm:px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-transform active:scale-95 cursor-pointer"
            >
              <User className="w-4 h-4 text-slate-950" />
              <span>{currentUser?.role === 'admin' ? 'Painel Admin' : 'Entrar / Admin'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. HERO SECTION WITH VIVID NATURAL BACKGROUND & SEARCH   */}
      {/* ======================================================== */}
      <section className="relative w-full min-h-[380px] sm:min-h-[440px] flex items-center overflow-hidden border-b border-slate-800">
        {/* High-Resolution Responsive Background Image with Object-Cover (Zero Distortion) */}
        <img
          src={activeHeroBg}
          alt="Paisagem da Ilha de Algodoal"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-center z-0 select-none pointer-events-none transition-opacity duration-700"
          style={{ imageRendering: 'auto' }}
        />
        
        {/* Soft subtle gradient for premium text readability and crisp contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/35 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20 z-10" />

        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-12 relative z-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          
          {/* Left Hero Title & Search */}
          <div className="max-w-xl space-y-4">
            <h1 className="text-3xl sm:text-5xl font-black font-heading leading-tight tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              Conectando você <br />
              ao melhor de <br />
              <span className="text-amber-400 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">Algodoal</span>
            </h1>

            <p className="text-sm sm:text-base text-white font-semibold drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)]">
              Tudo que você precisa para aproveitar a Ilha de Maiandeua.
            </p>

            {/* Instant Search Bar */}
            <div className="relative pt-2 w-full max-w-md">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-slate-500 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Buscar charretes, pousadas, peixadas..."
                  className="w-full bg-white text-slate-900 placeholder-slate-500 pl-11 pr-10 py-3.5 rounded-full text-sm font-semibold shadow-2xl border-2 border-white/20 focus:outline-hidden focus:ring-4 focus:ring-amber-400/30 transition"
                />
                {searchTerm && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-4 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Floating Status Box (Tide + Weather) */}
          <div 
            onClick={onOpenTides}
            className="cursor-pointer group p-3.5 sm:p-4 rounded-2xl bg-[#0b1220]/80 border border-slate-700/80 backdrop-blur-md shadow-2xl space-y-1.5 hover:border-amber-400/50 transition shrink-0"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-teal-300">
              <Waves className="w-4 h-4 text-teal-400 animate-pulse" />
              <span>{currentTideSummary || 'Baixa-mar 22:50 (0.5m)'}</span>
            </div>
            
            <div className="flex items-center gap-2 text-[11px] text-slate-300 font-medium">
              <span className="text-amber-400">Maré Viva</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                🌙 {weather?.temperature ? `${weather.temperature}°C` : '27°C'}
              </span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Ilha Online
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. SECTION: SERVIÇOS ESSENCIAIS DA ILHA (8 COMPACT CARDS)*/}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-7">
        <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-3xl p-4 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 text-white font-heading">
              <Sparkles className="w-4 h-4 text-amber-400" />
              SERVIÇOS ESSENCIAIS DA ILHA
            </h2>
            <span className="text-xs font-bold text-teal-400">Toque p/ Acessar</span>
          </div>

          {/* 8 Pastel/Tinted Service Cards in Responsive Grid (Compact & Sleek) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            {ESSENTIAL_SERVICES.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className={`p-2.5 sm:p-3 rounded-2xl border ${item.bg} text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-98 flex flex-col justify-between h-20 sm:h-22 cursor-pointer relative overflow-hidden`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl sm:text-2xl leading-none">{item.emoji}</span>
                  <span className={`text-[8.5px] sm:text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border shadow-2xs leading-tight ${item.badgeBg}`}>
                    {item.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs sm:text-[13px] font-black tracking-tight leading-snug text-slate-950">
                    {item.title}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] font-medium text-slate-700 leading-tight truncate mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. SECTION: TÁBUA DE MARÉS DE HOJE (WHITE CARD)          */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-4">
        <div className="bg-white text-slate-900 rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-200 relative overflow-hidden">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2.5">
                <Waves className="w-5 h-5 text-teal-600" />
                <h3 className="text-base sm:text-lg font-black tracking-tight font-heading text-slate-900 uppercase">
                  Tábua de Marés de Hoje
                </h3>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-300">
                  MARAPANIM
                </span>
                <button
                  onClick={onOpenTides}
                  className="text-xs font-bold text-teal-600 hover:text-teal-700 transition cursor-pointer ml-1"
                >
                  Ver Mês Inteiro →
                </button>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-1 flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-amber-500" />
                Lua {moonPhase} • Coeficiente {coefficient} (Maré Viva)
              </p>
            </div>
          </div>

          {/* 4 Tide Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
            
            {/* Preia-mar 1 */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5 text-teal-600" />
                PREIA-MAR 1
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-xl sm:text-2xl font-black text-slate-900">
                  {highTides[0]?.time || '04:12'}
                </span>
                <span className="text-xs font-black px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 border border-teal-200">
                  {highTides[0]?.height || '4.2m'}
                </span>
              </div>
            </div>

            {/* Baixa-mar 1 */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 flex items-center gap-1">
                <ArrowDownRight className="w-3.5 h-3.5 text-amber-600" />
                BAIXA-MAR 1
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-xl sm:text-2xl font-black text-slate-900">
                  {lowTides[0]?.time || '10:25'}
                </span>
                <span className="text-xs font-black px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                  {lowTides[0]?.height || '0.4m'}
                </span>
              </div>
            </div>

            {/* Preia-mar 2 */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5 text-teal-600" />
                PREIA-MAR 2
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-xl sm:text-2xl font-black text-slate-900">
                  {highTides[1]?.time || '16:38'}
                </span>
                <span className="text-xs font-black px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 border border-teal-200">
                  {highTides[1]?.height || '4.4m'}
                </span>
              </div>
            </div>

            {/* Baixa-mar 2 */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 flex items-center gap-1">
                <ArrowDownRight className="w-3.5 h-3.5 text-amber-600" />
                BAIXA-MAR 2
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-xl sm:text-2xl font-black text-slate-900">
                  {lowTides[1]?.time || '22:50'}
                </span>
                <span className="text-xs font-black px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                  {lowTides[1]?.height || '0.5m'}
                </span>
              </div>
            </div>

          </div>

          {/* Footer Note */}
          <div className="text-center text-xs text-slate-500 font-medium pt-2 border-t border-slate-100">
            <strong>Dica de Travessia:</strong> Barcos navegam melhor em maré cheia. Consulte os horários e planeje sua travessia!
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. EXPLORAR ANÚNCIOS & SERVIÇOS EM ALGODOAL (MASTER)     */}
      {/* ======================================================== */}
      <section id="secao-explorar" className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-6 pb-2 space-y-6">
        
        {/* Section Header Title & Subtitle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">✨</span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white font-heading">
                Explorar Anúncios & Serviços em Algodoal
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
              Consulte pousadas, restaurantes, condutores de charretes, barcos e depósitos com contato direto pelo WhatsApp.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <span className="px-3.5 py-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 shadow-inner">
              <strong className="text-amber-400 font-black">{activeFilteredAds.length}</strong> anúncios • <strong className="text-teal-400 font-black">{activeFilteredPartners.length}</strong> no guia
            </span>
          </div>
        </div>

        {/* Destaques da Ilha (Stories) Row */}
        <div className="rounded-3xl overflow-hidden border border-slate-800/90 bg-slate-900/90 shadow-xl">
          <StoriesRow
            theme={theme}
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
            showHeaderTitle={true}
          />
        </div>

        {/* Main View Toggle Buttons */}
        <div id="secao-navegacao" className="flex flex-col md:flex-row items-center justify-between gap-4 p-2.5 sm:p-3 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-2xl">
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              id="tab-btn-portal"
              onClick={() => {
                setActiveMainView('portal');
                onSelectCategory('todos');
              }}
              className={`flex-1 md:flex-none px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                activeMainView === 'portal'
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20 scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Portal de Anúncios</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                activeMainView === 'portal' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-amber-400'
              }`}>
                {activeFilteredAds.length}
              </span>
            </button>

            <button
              id="tab-btn-guia"
              onClick={() => {
                setActiveMainView('guia');
                onSelectCategory('todos');
              }}
              className={`flex-1 md:flex-none px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                activeMainView === 'guia'
                  ? 'bg-teal-400 text-slate-950 shadow-lg shadow-teal-400/20 scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Compass className="w-4 h-4 text-slate-950" />
              <span>Guia da Ilha</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                activeMainView === 'guia' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-teal-400'
              }`}>
                {activeFilteredPartners.length}
              </span>
            </button>

            <button
              id="tab-btn-todos"
              onClick={() => {
                setActiveMainView('todos');
                onSelectCategory('todos');
              }}
              className={`hidden lg:flex px-4 py-3 rounded-2xl font-bold text-xs items-center gap-1.5 transition cursor-pointer ${
                activeMainView === 'todos'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-inner'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Ver Tudo Junto</span>
            </button>
          </div>

          {/* Active Filter Badge & Anuncie CTA */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end text-xs">
            {selectedCategory !== 'todos' ? (
              <div className="flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 px-3.5 py-2 rounded-2xl text-amber-300 font-bold">
                <span>Filtrando por categoria</span>
                <button
                  onClick={() => onSelectCategory('todos')}
                  className="bg-amber-400/20 hover:bg-amber-400/30 px-2 py-0.5 rounded-lg text-amber-200 flex items-center gap-1 transition cursor-pointer"
                >
                  <span>Ver Todas</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <span className="text-[11px] text-slate-400 hidden sm:inline font-medium">
                {activeMainView === 'portal' && 'Exibindo todos os anúncios juntos (sem divisores de categoria)'}
                {activeMainView === 'guia' && 'Exibindo todos os parceiros credenciados juntos'}
                {activeMainView === 'todos' && 'Exibindo anúncios e parceiros juntos na mesma página'}
              </span>
            )}

            <button
              onClick={onOpenAdmin}
              className="font-black text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 px-4 py-2.5 rounded-2xl shadow-md flex items-center gap-2 transition cursor-pointer active:scale-95"
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Anuncie</span>
            </button>
          </div>

        </div>

        {/* Search notice if active */}
        {searchTerm && (
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-700 flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">
              Buscando por: <strong className="text-amber-400">"{searchTerm}"</strong> • Encontrados {activeFilteredAds.length} anúncios e {activeFilteredPartners.length} parceiros.
            </span>
            <button
              onClick={() => onSearchChange('')}
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Limpar busca</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* 6. PORTAL DE ANÚNCIOS (TODOS OS ANÚNCIOS JUNTOS)         */}
      {/* ======================================================== */}
      {(activeMainView === 'portal' || activeMainView === 'todos') && (
        <section id="secao-portal-anuncios" className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-5">
          
          {/* Section Master Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🌟</span>
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white font-heading">
                  PORTAL DE ANÚNCIOS • ILHA DE ALGODOAL
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Todos os anúncios comerciais da ilha reunidos em um só lugar com contato direto pelo WhatsApp
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Total no Portal:</span>
              <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-400 font-black border border-amber-400/30">
                {activeFilteredAds.length} {activeFilteredAds.length === 1 ? 'anúncio ativo' : 'anúncios ativos'}
              </span>
            </div>
          </div>

          {/* Subheader Status Bar */}
          <div className="flex items-center justify-between py-1 px-1 text-xs border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-200 text-sm">
                {activeFilteredAds.length} {activeFilteredAds.length === 1 ? 'anúncio encontrado' : 'anúncios encontrados'}
              </span>
              {selectedCategory !== 'todos' && (
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {selectedCategory}
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium text-slate-400">
              Preços em Reais (R$) • Contato WhatsApp Direto
            </span>
          </div>

          {/* Unified Grid of All Advertisements Together */}
          {activeFilteredAds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeFilteredAds.map((ad) => {
                const cleanPhone = (ad.whatsapp || ad.phone || '').replace(/\D/g, '');
                const whatsappUrl = `https://wa.me/${cleanPhone || '5591981129988'}?text=${encodeURIComponent(
                  `Olá! Vi o anúncio de "${ad.title}" no Portal Algodoal Connect e gostaria de informações.`
                )}`;

                return (
                  <div
                    key={ad.id}
                    className="group rounded-3xl overflow-hidden border border-slate-800/90 bg-slate-900/90 hover:border-amber-400/50 transition-all duration-300 flex flex-col justify-between shadow-xl hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10"
                  >
                    {/* Card Image Banner */}
                    <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-950">
                      <img
                        src={ad.image_url || '/imagens/algodoal.jpg'}
                        alt={ad.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/imagens/algodoal.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 shadow-md">
                          {ad.badge || ad.category || 'Destaque'}
                        </span>

                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg bg-slate-950/80 text-teal-300 border border-teal-500/30 backdrop-blur-xs">
                          {ad.business_name}
                        </span>
                      </div>

                      {/* Starting Price Pill */}
                      <div className="absolute bottom-3 right-3 z-10">
                        <span className="text-xs font-black px-3 py-1 rounded-xl bg-slate-950/90 text-amber-400 border border-amber-400/40 backdrop-blur-xs shadow-lg">
                          {ad.price_starting && ad.price_starting > 0
                            ? `A partir de R$ ${Number(ad.price_starting).toFixed(2).replace('.', ',')}`
                            : 'Consulte Valores'}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-semibold">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{ad.location || 'Ilha de Maiandeua'}</span>
                        </div>

                        <h4 className="text-base font-black text-white leading-snug group-hover:text-amber-400 transition">
                          {ad.title}
                        </h4>

                        {ad.tagline && (
                          <p className="text-xs font-bold text-teal-300 leading-tight">
                            {ad.tagline}
                          </p>
                        )}

                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                          {ad.description}
                        </p>
                      </div>

                      {/* Action Buttons: Ver Detalhes + WhatsApp */}
                      <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                        <button
                          onClick={() => onOpenAdDetails(ad)}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition text-center cursor-pointer"
                        >
                          Ver Detalhes
                        </button>

                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
              <Compass className="w-10 h-10 mx-auto text-amber-400" />
              <h4 className="text-base font-black text-white">Nenhum anúncio comercial encontrado</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {selectedCategory !== 'todos'
                  ? `Não há anúncios ativos na categoria "${selectedCategory}". Experimente selecionar outra ou ver todos.`
                  : 'Nenhum anúncio comercial corresponde à sua busca.'}
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                {selectedCategory !== 'todos' && (
                  <button
                    onClick={() => onSelectCategory('todos')}
                    className="text-xs font-black bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl transition cursor-pointer"
                  >
                    Ver Todos os Anúncios
                  </button>
                )}
                <button
                  onClick={onOpenAdmin}
                  className="text-xs font-black bg-amber-400 hover:bg-amber-300 text-slate-950 px-4 py-2 rounded-xl transition cursor-pointer shadow-md"
                >
                  Anunciar Meu Negócio
                </button>
              </div>
            </div>
          )}

        </section>
      )}

      {/* ======================================================== */}
      {/* 7. GUIA DA ILHA (TODOS OS PARCEIROS POR CATEGORIA)       */}
      {/* ======================================================== */}
      {(activeMainView === 'guia' || activeMainView === 'todos') && (
        <section id="secao-guia-parceiros" className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-10 border-t border-slate-800/80">
          
          {/* Section Master Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🌴</span>
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white font-heading">
                  GUIA DA ILHA • TODOS OS PARCEIROS CADASTRADOS
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Trabalhadores e serviços locais credenciados • Contato 100% direto via WhatsApp sem comissão
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Total no Guia:</span>
              <span className="px-2.5 py-1 rounded-full bg-teal-400/20 text-teal-400 font-black border border-teal-400/30">
                {activeFilteredPartners.length} parceiros credenciados
              </span>
            </div>
          </div>

          {/* Subheader Status Bar */}
          <div className="flex items-center justify-between py-1 px-1 text-xs border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-200 text-sm">
                {activeFilteredPartners.length} {activeFilteredPartners.length === 1 ? 'profissional encontrado' : 'profissionais encontrados'}
              </span>
              {selectedCategory !== 'todos' && (
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-teal-400/20 text-teal-300 border border-teal-400/30">
                  {selectedCategory}
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium text-slate-400">
              Profissionais Locais Credenciados • Sem Taxa de Intermediação
            </span>
          </div>

          {/* Unified Grid of All Partners Together */}
          {activeFilteredPartners.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeFilteredPartners.map((partner) => {
                const cleanPhone = (partner.whatsapp || partner.phone || '').replace(/\D/g, '');
                const whatsappUrl = `https://wa.me/${cleanPhone || '5591981129988'}?text=${encodeURIComponent(
                  `Olá! Encontrei seu contato no Guia da Ilha de Algodoal e gostaria de mais informações sobre seus serviços.`
                )}`;

                return (
                  <div
                    key={partner.id}
                    className="bg-slate-900/90 border border-slate-800 hover:border-teal-400/50 rounded-3xl p-5 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xl hover:-translate-y-1 hover:shadow-2xl hover:shadow-teal-500/10"
                  >
                    <div className="space-y-3">
                      {/* Partner Header with Photo & Subcategory */}
                      <div className="flex items-start gap-3">
                        <img
                          src={partner.photo_url || '/imagens/algodoal.jpg'}
                          alt={partner.name}
                          className="w-16 h-16 rounded-2xl object-cover shrink-0 border-2 border-slate-700 shadow-md"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/imagens/algodoal.jpg';
                          }}
                        />
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-black uppercase text-teal-400 truncate">
                              {partner.subcategory || partner.category}
                            </span>
                            {partner.verified && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-0.5">
                                <CheckCircle className="w-2.5 h-2.5 text-teal-400" />
                                Verificado
                              </span>
                            )}
                          </div>

                          <h4 className="text-sm font-black text-white leading-tight truncate">
                            {partner.name}
                          </h4>

                          <p className="text-[11px] text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                            <span className="truncate">{partner.location}</span>
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {partner.description}
                      </p>

                      {/* Rating and Amenities tags */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        <div className="flex items-center gap-1 font-bold text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{partner.rating || 4.9}</span>
                          <span className="text-slate-500 text-[11px]">
                            ({partner.total_reviews || 25})
                          </span>
                        </div>

                        {partner.vehicle_badge && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-800 text-amber-300 border border-slate-700">
                            {partner.vehicle_badge}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Footer with Price and Contact */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Tabela a partir de:</span>
                        <span className="text-xs font-black text-amber-400">
                          {partner.price_starting && partner.price_starting > 0
                            ? `R$ ${Number(partner.price_starting).toFixed(2).replace('.', ',')}`
                            : 'Sob Consulta'}
                        </span>
                      </div>

                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-2">
              <p className="text-xs text-slate-400">
                {selectedCategory !== 'todos'
                  ? `Nenhum parceiro cadastrado na categoria "${selectedCategory}".`
                  : 'Nenhum parceiro credenciado cadastrado no momento.'}
              </p>
              <button
                onClick={onOpenAdmin}
                className="text-xs font-black text-teal-400 hover:underline cursor-pointer"
              >
                Cadastre-se como parceiro profissional da ilha
              </button>
            </div>
          )}

        </section>
      )}

      {/* ======================================================== */}
      {/* 7. TRUST & VALUE BADGES ROW (4 ITEMS)                    */}
      {/* ======================================================== */}
      <section className="w-full bg-[#03060c] border-t border-slate-800 py-8 mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          
          {/* Item 1 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Informações confiáveis</h4>
              <p className="text-[11px] text-slate-400">Conteúdo sempre atualizado</p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Conecte-se à Ilha</h4>
              <p className="text-[11px] text-slate-400">Tudo em um só lugar</p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Apoie o local</h4>
              <p className="text-[11px] text-slate-400">Fortaleça nossa comunidade</p>
            </div>
          </div>

          {/* Item 4 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Megaphone className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Anuncie aqui</h4>
              <p className="text-[11px] text-slate-400">Destaque seu negócio</p>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. FOOTER (DARK CLEAN WITH SOCIALS & ATTRIBUTION)        */}
      {/* ======================================================== */}
      <footer className="w-full bg-[#020408] border-t border-slate-900 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a 
              href="https://wa.me/5591981129988" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-slate-900 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-slate-900 hover:bg-pink-600 text-slate-300 hover:text-white flex items-center justify-center transition text-sm font-bold"
            >
              📸
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-slate-900 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition text-sm font-bold"
            >
              f
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p>Algodoal Connect © 2024 - Ilha de Maiandeua, Pará</p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Produzido por <a href="https://www.3facil.com" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">3facil.com</a>
            </p>
          </div>

          {/* Logo Badge */}
          <div className="flex items-center gap-1.5 font-bold text-white">
            <span className="font-heading text-sm">Algodoal<span className="text-amber-500">Connect</span></span>
          </div>

        </div>
      </footer>

    </div>
  );
};
