import React from 'react';
import { 
  PartyPopper, 
  Calendar, 
  MapPin, 
  Clock, 
  Sparkles, 
  Ticket, 
  MessageCircle, 
  Share2,
  Music,
  Flame
} from 'lucide-react';
import { Advertisement } from '../types/index.ts';

interface EventsViewProps {
  advertisements: Advertisement[];
  onSelectAd?: (ad: Advertisement) => void;
}

export const EventsView: React.FC<EventsViewProps> = ({
  advertisements,
  onSelectAd
}) => {
  const eventAds = advertisements.filter(a => a.category === 'evento' || a.event_date);

  const fallbackEvents = [
    {
      id: 'event_luau_roots',
      title: 'Luau das Dunas & Reggae Roots de Algodoal',
      business_name: 'Coletivo Cultural Maiandeua',
      category: 'evento' as const,
      description: 'Tradicional luau na areia da praia com fogueira ecológica, discotecagem de reggae roots paraense, roda de Carimbó e clima paradisíaco sob a lua cheia.',
      image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
      whatsapp: '5591983342211',
      location: 'Praia da Princesa (Próx. à Barraca Sol & Lua)',
      event_date: '2026-09-05T21:00:00Z',
      event_venue: 'Praia da Princesa',
      badge: 'Entrada Gratuita',
      price_starting: 0,
      banner_slot: 'nenhum' as const,
      is_active: true,
      is_highlighted: true
    },
    {
      id: 'event_carimbo_vila',
      title: 'Noite de Carimbó Raiz com Mestres de Marapanim',
      business_name: 'Espaço Raízes do Pará',
      category: 'evento' as const,
      description: 'Apresentação ao vivo de grupos de Carimbó tradicional com tambores de curimbó, maracás e dançarinas com saias rodadas no centro da Vila.',
      image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
      whatsapp: '5591981125566',
      location: 'Praça Central da Vila de Maiandeua',
      event_date: '2026-09-12T20:00:00Z',
      event_venue: 'Coreto da Praça da Vila',
      badge: 'Cultura Paraense',
      price_starting: 0,
      banner_slot: 'nenhum' as const,
      is_active: true,
      is_highlighted: true
    }
  ];

  const displayedEvents = eventAds.length > 0 ? eventAds : fallbackEvents;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80')` }}
        />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black uppercase mb-3 border border-purple-500/30">
            <PartyPopper className="w-3.5 h-3.5" />
            <span>Agenda Cultural & Noite</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
            Eventos, Luaus e Festivais em Algodoal
          </h2>
          <p className="text-sm text-purple-100 mt-2 leading-relaxed">
            Fique por dentro das festas na praia, rodas de Carimbó, noites de reggae roots e apresentações culturais que movimentam a ilha.
          </p>
        </div>
      </div>

      {/* Events Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedEvents.map((evt) => (
          <div 
            key={evt.id}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              {/* Event Image */}
              <div className="relative h-56 sm:h-64 overflow-hidden">
                <img
                  src={evt.image_url}
                  alt={evt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                {evt.badge && (
                  <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full shadow-md">
                    {evt.badge}
                  </div>
                )}

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <div className="flex items-center gap-2 text-amber-300 text-xs font-black uppercase">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{evt.event_date ? new Date(evt.event_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', weekday: 'long' }) : 'Próximo Fim de Semana'}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black font-heading line-clamp-1 mt-0.5">
                    {evt.title}
                  </h3>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-purple-600" />
                  <span>{evt.event_venue || evt.location}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {evt.description}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Organização: {evt.business_name}</span>
              </div>

              <a
                href={`https://wa.me/${evt.whatsapp || '5591983342211'}?text=${encodeURIComponent(`Olá! Vi o evento "${evt.title}" no Algodoal Connect e gostaria de mais informações.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-black text-xs inline-flex items-center gap-2 shadow-sm transition active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Informações WhatsApp</span>
              </a>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
