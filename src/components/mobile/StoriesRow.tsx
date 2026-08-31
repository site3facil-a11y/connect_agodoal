import React, { useState } from 'react';
import { Sparkles, X, ChevronRight, MessageCircle, MapPin, Heart, Share2 } from 'lucide-react';

export interface IslandStory {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  coverImage: string;
  fullImage: string;
  description: string;
  location: string;
  tag: string;
  whatsapp?: string;
}

const ISLAND_STORIES: IslandStory[] = [
  {
    id: 'story-farol',
    title: 'Pôr do Sol',
    subtitle: 'Mirante do Farol',
    emoji: '🌅',
    coverImage: '/assets/images/algodoal_sunset_1787985478872.jpg',
    fullImage: '/assets/images/algodoal_sunset_1787985478872.jpg',
    description: 'O pôr do sol mais espetacular da costa paraense, onde o céu ganha tons dourados refletidos nas águas da Praia da Princesa.',
    location: 'Vila de Algodoal / Farol',
    tag: 'Imperdível',
    whatsapp: '5591981234567'
  },
  {
    id: 'story-charrete',
    title: 'Charretes',
    subtitle: 'Transporte Oficial',
    emoji: '🐎',
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    fullImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=900&auto=format&fit=crop&q=80',
    description: 'Na Ilha de Algodoal não circulam carros. O transporte oficial e ecológico é feito por charreteiros credenciados que conduzem com carinho pelos caminhos de areia.',
    location: 'Porto de Algodoal ⇄ Praia da Princesa',
    tag: 'Transporte',
    whatsapp: '5591981234567'
  },
  {
    id: 'story-lago',
    title: 'Lago Princesa',
    subtitle: 'Águas Doces',
    emoji: '✨',
    coverImage: '/assets/images/lago_da_princesa_1787985490170.jpg',
    fullImage: '/assets/images/lago_da_princesa_1787985490170.jpg',
    description: 'Lago de água doce avermelhada cercado por dunas brancas de areia fina. Um santuário de tranquilidade e banho revigorante.',
    location: 'Dunas da Princesa',
    tag: 'Ecoturismo',
    whatsapp: '5591981234567'
  },
  {
    id: 'story-rabeta',
    title: 'Rabetas',
    subtitle: 'Passeio Manguezais',
    emoji: '🚤',
    coverImage: '/assets/images/rabeta_barco_mar_1787985502030.jpg',
    fullImage: '/assets/images/rabeta_barco_mar_1787985502030.jpg',
    description: 'Passeios de barco rabeta pelo Furo Velho, travessia para Fortalezinha e canais de manguezais preservados.',
    location: 'Furo Velho & Marudá',
    tag: 'Passeios Náuticos',
    whatsapp: '5591981234567'
  },
  {
    id: 'story-carimbo',
    title: 'Carimbó',
    subtitle: 'Cultura & Luau',
    emoji: '🦀',
    coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
    fullImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&auto=format&fit=crop&q=80',
    description: 'A energia contagiante do Carimbó raiz de Marapanim e noites de lua cheia com luau à beira-mar na Princesa.',
    location: 'Praia da Princesa',
    tag: 'Cultura & Música',
    whatsapp: '5591981234567'
  },
  {
    id: 'story-peixada',
    title: 'Gastronomia',
    subtitle: 'Peixada & Açaí',
    emoji: '🍲',
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
    fullImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80',
    description: 'Peixe frito na hora com farinha d\'água de Bragança, caldeiradas fumegantes com tucupi e jambu, e açaí paraense legítimo.',
    location: 'Barracas da Praia & Vila',
    tag: 'Sabor Paraense',
    whatsapp: '5591981234567'
  }
];

export const StoriesRow: React.FC = () => {
  const [selectedStory, setSelectedStory] = useState<IslandStory | null>(null);

  return (
    <section className="py-3 px-4 bg-slate-900 border-b border-slate-800">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
            Destaques da Ilha (Stories)
          </h3>
        </div>
        <span className="text-[10px] font-bold text-teal-400">Toque p/ Ver</span>
      </div>

      {/* Horizontal Stories Carousel */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
        {ISLAND_STORIES.map((story) => (
          <button
            key={story.id}
            onClick={() => setSelectedStory(story)}
            className="flex flex-col items-center gap-1 shrink-0 group focus:outline-hidden cursor-pointer"
          >
            <div className="w-[66px] h-[66px] rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-teal-400 to-emerald-500 group-hover:scale-105 transition duration-200 shadow-md">
              <div className="w-full h-full rounded-full border-2 border-slate-900 overflow-hidden relative bg-slate-800">
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:opacity-90 transition"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="absolute bottom-0 right-0 text-xs bg-slate-950/80 rounded-full px-1">
                  {story.emoji}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-200 truncate max-w-[68px] leading-tight">
              {story.title}
            </span>
          </button>
        ))}
      </div>

      {/* Story Fullscreen Preview Modal */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm h-[82vh] max-h-[700px] rounded-3xl overflow-hidden bg-slate-950 text-white shadow-2xl flex flex-col justify-between border border-teal-500/40">
            {/* Background Image */}
            <img
              src={selectedStory.fullImage}
              alt={selectedStory.title}
              className="absolute inset-0 w-full h-full object-cover opacity-75"
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/80" />

            {/* Top Bar inside Story */}
            <div className="relative z-10 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedStory.emoji}</span>
                <div>
                  <h4 className="text-sm font-black text-white leading-tight">
                    {selectedStory.title}
                  </h4>
                  <span className="text-[10px] text-teal-300 font-bold uppercase tracking-wider">
                    {selectedStory.tag} • {selectedStory.location}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedStory(null)}
                className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom Content inside Story */}
            <div className="relative z-10 p-5 space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wide block mb-1">
                  {selectedStory.subtitle}
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedStory.description}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2">
                  <MapPin className="w-3 h-3 text-teal-400" />
                  <span>{selectedStory.location}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {selectedStory.whatsapp && (
                  <a
                    href={`https://wa.me/${selectedStory.whatsapp}?text=Olá! Vi o destaque de ${encodeURIComponent(selectedStory.title)} no Algodoal Connect e gostaria de mais informações.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chamar no WhatsApp</span>
                  </a>
                )}

                <button
                  onClick={() => setSelectedStory(null)}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
