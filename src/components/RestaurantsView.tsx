import React from 'react';
import { 
  Utensils, 
  Star, 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Sparkles,
  Flame
} from 'lucide-react';
import { Partner, ServiceProduct } from '../types/index.ts';

interface RestaurantsViewProps {
  partners: Partner[];
  services: ServiceProduct[];
  onBookService: (service: ServiceProduct, partner: Partner) => void;
  onCallPartnerDirect: (partner: Partner) => void;
}

export const RestaurantsView: React.FC<RestaurantsViewProps> = ({
  partners,
  services,
  onBookService,
  onCallPartnerDirect
}) => {
  const foodPartners = partners.filter(p => p.category === 'alimentacao');
  const foodServices = services.filter(s => s.category === 'alimentacao');

  return (
    <div className="space-y-8">
      {/* Header Info Box */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-orange-400 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-3 backdrop-blur-xs">
            <Utensils className="w-4 h-4 text-amber-200" />
            <span>Sabor Amazônico & Frutos do Mar Frescos</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-heading">
            Alimentação & Restaurantes da Ilha
          </h2>
          <p className="text-xs sm:text-sm text-orange-100 mt-2 leading-relaxed font-normal">
            Experimente os autênticos pratos paraenses: <strong>peixada fresca</strong>, <strong>caldeirada com tucupi e jambu</strong>, <strong>açaí regional grosso</strong> e <strong>tapiocas recheadas</strong>. Peça para entregar na sua pousada ou garanta sua mesa à beira-mar na Praia da Princesa.
          </p>
        </div>

        {/* Highlight Tag */}
        <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-slate-900">
          <span className="bg-white/90 px-3 py-1 rounded-full shadow-2xs">🍃 Jambu Fresco</span>
          <span className="bg-white/90 px-3 py-1 rounded-full shadow-2xs">🐟 Filhote & Pargo</span>
          <span className="bg-white/90 px-3 py-1 rounded-full shadow-2xs">🥣 Açaí Puro do Pará</span>
          <span className="bg-white/90 px-3 py-1 rounded-full shadow-2xs">🦀 Caranguejo do Mangue</span>
        </div>
      </div>

      {/* Dishes Menu Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 font-heading">
              Pratos & Cardápio Regional
            </h3>
            <p className="text-xs text-slate-500">
              Pratos preparados na hora pelos melhores chefs e cozinheiras nativas
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {foodServices.map((dish) => {
            const partner = partners.find(p => p.id === dish.partner_id) || foodPartners[0];

            return (
              <div
                key={dish.id}
                id={`dish-card-${dish.id}`}
                className="rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-orange-300 transition overflow-hidden flex flex-col justify-between group"
              >
                {/* Photo */}
                <div className="relative h-44 w-full overflow-hidden border-b border-slate-100">
                  <img
                    src={dish.image_url}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-slate-900/85 backdrop-blur-xs text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-lg">
                    {dish.estimated_time || '30 min'}
                  </div>
                  {partner && (
                    <span className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                      {partner.name}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-base font-black text-slate-900 font-heading leading-snug">
                      {dish.name}
                    </h4>

                    <span className="text-[11px] font-bold text-orange-700 block mt-0.5">
                      {dish.unit}
                    </span>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 font-medium block">Valor</span>
                      <span className="text-base sm:text-lg font-black text-orange-800">
                        R$ {dish.price.toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => partner && onBookService(dish, partner)}
                      className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Utensils className="w-3.5 h-3.5" />
                      <span>Fazer Pedido</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Restaurants & Barracas list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 font-heading">
              Restaurantes, Barracas & Quiosques Parceiros
            </h3>
            <p className="text-xs text-slate-500">
              Atendimento presencial na orla e entrega rápida na sua acomodação
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {foodPartners.map((partner) => (
            <div
              key={partner.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-orange-300 transition flex flex-col sm:flex-row gap-4"
            >
              <div className="w-full sm:w-36 h-36 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                <img
                  src={partner.photo_url}
                  alt={partner.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-base font-black text-slate-900 font-heading flex items-center gap-1">
                        {partner.name}
                        {partner.verified && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </h4>
                      <span className="text-xs font-bold text-orange-700">{partner.subcategory}</span>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-black text-amber-900">{partner.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    {partner.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                    <span>
                      <MapPin className="w-3 h-3 inline mr-1 text-orange-600" />
                      {partner.location}
                    </span>
                    <span>
                      <Clock className="w-3 h-3 inline mr-1 text-orange-600" />
                      {partner.opening_hours}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-end">
                  <button
                    onClick={() => onCallPartnerDirect(partner)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition border border-slate-200 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Cardápio / WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
