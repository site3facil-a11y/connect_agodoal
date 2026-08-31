import React from 'react';
import { Waves, ArrowUpRight, ArrowDownRight, Compass, Info, Moon } from 'lucide-react';
import { TideDayEntry } from '../../types/index.ts';

interface TideWaveWidgetProps {
  onOpenFullTides: () => void;
  currentTideDay?: TideDayEntry | null;
}

export const TideWaveWidget: React.FC<TideWaveWidgetProps> = ({
  onOpenFullTides,
  currentTideDay
}) => {
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
    <section className="px-4 py-3 bg-slate-950">
      <div className="rounded-3xl bg-gradient-to-br from-teal-950/80 via-slate-900 to-slate-900 border border-teal-500/30 p-4 text-white shadow-xl relative overflow-hidden">
        {/* Decorative Wave Glow */}
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/30">
              <Waves className="w-4 h-4 text-teal-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-white">
                  Tábua de Marés de Hoje
                </h4>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Marapanim
                </span>
              </div>
              <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                <Moon className="w-3 h-3 text-amber-400" />
                Lua {moonPhase} • Coeficiente {coefficient} (Maré Viva)
              </span>
            </div>
          </div>

          <button
            onClick={onOpenFullTides}
            className="text-[11px] font-bold text-teal-400 hover:text-teal-300 flex items-center gap-0.5 transition cursor-pointer"
          >
            Ver Mês
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dynamic 4-Point Tide Timeline Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          {/* Preamar 1 */}
          <div className="p-2.5 rounded-2xl bg-teal-950/40 border border-teal-800/50">
            <div className="flex items-center justify-between text-[10px] text-teal-300 font-bold mb-1">
              <span className="flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                1ª Preamar
              </span>
              <span className="text-[9px] px-1 rounded bg-teal-900/60 text-teal-200">Alta</span>
            </div>
            <span className="text-base font-black text-white block leading-none">
              {highTides[0]?.time || '04:30'}
            </span>
            <span className="text-[10px] font-bold text-emerald-400 mt-1 block">
              {highTides[0]?.height || '4.2m'}
            </span>
          </div>

          {/* Baixa-mar 1 */}
          <div className="p-2.5 rounded-2xl bg-slate-800/40 border border-slate-700/50">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1">
              <span className="flex items-center gap-1">
                <ArrowDownRight className="w-3 h-3 text-amber-400" />
                1ª Baixa-mar
              </span>
              <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-300">Seca</span>
            </div>
            <span className="text-base font-black text-white block leading-none">
              {lowTides[0]?.time || '10:40'}
            </span>
            <span className="text-[10px] font-bold text-amber-400 mt-1 block">
              {lowTides[0]?.height || '0.4m'}
            </span>
          </div>

          {/* Preamar 2 */}
          <div className="p-2.5 rounded-2xl bg-teal-950/40 border border-teal-800/50">
            <div className="flex items-center justify-between text-[10px] text-teal-300 font-bold mb-1">
              <span className="flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                2ª Preamar
              </span>
              <span className="text-[9px] px-1 rounded bg-teal-900/60 text-teal-200">Alta</span>
            </div>
            <span className="text-base font-black text-white block leading-none">
              {highTides[1]?.time || '16:45'}
            </span>
            <span className="text-[10px] font-bold text-emerald-400 mt-1 block">
              {highTides[1]?.height || '4.4m'}
            </span>
          </div>

          {/* Baixa-mar 2 */}
          <div className="p-2.5 rounded-2xl bg-slate-800/40 border border-slate-700/50">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1">
              <span className="flex items-center gap-1">
                <ArrowDownRight className="w-3 h-3 text-amber-400" />
                2ª Baixa-mar
              </span>
              <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-300">Seca</span>
            </div>
            <span className="text-base font-black text-white block leading-none">
              {lowTides[1]?.time || '23:05'}
            </span>
            <span className="text-[10px] font-bold text-amber-400 mt-1 block">
              {lowTides[1]?.height || '0.5m'}
            </span>
          </div>
        </div>

        {/* Marine Alert Banner */}
        <div className="p-2.5 rounded-2xl bg-slate-800/70 border border-slate-700/80 flex items-start gap-2 text-xs">
          <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-300 leading-snug">
            <strong className="text-teal-300">Dica Náutica:</strong> Maré favorável para travessia de rabeta no Furo Velho e banho tranquilo nas piscinas naturais da Princesa entre 14h e 18h.
          </p>
        </div>
      </div>
    </section>
  );
};
