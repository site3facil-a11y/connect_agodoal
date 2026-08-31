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
  category?: string;
  whatsapp?: string;
}

const ISLAND_STORIES: IslandStory[] = [
  {
    id: 'story-porto',
    title: 'Chegada',
    subtitle: 'Trapiche & Porto de Algodoal',
    emoji: '🏝️',
    coverImage: '/imagens/porto.jpg',
    fullImage: '/imagens/porto.jpg',
    description: 'Vista aérea espetacular da chegada em Algodoal. O porto e o trapiche de madeira dão as boas-vindas com águas calmas e rabetas ancoradas.',
    location: 'Porto de Algodoal / Canal',
    tag: 'Chegada na Ilha',
    category: 'todos',
    whatsapp: '5591983456789'
  },
  {
    id: 'story-charrete',
    title: 'Charretes',
    subtitle: 'Transporte Oficial Credenciado',
    emoji: '🐎',
    coverImage: '/imagens/vila.jpg',
    fullImage: '/imagens/vila.jpg',
    description: 'Na Ilha de Algodoal não circulam carros. O transporte oficial e ecológico é feito por charreteiros credenciados que conduzem com carinho pelas ruas de areia.',
    location: 'Porto de Algodoal ⇄ Praia da Princesa',
    tag: 'Transporte APA',
    category: 'transporte',
    whatsapp: '5591983456789'
  },
  {
    id: 'story-vila',
    title: 'A Vila',
    subtitle: 'Ruas Floridas & Natureza',
    emoji: '🌸',
    coverImage: '/imagens/vila2.jpg',
    fullImage: '/imagens/vila2.jpg',
    description: 'Ruas tranquilas de areia batida ladeadas por buganvílias, coqueirais e casas rústicas com vista direta para a brisa do Atlântico.',
    location: 'Vila de Algodoal',
    tag: 'Passeio a Pé',
    category: 'pousadas',
    whatsapp: '5591981234567'
  },
  {
    id: 'story-praia',
    title: 'Maré Baixa',
    subtitle: 'Praia da Princesa & Manguezais',
    emoji: '🌊',
    coverImage: '/imagens/algodoal.jpg',
    fullImage: '/imagens/algodoal.jpg',
    description: 'Na maré baixa, bancos de areia dourada se estendem por quilômetros entre canais verdes e manguezais preservados da APA.',
    location: 'Praia da Princesa & Dunas',
    tag: 'Natureza Selvagem',
    category: 'passeios',
    whatsapp: '5591981234567'
  },
  {
    id: 'story-rabeta',
    title: 'Rabetas',
    subtitle: 'Navegação pelos Canais',
    emoji: '🚤',
    coverImage: '/imagens/canal.jpg',
    fullImage: '/imagens/canal.jpg',
    description: 'Passeios de barco rabeta pelo Furo Velho, travessia para Fortalezinha e navegação em águas esverdeadas e límpidas com mestres locais.',
    location: 'Canal do Furo Velho & Camboinha',
    tag: 'Passeios Náuticos',
    category: 'passeios',
    whatsapp: '5591984567890'
  },
  {
    id: 'story-por-do-sol',
    title: 'Pôr do Sol',
    subtitle: 'Charrete ao Entardecer Dourado',
    emoji: '🌅',
    coverImage: '/imagens/carroca.jpg',
    fullImage: '/imagens/carroca.jpg',
    description: 'O pôr do sol inesquecível na beira da Praia da Princesa com charretes trotando nas águas rasas sob a luz dourada do fim de tarde.',
    location: 'Praia da Princesa',
    tag: 'Cenário Mágico',
    category: 'passeios',
    whatsapp: '5591983456789'
  },
  {
    id: 'story-festa',
    title: 'Luau & Reggae',
    subtitle: 'Noites de Carimbó & Reggae Raiz',
    emoji: '🔥',
    coverImage: '/imagens/festa.jpg',
    fullImage: '/imagens/festa.jpg',
    description: 'A energia contagiante do Carimbó raiz de Marapanim, luaus pé na areia e noites de reggae paraense com fogueira à beira-mar.',
    location: 'Praia da Princesa (Decks Culturais)',
    tag: 'Cultura & Música',
    category: 'eventos',
    whatsapp: '5591986789012'
  },
  {
    id: 'story-maruda',
    title: 'Travessia',
    subtitle: 'Marudá ⇄ Algodoal',
    emoji: '⚓',
    coverImage: '/imagens/porto2.jpg',
    fullImage: '/imagens/porto2.jpg',
    description: 'A travessia tradicional de barco a partir do porto de Marudá com vista para as praias e a vida caiçara da Amazônia Atlântica.',
    location: 'Porto de Marudá / Algodoal',
    tag: 'Barcos de Linha',
    category: 'compras',
    whatsapp: '5591984567890'
  }
];

interface StoriesRowProps {
  theme?: 'dark' | 'light';
  selectedCategory?: string;
  onSelectCategory?: (cat: string) => void;
  showHeaderTitle?: boolean;
  className?: string;
}

export const StoriesRow: React.FC<StoriesRowProps> = ({ 
  theme = 'dark',
  selectedCategory,
  onSelectCategory,
  showHeaderTitle = true,
  className = ''
}) => {
  const [selectedStory, setSelectedStory] = useState<IslandStory | null>(null);
  const isDark = theme === 'dark';

  const handleStoryClick = (story: IslandStory) => {
    setSelectedStory(story);
    if (onSelectCategory && story.category) {
      onSelectCategory(story.category);
    }
  };

  return (
    <section className={`py-3 px-4 transition-colors ${
      isDark ? 'bg-slate-900' : 'bg-white'
    } ${className}`}>
      {showHeaderTitle && (
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <h3 className={`text-xs font-black uppercase tracking-wider ${
              isDark ? 'text-slate-300' : 'text-slate-800'
            }`}>
              Destaques da Ilha (Stories)
            </h3>
          </div>
          <span className="text-[10px] font-bold text-teal-600">Toque p/ Ver</span>
        </div>
      )}

      {/* Horizontal Stories Carousel */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
        {ISLAND_STORIES.map((story) => {
          const isSelectedCategory = selectedCategory && story.category === selectedCategory && story.category !== 'todos';

          return (
            <button
              key={story.id}
              onClick={() => handleStoryClick(story)}
              className="flex flex-col items-center gap-1 shrink-0 group focus:outline-hidden cursor-pointer"
            >
              <div className={`w-[66px] h-[66px] rounded-full p-[2px] transition duration-200 shadow-md ${
                isSelectedCategory
                  ? 'bg-gradient-to-tr from-amber-400 via-teal-400 to-emerald-400 scale-105 ring-2 ring-teal-400 ring-offset-2 ring-offset-slate-900'
                  : 'bg-gradient-to-tr from-amber-400 via-teal-400 to-emerald-500 group-hover:scale-105'
              }`}>
                <div className={`w-full h-full rounded-full border-2 overflow-hidden relative ${
                  isDark ? 'border-slate-900 bg-slate-800' : 'border-white bg-slate-100'
                }`}>
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:opacity-90 transition"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="absolute bottom-0 right-0 text-xs bg-slate-950/80 text-white rounded-full px-1">
                    {story.emoji}
                  </span>
                </div>
              </div>
              <span className={`text-[11px] font-bold truncate max-w-[68px] leading-tight ${
                isSelectedCategory
                  ? 'text-teal-400 font-black'
                  : isDark ? 'text-slate-200' : 'text-slate-700'
              }`}>
                {story.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Story Fullscreen Preview Modal */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm h-[82vh] max-h-[700px] rounded-3xl overflow-hidden bg-slate-950 text-white shadow-2xl flex flex-col justify-between border border-teal-500/40">
            {/* Background Story Image */}
            <img
              src={selectedStory.fullImage}
              alt={selectedStory.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/images/algodoal_sunset_1787985478872.jpg';
              }}
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/95" />

            {/* Top Bar inside Story */}
            <div className="relative z-10 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedStory.emoji}</span>
                <div>
                  <h4 className="text-sm font-black leading-none">{selectedStory.title}</h4>
                  <span className="text-[10px] text-teal-300 font-semibold">{selectedStory.tag}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedStory(null)}
                className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/80 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom Content inside Story */}
            <div className="relative z-10 p-5 space-y-3">
              <div className="flex items-center gap-1 text-xs text-amber-300 font-bold">
                <MapPin className="w-3.5 h-3.5" />
                <span>{selectedStory.location}</span>
              </div>

              <h3 className="text-lg font-black font-heading leading-snug">
                {selectedStory.subtitle}
              </h3>

              <p className="text-xs text-slate-200 leading-relaxed bg-black/40 p-3 rounded-2xl backdrop-blur-xs border border-white/10">
                {selectedStory.description}
              </p>

              <div className="pt-2 flex items-center gap-2">
                {selectedStory.whatsapp && (
                  <a
                    href={`https://wa.me/${selectedStory.whatsapp}?text=Olá! Vi o destaque sobre ${encodeURIComponent(selectedStory.title)} no Algodoal Connect.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Saber Mais no WhatsApp</span>
                  </a>
                )}
                <button
                  onClick={() => setSelectedStory(null)}
                  className="py-3 px-4 rounded-2xl bg-white/20 text-white font-bold text-xs backdrop-blur-md hover:bg-white/30 transition"
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
