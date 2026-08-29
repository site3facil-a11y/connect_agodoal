import React, { useState, useEffect } from 'react';
import { 
  Partner, 
  ServiceProduct, 
  Order, 
  OrderStatus, 
  ServiceCategory, 
  IslandSpot, 
  BoatCrossingSchedule, 
  UsefulContact, 
  TideSchedule,
  PaymentMethod,
  UserProfile,
  Advertisement
} from './types/index.ts';
import { api } from './services/api.ts';
import { Navbar } from './components/Navbar.tsx';
import { HeroBanner } from './components/HeroBanner.tsx';
import { CategoryNav } from './components/CategoryNav.tsx';
import { HowItWorks } from './components/HowItWorks.tsx';
import { TransportView } from './components/TransportView.tsx';
import { ToursView } from './components/ToursView.tsx';
import { MarketView } from './components/MarketView.tsx';
import { RestaurantsView } from './components/RestaurantsView.tsx';
import { PousadasView } from './components/PousadasView.tsx';
import { EventsView } from './components/EventsView.tsx';
import { IslandGuideView } from './components/IslandGuideView.tsx';
import { OrderModal } from './components/OrderModal.tsx';
import { OrderTrackerModal } from './components/OrderTrackerModal.tsx';
import { PartnerPortal } from './components/PartnerPortal.tsx';
import { NewPartnerModal } from './components/NewPartnerModal.tsx';
import { SocialAuthModal } from './components/SocialAuthModal.tsx';
import { AdminPanelModal } from './components/AdminPanelModal.tsx';
import { TideScheduleModal } from './components/TideScheduleModal.tsx';
import { PreservationFooter } from './components/PreservationFooter.tsx';
import { Loader2, AlertCircle, PhoneCall, X } from 'lucide-react';

export default function App() {
  // Navigation & UI States
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('transporte');
  const [isPartnerPortalOpen, setIsPartnerPortalOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [isNewPartnerModalOpen, setIsNewPartnerModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isTidesModalOpen, setIsTidesModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // User State from LocalStorage
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('algodoal_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Data States loaded from real backend DB
  const [partners, setPartners] = useState<Partner[]>([]);
  const [services, setServices] = useState<ServiceProduct[]>([]);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [islandSpots, setIslandSpots] = useState<IslandSpot[]>([]);
  const [boatCrossings, setBoatCrossings] = useState<BoatCrossingSchedule[]>([]);
  const [tides, setTides] = useState<TideSchedule[]>([]);
  const [contacts, setContacts] = useState<UsefulContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Modal Booking States
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedServiceToBook, setSelectedServiceToBook] = useState<ServiceProduct | undefined>();
  const [selectedPartnerToBook, setSelectedPartnerToBook] = useState<Partner | undefined>();
  const [multiOrderItems, setMultiOrderItems] = useState<Array<{ service: ServiceProduct; partner: Partner; quantity: number }>>([]);
  const [routeOrigin, setRouteOrigin] = useState<string | undefined>();
  const [routeDest, setRouteDest] = useState<string | undefined>();

  // Fetch all initial data from backend API
  const loadData = async () => {
    try {
      setIsLoading(true);
      setFetchError(null);

      const [
        partnersData, 
        servicesData, 
        adsData,
        ordersData, 
        spotsData, 
        boatsData, 
        tidesData, 
        contactsData
      ] = await Promise.all([
        api.getPartners(),
        api.getServices(),
        api.getAdvertisements('todos', false).catch(() => []),
        api.getOrders(),
        api.getIslandSpots(),
        api.getBoatCrossings(),
        api.getTides(),
        api.getContacts()
      ]);

      setPartners(partnersData);
      setServices(servicesData);
      setAdvertisements(adsData);
      setOrders(ordersData);
      setIslandSpots(spotsData);
      setBoatCrossings(boatsData);
      setTides(tidesData);
      setContacts(contactsData);
    } catch (err: any) {
      console.error('Error fetching data from Algodoal Connect API:', err);
      setFetchError('Não foi possível sincronizar os dados com o servidor. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Poll orders periodically to show live updates
    const interval = setInterval(async () => {
      try {
        const freshOrders = await api.getOrders();
        setOrders(freshOrders);
      } catch (e) {
        // silent fail on polling
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleUserLogin = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('algodoal_current_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    // If admin, can open admin panel right away or notify
    if (user.role === 'admin') {
      setIsAdminPanelOpen(true);
    }
  };

  const handleUserLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('algodoal_current_user');
  };

  // Filtered partners & services according to search term
  const filteredPartners = partners.filter(p => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.location.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(term))
    );
  });

  const filteredServices = services.filter(s => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      s.name.toLowerCase().includes(term) ||
      s.description.toLowerCase().includes(term) ||
      s.category.toLowerCase().includes(term)
    );
  });

  // Handlers for single-item bookings (Charrete, Rabeta, Restaurante)
  const handleBookService = (
    service: ServiceProduct,
    partner: Partner,
    customOrigin?: string,
    customDest?: string
  ) => {
    setSelectedServiceToBook(service);
    setSelectedPartnerToBook(partner);
    setMultiOrderItems([]);
    setRouteOrigin(customOrigin);
    setRouteDest(customDest);
    setIsOrderModalOpen(true);
  };

  // Handlers for multi-item bookings (Compras / Mercadinho)
  const handleOpenMultiOrder = (
    items: Array<{ service: ServiceProduct; partner: Partner; quantity: number }>
  ) => {
    setMultiOrderItems(items);
    setSelectedServiceToBook(undefined);
    setSelectedPartnerToBook(undefined);
    setIsOrderModalOpen(true);
  };

  // Direct WhatsApp contact with partner
  const handleCallPartnerDirect = (partner: Partner) => {
    const rawNumber = partner.whatsapp || partner.phone.replace(/\D/g, '');
    const cleanNumber = rawNumber.startsWith('55') ? rawNumber : `55${rawNumber}`;
    const text = encodeURIComponent(
      `Olá ${partner.name}! Vi seu serviço no catálogo do Algodoal Connect e gostaria de tirar dúvidas e solicitar um atendimento na ilha.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  // Create Order and Open Direct WhatsApp with Provider
  const handleCreateOrder = async (orderData: {
    customer_name: string;
    customer_phone: string;
    customer_location: string;
    destination_location?: string;
    partner_id: string;
    partner_name: string;
    category: ServiceCategory;
    items: Array<{ service_id: string; name: string; price: number; quantity: number; unit: string }>;
    total_price: number;
    payment_method: PaymentMethod;
    notes?: string;
  }) => {
    // 1. Save locally/backend for history tracking
    const created = await api.createOrder(orderData);
    setOrders(prev => [created, ...prev]);

    // 2. Locate partner to get their direct WhatsApp phone
    const partner = partners.find(p => p.id === orderData.partner_id) || partners[0];
    const rawNumber = partner?.whatsapp || partner?.phone.replace(/\D/g, '') || '91981234567';
    const cleanNumber = rawNumber.startsWith('55') ? rawNumber : `55${rawNumber}`;

    // 3. Format complete message
    const itemsList = orderData.items
      .map(i => `• ${i.quantity}x ${i.name} (R$ ${(i.price * i.quantity).toFixed(2)})`)
      .join('\n');

    const message = 
`🌴 *Algodoal Connect - Solicitação de Contato Direto*

Olá, *${orderData.partner_name}*!
Encontrei seu contato no *Algodoal Connect* e gostaria de combinar este atendimento:

👤 *Turista/Cliente:* ${orderData.customer_name}
📱 *WhatsApp:* ${orderData.customer_phone}
📍 *Local / Ponto de Encontro:* ${orderData.customer_location}
${orderData.destination_location ? `🏁 *Destino:* ${orderData.destination_location}\n` : ''}
📋 *Serviço / Pedido:*
${itemsList}

💰 *Valor Tabelado Estimado:* R$ ${orderData.total_price.toFixed(2)}
💳 *Forma de Pagamento Preferida:* ${orderData.payment_method.toUpperCase()}
${orderData.notes ? `📝 *Observações:* ${orderData.notes}\n` : ''}
_Aguardo sua confirmação e orientações!_`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanNumber}?text=${encoded}`, '_blank');
    setIsOrderTrackerOpen(true);
  };

  // Partner status updater
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const updated = await api.updateOrderStatus(orderId, status);
    setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
  };

  // Add new service via partner portal
  const handleAddNewService = async (serviceData: Partial<ServiceProduct>) => {
    const created = await api.createService(serviceData);
    setServices(prev => [...prev, created]);
  };

  // Delete service via partner portal
  const handleDeleteService = async (serviceId: string) => {
    await api.deleteService(serviceId);
    setServices(prev => prev.filter(s => s.id !== serviceId));
  };

  // Register new partner
  const handleRegisterPartner = async (partnerData: any) => {
    const created = await api.createPartner(partnerData);
    setPartners(prev => [...prev, created]);
  };

  // Active uncompleted orders count
  const activeOrderCount = orders.filter(
    o => o.status === 'pendente' || o.status === 'aceito' || o.status === 'em_rota'
  ).length;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* Navigation Bar */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setIsPartnerPortalOpen(false);
          setActiveCategory(cat);
        }}
        orderCount={activeOrderCount}
        onOpenOrders={() => setIsOrderTrackerOpen(true)}
        onOpenPartnerPortal={() => setIsPartnerPortalOpen(!isPartnerPortalOpen)}
        onOpenNewPartner={() => setIsNewPartnerModalOpen(true)}
        onOpenEmergency={() => setIsEmergencyModalOpen(true)}
        isPartnerPortalOpen={isPartnerPortalOpen}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        onOpenTidesModal={() => setIsTidesModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-28">
            <Loader2 className="w-10 h-10 text-sky-600 animate-spin mb-3" />
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Conectando com o banco de dados da Ilha...
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Carregando parceiros, marés de Marapanim, anúncios e horários de barco.
            </p>
          </div>
        ) : fetchError ? (
          <div className="max-w-xl mx-auto my-12 p-6 rounded-3xl bg-red-50 border border-red-200 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <h4 className="text-base font-bold text-red-900 font-heading">{fetchError}</h4>
            <button
              onClick={loadData}
              className="mt-4 bg-red-700 hover:bg-red-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-md cursor-pointer"
            >
              Tentar Novamente
            </button>
          </div>
        ) : isPartnerPortalOpen ? (
          /* Partner & Merchant Portal */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PartnerPortal
              partners={partners}
              services={services}
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onAddNewService={handleAddNewService}
              onDeleteService={handleDeleteService}
              onRefreshData={loadData}
            />
          </div>
        ) : (
          /* Tourist View */
          <>
            {/* Hero Header from Flyer */}
            <HeroBanner
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onSelectCategory={(cat) => setActiveCategory(cat)}
              advertisements={advertisements}
              onQuickCallCart={() => {
                setActiveCategory('transporte');
                const defaultService = services.find(s => s.category === 'transporte') || services[0];
                const defaultPartner = partners.find(p => p.category === 'transporte') || partners[0];
                if (defaultService && defaultPartner) {
                  handleBookService(defaultService, defaultPartner, 'Porto de Algodoal', 'Praia da Princesa');
                }
              }}
            />

            {/* Main Categories Navigation Bar */}
            <CategoryNav
              activeCategory={activeCategory}
              onSelectCategory={(cat) => setActiveCategory(cat)}
            />

            {/* Dynamic Category View Container */}
            <section className="py-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Search result indicator if active */}
                {searchTerm && (
                  <div className="mb-6 p-3.5 rounded-2xl bg-white border border-sky-200 text-xs font-semibold text-slate-700 flex items-center justify-between shadow-sm">
                    <span>
                      Filtrando por: "<strong className="text-sky-700">{searchTerm}</strong>" ({filteredServices.length} itens encontrados)
                    </span>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-sky-700 hover:text-sky-900 underline font-bold cursor-pointer"
                    >
                      Limpar Busca
                    </button>
                  </div>
                )}

                {/* 1. Transporte (Charretes & Barcos) */}
                {activeCategory === 'transporte' && (
                  <TransportView
                    partners={filteredPartners}
                    services={filteredServices}
                    onBookService={handleBookService}
                    onCallPartnerDirect={handleCallPartnerDirect}
                  />
                )}

                {/* 2. Pousadas (Hospedagem & Chalés) */}
                {activeCategory === 'pousadas' && (
                  <PousadasView
                    partners={filteredPartners}
                    services={filteredServices}
                  />
                )}

                {/* 3. Passeios (Rabetas & Lago) */}
                {activeCategory === 'passeios' && (
                  <ToursView
                    partners={filteredPartners}
                    services={filteredServices}
                    onBookService={handleBookService}
                    onCallPartnerDirect={handleCallPartnerDirect}
                  />
                )}

                {/* 4. Alimentação (Restaurantes & Peixadas) */}
                {activeCategory === 'alimentacao' && (
                  <RestaurantsView
                    partners={filteredPartners}
                    services={filteredServices}
                    onBookService={handleBookService}
                    onCallPartnerDirect={handleCallPartnerDirect}
                  />
                )}

                {/* 5. Compras (Mercadinho & Água 20L) */}
                {activeCategory === 'compras' && (
                  <MarketView
                    partners={filteredPartners}
                    services={filteredServices}
                    onOpenMultiOrder={handleOpenMultiOrder}
                    onCallPartnerDirect={handleCallPartnerDirect}
                  />
                )}

                {/* 6. Eventos (Luaus & Festivais) */}
                {activeCategory === 'eventos' && (
                  <EventsView
                    advertisements={advertisements}
                  />
                )}

                {/* 7. Guia / Informações Úteis (Marés, Travessia & Telefones) */}
                {activeCategory === 'informacoes' && (
                  <IslandGuideView
                    spots={islandSpots}
                    boatCrossings={boatCrossings}
                    contacts={contacts}
                    tides={tides}
                  />
                )}
              </div>
            </section>

            {/* How It Works Section */}
            <HowItWorks />
          </>
        )}
      </main>

      {/* Environmental & Brand Footer */}
      <PreservationFooter
        onOpenCategory={(cat) => {
          setIsPartnerPortalOpen(false);
          setActiveCategory(cat);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Booking Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        service={selectedServiceToBook}
        partner={selectedPartnerToBook}
        multiItems={multiOrderItems}
        initialOrigin={routeOrigin}
        initialDest={routeDest}
        onSubmitOrder={handleCreateOrder}
      />

      {/* Live Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
        orders={orders}
        onRefresh={loadData}
      />

      {/* Register New Partner Modal */}
      <NewPartnerModal
        isOpen={isNewPartnerModalOpen}
        onClose={() => setIsNewPartnerModalOpen(false)}
        onRegisterPartner={handleRegisterPartner}
      />

      {/* Social Auth Modal */}
      <SocialAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleUserLogin}
      />

      {/* Admin Management Panel Modal */}
      <AdminPanelModal
        isOpen={isAdminPanelOpen}
        onClose={() => {
          setIsAdminPanelOpen(false);
          loadData();
        }}
        currentUser={currentUser}
        onRequireAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Tábua de Marés (Marapanim & Marinha) Modal */}
      <TideScheduleModal
        isOpen={isTidesModalOpen}
        onClose={() => setIsTidesModalOpen(false)}
      />

      {/* Quick Emergency Modal */}
      {isEmergencyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e0e0e] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-white/15 animate-in fade-in zoom-in-95 duration-200 text-[#E5E5E5]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-red-400">
                <PhoneCall className="w-5 h-5" />
                <h3 className="text-lg font-bold text-white font-serif">
                  Contatos de Emergência
                </h3>
              </div>
              <button
                onClick={() => setIsEmergencyModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#1c1c1c] hover:bg-[#282828] text-zinc-400 hover:text-white flex items-center justify-center transition border border-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {contacts.map((c) => (
                <div key={c.id} className="p-3.5 rounded-2xl bg-[#141414] border border-white/10 flex items-center justify-between shadow-sm">
                  <div>
                    <h5 className="text-xs font-bold text-white font-serif">{c.title}</h5>
                    <span className="text-[11px] text-zinc-400 block">{c.location}</span>
                  </div>
                  <a
                    href={`tel:${c.phone.replace(/\D/g, '')}`}
                    className="bg-red-900/80 hover:bg-red-800 text-red-100 font-bold text-xs px-3.5 py-1.5 rounded-xl border border-red-700/50 transition cursor-pointer"
                  >
                    Ligar
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
