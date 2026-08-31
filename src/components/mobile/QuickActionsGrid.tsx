import React from 'react';
import { 
  Truck, 
  Compass, 
  Hotel, 
  Utensils, 
  ShoppingBag, 
  Waves, 
  PartyPopper, 
  ShieldCheck, 
  Sparkles,
  PhoneCall
} from 'lucide-react';

interface QuickActionsGridProps {
  theme?: 'dark' | 'light';
  onSelectCategory: (categoryId: string) => void;
  onOpenTides: () => void;
  onOpenCharreteCalculator: () => void;
  onOpenSupplyOrder: () => void;
  onOpenAdmin: () => void;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({
  theme = 'dark',
  onSelectCategory,
  onOpenTides,
  onOpenCharreteCalculator,
  onOpenSupplyOrder,
  onOpenAdmin
}) => {
  const isDark = theme === 'dark';

  const ACTIONS = [
    {
      id: 'charretes',
      title: 'Charretes',
      subtitle: 'Tabela & Pedir',
      emoji: '🐎',
      icon: Truck,
      bg: isDark ? 'from-amber-500/20 to-amber-600/30 border-amber-500/40 text-amber-300' : 'from-amber-100 to-amber-200/80 border-amber-300 text-amber-900',
      badge: 'Oficial APA',
      onClick: onOpenCharreteCalculator
    },
    {
      id: 'rabetas',
      title: 'Barcos & Rabetas',
      subtitle: 'Travessias & Tours',
      emoji: '🚤',
      icon: Compass,
      bg: isDark ? 'from-teal-500/20 to-teal-600/30 border-teal-500/40 text-teal-300' : 'from-teal-100 to-teal-200/80 border-teal-300 text-teal-900',
      badge: 'Marudá ⇄ Ilha',
      onClick: () => onSelectCategory('passeios')
    },
    {
      id: 'pousadas',
      title: 'Pousadas',
      subtitle: 'Chalés & Quartos',
      emoji: '🏨',
      icon: Hotel,
      bg: isDark ? 'from-emerald-500/20 to-emerald-600/30 border-emerald-500/40 text-emerald-300' : 'from-emerald-100 to-emerald-200/80 border-emerald-300 text-emerald-900',
      badge: 'Beira-mar',
      onClick: () => onSelectCategory('pousadas')
    },
    {
      id: 'gastronomia',
      title: 'Onde Comer',
      subtitle: 'Peixada & Açaí',
      emoji: '🍲',
      icon: Utensils,
      bg: isDark ? 'from-rose-500/20 to-rose-600/30 border-rose-500/40 text-rose-300' : 'from-rose-100 to-rose-200/80 border-rose-300 text-rose-900',
      badge: 'Regional',
      onClick: () => onSelectCategory('alimentacao')
    },
    {
      id: 'suprimentos',
      title: 'Gelo & Água 20L',
      subtitle: 'Entrega na Praia',
      emoji: '📦',
      icon: ShoppingBag,
      bg: isDark ? 'from-sky-500/20 to-sky-600/30 border-sky-500/40 text-sky-300' : 'from-sky-100 to-sky-200/80 border-sky-300 text-sky-900',
      badge: 'Disk Praia',
      onClick: onOpenSupplyOrder
    },
    {
      id: 'mares',
      title: 'Tábua de Marés',
      subtitle: 'Previsão Hoje',
      emoji: '🌊',
      icon: Waves,
      bg: isDark ? 'from-blue-500/20 to-blue-600/30 border-blue-500/40 text-blue-300' : 'from-blue-100 to-blue-200/80 border-blue-300 text-blue-900',
      badge: 'Marapanim',
      onClick: onOpenTides
    },
    {
      id: 'eventos',
      title: 'Luaus & Festas',
      subtitle: 'Carimbó & Reggae',
      emoji: '🎉',
      icon: PartyPopper,
      bg: isDark ? 'from-purple-500/20 to-purple-600/30 border-purple-500/40 text-purple-300' : 'from-purple-100 to-purple-200/80 border-purple-300 text-purple-900',
      badge: 'Agenda',
      onClick: () => onSelectCategory('eventos')
    },
    {
      id: 'admin',
      title: 'Gerenciar Ads',
      subtitle: 'Painel do Admin',
      emoji: '🛡️',
      icon: ShieldCheck,
      bg: isDark ? 'from-indigo-500/20 to-indigo-600/30 border-indigo-500/40 text-indigo-300' : 'from-indigo-100 to-indigo-200/80 border-indigo-300 text-indigo-900',
      badge: 'Gestor',
      onClick: onOpenAdmin
    }
  ];

  return (
    <section className={`px-4 py-3.5 transition-colors ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
          isDark ? 'text-slate-300' : 'text-slate-800'
        }`}>
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Serviços Essenciais da Ilha
        </h3>
        <span className="text-[10px] text-teal-600 font-bold">Toque p/ Acessar</span>
      </div>

      {/* 2-Column Mobile / 4-Column Desktop Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ACTIONS.map((action) => {
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`p-3.5 rounded-2xl border bg-gradient-to-br ${action.bg} text-left transition hover:scale-[1.02] active:scale-[0.98] focus:outline-hidden shadow-xs flex flex-col justify-between h-24 cursor-pointer`}
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl">{action.emoji}</span>
                <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md border ${
                  isDark ? 'bg-slate-900/80 text-white border-white/10' : 'bg-white/90 text-slate-800 border-slate-300'
                }`}>
                  {action.badge}
                </span>
              </div>

              <div>
                <span className={`text-xs font-black block leading-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
                  {action.title}
                </span>
                <span className={`text-[10px] block font-medium mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {action.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
