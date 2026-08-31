import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Monitor, 
  Sun, 
  Moon, 
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
  Share2,
  MapPin,
  MessageCircle,
  Megaphone,
  CheckCircle2
} from 'lucide-react';

import { Advertisement, Partner, TideDayEntry, UserProfile } from './types/index.ts';

// Mobile & Responsive Components
import { MobileTopBar } from './components/mobile/MobileTopBar.tsx';
import { StoriesRow } from './components/mobile/StoriesRow.tsx';
import { HeroBannersCarousel } from './components/mobile/HeroBannersCarousel.tsx';
import { QuickActionsGrid } from './components/mobile/QuickActionsGrid.tsx';
import { TideWaveWidget } from './components/mobile/TideWaveWidget.tsx';
import { MobileCategoryFeed } from './components/mobile/MobileCategoryFeed.tsx';
import { MobileBottomNav, TabType } from './components/mobile/MobileBottomNav.tsx';
import { AdminPanelModal } from './components/AdminPanelModal.tsx';
import { TideScheduleModal } from './components/TideScheduleModal.tsx';
import { DesktopNavbar } from './components/desktop/DesktopNavbar.tsx';

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
    subcategory: 'Depósito & Bebidas Geladas',
    phone: '5591985678901',
    whatsapp: '5591985678901',
    description: 'Entrega rápida de galão de água mineral 20L, sacos de gelo filtrado 5kg/10kg, carvão e bebidas direto na sua barraca ou casa.',
    photo_url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=800&auto=format&fit=crop&q=80',
    location: 'Vila de Algodoal (Atendimento em toda a ilha)',
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
  // Theme Mode ('dark' | 'light')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Device Frame View State ('mobile-frame' | 'desktop-view')
  const [deviceView, setDeviceView] = useState<'mobile-frame' | 'desktop-view'>('desktop-view');

  // Navigation Tabs & Category Filters
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modals
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isTidesModalOpen, setIsTidesModalOpen] = useState(false);

  // Data States
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [partners, setPartners] = useState<Partner[]>(INITIAL_PROTOTYPE_PARTNERS);
  const [tideDays, setTideDays] = useState<TideDayEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadRealData();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

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
      console.log('Utilizando dados estruturados para renderização do portal.');
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'home') {
      setSelectedCategory('todos');
    } else if (tab === 'pousadas') {
      setSelectedCategory('pousadas');
    } else if (tab === 'transporte') {
      setSelectedCategory('transporte');
    } else if (tab === 'compras') {
      setSelectedCategory('compras');
    } else if (tab === 'mares') {
      setIsTidesModalOpen(true);
    } else if (tab === 'admin') {
      setIsAdminModalOpen(true);
    }
  };

  const todayTide = tideDays && tideDays.length > 0 ? tideDays[0] : null;
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-start selection:bg-teal-500 selection:text-white transition-colors duration-200 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'
    }`}>
      
      {/* ======================================================== */}
      {/* 1. TOP SIMULATION & CONTROLS TOOLBAR                     */}
      {/* ======================================================== */}
      <div className={`w-full border-b px-4 py-2 flex items-center justify-between z-30 text-xs transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-xs'
      }`}>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
          <span className="font-bold">
            Algodoal Connect • <strong className="text-teal-600">Portal de Anúncios & Guia</strong>
          </span>
          <span className={`hidden md:inline-block px-2 py-0.5 rounded-md text-[10px] border ${
            isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}>
            Contatos 100% Diretos via WhatsApp
          </span>
        </div>

        {/* View Switcher & Theme Switcher Controls */}
        <div className="flex items-center gap-2">
          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold text-xs transition cursor-pointer border ${
              isDark 
                ? 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700' 
                : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
            }`}
            title="Alternar Tema Claro / Escuro"
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Tema Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-700" />
                <span className="hidden sm:inline">Tema Escuro</span>
              </>
            )}
          </button>

          {/* View Modes */}
          <div className={`flex items-center gap-1 p-1 rounded-xl border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setDeviceView('mobile-frame')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                deviceView === 'mobile-frame'
                  ? 'bg-teal-500 text-slate-950 shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Celular</span>
            </button>

            <button
              onClick={() => setDeviceView('desktop-view')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                deviceView === 'desktop-view'
                  ? 'bg-teal-500 text-slate-950 shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Computador (Desktop)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. DESKTOP FULL-WIDTH VIEW                               */}
      {/* ======================================================== */}
      {deviceView === 'desktop-view' ? (
        <div className={`w-full min-h-screen flex flex-col ${isDark ? 'bg-slate-950' : 'bg-slate-100'}`}>
          {/* Desktop Top Navigation Bar */}
          <DesktopNavbar
            theme={theme}
            onToggleTheme={toggleTheme}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onOpenAdmin={() => setIsAdminModalOpen(true)}
            onOpenTides={() => setIsTidesModalOpen(true)}
            currentUser={currentUser}
            currentTideSummary="🌊 Preamar 16:45 (4.4m) • Maré Alta"
          />

          {/* Desktop Grid Layout (Hero + Main Content + Side Column) */}
          <div className="max-w-7xl mx-auto w-full px-6 py-6 space-y-6">
            
            {/* Top Stories Highlights */}
            <div className={`rounded-3xl border overflow-hidden shadow-sm ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <StoriesRow theme={theme} />
            </div>

            {/* Desktop Hero Section: 2 Columns (Commercial Banners + Tide & Island Status) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Commercial Hero Banners (7 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                <HeroBannersCarousel
                  advertisements={advertisements}
                  onAdClick={(ad) => {
                    if (ad.category) setSelectedCategory(ad.category);
                  }}
                />

                {/* 8 Essential Island Actions Grid */}
                <div className={`rounded-3xl border overflow-hidden p-2 ${
                  isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <QuickActionsGrid
                    theme={theme}
                    onSelectCategory={(cat) => setSelectedCategory(cat)}
                    onOpenTides={() => setIsTidesModalOpen(true)}
                    onOpenAdmin={() => setIsAdminModalOpen(true)}
                  />
                </div>
              </div>

              {/* Right Column: Live Tide Wave Graph + Transparency & Direct Contact Portal Box (5 Cols) */}
              <div className="lg:col-span-5 space-y-5">
                {/* Tide Widget */}
                <TideWaveWidget
                  theme={theme}
                  currentTideDay={todayTide}
                  onOpenFullTides={() => setIsTidesModalOpen(true)}
                />

                {/* Portal Transparency & How It Works Card */}
                <div className={`rounded-3xl border p-5 space-y-3.5 shadow-sm transition-colors ${
                  isDark ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/30 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-2xl bg-teal-500/20 text-teal-500">
                      <Megaphone className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className={`text-sm font-black font-heading ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Portal de Anúncios Diretos
                      </h3>
                      <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        100% livre de comissões e intermediações
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                      <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                        <strong>Contato 100% Direto:</strong> Você fala diretamente com o dono da pousada, charreteiro, piloteiro ou depósito via WhatsApp.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                      <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                        <strong>Sem taxas extras:</strong> Negocie valores, combine horários e reserve sem nenhuma cobrança ou intermediação do site.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                      <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                        <strong>Comércio da APA Valorizado:</strong> Apoio e divulgação aos trabalhadores e empreendedores da Ilha de Algodoal.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsAdminModalOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Anunciar no Guia / Painel Gestor</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Category Feed Grid (Pousadas, Gastronomia, Rabetas, Suprimentos) */}
            <div className={`rounded-3xl border overflow-hidden p-4 sm:p-6 shadow-sm ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="mb-4">
                <h2 className={`text-xl font-black font-heading ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Explorar Anúncios & Serviços em Algodoal
                </h2>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Consulte pousadas, restaurantes, condutores de charretes, barcos e depósitos com contato direto pelo WhatsApp.
                </p>
              </div>

              <MobileCategoryFeed
                theme={theme}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                searchTerm={searchTerm}
                partners={partners}
              />
            </div>
          </div>

          {/* Desktop Footer with Environmental Protection Info */}
          <footer className={`w-full py-8 border-t mt-12 transition-colors ${
            isDark ? 'bg-slate-950 border-slate-900 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
          }`}>
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌴</span>
                <span className="font-bold">Algodoal Connect • Guia de Anúncios da APA de Algodoal-Maiandeua</span>
              </div>
              <p className="text-[11px]">
                Preserve a natureza: recolha seu lixo, respeite os animais e apoie o comércio tradicional local.
              </p>
            </div>
          </footer>
        </div>
      ) : (
        /* ======================================================== */
        /* 3. MOBILE FRAME PREVIEW VIEW                             */
        /* ======================================================== */
        <main
          className={`w-full max-w-[430px] my-4 sm:my-8 rounded-[40px] border-[8px] shadow-2xl overflow-hidden min-h-[860px] flex flex-col justify-start relative transition-all duration-300 ${
            isDark 
              ? 'border-slate-800 shadow-teal-950/40 bg-slate-950' 
              : 'border-slate-300 shadow-slate-400/40 bg-slate-50'
          }`}
        >
          {/* Dynamic Island Bezel for Mobile Frame */}
          <div className={`w-full pt-2 pb-1 flex items-center justify-center border-b ${
            isDark ? 'bg-slate-900 border-slate-800/60' : 'bg-slate-200 border-slate-300'
          }`}>
            <div className={`w-24 h-4 rounded-full flex items-center justify-end px-2 gap-1 border ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-800 border-slate-700'
            }`}>
              <span className="w-2 h-2 rounded-full bg-teal-400/80 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            </div>
          </div>

          {/* 1. Mobile Top Bar with Live Island Weather, Tides & Search */}
          <MobileTopBar
            theme={theme}
            onToggleTheme={toggleTheme}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onOpenAdmin={() => setIsAdminModalOpen(true)}
            onOpenTides={() => setIsTidesModalOpen(true)}
            currentUser={currentUser}
            currentTideSummary="🌊 Preamar 16:45 (4.4m) • Maré Alta"
          />

          {/* 2. Instagram/SuperApp Stories Row */}
          <StoriesRow theme={theme} />

          {/* 3. Hero Carousel Commercial Banners */}
          <HeroBannersCarousel
            advertisements={advertisements}
            onAdClick={(ad) => {
              if (ad.category) setSelectedCategory(ad.category);
            }}
          />

          {/* 4. Quick Actions Grid (8 Essential Categories) */}
          <QuickActionsGrid
            theme={theme}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            onOpenTides={() => setIsTidesModalOpen(true)}
            onOpenAdmin={() => setIsAdminModalOpen(true)}
          />

          {/* 5. Live Tide Wave Widget (Marapanim Tide Graph) */}
          <TideWaveWidget
            theme={theme}
            currentTideDay={todayTide}
            onOpenFullTides={() => setIsTidesModalOpen(true)}
          />

          {/* 6. Categorized Feed with Direct WhatsApp Contacts & Search */}
          <MobileCategoryFeed
            theme={theme}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchTerm={searchTerm}
            partners={partners}
          />

          {/* Extra bottom padding to avoid bottom nav bar overlap */}
          <div className="h-20 w-full" />

          {/* 7. Fixed Mobile Bottom Navigation Bar */}
          <MobileBottomNav
            theme={theme}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            isAdminLoggedIn={currentUser?.role === 'admin'}
          />
        </main>
      )}

      {/* ======================================================== */}
      {/* 4. MODALS SYSTEM                                         */}
      {/* ======================================================== */}
      
      {/* Modal: Tábua de Marés Detalhada */}
      <TideScheduleModal
        isOpen={isTidesModalOpen}
        onClose={() => setIsTidesModalOpen(false)}
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
