import React, { useState } from 'react';
import { 
  Search, 
  Car, 
  Sailboat, 
  ShoppingBag, 
  Utensils, 
  MapPin, 
  ChevronRight,
  ArrowRight,
  Sparkles,
  Sun,
  Waves,
  Compass,
  PhoneCall,
  CheckCircle2,
  Hotel,
  PartyPopper
} from 'lucide-react';
import { ServiceCategory, Advertisement } from '../types/index.ts';
import { api } from '../services/api.ts';
import { AlgodoalLogoBadge } from './AlgodoalLogoBadge.tsx';

interface HeroBannerProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSelectCategory: (cat: ServiceCategory) => void;
  onQuickCallCart: () => void;
  advertisements?: Advertisement[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchTerm,
  onSearchChange,
  onSelectCategory,
  onQuickCallCart,
  advertisements = []
}) => {
  // Find custom ads assigned to banner slots by admin
  const ad1 = advertisements.find(a => a.banner_slot === 'banner_1' && a.is_active);
  const ad2 = advertisements.find(a => a.banner_slot === 'banner_2' && a.is_active);
  const ad3 = advertisements.find(a => a.banner_slot === 'banner_3' && a.is_active);
  const ad4 = advertisements.find(a => a.banner_slot === 'banner_4' && a.is_active);

  const handleBannerClick = (slot: string, category: ServiceCategory, ad?: Advertisement) => {
    if (ad?.id) {
      api.recordAdMetric(ad.id, 'click');
    }
    onSelectCategory(category);
  };

  return (
    <div className="bg-[#f8fafc] py-4 sm:py-6 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Main Grid: Left Graphic Card + Right 4 Stacked Banners */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-stretch">
          
          {/* ========================================================= */}
          {/* LEFT SIDE: ALGODOAL CONNECT ARTWORK & HERO BANNER CARD    */}
          {/* ========================================================= */}
          <div className="lg:col-span-8 relative rounded-3xl overflow-hidden shadow-xl border border-sky-300/60 bg-gradient-to-br from-[#024976] via-[#075985] to-[#0c4a6e] min-h-[440px] sm:min-h-[500px] flex flex-col justify-between text-white p-5 sm:p-8">
            
            {/* Background Tropical Landscape & Sunshine Layers */}
            <div 
              className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30 pointer-events-none"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80')`
              }}
            />
            
            {/* Sun & Sea Vector Art in Background */}
            <div className="absolute top-4 right-1/4 sm:right-1/3 pointer-events-none opacity-80">
              <div className="relative">
                {/* Golden Sun Disc */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-t from-amber-500 via-amber-400 to-yellow-300 shadow-[0_0_50px_rgba(251,191,36,0.5)]"></div>
                {/* Wave Curves passing over Sun */}
                <div className="absolute bottom-1 -left-4 right-0 h-8 flex items-center gap-1 opacity-90">
                  <svg viewBox="0 0 100 25" className="w-28 text-sky-200 fill-current">
                    <path d="M0 10 Q 25 0, 50 10 T 100 10 L 100 25 L 0 25 Z" opacity="0.7"/>
                  </svg>
                </div>
                {/* White Flying Seagulls */}
                <div className="absolute -top-3 -left-8 text-white/90 text-sm font-black transform -rotate-12">
                  <svg className="w-5 h-4" viewBox="0 0 24 14" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 12C6 4 10 4 12 8C14 4 18 4 22 12" />
                  </svg>
                </div>
                <div className="absolute top-2 -left-12 text-white/70 text-xs transform rotate-6">
                  <svg className="w-4 h-3" viewBox="0 0 24 14" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 12C6 4 10 4 12 8C14 4 18 4 22 12" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Content Top: Brand Identity Header */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/90 text-slate-950 text-xs font-black uppercase tracking-wider mb-2 shadow-md">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>APA Estadual de Algodoal e Maiandeua</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-heading leading-tight drop-shadow-md">
                  ALGODOAL <span className="text-amber-400">CONNECT</span>
                </h1>
                <p className="text-xs sm:text-sm font-bold text-sky-100 max-w-lg drop-shadow-xs">
                  O guia completo e aplicativo oficial de serviços, charretes, rabetas, pousadas e culinária da Ilha de Algodoal.
                </p>
              </div>

              {/* Official Island Colorful Block Badge with White Garça */}
              <div className="shrink-0">
                <AlgodoalLogoBadge size="md" />
              </div>
            </div>

            {/* Quick Search Bar */}
            <div className="relative z-10 my-4 max-w-xl">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar charrete, rabeta, pousada, peixada, água 20L..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 sm:py-3.5 bg-white text-slate-900 rounded-2xl text-xs sm:text-sm font-semibold shadow-lg focus:outline-hidden focus:ring-3 focus:ring-amber-400 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Bottom 5 Core Category Boxes with Native Color Themes */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
              
              {/* Box 1: Transporte (Charretes / Barcos) */}
              <button
                id="btn-hero-cat-transporte"
                onClick={() => onSelectCategory('transporte')}
                className="bg-[#008080] hover:bg-[#006666] p-3 rounded-2xl text-left text-white transition transform active:scale-95 shadow-md flex flex-col justify-between h-24 border border-teal-300/30 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-teal-200">#01</span>
                  <Car className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <div className="font-black text-xs sm:text-sm leading-tight">TRANSPORTE</div>
                  <div className="text-[10px] text-teal-100 font-medium">Charretes & Bagagem</div>
                </div>
              </button>

              {/* Box 2: Pousadas & Chalés */}
              <button
                id="btn-hero-cat-pousadas"
                onClick={() => onSelectCategory('pousadas')}
                className="bg-[#0d9488] hover:bg-[#0f766e] p-3 rounded-2xl text-left text-white transition transform active:scale-95 shadow-md flex flex-col justify-between h-24 border border-teal-400/30 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-teal-200">#02</span>
                  <Hotel className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <div className="font-black text-xs sm:text-sm leading-tight">POUSADAS</div>
                  <div className="text-[10px] text-teal-100 font-medium">Chalés & Hospedagem</div>
                </div>
              </button>

              {/* Box 3: Passeios (Rabetas & Lago) */}
              <button
                id="btn-hero-cat-passeios"
                onClick={() => onSelectCategory('passeios')}
                className="bg-[#0077b6] hover:bg-[#026aa3] p-3 rounded-2xl text-left text-white transition transform active:scale-95 shadow-md flex flex-col justify-between h-24 border border-sky-300/30 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-sky-200">#03</span>
                  <Sailboat className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <div className="font-black text-xs sm:text-sm leading-tight">PASSEIOS</div>
                  <div className="text-[10px] text-sky-100 font-medium">Rabetas & Lago</div>
                </div>
              </button>

              {/* Box 4: Alimentação (Peixadas & Jambu) */}
              <button
                id="btn-hero-cat-alimentacao"
                onClick={() => onSelectCategory('alimentacao')}
                className="bg-[#f57c00] hover:bg-[#e65100] p-3 rounded-2xl text-left text-white transition transform active:scale-95 shadow-md flex flex-col justify-between h-24 border border-orange-300/30 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-orange-200">#04</span>
                  <Utensils className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <div className="font-black text-xs sm:text-sm leading-tight">ALIMENTAÇÃO</div>
                  <div className="text-[10px] text-orange-100 font-medium">Peixe & Caldeirada</div>
                </div>
              </button>

              {/* Box 5: Compras & Galão de Água */}
              <button
                id="btn-hero-cat-compras"
                onClick={() => onSelectCategory('compras')}
                className="bg-[#558b2f] hover:bg-[#437024] p-3 rounded-2xl text-left text-white transition transform active:scale-95 shadow-md flex flex-col justify-between h-24 border border-lime-300/30 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-lime-200">#05</span>
                  <ShoppingBag className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <div className="font-black text-xs sm:text-sm leading-tight">COMPRAS</div>
                  <div className="text-[10px] text-lime-100 font-medium">Água 20L & Gelo</div>
                </div>
              </button>

            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT SIDE: 4 STACKED COLORFUL BANNERS (ANÚNCIOS DINÂMICOS)*/}
          {/* ========================================================= */}
          <div className="lg:col-span-4 flex flex-col gap-3 justify-between">
            
            {/* -------------------------------------------------------- */}
            {/* BANNER 1: Yellow/Amber Border (Transporte / Charrete)    */}
            {/* -------------------------------------------------------- */}
            <div 
              id="hero-banner-1"
              onClick={() => handleBannerClick('banner_1', 'transporte', ad1)}
              className="bg-white rounded-2xl p-3.5 sm:p-4 border-[3px] border-[#f59e0b] shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-950 border border-amber-300">
                    TRANSPORTE
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">Ponto do Porto</span>
                </div>
                <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-heading group-hover:text-amber-600 transition">
                  {ad1?.title ? (ad1.title.length > 20 ? ad1.title.slice(0, 20) + '...' : ad1.title) : 'banner 1'}
                </h4>
              </div>

              <div className="my-1.5">
                <h5 className="text-xs sm:text-sm font-black text-slate-900">
                  {ad1?.business_name || 'Charretes & Transporte no Porto'}
                </h5>
                <p className="text-[11px] text-slate-600 leading-tight mt-0.5 line-clamp-2">
                  {ad1?.tagline || ad1?.description || 'Desembarque com tranquilidade e chame charrete credenciada com preço tabelado para malas.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 mt-1">
                <span className="text-[11px] font-black text-amber-700">
                  {ad1?.price_starting ? `A partir de R$ ${ad1.price_starting.toFixed(2)}` : 'A partir de R$ 30,00'}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 group-hover:translate-x-1 transition">
                  Chamar Charrete <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* -------------------------------------------------------- */}
            {/* BANNER 2: Red/Wine Border (Alimentação / Gastronomia)     */}
            {/* -------------------------------------------------------- */}
            <div 
              id="hero-banner-2"
              onClick={() => handleBannerClick('banner_2', 'alimentacao', ad2)}
              className="bg-white rounded-2xl p-3.5 sm:p-4 border-[3px] border-[#881337] shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase px-2 py-0.5 rounded-md bg-rose-100 text-rose-950 border border-rose-300">
                    ALIMENTAÇÃO
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">Pratos Típicos</span>
                </div>
                <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-heading group-hover:text-rose-800 transition">
                  {ad2?.title ? (ad2.title.length > 20 ? ad2.title.slice(0, 20) + '...' : ad2.title) : 'banner 2'}
                </h4>
              </div>

              <div className="my-1.5">
                <h5 className="text-xs sm:text-sm font-black text-slate-900">
                  {ad2?.business_name || 'Peixadas, Caldeiradas & Quiosques'}
                </h5>
                <p className="text-[11px] text-slate-600 leading-tight mt-0.5 line-clamp-2">
                  {ad2?.tagline || ad2?.description || 'Peixe frito com açaí, caldeirada com jambu e tucupi e caranguejada fresca nas praias.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 mt-1">
                <span className="text-[11px] font-black text-rose-900">
                  {ad2?.badge || 'Quiosques & Restaurantes'}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-900 group-hover:translate-x-1 transition">
                  Ver Cardápios <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* -------------------------------------------------------- */}
            {/* BANNER 3: Lime Green Border (Compras / Depósito & Água)   */}
            {/* -------------------------------------------------------- */}
            <div 
              id="hero-banner-3"
              onClick={() => handleBannerClick('banner_3', 'compras', ad3)}
              className="bg-white rounded-2xl p-3.5 sm:p-4 border-[3px] border-[#84cc16] shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase px-2 py-0.5 rounded-md bg-lime-100 text-lime-950 border border-lime-300">
                    COMPRAS
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">Entrega na Pousada</span>
                </div>
                <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-heading group-hover:text-lime-700 transition">
                  {ad3?.title ? (ad3.title.length > 20 ? ad3.title.slice(0, 20) + '...' : ad3.title) : 'banner 3'}
                </h4>
              </div>

              <div className="my-1.5">
                <h5 className="text-xs sm:text-sm font-black text-slate-900">
                  {ad3?.business_name || 'Depósito de Água 20L, Gelo & Mercearia'}
                </h5>
                <p className="text-[11px] text-slate-600 leading-tight mt-0.5 line-clamp-2">
                  {ad3?.tagline || ad3?.description || 'Garrafões de água mineral, gelo filtrado, bebidas e carvão entregues onde você estiver.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 mt-1">
                <span className="text-[11px] font-black text-lime-800">
                  {ad3?.price_starting ? `Garrafão: R$ ${ad3.price_starting.toFixed(2)}` : 'Garrafão 20L: R$ 14,00'}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-lime-800 group-hover:translate-x-1 transition">
                  Pedir no Depósito <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* -------------------------------------------------------- */}
            {/* BANNER 4: Sky Blue Border (Passeios / Ecoturismo)        */}
            {/* -------------------------------------------------------- */}
            <div 
              id="hero-banner-4"
              onClick={() => handleBannerClick('banner_4', 'passeios', ad4)}
              className="bg-white rounded-2xl p-3.5 sm:p-4 border-[3px] border-[#38bdf8] shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase px-2 py-0.5 rounded-md bg-sky-100 text-sky-950 border border-sky-300">
                    PASSEIOS
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">Rabetas & Barcos</span>
                </div>
                <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-heading group-hover:text-sky-600 transition">
                  {ad4?.title ? (ad4.title.length > 20 ? ad4.title.slice(0, 20) + '...' : ad4.title) : 'banner 4'}
                </h4>
              </div>

              <div className="my-1.5">
                <h5 className="text-xs sm:text-sm font-black text-slate-900">
                  {ad4?.business_name || 'Passeios de Rabeta & Lago da Princesa'}
                </h5>
                <p className="text-[11px] text-slate-600 leading-tight mt-0.5 line-clamp-2">
                  {ad4?.tagline || ad4?.description || 'Roteiros pelo Furo Velho, dunas, manguezais, Ilha da Pedra Mole e Fortalezinha.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 mt-1">
                <span className="text-[11px] font-black text-sky-800">
                  {ad4?.price_starting ? `A partir de R$ ${ad4.price_starting.toFixed(2)}` : 'A partir de R$ 25,00'}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-800 group-hover:translate-x-1 transition">
                  Ver Roteiros <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
