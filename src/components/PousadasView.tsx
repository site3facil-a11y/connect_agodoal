import React, { useState } from 'react';
import { 
  Hotel, 
  MapPin, 
  Phone, 
  Wifi, 
  Wind, 
  Coffee, 
  CheckCircle2, 
  Star, 
  ExternalLink,
  ShieldCheck,
  Calendar,
  MessageCircle
} from 'lucide-react';
import { Partner, ServiceProduct } from '../types/index.ts';

interface PousadasViewProps {
  partners: Partner[];
  services: ServiceProduct[];
  onBookPousada?: (partner: Partner) => void;
}

export const PousadasView: React.FC<PousadasViewProps> = ({
  partners,
  services,
  onBookPousada
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'todas' | 'princesa' | 'vila'>('todas');

  const pousadas = partners.filter(p => p.category === 'pousadas' || p.subcategory?.toLowerCase().includes('pousada') || p.subcategory?.toLowerCase().includes('hospedagem'));

  const filteredPousadas = pousadas.filter(p => {
    if (selectedFilter === 'princesa') return p.location.toLowerCase().includes('princesa');
    if (selectedFilter === 'vila') return p.location.toLowerCase().includes('vila') || p.location.toLowerCase().includes('maiandeua');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80')` }}
        />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase mb-3 border border-emerald-500/30">
            <Hotel className="w-3.5 h-3.5" />
            <span>Hospedagem & Chalés Nativos</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
            Pousadas e Chalés na Ilha de Algodoal
          </h2>
          <p className="text-sm text-emerald-100 mt-2 leading-relaxed">
            Reserve chalés rústicos à beira-mar na Praia da Princesa ou pousadas aconchegantes na charmosa Vila de Maiandeua. Todas verificadas e sem intermediários.
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-4">
            <button
              onClick={() => setSelectedFilter('todas')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                selectedFilter === 'todas' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'bg-emerald-900/60 text-white hover:bg-emerald-800'
              }`}
            >
              Todas as Pousadas ({pousadas.length})
            </button>
            <button
              onClick={() => setSelectedFilter('princesa')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                selectedFilter === 'princesa' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'bg-emerald-900/60 text-white hover:bg-emerald-800'
              }`}
            >
              Praia da Princesa (Beira-Mar)
            </button>
            <button
              onClick={() => setSelectedFilter('vila')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                selectedFilter === 'vila' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'bg-emerald-900/60 text-white hover:bg-emerald-800'
              }`}
            >
              Vila de Maiandeua (Centro)
            </button>
          </div>
        </div>
      </div>

      {/* Pousadas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPousadas.map((pousada) => {
          const pousadaServices = services.filter(s => s.partner_id === pousada.id);

          return (
            <div 
              key={pousada.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Photo */}
                <div className="relative h-48 sm:h-52 overflow-hidden">
                  <img
                    src={pousada.photo_url}
                    alt={pousada.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-xs text-white text-[11px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>{pousada.location}</span>
                  </div>

                  <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{pousada.rating}</span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">
                      {pousada.subcategory || 'Pousada Tradicional'}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 font-heading group-hover:text-emerald-800 transition">
                      {pousada.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {pousada.description}
                  </p>

                  {/* Amenities */}
                  {pousada.amenities && pousada.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {pousada.amenities.map((am, idx) => (
                        <span 
                          key={idx}
                          className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-lg"
                        >
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          <span>{am}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Diárias a partir de</span>
                  <span className="text-lg font-black text-emerald-800 font-heading">
                    R$ {pousada.price_starting?.toFixed(2)}
                  </span>
                </div>

                <a
                  href={`https://wa.me/${pousada.whatsapp || '5591981129988'}?text=${encodeURIComponent(`Olá, vi a ${pousada.name} no Algodoal Connect e gostaria de consultar disponibilidade de chalé/suíte.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs inline-flex items-center gap-2 shadow-sm transition active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Direto</span>
                </a>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
