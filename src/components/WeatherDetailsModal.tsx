import React from 'react';
import { 
  X, 
  Sun, 
  Moon, 
  CloudSun, 
  Wind, 
  Droplets, 
  ShieldAlert, 
  Thermometer, 
  Compass, 
  MapPin, 
  Radio, 
  RefreshCw,
  Waves,
  Calendar
} from 'lucide-react';
import { WeatherData, TideDayEntry } from '../types/index.ts';

interface WeatherDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  weather: WeatherData | null;
  isLoading?: boolean;
  onRefresh?: () => void;
  onOpenTides?: () => void;
}

export const WeatherDetailsModal: React.FC<WeatherDetailsModalProps> = ({
  isOpen,
  onClose,
  weather,
  isLoading,
  onRefresh,
  onOpenTides
}) => {
  if (!isOpen) return null;

  const isDay = weather?.is_day ?? true;
  const temp = weather?.temperature ?? 31;
  const apparentTemp = weather?.apparent_temperature ?? (temp + 3);
  const humidity = weather?.humidity ?? 78;
  const windSpeed = weather?.wind_speed ?? 18;
  const uvIndex = weather?.uv_index ?? (isDay ? 9 : 0);

  const getUVBadge = (uv: number) => {
    if (uv <= 2) return { text: 'Baixo', color: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' };
    if (uv <= 5) return { text: 'Moderado', color: 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30' };
    if (uv <= 7) return { text: 'Alto', color: 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30' };
    if (uv <= 10) return { text: 'Muito Alto', color: 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30' };
    return { text: 'Extremo', color: 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30' };
  };

  const uvBadge = getUVBadge(uvIndex);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`p-5 text-white relative overflow-hidden flex items-center justify-between ${
          isDay 
            ? 'bg-gradient-to-r from-amber-600 via-orange-500 to-teal-600' 
            : 'bg-gradient-to-r from-indigo-950 via-slate-900 to-sky-950'
        }`}>
          <div className="flex items-center gap-3 z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner border border-white/30">
              {isDay ? '☀️' : '🌙'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black font-heading leading-tight">
                  Clima & Tempo em Algodoal
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                  Ao Vivo
                </span>
              </div>
              <p className="text-xs text-white/90 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                APA Ilha de Maiandeua • Marapanim / PA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 z-10">
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isLoading}
                title="Atualizar dados de clima"
                className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current Weather Big Hero */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 text-center">
          <div className="inline-flex items-baseline gap-1 text-slate-900 dark:text-white">
            <span className="text-5xl sm:text-6xl font-black tracking-tight">{temp}</span>
            <span className="text-2xl font-bold text-amber-500">°C</span>
          </div>

          <p className="text-base font-bold text-teal-700 dark:text-teal-400 mt-1 flex items-center justify-center gap-1.5">
            <CloudSun className="w-4 h-4" />
            {weather?.condition || 'Sol & Brisa do Atlântico'}
          </p>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Sensação térmica de <strong>{apparentTemp}°C</strong>
          </p>
        </div>

        {/* 4-Grid Meteorological Stats */}
        <div className="p-5 grid grid-cols-2 gap-3 bg-white dark:bg-slate-900">
          {/* Vento do Atlântico */}
          <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-sky-800 dark:text-sky-300 block">Vento Atlântico</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">{windSpeed} km/h</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">Brisa constante</span>
            </div>
          </div>

          {/* Umidade Relativa */}
          <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/40 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-teal-800 dark:text-teal-300 block">Umidade do Ar</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">{humidity}%</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">Clima equatorial</span>
            </div>
          </div>

          {/* Índice UV */}
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300">Índice UV</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${uvBadge.color}`}>
                  {uvBadge.text}
                </span>
              </div>
              <span className="text-sm font-black text-slate-900 dark:text-white">UV {uvIndex}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">Use protetor solar</span>
            </div>
          </div>

          {/* Temperatura Min / Max */}
          <div className="p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-orange-800 dark:text-orange-300 block">Variação Hoje</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {weather?.temp_min ?? 24}°C - {weather?.temp_max ?? 32}°C
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">Mínima à noite</span>
            </div>
          </div>
        </div>

        {/* Tourist Tips & Tide Link */}
        <div className="p-5 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
            <Radio className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <strong className="text-slate-900 dark:text-white block mb-0.5">Dica para Turistas na Ilha:</strong>
              Com a temperatura de {temp}°C e vento constante do mar, o clima é ideal para caminhadas na Praia da Princesa e passeios de rabeta. Mantenha-se hidratado e consulte a maré antes de atravessar os furos.
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            {onOpenTides && (
              <button
                onClick={() => {
                  onClose();
                  onOpenTides();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-teal-900/20 cursor-pointer"
              >
                <Waves className="w-4 h-4" />
                Ver Tábua de Marés de Hoje
              </button>
            )}

            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
            >
              Fechar
            </button>
          </div>

          <div className="text-[10px] text-center text-slate-400 dark:text-slate-500">
            Fonte: {weather?.source || 'Open-Meteo & Estação Meteorológica Litoral Norte'} • Coordenadas: -0.5969, -47.5750
          </div>
        </div>

      </div>
    </div>
  );
};
