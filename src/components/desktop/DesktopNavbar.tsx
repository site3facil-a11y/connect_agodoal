import React from 'react';
import { 
  Sun, 
  Moon, 
  Waves, 
  Search, 
  ShieldCheck, 
  User, 
  MapPin, 
  Truck, 
  Hotel, 
  Utensils, 
  Compass, 
  ShoppingBag, 
  PartyPopper,
  Calendar,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { UserProfile } from '../../types/index.ts';

interface DesktopNavbarProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenAdmin: () => void;
  onOpenTides: () => void;
  onOpenCharreteCalc: () => void;
  onOpenQuickOrder: () => void;
  currentUser?: UserProfile | null;
  currentTideSummary?: string;
}

export const DesktopNavbar: React.FC<DesktopNavbarProps> = ({
  theme,
  onToggleTheme,
  searchTerm,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onOpenAdmin,
  onOpenTides,
  onOpenCharreteCalc,
  onOpenQuickOrder,
  currentUser,
  currentTideSummary = '🌊 Preamar 16:45 (4.4m) • Maré Alta'
}) => {
  const isDark = theme === 'dark';

  const NAV_CATEGORIES = [
    { id: 'todos', label: 'Todos os Serviços', icon: Sparkles },
    { id: 'transporte', label: 'Charretes APA', icon: Truck },
    { id: 'pousadas', label: 'Pousadas', icon: Hotel },
    { id: 'alimentacao', label: 'Gastronomia', icon: Utensils },
    { id: 'passeios', label: 'Rabetas & Lago', icon: Compass },
    { id: 'compras', label: 'Disk Gelo & Água', icon: ShoppingBag },
    { id: 'eventos', label: 'Luaus & Carimbó', icon: PartyPopper }
  ];

  return (
    <header className={`w-full sticky top-0 z-40 transition-colors duration-200 border-b ${
      isDark 
        ? 'bg-slate-900/95 border-slate-800 text-slate-100 backdrop-blur-md shadow-lg shadow-black/20' 
        : 'bg-white/95 border-slate-200 text-slate-800 backdrop-blur-md shadow-md shadow-slate-100'
    }`}>
      {/* Top Marine & Climate Strip */}
      <div className={`px-6 py-1.5 flex items-center justify-between text-xs font-semibold border-b ${
        isDark 
          ? 'bg-gradient-to-r from-teal-950/80 via-slate-900 to-amber-950/30 border-teal-900/40 text-slate-300' 
          : 'bg-gradient-to-r from-teal-50 via-slate-50 to-amber-50 border-teal-100 text-slate-600'
      }`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenTides}
            className={`flex items-center gap-1.5 transition cursor-pointer hover:underline ${
              isDark ? 'text-teal-300 hover:text-teal-200' : 'text-teal-700 hover:text-teal-800'
            }`}
          >
            <Waves className="w-3.5 h-3.5 animate-pulse text-teal-500" />
            <span>{currentTideSummary}</span>
          </button>

          <span className="hidden md:inline text-slate-400">|</span>

          <span className="hidden md:flex items-center gap-1 text-amber-500 font-bold">
            <Sun className="w-3.5 h-3.5 animate-spin-slow" />
            31°C Sol & Brisa do Atlântico
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            APA Ilha de Maiandeua • Comunidade Ativa
          </span>

          <div className="h-3 w-px bg-slate-400/30" />

          {/* Theme Switcher Button */}
          <button
            onClick={onToggleTheme}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
              isDark 
                ? 'bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700' 
                : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
            }`}
            title={isDark ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Modo Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-700" />
                <span>Modo Escuro</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Row: Brand, Search, Direct Quick Buttons, and Admin */}
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-6">
        
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => onSelectCategory('todos')}>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-md shadow-teal-700/20">
            <span>🌴</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xl font-black font-heading tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Algodoal<span className="text-amber-500">Connect</span>
              </span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-500 border border-teal-500/30">
                APA MAIANDEUA
              </span>
            </div>
            <p className={`text-xs flex items-center gap-1 mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <MapPin className="w-3 h-3 text-amber-500" />
              Guia & SuperApp Oficial da Ilha de Algodoal, Pará
            </p>
          </div>
        </div>

        {/* Global Instant Search Bar */}
        <div className="flex-1 max-w-md relative hidden md:block">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar charretes, rabetas, pousadas, peixadas, disk gelo..."
            className={`w-full pl-10 pr-9 py-2 rounded-2xl text-xs font-medium border transition focus:outline-hidden ${
              isDark 
                ? 'bg-slate-800/90 text-white placeholder-slate-400 border-slate-700 focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20' 
                : 'bg-slate-50 text-slate-900 placeholder-slate-400 border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20'
            }`}
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
            >
              ✕
            </button>
          )}
        </div>

        {/* Desktop Quick Direct Shortcuts */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenCharreteCalc}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${
              isDark 
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25' 
                : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Truck className="w-4 h-4 text-amber-500" />
            <span>Pedir Charrete</span>
          </button>

          <button
            onClick={onOpenQuickOrder}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${
              isDark 
                ? 'bg-sky-500/15 border-sky-500/40 text-sky-300 hover:bg-sky-500/25' 
                : 'bg-sky-50 border-sky-300 text-sky-800 hover:bg-sky-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-sky-500" />
            <span>Disk Gelo & Água</span>
          </button>

          <button
            onClick={onOpenTides}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${
              isDark 
                ? 'bg-teal-500/15 border-teal-500/40 text-teal-300 hover:bg-teal-500/25' 
                : 'bg-teal-50 border-teal-300 text-teal-800 hover:bg-teal-100'
            }`}
          >
            <Waves className="w-4 h-4 text-teal-500" />
            <span>Marés do Mês</span>
          </button>

          {/* Admin Button */}
          <button
            onClick={onOpenAdmin}
            className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer border ${
              currentUser?.role === 'admin'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                : isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${currentUser?.role === 'admin' ? 'text-slate-950' : 'text-amber-500'}`} />
            <span>{currentUser?.role === 'admin' ? 'Admin Ativo' : 'Painel Gestor'}</span>
          </button>
        </div>
      </div>

      {/* Category Navigation Bar (Desktop Grid/Pills) */}
      <div className={`px-6 py-2 border-t flex items-center justify-between overflow-x-auto no-scrollbar ${
        isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto w-full flex items-center gap-2">
          {NAV_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-teal-500 text-slate-950 shadow-sm font-black'
                    : isDark
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-teal-500'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
