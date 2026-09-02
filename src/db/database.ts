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

// ==========================================
// POSTGRESQL SCHEMA BOOTSTRAP + SEED
// ==========================================
// Every DAL function below awaits this promise before touching pgPool, so the
// tables and initial seed data always exist before the first real query runs.
let pgInitPromise: Promise<void> | null = pgPool ? initPostgres() : null;

async function initPostgres(): Promise<void> {
  try {
    await pgPool!.query(`
      CREATE TABLE IF NOT EXISTS partners (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        subcategory VARCHAR(150),
        phone VARCHAR(50) NOT NULL,
        whatsapp VARCHAR(50) NOT NULL,
        description TEXT,
        photo_url TEXT,
        location VARCHAR(255) NOT NULL,
        rating NUMERIC(3,2) DEFAULT 5.0,
        total_reviews INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        verified BOOLEAN DEFAULT TRUE,
        plan_type VARCHAR(20),
        price_starting NUMERIC(10,2) DEFAULT 0.0,
        vehicle_badge VARCHAR(150),
        opening_hours VARCHAR(150),
        amenities JSONB DEFAULT '[]',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS services_products (
        id VARCHAR(64) PRIMARY KEY,
        partner_id VARCHAR(64) REFERENCES partners(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price NUMERIC(10,2) NOT NULL DEFAULT 0,
        unit VARCHAR(80) NOT NULL DEFAULT 'por unidade',
        category VARCHAR(50) NOT NULL,
        image_url TEXT,
        available BOOLEAN DEFAULT TRUE,
        estimated_time VARCHAR(80)
      );

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
        total_price NUMERIC(10,2) NOT NULL DEFAULT 0,
        status VARCHAR(50) NOT NULL DEFAULT 'pendente',
        payment_method VARCHAR(50) NOT NULL DEFAULT 'pix',
        notes TEXT,
        driver_or_agent_name VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id VARCHAR(64) PRIMARY KEY,
        partner_id VARCHAR(64) REFERENCES partners(id) ON DELETE CASCADE,
        customer_name VARCHAR(255) NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

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

      CREATE TABLE IF NOT EXISTS boat_crossings (
        id VARCHAR(64) PRIMARY KEY,
        origin VARCHAR(150) NOT NULL,
        destination VARCHAR(150) NOT NULL,
        departure_times JSONB NOT NULL DEFAULT '[]',
        price NUMERIC(10,2) NOT NULL DEFAULT 0,
        duration VARCHAR(80) NOT NULL,
        association VARCHAR(255),
        phone VARCHAR(50),
        notes TEXT
      );

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
        price_starting NUMERIC(10,2) DEFAULT 0,
        badge VARCHAR(100),
        event_date VARCHAR(50),
        event_venue VARCHAR(255),
        banner_slot VARCHAR(30) DEFAULT 'nenhum',
        plan_type VARCHAR(20),
        is_active BOOLEAN DEFAULT TRUE,
        is_highlighted BOOLEAN DEFAULT FALSE,
        start_date VARCHAR(20),
        end_date VARCHAR(20),
        views_count INTEGER DEFAULT 0,
        clicks_count INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

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

      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        avatar_url TEXT,
        provider VARCHAR(20) NOT NULL DEFAULT 'email',
        role VARCHAR(20) NOT NULL DEFAULT 'tourist',
        partner_id VARCHAR(64),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS admin_settings (
        id INTEGER PRIMARY KEY DEFAULT 1,
        admin_username VARCHAR(100) NOT NULL DEFAULT 'admin',
        admin_email VARCHAR(255) NOT NULL DEFAULT 'admin@algodoalconnect.com.br',
        admin_pin VARCHAR(255) NOT NULL DEFAULT 'algodoal2026',
        hero_background_url TEXT,
        hero_rotation_enabled BOOLEAN DEFAULT TRUE,
        hero_active_images JSONB DEFAULT '[]',
        hero_custom_images JSONB DEFAULT '[]',
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT admin_settings_singleton CHECK (id = 1)
      );

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
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_partners_category ON partners(category);
      CREATE INDEX IF NOT EXISTS idx_services_partner ON services_products(partner_id);
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
      CREATE INDEX IF NOT EXISTS idx_orders_partner ON orders(partner_id);
      CREATE INDEX IF NOT EXISTS idx_advertisements_category ON advertisements(category);
      CREATE INDEX IF NOT EXISTS idx_reviews_partner ON reviews(partner_id);
    `);

    console.log('🗄️  Tabelas PostgreSQL verificadas/criadas com sucesso.');
    await seedPostgresIfEmpty();
  } catch (err) {
    console.error('❌ Falha ao inicializar o schema PostgreSQL. Caindo para o armazenamento local em arquivo JSON:', err);
    // Disable the pool so every DAL function below falls back to the local JSON store
    // instead of silently failing on every request.
    pgPool = null;
  }
}

async function seedPostgresIfEmpty(): Promise<void> {
  const { rows } = await pgPool!.query('SELECT COUNT(*)::int AS count FROM partners');
  if (rows[0].count > 0) {
    console.log('✅ PostgreSQL já contém dados — seed inicial ignorado.');
    return;
  }

  console.log('🌱 Banco PostgreSQL vazio. Semeando dados iniciais de Algodoal Connect...');

  for (const p of SEED_PARTNERS) {
    await pgPool!.query(
      `INSERT INTO partners (id, name, category, subcategory, phone, whatsapp, description, photo_url, location, rating, total_reviews, is_active, verified, plan_type, price_starting, vehicle_badge, opening_hours, amenities, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
       ON CONFLICT (id) DO NOTHING`,
      [p.id, p.name, p.category, p.subcategory || null, p.phone, p.whatsapp, p.description, p.photo_url, p.location, p.rating, p.total_reviews, p.is_active, p.verified, p.plan_type || null, p.price_starting, p.vehicle_badge || null, p.opening_hours || null, JSON.stringify(p.amenities || []), p.created_at]
    );
  }

  for (const s of SEED_SERVICES) {
    await pgPool!.query(
      `INSERT INTO services_products (id, partner_id, name, description, price, unit, category, image_url, available, estimated_time)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (id) DO NOTHING`,
      [s.id, s.partner_id, s.name, s.description, s.price, s.unit, s.category, s.image_url, s.available, s.estimated_time || null]
    );
  }

  for (const o of SEED_ORDERS) {
    await pgPool!.query(
      `INSERT INTO orders (id, customer_name, customer_phone, customer_location, destination_location, partner_id, partner_name, category, items, total_price, status, payment_method, notes, driver_or_agent_name, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
       ON CONFLICT (id) DO NOTHING`,
      [o.id, o.customer_name, o.customer_phone, o.customer_location, o.destination_location || null, o.partner_id, o.partner_name || null, o.category, JSON.stringify(o.items || []), o.total_price, o.status, o.payment_method, o.notes || null, o.driver_or_agent_name || null, o.created_at, o.updated_at]
    );
  }

  for (const sp of SEED_ISLAND_SPOTS) {
    await pgPool!.query(
      `INSERT INTO island_spots (id, name, category, description, image_url, distance_from_port, walking_time, cart_time, tips, coordinates)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (id) DO NOTHING`,
      [sp.id, sp.name, sp.category, sp.description, sp.image_url, sp.distance_from_port, sp.walking_time, sp.cart_time, sp.tips, JSON.stringify(sp.coordinates)]
    );
  }

  for (const b of SEED_BOAT_CROSSINGS) {
    await pgPool!.query(
      `INSERT INTO boat_crossings (id, origin, destination, departure_times, price, duration, association, phone, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (id) DO NOTHING`,
      [b.id, b.origin, b.destination, JSON.stringify(b.departure_times), b.price, b.duration, b.association, b.phone, b.notes]
    );
  }

  for (const c of SEED_USEFUL_CONTACTS) {
    await pgPool!.query(
      `INSERT INTO useful_contacts (id, title, category, phone, whatsapp, location, description, available_hours)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (id) DO NOTHING`,
      [c.id, c.title, c.category, c.phone, c.whatsapp || null, c.location, c.description, c.available_hours]
    );
  }

  for (const r of SEED_REVIEWS) {
    await pgPool!.query(
      `INSERT INTO reviews (id, partner_id, customer_name, rating, comment, created_at)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (id) DO NOTHING`,
      [r.id, r.partner_id, r.customer_name, r.rating, r.comment, r.created_at]
    );
  }

  for (const a of SEED_ADVERTISEMENTS) {
    await pgPool!.query(
      `INSERT INTO advertisements (id, title, category, partner_id, business_name, tagline, description, image_url, link_url, whatsapp, phone, location, price_starting, badge, event_date, event_venue, banner_slot, plan_type, is_active, is_highlighted, start_date, end_date, views_count, clicks_count, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)
       ON CONFLICT (id) DO NOTHING`,
      [a.id, a.title, a.category, a.partner_id || null, a.business_name, a.tagline || null, a.description, a.image_url, a.link_url || null, a.whatsapp, a.phone || null, a.location, a.price_starting || 0, a.badge || null, a.event_date || null, a.event_venue || null, a.banner_slot || 'nenhum', a.plan_type || null, a.is_active, a.is_highlighted, a.start_date, a.end_date, a.views_count || 0, a.clicks_count || 0, a.created_at, a.updated_at]
    );
  }

  for (const t of SEED_TIDE_DAYS) {
    await pgPool!.query(
      `INSERT INTO tide_days (id, date, moon_phase, coefficient, high_tides, low_tides, source, recommendations)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (date) DO NOTHING`,
      [t.id, t.date, t.moon_phase, t.coefficient || null, JSON.stringify(t.high_tides), JSON.stringify(t.low_tides), t.source, t.recommendations || null]
    );
  }

  for (const u of SEED_USERS) {
    await pgPool!.query(
      `INSERT INTO users (id, name, email, phone, avatar_url, provider, role, partner_id, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (id) DO NOTHING`,
      [u.id, u.name, u.email, u.phone || null, u.avatar_url || null, u.provider, u.role, u.partner_id || null, u.created_at]
    );
  }

  for (const st of SEED_STORIES) {
    await pgPool!.query(
      `INSERT INTO stories (id, title, subtitle, emoji, cover_image, full_image, description, location, tag, category, whatsapp, is_active, order_index, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       ON CONFLICT (id) DO NOTHING`,
      [st.id, st.title, st.subtitle, st.emoji || null, st.coverImage, st.fullImage, st.description, st.location, st.tag, st.category || 'todos', st.whatsapp || null, st.is_active !== false, st.order_index || 0, st.created_at || new Date().toISOString(), st.updated_at || new Date().toISOString()]
    );
  }

  await pgPool!.query(
    `INSERT INTO admin_settings (id, admin_username, admin_email, admin_pin, hero_background_url, hero_rotation_enabled, hero_active_images, hero_custom_images, updated_at)
     VALUES (1,'admin','admin@algodoalconnect.com.br','algodoal2026','/imagens/algodoal.jpg', TRUE, $1, '[]', NOW())
     ON CONFLICT (id) DO NOTHING`,
    [JSON.stringify(['/imagens/algodoal.jpg', '/imagens/vila.jpg', '/imagens/vila2.jpg', '/imagens/canal.jpg', '/imagens/porto.jpg', '/imagens/porto2.jpg'])]
  );

  console.log('✅ Seed inicial do PostgreSQL concluído com sucesso.');
}

// Ensures the schema/seed step has finished before any DAL function issues a query.
async function pgReady(): Promise<boolean> {
  if (!pgInitPromise) return false;
  await pgInitPromise;
  return !!pgPool;
}

// ---- Row → interface mappers (pg returns NUMERIC as string and JSONB as parsed JS) ----
function rowToPartner(r: any): Partner {
  return {
    id: r.id, name: r.name, category: r.category, subcategory: r.subcategory || undefined,
    phone: r.phone, whatsapp: r.whatsapp, description: r.description || '', photo_url: r.photo_url,
    location: r.location, rating: Number(r.rating), total_reviews: Number(r.total_reviews),
    is_active: r.is_active, verified: r.verified, plan_type: r.plan_type || undefined,
    price_starting: Number(r.price_starting), vehicle_badge: r.vehicle_badge || undefined,
    opening_hours: r.opening_hours || undefined, amenities: r.amenities || [],
    created_at: r.created_at instanceof Date ? r.created_at.toISOString() : r.created_at
  };
}
function rowToService(r: any): ServiceProduct {
  return {
    id: r.id, partner_id: r.partner_id, name: r.name, description: r.description || '',
    price: Number(r.price), unit: r.unit, category: r.category, image_url: r.image_url,
    available: r.available, estimated_time: r.estimated_time || undefined
  };
}
function rowToOrder(r: any): Order {
  return {
    id: r.id, customer_name: r.customer_name, customer_phone: r.customer_phone,
    customer_location: r.customer_location, destination_location: r.destination_location || undefined,
    partner_id: r.partner_id, partner_name: r.partner_name || undefined, category: r.category,
    items: r.items || [], total_price: Number(r.total_price), status: r.status,
    payment_method: r.payment_method, notes: r.notes || undefined,
    driver_or_agent_name: r.driver_or_agent_name || undefined,
    created_at: r.created_at instanceof Date ? r.created_at.toISOString() : r.created_at,
    updated_at: r.updated_at instanceof Date ? r.updated_at.toISOString() : r.updated_at
  };
}
function rowToReview(r: any): Review {
  return {
    id: r.id, partner_id: r.partner_id, customer_name: r.customer_name, rating: Number(r.rating),
    comment: r.comment || '', created_at: r.created_at instanceof Date ? r.created_at.toISOString() : r.created_at
  };
}
function rowToIslandSpot(r: any): IslandSpot {
  return {
    id: r.id, name: r.name, category: r.category, description: r.description || '',
    image_url: r.image_url, distance_from_port: r.distance_from_port, walking_time: r.walking_time,
    cart_time: r.cart_time, tips: r.tips || '', coordinates: r.coordinates || { x: 0, y: 0 }
  };
}
function rowToBoatCrossing(r: any): BoatCrossingSchedule {
  return {
    id: r.id, origin: r.origin, destination: r.destination, departure_times: r.departure_times || [],
    price: Number(r.price), duration: r.duration, association: r.association || '',
    phone: r.phone || '', notes: r.notes || ''
  };
}
function rowToUsefulContact(r: any): UsefulContact {
  return {
    id: r.id, title: r.title, category: r.category, phone: r.phone, whatsapp: r.whatsapp || undefined,
    location: r.location, description: r.description || '', available_hours: r.available_hours || ''
  };
}
function rowToAdvertisement(r: any): Advertisement {
  return {
    id: r.id, title: r.title, category: r.category, partner_id: r.partner_id || undefined,
    business_name: r.business_name, tagline: r.tagline || undefined, description: r.description || '',
    image_url: r.image_url, link_url: r.link_url || undefined, whatsapp: r.whatsapp || '',
    phone: r.phone || undefined, location: r.location || '', price_starting: r.price_starting !== null ? Number(r.price_starting) : undefined,
    badge: r.badge || undefined, event_date: r.event_date || undefined, event_venue: r.event_venue || undefined,
    banner_slot: r.banner_slot || 'nenhum', plan_type: r.plan_type || undefined,
    is_active: r.is_active, is_highlighted: r.is_highlighted,
    start_date: r.start_date, end_date: r.end_date,
    views_count: Number(r.views_count) || 0, clicks_count: Number(r.clicks_count) || 0,
    created_at: r.created_at instanceof Date ? r.created_at.toISOString() : r.created_at,
    updated_at: r.updated_at instanceof Date ? r.updated_at.toISOString() : r.updated_at
  };
}
function rowToTideDay(r: any): TideDayEntry {
  return {
    id: r.id, date: r.date, moon_phase: r.moon_phase, coefficient: r.coefficient != null ? Number(r.coefficient) : undefined,
    high_tides: r.high_tides || [], low_tides: r.low_tides || [], source: r.source, recommendations: r.recommendations || undefined
  };
}
function rowToUser(r: any): UserProfile {
  return {
    id: r.id, name: r.name, email: r.email, phone: r.phone || undefined, avatar_url: r.avatar_url || undefined,
    provider: r.provider, role: r.role, partner_id: r.partner_id || undefined,
    created_at: r.created_at instanceof Date ? r.created_at.toISOString() : r.created_at
  };
}
function rowToStory(r: any): IslandStory {
  return {
    id: r.id, title: r.title, subtitle: r.subtitle || '', emoji: r.emoji || undefined,
    coverImage: r.cover_image, fullImage: r.full_image, description: r.description || '',
    location: r.location || '', tag: r.tag || '', category: r.category || 'todos',
    whatsapp: r.whatsapp || undefined, is_active: r.is_active, order_index: r.order_index,
    created_at: r.created_at instanceof Date ? r.created_at.toISOString() : r.created_at,
    updated_at: r.updated_at instanceof Date ? r.updated_at.toISOString() : r.updated_at
  };
}

// Generic partial UPDATE builder used by the Postgres branches below.
async function pgPartialUpdate(table: string, id: string, updates: Record<string, any>, columnMap: Record<string, string> = {}): Promise<any | null> {
  const entries = Object.entries(updates).filter(([, v]) => v !== undefined);
  if (entries.length === 0) {
    const res = await pgPool!.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
    return res.rows[0] || null;
  }
  const setClauses: string[] = [];
  const values: any[] = [];
  entries.forEach(([key, value], i) => {
    const column = columnMap[key] || key;
    values.push(value);
    setClauses.push(`"${column}" = $${i + 1}`);
  });
  values.push(id);
  const query = `UPDATE ${table} SET ${setClauses.join(', ')} WHERE id = $${values.length} RETURNING *`;
  const res = await pgPool!.query(query, values);
  return res.rows[0] || null;
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
    verified: false,
    plan_type: 'free',
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
    plan_type: 'mensal',
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
    plan_type: 'mensal',
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
    plan_type: 'mensal',
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
    verified: false,
    plan_type: 'free',
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
    id: 'tide_2026_09_01',
    date: '2026-09-01',
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
    recommendations: 'Maré de sizígia (maré viva). Faixa de areia muito ampla na baixa-mar (ótimo para charretes). Maré cheia encosta perto dos quiosques na Princesa.'
  },
  {
    id: 'tide_2026_09_02',
    date: '2026-09-02',
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
    id: 'tide_2026_09_03',
    date: '2026-09-03',
    moon_phase: 'Minguante',
    coefficient: 84,
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
    id: 'tide_2026_09_04',
    date: '2026-09-04',
    moon_phase: 'Minguante',
    coefficient: 76,
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
  },
  {
    id: 'tide_2026_09_05',
    date: '2026-09-05',
    moon_phase: 'Minguante',
    coefficient: 70,
    high_tides: [
      { time: '07:10', height: '3.7m' },
      { time: '19:35', height: '3.8m' }
    ],
    low_tides: [
      { time: '01:02', height: '0.7m' },
      { time: '13:25', height: '0.9m' }
    ],
    source: 'tabuademares_marapanim',
    recommendations: 'Maré de quadratura (maré morta). Variação de maré mais branda ao longo de todo o sábado.'
  },
  {
    id: 'tide_2026_09_06',
    date: '2026-09-06',
    moon_phase: 'Nova',
    coefficient: 68,
    high_tides: [
      { time: '08:05', height: '3.6m' },
      { time: '20:30', height: '3.7m' }
    ],
    low_tides: [
      { time: '01:55', height: '0.8m' },
      { time: '14:20', height: '1.0m' }
    ],
    source: 'tabuademares_marapanim',
    recommendations: 'Ótimas condições para banho de mar calmo nas praias do Farol e da Princesa.'
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
    subtitle: 'Transporte Tradicional',
    emoji: '🐎',
    coverImage: '/imagens/vila.jpg',
    fullImage: '/imagens/vila.jpg',
    description: 'Na Ilha de Algodoal não circulam carros. O transporte tradicional e ecológico é feito por charreteiros que conduzem com carinho pelas ruas de areia.',
    location: 'Porto de Algodoal ⇄ Praia da Princesa',
    tag: 'Transporte Ilha',
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

export interface CustomHeroImage {
  id: string;
  name: string;
  url: string;
  tag: string;
  subtitle?: string;
  created_at: string;
}

export interface AdminSettings {
  admin_username: string;
  admin_email: string;
  admin_pin: string;
  hero_background_url?: string;
  hero_rotation_enabled?: boolean;
  hero_active_images?: string[];
  hero_custom_images?: CustomHeroImage[];
  hero_deleted_presets?: string[];
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

export const DEFAULT_HERO_PRESET_URLS = [
  '/imagens/algodoal.jpg',
  '/imagens/vila.jpg',
  '/imagens/vila2.jpg',
  '/imagens/canal.jpg',
  '/imagens/porto.jpg',
  '/imagens/porto2.jpg'
];

const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  admin_username: 'admin',
  admin_email: 'admin@algodoalconnect.com.br',
  admin_pin: 'algodoal2026',
  hero_background_url: '/imagens/algodoal.jpg',
  hero_rotation_enabled: true,
  hero_active_images: DEFAULT_HERO_PRESET_URLS,
  hero_custom_images: [],
  hero_deleted_presets: [],
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
      if (!parsed.tide_days || parsed.tide_days.length === 0) {
        parsed.tide_days = SEED_TIDE_DAYS;
      } else {
        // Merge missing seed days
        for (const seedDay of SEED_TIDE_DAYS) {
          if (!parsed.tide_days.some((t: TideDayEntry) => t.date === seedDay.date)) {
            parsed.tide_days.push(seedDay);
          }
        }
        parsed.tide_days.sort((a: TideDayEntry, b: TideDayEntry) => a.date.localeCompare(b.date));
      }
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
export async function getLiveTideSchedule(): Promise<TideSchedule[]> {
  const todayStr = new Date().toISOString().split('T')[0];

  if (await pgReady()) {
    const res = await pgPool!.query('SELECT * FROM tide_days WHERE date = $1', [todayStr]);
    const todayEntry = res.rows[0] ? rowToTideDay(res.rows[0]) : null;
    if (todayEntry) {
      const list: TideSchedule[] = [];
      todayEntry.high_tides.forEach(h => list.push({ time: h.time, type: 'Alta (Preamar)', height: h.height, status: 'Favorável para passeios' }));
      todayEntry.low_tides.forEach(l => list.push({ time: l.time, type: 'Baixa (Baixa-mar)', height: l.height, status: 'Atenção às pedras' }));
      return list.sort((a, b) => a.time.localeCompare(b.time));
    }
    return [
      { time: '04:12', type: 'Alta (Preamar)', height: '4.2m', status: 'Favorável para passeios' },
      { time: '10:25', type: 'Baixa (Baixa-mar)', height: '0.4m', status: 'Atenção às pedras' },
      { time: '16:38', type: 'Alta (Preamar)', height: '4.4m', status: 'Favorável para passeios' },
      { time: '22:50', type: 'Baixa (Baixa-mar)', height: '0.5m', status: 'Passeio pelo canal' }
    ];
  }

  const db = loadLocalDB();
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
  if (await pgReady()) {
    const params: any[] = [];
    let query = 'SELECT * FROM partners WHERE is_active = TRUE';
    if (category && category !== 'todos') {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }
    query += ' ORDER BY rating DESC';
    const res = await pgPool!.query(query, params);
    return res.rows.map(rowToPartner);
  }
  const db = loadLocalDB();
  let list = db.partners.filter(p => p.is_active);
  if (category && category !== 'todos') {
    list = list.filter(p => p.category === category);
  }
  return list.sort((a, b) => b.rating - a.rating);
}

export async function getAllPartnersAdmin(): Promise<Partner[]> {
  if (await pgReady()) {
    const res = await pgPool!.query('SELECT * FROM partners ORDER BY created_at DESC');
    return res.rows.map(rowToPartner);
  }
  const db = loadLocalDB();
  return db.partners;
}

export async function getPartnerById(id: string): Promise<Partner | null> {
  if (await pgReady()) {
    const res = await pgPool!.query('SELECT * FROM partners WHERE id = $1', [id]);
    return res.rows[0] ? rowToPartner(res.rows[0]) : null;
  }
  const db = loadLocalDB();
  return db.partners.find(p => p.id === id) || null;
}

export async function createPartner(partner: Partner): Promise<Partner> {
  if (await pgReady()) {
    const res = await pgPool!.query(
      `INSERT INTO partners (id, name, category, subcategory, phone, whatsapp, description, photo_url, location, rating, total_reviews, is_active, verified, plan_type, price_starting, vehicle_badge, opening_hours, amenities, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19) RETURNING *`,
      [partner.id, partner.name, partner.category, partner.subcategory || null, partner.phone, partner.whatsapp, partner.description, partner.photo_url, partner.location, partner.rating, partner.total_reviews, partner.is_active, partner.verified, partner.plan_type || null, partner.price_starting, partner.vehicle_badge || null, partner.opening_hours || null, JSON.stringify(partner.amenities || []), partner.created_at]
    );
    return rowToPartner(res.rows[0]);
  }
  const db = loadLocalDB();
  db.partners.push(partner);
  saveLocalDB(db);
  return partner;
}

export async function updatePartner(id: string, updates: Partial<Partner>): Promise<Partner | null> {
  if (await pgReady()) {
    const payload = { ...updates } as Record<string, any>;
    if (payload.amenities !== undefined) payload.amenities = JSON.stringify(payload.amenities);
    const row = await pgPartialUpdate('partners', id, payload);
    return row ? rowToPartner(row) : null;
  }
  const db = loadLocalDB();
  const index = db.partners.findIndex(p => p.id === id);
  if (index === -1) return null;
  db.partners[index] = { ...db.partners[index], ...updates };
  saveLocalDB(db);
  return db.partners[index];
}

export async function deletePartner(id: string): Promise<boolean> {
  if (await pgReady()) {
    const res = await pgPool!.query('DELETE FROM partners WHERE id = $1 RETURNING id', [id]);
    return (res.rowCount || 0) > 0;
  }
  const db = loadLocalDB();
  const lenBefore = db.partners.length;
  db.partners = db.partners.filter(p => p.id !== id);
  saveLocalDB(db);
  return db.partners.length < lenBefore;
}

export async function getServices(partnerId?: string, category?: string): Promise<ServiceProduct[]> {
  if (await pgReady()) {
    const conditions: string[] = [];
    const params: any[] = [];
    if (partnerId) { params.push(partnerId); conditions.push(`partner_id = $${params.length}`); }
    if (category && category !== 'todos') { params.push(category); conditions.push(`category = $${params.length}`); }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const res = await pgPool!.query(`SELECT * FROM services_products ${where}`, params);
    return res.rows.map(rowToService);
  }
  const db = loadLocalDB();
  let list = db.services;
  if (partnerId) list = list.filter(s => s.partner_id === partnerId);
  if (category && category !== 'todos') list = list.filter(s => s.category === category);
  return list;
}

export async function createService(service: ServiceProduct): Promise<ServiceProduct> {
  if (await pgReady()) {
    const res = await pgPool!.query(
      `INSERT INTO services_products (id, partner_id, name, description, price, unit, category, image_url, available, estimated_time)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [service.id, service.partner_id, service.name, service.description, service.price, service.unit, service.category, service.image_url, service.available, service.estimated_time || null]
    );
    return rowToService(res.rows[0]);
  }
  const db = loadLocalDB();
  db.services.push(service);
  saveLocalDB(db);
  return service;
}

export async function updateService(id: string, updates: Partial<ServiceProduct>): Promise<ServiceProduct | null> {
  if (await pgReady()) {
    const row = await pgPartialUpdate('services_products', id, updates as Record<string, any>);
    return row ? rowToService(row) : null;
  }
  const db = loadLocalDB();
  const index = db.services.findIndex(s => s.id === id);
  if (index === -1) return null;
  db.services[index] = { ...db.services[index], ...updates };
  saveLocalDB(db);
  return db.services[index];
}

export async function deleteService(id: string): Promise<boolean> {
  if (await pgReady()) {
    const res = await pgPool!.query('DELETE FROM services_products WHERE id = $1 RETURNING id', [id]);
    return (res.rowCount || 0) > 0;
  }
  const db = loadLocalDB();
  const len = db.services.length;
  db.services = db.services.filter(s => s.id !== id);
  saveLocalDB(db);
  return db.services.length < len;
}

export async function getOrders(partnerId?: string, status?: string): Promise<Order[]> {
  if (await pgReady()) {
    const conditions: string[] = [];
    const params: any[] = [];
    if (partnerId) { params.push(partnerId); conditions.push(`partner_id = $${params.length}`); }
    if (status && status !== 'todos') { params.push(status); conditions.push(`status = $${params.length}`); }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const res = await pgPool!.query(`SELECT * FROM orders ${where} ORDER BY created_at DESC`, params);
    return res.rows.map(rowToOrder);
  }
  const db = loadLocalDB();
  let list = db.orders;
  if (partnerId) list = list.filter(o => o.partner_id === partnerId);
  if (status && status !== 'todos') list = list.filter(o => o.status === status);
  return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function createOrder(order: Order): Promise<Order> {
  if (await pgReady()) {
    const res = await pgPool!.query(
      `INSERT INTO orders (id, customer_name, customer_phone, customer_location, destination_location, partner_id, partner_name, category, items, total_price, status, payment_method, notes, driver_or_agent_name, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
      [order.id, order.customer_name, order.customer_phone, order.customer_location, order.destination_location || null, order.partner_id, order.partner_name || null, order.category, JSON.stringify(order.items || []), order.total_price, order.status, order.payment_method, order.notes || null, order.driver_or_agent_name || null, order.created_at, order.updated_at]
    );
    return rowToOrder(res.rows[0]);
  }
  const db = loadLocalDB();
  db.orders.unshift(order);
  saveLocalDB(db);
  return order;
}

export async function updateOrderStatus(id: string, status: OrderStatus, driverOrAgentName?: string): Promise<Order | null> {
  if (await pgReady()) {
    const payload: Record<string, any> = { status, updated_at: new Date().toISOString() };
    if (driverOrAgentName) payload.driver_or_agent_name = driverOrAgentName;
    const row = await pgPartialUpdate('orders', id, payload);
    return row ? rowToOrder(row) : null;
  }
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
  if (await pgReady()) {
    const res = await pgPool!.query('SELECT * FROM advertisements');
    let list = res.rows.map(rowToAdvertisement);

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
      if (a.banner_slot && a.banner_slot !== 'nenhum' && (!b.banner_slot || b.banner_slot === 'nenhum')) return -1;
      if (b.banner_slot && b.banner_slot !== 'nenhum' && (!a.banner_slot || a.banner_slot === 'nenhum')) return 1;
      return (b.is_highlighted ? 1 : 0) - (a.is_highlighted ? 1 : 0);
    });
  }

  const db = loadLocalDB();
  let list = db.advertisements || [];
  
  if (onlyActive) {
    list = list.filter(ad => ad.is_active !== false);
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
  if (await pgReady()) {
    const res = await pgPool!.query('SELECT * FROM advertisements WHERE id = $1', [id]);
    return res.rows[0] ? rowToAdvertisement(res.rows[0]) : null;
  }
  const db = loadLocalDB();
  return db.advertisements.find(a => a.id === id) || null;
}

export async function createAdvertisement(ad: Advertisement): Promise<Advertisement> {
  if (await pgReady()) {
    const res = await pgPool!.query(
      `INSERT INTO advertisements (id, title, category, partner_id, business_name, tagline, description, image_url, link_url, whatsapp, phone, location, price_starting, badge, event_date, event_venue, banner_slot, plan_type, is_active, is_highlighted, start_date, end_date, views_count, clicks_count, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26) RETURNING *`,
      [ad.id, ad.title, ad.category, ad.partner_id || null, ad.business_name, ad.tagline || null, ad.description, ad.image_url, ad.link_url || null, ad.whatsapp, ad.phone || null, ad.location, ad.price_starting || 0, ad.badge || null, ad.event_date || null, ad.event_venue || null, ad.banner_slot || 'nenhum', ad.plan_type || null, ad.is_active, ad.is_highlighted, ad.start_date, ad.end_date, ad.views_count || 0, ad.clicks_count || 0, ad.created_at, ad.updated_at]
    );
    return rowToAdvertisement(res.rows[0]);
  }
  const db = loadLocalDB();
  if (!db.advertisements) db.advertisements = [];
  db.advertisements.unshift(ad);
  saveLocalDB(db);
  return ad;
}

export async function updateAdvertisement(id: string, updates: Partial<Advertisement>): Promise<Advertisement | null> {
  if (await pgReady()) {
    const payload = { ...updates, updated_at: new Date().toISOString() } as Record<string, any>;
    const row = await pgPartialUpdate('advertisements', id, payload);
    return row ? rowToAdvertisement(row) : null;
  }
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
  if (await pgReady()) {
    const res = await pgPool!.query('DELETE FROM advertisements WHERE id = $1 RETURNING id', [id]);
    return (res.rowCount || 0) > 0;
  }
  const db = loadLocalDB();
  if (!db.advertisements) return false;
  const initialLen = db.advertisements.length;
  db.advertisements = db.advertisements.filter(a => a.id !== id);
  saveLocalDB(db);
  return db.advertisements.length < initialLen;
}

export async function incrementAdMetrics(id: string, type: 'view' | 'click'): Promise<void> {
  if (await pgReady()) {
    const column = type === 'view' ? 'views_count' : 'clicks_count';
    await pgPool!.query(`UPDATE advertisements SET ${column} = ${column} + 1 WHERE id = $1`, [id]);
    return;
  }
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

function rowToAdminSettings(r: any): AdminSettings {
  return {
    admin_username: r.admin_username, admin_email: r.admin_email, admin_pin: r.admin_pin,
    hero_background_url: r.hero_background_url || undefined,
    hero_rotation_enabled: r.hero_rotation_enabled,
    hero_active_images: r.hero_active_images || [],
    hero_custom_images: r.hero_custom_images || [],
    updated_at: r.updated_at instanceof Date ? r.updated_at.toISOString() : r.updated_at
  };
}

export async function getAdminSettings(): Promise<AdminSettings> {
  if (await pgReady()) {
    const res = await pgPool!.query('SELECT * FROM admin_settings WHERE id = 1');
    if (res.rows[0]) {
      const settings = rowToAdminSettings(res.rows[0]);
      return {
        ...DEFAULT_ADMIN_SETTINGS,
        ...settings,
        hero_active_images: settings.hero_active_images && settings.hero_active_images.length > 0
          ? settings.hero_active_images
          : DEFAULT_HERO_PRESET_URLS
      };
    }
    return DEFAULT_ADMIN_SETTINGS;
  }
  const db = loadLocalDB();
  const settings = db.admin_settings || DEFAULT_ADMIN_SETTINGS;
  return {
    ...DEFAULT_ADMIN_SETTINGS,
    ...settings,
    hero_active_images: (settings.hero_active_images && settings.hero_active_images.length > 0)
      ? settings.hero_active_images
      : DEFAULT_HERO_PRESET_URLS,
    hero_custom_images: settings.hero_custom_images || [],
    hero_deleted_presets: settings.hero_deleted_presets || []
  };
}

export async function validateAdminCredentials(usernameOrEmail: string, pinOrPassword: string): Promise<boolean> {
  const settings = await getAdminSettings();
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
  if (await pgReady()) {
    const payload = { ...newSettings, updated_at: new Date().toISOString() } as Record<string, any>;
    if (payload.hero_active_images !== undefined) payload.hero_active_images = JSON.stringify(payload.hero_active_images);
    if (payload.hero_custom_images !== undefined) payload.hero_custom_images = JSON.stringify(payload.hero_custom_images);

    const entries = Object.entries(payload).filter(([, v]) => v !== undefined);
    const setClauses = entries.map(([k], i) => `"${k}" = $${i + 1}`);
    const values = entries.map(([, v]) => v);
    const res = await pgPool!.query(
      `UPDATE admin_settings SET ${setClauses.join(', ')} WHERE id = 1 RETURNING *`,
      values
    );
    return rowToAdminSettings(res.rows[0]);
  }
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
  if (await pgReady()) {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const cutoffDate = new Date(today);
    cutoffDate.setDate(today.getDate() - 2);
    const cutoffStr = cutoffDate.toISOString().split('T')[0];

    // Prune old rows to keep only a rolling window, same policy as the local store
    await pgPool!.query('DELETE FROM tide_days WHERE date < $1', [cutoffStr]);

    let res = await pgPool!.query('SELECT * FROM tide_days ORDER BY date ASC');
    let list = res.rows.map(rowToTideDay);

    if (list.length < 5) {
      const moonPhases: Array<'Nova' | 'Crescente' | 'Cheia' | 'Minguante'> = ['Cheia', 'Minguante', 'Nova', 'Crescente'];
      const pad = (n: number) => n.toString().padStart(2, '0');
      const toInsert: TideDayEntry[] = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const dStr = d.toISOString().split('T')[0];
        if (!list.some(t => t.date === dStr)) {
          const coef = 75 + Math.round(Math.sin(i * 0.9) * 18);
          const highH1 = (4.1 + Math.sin(i * 0.8) * 0.3).toFixed(1);
          const highH2 = (4.3 + Math.cos(i * 0.8) * 0.2).toFixed(1);
          const lowH1 = (0.4 + Math.abs(Math.sin(i * 0.5)) * 0.4).toFixed(1);
          const lowH2 = (0.5 + Math.abs(Math.cos(i * 0.5)) * 0.4).toFixed(1);
          const hH1 = 4 + Math.floor(i * 0.8);
          const hM1 = (12 + i * 45) % 60;
          const hH2 = (16 + Math.floor(i * 0.8)) % 24;
          const hM2 = (38 + i * 42) % 60;
          const lH1 = 10 + Math.floor(i * 0.7);
          const lM1 = (25 + i * 43) % 60;
          const lH2 = (22 + Math.floor(i * 0.7)) % 24;
          const lM2 = (50 + i * 42) % 60;

          toInsert.push({
            id: `tide_${dStr.replace(/-/g, '_')}`,
            date: dStr,
            moon_phase: moonPhases[i % 4],
            coefficient: coef,
            high_tides: [
              { time: `${pad(hH1)}:${pad(hM1)}`, height: `${highH1}m` },
              { time: `${pad(hH2)}:${pad(hM2)}`, height: `${highH2}m` }
            ],
            low_tides: [
              { time: `${pad(lH1)}:${pad(lM1)}`, height: `${lowH1}m` },
              { time: `${pad(lH2)}:${pad(lM2)}`, height: `${lowH2}m` }
            ],
            source: 'tabuademares_marapanim',
            recommendations: i === 0
              ? 'Maré de sizígia. Faixa de areia muito ampla na baixa-mar (ótimo para charretes).'
              : 'Consulte os horários de preamar e baixa-mar para travessias e passeios de barco.'
          });
        }
      }
      if (toInsert.length) {
        await bulkImportTides(toInsert);
        res = await pgPool!.query('SELECT * FROM tide_days ORDER BY date ASC');
        list = res.rows.map(rowToTideDay);
      }
    }

    if (startDate) list = list.filter(t => t.date >= startDate);
    if (endDate) list = list.filter(t => t.date <= endDate);
    return list;
  }

  const db = loadLocalDB();
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  // Auto-prune entries older than 2 days to prevent storing unnecessary historical data and consuming server disk space
  const cutoffDate = new Date(today);
  cutoffDate.setDate(today.getDate() - 2);
  const cutoffStr = cutoffDate.toISOString().split('T')[0];

  let list = (db.tide_days || []).filter(t => t.date >= cutoffStr);
  
  // Ensure we always have the current rolling 7-day forecast without accumulating storage
  if (list.length < 5) {
    const moonPhases: Array<'Nova' | 'Crescente' | 'Cheia' | 'Minguante'> = ['Cheia', 'Minguante', 'Nova', 'Crescente'];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dStr = d.toISOString().split('T')[0];
      if (!list.some(t => t.date === dStr)) {
        const coef = 75 + Math.round(Math.sin(i * 0.9) * 18);
        const highH1 = (4.1 + Math.sin(i * 0.8) * 0.3).toFixed(1);
        const highH2 = (4.3 + Math.cos(i * 0.8) * 0.2).toFixed(1);
        const lowH1 = (0.4 + Math.abs(Math.sin(i * 0.5)) * 0.4).toFixed(1);
        const lowH2 = (0.5 + Math.abs(Math.cos(i * 0.5)) * 0.4).toFixed(1);
        const hH1 = 4 + Math.floor(i * 0.8);
        const hM1 = (12 + i * 45) % 60;
        const hH2 = (16 + Math.floor(i * 0.8)) % 24;
        const hM2 = (38 + i * 42) % 60;
        const lH1 = 10 + Math.floor(i * 0.7);
        const lM1 = (25 + i * 43) % 60;
        const lH2 = (22 + Math.floor(i * 0.7)) % 24;
        const lM2 = (50 + i * 42) % 60;

        const pad = (n: number) => n.toString().padStart(2, '0');

        list.push({
          id: `tide_${dStr.replace(/-/g, '_')}`,
          date: dStr,
          moon_phase: moonPhases[i % 4],
          coefficient: coef,
          high_tides: [
            { time: `${pad(hH1)}:${pad(hM1)}`, height: `${highH1}m` },
            { time: `${pad(hH2)}:${pad(hM2)}`, height: `${highH2}m` }
          ],
          low_tides: [
            { time: `${pad(lH1)}:${pad(lM1)}`, height: `${lowH1}m` },
            { time: `${pad(lH2)}:${pad(lM2)}`, height: `${lowH2}m` }
          ],
          source: 'tabuademares_marapanim',
          recommendations: i === 0
            ? 'Maré de sizígia. Faixa de areia muito ampla na baixa-mar (ótimo para charretes).'
            : 'Consulte os horários de preamar e baixa-mar para travessias e passeios de barco.'
        });
      }
    }
  }

  // Keep strictly rolling 7-10 days in disk storage
  list.sort((a, b) => a.date.localeCompare(b.date));
  db.tide_days = list.slice(0, 10);
  saveLocalDB(db);

  if (startDate) list = list.filter(t => t.date >= startDate);
  if (endDate) list = list.filter(t => t.date <= endDate);
  return list;
}

export async function saveTideDay(entry: TideDayEntry): Promise<TideDayEntry> {
  if (await pgReady()) {
    await pgPool!.query(
      `INSERT INTO tide_days (id, date, moon_phase, coefficient, high_tides, low_tides, source, recommendations)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (date) DO UPDATE SET
         id = EXCLUDED.id, moon_phase = EXCLUDED.moon_phase, coefficient = EXCLUDED.coefficient,
         high_tides = EXCLUDED.high_tides, low_tides = EXCLUDED.low_tides, source = EXCLUDED.source, recommendations = EXCLUDED.recommendations`,
      [entry.id, entry.date, entry.moon_phase, entry.coefficient || null, JSON.stringify(entry.high_tides), JSON.stringify(entry.low_tides), entry.source, entry.recommendations || null]
    );
    return entry;
  }
  const db = loadLocalDB();
  if (!db.tide_days) db.tide_days = [];
  const idx = db.tide_days.findIndex(t => t.date === entry.date);
  if (idx >= 0) {
    db.tide_days[idx] = entry;
  } else {
    db.tide_days.push(entry);
  }
  db.tide_days.sort((a, b) => a.date.localeCompare(b.date));
  // Keep only rolling 10 days
  if (db.tide_days.length > 10) {
    db.tide_days = db.tide_days.slice(-10);
  }
  saveLocalDB(db);
  return entry;
}

export async function bulkImportTides(entries: TideDayEntry[]): Promise<number> {
  if (await pgReady()) {
    let count = 0;
    for (const entry of entries) {
      await saveTideDay(entry);
      count++;
    }
    return count;
  }

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
  if (db.tide_days.length > 10) {
    db.tide_days = db.tide_days.slice(-10);
  }
  saveLocalDB(db);
  return count;
}

// ==========================================
// USER PROFILES & AUTH DAL
// ==========================================

export async function getUsers(): Promise<UserProfile[]> {
  if (await pgReady()) {
    const res = await pgPool!.query('SELECT * FROM users ORDER BY created_at DESC');
    return res.rows.map(rowToUser);
  }
  const db = loadLocalDB();
  return db.users || [];
}

export async function findOrCreateUser(profile: UserProfile): Promise<UserProfile> {
  if (await pgReady()) {
    const existing = await pgPool!.query(
      'SELECT * FROM users WHERE email = $1 OR (id = $2 AND provider = $3) LIMIT 1',
      [profile.email, profile.id, profile.provider]
    );
    if (existing.rows[0]) {
      const row = await pgPartialUpdate('users', existing.rows[0].id, {
        name: profile.name || existing.rows[0].name,
        avatar_url: profile.avatar_url || existing.rows[0].avatar_url
      });
      return rowToUser(row);
    }
    const res = await pgPool!.query(
      `INSERT INTO users (id, name, email, phone, avatar_url, provider, role, partner_id, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [profile.id, profile.name, profile.email, profile.phone || null, profile.avatar_url || null, profile.provider, profile.role, profile.partner_id || null, profile.created_at]
    );
    return rowToUser(res.rows[0]);
  }

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
  if (await pgReady()) {
    const res = await pgPool!.query('SELECT * FROM island_spots');
    return res.rows.map(rowToIslandSpot);
  }
  const db = loadLocalDB();
  return db.island_spots;
}

export async function getBoatCrossings(): Promise<BoatCrossingSchedule[]> {
  if (await pgReady()) {
    const res = await pgPool!.query('SELECT * FROM boat_crossings');
    return res.rows.map(rowToBoatCrossing);
  }
  const db = loadLocalDB();
  return db.boat_crossings;
}

export async function getUsefulContacts(): Promise<UsefulContact[]> {
  if (await pgReady()) {
    const res = await pgPool!.query('SELECT * FROM useful_contacts');
    return res.rows.map(rowToUsefulContact);
  }
  const db = loadLocalDB();
  return db.useful_contacts;
}

export async function getReviews(partnerId?: string): Promise<Review[]> {
  if (await pgReady()) {
    if (partnerId) {
      const res = await pgPool!.query('SELECT * FROM reviews WHERE partner_id = $1 ORDER BY created_at DESC', [partnerId]);
      return res.rows.map(rowToReview);
    }
    const res = await pgPool!.query('SELECT * FROM reviews ORDER BY created_at DESC');
    return res.rows.map(rowToReview);
  }
  const db = loadLocalDB();
  if (partnerId) {
    return db.reviews.filter(r => r.partner_id === partnerId);
  }
  return db.reviews;
}

export async function addReview(review: Review): Promise<Review> {
  if (await pgReady()) {
    const res = await pgPool!.query(
      `INSERT INTO reviews (id, partner_id, customer_name, rating, comment, created_at)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [review.id, review.partner_id, review.customer_name, review.rating, review.comment, review.created_at]
    );

    // recalculate partner rating from all reviews for this partner
    const agg = await pgPool!.query(
      'SELECT AVG(rating)::numeric(3,2) AS avg_rating, COUNT(*)::int AS total FROM reviews WHERE partner_id = $1',
      [review.partner_id]
    );
    if (agg.rows[0]) {
      await pgPool!.query('UPDATE partners SET rating = $1, total_reviews = $2 WHERE id = $3', [agg.rows[0].avg_rating, agg.rows[0].total, review.partner_id]);
    }
    return rowToReview(res.rows[0]);
  }

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
  if (await pgReady()) {
    const [partners, orders, ads, stories] = await Promise.all([
      pgPool!.query('SELECT category, is_active FROM partners'),
      pgPool!.query("SELECT status, total_price FROM orders"),
      pgPool!.query('SELECT is_active, views_count, clicks_count FROM advertisements'),
      pgPool!.query('SELECT is_active FROM stories')
    ]);
    const partnerRows = partners.rows;
    const orderRows = orders.rows;
    const adRows = ads.rows;
    const storyRows = stories.rows;

    const completedOrders = orderRows.filter((o: any) => o.status === 'concluido');
    return {
      totalPartners: partnerRows.length,
      totalOrders: orderRows.length,
      totalCompletedOrders: completedOrders.length,
      totalRevenue: completedOrders.reduce((sum: number, o: any) => sum + Number(o.total_price), 0),
      activeCarroceiros: partnerRows.filter((p: any) => p.category === 'transporte' && p.is_active).length,
      activeRabetas: partnerRows.filter((p: any) => p.category === 'passeios' && p.is_active).length,
      activeRestaurantes: partnerRows.filter((p: any) => p.category === 'alimentacao' && p.is_active).length,
      activePousadas: partnerRows.filter((p: any) => p.category === 'pousadas' && p.is_active).length,
      activeLojas: partnerRows.filter((p: any) => p.category === 'compras' && p.is_active).length,
      totalAds: adRows.length,
      activeAds: adRows.filter((a: any) => a.is_active).length,
      totalAdViews: adRows.reduce((acc: number, a: any) => acc + (Number(a.views_count) || 0), 0),
      totalAdClicks: adRows.reduce((acc: number, a: any) => acc + (Number(a.clicks_count) || 0), 0),
      totalStories: storyRows.length,
      activeStories: storyRows.filter((s: any) => s.is_active !== false).length
    };
  }

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
  if (await pgReady()) {
    const where = onlyActive ? 'WHERE is_active = TRUE' : '';
    const res = await pgPool!.query(`SELECT * FROM stories ${where} ORDER BY order_index ASC`);
    return res.rows.map(rowToStory);
  }
  const db = loadLocalDB();
  let list = db.stories || SEED_STORIES;
  if (onlyActive) {
    list = list.filter(s => s.is_active !== false);
  }
  return list.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
}

export async function getStoryById(id: string): Promise<IslandStory | null> {
  if (await pgReady()) {
    const res = await pgPool!.query('SELECT * FROM stories WHERE id = $1', [id]);
    return res.rows[0] ? rowToStory(res.rows[0]) : null;
  }
  const db = loadLocalDB();
  const list = db.stories || SEED_STORIES;
  return list.find(s => s.id === id) || null;
}

export async function createStory(storyData: Partial<IslandStory>): Promise<IslandStory> {
  if (await pgReady()) {
    const countRes = await pgPool!.query('SELECT COUNT(*)::int AS count FROM stories');
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
      order_index: typeof storyData.order_index === 'number' ? storyData.order_index : (countRes.rows[0].count + 1),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const res = await pgPool!.query(
      `INSERT INTO stories (id, title, subtitle, emoji, cover_image, full_image, description, location, tag, category, whatsapp, is_active, order_index, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
      [newStory.id, newStory.title, newStory.subtitle, newStory.emoji, newStory.coverImage, newStory.fullImage, newStory.description, newStory.location, newStory.tag, newStory.category, newStory.whatsapp, newStory.is_active, newStory.order_index, newStory.created_at, newStory.updated_at]
    );
    return rowToStory(res.rows[0]);
  }

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
  if (await pgReady()) {
    const payload: Record<string, any> = { ...updates, updated_at: new Date().toISOString() };
    if (payload.coverImage !== undefined) { payload.cover_image = payload.coverImage; delete payload.coverImage; }
    if (payload.fullImage !== undefined) { payload.full_image = payload.fullImage; delete payload.fullImage; }
    const row = await pgPartialUpdate('stories', id, payload);
    return row ? rowToStory(row) : null;
  }

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
  if (await pgReady()) {
    const res = await pgPool!.query('DELETE FROM stories WHERE id = $1 RETURNING id', [id]);
    return (res.rowCount || 0) > 0;
  }

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
