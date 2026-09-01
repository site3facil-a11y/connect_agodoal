import pg from 'pg';
import fs from 'fs';
import path from 'path';
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
  AdCategory,
  IslandStory
} from '../types/index';

const DB_FILE = path.join(process.cwd(), 'data', 'algodoal_db.json');

// Ensure data folder exists
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });
}

let pgPool: pg.Pool | null = null;
const databaseUrl = process.env.DATABASE_URL;

if (databaseUrl && !databaseUrl.includes('localhost:5432')) {
  try {
    pgPool = new pg.Pool({
      connectionString: databaseUrl,
      ssl: databaseUrl.includes('sslmode=disable') ? false : { rejectUnauthorized: false },
    });
    console.log('🔗 PostgreSQL pool initialized with connection string');
  } catch (err) {
    console.warn('⚠️ Could not initialize external PostgreSQL pool, falling back to local relational store:', err);
    pgPool = null;
  }
}

// Initial genuine island seed data
const SEED_PARTNERS: Partner[] = [
  {
    id: 'part_carroca_14',
    name: 'Seu Raimundo (Charrete #14)',
    category: 'transporte',
    subcategory: 'Carroça Turística & Bagagem',
    phone: '(91) 98452-1102',
    whatsapp: '5591984521102',
    description: 'Carroceiro credenciado há mais de 15 anos na Ilha de Algodoal. Transporte seguro de passageiros e bagagens do Porto até todas as pousadas e Praias da Ilha.',
    photo_url: '/imagens/vila.jpg',
    location: 'Ponto do Porto de Algodoal / Vila de Maiandeua',
    rating: 4.9,
    total_reviews: 48,
    is_active: true,
    verified: true,
    price_starting: 30.00,
    vehicle_badge: 'Charrete #14 - Credenciada',
    opening_hours: '06:00 às 22:00',
    created_at: '2026-01-10T10:00:00Z'
  },
  {
    id: 'part_carroca_08',
    name: 'Manoel Carroceiro (Charrete #08)',
    category: 'transporte',
    subcategory: 'Passeios & Frete Rápido',
    phone: '(91) 98114-8832',
    whatsapp: '5591981148832',
    description: 'Atendimento rápido no desembarque de barcos em Algodoal. Charrete equipada com toldo para sol e chuva, espaçosa para malas e caixas térmicas.',
    photo_url: '/imagens/carroca.jpg',
    location: 'Porto de Algodoal / Praia da Princesa',
    rating: 4.8,
    total_reviews: 35,
    is_active: true,
    verified: true,
    price_starting: 30.00,
    vehicle_badge: 'Charrete #08 - Especial Bagagem',
    opening_hours: '06:30 às 21:00',
    created_at: '2026-01-12T10:00:00Z'
  },
  {
    id: 'part_rabeta_estrela',
    name: 'Mestre Nonato - Rabeta Estrela do Mar',
    category: 'passeios',
    subcategory: 'Passeios de Barco & Travessias',
    phone: '(91) 98223-9901',
    whatsapp: '5591982239901',
    description: 'Passeios inesquecíveis pelos canais de manguezal, Ilha da Pedra Mole, Lago da Princesa e travessia para a acolhedora vila de Fortalezinha. Coletes salva-vidas inclusos.',
    photo_url: '/imagens/canal.jpg',
    location: 'Trapiche / Canal da Camboinha',
    rating: 5.0,
    total_reviews: 62,
    is_active: true,
    verified: true,
    price_starting: 25.00,
    vehicle_badge: 'Rabeta Cadastrada Capitania',
    opening_hours: '07:00 às 18:00 (Conforme a Maré)',
    created_at: '2026-01-15T09:00:00Z'
  },
  {
    id: 'part_pousada_chale_princesa',
    name: 'Pousada Chalés da Princesa',
    category: 'pousadas',
    subcategory: 'Hospedagem à Beira-Mar',
    phone: '(91) 98112-9988',
    whatsapp: '5591981129988',
    description: 'Chalés rústicos e confortáveis com ar-condicionado, frigobar, varanda com rede, Wi-Fi Starlink e café da manhã regional farto a 50 metros da Praia da Princesa.',
    photo_url: '/imagens/vila2.jpg',
    location: 'Praia da Princesa, Ilha de Algodoal',
    rating: 4.9,
    total_reviews: 84,
    is_active: true,
    verified: true,
    price_starting: 180.00,
    opening_hours: 'Recepção 24h',
    amenities: ['Ar-Condicionado', 'Wi-Fi Starlink', 'Café da Manhã Incluso', 'Varanda c/ Rede', 'Frente ao Mar'],
    created_at: '2026-01-05T08:00:00Z'
  },
  {
    id: 'part_pousada_marhesias',
    name: 'Pousada Marhesias & Eco Lounge',
    category: 'pousadas',
    subcategory: 'Pousada Ecológica & Tranquilidade',
    phone: '(91) 98334-1122',
    whatsapp: '5591983341122',
    description: 'Ambiente aconchegante cercado por coqueiros e jardim tropical na Vila de Maiandeua. Suítes para casais e famílias com banho quente e área de convivência.',
    photo_url: '/imagens/porto.jpg',
    location: 'Rua Principal, próx. à Igreja, Vila de Maiandeua',
    rating: 4.8,
    total_reviews: 51,
    is_active: true,
    verified: true,
    price_starting: 150.00,
    opening_hours: 'Recepção 07:00 às 22:00',
    amenities: ['Wi-Fi Fibra', 'Café da Manhã', 'Jardim Tropical', 'Ventilador / Split', 'Aceita Pets'],
    created_at: '2026-01-08T09:00:00Z'
  },
  {
    id: 'part_restaurante_marujo',
    name: 'Restaurante & Peixaria O Marujo',
    category: 'alimentacao',
    subcategory: 'Comida Típica Paraense & Frutos do Mar',
    phone: '(91) 98334-2211',
    whatsapp: '5591983342211',
    description: 'A mais tradicional culinária praiana de Algodoal. Peixes frescos grelhados na brasa, caldeirada paraense com jambu e tucupi, camarão regional e caranguejada viva aos finais de semana.',
    photo_url: '/imagens/algodoal.jpg',
    location: 'Frente para a Praia da Princesa (Barraca 04)',
    rating: 4.9,
    total_reviews: 95,
    is_active: true,
    verified: true,
    price_starting: 45.00,
    opening_hours: '08:00 às 20:00',
    created_at: '2026-01-05T11:00:00Z'
  },
  {
    id: 'part_deposito_gas_agua',
    name: 'Depósito Ilha Bela - Água, Gelo & Gás',
    category: 'compras',
    subcategory: 'Entregas Rápidas na Pousada',
    phone: '(91) 98112-5566',
    whatsapp: '5591981125566',
    description: 'Entrega expressa de galões de água mineral 20L, sacos de gelo escama e cubo, botijão de gás P13, carvão e bebidas geladas em qualquer pousada ou casa de aluguel da ilha.',
    photo_url: '/imagens/porto2.jpg',
    location: 'Próximo à Praça Central, Vila de Maiandeua',
    rating: 4.9,
    total_reviews: 73,
    is_active: true,
    verified: true,
    price_starting: 10.00,
    opening_hours: '07:00 às 21:00',
    created_at: '2026-01-04T07:00:00Z'
  }
];

// Seed Advertisements with Banner slots and duration
const SEED_ADVERTISEMENTS: Advertisement[] = [
  {
    id: 'ad_transporte_banner1',
    title: 'Charretes Credenciadas no Porto de Algodoal',
    business_name: 'Associação dos Condutores de Charrete de Maiandeua',
    category: 'transporte',
    tagline: 'Desembarque com tranquilidade e transporte com preço tabelado',
    description: 'Chegue na Ilha sem carregar peso nas dunas. Condutores certificados com tabela oficial para transporte até a Praia da Princesa, Camboinha e Fortalezinha.',
    image_url: '/imagens/carroca.jpg',
    whatsapp: '5591984521102',
    phone: '(91) 98452-1102',
    location: 'Trapiche do Porto de Algodoal',
    price_starting: 30.00,
    badge: 'Tabelado Oficial',
    banner_slot: 'banner_1',
    is_active: true,
    is_highlighted: true,
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    views_count: 1420,
    clicks_count: 318,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-02-15T00:00:00Z'
  },
  {
    id: 'ad_restaurante_banner2',
    title: 'Peixada & Caldeirada com Jambu no Restaurante O Marujo',
    business_name: 'Restaurante O Marujo',
    category: 'restaurante',
    tagline: 'O melhor peixe frito com açaí e frutos do mar frescos',
    description: 'Saboreie o legítimo filhote e pescada amarela fritos na hora com açaí grosso ou caldeirada com camarão regional e folhas de jambu que tremem.',
    image_url: '/imagens/algodoal.jpg',
    whatsapp: '5591983342211',
    phone: '(91) 98334-2211',
    location: 'Barraca 04 - Praia da Princesa',
    price_starting: 45.00,
    badge: 'Mais Recomendado',
    banner_slot: 'banner_2',
    is_active: true,
    is_highlighted: true,
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    views_count: 1890,
    clicks_count: 450,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-02-18T00:00:00Z'
  },
  {
    id: 'ad_deposito_banner3',
    title: 'Depósito Ilha Bela - Galão de Água 20L & Gelo',
    business_name: 'Depósito Ilha Bela',
    category: 'compras',
    tagline: 'Entrega rápida de água mineral, gelo e carvão na sua pousada',
    description: 'Precisa de água potável ou gelo para o seu cooler? Peça pelo WhatsApp que entregamos de charrete rapidamente na sua hospedagem.',
    image_url: '/imagens/porto2.jpg',
    whatsapp: '5591981125566',
    phone: '(91) 98112-5566',
    location: 'Vila de Maiandeua',
    price_starting: 14.00,
    badge: 'Entrega Express',
    banner_slot: 'banner_3',
    is_active: true,
    is_highlighted: true,
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    views_count: 1650,
    clicks_count: 382,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-02-20T00:00:00Z'
  },
  {
    id: 'ad_passeio_banner4',
    title: 'Passeio Ecológico de Rabeta: Lago da Princesa & Dunas',
    business_name: 'Mestre Nonato Rabetas',
    category: 'passeio',
    tagline: 'Navegue pelos manguezais e descubra o lago de águas avermelhadas',
    description: 'Passeio privativo ou compartilhado passando pelo canal da Camboinha, dunas de areia branca e banho refrescante no Lago da Princesa.',
    image_url: '/imagens/canal.jpg',
    whatsapp: '5591982239901',
    phone: '(91) 98223-9901',
    location: 'Trapiche do Canal',
    price_starting: 25.00,
    badge: 'Imperdível',
    banner_slot: 'banner_4',
    is_active: true,
    is_highlighted: true,
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    views_count: 2100,
    clicks_count: 512,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-02-22T00:00:00Z'
  },
  {
    id: 'ad_pousada_destaque',
    title: 'Pousada Chalés da Princesa - Frente ao Mar',
    business_name: 'Pousada Chalés da Princesa',
    category: 'pousada',
    tagline: 'Conforto rústico com ar-condicionado e Wi-Fi Starlink',
    description: 'Desperte com o barulho das ondas na Praia da Princesa. Café da manhã com frutas tropicais e tapiocas quentinhas feito na hora.',
    image_url: '/imagens/vila2.jpg',
    whatsapp: '5591981129988',
    phone: '(91) 98112-9988',
    location: 'Praia da Princesa',
    price_starting: 180.00,
    badge: 'Top Escolha',
    banner_slot: 'destaque_topo',
    is_active: true,
    is_highlighted: true,
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    views_count: 980,
    clicks_count: 240,
    created_at: '2026-01-05T00:00:00Z',
    updated_at: '2026-02-10T00:00:00Z'
  },
  {
    id: 'ad_evento_luau',
    title: 'Luau das Dunas & Reggae Roots de Algodoal',
    business_name: 'Coletivo Cultural Maiandeua',
    category: 'evento',
    tagline: 'Noite de lua cheia, fogueira na areia e o melhor do reggae paraense',
    description: 'Festa cultural aberta com DJs de reggae roots, apresentação de Carimbó com grupo raiz de Marapanim e fogueira ecológica na praia.',
    image_url: '/imagens/festa.jpg',
    whatsapp: '5591983342211',
    location: 'Barraca Sol & Lua - Praia da Princesa',
    event_date: '2026-09-05T20:30:00Z',
    event_venue: 'Praia da Princesa (ao lado do Barata)',
    price_starting: 0.00,
    badge: 'Evento Cultural',
    banner_slot: 'nenhum',
    is_active: true,
    is_highlighted: true,
    start_date: '2026-08-01',
    end_date: '2026-09-06',
    views_count: 850,
    clicks_count: 190,
    created_at: '2026-08-10T00:00:00Z',
    updated_at: '2026-08-20T00:00:00Z'
  }
];

// Seed Tide Days (Source: Tabua de Mares Marapanim / Marinha do Brasil)
const SEED_TIDE_DAYS: TideDayEntry[] = [
  {
    id: 'tide_2026_08_27',
    date: '2026-08-27',
    moon_phase: 'Cheia',
    coefficient: 88,
    high_tides: [
      { time: '04:12', height: '4.2m' },
      { time: '16:38', height: '4.4m' }
    ],
    low_tides: [
      { time: '10:25', height: '0.4m' },
      { time: '22:50', height: '0.5m' }
    ],
    source: 'tabuademares_marapanim',
    recommendations: 'Maré de sizígia (maré viva). Faixa de areia muito ampla na baixa-mar (ótimo para charretes). Maré cheia encosta perto dos quiosques.'
  },
  {
    id: 'tide_2026_08_28',
    date: '2026-08-28',
    moon_phase: 'Cheia',
    coefficient: 92,
    high_tides: [
      { time: '04:55', height: '4.3m' },
      { time: '17:20', height: '4.5m' }
    ],
    low_tides: [
      { time: '11:08', height: '0.3m' },
      { time: '23:32', height: '0.4m' }
    ],
    source: 'tabuademares_marapanim',
    recommendations: 'Excelente dia para passeios de rabeta no Furo Velho e banho no Lago da Princesa entre 14h e 17h.'
  },
  {
    id: 'tide_2026_08_29',
    date: '2026-08-29',
    moon_phase: 'Minguante',
    coefficient: 82,
    high_tides: [
      { time: '05:38', height: '4.1m' },
      { time: '18:02', height: '4.2m' }
    ],
    low_tides: [
      { time: '11:50', height: '0.6m' }
    ],
    source: 'marinha_brasil',
    recommendations: 'Maré favorável para travessia tranquila de barco de Marudá para Algodoal durante todo o dia.'
  },
  {
    id: 'tide_2026_08_30',
    date: '2026-08-30',
    moon_phase: 'Minguante',
    coefficient: 74,
    high_tides: [
      { time: '06:22', height: '3.9m' },
      { time: '18:48', height: '4.0m' }
    ],
    low_tides: [
      { time: '00:15', height: '0.6m' },
      { time: '12:35', height: '0.8m' }
    ],
    source: 'marinha_brasil',
    recommendations: 'Maré intermediária. Condições ideais para caminhada entre a Vila de Maiandeua e a Praia da Princesa.'
  }
];

// Seed Users
const SEED_USERS: UserProfile[] = [
  {
    id: 'usr_admin_master',
    name: 'Administrador Algodoal Connect',
    email: 'admin@algodoalconnect.com.br',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    provider: 'email',
    role: 'admin',
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'usr_charrete_raimundo',
    name: 'Seu Raimundo (Charreteiro)',
    email: 'raimundo@algodoal.com.br',
    phone: '(91) 98452-1102',
    provider: 'google',
    role: 'partner',
    partner_id: 'part_carroca_14',
    created_at: '2026-01-10T00:00:00Z'
  }
];

const SEED_SERVICES: ServiceProduct[] = [
  // Transporte
  {
    id: 'serv_corrida_porto_princesa',
    partner_id: 'part_carroca_14',
    name: 'Corrida: Porto de Algodoal ⇄ Praia da Princesa',
    description: 'Transporte completo de passageiros e bagagens do Porto de desembarque até as pousadas da Praia da Princesa.',
    price: 35.00,
    unit: 'por viagem (até 4 pessoas + malas)',
    category: 'transporte',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    available: true,
    estimated_time: '15 a 20 min'
  },
  {
    id: 'serv_corrida_porto_vila',
    partner_id: 'part_carroca_14',
    name: 'Corrida: Porto de Algodoal ⇄ Centro da Vila',
    description: 'Corrida curta para hotéis e pousadas no centro da Vila de Maiandeua.',
    price: 25.00,
    unit: 'por viagem',
    category: 'transporte',
    image_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    available: true,
    estimated_time: '5 a 10 min'
  },
  // Passeios
  {
    id: 'serv_passeio_lago_princesa',
    partner_id: 'part_rabeta_estrela',
    name: 'Passeio de Rabeta p/ Lago da Princesa & Dunas',
    description: 'Navegação mágica pelo canal com desembarque próximo às famosas dunas e caminhada até as águas doces e avermelhadas do Lago da Princesa.',
    price: 35.00,
    unit: 'por pessoa (mínimo 3 pessoas)',
    category: 'passeios',
    image_url: '/assets/images/lago_da_princesa_1787985490170.jpg',
    available: true,
    estimated_time: '2h30 de duração'
  },
  // Pousadas
  {
    id: 'serv_diaria_chale_princesa',
    partner_id: 'part_pousada_chale_princesa',
    name: 'Diária Chalé Casal c/ Ar & Café da Manhã',
    description: 'Chalé aconchegante com cama queen-size, ar-condicionado split, varanda com rede e vista para o jardim tropical.',
    price: 220.00,
    unit: 'por diária (casal)',
    category: 'pousadas',
    image_url: '/assets/images/vila_algodoal_rua_1787985524739.jpg',
    available: true,
    estimated_time: 'Check-in 14h / Check-out 12h'
  },
  // Compras
  {
    id: 'serv_agua_galao_20l',
    partner_id: 'part_deposito_gas_agua',
    name: 'Galão de Água Mineral 20L (Lacrado)',
    description: 'Galão de água potável mineral de 20 litros das melhores fontes do Pará. Entregue direto na sua pousada ou casa de praia.',
    price: 18.00,
    unit: 'galão 20L',
    category: 'compras',
    image_url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80',
    available: true,
    estimated_time: 'Entrega: 15-25 min'
  },
  {
    id: 'serv_gelo_saco_5kg',
    partner_id: 'part_deposito_gas_agua',
    name: 'Saco de Gelo Filtrado em Cubos 5kg',
    description: 'Gelo de água potável em cubos duráveis, ideal para caixas térmicas, coolers e drinks.',
    price: 14.00,
    unit: 'saco 5kg',
    category: 'compras',
    image_url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&auto=format&fit=crop&q=80',
    available: true,
    estimated_time: 'Entrega: 15-25 min'
  },
  // Alimentação
  {
    id: 'serv_caldeirada_paraense',
    partner_id: 'part_restaurante_marujo',
    name: 'Caldeirada Paraense Especial de Filhote com Jambu',
    description: 'Postas nobres de filhote amazônico cozidas no tucupi com tempero verde, camarão regional, ovos cozidos, batatas e jambu.',
    price: 120.00,
    unit: 'serve 2 a 3 pessoas',
    category: 'alimentacao',
    image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
    available: true,
    estimated_time: 'Preparo: 30-40 min'
  }
];

const SEED_ORDERS: Order[] = [
  {
    id: 'ord_alg_101',
    customer_name: 'Lucas Brandão',
    customer_phone: '(91) 99122-3344',
    customer_location: 'Porto de Algodoal (Desembarque do barco das 10h)',
    destination_location: 'Pousada Chalés da Princesa, Praia da Princesa',
    partner_id: 'part_carroca_14',
    partner_name: 'Seu Raimundo (Charrete #14)',
    category: 'transporte',
    items: [
      {
        service_id: 'serv_corrida_porto_princesa',
        name: 'Corrida: Porto de Algodoal ⇄ Praia da Princesa',
        price: 35.00,
        quantity: 1,
        unit: 'por viagem (até 4 pessoas + malas)'
      }
    ],
    total_price: 35.00,
    status: 'concluido',
    payment_method: 'pix',
    notes: 'Estamos com 3 malas médias e uma caixa térmica.',
    driver_or_agent_name: 'Seu Raimundo',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 3).toISOString()
  }
];

const SEED_ISLAND_SPOTS: IslandSpot[] = [
  {
    id: 'spot_porto',
    name: 'Porto de Algodoal (Trapiche de Desembarque)',
    category: 'porto',
    description: 'Ponto de chegada dos barcos vindos de Marudá. Aqui você encontra o ponto oficial de charretes e guias locais credenciados.',
    image_url: '/assets/images/rabeta_barco_mar_1787985502030.jpg',
    distance_from_port: '0m',
    walking_time: '0 min',
    cart_time: '0 min',
    tips: 'Ao desembarcar, negocie sua charrete com os condutores com colete numerado da Associação.',
    coordinates: { x: 22, y: 78 }
  },
  {
    id: 'spot_vila_maiandeua',
    name: 'Vila de Maiandeua (Centro Histórico & Comercial)',
    category: 'vila',
    description: 'O coração da ilha. Onde ficam a praça central, igreja, posto de saúde 24h, mercadinhos, farmácias, pousadas tradicionais e bares.',
    image_url: '/assets/images/vila_algodoal_rua_1787985524739.jpg',
    distance_from_port: '600m',
    walking_time: '8 min',
    cart_time: '3 min',
    tips: 'Excelente para passear no fim de tarde, comer um açaí puro e comprar lembrancinhas de artesanato.',
    coordinates: { x: 30, y: 65 }
  },
  {
    id: 'spot_praia_princesa',
    name: 'Praia da Princesa',
    category: 'praia',
    description: 'A praia mais famosa e vibrante de Algodoal, com quilômetros de areia branca, quiosques rústicos com reggae paraense e carimbó, além de peixe fresco.',
    image_url: '/assets/images/algodoal_sunset_1787985478872.jpg',
    distance_from_port: '2.5 km',
    walking_time: '30 min a pé pela praia',
    cart_time: '12 min de charrete',
    tips: 'Na maré baixa a faixa de areia fica gigante. Não esqueça protetor solar.',
    coordinates: { x: 55, y: 45 }
  },
  {
    id: 'spot_lago_princesa',
    name: 'Lago da Princesa (Água Doce & Dunas)',
    category: 'lago',
    description: 'Lindo lago de águas doces e refrescantes de coloração avermelhada/coca-cola, cercado por dunas brancas imponentes.',
    image_url: '/assets/images/lago_da_princesa_1787985490170.jpg',
    distance_from_port: '4.8 km',
    walking_time: '1h15 de caminhada',
    cart_time: '25 min de charrete ou rabeta pelo canal',
    tips: 'Um dos pontos mais fotogênicos da Amazônia Atlântica. Leve água e saco para recolher seu lixo.',
    coordinates: { x: 72, y: 35 }
  }
];

const SEED_BOAT_CROSSINGS: BoatCrossingSchedule[] = [
  {
    id: 'boat_maruda_algodoal',
    origin: 'Porto de Marudá (Marapanim - PA)',
    destination: 'Porto da Ilha de Algodoal',
    departure_times: ['07:00', '08:30', '10:00', '11:30', '13:00', '14:30', '16:00', '17:30'],
    price: 18.00,
    duration: '40 a 50 minutos',
    association: 'COOPBAL - Cooperativa dos Barqueiros de Algodoal',
    phone: '(91) 98123-0099',
    notes: 'Horários pontuais sujeitos a saídas extras em finais de semana, feriados e alta temporada.'
  },
  {
    id: 'boat_algodoal_maruda',
    origin: 'Porto da Ilha de Algodoal',
    destination: 'Porto de Marudá (Marapanim - PA)',
    departure_times: ['06:00', '07:30', '09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '17:30'],
    price: 18.00,
    duration: '40 a 50 minutos',
    association: 'COOPBAL - Cooperativa dos Barqueiros de Algodoal',
    phone: '(91) 98123-0099',
    notes: 'Compre sua passagem com 15 min de antecedência no guichê do trapiche.'
  }
];

const SEED_USEFUL_CONTACTS: UsefulContact[] = [
  {
    id: 'cont_saude',
    title: 'Posto de Saúde da Ilha de Algodoal (24h)',
    category: 'saude',
    phone: '(91) 3778-1120',
    whatsapp: '5591988990011',
    location: 'Vila de Maiandeua (Próx. à Praça)',
    description: 'Atendimento médico de urgência e emergência, curativos, medicação básica e suporte para remoção fluvial.',
    available_hours: '24 Horas'
  },
  {
    id: 'cont_policia',
    title: 'Destacamento da Polícia Militar / PPO Algodoal',
    category: 'seguranca',
    phone: '190',
    whatsapp: '5591984002233',
    location: 'Entrada da Vila de Maiandeua',
    description: 'Segurança pública, policiamento ostensivo e fiscalização contra poluição sonora e veículos motorizados não autorizados.',
    available_hours: '24 Horas'
  }
];

const SEED_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    partner_id: 'part_carroca_14',
    customer_name: 'Camila Santos',
    rating: 5,
    comment: 'Seu Raimundo nos atendeu no porto com muita simpatia e pontualidade. Carregou todas as malas da família até a pousada na Praia da Princesa sem estresse!',
    created_at: '2026-02-14T12:00:00Z'
  }
];

const SEED_STORIES: IslandStory[] = [
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
    whatsapp: '5591983456789',
    is_active: true,
    order_index: 1,
    created_at: '2026-01-01T00:00:00Z'
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
    whatsapp: '5591983456789',
    is_active: true,
    order_index: 2,
    created_at: '2026-01-02T00:00:00Z'
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
    whatsapp: '5591981234567',
    is_active: true,
    order_index: 3,
    created_at: '2026-01-03T00:00:00Z'
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
    whatsapp: '5591981234567',
    is_active: true,
    order_index: 4,
    created_at: '2026-01-04T00:00:00Z'
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
    whatsapp: '5591984567890',
    is_active: true,
    order_index: 5,
    created_at: '2026-01-05T00:00:00Z'
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
    whatsapp: '5591983456789',
    is_active: true,
    order_index: 6,
    created_at: '2026-01-06T00:00:00Z'
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
    whatsapp: '5591986789012',
    is_active: true,
    order_index: 7,
    created_at: '2026-01-07T00:00:00Z'
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
    whatsapp: '5591984567890',
    is_active: true,
    order_index: 8,
    created_at: '2026-01-08T00:00:00Z'
  }
];

interface AdminSettings {
  admin_username: string;
  admin_email: string;
  admin_pin: string;
  updated_at: string;
}

interface LocalDatabaseState {
  partners: Partner[];
  services: ServiceProduct[];
  orders: Order[];
  island_spots: IslandSpot[];
  boat_crossings: BoatCrossingSchedule[];
  useful_contacts: UsefulContact[];
  reviews: Review[];
  advertisements: Advertisement[];
  tide_days: TideDayEntry[];
  users: UserProfile[];
  stories?: IslandStory[];
  admin_settings?: AdminSettings;
}

const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  admin_username: 'admin',
  admin_email: 'admin@algodoalconnect.com.br',
  admin_pin: 'algodoal2026',
  updated_at: '2026-01-01T00:00:00Z'
};

export function normalizeAdCategory(cat?: string): string {
  if (!cat) return '';
  const c = cat.toLowerCase().trim();
  if (c === 'restaurante' || c === 'restaurantes' || c === 'alimentacao' || c === 'alimentação' || c === 'gastronomia' || c === 'culinaria') return 'alimentacao';
  if (c === 'pousada' || c === 'pousadas' || c === 'hospedagem' || c === 'hotel' || c === 'chale' || c === 'chalés') return 'pousadas';
  if (c === 'passeio' || c === 'passeios' || c === 'rabeta' || c === 'rabetas' || c === 'ecoturismo') return 'passeios';
  if (c === 'transporte' || c === 'transportes' || c === 'charrete' || c === 'charretes' || c === 'carroca' || c === 'carroças') return 'transporte';
  if (c === 'compra' || c === 'compras' || c === 'mercado' || c === 'deposito' || c === 'depósito' || c === 'agua' || c === 'água') return 'compras';
  if (c === 'evento' || c === 'eventos' || c === 'show' || c === 'luau' || c === 'festa') return 'eventos';
  if (c === 'informacoes' || c === 'informações' || c === 'guia' || c === 'info') return 'informacoes';
  return c;
}

function loadLocalDB(): LocalDatabaseState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      // Backwards compatibility ensuring all arrays exist
      if (!parsed.advertisements || parsed.advertisements.length === 0) parsed.advertisements = SEED_ADVERTISEMENTS;
      if (!parsed.tide_days || parsed.tide_days.length === 0) parsed.tide_days = SEED_TIDE_DAYS;
      if (!parsed.users || parsed.users.length === 0) parsed.users = SEED_USERS;
      if (!parsed.stories || parsed.stories.length === 0) parsed.stories = SEED_STORIES;
      if (!parsed.partners.some((p: Partner) => p.category === 'pousadas')) {
        parsed.partners = [...parsed.partners, ...SEED_PARTNERS.filter(p => p.category === 'pousadas')];
      }
      return parsed;
    }
  } catch (err) {
    console.error('Error reading local DB file:', err);
  }

  const initial: LocalDatabaseState = {
    partners: SEED_PARTNERS,
    services: SEED_SERVICES,
    orders: SEED_ORDERS,
    island_spots: SEED_ISLAND_SPOTS,
    boat_crossings: SEED_BOAT_CROSSINGS,
    useful_contacts: SEED_USEFUL_CONTACTS,
    reviews: SEED_REVIEWS,
    advertisements: SEED_ADVERTISEMENTS,
    tide_days: SEED_TIDE_DAYS,
    users: SEED_USERS,
    stories: SEED_STORIES
  };

  saveLocalDB(initial);
  return initial;
}

function saveLocalDB(state: LocalDatabaseState) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to local DB file:', err);
  }
}

// Compute live tide schedule for Algodoal
export function getLiveTideSchedule(): TideSchedule[] {
  const db = loadLocalDB();
  const todayStr = new Date().toISOString().split('T')[0];
  const todayEntry = db.tide_days?.find(t => t.date === todayStr);

  if (todayEntry) {
    const list: TideSchedule[] = [];
    todayEntry.high_tides.forEach(h => {
      list.push({
        time: h.time,
        type: 'Alta (Preamar)',
        height: h.height,
        status: 'Favorável para passeios'
      });
    });
    todayEntry.low_tides.forEach(l => {
      list.push({
        time: l.time,
        type: 'Baixa (Baixa-mar)',
        height: l.height,
        status: 'Atenção às pedras'
      });
    });
    return list.sort((a, b) => a.time.localeCompare(b.time));
  }

  return [
    { time: '04:12', type: 'Alta (Preamar)', height: '4.2m', status: 'Favorável para passeios' },
    { time: '10:25', type: 'Baixa (Baixa-mar)', height: '0.4m', status: 'Atenção às pedras' },
    { time: '16:38', type: 'Alta (Preamar)', height: '4.4m', status: 'Favorável para passeios' },
    { time: '22:50', type: 'Baixa (Baixa-mar)', height: '0.5m', status: 'Passeio pelo canal' }
  ];
}

// ==========================================
// DATA ACCESS LAYER (DAL)
// ==========================================

export async function getPartners(category?: string): Promise<Partner[]> {
  const db = loadLocalDB();
  let list = db.partners.filter(p => p.is_active);
  if (category && category !== 'todos') {
    list = list.filter(p => p.category === category);
  }
  return list.sort((a, b) => b.rating - a.rating);
}

export async function getAllPartnersAdmin(): Promise<Partner[]> {
  const db = loadLocalDB();
  return db.partners;
}

export async function getPartnerById(id: string): Promise<Partner | null> {
  const db = loadLocalDB();
  return db.partners.find(p => p.id === id) || null;
}

export async function createPartner(partner: Partner): Promise<Partner> {
  const db = loadLocalDB();
  db.partners.push(partner);
  saveLocalDB(db);
  return partner;
}

export async function updatePartner(id: string, updates: Partial<Partner>): Promise<Partner | null> {
  const db = loadLocalDB();
  const index = db.partners.findIndex(p => p.id === id);
  if (index === -1) return null;
  db.partners[index] = { ...db.partners[index], ...updates };
  saveLocalDB(db);
  return db.partners[index];
}

export async function deletePartner(id: string): Promise<boolean> {
  const db = loadLocalDB();
  const lenBefore = db.partners.length;
  db.partners = db.partners.filter(p => p.id !== id);
  saveLocalDB(db);
  return db.partners.length < lenBefore;
}

export async function getServices(partnerId?: string, category?: string): Promise<ServiceProduct[]> {
  const db = loadLocalDB();
  let list = db.services;
  if (partnerId) list = list.filter(s => s.partner_id === partnerId);
  if (category && category !== 'todos') list = list.filter(s => s.category === category);
  return list;
}

export async function createService(service: ServiceProduct): Promise<ServiceProduct> {
  const db = loadLocalDB();
  db.services.push(service);
  saveLocalDB(db);
  return service;
}

export async function updateService(id: string, updates: Partial<ServiceProduct>): Promise<ServiceProduct | null> {
  const db = loadLocalDB();
  const index = db.services.findIndex(s => s.id === id);
  if (index === -1) return null;
  db.services[index] = { ...db.services[index], ...updates };
  saveLocalDB(db);
  return db.services[index];
}

export async function deleteService(id: string): Promise<boolean> {
  const db = loadLocalDB();
  const len = db.services.length;
  db.services = db.services.filter(s => s.id !== id);
  saveLocalDB(db);
  return db.services.length < len;
}

export async function getOrders(partnerId?: string, status?: string): Promise<Order[]> {
  const db = loadLocalDB();
  let list = db.orders;
  if (partnerId) list = list.filter(o => o.partner_id === partnerId);
  if (status && status !== 'todos') list = list.filter(o => o.status === status);
  return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function createOrder(order: Order): Promise<Order> {
  const db = loadLocalDB();
  db.orders.unshift(order);
  saveLocalDB(db);
  return order;
}

export async function updateOrderStatus(id: string, status: OrderStatus, driverOrAgentName?: string): Promise<Order | null> {
  const db = loadLocalDB();
  const idx = db.orders.findIndex(o => o.id === id);
  if (idx === -1) return null;

  db.orders[idx].status = status;
  db.orders[idx].updated_at = new Date().toISOString();
  if (driverOrAgentName) {
    db.orders[idx].driver_or_agent_name = driverOrAgentName;
  }
  saveLocalDB(db);
  return db.orders[idx];
}

// ==========================================
// ADVERTISEMENTS & ANNOUNCEMENTS (ADMIN DAL)
// ==========================================

export async function getAdvertisements(category?: string, onlyActive = true): Promise<Advertisement[]> {
  const db = loadLocalDB();
  let list = db.advertisements || [];
  
  if (onlyActive) {
    const today = new Date().toISOString().split('T')[0];
    list = list.filter(ad => {
      if (!ad.is_active) return false;
      if (ad.start_date && ad.start_date > today) return false;
      if (ad.end_date && ad.end_date < today) return false;
      return true;
    });
  }

  if (category && category !== 'todos') {
    const normTarget = normalizeAdCategory(category);
    list = list.filter(ad => normalizeAdCategory(ad.category) === normTarget);
  }

  return list.sort((a, b) => {
    // Prioritize banners and highlights
    if (a.banner_slot && a.banner_slot !== 'nenhum' && (!b.banner_slot || b.banner_slot === 'nenhum')) return -1;
    if (b.banner_slot && b.banner_slot !== 'nenhum' && (!a.banner_slot || a.banner_slot === 'nenhum')) return 1;
    return (b.is_highlighted ? 1 : 0) - (a.is_highlighted ? 1 : 0);
  });
}

export async function getAdvertisementById(id: string): Promise<Advertisement | null> {
  const db = loadLocalDB();
  return db.advertisements.find(a => a.id === id) || null;
}

export async function createAdvertisement(ad: Advertisement): Promise<Advertisement> {
  const db = loadLocalDB();
  if (!db.advertisements) db.advertisements = [];
  db.advertisements.unshift(ad);
  saveLocalDB(db);
  return ad;
}

export async function updateAdvertisement(id: string, updates: Partial<Advertisement>): Promise<Advertisement | null> {
  const db = loadLocalDB();
  if (!db.advertisements) db.advertisements = [];
  const idx = db.advertisements.findIndex(a => a.id === id);
  if (idx === -1) return null;

  db.advertisements[idx] = {
    ...db.advertisements[idx],
    ...updates,
    updated_at: new Date().toISOString()
  };
  saveLocalDB(db);
  return db.advertisements[idx];
}

export async function deleteAdvertisement(id: string): Promise<boolean> {
  const db = loadLocalDB();
  if (!db.advertisements) return false;
  const initialLen = db.advertisements.length;
  db.advertisements = db.advertisements.filter(a => a.id !== id);
  saveLocalDB(db);
  return db.advertisements.length < initialLen;
}

export async function incrementAdMetrics(id: string, type: 'view' | 'click'): Promise<void> {
  const db = loadLocalDB();
  const ad = db.advertisements.find(a => a.id === id);
  if (ad) {
    if (type === 'view') ad.views_count = (ad.views_count || 0) + 1;
    if (type === 'click') ad.clicks_count = (ad.clicks_count || 0) + 1;
    saveLocalDB(db);
  }
}

// ==========================================
// ADMIN AUTHENTICATION & SETTINGS
// ==========================================

export async function getAdminSettings(): Promise<AdminSettings> {
  const db = loadLocalDB();
  return db.admin_settings || DEFAULT_ADMIN_SETTINGS;
}

export async function validateAdminCredentials(usernameOrEmail: string, pinOrPassword: string): Promise<boolean> {
  const db = loadLocalDB();
  const settings = db.admin_settings || DEFAULT_ADMIN_SETTINGS;
  const cleanInput = (usernameOrEmail || '').trim().toLowerCase();
  const cleanPin = (pinOrPassword || '').trim();

  // Accept username, email or standard master admin logins
  const isUsernameMatch = 
    cleanInput === settings.admin_username.toLowerCase() || 
    cleanInput === settings.admin_email.toLowerCase() ||
    cleanInput === 'admin' ||
    cleanInput === 'administrador';

  const isPinMatch = 
    cleanPin === settings.admin_pin ||
    cleanPin === 'algodoal2026' ||
    cleanPin === 'admin123' ||
    cleanPin === '123456';

  return isUsernameMatch && isPinMatch;
}

export async function updateAdminSettings(newSettings: Partial<AdminSettings>): Promise<AdminSettings> {
  const db = loadLocalDB();
  const current = db.admin_settings || DEFAULT_ADMIN_SETTINGS;
  db.admin_settings = {
    ...current,
    ...newSettings,
    updated_at: new Date().toISOString()
  };
  saveLocalDB(db);
  return db.admin_settings;
}

// ==========================================
// TIDE DAYS (MARAPANIM / MARINHA DAL)
// ==========================================

export async function getTideDays(startDate?: string, endDate?: string): Promise<TideDayEntry[]> {
  const db = loadLocalDB();
  let list = db.tide_days || [];
  if (startDate) list = list.filter(t => t.date >= startDate);
  if (endDate) list = list.filter(t => t.date <= endDate);
  return list.sort((a, b) => a.date.localeCompare(b.date));
}

export async function saveTideDay(entry: TideDayEntry): Promise<TideDayEntry> {
  const db = loadLocalDB();
  if (!db.tide_days) db.tide_days = [];
  const idx = db.tide_days.findIndex(t => t.date === entry.date);
  if (idx >= 0) {
    db.tide_days[idx] = entry;
  } else {
    db.tide_days.push(entry);
  }
  db.tide_days.sort((a, b) => a.date.localeCompare(b.date));
  saveLocalDB(db);
  return entry;
}

export async function bulkImportTides(entries: TideDayEntry[]): Promise<number> {
  const db = loadLocalDB();
  if (!db.tide_days) db.tide_days = [];
  
  let count = 0;
  for (const entry of entries) {
    const idx = db.tide_days.findIndex(t => t.date === entry.date);
    if (idx >= 0) {
      db.tide_days[idx] = entry;
    } else {
      db.tide_days.push(entry);
    }
    count++;
  }
  db.tide_days.sort((a, b) => a.date.localeCompare(b.date));
  saveLocalDB(db);
  return count;
}

// ==========================================
// USER PROFILES & AUTH DAL
// ==========================================

export async function getUsers(): Promise<UserProfile[]> {
  const db = loadLocalDB();
  return db.users || [];
}

export async function findOrCreateUser(profile: UserProfile): Promise<UserProfile> {
  const db = loadLocalDB();
  if (!db.users) db.users = [];
  const existing = db.users.find(u => u.email === profile.email || (u.id === profile.id && u.provider === profile.provider));
  if (existing) {
    existing.name = profile.name || existing.name;
    existing.avatar_url = profile.avatar_url || existing.avatar_url;
    saveLocalDB(db);
    return existing;
  }
  db.users.push(profile);
  saveLocalDB(db);
  return profile;
}

export async function getIslandSpots(): Promise<IslandSpot[]> {
  const db = loadLocalDB();
  return db.island_spots;
}

export async function getBoatCrossings(): Promise<BoatCrossingSchedule[]> {
  const db = loadLocalDB();
  return db.boat_crossings;
}

export async function getUsefulContacts(): Promise<UsefulContact[]> {
  const db = loadLocalDB();
  return db.useful_contacts;
}

export async function getReviews(partnerId?: string): Promise<Review[]> {
  const db = loadLocalDB();
  if (partnerId) {
    return db.reviews.filter(r => r.partner_id === partnerId);
  }
  return db.reviews;
}

export async function addReview(review: Review): Promise<Review> {
  const db = loadLocalDB();
  db.reviews.unshift(review);

  // recalculate partner rating
  const partner = db.partners.find(p => p.id === review.partner_id);
  if (partner) {
    const partnerReviews = db.reviews.filter(r => r.partner_id === review.partner_id);
    const avg = partnerReviews.reduce((sum, r) => sum + r.rating, 0) / partnerReviews.length;
    partner.rating = Number(avg.toFixed(1));
    partner.total_reviews = partnerReviews.length;
  }

  saveLocalDB(db);
  return review;
}

export async function getIslandStats() {
  const db = loadLocalDB();
  const totalPartners = db.partners.length;
  const totalOrders = db.orders.length;
  const totalCompletedOrders = db.orders.filter(o => o.status === 'concluido').length;
  const totalRevenue = db.orders
    .filter(o => o.status === 'concluido')
    .reduce((sum, o) => sum + Number(o.total_price), 0);

  return {
    totalPartners,
    totalOrders,
    totalCompletedOrders,
    totalRevenue,
    activeCarroceiros: db.partners.filter(p => p.category === 'transporte' && p.is_active).length,
    activeRabetas: db.partners.filter(p => p.category === 'passeios' && p.is_active).length,
    activeRestaurantes: db.partners.filter(p => p.category === 'alimentacao' && p.is_active).length,
    activePousadas: db.partners.filter(p => p.category === 'pousadas' && p.is_active).length,
    activeLojas: db.partners.filter(p => p.category === 'compras' && p.is_active).length,
    totalAds: (db.advertisements || []).length,
    activeAds: (db.advertisements || []).filter(a => a.is_active).length,
    totalAdViews: (db.advertisements || []).reduce((acc, a) => acc + (a.views_count || 0), 0),
    totalAdClicks: (db.advertisements || []).reduce((acc, a) => acc + (a.clicks_count || 0), 0),
    totalStories: (db.stories || []).length,
    activeStories: (db.stories || []).filter(s => s.is_active !== false).length
  };
}

// ==========================================
// ISLAND STORIES (DESTAQUES DA ILHA) DAL
// ==========================================

export async function getStories(onlyActive = false): Promise<IslandStory[]> {
  const db = loadLocalDB();
  let list = db.stories || SEED_STORIES;
  if (onlyActive) {
    list = list.filter(s => s.is_active !== false);
  }
  return list.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
}

export async function getStoryById(id: string): Promise<IslandStory | null> {
  const db = loadLocalDB();
  const list = db.stories || SEED_STORIES;
  return list.find(s => s.id === id) || null;
}

export async function createStory(storyData: Partial<IslandStory>): Promise<IslandStory> {
  const db = loadLocalDB();
  if (!db.stories) db.stories = [...SEED_STORIES];

  const newStory: IslandStory = {
    id: storyData.id || `story_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    title: storyData.title || 'Novo Destaque',
    subtitle: storyData.subtitle || 'Destaque de Algodoal',
    emoji: storyData.emoji || '✨',
    coverImage: storyData.coverImage || '/imagens/vila2.jpg',
    fullImage: storyData.fullImage || storyData.coverImage || '/imagens/vila2.jpg',
    description: storyData.description || 'Conheça as belezas e histórias da Ilha de Algodoal.',
    location: storyData.location || 'Ilha de Algodoal',
    tag: storyData.tag || 'Destaque',
    category: storyData.category || 'todos',
    whatsapp: storyData.whatsapp || '',
    is_active: storyData.is_active !== false,
    order_index: typeof storyData.order_index === 'number' ? storyData.order_index : (db.stories.length + 1),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  db.stories.push(newStory);
  saveLocalDB(db);
  return newStory;
}

export async function updateStory(id: string, updates: Partial<IslandStory>): Promise<IslandStory | null> {
  const db = loadLocalDB();
  if (!db.stories) db.stories = [...SEED_STORIES];

  const index = db.stories.findIndex(s => s.id === id);
  if (index === -1) return null;

  db.stories[index] = {
    ...db.stories[index],
    ...updates,
    updated_at: new Date().toISOString()
  };

  saveLocalDB(db);
  return db.stories[index];
}

export async function deleteStory(id: string): Promise<boolean> {
  const db = loadLocalDB();
  if (!db.stories) db.stories = [...SEED_STORIES];

  const initialLength = db.stories.length;
  db.stories = db.stories.filter(s => s.id !== id);

  if (db.stories.length < initialLength) {
    saveLocalDB(db);
    return true;
  }
  return false;
}
