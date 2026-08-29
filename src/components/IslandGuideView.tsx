import React, { useState } from 'react';
import { 
  Waves, 
  Ship, 
  MapPin, 
  PhoneCall, 
  Clock, 
  ShieldAlert, 
  Compass, 
  Info, 
  Sun, 
  Moon,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { IslandSpot, BoatCrossingSchedule, UsefulContact, TideSchedule } from '../types/index.ts';
import { AlgodoalLogoBadge } from './AlgodoalLogoBadge.tsx';

interface IslandGuideViewProps {
  spots: IslandSpot[];
  boatCrossings: BoatCrossingSchedule[];
  contacts: UsefulContact[];
  tides: TideSchedule[];
}

export const IslandGuideView: React.FC<IslandGuideViewProps> = ({
  spots,
  boatCrossings,
  contacts,
  tides
}) => {
  const [selectedSpot, setSelectedSpot] = useState<IslandSpot>(spots[0] || null);
  const [activeTab, setActiveTab] = useState<'mares' | 'barcos' | 'mapa' | 'contatos'>('mares');

  return (
    <div className="space-y-8">
      {/* Header Info Box */}
      <div className="bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-teal-400 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-3 backdrop-blur-xs">
              <Compass className="w-4 h-4 text-amber-300" />
              <span>Guia Turístico & Serviços Essenciais da Ilha</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-heading">
              Informações Úteis de Algodoal
            </h2>
            <p className="text-xs sm:text-sm text-sky-100 mt-2 leading-relaxed font-normal">
              Consulte a <strong>tábua de marés</strong> diária (fundamental para travessias e banho de mar), os <strong>horários oficiais das embarcações de Marudá</strong>, o mapa de trilhas e pontos turísticos, além dos contatos de urgência médica e segurança pública.
            </p>
          </div>

          <div className="shrink-0">
            <AlgodoalLogoBadge size="sm" showSubtitle={false} />
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            id="tab-btn-mares"
            onClick={() => setActiveTab('mares')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'mares'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
            }`}
          >
            <Waves className="w-4 h-4" />
            <span>Tábua de Marés</span>
          </button>

          <button
            id="tab-btn-barcos"
            onClick={() => setActiveTab('barcos')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'barcos'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
            }`}
          >
            <Ship className="w-4 h-4" />
            <span>Horários de Barco</span>
          </button>

          <button
            id="tab-btn-mapa"
            onClick={() => setActiveTab('mapa')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'mapa'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Mapa & Pontos Turísticos</span>
          </button>

          <button
            id="tab-btn-contatos"
            onClick={() => setActiveTab('contatos')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'contatos'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>Contatos de Emergência</span>
          </button>
        </div>
      </div>

      {/* Tab: Tábua de Marés */}
      {activeTab === 'mares' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-black text-slate-900 font-heading flex items-center gap-2">
              <Waves className="w-5 h-5 text-sky-600" />
              <span>Tábua de Marés do Dia (Estuário de Marudá / Algodoal)</span>
            </h3>
            <p className="text-xs text-slate-500">
              A dinâmica das marés no Pará tem amplitude de até 4 metros. Planeje suas caminhadas pelas praias na maré baixa e passeios de barco na maré alta.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tides.map((tide, idx) => {
              const isHigh = tide.type.includes('Alta');
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-sky-300 hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        isHigh ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {tide.type}
                      </span>
                      {isHigh ? (
                        <Sun className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Moon className="w-4 h-4 text-slate-400" />
                      )}
                    </div>

                    <div className="mt-3">
                      <span className="text-3xl font-black text-slate-900 font-heading block">
                        {tide.time}
                      </span>
                      <span className="text-xs text-slate-500">
                        Altura estimada: <strong className="text-sky-700">{tide.height}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-medium text-slate-700">
                    ✦ {tide.status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Horários de Barco */}
      {activeTab === 'barcos' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-black text-slate-900 font-heading flex items-center gap-2">
              <Ship className="w-5 h-5 text-sky-600" />
              <span>Horários da Travessia Marudá ⇄ Algodoal</span>
            </h3>
            <p className="text-xs text-slate-500">
              Travessia fluvial realizada por embarcações com motor e coletes salva-vidas homologadas pela Capitania dos Portos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {boatCrossings.map((boat) => (
              <div
                key={boat.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
                        Linha Regular Diária
                      </span>
                      <h4 className="text-lg font-black text-slate-900 font-heading mt-2">
                        {boat.origin} <br />
                        <span className="text-sky-700">➔ {boat.destination}</span>
                      </h4>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 font-medium block">Passagem</span>
                      <span className="text-xl font-black text-sky-800">
                        R$ {boat.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className="text-xs font-bold text-slate-700 block mb-2">
                      Horários de Saída Diários:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {boat.departure_times.map((time, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800"
                        >
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-sky-600" />
                      <span>Duração estimada: <strong className="text-slate-900">{boat.duration}</strong></span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-sky-600" />
                      <span>{boat.notes}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{boat.association}</span>
                  <a
                    href={`tel:${boat.phone.replace(/\D/g, '')}`}
                    className="font-bold text-sky-700 hover:underline"
                  >
                    {boat.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Mapa & Pontos Turísticos */}
      {activeTab === 'mapa' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-black text-slate-900 font-heading flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-600" />
              <span>Mapa da Ilha & Principais Atrativos</span>
            </h3>
            <p className="text-xs text-slate-500">
              Descubra as distâncias do Porto até as praias, lago e vilas de Maiandeua.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Spot Selector List */}
            <div className="lg:col-span-5 space-y-3">
              {spots.map((spot) => (
                <button
                  key={spot.id}
                  onClick={() => setSelectedSpot(spot)}
                  className={`w-full text-left p-4 rounded-2xl border transition flex items-center gap-3.5 cursor-pointer ${
                    selectedSpot?.id === spot.id
                      ? 'bg-sky-50/50 border-sky-400 ring-2 ring-sky-300'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={spot.image_url}
                    alt={spot.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-slate-900 font-heading truncate">
                      {spot.name}
                    </h4>
                    <span className="text-xs text-slate-500 block">
                      Distância do Porto: <strong className="text-slate-800">{spot.distance_from_port}</strong>
                    </span>
                    <span className="text-[11px] text-amber-700 font-bold">
                      Charrete: {spot.cart_time}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>

            {/* Selected Spot Details Preview */}
            {selectedSpot && (
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="relative h-56 rounded-xl overflow-hidden mb-4 border border-slate-100">
                    <img
                      src={selectedSpot.image_url}
                      alt={selectedSpot.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-xs text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
                      {selectedSpot.distance_from_port} do Porto
                    </div>
                  </div>

                  <h4 className="text-xl font-black text-slate-900 font-heading">
                    {selectedSpot.name}
                  </h4>

                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {selectedSpot.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-[11px] text-slate-500 font-medium block">Tempo a Pé:</span>
                      <strong className="text-xs sm:text-sm text-slate-800">{selectedSpot.walking_time}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-[11px] text-slate-500 font-medium block">Tempo de Charrete / Barco:</span>
                      <strong className="text-xs sm:text-sm text-sky-800">{selectedSpot.cart_time}</strong>
                    </div>
                  </div>

                  <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
                    <strong className="text-amber-900 font-bold">Dica Nativa:</strong> {selectedSpot.tips}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Contatos de Emergência */}
      {activeTab === 'contatos' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-black text-slate-900 font-heading flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-sky-600" />
              <span>Contatos Úteis & Emergência na Ilha de Algodoal</span>
            </h3>
            <p className="text-xs text-slate-500">
              Guarde estes números para qualquer eventualidade durante a sua viagem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-base font-black text-slate-900 font-heading">
                      {contact.title}
                    </h4>
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {contact.available_hours}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {contact.description}
                  </p>

                  <span className="text-xs text-slate-500 mt-2 block">
                    <MapPin className="w-3.5 h-3.5 inline mr-1 text-sky-600" />
                    {contact.location}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={`tel:${contact.phone.replace(/\D/g, '')}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 px-3 py-1.5 rounded-xl transition shadow-xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Ligar: {contact.phone}</span>
                  </a>

                  {contact.whatsapp && (
                    <a
                      href={`https://wa.me/${contact.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-xl transition"
                    >
                      <span>WhatsApp</span>
                      <ExternalLink className="w-3 h-3 text-emerald-600" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
