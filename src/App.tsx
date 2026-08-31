import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Monitor, 
  Maximize2, 
  Sparkles, 
  ShieldCheck, 
  Waves, 
  Truck, 
  ShoppingBag, 
  Hotel, 
  Utensils, 
  Compass, 
  Info,
  Calendar,
  Layers,
  Heart,
  Share2
} from 'lucide-react';

import { Advertisement, Partner, TideDayEntry, UserProfile } from './types/index.ts';
import { api } from './services/api.ts';

// Mobile-First Components
import { MobileTopBar } from './components/mobile/MobileTopBar.tsx';
import { StoriesRow } from './components/mobile/StoriesRow.tsx';
import { HeroBannersCarousel } from './components/mobile/HeroBannersCarousel.tsx';
import { QuickActionsGrid } from './components/mobile/QuickActionsGrid.tsx';
import { TideWaveWidget } from './components/mobile/TideWaveWidget.tsx';
import { CharreteGoCalculator } from './components/mobile/CharreteGoCalculator.tsx';
import { MobileCategoryFeed } from './components/mobile/MobileCategoryFeed.tsx';
import { MobileBottomNav, TabType } from './components/mobile/MobileBottomNav.tsx';
import { QuickOrderModal } from './components/mobile/QuickOrderModal.tsx';
import { AdminPanelModal } from './components/AdminPanelModal.tsx';
import { TideScheduleModal } from './components/TideScheduleModal.tsx';

// Fallback Initial Partners Data for Instant Prototype Rendering
const INITIAL_PROTOTYPE_PARTNERS: Partner[] = [
  {
    id: 'p1',
    name: 'Pousada & Chalés Princesa do Mar',
    category: 'pousadas',
    subcategory: 'Hospedagem Frente ao Mar',
    phone: '5591981234567',
    whatsapp: '5591981234567',
    description: 'Chalés privativos com vista para o mar, ar-condicionado, Wi-Fi Starlink e café da manhã regional incluso com tapioquinha na hora.',
    photo_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
    location: 'Praia da Princesa (Beira-mar)',
    rating: 4.9,
    total_reviews: 48,
    is_active: true,
    verified: true,
    price_starting: 180.00,
    amenities: ['Frente ao Mar', 'Ar-Condicionado', 'Wi-Fi Starlink', 'Café da Manhã'],
    created_at: '2026-01-01'
  },
  {
    id: 'p2',
    name: 'Restaurante & Peixada da Ilha',
    category: 'alimentacao',
    subcategory: 'Gastronomia Paraense & Peixada',
    phone: '5591982345678',
    whatsapp: '5591982345678',
    description: 'A mais famosa peixada da ilha com filhote grelhado, caldeirada com jambu e tucupi, e açaí paraense legítimo batido no dia.',
    photo_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    location: 'Praia da Princesa, Barraca #07',
    rating: 4.8,
    total_reviews: 94,
    is_active: true,
    verified: true,
    price_starting: 65.00,
    amenities: ['Pé na Areia', 'Peixe Fresco', 'Açaí Puro', 'Aceita PIX'],
    created_at: '2026-01-01'
  },
  {
    id: 'p3',
    name: 'Associação de Charreteiros da APA #14',
    category: 'transporte',
    subcategory: 'Transporte Oficial Credenciado',
    phone: '5591983456789',
    whatsapp: '5591983456789',
    description: 'Charrete credenciada pelo Instituto de Desenvolvimento Florestal e da Biodiversidade (IDEFLOR-Bio). Transporte seguro de bagagens do porto até a Princesa.',
    photo_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    location: 'Porto de Algodoal (Ponto Oficial)',
    rating: 5.0,
    total_reviews: 120,
    is_active: true,
    verified: true,
    price_starting: 35.00,
    vehicle_badge: 'Charrete #14',
    amenities: ['Credenciado APA', 'Capacidade 4 pax', 'Espaço P/ Malas'],
    created_at: '2026-01-01'
  },
  {
    id: 'p4',
    name: 'Passeio de Rabeta Furo Velho & Lago',
    category: 'passeios',
    subcategory: 'Ecoturismo & Travessias',
    phone: '5591984567890',
    whatsapp: '5591984567890',
    description: 'Passeios de barco rabeta pelos canais do Furo Velho, dunas do Lago da Princesa e travessias rápidas para Fortalezinha e Camboinha.',
    photo_url: '/assets/images/rabeta_barco_mar_1787985502030.jpg',
    location: 'Praia do Porto / Canal',
    rating: 4.9,
    total_reviews: 62,
    is_active: true,
    verified: true,
    price_starting: 25.00,
    vehicle_badge: 'Rabeta Estrela do Mar',
    amenities: ['Coletes Salva-Vidas', 'Guia Local', 'Parada p/ Banho'],
    created_at: '2026-01-01'
  },
  {
    id: 'p5',
    name: 'Disk Gelo & Água Mineral 20L Princesa',
    category: 'compras',
    subcategory: 'Depósito & Conveniência',
    phone: '5591985678901',
    whatsapp: '5591985678901',
    description: 'Entrega rápida de galão de água mineral 20L, sacos de gelo filtrado 5kg/10kg, carvão e bebidas direto na sua barraca ou casa.',
    photo_url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=800&auto=format&fit=crop&q=80',
    location: 'Vila de Algodoal (Entrega em toda a ilha)',
    rating: 4.9,
    total_reviews: 77,
    is_active: true,
    verified: true,
    price_starting: 15.00,
    amenities: ['Entrega Express', 'Gelo Filtrado', 'Água 20L', 'PIX'],
    created_at: '2026-01-01'
  },
  {
    id: 'p6',
    name: 'Luau & Noite do Carimbó Raiz',
    category: 'eventos',
    subcategory: 'Cultura & Música ao Vivo',
    phone: '5591986789012',
    whatsapp: '5591986789012',
    description: 'Apresentações semanais do tradicional Carimbó de Marapanim, fogueira na praia da Princesa e noites de reggae paraense.',
    photo_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
    location: 'Praia da Princesa (Espaço Cultural)',
    rating: 5.0,
    total_reviews: 83,
    is_active: true,
    verified: true,
    price_starting: 0.00,
    amenities: ['Entrada Franca', 'Carimbó Raiz', 'Bebidas Geladas'],
    created_at: '2026-01-01'
  }
];

export function App() {
  // Device Frame View State ('mobile-frame' | 'mobile-wide' | 'fullscreen')
  const [deviceView, setDeviceView] = useState<'mobile-frame' | 'fullscreen'>('mobile-frame');

  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modals
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isTidesModalOpen, setIsTidesModalOpen] = useState(false);
  const [isCharreteModalOpen, setIsCharreteModalOpen] = useState(false);
  const [isQuickOrderModalOpen, setIsQuickOrderModalOpen] = useState(false);

  // Data States
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [partners, setPartners] = useState<Partner[]>(INITIAL_PROTOTYPE_PARTNERS);
  const [tideDays, setTideDays] = useState<TideDayEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadRealData();
  }, []);

  const loadRealData = async () => {
    try {
      // 1. Fetch Real Ads from Backend
      const resAds = await fetch('/api/advertisements?only_active=true');
      if (resAds.ok) {
        const dataAds = await resAds.json();
        if (dataAds && dataAds.length > 0) {
          setAdvertisements(dataAds);
        }
      }

      // 2. Fetch Real Partners
      const resPartners = await fetch('/api/partners');
      if (resPartners.ok) {
        const dataPartners = await resPartners.json();
        if (dataPartners && dataPartners.length > 0) {
          setPartners(dataPartners);
        }
      }

      // 3. Fetch Tides
      const resTides = await fetch('/api/tides/days');
      if (resTides.ok) {
        const dataTides = await resTides.json();
        if (dataTides && dataTides.length > 0) {
          setTideDays(dataTides);
        }
      }
    } catch (err) {
      console.log('Utilizando dados estruturados para renderização do protótipo.');
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'mares') {
      setIsTidesModalOpen(true);
    } else if (tab === 'transporte') {
      setSelectedCategory('transporte');
    } else if (tab === 'pedidos') {
      setIsQuickOrderModalOpen(true);
    } else if (tab === 'admin') {
      setIsAdminModalOpen(true);
    }
  };

  const todayTide = tideDays && tideDays.length > 0 ? tideDays[0] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start selection:bg-teal-500 selection:text-white">
      
      {/* ======================================================== */}
      {/* 1. TOP PROTOTYPE BAR (Device Switcher & Brand Info)       */}
      {/* ======================================================== */}
      <div className="w-full bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between z-30 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
          <span className="font-bold text-slate-300">
            Protótipo de Layout <strong className="text-teal-400">Mobile-First</strong>
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px] border border-slate-700">
            Node.js + PostgreSQL + Docker Ready
          </span>
        </div>

        {/* Device Switcher Controls */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setDeviceView('mobile-frame')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
              deviceView === 'mobile-frame'
                ? 'bg-teal-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Celular (Frame)</span>
          </button>

          <button
            onClick={() => setDeviceView('fullscreen')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
              deviceView === 'fullscreen'
                ? 'bg-teal-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Tela Cheia</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MAIN APPLICATION CONTAINER (Mobile Frame or Scaled)   */}
      {/* ======================================================== */}
      <main
        className={`w-full transition-all duration-300 flex flex-col justify-start relative ${
          deviceView === 'mobile-frame'
            ? 'max-w-[430px] my-4 sm:my-8 rounded-[40px] border-[8px] border-slate-800 shadow-2xl shadow-teal-950/40 overflow-hidden bg-slate-950 min-h-[860px]'
            : 'max-w-4xl mx-auto min-h-screen bg-slate-950 border-x border-slate-800 shadow-2xl'
        }`}
      >
        {/* Dynamic Island Bezel for Mobile Frame */}
        {deviceView === 'mobile-frame' && (
          <div className="w-full bg-slate-900 pt-2 pb-1 flex items-center justify-center border-b border-slate-800/60">
            <div className="w-24 h-4 bg-slate-950 rounded-full flex items-center justify-end px-2 gap-1 border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-teal-400/80 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
            </div>
          </div>
        )}

        {/* 1. Mobile Top Bar with Live Island Weather, Tides & Search */}
        <MobileTopBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onOpenAdmin={() => setIsAdminModalOpen(true)}
          onOpenTides={() => setIsTidesModalOpen(true)}
          currentUser={currentUser}
          currentTideSummary="🌊 Preamar 16:45 (4.4m) • Maré Alta p/ Banho"
        />

        {/* 2. Instagram/SuperApp Stories Row */}
        <StoriesRow />

        {/* 3. Hero Carousel Commercial Banners */}
        <HeroBannersCarousel
          advertisements={advertisements}
          onAdClick={(ad) => {
            if (ad.category) setSelectedCategory(ad.category);
          }}
        />

        {/* 4. Quick Actions Grid (8 Essential Categories) */}
        <QuickActionsGrid
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          onOpenTides={() => setIsTidesModalOpen(true)}
          onOpenCharreteCalculator={() => setIsCharreteModalOpen(true)}
          onOpenSupplyOrder={() => setIsQuickOrderModalOpen(true)}
          onOpenAdmin={() => setIsAdminModalOpen(true)}
        />

        {/* 5. Live Tide Wave Widget (Marapanim Tide Graph) */}
        <TideWaveWidget
          currentTideDay={todayTide}
          onOpenFullTides={() => setIsTidesModalOpen(true)}
        />

        {/* 6. CharreteGO Route Calculator */}
        <CharreteGoCalculator />

        {/* 7. Categorized Feed with Search & Filter */}
        <MobileCategoryFeed
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchTerm={searchTerm}
          partners={partners}
          onOpenOrderModal={() => setIsQuickOrderModalOpen(true)}
        />

        {/* Extra bottom padding to avoid bottom nav bar overlap */}
        <div className="h-20 w-full" />

        {/* 8. Fixed Mobile Bottom Navigation Bar */}
        <MobileBottomNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isAdminLoggedIn={currentUser?.role === 'admin'}
        />
      </main>

      {/* ======================================================== */}
      {/* 3. MODALS SYSTEM                                         */}
      {/* ======================================================== */}
      
      {/* Modal: Tábua de Marés Detalhada */}
      <TideScheduleModal
        isOpen={isTidesModalOpen}
        onClose={() => setIsTidesModalOpen(false)}
      />

      {/* Modal: Pedido Rápido de Água & Gelo */}
      <QuickOrderModal
        isOpen={isQuickOrderModalOpen}
        onClose={() => setIsQuickOrderModalOpen(false)}
      />

      {/* Modal: CharreteGO Modal Version */}
      <CharreteGoCalculator
        isOpen={isCharreteModalOpen}
        onClose={() => setIsCharreteModalOpen(false)}
        isModal={true}
      />

      {/* Modal: Gerenciador de Anúncios e Painel Administrativo */}
      <AdminPanelModal
        isOpen={isAdminModalOpen}
        onClose={() => {
          setIsAdminModalOpen(false);
          loadRealData();
        }}
        onRefreshData={loadRealData}
        currentUser={currentUser}
        onLoginSuccess={(user) => setCurrentUser(user)}
        onLogout={() => setCurrentUser(null)}
      />
    </div>
  );
}

export default App;
