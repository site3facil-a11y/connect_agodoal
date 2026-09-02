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
  X
} from 'lucide-react';
import { Advertisement, Partner, TideDayEntry, UserProfile, WeatherData } from '../../types/index.ts';

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

  // Pousadas Highlights (Matching Screenshot Pousadas)
  const POUSADA_HIGHLIGHTS = [
    {
      id: 'pousada-1',
      name: 'Pousada Chalés da Princesa',
      location: 'Praia da Princesa',
      image: '/imagens/vila2.jpg',
      badge: '⭐ TOP ESCOLHA',
      whatsapp: '5591981129988',
      price: 'R$ 180'
    },
    {
      id: 'pousada-2',
      name: 'Pousada Recanto do Mar',
      location: 'Beira-Mar',
      image: '/imagens/porto2.jpg',
      badge: null,
      whatsapp: '5591983341122',
      price: 'R$ 160'
    },
    {
      id: 'pousada-3',
      name: 'Chalés Paraíso Algodoal',
      location: 'Praia da Princesa',
      image: '/imagens/vila.jpg',
      badge: null,
      whatsapp: '5591982234455',
      price: 'R$ 190'
    },
    {
      id: 'pousada-4',
      name: 'Pousada Luamar',
      location: 'Marudá',
      image: '/imagens/algodoal.jpg',
      badge: null,
      whatsapp: '5591984456677',
      price: 'R$ 140'
    }
  ];

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
      const c = (p.category || '').toLowerCase();
      if (selectedCategory === 'transporte' && c !== 'transporte') return false;
      if (selectedCategory === 'pousadas' && c !== 'pousadas') return false;
      if (selectedCategory === 'passeios' && c !== 'passeios') return false;
      if (selectedCategory === 'alimentacao' && c !== 'alimentacao') return false;
      if (selectedCategory === 'compras' && c !== 'compras') return false;
      if (selectedCategory === 'eventos' && c !== 'eventos') return false;
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
                onSelectCategory('todos');
                onSearchChange('');
              }}
              className={`hover:text-amber-400 transition cursor-pointer ${
                selectedCategory === 'todos' && !searchTerm ? 'text-amber-400 font-bold' : ''
              }`}
            >
              Início
            </button>
            <button 
              onClick={() => onSelectCategory('pousadas')}
              className={`hover:text-amber-400 transition cursor-pointer ${
                selectedCategory === 'pousadas' ? 'text-amber-400 font-bold' : ''
              }`}
            >
              Portal
            </button>
            <button 
              onClick={() => onSelectCategory('passeios')}
              className={`hover:text-amber-400 transition cursor-pointer ${
                selectedCategory === 'passeios' ? 'text-amber-400 font-bold' : ''
              }`}
            >
              Guia da Ilha
            </button>
            <button 
              onClick={() => onSelectCategory('eventos')}
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
        {/* Natural Background Image without Dark Filters */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('${activeHeroBg}')`
          }}
        />
        
        {/* Soft subtle gradient only for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10" />

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
      {/* 6. RESULTS FEED (IF SEARCHING OR FILTERING BY CATEGORY)  */}
      {/* ======================================================== */}
      {(selectedCategory !== 'todos' || searchTerm) && (
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 border-t border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-black text-white font-heading">
                {selectedCategory === 'transporte' && '🐎 Charretes & Condutores Cadastrados'}
                {selectedCategory === 'passeios' && '🚤 Barcos, Rabetas & Passeios'}
                {selectedCategory === 'pousadas' && '🏨 Pousadas & Chalés'}
                {selectedCategory === 'alimentacao' && '🍲 Restaurantes & Peixadas'}
                {selectedCategory === 'compras' && '📦 Depósitos de Bebidas & Água 20L'}
                {selectedCategory === 'eventos' && '🎉 Luaus, Festas & Carimbó'}
                {selectedCategory === 'todos' && searchTerm && `Resultados para: "${searchTerm}"`}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Contatos 100% diretos via WhatsApp • Negocie sem taxas
              </p>
            </div>

            <button
              onClick={() => {
                onSelectCategory('todos');
                onSearchChange('');
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpar Filtro</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeFilteredPartners.map((partner) => (
              <div
                key={partner.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={partner.photo_url || '/imagens/algodoal.jpg'}
                    alt={partner.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-700"
                  />
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase text-teal-400">
                      {partner.subcategory || partner.category}
                    </span>
                    <h4 className="text-sm font-bold text-white leading-tight">
                      {partner.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      {partner.location}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2">
                  {partner.description}
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-black text-amber-400">
                    {partner.price_starting ? `A partir de R$ ${partner.price_starting}` : 'Preço sob consulta'}
                  </span>

                  <a
                    href={`https://wa.me/${partner.whatsapp}?text=Olá! Encontrei seu contato no Algodoal Connect e gostaria de mais informações.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
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
