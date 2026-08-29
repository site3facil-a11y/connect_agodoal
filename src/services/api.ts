import { 
  Partner, 
  ServiceProduct, 
  Order, 
  OrderStatus, 
  IslandSpot, 
  BoatCrossingSchedule, 
  UsefulContact, 
  Review, 
  TideSchedule,
  Advertisement,
  TideDayEntry,
  UserProfile,
  AuthProvider
} from '../types/index.ts';

const API_BASE = '/api';

export const api = {
  // Health & Stats
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    return res.json();
  },

  // Auth & Social Login
  async socialLogin(profile: Partial<UserProfile> & { provider: AuthProvider }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    if (!res.ok) throw new Error('Falha no login');
    return res.json();
  },

  async getUsers(): Promise<UserProfile[]> {
    const res = await fetch(`${API_BASE}/admin/users`);
    return res.json();
  },

  // Advertisements & Banners (Painel Admin)
  async getAdvertisements(category?: string, onlyActive = true): Promise<Advertisement[]> {
    const params = new URLSearchParams();
    if (category && category !== 'todos') params.append('category', category);
    if (!onlyActive) params.append('only_active', 'false');
    
    const url = params.toString() ? `${API_BASE}/advertisements?${params.toString()}` : `${API_BASE}/advertisements`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Falha ao carregar anúncios');
    return res.json();
  },

  async getAdvertisementById(id: string): Promise<Advertisement> {
    const res = await fetch(`${API_BASE}/advertisements/${id}`);
    if (!res.ok) throw new Error('Anúncio não encontrado');
    return res.json();
  },

  async createAdvertisement(data: Partial<Advertisement>): Promise<Advertisement> {
    const res = await fetch(`${API_BASE}/advertisements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erro ao cadastrar anúncio');
    return res.json();
  },

  async updateAdvertisement(id: string, data: Partial<Advertisement>): Promise<Advertisement> {
    const res = await fetch(`${API_BASE}/advertisements/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erro ao atualizar anúncio');
    return res.json();
  },

  async deleteAdvertisement(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/advertisements/${id}`, {
      method: 'DELETE'
    });
    return res.ok;
  },

  async recordAdMetric(id: string, type: 'view' | 'click') {
    try {
      await fetch(`${API_BASE}/advertisements/${id}/metrics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
    } catch (e) {
      // metric tracking is non-blocking
    }
  },

  // Tides (Marapanim & Marinha do Brasil)
  async getTides(): Promise<TideSchedule[]> {
    const res = await fetch(`${API_BASE}/tides`);
    if (!res.ok) throw new Error('Falha ao carregar marés');
    return res.json();
  },

  async getTideDays(startDate?: string, endDate?: string): Promise<TideDayEntry[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    const url = params.toString() ? `${API_BASE}/tides/days?${params.toString()}` : `${API_BASE}/tides/days`;
    const res = await fetch(url);
    return res.json();
  },

  async saveTideDay(entry: Partial<TideDayEntry>): Promise<TideDayEntry> {
    const res = await fetch(`${API_BASE}/tides/day`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
    return res.json();
  },

  async syncMarapanimTides() {
    const res = await fetch(`${API_BASE}/tides/sync-marapanim`);
    return res.json();
  },

  // Partners
  async getPartners(category?: string): Promise<Partner[]> {
    const url = category && category !== 'todos' 
      ? `${API_BASE}/partners?category=${encodeURIComponent(category)}` 
      : `${API_BASE}/partners`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Falha ao carregar parceiros');
    return res.json();
  },

  async getPartnerById(id: string): Promise<Partner> {
    const res = await fetch(`${API_BASE}/partners/${id}`);
    if (!res.ok) throw new Error('Parceiro não encontrado');
    return res.json();
  },

  async createPartner(data: Partial<Partner>): Promise<Partner> {
    const res = await fetch(`${API_BASE}/partners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erro ao cadastrar parceiro');
    return res.json();
  },

  async updatePartner(id: string, data: Partial<Partner>): Promise<Partner> {
    const res = await fetch(`${API_BASE}/partners/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erro ao atualizar parceiro');
    return res.json();
  },

  // Services
  async getServices(category?: string, partnerId?: string): Promise<ServiceProduct[]> {
    const params = new URLSearchParams();
    if (category && category !== 'todos') params.append('category', category);
    if (partnerId) params.append('partner_id', partnerId);
    
    const url = params.toString() ? `${API_BASE}/services?${params.toString()}` : `${API_BASE}/services`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Falha ao carregar serviços');
    return res.json();
  },

  async createService(data: Partial<ServiceProduct>): Promise<ServiceProduct> {
    const res = await fetch(`${API_BASE}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erro ao cadastrar serviço');
    return res.json();
  },

  async updateService(id: string, data: Partial<ServiceProduct>): Promise<ServiceProduct> {
    const res = await fetch(`${API_BASE}/services/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erro ao atualizar serviço');
    return res.json();
  },

  async deleteService(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/services/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Erro ao remover serviço');
    return true;
  },

  // Orders
  async getOrders(partnerId?: string, status?: string): Promise<Order[]> {
    const params = new URLSearchParams();
    if (partnerId) params.append('partner_id', partnerId);
    if (status && status !== 'todos') params.append('status', status);

    const url = params.toString() ? `${API_BASE}/orders?${params.toString()}` : `${API_BASE}/orders`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Falha ao carregar pedidos');
    return res.json();
  },

  async createOrder(data: Partial<Order>): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erro ao criar pedido');
    return res.json();
  },

  async updateOrderStatus(id: string, status: OrderStatus, driverOrAgentName?: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, driver_or_agent_name: driverOrAgentName })
    });
    if (!res.ok) throw new Error('Erro ao atualizar status do pedido');
    return res.json();
  },

  // Tourism & Island Data
  async getIslandSpots(): Promise<IslandSpot[]> {
    const res = await fetch(`${API_BASE}/island-spots`);
    if (!res.ok) throw new Error('Falha ao carregar pontos turísticos');
    return res.json();
  },

  async getBoatCrossings(): Promise<BoatCrossingSchedule[]> {
    const res = await fetch(`${API_BASE}/boat-crossings`);
    if (!res.ok) throw new Error('Falha ao carregar horários de travessia');
    return res.json();
  },

  async getContacts(): Promise<UsefulContact[]> {
    const res = await fetch(`${API_BASE}/contacts`);
    if (!res.ok) throw new Error('Falha ao carregar contatos');
    return res.json();
  },

  async getReviews(partnerId?: string): Promise<Review[]> {
    const url = partnerId ? `${API_BASE}/reviews?partner_id=${partnerId}` : `${API_BASE}/reviews`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Falha ao carregar avaliações');
    return res.json();
  },

  async addReview(data: Partial<Review>): Promise<Review> {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erro ao enviar avaliação');
    return res.json();
  }
};
