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
  CheckCircle,
  Home,
  Tag,
  Award,
  Check,
  Building2,
  Store,
  DollarSign,
  ArrowUp,
  Sun,
  History
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
  activeMainView?: 'inicio' | 'portal' | 'guia' | 'anuncie';
  onMainViewChange?: (view: 'inicio' | 'portal' | 'guia' | 'anuncie') => void;
  onToggleLayout?: () => void;
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
  heroBackgroundUrl,
  activeMainView: propActiveMainView,
  onMainViewChange,
  onToggleLayout
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
      subtitle: 'Quadro de Valores',
      badge: 'R$ 30/MÊS',
      emoji: '💎',
      // Indigo Tint
      bg: 'bg-[#EEF2FF] hover:bg-[#E0E7FF] text-slate-900 border-[#C7D2FE]',
      badgeBg: 'bg-white/95 text-indigo-950 border-indigo-300/80',
      action: () => {
        setActiveMainView('anuncie');
        onSelectCategory('todos');
        onSearchChange('');
        setTimeout(() => {
          const el = document.getElementById('secao-quadro-valores') || document.getElementById('secao-navegacao');
          el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
    }
  ];

  // Active View Tab:
  // 'inicio': Carrega TODOS os anúncios E parceiros juntos na página inicial
  // 'portal': Carrega SÓ os anúncios comerciais
  // 'guia': Carrega SÓ os parceiros credenciados
  // 'anuncie': Carrega o QUADRO DE VALORES (Plano Mensal R$ 30, Plano Free, Divulgação)
  const [internalMainView, setInternalMainView] = useState<'inicio' | 'portal' | 'guia' | 'anuncie'>('inicio');
  const activeMainView = propActiveMainView !== undefined ? propActiveMainView : internalMainView;
  const setActiveMainView = (view: 'inicio' | 'portal' | 'guia' | 'anuncie') => {
    if (onMainViewChange) onMainViewChange(view);
    setInternalMainView(view);
  };

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

  // Scroll directly to search results smoothly
  const scrollToResults = () => {
    if (activeMainView === 'anuncie') {
      setActiveMainView('inicio');
    }
    setTimeout(() => {
      const el = document.getElementById('secao-portal-anuncios') || document.getElementById('secao-guia-parceiros') || document.getElementById('secao-navegacao');
      if (el) {
        const navHeight = 70;
        const elPos = el.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({ top: elPos, behavior: 'smooth' });
      }
    }, 60);
  };

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

          {/* Center Navigation Links (Beautiful High-Contrast Pill Buttons) */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-inner">
            <button 
              id="nav-btn-inicio"
              onClick={() => {
                setActiveMainView('inicio');
                onSelectCategory('todos');
                onSearchChange('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-black text-xs transition cursor-pointer ${
                activeMainView === 'inicio' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <span>🏠 Início</span>
            </button>
            <button 
              id="nav-btn-portal"
              onClick={() => {
                setActiveMainView('portal');
                onSelectCategory('todos');
                onSearchChange('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-black text-xs transition cursor-pointer ${
                activeMainView === 'portal' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <span>🌟 Portal de Anúncios</span>
            </button>
            <button 
              id="nav-btn-guia"
              onClick={() => {
                setActiveMainView('guia');
                onSelectCategory('todos');
                onSearchChange('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-black text-xs transition cursor-pointer ${
                activeMainView === 'guia' ? 'bg-teal-400 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <span>🌴 Guia da Ilha (Parceiros)</span>
            </button>
            <button 
              id="nav-btn-anuncie"
              onClick={() => {
                setActiveMainView('anuncie');
                onSelectCategory('todos');
                onSearchChange('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-black text-xs transition cursor-pointer ${
                activeMainView === 'anuncie' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <span>💎 Anuncie</span>
            </button>
          </nav>

          {/* Right Actions: Layout Toggle ("Layout Antigo") + Theme Switcher + Admin */}
          <div className="flex items-center gap-2">
            {/* Button to toggle to Layout Antigo */}
            {onToggleLayout && (
              <button
                id="btn-layout-antigo"
                onClick={onToggleLayout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer active:scale-95"
                title="Alternar para o Layout Antigo / Clássico"
              >
                <History className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Layout Antigo</span>
                <span className="sm:hidden">Antigo</span>
              </button>
            )}

            {/* Theme Switcher Button */}
            <button
              onClick={onToggleTheme}
              className="p-2 sm:px-3 sm:py-1.5 rounded-full text-xs font-bold bg-slate-800/90 hover:bg-slate-700 text-amber-400 border border-slate-700 flex items-center gap-1.5 transition cursor-pointer active:scale-95"
              title="Alternar Tema Claro / Escuro"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span className="hidden lg:inline">{theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}</span>
            </button>

            {/* Admin / Login Button */}
            <button
              onClick={onOpenAdmin}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-3 sm:px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-transform active:scale-95 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-slate-950" />
              <span className="hidden sm:inline">{currentUser?.role === 'admin' ? 'Painel Admin' : 'Entrar / Admin'}</span>
              <span className="sm:hidden">{currentUser?.role === 'admin' ? 'Admin' : 'Entrar'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* STICKY MAIN VIEW BAR (MOBILE ONLY: INÍCIO | PORTAL | GUIA | ANUNCIE) */}
      {/* ======================================================== */}
      <nav className="md:hidden sticky top-18 z-40 bg-[#080d18]/95 border-b border-slate-800/90 backdrop-blur-md px-3 sm:px-6 py-2.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Tab 1: Início (Tudo) */}
            <button
              id="sticky-btn-inicio"
              onClick={() => {
                setActiveMainView('inicio');
                onSelectCategory('todos');
                onSearchChange('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeMainView === 'inicio'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 ring-2 ring-amber-300'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Início (Tudo)</span>
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                activeMainView === 'inicio' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-900 text-amber-400'
              }`}>
                {activeFilteredAds.length + activeFilteredPartners.length}
              </span>
            </button>

            {/* Tab 2: Portal de Anúncios */}
            <button
              id="sticky-btn-portal"
              onClick={() => {
                setActiveMainView('portal');
                onSelectCategory('todos');
                onSearchChange('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeMainView === 'portal'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 ring-2 ring-amber-300'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Portal de Anúncios</span>
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                activeMainView === 'portal' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-900 text-amber-400'
              }`}>
                {activeFilteredAds.length}
              </span>
            </button>

            {/* Tab 3: Guia da Ilha (Parceiros) */}
            <button
              id="sticky-btn-guia"
              onClick={() => {
                setActiveMainView('guia');
                onSelectCategory('todos');
                onSearchChange('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeMainView === 'guia'
                  ? 'bg-teal-400 text-slate-950 shadow-md shadow-teal-400/20 ring-2 ring-teal-300'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Guia da Ilha</span>
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                activeMainView === 'guia' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-900 text-teal-400'
              }`}>
                {activeFilteredPartners.length}
              </span>
            </button>

            {/* Tab 4: Anuncie (Valores) */}
            <button
              id="sticky-btn-anuncie"
              onClick={() => {
                setActiveMainView('anuncie');
                onSelectCategory('todos');
                onSearchChange('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeMainView === 'anuncie'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 shadow-md shadow-amber-400/20 ring-2 ring-amber-300'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Anuncie (Valores)</span>
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                activeMainView === 'anuncie' ? 'bg-slate-950/20 text-slate-950' : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
              }`}>
                R$ 30/mês
              </span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs shrink-0">
            {activeMainView === 'inicio' && (
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-medium">
                Página Inicial: <strong className="text-amber-400">Todos os anúncios</strong> + <strong className="text-teal-400">parceiros do guia</strong>
              </span>
            )}
            {activeMainView === 'portal' && (
              <span className="px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[11px] font-medium">
                Portal: <strong className="font-bold text-amber-300">Somente anúncios comerciais ativos</strong>
              </span>
            )}
            {activeMainView === 'guia' && (
              <span className="px-3 py-1 rounded-full bg-teal-400/10 border border-teal-400/30 text-teal-300 text-[11px] font-medium">
                Guia: <strong className="font-bold text-teal-300">Somente parceiros e trabalhadores credenciados</strong>
              </span>
            )}
            {activeMainView === 'anuncie' && (
              <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[11px] font-medium">
                Anuncie: <strong className="font-bold text-amber-300">Planos comerciais e quadro de valores</strong>
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* ======================================================== */}
      {/* 2. HERO, SERVIÇOS & MARÉS (APENAS NA PÁGINA INICIAL)     */}
      {/* ======================================================== */}
      {activeMainView === 'inicio' && (
        <>
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      scrollToResults();
                    }
                  }}
                  placeholder="Buscar charretes, pousadas, peixadas..."
                  className="w-full bg-white text-slate-900 placeholder-slate-500 pl-11 pr-28 py-3.5 rounded-full text-sm font-semibold shadow-2xl border-2 border-white/20 focus:outline-hidden focus:ring-4 focus:ring-amber-400/30 transition"
                />
                <div className="absolute right-2 flex items-center gap-1">
                  {searchTerm && (
                    <button
                      onClick={() => onSearchChange('')}
                      className="text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
                      title="Limpar busca"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={scrollToResults}
                    className="bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 px-3 py-1.5 rounded-full text-xs font-black shadow-md transition flex items-center gap-1 cursor-pointer"
                    title="Pressione Enter ou clique para descer aos resultados"
                  >
                    <span>Buscar</span>
                  </button>
                </div>
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
        <div id="secao-navegacao" className="flex flex-col xl:flex-row items-center justify-between gap-3 p-2.5 sm:p-3 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-2xl">
          
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full xl:w-auto">
            {/* Tab 1: Início (Todos) */}
            <button
              id="tab-btn-inicio"
              onClick={() => {
                setActiveMainView('inicio');
                onSelectCategory('todos');
              }}
              className={`px-3.5 sm:px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeMainView === 'inicio'
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20 scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Início (Tudo)</span>
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                activeMainView === 'inicio' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-amber-400'
              }`}>
                {activeFilteredAds.length + activeFilteredPartners.length}
              </span>
            </button>

            {/* Tab 2: Portal de Anúncios */}
            <button
              id="tab-btn-portal"
              onClick={() => {
                setActiveMainView('portal');
                onSelectCategory('todos');
              }}
              className={`px-3.5 sm:px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeMainView === 'portal'
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20 scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Portal de Anúncios</span>
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                activeMainView === 'portal' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-amber-400'
              }`}>
                {activeFilteredAds.length}
              </span>
            </button>

            {/* Tab 3: Guia da Ilha (Parceiros) */}
            <button
              id="tab-btn-guia"
              onClick={() => {
                setActiveMainView('guia');
                onSelectCategory('todos');
              }}
              className={`px-3.5 sm:px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeMainView === 'guia'
                  ? 'bg-teal-400 text-slate-950 shadow-lg shadow-teal-400/20 scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Guia da Ilha</span>
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                activeMainView === 'guia' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-teal-400'
              }`}>
                {activeFilteredPartners.length}
              </span>
            </button>

            {/* Tab 4: Anuncie (Quadro de Valores) */}
            <button
              id="tab-btn-anuncie"
              onClick={() => {
                setActiveMainView('anuncie');
                onSelectCategory('todos');
              }}
              className={`px-3.5 sm:px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeMainView === 'anuncie'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 shadow-lg shadow-amber-400/20 scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Anuncie (Valores)</span>
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                activeMainView === 'anuncie' ? 'bg-slate-950/20 text-slate-950' : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
              }`}>
                R$ 30/mês
              </span>
            </button>
          </div>

          {/* Active Filter Badge & Anuncie CTA */}
          <div className="flex items-center gap-3 w-full xl:w-auto justify-between xl:justify-end text-xs">
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
                {activeMainView === 'inicio' && 'Página Inicial: Exibindo todos os anúncios e parceiros juntos'}
                {activeMainView === 'portal' && 'Portal: Exibindo somente os anúncios comerciais e banners'}
                {activeMainView === 'guia' && 'Guia: Exibindo somente os parceiros credenciados na ilha'}
                {activeMainView === 'anuncie' && 'Anuncie: Quadro de valores e planos comerciais'}
              </span>
            )}

            {activeMainView !== 'anuncie' ? (
              <button
                onClick={() => {
                  setActiveMainView('anuncie');
                  onSelectCategory('todos');
                }}
                className="font-black text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 px-4 py-2.5 rounded-2xl shadow-md flex items-center gap-2 transition cursor-pointer active:scale-95"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Quadro de Valores</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdmin}
                className="font-black text-xs text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 rounded-2xl shadow-md flex items-center gap-2 transition cursor-pointer active:scale-95"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Painel Admin</span>
              </button>
            )}
          </div>

        </div>

        {/* Search notice if active */}
        {searchTerm && (
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-lg">
            <span className="text-slate-200 font-medium">
              Buscando por: <strong className="text-amber-400 font-black text-sm">"{searchTerm}"</strong> • Encontrados {activeFilteredAds.length} anúncios e {activeFilteredPartners.length} parceiros.
            </span>
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-slate-300 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-bold flex items-center gap-1.5 cursor-pointer transition shadow-xs"
                title="Voltar ao topo da página"
              >
                <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
                <span>Voltar ao topo</span>
              </button>
              <button
                onClick={() => onSearchChange('')}
                className="text-amber-400 hover:text-amber-300 font-bold px-3 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 flex items-center gap-1 cursor-pointer transition"
              >
                <span>Limpar busca</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </section>
      </>
      )}

      {/* ======================================================== */}
      {/* DEDICATED HEADER: PORTAL DE ANÚNCIOS (QUANDO EM PORTAL)  */}
      {/* ======================================================== */}
      {activeMainView === 'portal' && (
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-6 pb-2">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/20 via-slate-900 to-slate-900 border border-amber-500/30 shadow-2xl flex flex-col gap-5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="p-2.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-xl shadow-md">
                    🌟
                  </span>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-white font-heading">
                      Portal de Anúncios Comerciais
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-300">
                      Exibindo <strong>somente os anúncios comerciais</strong> da Ilha de Algodoal com contato direto pelo WhatsApp
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
                <span className="px-4 py-2 rounded-2xl bg-slate-950/80 border border-amber-500/30 text-xs font-bold text-amber-300 shadow-inner">
                  <strong className="text-white font-black">{activeFilteredAds.length}</strong> {activeFilteredAds.length === 1 ? 'anúncio comercial ativo' : 'anúncios comerciais ativos'}
                </span>
              </div>
            </div>

            {/* Quick Category Filters inside Portal */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-xs font-bold text-slate-400 shrink-0">Filtrar por:</span>
              {[
                { id: 'todos', label: 'Todos os Anúncios' },
                { id: 'pousadas', label: '🏨 Pousadas' },
                { id: 'alimentacao', label: '🍲 Restaurantes & Peixadas' },
                { id: 'transporte', label: '🐎 Charretes' },
                { id: 'passeios', label: '⛵ Passeios de Rabeta' },
                { id: 'compras', label: '🛒 Depósitos & Gelo' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* DEDICATED HEADER: GUIA DA ILHA (QUANDO EM GUIA)          */}
      {/* ======================================================== */}
      {activeMainView === 'guia' && (
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-6 pb-2">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-500/20 via-slate-900 to-slate-900 border border-teal-500/30 shadow-2xl flex flex-col gap-5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="p-2.5 rounded-2xl bg-teal-400 text-slate-950 font-black text-xl shadow-md">
                    🌴
                  </span>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-white font-heading">
                      Guia da Ilha de Algodoal
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-300">
                      Exibindo <strong>somente os parceiros credenciados</strong> da ilha (charreteiros, barcos, pousadas e barracas)
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
                <span className="px-4 py-2 rounded-2xl bg-slate-950/80 border border-teal-500/30 text-xs font-bold text-teal-300 shadow-inner">
                  <strong className="text-white font-black">{activeFilteredPartners.length}</strong> parceiros cadastrados
                </span>
              </div>
            </div>

            {/* Quick Category Filters inside Guia */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-xs font-bold text-slate-400 shrink-0">Filtrar por:</span>
              {[
                { id: 'todos', label: 'Todos os Parceiros' },
                { id: 'transporte', label: '🐎 Charreteiros' },
                { id: 'passeios', label: '⛵ Barqueiros & Rabetas' },
                { id: 'pousadas', label: '🏨 Pousadas da Ilha' },
                { id: 'alimentacao', label: '🍲 Restaurantes & Barracas' },
                { id: 'compras', label: '🛒 Depósitos de Bebidas' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-teal-400 text-slate-950 font-black shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* DEDICATED HEADER: ANUNCIE (QUANDO EM ANUNCIE)            */}
      {/* ======================================================== */}
      {activeMainView === 'anuncie' && (
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-6 pb-2">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/25 via-slate-900 to-amber-950/30 border border-amber-400/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="p-2.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-xl shadow-md">
                  💎
                </span>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white font-heading">
                    Quadro de Valores & Planos de Anúncio
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Divulgue seu comércio, transporte ou pousada na Ilha de Algodoal • Contato 100% direto no seu WhatsApp
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
              <span className="px-4 py-2 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs shadow-md">
                Plano Destaque: R$ 30/mês
              </span>
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* 6. PORTAL DE ANÚNCIOS (TODOS OS ANÚNCIOS JUNTOS)         */}
      {/* ======================================================== */}
      {(activeMainView === 'inicio' || activeMainView === 'portal') && (
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
      {(activeMainView === 'inicio' || activeMainView === 'guia') && (
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
      {/* 8. QUADRO DE VALORES & PLANOS (ANUNCIE)                  */}
      {/* ======================================================== */}
      {activeMainView === 'anuncie' && (
        <section id="secao-quadro-valores" className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 space-y-10">
          
          {/* Header do Quadro de Valores */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">💎</span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white font-heading">
                  QUADRO DE VALORES • PLANOS DE DIVULGAÇÃO NA ILHA
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
                Conecte seu estabelecimento, transporte ou atração turística a milhares de visitantes em tempo real. Sem intermediários, sem comissões e com contato 100% direto no seu WhatsApp.
              </p>
            </div>

            <button
              onClick={onOpenAdmin}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 transition cursor-pointer shrink-0"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Painel do Administrador</span>
            </button>
          </div>

          {/* Value Highlights Pill Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Tag className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">R$ 30 por mês</p>
                <p className="text-[11px] text-slate-400">Preço justo e acessível</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4 text-teal-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">WhatsApp Direto</p>
                <p className="text-[11px] text-slate-400">Sem taxas nem comissões</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Hero Carousel Topo</p>
                <p className="text-[11px] text-slate-400">Máxima visibilidade</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Sem Fidelidade</p>
                <p className="text-[11px] text-slate-400">Cancele quando quiser</p>
              </div>
            </div>
          </div>

          {/* Cards dos 3 Planos Oficiais */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            
            {/* 1. PLANO MENSAL - MAIS RECOMENDADO (R$ 30/mês) */}
            <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-400/80 shadow-2xl shadow-amber-400/10 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -top-1 right-6">
                <span className="px-3.5 py-1 rounded-b-xl bg-amber-400 text-slate-950 text-[10px] font-black tracking-wider uppercase shadow-md flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  MAIS RECOMENDADO
                </span>
              </div>

              <div className="space-y-5">
                {/* Plan Header */}
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-2xl shadow-inner mb-3">
                    🏆
                  </div>
                  <h3 className="text-xl font-black text-white font-heading">Plano Mensal</h3>
                  <p className="text-xs text-amber-300 font-semibold">Destaque Total & Hero Banner</p>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/20">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-black text-amber-400">R$ 30</span>
                    <span className="text-xs text-slate-300 font-bold">/mês</span>
                  </div>
                  <p className="text-[11px] text-amber-200/80 mt-1">
                    Sem taxa de adesão • Pagamento via PIX direto
                  </p>
                </div>

                {/* Indicado Para */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    INDICADO PARA:
                  </span>
                  <p className="text-xs font-bold text-slate-200">
                    Pousadas e Restaurantes Principais
                  </p>
                </div>

                {/* O Que Inclui */}
                <div className="space-y-2.5 pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    O QUE INCLUI:
                  </span>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>Banner rotativo no topo</strong> (Hero Carousel da tela inicial)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>Destaque 1º lugar</strong> na categoria</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>Saiba mais:</strong> página completa com fotos e detalhes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>Botão de WhatsApp direto</strong> para reservas e pedidos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>Selo de Estabelecimento Oficial Verificado</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Card Footer & CTA */}
              <div className="pt-6 mt-6 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Empresas neste plano:</span>
                  <span className="font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-lg">
                    {advertisements.filter(a => a.active).length || 3} ativas
                  </span>
                </div>

                <a
                  href={`https://wa.me/5591981129988?text=${encodeURIComponent('Olá! Quero contratar o Plano Mensal de R$ 30/mês no Algodoal Connect para meu negócio.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm text-center flex items-center justify-center gap-2 shadow-xl shadow-amber-400/20 transition-transform active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Quero Este Plano (WhatsApp)</span>
                </a>
              </div>
            </div>

            {/* 2. PLANO FREE - COMUNITÁRIO (Grátis) */}
            <div className="rounded-3xl p-6 sm:p-7 bg-slate-900/90 border border-slate-800 flex flex-col justify-between relative shadow-xl">
              <div className="absolute -top-1 right-6">
                <span className="px-3 py-1 rounded-b-xl bg-slate-800 text-slate-300 text-[10px] font-black tracking-wider uppercase border border-slate-700 flex items-center gap-1">
                  <Store className="w-3 h-3" />
                  COMUNITÁRIO
                </span>
              </div>

              <div className="space-y-5">
                {/* Plan Header */}
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl mb-3">
                    🏪
                  </div>
                  <h3 className="text-xl font-black text-white font-heading">Plano Free</h3>
                  <p className="text-xs text-slate-400 font-semibold">Cadastro Gratuito no Guia</p>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-black text-slate-100">Grátis</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Apoio aos trabalhadores autônomos da ilha
                  </p>
                </div>

                {/* Indicado Para */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    INDICADO PARA:
                  </span>
                  <p className="text-xs font-bold text-slate-200">
                    Barracas, Depósitos e Passeios de Barco
                  </p>
                </div>

                {/* O Que Inclui */}
                <div className="space-y-2.5 pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    O QUE INCLUI:
                  </span>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <span>Anúncio padrão na listagem da categoria</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <span>Botão de WhatsApp direto com o cliente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <span>Localização, horários e contato no guia da ilha</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <span>Inclusão na busca rápida e catálogo de serviços</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Card Footer & CTA */}
              <div className="pt-6 mt-6 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Estabelecimentos:</span>
                  <span className="font-black text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded-lg">
                    {partners.length || 3} cadastrados
                  </span>
                </div>

                <a
                  href={`https://wa.me/5591981129988?text=${encodeURIComponent('Olá! Gostaria de cadastrar meu negócio gratuitamente no Guia da Ilha de Algodoal.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Cadastrar Gratuitamente no Guia</span>
                </a>
              </div>
            </div>

            {/* 3. PLANO DIVULGAÇÃO - CULTURAL / EVENTOS (Grátis) */}
            <div className="rounded-3xl p-6 sm:p-7 bg-slate-900/90 border border-slate-800 flex flex-col justify-between relative shadow-xl">
              <div className="absolute -top-1 right-6">
                <span className="px-3 py-1 rounded-b-xl bg-purple-900/80 text-purple-300 text-[10px] font-black tracking-wider uppercase border border-purple-700/80 flex items-center gap-1">
                  <PartyPopper className="w-3 h-3" />
                  CULTURAL / EVENTOS
                </span>
              </div>

              <div className="space-y-5">
                {/* Plan Header */}
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-2xl mb-3">
                    🎉
                  </div>
                  <h3 className="text-xl font-black text-white font-heading">Divulgação</h3>
                  <p className="text-xs text-purple-300 font-semibold">Apoio Cultural & Atrações</p>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/40">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-black text-purple-300">Grátis</span>
                  </div>
                  <p className="text-[11px] text-purple-200/80 mt-1">
                    Apoio a artistas, mestres de carimbó e produtores locais
                  </p>
                </div>

                {/* Indicado Para */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    INDICADO PARA:
                  </span>
                  <p className="text-xs font-bold text-slate-200">
                    Luau, Shows de Reggae, Festas e Artesanato
                  </p>
                </div>

                {/* O Que Inclui */}
                <div className="space-y-2.5 pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    O QUE INCLUI:
                  </span>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span>Banner rotativo na página inicial e eventos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span>Divulgação cultural e apoio a artistas locais</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span>Data, local e WhatsApp dos organizadores</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span>Destaque na Agenda Cultural da Ilha</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Card Footer & CTA */}
              <div className="pt-6 mt-6 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Eventos ativos:</span>
                  <span className="font-black text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded-lg">
                    Apoio Aberto
                  </span>
                </div>

                <a
                  href={`https://wa.me/5591981129988?text=${encodeURIComponent('Olá! Gostaria de divulgar um evento cultural ou luau gratuitamente no Algodoal Connect.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-2xl bg-purple-900/30 hover:bg-purple-900/50 text-purple-300 border border-purple-500/40 font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Divulgar Evento Cultural (Grátis)</span>
                </a>
              </div>
            </div>

          </div>

          {/* Tabela Comparativa de Recursos */}
          <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
            <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>📊</span>
              <span>Comparativo Detalhado dos Planos</span>
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-3 px-4 font-bold">Recurso / Vantagem</th>
                    <th className="py-3 px-4 font-black text-amber-400">Plano Mensal (R$ 30)</th>
                    <th className="py-3 px-4 font-bold text-slate-300">Plano Free (Grátis)</th>
                    <th className="py-3 px-4 font-bold text-purple-400">Divulgação Cultural</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td className="py-3 px-4 font-semibold">Banner no Topo (Hero Carousel)</td>
                    <td className="py-3 px-4 font-bold text-amber-400">✅ Sim (Rotativo Destaque)</td>
                    <td className="py-3 px-4 text-slate-500">— Não</td>
                    <td className="py-3 px-4 text-purple-300">✅ Sim (Semana do Evento)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">Posição de Destaque nas Buscas</td>
                    <td className="py-3 px-4 font-bold text-amber-400">✅ 1º Lugar Prioritário</td>
                    <td className="py-3 px-4 text-slate-400">Padrão da Categoria</td>
                    <td className="py-3 px-4 text-purple-300">Aba Eventos & Agenda</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">Botão de WhatsApp Direto</td>
                    <td className="py-3 px-4 font-bold text-amber-400">✅ Sim (Sem comissão)</td>
                    <td className="py-3 px-4 font-semibold text-teal-400">✅ Sim (Sem comissão)</td>
                    <td className="py-3 px-4 font-semibold text-purple-400">✅ Sim (Organizadores)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">Galeria de Fotos em Alta Definição</td>
                    <td className="py-3 px-4 font-bold text-amber-400">✅ Completa (Fotos & Detalhes)</td>
                    <td className="py-3 px-4 text-slate-400">1 Foto de Perfil</td>
                    <td className="py-3 px-4 text-purple-300">Cartaz / Flyer Oficial</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">Suporte do Gestor da Ilha</td>
                    <td className="py-3 px-4 font-bold text-amber-400">✅ Prioritário via WhatsApp</td>
                    <td className="py-3 px-4 text-slate-400">Comunitário</td>
                    <td className="py-3 px-4 text-purple-300">Apoio Cultural</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Botões de Ação para Navegação */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => {
                setActiveMainView('portal');
                onSelectCategory('todos');
                setTimeout(() => {
                  const el = document.getElementById('secao-portal-anuncios') || document.getElementById('secao-navegacao');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 font-bold text-xs flex items-center gap-2 cursor-pointer transition shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ver Portal de Anúncios</span>
            </button>

            <button
              onClick={() => {
                setActiveMainView('guia');
                onSelectCategory('todos');
                setTimeout(() => {
                  const el = document.getElementById('secao-guia-parceiros') || document.getElementById('secao-navegacao');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-teal-400 font-bold text-xs flex items-center gap-2 cursor-pointer transition shadow-md"
            >
              <Compass className="w-4 h-4" />
              <span>Ver Guia da Ilha (Parceiros)</span>
            </button>

            <button
              onClick={() => {
                setActiveMainView('inicio');
                onSelectCategory('todos');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer transition shadow-lg shadow-amber-400/20"
            >
              <Home className="w-4 h-4" />
              <span>Voltar para Página Inicial</span>
            </button>
          </div>

        </section>
      )}

      {/* ======================================================== */}
      {/* BANNER CTA QUANDO NA PÁGINA INICIAL                      */}
      {/* ======================================================== */}
      {activeMainView === 'inicio' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-8">
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-500/15 via-slate-900 to-teal-500/10 border border-amber-400/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black">
                <Tag className="w-3.5 h-3.5" />
                <span>PLANOS COMERCIAIS & DIVULGAÇÃO</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
                Quer anunciar sua Pousada, Restaurante ou Barco no Algodoal Connect?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Plano com destaque total por apenas <strong className="text-amber-400 font-bold">R$ 30/mês</strong>, banner no topo da página e contato direto no seu WhatsApp sem intermediários.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveMainView('anuncie');
                onSelectCategory('todos');
                setTimeout(() => {
                  const el = document.getElementById('secao-quadro-valores') || document.getElementById('secao-navegacao');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-400/20 flex items-center gap-2 transition cursor-pointer shrink-0 active:scale-95"
            >
              <Tag className="w-4 h-4" />
              <span>Ver Quadro de Valores</span>
            </button>
          </div>
        </div>
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
      <footer className="w-full bg-[#020408] border-t border-slate-900 pt-6 pb-24 md:pb-6 text-xs text-slate-400">
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
            <p>Algodoal Connect © 2026 - Ilha de Maiandeua, Pará</p>
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
