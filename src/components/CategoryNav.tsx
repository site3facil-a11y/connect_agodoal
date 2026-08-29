import React from 'react';
import { 
  Car, 
  Sailboat, 
  ShoppingBag, 
  Utensils, 
  MapPin,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { ServiceCategory } from '../types/index.ts';

interface CategoryNavProps {
  activeCategory: ServiceCategory;
  onSelectCategory: (cat: ServiceCategory) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const categories = [
    {
      id: 'transporte' as ServiceCategory,
      title: 'TRANSPORTE',
      subtitle: 'Chame charretes com rapidez e facilidade',
      icon: Car,
      badge: 'Charretes & Malas',
      iconBg: 'bg-amber-100 text-amber-900 border border-amber-300',
      activeBorder: 'border-amber-500 ring-2 ring-amber-400 bg-amber-50/60',
    },
    {
      id: 'passeios' as ServiceCategory,
      title: 'PASSEIOS',
      subtitle: 'Reserve rabetas para Fortalezinha e Lago',
      icon: Sailboat,
      badge: 'Rabetas & Barcos',
      iconBg: 'bg-sky-100 text-sky-900 border border-sky-300',
      activeBorder: 'border-sky-500 ring-2 ring-sky-400 bg-sky-50/60',
    },
    {
      id: 'compras' as ServiceCategory,
      title: 'COMPRAS',
      subtitle: 'Água mineral 20L, gelo, bebidas e gás',
      icon: ShoppingBag,
      badge: 'Entrega na Pousada',
      iconBg: 'bg-emerald-100 text-emerald-900 border border-emerald-300',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-400 bg-emerald-50/60',
    },
    {
      id: 'alimentacao' as ServiceCategory,
      title: 'ALIMENTAÇÃO',
      subtitle: 'Peixada, caldeirada com jambu e quiosques',
      icon: Utensils,
      badge: 'Restaurantes da Ilha',
      iconBg: 'bg-orange-100 text-orange-900 border border-orange-300',
      activeBorder: 'border-orange-500 ring-2 ring-orange-400 bg-orange-50/60',
    },
    {
      id: 'informacoes' as ServiceCategory,
      title: 'INFORMAÇÕES',
      subtitle: 'Mapa da ilha, tábua de marés e barcos',
      icon: MapPin,
      badge: 'Guia Oficial & Marés',
      iconBg: 'bg-teal-100 text-teal-900 border border-teal-300',
      activeBorder: 'border-teal-500 ring-2 ring-teal-400 bg-teal-50/60',
    }
  ];

  return (
    <section className="py-8 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-sky-700 uppercase">
              CATEGORIAS OFICIAIS DA ILHA
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
              Serviços da Ilha de Algodoal
            </h2>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline font-medium">
            Selecione uma categoria para explorar os serviços
          </span>
        </div>

        {/* 5 Distinct Cards matching the Flyer visual */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                id={`cat-card-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`relative flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl transition-all transform duration-200 cursor-pointer shadow-xs ${
                  isSelected
                    ? `${cat.activeBorder} shadow-md scale-102`
                    : 'bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-white'
                }`}
              >
                {/* Visual Icon Arch */}
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${cat.iconBg} flex items-center justify-center mb-2.5 transition transform group-hover:scale-105 shadow-2xs`}
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>

                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 bg-white text-slate-800 border border-slate-200 shadow-2xs">
                  {cat.badge}
                </span>

                <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-wide font-heading">
                  {cat.title}
                </h3>

                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed hidden sm:block">
                  {cat.subtitle}
                </p>

                {isSelected && (
                  <span className="mt-2 text-[10px] font-bold text-sky-700 flex items-center gap-0.5">
                    Ativo <ChevronRight className="w-3 h-3" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
