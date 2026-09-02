-- =========================================================
-- ALGODOAL CONNECT - POSTGRESQL RELATIONAL SCHEMA
-- =========================================================
-- Este arquivo é apenas documentação/referência. Em runtime, o próprio
-- database.ts cria estas tabelas automaticamente (CREATE TABLE IF NOT
-- EXISTS) e semeia os dados iniciais na primeira conexão, então não é
-- necessário rodar este script manualmente — mas ele pode ser usado para
-- inspecionar a estrutura ou recriar o banco do zero.

-- Tabela de Parceiros e Prestadores Locais da Ilha de Algodoal
CREATE TABLE IF NOT EXISTS partners (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'transporte', 'passeios', 'compras', 'alimentacao', 'pousadas', 'informacoes'
    subcategory VARCHAR(150),
    phone VARCHAR(50) NOT NULL,
    whatsapp VARCHAR(50) NOT NULL,
    description TEXT,
    photo_url TEXT,
    location VARCHAR(255) NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    total_reviews INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    verified BOOLEAN DEFAULT TRUE,
    plan_type VARCHAR(20), -- 'mensal', 'free', 'divulgacao'
    price_starting NUMERIC(10, 2) DEFAULT 0.0,
    vehicle_badge VARCHAR(150),
    opening_hours VARCHAR(150),
    amenities JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Produtos e Serviços oferecidos pelos parceiros
CREATE TABLE IF NOT EXISTS services_products (
    id VARCHAR(64) PRIMARY KEY,
    partner_id VARCHAR(64) REFERENCES partners(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    unit VARCHAR(80) NOT NULL, -- 'por viagem', 'por pessoa', 'galão 20L', 'porção', etc.
    category VARCHAR(50) NOT NULL,
    image_url TEXT,
    available BOOLEAN DEFAULT TRUE,
    estimated_time VARCHAR(80)
);

-- Tabela de Pedidos e Solicitações de Turistas
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_location VARCHAR(255) NOT NULL,
    destination_location VARCHAR(255),
    partner_id VARCHAR(64) REFERENCES partners(id) ON DELETE SET NULL,
    partner_name VARCHAR(255),
    category VARCHAR(50) NOT NULL,
    items JSONB NOT NULL DEFAULT '[]',
    total_price NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pendente', -- 'pendente', 'aceito', 'em_rota', 'concluido', 'cancelado'
    payment_method VARCHAR(50) NOT NULL DEFAULT 'pix',
    notes TEXT,
    driver_or_agent_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Avaliações e Depoimentos
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(64) PRIMARY KEY,
    partner_id VARCHAR(64) REFERENCES partners(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Pontos Turísticos da Ilha
CREATE TABLE IF NOT EXISTS island_spots (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    image_url TEXT,
    distance_from_port VARCHAR(100),
    walking_time VARCHAR(100),
    cart_time VARCHAR(100),
    tips TEXT,
    coordinates JSONB
);

-- Tabela de Horários de Travessia (Marudá <-> Algodoal)
CREATE TABLE IF NOT EXISTS boat_crossings (
    id VARCHAR(64) PRIMARY KEY,
    origin VARCHAR(150) NOT NULL,
    destination VARCHAR(150) NOT NULL,
    departure_times JSONB NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    duration VARCHAR(80) NOT NULL,
    association VARCHAR(255),
    phone VARCHAR(50),
    notes TEXT
);

-- Tabela de Contatos Úteis da Ilha
CREATE TABLE IF NOT EXISTS useful_contacts (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    whatsapp VARCHAR(50),
    location VARCHAR(255) NOT NULL,
    description TEXT,
    available_hours VARCHAR(100)
);

-- Tabela de Anúncios / Banners do Painel Administrativo
CREATE TABLE IF NOT EXISTS advertisements (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    partner_id VARCHAR(64),
    business_name VARCHAR(255) NOT NULL,
    tagline VARCHAR(255),
    description TEXT,
    image_url TEXT,
    link_url TEXT,
    whatsapp VARCHAR(50),
    phone VARCHAR(50),
    location VARCHAR(255),
    price_starting NUMERIC(10, 2) DEFAULT 0,
    badge VARCHAR(100),
    event_date VARCHAR(50),
    event_venue VARCHAR(255),
    banner_slot VARCHAR(30) DEFAULT 'nenhum', -- 'banner_1'..'banner_4', 'destaque_topo', 'nenhum'
    plan_type VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    is_highlighted BOOLEAN DEFAULT FALSE,
    start_date VARCHAR(20),
    end_date VARCHAR(20),
    views_count INTEGER DEFAULT 0,
    clicks_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Tábua de Marés (Marapanim / Marinha do Brasil)
CREATE TABLE IF NOT EXISTS tide_days (
    id VARCHAR(64) PRIMARY KEY,
    date VARCHAR(10) UNIQUE NOT NULL,
    moon_phase VARCHAR(20) NOT NULL,
    coefficient INTEGER,
    high_tides JSONB NOT NULL DEFAULT '[]',
    low_tides JSONB NOT NULL DEFAULT '[]',
    source VARCHAR(50) NOT NULL DEFAULT 'manual',
    recommendations TEXT
);

-- Tabela de Usuários (Login Social / Admin / Parceiros)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    avatar_url TEXT,
    provider VARCHAR(20) NOT NULL DEFAULT 'email', -- 'google', 'facebook', 'instagram', 'apple', 'email'
    role VARCHAR(20) NOT NULL DEFAULT 'tourist', -- 'tourist', 'partner', 'admin'
    partner_id VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Configurações do Administrador (linha única, id fixo = 1)
CREATE TABLE IF NOT EXISTS admin_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    admin_username VARCHAR(100) NOT NULL DEFAULT 'admin',
    admin_email VARCHAR(255) NOT NULL DEFAULT 'admin@algodoalconnect.com.br',
    admin_pin VARCHAR(255) NOT NULL DEFAULT 'algodoal2026',
    hero_background_url TEXT,
    hero_rotation_enabled BOOLEAN DEFAULT TRUE,
    hero_active_images JSONB DEFAULT '[]',
    hero_custom_images JSONB DEFAULT '[]',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT admin_settings_singleton CHECK (id = 1)
);

-- Tabela de Destaques/Stories da Ilha
CREATE TABLE IF NOT EXISTS stories (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    emoji VARCHAR(10),
    cover_image TEXT,
    full_image TEXT,
    description TEXT,
    location VARCHAR(255),
    tag VARCHAR(100),
    category VARCHAR(50) DEFAULT 'todos',
    whatsapp VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para alta performance
CREATE INDEX IF NOT EXISTS idx_partners_category ON partners(category);
CREATE INDEX IF NOT EXISTS idx_services_partner ON services_products(partner_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_partner ON orders(partner_id);
CREATE INDEX IF NOT EXISTS idx_advertisements_category ON advertisements(category);
CREATE INDEX IF NOT EXISTS idx_reviews_partner ON reviews(partner_id);
