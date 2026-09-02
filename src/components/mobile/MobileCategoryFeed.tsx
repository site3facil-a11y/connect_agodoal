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
  Sparkles,
  X
} from 'lucide-react';
import { Partner, ServiceCategory } from '../../types/index.ts';
import { StoriesRow } from './StoriesRow.tsx';

interface MobileCategoryFeedProps {
  theme?: 'dark' | 'light';
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchTerm: string;
  partners: Partner[];
  onOpenOrderModal?: (partner: Partner) => void;
}

export const MobileCategoryFeed: React.FC<MobileCategoryFeedProps> = ({
  theme = 'dark',
  selectedCategory,
  onSelectCategory,
  searchTerm,
  partners,
  onOpenOrderModal
}) => {
  const isDark = theme === 'dark';

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
    <section className={`px-2 sm:px-4 py-3 transition-colors ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Destaques da Ilha (Stories) replacing redundant category menu */}
      <div className="mb-3 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
        <StoriesRow
          theme={theme}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
          showHeaderTitle={true}
        />
      </div>

      {/* Filter / Results Header */}
      <div className="flex items-center justify-between py-2 px-1 text-xs">
        <div className="flex items-center gap-2">
          <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {filteredPartners.length} {filteredPartners.length === 1 ? 'local encontrado' : 'locais encontrados'}
          </span>
          {selectedCategory !== 'todos' && (
            <button
              onClick={() => onSelectCategory('todos')}
              className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-500 hover:bg-teal-500 hover:text-slate-950 text-[10px] font-black flex items-center gap-1 transition cursor-pointer"
            >
              <span>Ver Todos</span>
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        <span className="text-[11px] text-teal-500 font-bold">
          Preços em Reais (R$)
        </span>
      </div>

      {/* Cards List / Grid (Grouped by category if 'todos', or direct list if filtered) */}
      <div className="space-y-6 pb-6">
        {filteredPartners.length === 0 ? (
          <div className={`text-center py-12 rounded-3xl border p-6 ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
          }`}>
            <Compass className="w-10 h-10 mx-auto mb-2 text-slate-400 animate-spin-slow" />
            <h4 className={`text-sm font-black ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Nenhum resultado encontrado</h4>
            <p className="text-xs text-slate-400 mt-1">
              Tente buscar por outro termo ou escolha outra categoria acima.
            </p>
          </div>
        ) : selectedCategory === 'todos' && !searchTerm ? (
          /* Render all partners grouped by category on the same page */
          [
            { id: 'transporte', title: '🐎 Charretes & Transporte Local', badge: 'Transporte Oficial' },
            { id: 'pousadas', title: '🏨 Pousadas, Chalés & Hospedagens', badge: 'Hospedagens' },
            { id: 'alimentacao', title: '🍲 Restaurantes & Gastronomia', badge: 'Sabores da Ilha' },
            { id: 'passeios', title: '🚤 Barcos, Rabetas & Passeios', badge: 'Passeios Náuticos' },
            { id: 'compras', title: '📦 Depósitos & Suprimentos', badge: 'Disk Entrega' },
            { id: 'eventos', title: '🎭 Cultura & Eventos', badge: 'Cultura & Lazer' }
          ].map((catGroup) => {
            const catItems = filteredPartners.filter((p) => {
              const c = (p.category || '').toLowerCase();
              if (catGroup.id === 'transporte') return c === 'transporte';
              if (catGroup.id === 'pousadas') return c === 'pousadas' || c === 'pousada';
              if (catGroup.id === 'alimentacao') return c === 'alimentacao' || c === 'alimentação' || c === 'restaurante';
              if (catGroup.id === 'passeios') return c === 'passeios' || c === 'passeio';
              if (catGroup.id === 'compras') return c === 'compras' || c === 'compra';
              if (catGroup.id === 'eventos') return c === 'eventos' || c === 'evento';
              return false;
            });

            if (catItems.length === 0) return null;

            return (
              <div key={catGroup.id} className="space-y-3">
                <div className="flex items-center justify-between px-1 border-b border-slate-700/60 pb-2">
                  <h3 className={`text-sm sm:text-base font-black font-heading flex items-center gap-2 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {catGroup.title}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-400">
                    {catItems.length} {catItems.length === 1 ? 'parceiro' : 'parceiros'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {catItems.map((item) => {
                    const cleanPhone = (item.whatsapp || item.phone || '5591981234567').replace(/\D/g, '');
                    const defaultMsg = `Olá! Vi o anúncio de ${encodeURIComponent(item.name)} no aplicativo Algodoal Connect e gostaria de saber disponibilidade e valores.`;

                    return (
                      <div
                        key={item.id}
                        className={`rounded-3xl border overflow-hidden shadow-md hover:border-teal-500/50 transition duration-200 flex flex-col justify-between ${
                          isDark ? 'bg-slate-900 border-slate-800/90' : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                          <img
                            src={item.photo_url || '/assets/images/vila_algodoal_rua_1787985524739.jpg'}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/assets/images/vila_algodoal_rua_1787985524739.jpg';
                            }}
                          />
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                            <span className="px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-teal-300 font-bold text-[10px] uppercase tracking-wider border border-teal-500/30 shadow-md">
                              {item.subcategory || item.category}
                            </span>
                          </div>
                          <div className="absolute bottom-3 right-3 pointer-events-none">
                            <span className="px-3 py-1 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs shadow-lg border border-amber-300">
                              A partir de R$ {item.price_starting.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className={`text-sm sm:text-base font-black font-heading leading-snug ${
                                  isDark ? 'text-white' : 'text-slate-900'
                                }`}>
                                  {item.name}
                                </h4>
                                <div className={`flex items-center gap-1.5 text-[11px] mt-0.5 ${
                                  isDark ? 'text-slate-400' : 'text-slate-500'
                                }`}>
                                  <MapPin className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                                  <span className="truncate">{item.location || 'Ilha de Algodoal'}</span>
                                </div>
                              </div>

                              <div className={`flex items-center gap-1 px-2 py-1 rounded-xl shrink-0 border ${
                                isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
                              }`}>
                                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                <span className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.rating || '4.9'}</span>
                                <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>({item.total_reviews || 28})</span>
                              </div>
                            </div>

                            <p className={`text-xs line-clamp-2 leading-relaxed mt-2 ${
                              isDark ? 'text-slate-300' : 'text-slate-600'
                            }`}>
                              {item.description}
                            </p>
                          </div>

                          <div className={`pt-3 border-t flex items-center gap-2 mt-2 ${
                            isDark ? 'border-slate-800' : 'border-slate-100'
                          }`}>
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
                                className={`py-2.5 px-3 rounded-xl font-bold text-xs transition border ${
                                  isDark 
                                    ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' 
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                                }`}
                                title="Ligar"
                              >
                                <Phone className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          /* Filtered direct list when a category is specifically selected */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredPartners.map((item) => {
              const cleanPhone = (item.whatsapp || item.phone || '5591981234567').replace(/\D/g, '');
              const defaultMsg = `Olá! Vi o anúncio de ${encodeURIComponent(item.name)} no aplicativo Algodoal Connect e gostaria de saber disponibilidade e valores.`;

              return (
                <div
                  key={item.id}
                  className={`rounded-3xl border overflow-hidden shadow-md hover:border-teal-500/50 transition duration-200 flex flex-col justify-between ${
                    isDark ? 'bg-slate-900 border-slate-800/90' : 'bg-white border-slate-200'
                  }`}
                >
                  {/* Media Container */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={item.photo_url || '/assets/images/vila_algodoal_rua_1787985524739.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/images/vila_algodoal_rua_1787985524739.jpg';
                      }}
                    />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <span className="px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-teal-300 font-bold text-[10px] uppercase tracking-wider border border-teal-500/30 shadow-md">
                        {item.subcategory || item.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 pointer-events-none">
                      <span className="px-3 py-1 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs shadow-lg border border-amber-300">
                        A partir de R$ {item.price_starting.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className={`text-sm sm:text-base font-black font-heading leading-snug ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}>
                            {item.name}
                          </h4>
                          <div className={`flex items-center gap-1.5 text-[11px] mt-0.5 ${
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            <MapPin className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                            <span className="truncate">{item.location || 'Ilha de Algodoal'}</span>
                          </div>
                        </div>

                        <div className={`flex items-center gap-1 px-2 py-1 rounded-xl shrink-0 border ${
                          isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
                        }`}>
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.rating || '4.9'}</span>
                          <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>({item.total_reviews || 28})</span>
                        </div>
                      </div>

                      <p className={`text-xs line-clamp-2 leading-relaxed mt-2 ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        {item.description}
                      </p>

                      {item.amenities && item.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {item.amenities.map((amenity, idx) => (
                            <span
                              key={idx}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${
                                isDark 
                                  ? 'bg-slate-800 text-slate-300 border-slate-700/60' 
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className={`pt-3 border-t flex items-center gap-2 mt-2 ${
                      isDark ? 'border-slate-800' : 'border-slate-100'
                    }`}>
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
                          className={`py-2.5 px-3 rounded-xl font-bold text-xs transition border ${
                            isDark 
                              ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' 
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                          }`}
                          title="Ligar"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
