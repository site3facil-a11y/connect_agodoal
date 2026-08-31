import React, { useState, useMemo } from 'react';
import { 
  Hotel, 
  Utensils, 
  Compass, 
  ShoppingBag, 
  PartyPopper, 
  Truck, 
  Info, 
  MapPin, 
  DollarSign, 
  MessageCircle, 
  Star, 
  CheckCircle2, 
  Phone, 
  SlidersHorizontal,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { Partner, ServiceCategory } from '../../types/index.ts';

interface MobileCategoryFeedProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchTerm: string;
  partners: Partner[];
  onOpenOrderModal?: (partner: Partner) => void;
}

const CATEGORY_TABS = [
  { id: 'todos', label: 'Tudo', icon: Sparkles, color: 'text-amber-400' },
  { id: 'pousadas', label: 'Pousadas', icon: Hotel, color: 'text-emerald-400' },
  { id: 'alimentacao', label: 'Restaurantes', icon: Utensils, color: 'text-rose-400' },
  { id: 'passeios', label: 'Rabetas & Tours', icon: Compass, color: 'text-teal-400' },
  { id: 'transporte', label: 'Charretes', icon: Truck, color: 'text-amber-400' },
  { id: 'compras', label: 'Depósitos & Gelo', icon: ShoppingBag, color: 'text-sky-400' },
  { id: 'eventos', label: 'Luaus & Festas', icon: PartyPopper, color: 'text-purple-400' },
];

export const MobileCategoryFeed: React.FC<MobileCategoryFeedProps> = ({
  selectedCategory,
  onSelectCategory,
  searchTerm,
  partners,
  onOpenOrderModal
}) => {
  const [activeSubfilter, setActiveSubfilter] = useState<string>('todos');

  // Filter partners
  const filteredPartners = useMemo(() => {
    return partners.filter((p) => {
      // Category filter
      if (selectedCategory !== 'todos') {
        const c = (p.category || '').toLowerCase();
        if (selectedCategory === 'transporte' && c !== 'transporte') return false;
        if (selectedCategory === 'pousadas' && c !== 'pousadas') return false;
        if (selectedCategory === 'passeios' && c !== 'passeios') return false;
        if (selectedCategory === 'alimentacao' && c !== 'alimentacao') return false;
        if (selectedCategory === 'compras' && c !== 'compras') return false;
        if (selectedCategory === 'eventos' && c !== 'eventos') return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = (p.name || '').toLowerCase().includes(term);
        const matchesDesc = (p.description || '').toLowerCase().includes(term);
        const matchesLoc = (p.location || '').toLowerCase().includes(term);
        if (!matchesName && !matchesDesc && !matchesLoc) return false;
      }

      return true;
    });
  }, [partners, selectedCategory, searchTerm]);

  return (
    <section className="px-4 py-3 bg-slate-950">
      {/* Category Pills Header */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {CATEGORY_TABS.map((tab) => {
          const Icon = tab.icon;
          const isSelected = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectCategory(tab.id)}
              className={`px-3.5 py-2 rounded-2xl border text-xs font-black shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-teal-500 border-teal-400 text-slate-950 shadow-md shadow-teal-950/50'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : tab.color}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between py-2 text-xs">
        <span className="text-slate-400 font-bold">
          {filteredPartners.length} locais encontrados
        </span>
        <span className="text-[11px] text-teal-400 font-semibold">
          Preços em Reais (R$)
        </span>
      </div>

      {/* Cards List */}
      <div className="space-y-3 pb-6">
        {filteredPartners.length === 0 ? (
          <div className="text-center py-12 rounded-3xl bg-slate-900 border border-slate-800 p-6 text-slate-400">
            <Compass className="w-10 h-10 mx-auto mb-2 text-slate-600 animate-spin-slow" />
            <h4 className="text-sm font-black text-slate-300">Nenhum resultado encontrado</h4>
            <p className="text-xs text-slate-500 mt-1">
              Tente buscar por outro termo ou escolha outra categoria acima.
            </p>
          </div>
        ) : (
          filteredPartners.map((item) => {
            const cleanPhone = (item.whatsapp || item.phone || '5591981234567').replace(/\D/g, '');
            const defaultMsg = `Olá! Vi o anúncio de ${encodeURIComponent(item.name)} no aplicativo Algodoal Connect e gostaria de saber disponibilidade e valores.`;

            return (
              <div
                key={item.id}
                className="rounded-3xl bg-slate-900 border border-slate-800/90 overflow-hidden shadow-lg hover:border-teal-500/40 transition duration-200"
              >
                {/* Media Container */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-800">
                  <img
                    src={item.photo_url || '/assets/images/vila_algodoal_rua_1787985524739.jpg'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/images/vila_algodoal_rua_1787985524739.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-teal-300 font-bold text-[10px] uppercase tracking-wider border border-teal-500/30">
                      {item.subcategory || item.category}
                    </span>

                    {item.verified && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/90 text-slate-950 font-black text-[10px] uppercase flex items-center gap-1 shadow-md">
                        <CheckCircle2 className="w-3 h-3" />
                        Verificado APA
                      </span>
                    )}
                  </div>

                  {/* Price Tag over Media */}
                  <div className="absolute bottom-3 right-3">
                    <span className="px-3 py-1 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs shadow-md">
                      A partir de R$ {item.price_starting.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm sm:text-base font-black text-white font-heading leading-snug">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <span className="truncate">{item.location || 'Ilha de Algodoal'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-xl shrink-0 border border-slate-700">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-black text-white">{item.rating || '4.9'}</span>
                      <span className="text-[10px] text-slate-400">({item.total_reviews || 28})</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Amenities / Features Tags */}
                  {item.amenities && item.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.amenities.map((amenity, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons Row */}
                  <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                    <a
                      href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultMsg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Direto</span>
                    </a>

                    {item.phone && (
                      <a
                        href={`tel:${item.phone.replace(/\D/g, '')}`}
                        className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
                        title="Ligar"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
