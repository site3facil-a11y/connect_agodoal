-- =========================================================
-- ALGODOAL CONNECT - POSTGRESQL RELATIONAL SCHEMA
-- =========================================================

-- Tabela de Parceiros e Prestadores Locais da Ilha de Algodoal
CREATE TABLE IF NOT EXISTS partners (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'transporte', 'passeios', 'compras', 'alimentacao', 'informacoes'
    subcategory VARCHAR(100),
    phone VARCHAR(50) NOT NULL,
    whatsapp VARCHAR(50) NOT NULL,
    description TEXT,
    photo_url TEXT,
    location VARCHAR(255) NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    total_reviews INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    verified BOOLEAN DEFAULT TRUE,
    price_starting NUMERIC(10, 2) DEFAULT 0.0,
    vehicle_badge VARCHAR(100),
    opening_hours VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Produtos e Serviços oferecidos pelos parceiros
CREATE TABLE IF NOT EXISTS services_products (
    id VARCHAR(64) PRIMARY KEY,
    partner_id VARCHAR(64) REFERENCES partners(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    unit VARCHAR(50) NOT NULL, -- 'por viagem', 'por pessoa', 'galão 20L', 'porção', etc.
    category VARCHAR(50) NOT NULL,
    image_url TEXT,
    available BOOLEAN DEFAULT TRUE,
    estimated_time VARCHAR(50)
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
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    departure_times JSONB NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    duration VARCHAR(50) NOT NULL,
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

-- Índices para alta performance
CREATE INDEX IF NOT EXISTS idx_partners_category ON partners(category);
CREATE INDEX IF NOT EXISTS idx_services_partner ON services_products(partner_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_partner ON orders(partner_id);
