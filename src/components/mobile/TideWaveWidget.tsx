import React from 'react';
import { Waves, ArrowUpRight, ArrowDownRight, Compass, Info, Moon } from 'lucide-react';
import { TideDayEntry } from '../../types/index.ts';

interface TideWaveWidgetProps {
  theme?: 'dark' | 'light';
  onOpenFullTides: () => void;
  currentTideDay?: TideDayEntry | null;
}

export const TideWaveWidget: React.FC<TideWaveWidgetProps> = ({
  theme = 'dark',
  onOpenFullTides,
  currentTideDay
}) => {
  const isDark = theme === 'dark';

  // Default values if not loaded
  const highTides = currentTideDay?.high_tides || [
    { time: '04:30', height: '4.2m' },
    { time: '16:45', height: '4.4m' }
  ];

  const lowTides = currentTideDay?.low_tides || [
    { time: '10:40', height: '0.4m' },
    { time: '23:05', height: '0.5m' }
  ];

  const moonPhase = currentTideDay?.moon_phase || 'Cheia';
  const coefficient = currentTideDay?.coefficient || 85;

  return (
    <section className={`px-4 py-3 transition-colors ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className={`rounded-3xl border p-4 shadow-xl relative overflow-hidden transition-colors ${
        isDark 
          ? 'bg-gradient-to-br from-teal-950/80 via-slate-900 to-slate-900 border-teal-500/30 text-white' 
          : 'bg-gradient-to-br from-teal-50 via-white to-sky-50 border-teal-200 text-slate-900'
      }`}>
        {/* Decorative Wave Glow */}
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-500 flex items-center justify-center border border-teal-500/30">
              <Waves className="w-4 h-4 text-teal-500 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Tábua de Marés de Hoje
                </h4>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-600 border border-teal-500/30">
                  Marapanim
                </span>
              </div>
              <span className={`text-[10px] flex items-center gap-1 mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Moon className="w-3 h-3 text-amber-500" />
                Lua {moonPhase} • Coeficiente {coefficient} (Maré Viva)
              </span>
            </div>
          </div>

          <button
            onClick={onOpenFullTides}
            className="text-[11px] font-bold text-teal-600 hover:text-teal-700 flex items-center gap-0.5 transition cursor-pointer"
          >
            Ver Mês Inteiro →
          </button>
        </div>

        {/* 4 Tides Pill Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          {/* High Tide 1 */}
          <div className={`p-2.5 rounded-2xl border flex items-center justify-between ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div>
              <span className="text-[9px] uppercase font-black text-teal-500 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-teal-500" />
                Preia-mar 1
              </span>
              <span className={`text-sm font-black block mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{highTides[0]?.time}</span>
            </div>
            <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-teal-500/20 text-teal-600">
              {highTides[0]?.height}
            </span>
          </div>

          {/* Low Tide 1 */}
          <div className={`p-2.5 rounded-2xl border flex items-center justify-between ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div>
              <span className="text-[9px] uppercase font-black text-amber-500 flex items-center gap-1">
                <ArrowDownRight className="w-3 h-3 text-amber-500" />
                Baixa-mar 1
              </span>
              <span className={`text-sm font-black block mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{lowTides[0]?.time}</span>
            </div>
            <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-600">
              {lowTides[0]?.height}
            </span>
          </div>

          {/* High Tide 2 */}
          <div className={`p-2.5 rounded-2xl border flex items-center justify-between ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div>
              <span className="text-[9px] uppercase font-black text-teal-500 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-teal-500" />
                Preia-mar 2
              </span>
              <span className={`text-sm font-black block mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{highTides[1]?.time}</span>
            </div>
            <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-teal-500/20 text-teal-600">
              {highTides[1]?.height}
            </span>
          </div>

          {/* Low Tide 2 */}
          <div className={`p-2.5 rounded-2xl border flex items-center justify-between ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div>
              <span className="text-[9px] uppercase font-black text-amber-500 flex items-center gap-1">
                <ArrowDownRight className="w-3 h-3 text-amber-500" />
                Baixa-mar 2
              </span>
              <span className={`text-sm font-black block mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{lowTides[1]?.time}</span>
            </div>
            <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-600">
              {lowTides[1]?.height}
            </span>
          </div>
        </div>

        {/* Tip for Traversal */}
        <div className={`p-2 rounded-xl text-[11px] flex items-center gap-2 ${
          isDark ? 'bg-slate-950/60 text-slate-300' : 'bg-slate-100/90 text-slate-700'
        }`}>
          <Compass className="w-3.5 h-3.5 text-teal-500 shrink-0" />
          <span>
            <strong>Dica de Travessia:</strong> Barcos navegam melhor em maré alta. Charretes operam com conforto em maré baixa pela faixa de areia.
          </span>
        </div>
      </div>
    </section>
  );
};
