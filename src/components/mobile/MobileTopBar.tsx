import React from 'react';
import { Sparkles, Sun, Waves, Search, ShieldCheck, User, MapPin, Bell } from 'lucide-react';
import { UserProfile } from '../../types/index.ts';

interface MobileTopBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onOpenAdmin: () => void;
  onOpenTides: () => void;
  currentUser?: UserProfile | null;
  currentTideSummary?: string;
}

export const MobileTopBar: React.FC<MobileTopBarProps> = ({
  searchTerm,
  onSearchChange,
  onOpenAdmin,
  onOpenTides,
  currentUser,
  currentTideSummary = '🌊 Preamar 16:45 (4.2m) • Maré Enchendo'
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md text-white border-b border-slate-800/80 shadow-md">
      {/* Dynamic Status Pill */}
      <div className="px-4 py-1.5 bg-gradient-to-r from-teal-950 via-slate-900 to-amber-950/40 border-b border-teal-900/40 flex items-center justify-between text-[11px]">
        <button 
          onClick={onOpenTides}
          className="flex items-center gap-1.5 text-teal-300 font-semibold hover:text-teal-200 transition cursor-pointer"
        >
          <Waves className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
          <span className="truncate max-w-[210px] sm:max-w-none">{currentTideSummary}</span>
        </button>

        <div className="flex items-center gap-2 text-slate-400 shrink-0">
          <span className="flex items-center gap-1 text-amber-400 font-bold">
            <Sun className="w-3 h-3 text-amber-400 animate-spin-slow" />
            31°C
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-600" />
          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
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
              <h1 className="text-base font-black font-heading tracking-tight text-white leading-none">
                Algodoal<span className="text-amber-400">Connect</span>
              </h1>
              <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30">
                APA
              </span>
            </div>
            <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-2.5 h-2.5 text-amber-400" />
              Ilha de Maiandeua, Pará
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAdmin}
            title={currentUser?.role === 'admin' ? 'Painel do Administrador (Ativo)' : 'Login de Administrador'}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer text-xs font-bold"
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${currentUser?.role === 'admin' ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span className="text-[11px] hidden sm:inline">
              {currentUser?.role === 'admin' ? 'Admin' : 'Painel'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar charretes, rabetas, pousadas, peixadas..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-800/90 text-white placeholder-slate-400 text-xs font-medium border border-slate-700/80 focus:outline-hidden focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 transition shadow-inner"
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
