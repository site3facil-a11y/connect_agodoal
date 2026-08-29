import React from 'react';
import { 
  Compass, 
  ShoppingBag, 
  PhoneCall, 
  Store, 
  Waves, 
  Ship, 
  MapPin, 
  PlusCircle, 
  Sparkles,
  BookOpen,
  LayoutGrid,
  ShieldCheck,
  User,
  LogIn,
  Hotel,
  PartyPopper
} from 'lucide-react';
import { ServiceCategory, UserProfile } from '../types/index.ts';

interface NavbarProps {
  activeCategory: ServiceCategory;
  onSelectCategory: (cat: ServiceCategory) => void;
  orderCount: number;
  onOpenOrders: () => void;
  onOpenPartnerPortal: () => void;
  onOpenNewPartner: () => void;
  onOpenEmergency: () => void;
  isPartnerPortalOpen: boolean;
  currentUser: UserProfile | null;
  onOpenAuthModal: () => void;
  onOpenAdminPanel: () => void;
  onOpenTidesModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  orderCount,
  onOpenOrders,
  onOpenPartnerPortal,
  onOpenNewPartner,
  onOpenEmergency,
  isPartnerPortalOpen,
  currentUser,
  onOpenAuthModal,
  onOpenAdminPanel,
  onOpenTidesModal
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Island Live Status Bar */}
      <div className="bg-sky-900 text-sky-100 text-xs px-3 sm:px-6 py-1.5 flex items-center justify-between overflow-x-auto whitespace-nowrap scrollbar-none">
        <div className="flex items-center gap-3 text-xs font-medium">
          <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse"></span>
            Ilha de Algodoal (APA Maiandeua - PA)
          </span>

          {/* Clickable Tides status badge */}
          <button
            onClick={onOpenTidesModal}
            className="inline-flex items-center gap-1.5 text-sky-100 hover:text-amber-300 transition cursor-pointer font-bold bg-sky-800/80 px-2 py-0.5 rounded-md"
            title="Clique para ver a tábua de marés completa de Marapanim"
          >
            <Waves className="w-3.5 h-3.5 text-amber-300" />
            <span>Tábua de Marés (Marapanim): <strong className="text-white underline">Ver Horários</strong></span>
          </button>

          <span className="hidden md:inline-flex items-center gap-1.5 text-sky-100">
            <Ship className="w-3.5 h-3.5 text-amber-300" />
            Próx. Barco Marudá: <strong className="text-white">14:30</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            id="btn-emergency-contacts"
            onClick={onOpenEmergency}
            className="inline-flex items-center gap-1.5 text-red-100 hover:text-white bg-red-800/80 hover:bg-red-800 border border-red-700/60 px-2.5 py-0.5 rounded-lg transition text-xs font-bold cursor-pointer"
          >
            <PhoneCall className="w-3 h-3 text-amber-300" />
            <span className="hidden sm:inline">Emergência (Posto 24h & PM)</span>
            <span className="sm:hidden">Emergência</span>
          </button>
          
          <button
            id="btn-register-partner"
            onClick={onOpenNewPartner}
            className="hidden sm:inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-bold transition text-xs cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Cadastrar Negócio</span>
          </button>

          {/* Admin Panel Direct Link */}
          <button
            id="btn-admin-panel"
            onClick={onOpenAdminPanel}
            className="inline-flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-2.5 py-0.5 rounded-lg transition text-xs shadow-xs cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Painel Admin</span>
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Brand */}
          <div 
            id="brand-logo"
            onClick={() => {
              if (isPartnerPortalOpen) onOpenPartnerPortal();
              onSelectCategory('transporte');
            }}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-sky-600 via-sky-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition transform">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 font-heading">
                  ALGODOAL
                </span>
                <span className="text-lg sm:text-2xl font-black text-sky-600 font-heading">
                  CONNECT
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] font-bold text-amber-600 tracking-wider uppercase -mt-0.5">
                Guia & Catálogo Oficial da Ilha
              </p>
            </div>
          </div>

          {/* Category Nav Tabs */}
          <div className="hidden lg:flex items-center gap-1">
            <button
              id="tab-nav-transporte"
              onClick={() => {
                if (isPartnerPortalOpen) onOpenPartnerPortal();
                onSelectCategory('transporte');
              }}
              className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white transition transform active:scale-95 cursor-pointer shadow-xs rounded-lg ${
                activeCategory === 'transporte' && !isPartnerPortalOpen
                  ? 'bg-[#008080] ring-2 ring-amber-400 font-extrabold scale-105 z-10'
                  : 'bg-[#008080] hover:bg-[#006666] opacity-90 hover:opacity-100'
              }`}
            >
              TRANSPORTE
            </button>

            <button
              id="tab-nav-pousadas"
              onClick={() => {
                if (isPartnerPortalOpen) onOpenPartnerPortal();
                onSelectCategory('pousadas');
              }}
              className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white transition transform active:scale-95 cursor-pointer shadow-xs rounded-lg ${
                activeCategory === 'pousadas' && !isPartnerPortalOpen
                  ? 'bg-[#0d9488] ring-2 ring-amber-400 font-extrabold scale-105 z-10'
                  : 'bg-[#0d9488] hover:bg-[#0f766e] opacity-90 hover:opacity-100'
              }`}
            >
              POUSADAS
            </button>

            <button
              id="tab-nav-passeios"
              onClick={() => {
                if (isPartnerPortalOpen) onOpenPartnerPortal();
                onSelectCategory('passeios');
              }}
              className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white transition transform active:scale-95 cursor-pointer shadow-xs rounded-lg ${
                activeCategory === 'passeios' && !isPartnerPortalOpen
                  ? 'bg-[#0077b6] ring-2 ring-amber-400 font-extrabold scale-105 z-10'
                  : 'bg-[#0077b6] hover:bg-[#026aa3] opacity-90 hover:opacity-100'
              }`}
            >
              PASSEIOS
            </button>

            <button
              id="tab-nav-alimentacao"
              onClick={() => {
                if (isPartnerPortalOpen) onOpenPartnerPortal();
                onSelectCategory('alimentacao');
              }}
              className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white transition transform active:scale-95 cursor-pointer shadow-xs rounded-lg ${
                activeCategory === 'alimentacao' && !isPartnerPortalOpen
                  ? 'bg-[#f57c00] ring-2 ring-amber-400 font-extrabold scale-105 z-10'
                  : 'bg-[#f57c00] hover:bg-[#e65100] opacity-90 hover:opacity-100'
              }`}
            >
              ALIMENTAÇÃO
            </button>

            <button
              id="tab-nav-compras"
              onClick={() => {
                if (isPartnerPortalOpen) onOpenPartnerPortal();
                onSelectCategory('compras');
              }}
              className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white transition transform active:scale-95 cursor-pointer shadow-xs rounded-lg ${
                activeCategory === 'compras' && !isPartnerPortalOpen
                  ? 'bg-[#558b2f] ring-2 ring-amber-400 font-extrabold scale-105 z-10'
                  : 'bg-[#558b2f] hover:bg-[#437024] opacity-90 hover:opacity-100'
              }`}
            >
              COMPRAS
            </button>

            <button
              id="tab-nav-eventos"
              onClick={() => {
                if (isPartnerPortalOpen) onOpenPartnerPortal();
                onSelectCategory('eventos');
              }}
              className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white transition transform active:scale-95 cursor-pointer shadow-xs rounded-lg ${
                activeCategory === 'eventos' && !isPartnerPortalOpen
                  ? 'bg-[#7e22ce] ring-2 ring-amber-400 font-extrabold scale-105 z-10'
                  : 'bg-[#7e22ce] hover:bg-[#6b21a8] opacity-90 hover:opacity-100'
              }`}
            >
              EVENTOS
            </button>

            <button
              id="tab-nav-informacoes"
              onClick={() => {
                if (isPartnerPortalOpen) onOpenPartnerPortal();
                onSelectCategory('informacoes');
              }}
              className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white transition transform active:scale-95 cursor-pointer shadow-xs rounded-lg ${
                activeCategory === 'informacoes' && !isPartnerPortalOpen
                  ? 'bg-[#6a1b9a] ring-2 ring-amber-400 font-extrabold scale-105 z-10'
                  : 'bg-[#6a1b9a] hover:bg-[#4a148c] opacity-90 hover:opacity-100'
              }`}
            >
              GUIA DA ILHA
            </button>
          </div>

          {/* Action Navigation */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Orders Tracker Button */}
            <button
              id="btn-nav-orders"
              onClick={onOpenOrders}
              className="relative inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold text-xs transition cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-sky-600" />
              <span className="hidden md:inline">Pedidos</span>
              {orderCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-black text-white bg-sky-600 rounded-full min-w-[18px]">
                  {orderCount}
                </span>
              )}
            </button>

            {/* Social Auth Login / User profile button */}
            <button
              id="btn-user-auth"
              onClick={onOpenAuthModal}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition cursor-pointer active:scale-95 shadow-xs"
            >
              {currentUser ? (
                <div className="flex items-center gap-1.5">
                  <img
                    src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                    alt={currentUser.name}
                    className="w-5 h-5 rounded-full object-cover border border-amber-400"
                  />
                  <span className="max-w-[70px] truncate hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <LogIn className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">Entrar</span>
                </div>
              )}
            </button>

            {/* Partner / Business Portal Toggle */}
            <button
              id="btn-nav-partner-portal"
              onClick={onOpenPartnerPortal}
              className={`inline-flex items-center gap-1 px-2 sm:px-3 py-2 rounded-xl font-bold text-xs transition cursor-pointer active:scale-95 ${
                isPartnerPortalOpen
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-white text-sky-700 border border-sky-300 hover:bg-sky-50'
              }`}
            >
              <Store className="w-4 h-4" />
              <span className="hidden md:inline">{isPartnerPortalOpen ? 'Turista' : 'Comerciante'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Category Tab Strip */}
      <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-2 py-1.5 flex items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button
          onClick={() => {
            if (isPartnerPortalOpen) onOpenPartnerPortal();
            onSelectCategory('transporte');
          }}
          className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white rounded-md transition ${
            activeCategory === 'transporte' && !isPartnerPortalOpen
              ? 'bg-[#008080] ring-2 ring-amber-400 font-extrabold'
              : 'bg-[#008080] opacity-90'
          }`}
        >
          TRANSPORTE
        </button>

        <button
          onClick={() => {
            if (isPartnerPortalOpen) onOpenPartnerPortal();
            onSelectCategory('pousadas');
          }}
          className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white rounded-md transition ${
            activeCategory === 'pousadas' && !isPartnerPortalOpen
              ? 'bg-[#0d9488] ring-2 ring-amber-400 font-extrabold'
              : 'bg-[#0d9488] opacity-90'
          }`}
        >
          POUSADAS
        </button>

        <button
          onClick={() => {
            if (isPartnerPortalOpen) onOpenPartnerPortal();
            onSelectCategory('passeios');
          }}
          className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white rounded-md transition ${
            activeCategory === 'passeios' && !isPartnerPortalOpen
              ? 'bg-[#0077b6] ring-2 ring-amber-400 font-extrabold'
              : 'bg-[#0077b6] opacity-90'
          }`}
        >
          PASSEIOS
        </button>

        <button
          onClick={() => {
            if (isPartnerPortalOpen) onOpenPartnerPortal();
            onSelectCategory('alimentacao');
          }}
          className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white rounded-md transition ${
            activeCategory === 'alimentacao' && !isPartnerPortalOpen
              ? 'bg-[#f57c00] ring-2 ring-amber-400 font-extrabold'
              : 'bg-[#f57c00] opacity-90'
          }`}
        >
          ALIMENTAÇÃO
        </button>

        <button
          onClick={() => {
            if (isPartnerPortalOpen) onOpenPartnerPortal();
            onSelectCategory('compras');
          }}
          className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white rounded-md transition ${
            activeCategory === 'compras' && !isPartnerPortalOpen
              ? 'bg-[#558b2f] ring-2 ring-amber-400 font-extrabold'
              : 'bg-[#558b2f] opacity-90'
          }`}
        >
          COMPRAS
        </button>

        <button
          onClick={() => {
            if (isPartnerPortalOpen) onOpenPartnerPortal();
            onSelectCategory('eventos');
          }}
          className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white rounded-md transition ${
            activeCategory === 'eventos' && !isPartnerPortalOpen
              ? 'bg-[#7e22ce] ring-2 ring-amber-400 font-extrabold'
              : 'bg-[#7e22ce] opacity-90'
          }`}
        >
          EVENTOS
        </button>

        <button
          onClick={() => {
            if (isPartnerPortalOpen) onOpenPartnerPortal();
            onSelectCategory('informacoes');
          }}
          className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white rounded-md transition ${
            activeCategory === 'informacoes' && !isPartnerPortalOpen
              ? 'bg-[#6a1b9a] ring-2 ring-amber-400 font-extrabold'
              : 'bg-[#6a1b9a] opacity-90'
          }`}
        >
          GUIA
        </button>
      </div>
    </header>
  );
};
