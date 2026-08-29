export type ServiceCategory = 'transporte' | 'passeios' | 'compras' | 'alimentacao' | 'pousadas' | 'eventos' | 'informacoes';

export type AdCategory = 'restaurante' | 'pousada' | 'passeio' | 'transporte' | 'evento' | 'compras';

export type OrderStatus = 'pendente' | 'aceito' | 'em_rota' | 'concluido' | 'cancelado';

export type PaymentMethod = 'pix' | 'dinheiro' | 'cartao';

export type AuthProvider = 'google' | 'facebook' | 'instagram' | 'apple' | 'email';

export type UserRole = 'tourist' | 'partner' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  provider: AuthProvider;
  role: UserRole;
  partner_id?: string;
  created_at: string;
}

export interface Advertisement {
  id: string;
  title: string;
  category: AdCategory;
  partner_id?: string;
  business_name: string;
  tagline?: string;
  description: string;
  image_url: string;
  link_url?: string;
  whatsapp: string;
  phone?: string;
  location: string;
  price_starting?: number;
  badge?: string; // Ex: 'Destaque', '50% OFF', 'Novo', 'Top Escolha'
  event_date?: string; // Para eventos (ex: '2026-09-05T20:00:00Z')
  event_venue?: string; // Ex: 'Bar do Barata - Praia da Princesa'
  banner_slot?: 'banner_1' | 'banner_2' | 'banner_3' | 'banner_4' | 'destaque_topo' | 'nenhum';
  is_active: boolean;
  is_highlighted: boolean;
  start_date: string; // ISO string ou YYYY-MM-DD
  end_date: string;   // ISO string ou YYYY-MM-DD
  views_count: number;
  clicks_count: number;
  created_at: string;
  updated_at: string;
}

export interface TideDayEntry {
  id: string;
  date: string; // YYYY-MM-DD
  moon_phase: 'Nova' | 'Crescente' | 'Cheia' | 'Minguante';
  coefficient?: number;
  high_tides: { time: string; height: string }[];
  low_tides: { time: string; height: string }[];
  source: 'tabuademares_marapanim' | 'marinha_brasil' | 'manual';
  recommendations?: string;
}

export interface Partner {
  id: string;
  name: string;
  category: ServiceCategory;
  subcategory?: string;
  phone: string;
  whatsapp: string;
  description: string;
  photo_url: string;
  location: string;
  rating: number;
  total_reviews: number;
  is_active: boolean;
  verified: boolean;
  price_starting: number;
  vehicle_badge?: string; // Ex: Charrete #14, Rabeta 'Estrela do Mar'
  opening_hours?: string;
  amenities?: string[]; // Ex: ['Ar-condicionado', 'Wi-Fi', 'Café da Manhã', 'Frente ao Mar'] para pousadas
  created_at: string;
}

export interface ServiceProduct {
  id: string;
  partner_id: string;
  name: string;
  description: string;
  price: number;
  unit: string; // Ex: 'por viagem', 'por pessoa', 'galão 20L', 'porção', 'prato p/ 2'
  category: ServiceCategory;
  image_url: string;
  available: boolean;
  estimated_time?: string;
}

export interface OrderItem {
  service_id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_location: string; // Ex: 'Pousada Chalé da Ilha, Quarto 4' ou 'Porto de Algodoal'
  destination_location?: string; // Para transporte/passeio (ex: 'Praia da Princesa')
  partner_id: string;
  partner_name?: string;
  category: ServiceCategory;
  items: OrderItem[];
  total_price: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  notes?: string;
  created_at: string;
  updated_at: string;
  driver_or_agent_name?: string;
}

export interface IslandSpot {
  id: string;
  name: string;
  category: 'praia' | 'lago' | 'vila' | 'ponto_turistico' | 'porto';
  description: string;
  image_url: string;
  distance_from_port: string;
  walking_time: string;
  cart_time: string;
  tips: string;
  coordinates: { x: number; y: number }; // Relative map positioning
}

export interface TideSchedule {
  time: string;
  type: 'Alta (Preamar)' | 'Baixa (Baixa-mar)';
  height: string;
  status: 'Favorável para passeios' | 'Atenção às pedras' | 'Passeio pelo canal';
}

export interface BoatCrossingSchedule {
  id: string;
  origin: string;
  destination: string;
  departure_times: string[];
  price: number;
  duration: string;
  association: string;
  phone: string;
  notes: string;
}

export interface UsefulContact {
  id: string;
  title: string;
  category: 'saude' | 'seguranca' | 'transporte' | 'turismo';
  phone: string;
  whatsapp?: string;
  location: string;
  description: string;
  available_hours: string;
}

export interface Review {
  id: string;
  partner_id: string;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}
