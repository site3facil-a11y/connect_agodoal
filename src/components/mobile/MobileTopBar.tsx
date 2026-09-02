import React from 'react';
import { Sparkles, Sun, Moon, Waves, Search, ShieldCheck, User, MapPin, Bell } from 'lucide-react';
import { UserProfile, WeatherData } from '../../types/index.ts';

interface MobileTopBarProps {
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onOpenAdmin: () => void;
  onOpenTides: () => void;
  onOpenWeather?: () => void;
  currentUser?: UserProfile | null;
  currentTideSummary?: string;
  weather?: WeatherData | null;
}

export const MobileTopBar: React.FC<MobileTopBarProps> = ({
  theme = 'dark',
  onToggleTheme,
  searchTerm,
  onSearchChange,
  onOpenAdmin,
  onOpenTides,
  onOpenWeather,
  currentUser,
  currentTideSummary = '🌊 Preamar 16:45 (4.2m) • Maré Enchendo',
  weather
}) => {
  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b shadow-md transition-colors ${
      isDark ? 'bg-slate-900/95 text-white border-slate-800/80' : 'bg-white/95 text-slate-900 border-slate-200'
    }`}>
      {/* Dynamic Status Pill */}
      <div className={`px-4 py-1.5 border-b flex items-center justify-between text-[11px] ${
        isDark 
          ? 'bg-gradient-to-r from-teal-950 via-slate-900 to-amber-950/40 border-teal-900/40 text-slate-300' 
          : 'bg-gradient-to-r from-teal-50 via-slate-50 to-amber-50 border-teal-100 text-slate-700'
      }`}>
        <button 
          onClick={onOpenTides}
          className={`flex items-center gap-1.5 font-semibold transition cursor-pointer ${
            isDark ? 'text-teal-300 hover:text-teal-200' : 'text-teal-700 hover:text-teal-800'
          }`}
        >
          <Waves className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
          <span className="truncate max-w-[200px] sm:max-w-none">{currentTideSummary}</span>
        </button>

        <div className="flex items-center gap-2 text-slate-400 shrink-0">
          <button
            onClick={onOpenWeather}
            title="Ver detalhes de clima e temperatura"
            className="flex items-center gap-1 text-amber-500 hover:text-amber-600 dark:hover:text-amber-400 font-bold transition cursor-pointer"
          >
            {weather ? (
              <>
                <span className="text-xs">{weather.is_day ? '☀️' : '🌙'}</span>
                <span>{weather.temperature}°C</span>
              </>
            ) : (
              <>
                <Sun className="w-3 h-3 text-amber-500 animate-spin-slow" />
                <span>31°C</span>
              </>
            )}
          </button>
          <span className="w-1 h-1 rounded-full bg-slate-400" />
          <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Ilha Online
          </span>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-teal-900/30">
            <span className="text-lg">🌴</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className={`text-base font-black font-heading tracking-tight leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Algodoal<span className="text-amber-500">Connect</span>
              </h1>
              <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                GUIA & SERVIÇOS
              </span>
            </div>
            <p className={`text-[10px] flex items-center gap-1 mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <MapPin className="w-2.5 h-2.5 text-amber-500" />
              Ilha de Maiandeua, Pará
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5">
          {/* Theme Toggle */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              title={isDark ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'}
              className={`p-2 rounded-xl transition cursor-pointer text-xs border ${
                isDark 
                  ? 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700' 
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
              }`}
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          )}

          <button
            onClick={onOpenAdmin}
            title={currentUser?.role === 'admin' ? 'Painel do Administrador (Ativo)' : 'Login de Administrador'}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border transition cursor-pointer text-xs font-bold ${
              isDark 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
            }`}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${currentUser?.role === 'admin' ? 'text-emerald-500' : 'text-amber-500'}`} />
            <span className="text-[11px] hidden sm:inline">
              {currentUser?.role === 'admin' ? 'Admin' : 'Painel'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar charretes, rabetas, pousadas, peixadas..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs font-medium border focus:outline-hidden transition shadow-inner ${
              isDark
                ? 'bg-slate-800/90 text-white placeholder-slate-400 border-slate-700/80 focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20'
                : 'bg-slate-50 text-slate-900 placeholder-slate-400 border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20'
            }`}
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded-md bg-slate-700"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
