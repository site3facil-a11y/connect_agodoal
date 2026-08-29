import React, { useState } from 'react';
import { 
  Sailboat, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Star, 
  Users, 
  Waves, 
  Sun, 
  Phone, 
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Partner, ServiceProduct } from '../types/index.ts';

interface ToursViewProps {
  partners: Partner[];
  services: ServiceProduct[];
  onBookService: (service: ServiceProduct, partner: Partner) => void;
  onCallPartnerDirect: (partner: Partner) => void;
}

export const ToursView: React.FC<ToursViewProps> = ({
  partners,
  services,
  onBookService,
  onCallPartnerDirect
}) => {
  const tourPartners = partners.filter(p => p.category === 'passeios');
  const tourServices = services.filter(s => s.category === 'passeios');

  return (
    <div className="space-y-8">
      {/* Header Info Box */}
      <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-700 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-sky-400 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-3 backdrop-blur-xs">
            <Waves className="w-4 h-4 text-amber-300" />
            <span>Navegação Fluvial e Marítima com Segurança</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-heading">
            Passeios de Rabeta & Barcos
          </h2>
          <p className="text-xs sm:text-sm text-sky-100 mt-2 leading-relaxed font-normal">
            Conheça os refúgios mais bonitos da Ilha de Maiandeua: as águas doces do <strong>Lago da Princesa</strong>, os canais de manguezal e a pitoresca vila de <strong>Fortalezinha</strong> em passeios de rabeta com barqueiros nativos e coletes salva-vidas.
          </p>
        </div>

        {/* Tide recommendation banner */}
        <div className="mt-6 bg-white/15 backdrop-blur-xs rounded-2xl p-4 border border-white/25 max-w-2xl flex items-center gap-3">
          <Sun className="w-6 h-6 text-amber-300 shrink-0" />
          <div className="text-xs text-sky-50">
            <strong className="text-amber-200 font-bold block">Dica de Maré para Navegação:</strong>
            Os passeios pelos canais e estuários são mais confortáveis e rápidos durante a preamar (maré cheia). Verifique a tábua de marés para planejar seu roteiro.
          </div>
        </div>
      </div>

      {/* Tour Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 font-heading">
              Passeios & Roteiros Disponíveis
            </h3>
            <p className="text-xs text-slate-500">
              Reserve individualmente ou feche a rabeta inteira para sua família
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tourServices.map((service) => {
            const partner = partners.find(p => p.id === service.partner_id) || tourPartners[0];

            return (
              <div
                key={service.id}
                id={`tour-card-${service.id}`}
                className="rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-sky-300 transition overflow-hidden flex flex-col justify-between group"
              >
                {/* Image */}
                <div className="relative h-44 w-full overflow-hidden border-b border-slate-100">
                  <img
                    src={service.image_url}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-slate-900/85 backdrop-blur-xs text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-lg">
                    {service.estimated_time || '2h'}
                  </div>
                  {partner && (
                    <span className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                      {partner.name}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-base font-black text-slate-900 font-heading leading-snug">
                      {service.name}
                    </h4>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100">
                      <span className="flex items-center gap-1 font-bold text-emerald-700">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Coletes inclusos
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {service.unit}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 font-medium block">Valor por vaga</span>
                      <span className="text-base font-black text-sky-800">
                        R$ {service.price.toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => partner && onBookService(service, partner)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Combinar no WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rabeteiros List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 font-heading">
              Barqueiros & Rabeteiros da Ilha
            </h3>
            <p className="text-xs text-slate-500">
              Pilotos experientes conhecedores das marés e segredos de Algodoal
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tourPartners.map((partner) => (
            <div
              key={partner.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-sky-300 transition flex flex-col sm:flex-row gap-4"
            >
              <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden shrink-0 relative border border-slate-200">
                <img
                  src={partner.photo_url}
                  alt={partner.name}
                  className="w-full h-full object-cover"
                />
                {partner.vehicle_badge && (
                  <span className="absolute bottom-1 left-1 right-1 bg-slate-900/90 text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded text-center truncate">
                    {partner.vehicle_badge}
                  </span>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-base font-black text-slate-900 font-heading flex items-center gap-1">
                        {partner.name}
                        {partner.verified && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </h4>
                      <span className="text-xs font-bold text-sky-700">{partner.subcategory}</span>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-black text-amber-900">{partner.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    {partner.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    <MapPin className="w-3 h-3 inline mr-1 text-sky-600" />
                    {partner.location}
                  </span>

                  <button
                    onClick={() => onCallPartnerDirect(partner)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition border border-slate-200 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Falar no WhatsApp</span>
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
