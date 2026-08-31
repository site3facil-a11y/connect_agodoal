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
  onSelectCategory: (categoryId: string) => void;
  onOpenTides: () => void;
  onOpenCharreteCalculator: () => void;
  onOpenSupplyOrder: () => void;
  onOpenAdmin: () => void;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({
  onSelectCategory,
  onOpenTides,
  onOpenCharreteCalculator,
  onOpenSupplyOrder,
  onOpenAdmin
}) => {
  const ACTIONS = [
    {
      id: 'charretes',
      title: 'Charretes',
      subtitle: 'Tabela & Pedir',
      emoji: '🐎',
      icon: Truck,
      bg: 'from-amber-500/20 to-amber-600/30 border-amber-500/40 text-amber-300',
      badge: 'Oficial APA',
      onClick: onOpenCharreteCalculator
    },
    {
      id: 'rabetas',
      title: 'Barcos & Rabetas',
      subtitle: 'Travessias & Tours',
      emoji: '🚤',
      icon: Compass,
      bg: 'from-teal-500/20 to-teal-600/30 border-teal-500/40 text-teal-300',
      badge: 'Marudá ⇄ Ilha',
      onClick: () => onSelectCategory('passeios')
    },
    {
      id: 'pousadas',
      title: 'Pousadas',
      subtitle: 'Chalés & Quartos',
      emoji: '🏨',
      icon: Hotel,
      bg: 'from-emerald-500/20 to-emerald-600/30 border-emerald-500/40 text-emerald-300',
      badge: 'Beira-mar',
      onClick: () => onSelectCategory('pousadas')
    },
    {
      id: 'gastronomia',
      title: 'Onde Comer',
      subtitle: 'Peixada & Açaí',
      emoji: '🍲',
      icon: Utensils,
      bg: 'from-rose-500/20 to-rose-600/30 border-rose-500/40 text-rose-300',
      badge: 'Regional',
      onClick: () => onSelectCategory('alimentacao')
    },
    {
      id: 'suprimentos',
      title: 'Gelo & Água 20L',
      subtitle: 'Entrega na Praia',
      emoji: '📦',
      icon: ShoppingBag,
      bg: 'from-sky-500/20 to-sky-600/30 border-sky-500/40 text-sky-300',
      badge: 'Disk Praia',
      onClick: onOpenSupplyOrder
    },
    {
      id: 'mares',
      title: 'Tábua de Marés',
      subtitle: 'Previsão Hoje',
      emoji: '🌊',
      icon: Waves,
      bg: 'from-blue-500/20 to-blue-600/30 border-blue-500/40 text-blue-300',
      badge: 'Marapanim',
      onClick: onOpenTides
    },
    {
      id: 'eventos',
      title: 'Luaus & Festas',
      subtitle: 'Carimbó & Reggae',
      emoji: '🎉',
      icon: PartyPopper,
      bg: 'from-purple-500/20 to-purple-600/30 border-purple-500/40 text-purple-300',
      badge: 'Agenda',
      onClick: () => onSelectCategory('eventos')
    },
    {
      id: 'admin',
      title: 'Gerenciar Ads',
      subtitle: 'Painel do Admin',
      emoji: '🛡️',
      icon: ShieldCheck,
      bg: 'from-indigo-500/20 to-indigo-600/30 border-indigo-500/40 text-indigo-300',
      badge: 'Gestor',
      onClick: onOpenAdmin
    }
  ];

  return (
    <section className="px-4 py-3 bg-slate-950">
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Serviços Essenciais da Ilha
        </h3>
        <span className="text-[10px] text-teal-400 font-bold">Toque p/ Acessar</span>
      </div>

      {/* 2-Column Mobile / 4-Column Tablet Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`p-3 rounded-2xl border bg-gradient-to-br ${action.bg} text-left transition hover:scale-[1.02] active:scale-[0.98] focus:outline-hidden shadow-sm flex flex-col justify-between h-24 cursor-pointer`}
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl">{action.emoji}</span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md bg-slate-900/80 text-white border border-white/10">
                  {action.badge}
                </span>
              </div>

              <div>
                <span className="text-xs font-black text-white block leading-tight">
                  {action.title}
                </span>
                <span className="text-[10px] text-slate-300 block font-medium mt-0.5">
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
