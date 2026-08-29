import React, { useState } from 'react';
import { 
  Car, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Phone, 
  Star, 
  ArrowRight, 
  Compass, 
  Info,
  CheckCircle2,
  Users
} from 'lucide-react';
import { Partner, ServiceProduct } from '../types/index.ts';

interface TransportViewProps {
  partners: Partner[];
  services: ServiceProduct[];
  onBookService: (service: ServiceProduct, partner: Partner, customOrigin?: string, customDest?: string) => void;
  onCallPartnerDirect: (partner: Partner) => void;
}

export const TransportView: React.FC<TransportViewProps> = ({
  partners,
  services,
  onBookService,
  onCallPartnerDirect
}) => {
  const [selectedOrigin, setSelectedOrigin] = useState('Porto de Algodoal (Desembarque)');
  const [selectedDestination, setSelectedDestination] = useState('Praia da Princesa');
  const [passengersCount, setPassengersCount] = useState(2);

  // Filter transport category
  const transportPartners = partners.filter(p => p.category === 'transporte');
  const transportServices = services.filter(s => s.category === 'transporte');

  // Pre-calculated routes on Algodoal island
  const islandRoutes = [
    {
      origin: 'Porto de Algodoal',
      dest: 'Praia da Princesa',
      time: '15 a 20 min',
      price: 35.00,
      badge: 'Mais Solicitada',
      desc: 'Do trapiche de chegada até as pousadas e barracas da Princesa.'
    },
    {
      origin: 'Porto de Algodoal',
      dest: 'Centro da Vila de Maiandeua',
      time: '5 a 8 min',
      price: 25.00,
      badge: 'Rápido',
      desc: 'Pousadas centrais, praça, farmácia e mercadinho.'
    },
    {
      origin: 'Vila de Maiandeua',
      dest: 'Praia da Caixa D’Água',
      time: '8 a 10 min',
      price: 25.00,
      badge: 'Praia Calma',
      desc: 'Visual lindo do pôr do sol e águas mansas.'
    },
    {
      origin: 'Vila de Maiandeua',
      dest: 'Vila de Fortalezinha',
      time: '1h20 min',
      price: 120.00,
      badge: 'Ecoturismo',
      desc: 'Passeio completo pela orla até a outra vila da ilha.'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header Info Box */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 rounded-3xl p-6 sm:p-8 shadow-md border border-amber-300 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 text-amber-300 text-xs font-black mb-3 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>Condutores Credenciados e Tabela Oficial da APA</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950 font-heading">
            Transporte de Charrete & Bagagens
          </h2>
          <p className="text-xs sm:text-sm text-slate-900 mt-2 leading-relaxed font-medium">
            Na Ilha de Algodoal não circulam carros ou motos motorizados para preservar a natureza. O transporte oficial é feito por <strong>charretes tradicionais puxadas por cavalos bem cuidados</strong>. Chame com antecedência ou assim que desembarcar no porto!
          </p>
        </div>

        {/* Route Estimator Widget */}
        <div className="mt-6 bg-white/95 rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-sm max-w-3xl">
          <h3 className="text-xs font-black text-amber-900 uppercase tracking-wider mb-3 flex items-center gap-2 font-heading">
            <Compass className="w-4 h-4 text-amber-600" />
            <span>Simular Corrida / Chamar Charrete no Porto</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-700 font-bold block mb-1">Origem:</label>
              <select
                id="select-transport-origin"
                value={selectedOrigin}
                onChange={(e) => setSelectedOrigin(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold focus:outline-hidden focus:border-amber-500"
              >
                <option value="Porto de Algodoal (Desembarque)">Porto de Algodoal (Desembarque)</option>
                <option value="Vila de Maiandeua (Centro)">Vila de Maiandeua (Centro)</option>
                <option value="Praia da Princesa (Pousadas)">Praia da Princesa (Pousadas)</option>
                <option value="Praia da Caixa D’Água">Praia da Caixa D’Água</option>
                <option value="Vila de Fortalezinha">Vila de Fortalezinha</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-700 font-bold block mb-1">Destino:</label>
              <select
                id="select-transport-dest"
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold focus:outline-hidden focus:border-amber-500"
              >
                <option value="Praia da Princesa">Praia da Princesa</option>
                <option value="Vila de Maiandeua (Centro)">Vila de Maiandeua (Centro)</option>
                <option value="Porto de Algodoal (Embarque)">Porto de Algodoal (Embarque)</option>
                <option value="Lago da Princesa">Lago da Princesa</option>
                <option value="Vila de Fortalezinha">Vila de Fortalezinha</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                id="btn-confirm-route-estimate"
                onClick={() => {
                  const defaultService = transportServices[0] || {
                    id: 'serv_corrida_custom',
                    partner_id: transportPartners[0]?.id || 'part_carroca_14',
                    name: `Corrida: ${selectedOrigin} ⇄ ${selectedDestination}`,
                    description: `Transporte de passageiros e bagagens de ${selectedOrigin} até ${selectedDestination}.`,
                    price: selectedDestination.includes('Fortalezinha') ? 120.0 : 35.0,
                    unit: 'por viagem',
                    category: 'transporte',
                    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
                    available: true
                  };
                  const partner = transportPartners[0] || partners[0];
                  onBookService(defaultService, partner, selectedOrigin, selectedDestination);
                }}
                className="w-full bg-slate-950 hover:bg-slate-800 text-amber-300 font-black text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Car className="w-4 h-4 text-emerald-400" />
                <span>Chamar via WhatsApp</span>
              </button>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-amber-200/80 text-[11px] text-slate-700 flex items-center gap-1.5 font-medium">
            <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>Ao solicitar, você falará diretamente com o condutor da charrete no WhatsApp para combinar horário e ponto de encontro.</span>
          </div>
        </div>
      </div>

      {/* Popular Routes Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 font-heading">
              Rotas Populares & Valores Médios
            </h3>
            <p className="text-xs text-slate-500">
              Preços tabelados por charrete (capacidade até 4 passageiros + malas)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {islandRoutes.map((route, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-amber-400 transition flex flex-col justify-between"
            >
              <div>
                <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  {route.badge}
                </span>

                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>{route.origin}</span>
                  </div>
                  <div className="pl-4 border-l-2 border-dashed border-slate-300 my-0.5"></div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-900 font-black">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{route.dest}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {route.desc}
                </p>

                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold mt-2">
                  <Clock className="w-3 h-3 text-sky-600" />
                  <span>Tempo: {route.time}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-medium block">Valor médio</span>
                  <span className="text-base font-black text-amber-700">
                    R$ {route.price.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    const matchedService = transportServices.find(s => s.name.toLowerCase().includes(route.dest.toLowerCase())) || transportServices[0];
                    const partner = transportPartners[0];
                    if (matchedService && partner) {
                      onBookService(matchedService, partner, route.origin, route.dest);
                    }
                  }}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-3 py-1.5 rounded-xl transition cursor-pointer"
                >
                  Chamar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Charreteiros List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 font-heading">
              Charreteiros Credenciados na Ilha
            </h3>
            <p className="text-xs text-slate-500">
              Profissionais associados, pontuais e prontos para atender
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {transportPartners.map((partner) => (
            <div
              key={partner.id}
              id={`partner-card-${partner.id}`}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-amber-400 transition flex flex-col sm:flex-row gap-4"
            >
              {/* Photo */}
              <div className="relative w-full sm:w-36 h-36 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                <img
                  src={partner.photo_url}
                  alt={partner.name}
                  className="w-full h-full object-cover"
                />
                {partner.vehicle_badge && (
                  <span className="absolute bottom-1.5 left-1.5 right-1.5 bg-slate-900/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded text-center truncate shadow-xs">
                    {partner.vehicle_badge}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-base font-black text-slate-900 font-heading">
                          {partner.name}
                        </h4>
                        {partner.verified && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </div>
                      <span className="text-xs font-bold text-amber-700 block">
                        {partner.subcategory}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-black text-amber-900">{partner.rating}</span>
                      <span className="text-[10px] text-slate-500">({partner.total_reviews})</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {partner.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-sky-600" />
                      {partner.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-sky-600" />
                      {partner.opening_hours}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium block">A partir de</span>
                    <span className="text-base font-black text-amber-700">
                      R$ {partner.price_starting.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onCallPartnerDirect(partner)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition border border-emerald-200 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp Direto</span>
                    </button>

                    <button
                      onClick={() => {
                        const partnerServices = transportServices.filter(s => s.partner_id === partner.id);
                        const defaultService = partnerServices[0] || transportServices[0];
                        onBookService(defaultService, partner, 'Porto de Algodoal', 'Praia da Princesa');
                      }}
                      className="bg-slate-950 hover:bg-slate-800 text-amber-300 text-xs font-black px-3.5 py-1.5 rounded-xl transition cursor-pointer"
                    >
                      Combinar Corrida
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
