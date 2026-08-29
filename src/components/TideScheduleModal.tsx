import React, { useState, useEffect } from 'react';
import { 
  X, 
  Waves, 
  Calendar, 
  ExternalLink, 
  Compass, 
  Sun, 
  Moon, 
  Sparkles,
  Info,
  RefreshCw
} from 'lucide-react';
import { TideDayEntry } from '../types/index.ts';

interface TideScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TideScheduleModal: React.FC<TideScheduleModalProps> = ({
  isOpen,
  onClose
}) => {
  const [tideDays, setTideDays] = useState<TideDayEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadTides();
    }
  }, [isOpen]);

  const loadTides = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/tides/days');
      const data = await res.json();
      setTideDays(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white text-slate-900 rounded-3xl max-w-3xl w-full max-h-[85vh] shadow-2xl border border-sky-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-sky-900 to-sky-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
              <Waves className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black font-heading">Tábua de Marés de Marapanim & Algodoal</h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-sky-400/20 text-sky-200 border border-sky-400/30">
                  Ao Vivo
                </span>
              </div>
              <p className="text-xs text-sky-100">
                Previsões hidrológicas marítimas para travessia, rabetas e banho de mar.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-sky-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Source info bar */}
        <div className="bg-sky-50 px-5 py-2.5 border-b border-sky-100 flex flex-wrap items-center justify-between text-xs text-sky-900 gap-2">
          <div className="flex items-center gap-1.5 font-semibold">
            <Info className="w-4 h-4 text-sky-600" />
            <span>Fonte de dados: <strong>Tábua de Marés Marapanim</strong> & <strong>Marinha do Brasil (DHN)</strong></span>
          </div>
          <a
            href="https://tabuademares.com/br/para/marapanim"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-sky-700 hover:text-sky-900 underline"
          >
            <span>Ver site oficial</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* List of Days */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
          {isLoading ? (
            <div className="py-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-sky-600" />
              <span className="text-xs font-bold">Carregando previsão de marés...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tideDays.map((day) => (
                <div key={day.id || day.date} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-sky-300 transition">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-sky-600" />
                      <span className="font-black text-sm text-slate-900 font-heading">{day.date}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      Lua {day.moon_phase}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 my-3">
                    <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-100">
                      <div className="text-[10px] font-black uppercase text-sky-800 flex items-center gap-1 mb-1">
                        <Waves className="w-3 h-3 text-sky-600" />
                        <span>Preamar (Maré Alta)</span>
                      </div>
                      {day.high_tides.map((h, i) => (
                        <div key={i} className="text-xs font-black text-slate-900 flex justify-between">
                          <span>{h.time}</span>
                          <span className="text-sky-700">{h.height}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                      <div className="text-[10px] font-black uppercase text-amber-800 flex items-center gap-1 mb-1">
                        <Waves className="w-3 h-3 text-amber-600 rotate-180" />
                        <span>Baixa-mar (Maré Baixa)</span>
                      </div>
                      {day.low_tides.map((l, i) => (
                        <div key={i} className="text-xs font-black text-slate-900 flex justify-between">
                          <span>{l.time}</span>
                          <span className="text-amber-800">{l.height}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {day.recommendations && (
                    <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl leading-relaxed">
                      <strong>Dica para o dia:</strong> {day.recommendations}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
          <span>* As marés na Ilha de Algodoal variam de 0.2m a 4.6m de amplitude.</span>
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black cursor-pointer transition shadow-xs"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
