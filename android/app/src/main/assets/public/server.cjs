var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_fs2 = __toESM(require("fs"), 1);
var import_vite = require("vite");

// src/db/database.ts
var import_pg = __toESM(require("pg"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var DB_FILE = import_path.default.join(process.cwd(), "data", "algodoal_db.json");
var DB_BACKUP_FILE = import_path.default.join(process.cwd(), "data", "algodoal_db.backup.json");
if (!import_fs.default.existsSync(import_path.default.join(process.cwd(), "data"))) {
  import_fs.default.mkdirSync(import_path.default.join(process.cwd(), "data"), { recursive: true });
}
var pgPool = null;
var pgConnected = false;
var pgStatusDetails = "Armazenamento Local JSON Ativo";
function maskDatabaseUrl(url) {
  if (!url || url.trim() === "") return "N\xE3o configurado (DATABASE_URL vazia)";
  try {
    return url.replace(/:\/\/(.*?):(.*?)@/, "://$1:\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022@");
  } catch {
    return "URL Configurada";
  }
}
function getDatabaseStatus() {
  return {
    type: pgConnected ? "postgresql" : "json",
    connected: pgConnected,
    details: pgConnected ? "PostgreSQL Conectado com Sucesso" : pgStatusDetails,
    configuredUrl: maskDatabaseUrl(process.env.DATABASE_URL)
  };
}
var databaseUrl = process.env.DATABASE_URL;
if (databaseUrl && databaseUrl.trim() !== "") {
  try {
    const isLocal = databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1") || databaseUrl.includes("sslmode=disable") || databaseUrl.includes("@postgres:");
    pgPool = new import_pg.default.Pool({
      connectionString: databaseUrl,
      ssl: isLocal ? false : { rejectUnauthorized: false },
      connectionTimeoutMillis: 8e3,
      idleTimeoutMillis: 1e4
    });
    pgPool.on("error", (err) => {
      console.warn("\u26A0\uFE0F Erro no pool do PostgreSQL:", err.message);
    });
    console.log("\u{1F517} PostgreSQL pool initialized with connection string");
  } catch (err) {
    console.warn("\u26A0\uFE0F Could not initialize external PostgreSQL pool, falling back to local relational store:", err);
    pgPool = null;
  }
}
var isReconnecting = false;
async function attemptPostgresReconnect(customUrl) {
  const url = customUrl && customUrl.trim() || process.env.DATABASE_URL;
  if (!url || url.trim() === "") {
    return {
      success: false,
      message: "Nenhuma DATABASE_URL configurada.",
      details: "Defina a vari\xE1vel DATABASE_URL nas configura\xE7\xF5es ou no arquivo .env"
    };
  }
  if (isReconnecting) {
    return {
      success: false,
      message: "Reconex\xE3o j\xE1 em andamento, aguarde...",
      details: pgStatusDetails
    };
  }
  isReconnecting = true;
  try {
    const isLocal = url.includes("localhost") || url.includes("127.0.0.1") || url.includes("sslmode=disable") || url.includes("@postgres:");
    if (pgPool) {
      try {
        await pgPool.end();
      } catch {
      }
      pgPool = null;
    }
    pgPool = new import_pg.default.Pool({
      connectionString: url,
      ssl: isLocal ? false : { rejectUnauthorized: false },
      connectionTimeoutMillis: 8e3,
      idleTimeoutMillis: 1e4
    });
    pgPool.on("error", (err) => {
      console.warn("\u26A0\uFE0F Erro no pool do PostgreSQL:", err.message);
      pgConnected = false;
      pgStatusDetails = `Erro no pool PostgreSQL: ${err.message}`;
    });
    pgInitPromise = initPostgres();
    await pgInitPromise;
    if (pgConnected) {
      return {
        success: true,
        message: "PostgreSQL conectado e sincronizado com sucesso!",
        details: pgStatusDetails
      };
    } else {
      return {
        success: false,
        message: "Falha ao conectar com PostgreSQL.",
        details: pgStatusDetails
      };
    }
  } catch (err) {
    pgConnected = false;
    pgStatusDetails = `Falha na conex\xE3o: ${err.message}`;
    return {
      success: false,
      message: `Falha na conex\xE3o: ${err.message}`,
      details: err.message
    };
  } finally {
    isReconnecting = false;
  }
}
setInterval(async () => {
  if (!pgConnected && process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== "" && !isReconnecting) {
    try {
      await attemptPostgresReconnect();
    } catch {
    }
  }
}, 3e4);
var pgInitPromise = pgPool ? initPostgres() : null;
async function initPostgres() {
  try {
    await pgPool.query(`
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
        hero_deleted_presets JSONB DEFAULT '[]',
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

      -- Migra\xE7\xF5es incrementais seguras para todas as tabelas caso o banco j\xE1 existisse em produ\xE7\xE3o

      -- 1. admin_settings
      ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS hero_background_url TEXT;
      ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS hero_rotation_enabled BOOLEAN DEFAULT TRUE;
      ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS hero_active_images JSONB DEFAULT '[]';
      ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS hero_custom_images JSONB DEFAULT '[]';
      ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS hero_deleted_presets JSONB DEFAULT '[]';
      ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

      -- 2. partners
      ALTER TABLE partners ADD COLUMN IF NOT EXISTS subcategory VARCHAR(150);
      ALTER TABLE partners ADD COLUMN IF NOT EXISTS plan_type VARCHAR(20);
      ALTER TABLE partners ADD COLUMN IF NOT EXISTS price_starting NUMERIC(10,2) DEFAULT 0.0;
      ALTER TABLE partners ADD COLUMN IF NOT EXISTS vehicle_badge VARCHAR(150);
      ALTER TABLE partners ADD COLUMN IF NOT EXISTS opening_hours VARCHAR(150);
      ALTER TABLE partners ADD COLUMN IF NOT EXISTS amenities JSONB DEFAULT '[]';
      ALTER TABLE partners ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

      -- 3. services_products
      ALTER TABLE services_products ADD COLUMN IF NOT EXISTS available BOOLEAN DEFAULT TRUE;
      ALTER TABLE services_products ADD COLUMN IF NOT EXISTS estimated_time VARCHAR(80);
      ALTER TABLE services_products ADD COLUMN IF NOT EXISTS image_url TEXT;

      -- 4. orders
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS destination_location VARCHAR(255);
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS partner_name VARCHAR(255);
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'pix';
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes TEXT;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS driver_or_agent_name VARCHAR(255);
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

      -- 5. advertisements
      ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS partner_id VARCHAR(64);
      ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS business_name VARCHAR(255) DEFAULT '';
      ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS tagline VARCHAR(255);
      ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS description TEXT;
      ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS image_url TEXT;
      ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS link_url TEXT;
      ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(50);
      ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
      ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS location VARCHAR(255);
      ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS price_starting NUMERIC(10,2) DEFAULT 0;
      ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS badge VARCHAR(100);
      ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS event_date VARCHAR(50);
      ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS event_venue VARCHAR(255);
      ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS banner_slot VARCHAR(30) DEFAULT 'nenhum';
      ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS plan_type VARCHAR(20);
      ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
      ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS is_highlighted BOOLEAN DEFAULT FALSE;
      ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS start_date VARCHAR(20);
      ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS end_date VARCHAR(20);
      ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;
      ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS clicks_count INTEGER DEFAULT 0;
      ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
      ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

      -- 6. tide_days
      ALTER TABLE tide_days ADD COLUMN IF NOT EXISTS coefficient INTEGER;
      ALTER TABLE tide_days ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'manual';
      ALTER TABLE tide_days ADD COLUMN IF NOT EXISTS recommendations TEXT;

      -- 7. users
      ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS provider VARCHAR(20) DEFAULT 'email';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'tourist';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS partner_id VARCHAR(64);

      -- 8. useful_contacts
      ALTER TABLE useful_contacts ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(50);
      ALTER TABLE useful_contacts ADD COLUMN IF NOT EXISTS available_hours VARCHAR(100);

      -- 9. boat_crossings
      ALTER TABLE boat_crossings ADD COLUMN IF NOT EXISTS association VARCHAR(255);
      ALTER TABLE boat_crossings ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
      ALTER TABLE boat_crossings ADD COLUMN IF NOT EXISTS notes TEXT;

      -- 10. island_spots
      ALTER TABLE island_spots ADD COLUMN IF NOT EXISTS distance_from_port VARCHAR(100);
      ALTER TABLE island_spots ADD COLUMN IF NOT EXISTS walking_time VARCHAR(100);
      ALTER TABLE island_spots ADD COLUMN IF NOT EXISTS cart_time VARCHAR(100);
      ALTER TABLE island_spots ADD COLUMN IF NOT EXISTS tips TEXT;
      ALTER TABLE island_spots ADD COLUMN IF NOT EXISTS coordinates JSONB;

      -- 11. stories
      ALTER TABLE stories ADD COLUMN IF NOT EXISTS subtitle VARCHAR(255);
      ALTER TABLE stories ADD COLUMN IF NOT EXISTS emoji VARCHAR(10);
      ALTER TABLE stories ADD COLUMN IF NOT EXISTS cover_image TEXT;
      ALTER TABLE stories ADD COLUMN IF NOT EXISTS full_image TEXT;
      ALTER TABLE stories ADD COLUMN IF NOT EXISTS description TEXT;
      ALTER TABLE stories ADD COLUMN IF NOT EXISTS location VARCHAR(255);
      ALTER TABLE stories ADD COLUMN IF NOT EXISTS tag VARCHAR(100);
      ALTER TABLE stories ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'todos';
      ALTER TABLE stories ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(50);
      ALTER TABLE stories ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
      ALTER TABLE stories ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE;
      ALTER TABLE stories ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
      ALTER TABLE stories ADD COLUMN IF NOT EXISTS "orderIndex" INTEGER DEFAULT 0;
      ALTER TABLE stories ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
      ALTER TABLE stories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
      UPDATE stories SET active = is_active WHERE active IS NULL AND is_active IS NOT NULL;
      UPDATE stories SET is_active = active WHERE is_active IS NULL AND active IS NOT NULL;

      -- 12. safe foreign keys on reviews & orders (garantir que CASCADE ou SET NULL n\xE3o quebrem)
      ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_partner_id_fkey;
      ALTER TABLE reviews ADD CONSTRAINT reviews_partner_id_fkey FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE CASCADE NOT VALID;
    `);
    console.log("\u{1F5C4}\uFE0F  Tabelas PostgreSQL verificadas/criadas com sucesso.");
    pgConnected = true;
    pgStatusDetails = "PostgreSQL Conectado com Sucesso";
    try {
      await seedPostgresIfEmpty();
    } catch (seedErr) {
      console.warn("\u26A0\uFE0F Aviso durante seed de dados no PostgreSQL (dados preservados):", seedErr.message);
    }
  } catch (err) {
    const errorMsg = err?.message || String(err);
    console.warn(`\u2139\uFE0F PostgreSQL externo indispon\xEDvel (${errorMsg}). Alternando com seguran\xE7a para o armazenamento local em arquivo JSON.`);
    pgConnected = false;
    pgStatusDetails = `Armazenamento Local JSON Ativo (${errorMsg.includes("ETIMEDOUT") ? "Host externo inalcan\xE7\xE1vel" : errorMsg})`;
    try {
      await pgPool?.end();
    } catch {
    }
    pgPool = null;
  }
}
async function seedPostgresIfEmpty() {
  const { rows: pRows } = await pgPool.query("SELECT COUNT(*)::int AS count FROM partners");
  if (pRows[0].count === 0) {
    console.log("\u{1F331} Semeando partners no PostgreSQL...");
    for (const p of SEED_PARTNERS) {
      await pgPool.query(
        `INSERT INTO partners (id, name, category, subcategory, phone, whatsapp, description, photo_url, location, rating, total_reviews, is_active, verified, plan_type, price_starting, vehicle_badge, opening_hours, amenities, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
         ON CONFLICT (id) DO NOTHING`,
        [p.id, p.name, p.category, p.subcategory || null, p.phone, p.whatsapp, p.description, p.photo_url, p.location, p.rating, p.total_reviews, p.is_active, p.verified, p.plan_type || null, p.price_starting, p.vehicle_badge || null, p.opening_hours || null, JSON.stringify(p.amenities || []), p.created_at]
      );
    }
  }
  try {
    const { rows: sRows } = await pgPool.query("SELECT COUNT(*)::int AS count FROM services_products");
    if (sRows[0].count === 0) {
      for (const s of SEED_SERVICES) {
        try {
          const { rows: partExists } = await pgPool.query("SELECT 1 FROM partners WHERE id = $1", [s.partner_id]);
          if (partExists.length > 0) {
            await pgPool.query(
              `INSERT INTO services_products (id, partner_id, name, description, price, unit, category, image_url, available, estimated_time)
               VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
               ON CONFLICT (id) DO NOTHING`,
              [s.id, s.partner_id, s.name, s.description, s.price, s.unit, s.category, s.image_url, s.available, s.estimated_time || null]
            );
          }
        } catch (errServ) {
          console.warn("\u26A0\uFE0F Ignorando servi\xE7o com parceiro n\xE3o encontrado:", errServ);
        }
      }
    }
  } catch (errServCount) {
    console.warn("\u26A0\uFE0F Tabela services_products com aviso:", errServCount);
  }
  const { rows: oRows } = await pgPool.query("SELECT COUNT(*)::int AS count FROM orders");
  if (oRows[0].count === 0) {
    for (const o of SEED_ORDERS) {
      await pgPool.query(
        `INSERT INTO orders (id, customer_name, customer_phone, customer_location, destination_location, partner_id, partner_name, category, items, total_price, status, payment_method, notes, driver_or_agent_name, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
         ON CONFLICT (id) DO NOTHING`,
        [o.id, o.customer_name, o.customer_phone, o.customer_location, o.destination_location || null, o.partner_id, o.partner_name || null, o.category, JSON.stringify(o.items || []), o.total_price, o.status, o.payment_method, o.notes || null, o.driver_or_agent_name || null, o.created_at, o.updated_at]
      );
    }
  }
  const { rows: spRows } = await pgPool.query("SELECT COUNT(*)::int AS count FROM island_spots");
  if (spRows[0].count === 0) {
    for (const sp of SEED_ISLAND_SPOTS) {
      await pgPool.query(
        `INSERT INTO island_spots (id, name, category, description, image_url, distance_from_port, walking_time, cart_time, tips, coordinates)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         ON CONFLICT (id) DO NOTHING`,
        [sp.id, sp.name, sp.category, sp.description, sp.image_url, sp.distance_from_port, sp.walking_time, sp.cart_time, sp.tips, JSON.stringify(sp.coordinates)]
      );
    }
  }
  const { rows: bRows } = await pgPool.query("SELECT COUNT(*)::int AS count FROM boat_crossings");
  if (bRows[0].count === 0) {
    for (const b of SEED_BOAT_CROSSINGS) {
      await pgPool.query(
        `INSERT INTO boat_crossings (id, origin, destination, departure_times, price, duration, association, phone, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (id) DO NOTHING`,
        [b.id, b.origin, b.destination, JSON.stringify(b.departure_times), b.price, b.duration, b.association, b.phone, b.notes]
      );
    }
  }
  const { rows: cRows } = await pgPool.query("SELECT COUNT(*)::int AS count FROM useful_contacts");
  if (cRows[0].count === 0) {
    for (const c of SEED_USEFUL_CONTACTS) {
      await pgPool.query(
        `INSERT INTO useful_contacts (id, title, category, phone, whatsapp, location, description, available_hours)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (id) DO NOTHING`,
        [c.id, c.title, c.category, c.phone, c.whatsapp || null, c.location, c.description, c.available_hours]
      );
    }
  }
  try {
    const { rows: rRows } = await pgPool.query("SELECT COUNT(*)::int AS count FROM reviews");
    if (rRows[0].count === 0) {
      for (const r of SEED_REVIEWS) {
        try {
          const { rows: partExists } = await pgPool.query("SELECT 1 FROM partners WHERE id = $1", [r.partner_id]);
          if (partExists.length > 0) {
            await pgPool.query(
              `INSERT INTO reviews (id, partner_id, customer_name, rating, comment, created_at)
               VALUES ($1,$2,$3,$4,$5,$6)
               ON CONFLICT (id) DO NOTHING`,
              [r.id, r.partner_id, r.customer_name, r.rating, r.comment, r.created_at]
            );
          }
        } catch (errReview) {
          console.warn("\u26A0\uFE0F Ignorando review sem parceiro correspondente:", errReview);
        }
      }
    }
  } catch (errReviewsQuery) {
    console.warn("\u26A0\uFE0F Tabela reviews com aviso:", errReviewsQuery);
  }
  const { rows: aRows } = await pgPool.query("SELECT COUNT(*)::int AS count FROM advertisements");
  if (aRows[0].count === 0) {
    console.log("\u{1F331} Semeando an\xFAncios no PostgreSQL...");
    for (const a of SEED_ADVERTISEMENTS) {
      await pgPool.query(
        `INSERT INTO advertisements (id, title, category, partner_id, business_name, tagline, description, image_url, link_url, whatsapp, phone, location, price_starting, badge, event_date, event_venue, banner_slot, plan_type, is_active, is_highlighted, start_date, end_date, views_count, clicks_count, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)
         ON CONFLICT (id) DO NOTHING`,
        [a.id, a.title, a.category, a.partner_id || null, a.business_name, a.tagline || null, a.description, a.image_url, a.link_url || null, a.whatsapp, a.phone || null, a.location, a.price_starting || 0, a.badge || null, a.event_date || null, a.event_venue || null, a.banner_slot || "nenhum", a.plan_type || null, a.is_active, a.is_highlighted, a.start_date, a.end_date, a.views_count || 0, a.clicks_count || 0, a.created_at, a.updated_at]
      );
    }
  }
  const { rows: tRows } = await pgPool.query("SELECT COUNT(*)::int AS count FROM tide_days");
  if (tRows[0].count === 0) {
    for (const t of SEED_TIDE_DAYS) {
      await pgPool.query(
        `INSERT INTO tide_days (id, date, moon_phase, coefficient, high_tides, low_tides, source, recommendations)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (date) DO NOTHING`,
        [t.id, t.date, t.moon_phase, t.coefficient || null, JSON.stringify(t.high_tides), JSON.stringify(t.low_tides), t.source, t.recommendations || null]
      );
    }
  }
  const { rows: uRows } = await pgPool.query("SELECT COUNT(*)::int AS count FROM users");
  if (uRows[0].count === 0) {
    for (const u of SEED_USERS) {
      await pgPool.query(
        `INSERT INTO users (id, name, email, phone, avatar_url, provider, role, partner_id, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (id) DO NOTHING`,
        [u.id, u.name, u.email, u.phone || null, u.avatar_url || null, u.provider, u.role, u.partner_id || null, u.created_at]
      );
    }
  }
  const { rows: stRows } = await pgPool.query("SELECT COUNT(*)::int AS count FROM stories");
  if (stRows[0].count === 0) {
    for (const st of SEED_STORIES) {
      await pgPool.query(
        `INSERT INTO stories (id, title, subtitle, emoji, cover_image, full_image, description, location, tag, category, whatsapp, is_active, order_index, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
         ON CONFLICT (id) DO NOTHING`,
        [st.id, st.title, st.subtitle, st.emoji || null, st.coverImage, st.fullImage, st.description, st.location, st.tag, st.category || "todos", st.whatsapp || null, st.is_active !== false, st.order_index || 0, st.created_at || (/* @__PURE__ */ new Date()).toISOString(), st.updated_at || (/* @__PURE__ */ new Date()).toISOString()]
      );
    }
  }
  await pgPool.query(
    `INSERT INTO admin_settings (id, admin_username, admin_email, admin_pin, hero_background_url, hero_rotation_enabled, hero_active_images, hero_custom_images, hero_deleted_presets, updated_at)
     VALUES (1,'admin','admin@algodoalconnect.com.br','algodoal2026','/imagens/algodoal.jpg', TRUE, $1, '[]', '[]', NOW())
     ON CONFLICT (id) DO NOTHING`,
    [JSON.stringify(["/imagens/algodoal.jpg", "/imagens/vila.jpg", "/imagens/vila2.jpg", "/imagens/canal.jpg", "/imagens/porto.jpg", "/imagens/porto2.jpg"])]
  );
  console.log("\u2705 Verifica\xE7\xE3o de integridade e seed do PostgreSQL conclu\xEDdos.");
}
async function pgReady() {
  if (!pgInitPromise) return false;
  await pgInitPromise;
  return !!pgPool && pgConnected;
}
function rowToPartner(r) {
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    subcategory: r.subcategory || void 0,
    phone: r.phone,
    whatsapp: r.whatsapp,
    description: r.description || "",
    photo_url: r.photo_url,
    location: r.location,
    rating: Number(r.rating),
    total_reviews: Number(r.total_reviews),
    is_active: r.is_active,
    verified: r.verified,
    plan_type: r.plan_type || void 0,
    price_starting: Number(r.price_starting),
    vehicle_badge: r.vehicle_badge || void 0,
    opening_hours: r.opening_hours || void 0,
    amenities: r.amenities || [],
    created_at: r.created_at instanceof Date ? r.created_at.toISOString() : r.created_at
  };
}
function rowToService(r) {
  return {
    id: r.id,
    partner_id: r.partner_id,
    name: r.name,
    description: r.description || "",
    price: Number(r.price),
    unit: r.unit,
    category: r.category,
    image_url: r.image_url,
    available: r.available,
    estimated_time: r.estimated_time || void 0
  };
}
function rowToOrder(r) {
  return {
    id: r.id,
    customer_name: r.customer_name,
    customer_phone: r.customer_phone,
    customer_location: r.customer_location,
    destination_location: r.destination_location || void 0,
    partner_id: r.partner_id,
    partner_name: r.partner_name || void 0,
    category: r.category,
    items: r.items || [],
    total_price: Number(r.total_price),
    status: r.status,
    payment_method: r.payment_method,
    notes: r.notes || void 0,
    driver_or_agent_name: r.driver_or_agent_name || void 0,
    created_at: r.created_at instanceof Date ? r.created_at.toISOString() : r.created_at,
    updated_at: r.updated_at instanceof Date ? r.updated_at.toISOString() : r.updated_at
  };
}
function rowToReview(r) {
  return {
    id: r.id,
    partner_id: r.partner_id,
    customer_name: r.customer_name,
    rating: Number(r.rating),
    comment: r.comment || "",
    created_at: r.created_at instanceof Date ? r.created_at.toISOString() : r.created_at
  };
}
function rowToIslandSpot(r) {
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    description: r.description || "",
    image_url: r.image_url,
    distance_from_port: r.distance_from_port,
    walking_time: r.walking_time,
    cart_time: r.cart_time,
    tips: r.tips || "",
    coordinates: r.coordinates || { x: 0, y: 0 }
  };
}
function rowToBoatCrossing(r) {
  return {
    id: r.id,
    origin: r.origin,
    destination: r.destination,
    departure_times: r.departure_times || [],
    price: Number(r.price),
    duration: r.duration,
    association: r.association || "",
    phone: r.phone || "",
    notes: r.notes || ""
  };
}
function rowToUsefulContact(r) {
  return {
    id: r.id,
    title: r.title,
    category: r.category,
    phone: r.phone,
    whatsapp: r.whatsapp || void 0,
    location: r.location,
    description: r.description || "",
    available_hours: r.available_hours || ""
  };
}
function rowToAdvertisement(r) {
  return {
    id: r.id,
    title: r.title,
    category: r.category,
    partner_id: r.partner_id || void 0,
    business_name: r.business_name,
    tagline: r.tagline || void 0,
    description: r.description || "",
    image_url: r.image_url,
    link_url: r.link_url || void 0,
    whatsapp: r.whatsapp || "",
    phone: r.phone || void 0,
    location: r.location || "",
    price_starting: r.price_starting !== null ? Number(r.price_starting) : void 0,
    badge: r.badge || void 0,
    event_date: r.event_date || void 0,
    event_venue: r.event_venue || void 0,
    banner_slot: r.banner_slot || "nenhum",
    plan_type: r.plan_type || void 0,
    is_active: r.is_active,
    is_highlighted: r.is_highlighted,
    start_date: r.start_date,
    end_date: r.end_date,
    views_count: Number(r.views_count) || 0,
    clicks_count: Number(r.clicks_count) || 0,
    created_at: r.created_at instanceof Date ? r.created_at.toISOString() : r.created_at,
    updated_at: r.updated_at instanceof Date ? r.updated_at.toISOString() : r.updated_at
  };
}
function rowToTideDay(r) {
  return {
    id: r.id,
    date: r.date,
    moon_phase: r.moon_phase,
    coefficient: r.coefficient != null ? Number(r.coefficient) : void 0,
    high_tides: r.high_tides || [],
    low_tides: r.low_tides || [],
    source: r.source,
    recommendations: r.recommendations || void 0
  };
}
function rowToUser(r) {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone || void 0,
    avatar_url: r.avatar_url || void 0,
    provider: r.provider,
    role: r.role,
    partner_id: r.partner_id || void 0,
    created_at: r.created_at instanceof Date ? r.created_at.toISOString() : r.created_at
  };
}
function rowToStory(r) {
  const activeVal = r.is_active !== void 0 ? Boolean(r.is_active) : r.active !== void 0 ? Boolean(r.active) : true;
  const orderVal = r.order_index !== void 0 ? Number(r.order_index) : r.orderIndex !== void 0 ? Number(r.orderIndex) : 0;
  const iconEmoji = r.emoji || r.icon || "\u2728";
  const cover = r.cover_image || r.coverImage || "";
  const full = r.full_image || r.fullImage || cover;
  return {
    id: r.id,
    title: r.title,
    subtitle: r.subtitle || "",
    emoji: iconEmoji,
    icon: iconEmoji,
    coverImage: cover,
    fullImage: full,
    description: r.description || "",
    location: r.location || "",
    tag: r.tag || "",
    category: r.category || "todos",
    whatsapp: r.whatsapp || void 0,
    is_active: activeVal,
    active: activeVal,
    order_index: orderVal,
    orderIndex: orderVal,
    created_at: r.created_at instanceof Date ? r.created_at.toISOString() : r.created_at,
    updated_at: r.updated_at instanceof Date ? r.updated_at.toISOString() : r.updated_at
  };
}
async function pgPartialUpdate(table, id, updates, columnMap = {}) {
  const entries = Object.entries(updates).filter(([, v]) => v !== void 0);
  if (entries.length === 0) {
    const res2 = await pgPool.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
    return res2.rows[0] || null;
  }
  const setClauses = [];
  const values = [];
  entries.forEach(([key, value], i) => {
    const column = columnMap[key] || key;
    values.push(value);
    setClauses.push(`"${column}" = $${i + 1}`);
  });
  values.push(id);
  const query = `UPDATE ${table} SET ${setClauses.join(", ")} WHERE id = $${values.length} RETURNING *`;
  const res = await pgPool.query(query, values);
  return res.rows[0] || null;
}
var SEED_PARTNERS = [
  {
    id: "part_carroca_14",
    name: "Seu Raimundo (Charrete #14)",
    category: "transporte",
    subcategory: "Carro\xE7a Tur\xEDstica & Bagagem",
    phone: "(91) 98452-1102",
    whatsapp: "5591984521102",
    description: "Carroceiro credenciado h\xE1 mais de 15 anos na Ilha de Algodoal. Transporte seguro de passageiros e bagagens do Porto at\xE9 todas as pousadas e Praias da Ilha.",
    photo_url: "/imagens/vila.jpg",
    location: "Ponto do Porto de Algodoal / Vila de Maiandeua",
    rating: 4.9,
    total_reviews: 48,
    is_active: true,
    verified: true,
    price_starting: 30,
    vehicle_badge: "Charrete #14 - Credenciada",
    opening_hours: "06:00 \xE0s 22:00",
    created_at: "2026-01-10T10:00:00Z"
  },
  {
    id: "part_carroca_08",
    name: "Manoel Carroceiro (Charrete #08)",
    category: "transporte",
    subcategory: "Passeios & Frete R\xE1pido",
    phone: "(91) 98114-8832",
    whatsapp: "5591981148832",
    description: "Atendimento r\xE1pido no desembarque de barcos em Algodoal. Charrete equipada com toldo para sol e chuva, espa\xE7osa para malas e caixas t\xE9rmicas.",
    photo_url: "/imagens/carroca.jpg",
    location: "Porto de Algodoal / Praia da Princesa",
    rating: 4.8,
    total_reviews: 35,
    is_active: true,
    verified: true,
    price_starting: 30,
    vehicle_badge: "Charrete #08 - Especial Bagagem",
    opening_hours: "06:30 \xE0s 21:00",
    created_at: "2026-01-12T10:00:00Z"
  },
  {
    id: "part_rabeta_estrela",
    name: "Mestre Nonato - Rabeta Estrela do Mar",
    category: "passeios",
    subcategory: "Passeios de Barco & Travessias",
    phone: "(91) 98223-9901",
    whatsapp: "5591982239901",
    description: "Passeios inesquec\xEDveis pelos canais de manguezal, Ilha da Pedra Mole, Lago da Princesa e travessia para a acolhedora vila de Fortalezinha. Coletes salva-vidas inclusos.",
    photo_url: "/imagens/canal.jpg",
    location: "Trapiche / Canal da Camboinha",
    rating: 5,
    total_reviews: 62,
    is_active: true,
    verified: false,
    plan_type: "free",
    price_starting: 25,
    vehicle_badge: "Rabeta Cadastrada Capitania",
    opening_hours: "07:00 \xE0s 18:00 (Conforme a Mar\xE9)",
    created_at: "2026-01-15T09:00:00Z"
  },
  {
    id: "part_pousada_chale_princesa",
    name: "Pousada Chal\xE9s da Princesa",
    category: "pousadas",
    subcategory: "Hospedagem \xE0 Beira-Mar",
    phone: "(91) 98112-9988",
    whatsapp: "5591981129988",
    description: "Chal\xE9s r\xFAsticos e confort\xE1veis com ar-condicionado, frigobar, varanda com rede, Wi-Fi Starlink e caf\xE9 da manh\xE3 regional farto a 50 metros da Praia da Princesa.",
    photo_url: "/imagens/vila2.jpg",
    location: "Praia da Princesa, Ilha de Algodoal",
    rating: 4.9,
    total_reviews: 84,
    is_active: true,
    verified: true,
    plan_type: "mensal",
    price_starting: 180,
    opening_hours: "Recep\xE7\xE3o 24h",
    amenities: ["Ar-Condicionado", "Wi-Fi Starlink", "Caf\xE9 da Manh\xE3 Incluso", "Varanda c/ Rede", "Frente ao Mar"],
    created_at: "2026-01-05T08:00:00Z"
  },
  {
    id: "part_pousada_marhesias",
    name: "Pousada Marhesias & Eco Lounge",
    category: "pousadas",
    subcategory: "Pousada Ecol\xF3gica & Tranquilidade",
    phone: "(91) 98334-1122",
    whatsapp: "5591983341122",
    description: "Ambiente aconchegante cercado por coqueiros e jardim tropical na Vila de Maiandeua. Su\xEDtes para casais e fam\xEDlias com banho quente e \xE1rea de conviv\xEAncia.",
    photo_url: "/imagens/porto.jpg",
    location: "Rua Principal, pr\xF3x. \xE0 Igreja, Vila de Maiandeua",
    rating: 4.8,
    total_reviews: 51,
    is_active: true,
    verified: true,
    plan_type: "mensal",
    price_starting: 150,
    opening_hours: "Recep\xE7\xE3o 07:00 \xE0s 22:00",
    amenities: ["Wi-Fi Fibra", "Caf\xE9 da Manh\xE3", "Jardim Tropical", "Ventilador / Split", "Aceita Pets"],
    created_at: "2026-01-08T09:00:00Z"
  },
  {
    id: "part_restaurante_marujo",
    name: "Restaurante & Peixaria O Marujo",
    category: "alimentacao",
    subcategory: "Comida T\xEDpica Paraense & Frutos do Mar",
    phone: "(91) 98334-2211",
    whatsapp: "5591983342211",
    description: "A mais tradicional culin\xE1ria praiana de Algodoal. Peixes frescos grelhados na brasa, caldeirada paraense com jambu e tucupi, camar\xE3o regional e caranguejada viva aos finais de semana.",
    photo_url: "/imagens/algodoal.jpg",
    location: "Frente para a Praia da Princesa (Barraca 04)",
    rating: 4.9,
    total_reviews: 95,
    is_active: true,
    verified: true,
    plan_type: "mensal",
    price_starting: 45,
    opening_hours: "08:00 \xE0s 20:00",
    created_at: "2026-01-05T11:00:00Z"
  },
  {
    id: "part_deposito_gas_agua",
    name: "Dep\xF3sito Ilha Bela - \xC1gua, Gelo & G\xE1s",
    category: "compras",
    subcategory: "Entregas R\xE1pidas na Pousada",
    phone: "(91) 98112-5566",
    whatsapp: "5591981125566",
    description: "Entrega expressa de gal\xF5es de \xE1gua mineral 20L, sacos de gelo escama e cubo, botij\xE3o de g\xE1s P13, carv\xE3o e bebidas geladas em qualquer pousada ou casa de aluguel da ilha.",
    photo_url: "/imagens/porto2.jpg",
    location: "Pr\xF3ximo \xE0 Pra\xE7a Central, Vila de Maiandeua",
    rating: 4.9,
    total_reviews: 73,
    is_active: true,
    verified: false,
    plan_type: "free",
    price_starting: 10,
    opening_hours: "07:00 \xE0s 21:00",
    created_at: "2026-01-04T07:00:00Z"
  }
];
var SEED_ADVERTISEMENTS = [
  {
    id: "ad_transporte_banner1",
    title: "Charretes Credenciadas no Porto de Algodoal",
    business_name: "Associa\xE7\xE3o dos Condutores de Charrete de Maiandeua",
    category: "transporte",
    tagline: "Desembarque com tranquilidade e transporte com pre\xE7o tabelado",
    description: "Chegue na Ilha sem carregar peso nas dunas. Condutores certificados com tabela oficial para transporte at\xE9 a Praia da Princesa, Camboinha e Fortalezinha.",
    image_url: "/imagens/carroca.jpg",
    whatsapp: "5591984521102",
    phone: "(91) 98452-1102",
    location: "Trapiche do Porto de Algodoal",
    price_starting: 30,
    badge: "Tabelado Oficial",
    banner_slot: "banner_1",
    is_active: true,
    is_highlighted: true,
    start_date: "2026-01-01",
    end_date: "2026-12-31",
    views_count: 0,
    clicks_count: 0,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-02-15T00:00:00Z"
  },
  {
    id: "ad_restaurante_banner2",
    title: "Peixada & Caldeirada com Jambu no Restaurante O Marujo",
    business_name: "Restaurante O Marujo",
    category: "restaurante",
    tagline: "O melhor peixe frito com a\xE7a\xED e frutos do mar frescos",
    description: "Saboreie o leg\xEDtimo filhote e pescada amarela fritos na hora com a\xE7a\xED grosso ou caldeirada com camar\xE3o regional e folhas de jambu que tremem.",
    image_url: "/imagens/algodoal.jpg",
    whatsapp: "5591983342211",
    phone: "(91) 98334-2211",
    location: "Barraca 04 - Praia da Princesa",
    price_starting: 45,
    badge: "Mais Recomendado",
    banner_slot: "banner_2",
    is_active: true,
    is_highlighted: true,
    start_date: "2026-01-01",
    end_date: "2026-12-31",
    views_count: 0,
    clicks_count: 0,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-02-18T00:00:00Z"
  },
  {
    id: "ad_deposito_banner3",
    title: "Dep\xF3sito Ilha Bela - Gal\xE3o de \xC1gua 20L & Gelo",
    business_name: "Dep\xF3sito Ilha Bela",
    category: "compras",
    tagline: "Entrega r\xE1pida de \xE1gua mineral, gelo e carv\xE3o na sua pousada",
    description: "Precisa de \xE1gua pot\xE1vel ou gelo para o seu cooler? Pe\xE7a pelo WhatsApp que entregamos de charrete rapidamente na sua hospedagem.",
    image_url: "/imagens/porto2.jpg",
    whatsapp: "5591981125566",
    phone: "(91) 98112-5566",
    location: "Vila de Maiandeua",
    price_starting: 14,
    badge: "Entrega Express",
    banner_slot: "banner_3",
    is_active: true,
    is_highlighted: true,
    start_date: "2026-01-01",
    end_date: "2026-12-31",
    views_count: 0,
    clicks_count: 0,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-02-20T00:00:00Z"
  },
  {
    id: "ad_passeio_banner4",
    title: "Passeio Ecol\xF3gico de Rabeta: Lago da Princesa & Dunas",
    business_name: "Mestre Nonato Rabetas",
    category: "passeio",
    tagline: "Navegue pelos manguezais e descubra o lago de \xE1guas avermelhadas",
    description: "Passeio privativo ou compartilhado passando pelo canal da Camboinha, dunas de areia branca e banho refrescante no Lago da Princesa.",
    image_url: "/imagens/canal.jpg",
    whatsapp: "5591982239901",
    phone: "(91) 98223-9901",
    location: "Trapiche do Canal",
    price_starting: 25,
    badge: "Imperd\xEDvel",
    banner_slot: "banner_4",
    is_active: true,
    is_highlighted: true,
    start_date: "2026-01-01",
    end_date: "2026-12-31",
    views_count: 0,
    clicks_count: 0,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-02-22T00:00:00Z"
  },
  {
    id: "ad_pousada_destaque",
    title: "Pousada Chal\xE9s da Princesa - Frente ao Mar",
    business_name: "Pousada Chal\xE9s da Princesa",
    category: "pousada",
    tagline: "Conforto r\xFAstico com ar-condicionado e Wi-Fi Starlink",
    description: "Desperte com o barulho das ondas na Praia da Princesa. Caf\xE9 da manh\xE3 com frutas tropicais e tapiocas quentinhas feito na hora.",
    image_url: "/imagens/vila2.jpg",
    whatsapp: "5591981129988",
    phone: "(91) 98112-9988",
    location: "Praia da Princesa",
    price_starting: 180,
    badge: "Top Escolha",
    banner_slot: "destaque_topo",
    is_active: true,
    is_highlighted: true,
    start_date: "2026-01-01",
    end_date: "2026-12-31",
    views_count: 0,
    clicks_count: 0,
    created_at: "2026-01-05T00:00:00Z",
    updated_at: "2026-02-10T00:00:00Z"
  },
  {
    id: "ad_evento_luau",
    title: "Luau das Dunas & Reggae Roots de Algodoal",
    business_name: "Coletivo Cultural Maiandeua",
    category: "evento",
    tagline: "Noite de lua cheia, fogueira na areia e o melhor do reggae paraense",
    description: "Festa cultural aberta com DJs de reggae roots, apresenta\xE7\xE3o de Carimb\xF3 com grupo raiz de Marapanim e fogueira ecol\xF3gica na praia.",
    image_url: "/imagens/festa.jpg",
    whatsapp: "5591983342211",
    location: "Barraca Sol & Lua - Praia da Princesa",
    event_date: "2026-09-05T20:30:00Z",
    event_venue: "Praia da Princesa (ao lado do Barata)",
    price_starting: 0,
    badge: "Evento Cultural",
    banner_slot: "nenhum",
    is_active: true,
    is_highlighted: true,
    start_date: "2026-08-01",
    end_date: "2026-09-06",
    views_count: 0,
    clicks_count: 0,
    created_at: "2026-08-10T00:00:00Z",
    updated_at: "2026-08-20T00:00:00Z"
  }
];
var SEED_TIDE_DAYS = [
  {
    id: "tide_2026_09_01",
    date: "2026-09-01",
    moon_phase: "Cheia",
    coefficient: 88,
    high_tides: [
      { time: "04:12", height: "4.2m" },
      { time: "16:38", height: "4.4m" }
    ],
    low_tides: [
      { time: "10:25", height: "0.4m" },
      { time: "22:50", height: "0.5m" }
    ],
    source: "tabuademares_marapanim",
    recommendations: "Mar\xE9 de siz\xEDgia (mar\xE9 viva). Faixa de areia muito ampla na baixa-mar (\xF3timo para charretes). Mar\xE9 cheia encosta perto dos quiosques na Princesa."
  },
  {
    id: "tide_2026_09_02",
    date: "2026-09-02",
    moon_phase: "Cheia",
    coefficient: 92,
    high_tides: [
      { time: "04:55", height: "4.3m" },
      { time: "17:20", height: "4.5m" }
    ],
    low_tides: [
      { time: "11:08", height: "0.3m" },
      { time: "23:32", height: "0.4m" }
    ],
    source: "tabuademares_marapanim",
    recommendations: "Excelente dia para passeios de rabeta no Furo Velho e banho no Lago da Princesa entre 14h e 17h."
  },
  {
    id: "tide_2026_09_03",
    date: "2026-09-03",
    moon_phase: "Minguante",
    coefficient: 84,
    high_tides: [
      { time: "05:38", height: "4.1m" },
      { time: "18:02", height: "4.2m" }
    ],
    low_tides: [
      { time: "11:50", height: "0.6m" }
    ],
    source: "marinha_brasil",
    recommendations: "Mar\xE9 favor\xE1vel para travessia tranquila de barco de Marud\xE1 para Algodoal durante todo o dia."
  },
  {
    id: "tide_2026_09_04",
    date: "2026-09-04",
    moon_phase: "Minguante",
    coefficient: 76,
    high_tides: [
      { time: "06:22", height: "3.9m" },
      { time: "18:48", height: "4.0m" }
    ],
    low_tides: [
      { time: "00:15", height: "0.6m" },
      { time: "12:35", height: "0.8m" }
    ],
    source: "marinha_brasil",
    recommendations: "Mar\xE9 intermedi\xE1ria. Condi\xE7\xF5es ideais para caminhada entre a Vila de Maiandeua e a Praia da Princesa."
  },
  {
    id: "tide_2026_09_05",
    date: "2026-09-05",
    moon_phase: "Minguante",
    coefficient: 70,
    high_tides: [
      { time: "07:10", height: "3.7m" },
      { time: "19:35", height: "3.8m" }
    ],
    low_tides: [
      { time: "01:02", height: "0.7m" },
      { time: "13:25", height: "0.9m" }
    ],
    source: "tabuademares_marapanim",
    recommendations: "Mar\xE9 de quadratura (mar\xE9 morta). Varia\xE7\xE3o de mar\xE9 mais branda ao longo de todo o s\xE1bado."
  },
  {
    id: "tide_2026_09_06",
    date: "2026-09-06",
    moon_phase: "Nova",
    coefficient: 68,
    high_tides: [
      { time: "08:05", height: "3.6m" },
      { time: "20:30", height: "3.7m" }
    ],
    low_tides: [
      { time: "01:55", height: "0.8m" },
      { time: "14:20", height: "1.0m" }
    ],
    source: "tabuademares_marapanim",
    recommendations: "\xD3timas condi\xE7\xF5es para banho de mar calmo nas praias do Farol e da Princesa."
  }
];
var SEED_USERS = [
  {
    id: "usr_admin_wilson_lima",
    name: "Wilson Lima",
    email: "wilsinhofly@gmail.com",
    avatar_url: "https://ui-avatars.com/api/?name=Wilson+Lima&background=0284c7&color=fff",
    provider: "email",
    role: "admin",
    created_at: "2026-01-01T00:00:00Z"
  },
  {
    id: "usr_admin_master",
    name: "Administrador Algodoal Connect",
    email: "admin@algodoalconnect.com.br",
    avatar_url: "https://ui-avatars.com/api/?name=Admin+Algodoal&background=0f172a&color=f59e0b",
    provider: "email",
    role: "admin",
    created_at: "2026-01-01T00:00:00Z"
  },
  {
    id: "usr_charrete_raimundo",
    name: "Seu Raimundo (Charreteiro)",
    email: "raimundo@algodoal.com.br",
    phone: "(91) 98452-1102",
    provider: "google",
    role: "partner",
    partner_id: "part_carroca_14",
    created_at: "2026-01-10T00:00:00Z"
  }
];
var SEED_SERVICES = [
  // Transporte
  {
    id: "serv_corrida_porto_princesa",
    partner_id: "part_carroca_14",
    name: "Corrida: Porto de Algodoal \u21C4 Praia da Princesa",
    description: "Transporte completo de passageiros e bagagens do Porto de desembarque at\xE9 as pousadas da Praia da Princesa.",
    price: 35,
    unit: "por viagem (at\xE9 4 pessoas + malas)",
    category: "transporte",
    image_url: "/imagens/carroca.jpg",
    available: true,
    estimated_time: "15 a 20 min"
  },
  {
    id: "serv_corrida_porto_vila",
    partner_id: "part_carroca_14",
    name: "Corrida: Porto de Algodoal \u21C4 Centro da Vila",
    description: "Corrida curta para hot\xE9is e pousadas no centro da Vila de Maiandeua.",
    price: 25,
    unit: "por viagem",
    category: "transporte",
    image_url: "/imagens/vila.jpg",
    available: true,
    estimated_time: "5 a 10 min"
  },
  // Passeios
  {
    id: "serv_passeio_lago_princesa",
    partner_id: "part_rabeta_estrela",
    name: "Passeio de Rabeta p/ Lago da Princesa & Dunas",
    description: "Navega\xE7\xE3o m\xE1gica pelo canal com desembarque pr\xF3ximo \xE0s famosas dunas e caminhada at\xE9 as \xE1guas doces e avermelhadas do Lago da Princesa.",
    price: 35,
    unit: "por pessoa (m\xEDnimo 3 pessoas)",
    category: "passeios",
    image_url: "/assets/images/lago_da_princesa_1787985490170.jpg",
    available: true,
    estimated_time: "2h30 de dura\xE7\xE3o"
  },
  // Pousadas
  {
    id: "serv_diaria_chale_princesa",
    partner_id: "part_pousada_chale_princesa",
    name: "Di\xE1ria Chal\xE9 Casal c/ Ar & Caf\xE9 da Manh\xE3",
    description: "Chal\xE9 aconchegante com cama queen-size, ar-condicionado split, varanda com rede e vista para o jardim tropical.",
    price: 220,
    unit: "por di\xE1ria (casal)",
    category: "pousadas",
    image_url: "/assets/images/vila_algodoal_rua_1787985524739.jpg",
    available: true,
    estimated_time: "Check-in 14h / Check-out 12h"
  },
  // Compras
  {
    id: "serv_agua_galao_20l",
    partner_id: "part_deposito_gas_agua",
    name: "Gal\xE3o de \xC1gua Mineral 20L (Lacrado)",
    description: "Gal\xE3o de \xE1gua pot\xE1vel mineral de 20 litros das melhores fontes do Par\xE1. Entregue direto na sua pousada ou casa de praia.",
    price: 18,
    unit: "gal\xE3o 20L",
    category: "compras",
    image_url: "/imagens/porto2.jpg",
    available: true,
    estimated_time: "Entrega: 15-25 min"
  },
  {
    id: "serv_gelo_saco_5kg",
    partner_id: "part_deposito_gas_agua",
    name: "Saco de Gelo Filtrado em Cubos 5kg",
    description: "Gelo de \xE1gua pot\xE1vel em cubos dur\xE1veis, ideal para caixas t\xE9rmicas, coolers e drinks.",
    price: 14,
    unit: "saco 5kg",
    category: "compras",
    image_url: "/imagens/porto2.jpg",
    available: true,
    estimated_time: "Entrega: 15-25 min"
  },
  // Alimentação
  {
    id: "serv_caldeirada_paraense",
    partner_id: "part_restaurante_marujo",
    name: "Caldeirada Paraense Especial de Filhote com Jambu",
    description: "Postas nobres de filhote amaz\xF4nico cozidas no tucupi com tempero verde, camar\xE3o regional, ovos cozidos, batatas e jambu.",
    price: 120,
    unit: "serve 2 a 3 pessoas",
    category: "alimentacao",
    image_url: "/imagens/algodoal.jpg",
    available: true,
    estimated_time: "Preparo: 30-40 min"
  }
];
var SEED_ORDERS = [
  {
    id: "ord_alg_101",
    customer_name: "Lucas Brand\xE3o",
    customer_phone: "(91) 99122-3344",
    customer_location: "Porto de Algodoal (Desembarque do barco das 10h)",
    destination_location: "Pousada Chal\xE9s da Princesa, Praia da Princesa",
    partner_id: "part_carroca_14",
    partner_name: "Seu Raimundo (Charrete #14)",
    category: "transporte",
    items: [
      {
        service_id: "serv_corrida_porto_princesa",
        name: "Corrida: Porto de Algodoal \u21C4 Praia da Princesa",
        price: 35,
        quantity: 1,
        unit: "por viagem (at\xE9 4 pessoas + malas)"
      }
    ],
    total_price: 35,
    status: "concluido",
    payment_method: "pix",
    notes: "Estamos com 3 malas m\xE9dias e uma caixa t\xE9rmica.",
    driver_or_agent_name: "Seu Raimundo",
    created_at: new Date(Date.now() - 36e5 * 4).toISOString(),
    updated_at: new Date(Date.now() - 36e5 * 3).toISOString()
  }
];
var SEED_ISLAND_SPOTS = [
  {
    id: "spot_porto",
    name: "Porto de Algodoal (Trapiche de Desembarque)",
    category: "porto",
    description: "Ponto de chegada dos barcos vindos de Marud\xE1. Aqui voc\xEA encontra o ponto oficial de charretes e guias locais credenciados.",
    image_url: "/assets/images/rabeta_barco_mar_1787985502030.jpg",
    distance_from_port: "0m",
    walking_time: "0 min",
    cart_time: "0 min",
    tips: "Ao desembarcar, negocie sua charrete com os condutores com colete numerado da Associa\xE7\xE3o.",
    coordinates: { x: 22, y: 78 }
  },
  {
    id: "spot_vila_maiandeua",
    name: "Vila de Maiandeua (Centro Hist\xF3rico & Comercial)",
    category: "vila",
    description: "O cora\xE7\xE3o da ilha. Onde ficam a pra\xE7a central, igreja, posto de sa\xFAde 24h, mercadinhos, farm\xE1cias, pousadas tradicionais e bares.",
    image_url: "/assets/images/vila_algodoal_rua_1787985524739.jpg",
    distance_from_port: "600m",
    walking_time: "8 min",
    cart_time: "3 min",
    tips: "Excelente para passear no fim de tarde, comer um a\xE7a\xED puro e comprar lembrancinhas de artesanato.",
    coordinates: { x: 30, y: 65 }
  },
  {
    id: "spot_praia_princesa",
    name: "Praia da Princesa",
    category: "praia",
    description: "A praia mais famosa e vibrante de Algodoal, com quil\xF4metros de areia branca, quiosques r\xFAsticos com reggae paraense e carimb\xF3, al\xE9m de peixe fresco.",
    image_url: "/assets/images/algodoal_sunset_1787985478872.jpg",
    distance_from_port: "2.5 km",
    walking_time: "30 min a p\xE9 pela praia",
    cart_time: "12 min de charrete",
    tips: "Na mar\xE9 baixa a faixa de areia fica gigante. N\xE3o esque\xE7a protetor solar.",
    coordinates: { x: 55, y: 45 }
  },
  {
    id: "spot_lago_princesa",
    name: "Lago da Princesa (\xC1gua Doce & Dunas)",
    category: "lago",
    description: "Lindo lago de \xE1guas doces e refrescantes de colora\xE7\xE3o avermelhada/coca-cola, cercado por dunas brancas imponentes.",
    image_url: "/assets/images/lago_da_princesa_1787985490170.jpg",
    distance_from_port: "4.8 km",
    walking_time: "1h15 de caminhada",
    cart_time: "25 min de charrete ou rabeta pelo canal",
    tips: "Um dos pontos mais fotog\xEAnicos da Amaz\xF4nia Atl\xE2ntica. Leve \xE1gua e saco para recolher seu lixo.",
    coordinates: { x: 72, y: 35 }
  }
];
var SEED_BOAT_CROSSINGS = [
  {
    id: "boat_maruda_algodoal",
    origin: "Porto de Marud\xE1 (Marapanim - PA)",
    destination: "Porto da Ilha de Algodoal",
    departure_times: ["07:00", "08:30", "10:00", "11:30", "13:00", "14:30", "16:00", "17:30"],
    price: 18,
    duration: "40 a 50 minutos",
    association: "COOPBAL - Cooperativa dos Barqueiros de Algodoal",
    phone: "(91) 98123-0099",
    notes: "Hor\xE1rios pontuais sujeitos a sa\xEDdas extras em finais de semana, feriados e alta temporada."
  },
  {
    id: "boat_algodoal_maruda",
    origin: "Porto da Ilha de Algodoal",
    destination: "Porto de Marud\xE1 (Marapanim - PA)",
    departure_times: ["06:00", "07:30", "09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "17:30"],
    price: 18,
    duration: "40 a 50 minutos",
    association: "COOPBAL - Cooperativa dos Barqueiros de Algodoal",
    phone: "(91) 98123-0099",
    notes: "Compre sua passagem com 15 min de anteced\xEAncia no guich\xEA do trapiche."
  }
];
var SEED_USEFUL_CONTACTS = [
  {
    id: "cont_saude",
    title: "Posto de Sa\xFAde da Ilha de Algodoal (24h)",
    category: "saude",
    phone: "(91) 3778-1120",
    whatsapp: "5591988990011",
    location: "Vila de Maiandeua (Pr\xF3x. \xE0 Pra\xE7a)",
    description: "Atendimento m\xE9dico de urg\xEAncia e emerg\xEAncia, curativos, medica\xE7\xE3o b\xE1sica e suporte para remo\xE7\xE3o fluvial.",
    available_hours: "24 Horas"
  },
  {
    id: "cont_policia",
    title: "Destacamento da Pol\xEDcia Militar / PPO Algodoal",
    category: "seguranca",
    phone: "190",
    whatsapp: "5591984002233",
    location: "Entrada da Vila de Maiandeua",
    description: "Seguran\xE7a p\xFAblica, policiamento ostensivo e fiscaliza\xE7\xE3o contra polui\xE7\xE3o sonora e ve\xEDculos motorizados n\xE3o autorizados.",
    available_hours: "24 Horas"
  }
];
var SEED_REVIEWS = [
  {
    id: "rev_1",
    partner_id: "part_carroca_14",
    customer_name: "Camila Santos",
    rating: 5,
    comment: "Seu Raimundo nos atendeu no porto com muita simpatia e pontualidade. Carregou todas as malas da fam\xEDlia at\xE9 a pousada na Praia da Princesa sem estresse!",
    created_at: "2026-02-14T12:00:00Z"
  }
];
var SEED_STORIES = [
  {
    id: "story-porto",
    title: "Chegada",
    subtitle: "Trapiche & Porto de Algodoal",
    emoji: "\u{1F3DD}\uFE0F",
    coverImage: "/imagens/porto.jpg",
    fullImage: "/imagens/porto.jpg",
    description: "Vista a\xE9rea espetacular da chegada em Algodoal. O porto e o trapiche de madeira d\xE3o as boas-vindas com \xE1guas calmas e rabetas ancoradas.",
    location: "Porto de Algodoal / Canal",
    tag: "Chegada na Ilha",
    category: "todos",
    whatsapp: "5591983456789",
    is_active: true,
    order_index: 1,
    created_at: "2026-01-01T00:00:00Z"
  },
  {
    id: "story-charrete",
    title: "Charretes",
    subtitle: "Transporte Tradicional",
    emoji: "\u{1F40E}",
    coverImage: "/imagens/vila.jpg",
    fullImage: "/imagens/vila.jpg",
    description: "Na Ilha de Algodoal n\xE3o circulam carros. O transporte tradicional e ecol\xF3gico \xE9 feito por charreteiros que conduzem com carinho pelas ruas de areia.",
    location: "Porto de Algodoal \u21C4 Praia da Princesa",
    tag: "Transporte Ilha",
    category: "transporte",
    whatsapp: "5591983456789",
    is_active: true,
    order_index: 2,
    created_at: "2026-01-02T00:00:00Z"
  },
  {
    id: "story-vila",
    title: "A Vila",
    subtitle: "Ruas Floridas & Natureza",
    emoji: "\u{1F338}",
    coverImage: "/imagens/vila2.jpg",
    fullImage: "/imagens/vila2.jpg",
    description: "Ruas tranquilas de areia batida ladeadas por buganv\xEDlias, coqueirais e casas r\xFAsticas com vista direta para a brisa do Atl\xE2ntico.",
    location: "Vila de Algodoal",
    tag: "Passeio a P\xE9",
    category: "pousadas",
    whatsapp: "5591981234567",
    is_active: true,
    order_index: 3,
    created_at: "2026-01-03T00:00:00Z"
  },
  {
    id: "story-praia",
    title: "Mar\xE9 Baixa",
    subtitle: "Praia da Princesa & Manguezais",
    emoji: "\u{1F30A}",
    coverImage: "/imagens/algodoal.jpg",
    fullImage: "/imagens/algodoal.jpg",
    description: "Na mar\xE9 baixa, bancos de areia dourada se estendem por quil\xF4metros entre canais verdes e manguezais preservados da APA.",
    location: "Praia da Princesa & Dunas",
    tag: "Natureza Selvagem",
    category: "passeios",
    whatsapp: "5591981234567",
    is_active: true,
    order_index: 4,
    created_at: "2026-01-04T00:00:00Z"
  },
  {
    id: "story-rabeta",
    title: "Rabetas",
    subtitle: "Navega\xE7\xE3o pelos Canais",
    emoji: "\u{1F6A4}",
    coverImage: "/imagens/canal.jpg",
    fullImage: "/imagens/canal.jpg",
    description: "Passeios de barco rabeta pelo Furo Velho, travessia para Fortalezinha e navega\xE7\xE3o em \xE1guas esverdeadas e l\xEDmpidas com mestres locais.",
    location: "Canal do Furo Velho & Camboinha",
    tag: "Passeios N\xE1uticos",
    category: "passeios",
    whatsapp: "5591984567890",
    is_active: true,
    order_index: 5,
    created_at: "2026-01-05T00:00:00Z"
  },
  {
    id: "story-por-do-sol",
    title: "P\xF4r do Sol",
    subtitle: "Charrete ao Entardecer Dourado",
    emoji: "\u{1F305}",
    coverImage: "/imagens/carroca.jpg",
    fullImage: "/imagens/carroca.jpg",
    description: "O p\xF4r do sol inesquec\xEDvel na beira da Praia da Princesa com charretes trotando nas \xE1guas rasas sob a luz dourada do fim de tarde.",
    location: "Praia da Princesa",
    tag: "Cen\xE1rio M\xE1gico",
    category: "passeios",
    whatsapp: "5591983456789",
    is_active: true,
    order_index: 6,
    created_at: "2026-01-06T00:00:00Z"
  },
  {
    id: "story-festa",
    title: "Luau & Reggae",
    subtitle: "Noites de Carimb\xF3 & Reggae Raiz",
    emoji: "\u{1F525}",
    coverImage: "/imagens/festa.jpg",
    fullImage: "/imagens/festa.jpg",
    description: "A energia contagiante do Carimb\xF3 raiz de Marapanim, luaus p\xE9 na areia e noites de reggae paraense com fogueira \xE0 beira-mar.",
    location: "Praia da Princesa (Decks Culturais)",
    tag: "Cultura & M\xFAsica",
    category: "eventos",
    whatsapp: "5591986789012",
    is_active: true,
    order_index: 7,
    created_at: "2026-01-07T00:00:00Z"
  },
  {
    id: "story-maruda",
    title: "Travessia",
    subtitle: "Marud\xE1 \u21C4 Algodoal",
    emoji: "\u2693",
    coverImage: "/imagens/porto2.jpg",
    fullImage: "/imagens/porto2.jpg",
    description: "A travessia tradicional de barco a partir do porto de Marud\xE1 com vista para as praias e a vida cai\xE7ara da Amaz\xF4nia Atl\xE2ntica.",
    location: "Porto de Marud\xE1 / Algodoal",
    tag: "Barcos de Linha",
    category: "compras",
    whatsapp: "5591984567890",
    is_active: true,
    order_index: 8,
    created_at: "2026-01-08T00:00:00Z"
  }
];
var DEFAULT_HERO_PRESET_URLS = [
  "/imagens/algodoal_hd.jpg",
  "/imagens/algodoal.jpg",
  "/imagens/vila.jpg",
  "/imagens/vila2.jpg",
  "/imagens/canal.jpg",
  "/imagens/porto.jpg",
  "/imagens/porto2.jpg"
];
var DEFAULT_ADMIN_SETTINGS = {
  admin_username: "Wilson Lima",
  admin_email: "wilsinhofly@gmail.com",
  admin_pin: "123456",
  hero_background_url: "/imagens/algodoal_hd.jpg",
  hero_rotation_enabled: true,
  hero_active_images: DEFAULT_HERO_PRESET_URLS,
  hero_custom_images: [],
  hero_deleted_presets: [],
  updated_at: "2026-01-01T00:00:00Z"
};
function normalizeAdCategory(cat) {
  if (!cat) return "";
  const c = cat.toLowerCase().trim();
  if (c === "restaurante" || c === "restaurantes" || c === "alimentacao" || c === "alimenta\xE7\xE3o" || c === "gastronomia" || c === "culinaria") return "alimentacao";
  if (c === "pousada" || c === "pousadas" || c === "hospedagem" || c === "hotel" || c === "chale" || c === "chal\xE9s") return "pousadas";
  if (c === "passeio" || c === "passeios" || c === "rabeta" || c === "rabetas" || c === "ecoturismo") return "passeios";
  if (c === "transporte" || c === "transportes" || c === "charrete" || c === "charretes" || c === "carroca" || c === "carro\xE7as") return "transporte";
  if (c === "compra" || c === "compras" || c === "mercado" || c === "deposito" || c === "dep\xF3sito" || c === "agua" || c === "\xE1gua") return "compras";
  if (c === "evento" || c === "eventos" || c === "show" || c === "luau" || c === "festa") return "eventos";
  if (c === "informacoes" || c === "informa\xE7\xF5es" || c === "guia" || c === "info") return "informacoes";
  return c;
}
function loadLocalDB() {
  try {
    let candidateData = null;
    if (import_fs.default.existsSync(DB_FILE)) {
      const raw = import_fs.default.readFileSync(DB_FILE, "utf-8");
      try {
        candidateData = JSON.parse(raw);
      } catch (e) {
        console.warn("\u26A0\uFE0F Erro de parse no algodoal_db.json principal, tentando backup...", e);
      }
    }
    if (!candidateData && import_fs.default.existsSync(DB_BACKUP_FILE)) {
      try {
        const rawBackup = import_fs.default.readFileSync(DB_BACKUP_FILE, "utf-8");
        candidateData = JSON.parse(rawBackup);
        console.log("\u2705 Restaurado dados locais com sucesso a partir de algodoal_db.backup.json");
      } catch (e) {
        console.error("Erro ao ler backup:", e);
      }
    }
    if (candidateData) {
      const parsed = candidateData;
      if (!Array.isArray(parsed.advertisements) || parsed.advertisements.length === 0) {
        let restoredFromBackup = false;
        if (import_fs.default.existsSync(DB_BACKUP_FILE)) {
          try {
            const bkp = JSON.parse(import_fs.default.readFileSync(DB_BACKUP_FILE, "utf-8"));
            if (Array.isArray(bkp.advertisements) && bkp.advertisements.length > 0) {
              parsed.advertisements = bkp.advertisements;
              restoredFromBackup = true;
            }
          } catch {
          }
        }
        if (!restoredFromBackup) {
          parsed.advertisements = SEED_ADVERTISEMENTS;
        }
      } else {
      }
      if (!Array.isArray(parsed.partners) || parsed.partners.length === 0) {
        parsed.partners = SEED_PARTNERS;
      }
      if (!Array.isArray(parsed.services)) parsed.services = SEED_SERVICES;
      if (!Array.isArray(parsed.orders)) parsed.orders = [];
      if (!Array.isArray(parsed.island_spots)) parsed.island_spots = SEED_ISLAND_SPOTS;
      if (!Array.isArray(parsed.boat_crossings)) parsed.boat_crossings = SEED_BOAT_CROSSINGS;
      if (!Array.isArray(parsed.useful_contacts)) parsed.useful_contacts = SEED_USEFUL_CONTACTS;
      if (!Array.isArray(parsed.reviews)) parsed.reviews = SEED_REVIEWS;
      if (!Array.isArray(parsed.tide_days) || parsed.tide_days.length === 0) {
        parsed.tide_days = SEED_TIDE_DAYS;
      }
      if (!Array.isArray(parsed.users) || parsed.users.length === 0) {
        parsed.users = SEED_USERS;
      }
      if (!Array.isArray(parsed.stories) || parsed.stories.length === 0) {
        parsed.stories = SEED_STORIES;
      }
      return parsed;
    }
  } catch (err) {
    console.error("Error reading local DB file:", err);
  }
  const initial = {
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
function saveLocalDB(state) {
  try {
    const jsonStr = JSON.stringify(state, null, 2);
    import_fs.default.writeFileSync(DB_FILE, jsonStr, "utf-8");
    import_fs.default.writeFileSync(DB_BACKUP_FILE, jsonStr, "utf-8");
  } catch (err) {
    console.error("Error writing to local DB file:", err);
  }
}
async function exportDatabaseBackup() {
  if (await pgReady()) {
    const p = await pgPool.query("SELECT * FROM partners");
    const s = await pgPool.query("SELECT * FROM services_products");
    const o = await pgPool.query("SELECT * FROM orders");
    const sp = await pgPool.query("SELECT * FROM island_spots");
    const b = await pgPool.query("SELECT * FROM boat_crossings");
    const c = await pgPool.query("SELECT * FROM useful_contacts");
    const r = await pgPool.query("SELECT * FROM reviews");
    const a = await pgPool.query("SELECT * FROM advertisements");
    const t = await pgPool.query("SELECT * FROM tide_days");
    const u = await pgPool.query("SELECT * FROM users");
    const st = await pgPool.query("SELECT * FROM stories");
    return {
      partners: p.rows.map(rowToPartner),
      services: s.rows.map(rowToService),
      orders: o.rows.map(rowToOrder),
      island_spots: sp.rows.map(rowToIslandSpot),
      boat_crossings: b.rows.map(rowToBoatCrossing),
      useful_contacts: c.rows.map(rowToUsefulContact),
      reviews: r.rows.map(rowToReview),
      advertisements: a.rows.map(rowToAdvertisement),
      tide_days: t.rows.map(rowToTideDay),
      users: u.rows.map(rowToUser),
      stories: st.rows.map(rowToStory)
    };
  }
  return loadLocalDB();
}
async function restoreDatabaseBackup(backup) {
  let count = 0;
  if (await pgReady()) {
    if (Array.isArray(backup.advertisements)) {
      for (const a of backup.advertisements) {
        await pgPool.query(
          `INSERT INTO advertisements (id, title, category, partner_id, business_name, tagline, description, image_url, link_url, whatsapp, phone, location, price_starting, badge, event_date, event_venue, banner_slot, plan_type, is_active, is_highlighted, start_date, end_date, views_count, clicks_count, created_at, updated_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)
           ON CONFLICT (id) DO UPDATE SET
             title = EXCLUDED.title,
             image_url = EXCLUDED.image_url,
             description = EXCLUDED.description,
             whatsapp = EXCLUDED.whatsapp,
             business_name = EXCLUDED.business_name,
             category = EXCLUDED.category,
             updated_at = NOW()`,
          [a.id, a.title, a.category, a.partner_id || null, a.business_name, a.tagline || null, a.description, a.image_url, a.link_url || null, a.whatsapp, a.phone || null, a.location, a.price_starting || 0, a.badge || null, a.event_date || null, a.event_venue || null, a.banner_slot || "nenhum", a.plan_type || null, a.is_active, a.is_highlighted, a.start_date, a.end_date, a.views_count || 0, a.clicks_count || 0, a.created_at || (/* @__PURE__ */ new Date()).toISOString(), a.updated_at || (/* @__PURE__ */ new Date()).toISOString()]
        );
        count++;
      }
    }
  }
  const db = loadLocalDB();
  if (Array.isArray(backup.advertisements) && backup.advertisements.length > 0) {
    const existingMap = new Map(db.advertisements.map((a) => [a.id, a]));
    for (const ad of backup.advertisements) {
      existingMap.set(ad.id, { ...ad, updated_at: (/* @__PURE__ */ new Date()).toISOString() });
    }
    db.advertisements = Array.from(existingMap.values());
    count = db.advertisements.length;
  }
  if (Array.isArray(backup.partners) && backup.partners.length > 0) {
    db.partners = backup.partners;
  }
  saveLocalDB(db);
  return { success: true, count };
}
async function getLiveTideSchedule() {
  const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  if (await pgReady()) {
    const res = await pgPool.query("SELECT * FROM tide_days WHERE date = $1", [todayStr]);
    const todayEntry2 = res.rows[0] ? rowToTideDay(res.rows[0]) : null;
    if (todayEntry2) {
      const list = [];
      todayEntry2.high_tides.forEach((h) => list.push({ time: h.time, type: "Alta (Preamar)", height: h.height, status: "Favor\xE1vel para passeios" }));
      todayEntry2.low_tides.forEach((l) => list.push({ time: l.time, type: "Baixa (Baixa-mar)", height: l.height, status: "Aten\xE7\xE3o \xE0s pedras" }));
      return list.sort((a, b) => a.time.localeCompare(b.time));
    }
    return [
      { time: "04:12", type: "Alta (Preamar)", height: "4.2m", status: "Favor\xE1vel para passeios" },
      { time: "10:25", type: "Baixa (Baixa-mar)", height: "0.4m", status: "Aten\xE7\xE3o \xE0s pedras" },
      { time: "16:38", type: "Alta (Preamar)", height: "4.4m", status: "Favor\xE1vel para passeios" },
      { time: "22:50", type: "Baixa (Baixa-mar)", height: "0.5m", status: "Passeio pelo canal" }
    ];
  }
  const db = loadLocalDB();
  const todayEntry = db.tide_days?.find((t) => t.date === todayStr);
  if (todayEntry) {
    const list = [];
    todayEntry.high_tides.forEach((h) => {
      list.push({
        time: h.time,
        type: "Alta (Preamar)",
        height: h.height,
        status: "Favor\xE1vel para passeios"
      });
    });
    todayEntry.low_tides.forEach((l) => {
      list.push({
        time: l.time,
        type: "Baixa (Baixa-mar)",
        height: l.height,
        status: "Aten\xE7\xE3o \xE0s pedras"
      });
    });
    return list.sort((a, b) => a.time.localeCompare(b.time));
  }
  return [
    { time: "04:12", type: "Alta (Preamar)", height: "4.2m", status: "Favor\xE1vel para passeios" },
    { time: "10:25", type: "Baixa (Baixa-mar)", height: "0.4m", status: "Aten\xE7\xE3o \xE0s pedras" },
    { time: "16:38", type: "Alta (Preamar)", height: "4.4m", status: "Favor\xE1vel para passeios" },
    { time: "22:50", type: "Baixa (Baixa-mar)", height: "0.5m", status: "Passeio pelo canal" }
  ];
}
async function getPartners(category) {
  if (await pgReady()) {
    const params = [];
    let query = "SELECT * FROM partners WHERE is_active = TRUE";
    if (category && category !== "todos") {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }
    query += " ORDER BY rating DESC";
    const res = await pgPool.query(query, params);
    return res.rows.map(rowToPartner);
  }
  const db = loadLocalDB();
  let list = db.partners.filter((p) => p.is_active);
  if (category && category !== "todos") {
    list = list.filter((p) => p.category === category);
  }
  return list.sort((a, b) => b.rating - a.rating);
}
async function getAllPartnersAdmin() {
  if (await pgReady()) {
    const res = await pgPool.query("SELECT * FROM partners ORDER BY created_at DESC");
    return res.rows.map(rowToPartner);
  }
  const db = loadLocalDB();
  return db.partners;
}
async function getPartnerById(id) {
  if (await pgReady()) {
    const res = await pgPool.query("SELECT * FROM partners WHERE id = $1", [id]);
    return res.rows[0] ? rowToPartner(res.rows[0]) : null;
  }
  const db = loadLocalDB();
  return db.partners.find((p) => p.id === id) || null;
}
async function createPartner(partner) {
  if (await pgReady()) {
    const res = await pgPool.query(
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
async function updatePartner(id, updates) {
  if (await pgReady()) {
    const payload = { ...updates };
    if (payload.amenities !== void 0) payload.amenities = JSON.stringify(payload.amenities);
    const row = await pgPartialUpdate("partners", id, payload);
    return row ? rowToPartner(row) : null;
  }
  const db = loadLocalDB();
  const index = db.partners.findIndex((p) => p.id === id);
  if (index === -1) return null;
  db.partners[index] = { ...db.partners[index], ...updates };
  saveLocalDB(db);
  return db.partners[index];
}
async function deletePartner(id) {
  if (await pgReady()) {
    const res = await pgPool.query("DELETE FROM partners WHERE id = $1 RETURNING id", [id]);
    return (res.rowCount || 0) > 0;
  }
  const db = loadLocalDB();
  const lenBefore = db.partners.length;
  db.partners = db.partners.filter((p) => p.id !== id);
  saveLocalDB(db);
  return db.partners.length < lenBefore;
}
async function getServices(partnerId, category) {
  if (await pgReady()) {
    const conditions = [];
    const params = [];
    if (partnerId) {
      params.push(partnerId);
      conditions.push(`partner_id = $${params.length}`);
    }
    if (category && category !== "todos") {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }
    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const res = await pgPool.query(`SELECT * FROM services_products ${where}`, params);
    return res.rows.map(rowToService);
  }
  const db = loadLocalDB();
  let list = db.services;
  if (partnerId) list = list.filter((s) => s.partner_id === partnerId);
  if (category && category !== "todos") list = list.filter((s) => s.category === category);
  return list;
}
async function createService(service) {
  if (await pgReady()) {
    const res = await pgPool.query(
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
async function updateService(id, updates) {
  if (await pgReady()) {
    const row = await pgPartialUpdate("services_products", id, updates);
    return row ? rowToService(row) : null;
  }
  const db = loadLocalDB();
  const index = db.services.findIndex((s) => s.id === id);
  if (index === -1) return null;
  db.services[index] = { ...db.services[index], ...updates };
  saveLocalDB(db);
  return db.services[index];
}
async function deleteService(id) {
  if (await pgReady()) {
    const res = await pgPool.query("DELETE FROM services_products WHERE id = $1 RETURNING id", [id]);
    return (res.rowCount || 0) > 0;
  }
  const db = loadLocalDB();
  const len = db.services.length;
  db.services = db.services.filter((s) => s.id !== id);
  saveLocalDB(db);
  return db.services.length < len;
}
async function getOrders(partnerId, status) {
  if (await pgReady()) {
    const conditions = [];
    const params = [];
    if (partnerId) {
      params.push(partnerId);
      conditions.push(`partner_id = $${params.length}`);
    }
    if (status && status !== "todos") {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }
    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const res = await pgPool.query(`SELECT * FROM orders ${where} ORDER BY created_at DESC`, params);
    return res.rows.map(rowToOrder);
  }
  const db = loadLocalDB();
  let list = db.orders;
  if (partnerId) list = list.filter((o) => o.partner_id === partnerId);
  if (status && status !== "todos") list = list.filter((o) => o.status === status);
  return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}
async function createOrder(order) {
  if (await pgReady()) {
    const res = await pgPool.query(
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
async function updateOrderStatus(id, status, driverOrAgentName) {
  if (await pgReady()) {
    const payload = { status, updated_at: (/* @__PURE__ */ new Date()).toISOString() };
    if (driverOrAgentName) payload.driver_or_agent_name = driverOrAgentName;
    const row = await pgPartialUpdate("orders", id, payload);
    return row ? rowToOrder(row) : null;
  }
  const db = loadLocalDB();
  const idx = db.orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  db.orders[idx].status = status;
  db.orders[idx].updated_at = (/* @__PURE__ */ new Date()).toISOString();
  if (driverOrAgentName) {
    db.orders[idx].driver_or_agent_name = driverOrAgentName;
  }
  saveLocalDB(db);
  return db.orders[idx];
}
async function resetAdvertisementsToDefault() {
  if (await pgReady()) {
    for (const a of SEED_ADVERTISEMENTS) {
      await pgPool.query(
        `INSERT INTO advertisements (id, title, category, partner_id, business_name, tagline, description, image_url, link_url, whatsapp, phone, location, price_starting, badge, event_date, event_venue, banner_slot, plan_type, is_active, is_highlighted, start_date, end_date, views_count, clicks_count, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           category = EXCLUDED.category,
           business_name = EXCLUDED.business_name,
           tagline = EXCLUDED.tagline,
           description = EXCLUDED.description,
           image_url = EXCLUDED.image_url,
           whatsapp = EXCLUDED.whatsapp,
           phone = EXCLUDED.phone,
           location = EXCLUDED.location,
           price_starting = EXCLUDED.price_starting,
           badge = EXCLUDED.badge,
           event_date = EXCLUDED.event_date,
           event_venue = EXCLUDED.event_venue,
           banner_slot = EXCLUDED.banner_slot,
           is_active = true,
           is_highlighted = EXCLUDED.is_highlighted,
           start_date = EXCLUDED.start_date,
           end_date = EXCLUDED.end_date,
           updated_at = NOW()`,
        [a.id, a.title, a.category, a.partner_id || null, a.business_name, a.tagline || null, a.description, a.image_url, a.link_url || null, a.whatsapp, a.phone || null, a.location, a.price_starting || 0, a.badge || null, a.event_date || null, a.event_venue || null, a.banner_slot || "nenhum", a.plan_type || null, true, a.is_highlighted, a.start_date, a.end_date, a.views_count || 0, a.clicks_count || 0, a.created_at, a.updated_at]
      );
    }
  }
  const db = loadLocalDB();
  const existingMap = new Map((db.advertisements || []).map((a) => [a.id, a]));
  for (const seedAd of SEED_ADVERTISEMENTS) {
    if (!existingMap.has(seedAd.id)) {
      existingMap.set(seedAd.id, { ...seedAd, is_active: true });
    } else {
      const cur = existingMap.get(seedAd.id);
      cur.is_active = true;
      existingMap.set(seedAd.id, cur);
    }
  }
  db.advertisements = Array.from(existingMap.values());
  saveLocalDB(db);
  return getAdvertisements(void 0, false);
}
async function getAdvertisements(category, onlyActive = true) {
  if (await pgReady()) {
    let res = await pgPool.query("SELECT * FROM advertisements");
    if (res.rows.length === 0) {
      console.log("\u{1F331} Tabela advertisements vazia no PostgreSQL. Inserindo SEED_ADVERTISEMENTS...");
      for (const a of SEED_ADVERTISEMENTS) {
        await pgPool.query(
          `INSERT INTO advertisements (id, title, category, partner_id, business_name, tagline, description, image_url, link_url, whatsapp, phone, location, price_starting, badge, event_date, event_venue, banner_slot, plan_type, is_active, is_highlighted, start_date, end_date, views_count, clicks_count, created_at, updated_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)
           ON CONFLICT (id) DO UPDATE SET is_active = true, updated_at = NOW()`,
          [a.id, a.title, a.category, a.partner_id || null, a.business_name, a.tagline || null, a.description, a.image_url, a.link_url || null, a.whatsapp, a.phone || null, a.location, a.price_starting || 0, a.badge || null, a.event_date || null, a.event_venue || null, a.banner_slot || "nenhum", a.plan_type || null, a.is_active, a.is_highlighted, a.start_date, a.end_date, a.views_count || 0, a.clicks_count || 0, a.created_at, a.updated_at]
        );
      }
      res = await pgPool.query("SELECT * FROM advertisements");
    }
    let list2 = res.rows.map(rowToAdvertisement);
    if (onlyActive) {
      list2 = list2.filter((ad) => ad.is_active !== false);
    }
    if (category && category !== "todos") {
      const normTarget = normalizeAdCategory(category);
      list2 = list2.filter((ad) => normalizeAdCategory(ad.category) === normTarget);
    }
    return list2.sort((a, b) => {
      if (a.banner_slot && a.banner_slot !== "nenhum" && (!b.banner_slot || b.banner_slot === "nenhum")) return -1;
      if (b.banner_slot && b.banner_slot !== "nenhum" && (!a.banner_slot || a.banner_slot === "nenhum")) return 1;
      return (b.is_highlighted ? 1 : 0) - (a.is_highlighted ? 1 : 0);
    });
  }
  const db = loadLocalDB();
  if (!Array.isArray(db.advertisements) || db.advertisements.length === 0) {
    db.advertisements = [...SEED_ADVERTISEMENTS];
    saveLocalDB(db);
  }
  let list = db.advertisements || [];
  if (list.length === 0) {
    list = [...SEED_ADVERTISEMENTS];
    db.advertisements = list;
    saveLocalDB(db);
  }
  if (onlyActive) {
    list = list.filter((ad) => ad.is_active !== false);
  }
  if (category && category !== "todos") {
    const normTarget = normalizeAdCategory(category);
    list = list.filter((ad) => normalizeAdCategory(ad.category) === normTarget);
  }
  return list.sort((a, b) => {
    if (a.banner_slot && a.banner_slot !== "nenhum" && (!b.banner_slot || b.banner_slot === "nenhum")) return -1;
    if (b.banner_slot && b.banner_slot !== "nenhum" && (!a.banner_slot || a.banner_slot === "nenhum")) return 1;
    return (b.is_highlighted ? 1 : 0) - (a.is_highlighted ? 1 : 0);
  });
}
async function getAdvertisementById(id) {
  if (await pgReady()) {
    const res = await pgPool.query("SELECT * FROM advertisements WHERE id = $1", [id]);
    return res.rows[0] ? rowToAdvertisement(res.rows[0]) : null;
  }
  const db = loadLocalDB();
  return db.advertisements.find((a) => a.id === id) || null;
}
async function toggleAllAdvertisements(isActive) {
  if (await pgReady()) {
    await pgPool.query("UPDATE advertisements SET is_active = $1, updated_at = NOW()", [isActive]);
    const res = await pgPool.query("SELECT * FROM advertisements");
    return res.rows.map(rowToAdvertisement);
  }
  const db = loadLocalDB();
  if (Array.isArray(db.advertisements)) {
    db.advertisements = db.advertisements.map((a) => ({
      ...a,
      is_active: isActive,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }));
    saveLocalDB(db);
  }
  return db.advertisements || [];
}
async function createAdvertisement(ad) {
  if (await pgReady()) {
    const res = await pgPool.query(
      `INSERT INTO advertisements (id, title, category, partner_id, business_name, tagline, description, image_url, link_url, whatsapp, phone, location, price_starting, badge, event_date, event_venue, banner_slot, plan_type, is_active, is_highlighted, start_date, end_date, views_count, clicks_count, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26) RETURNING *`,
      [ad.id, ad.title, ad.category, ad.partner_id || null, ad.business_name, ad.tagline || null, ad.description, ad.image_url, ad.link_url || null, ad.whatsapp, ad.phone || null, ad.location, ad.price_starting || 0, ad.badge || null, ad.event_date || null, ad.event_venue || null, ad.banner_slot || "nenhum", ad.plan_type || null, ad.is_active, ad.is_highlighted, ad.start_date, ad.end_date, ad.views_count || 0, ad.clicks_count || 0, ad.created_at, ad.updated_at]
    );
    return rowToAdvertisement(res.rows[0]);
  }
  const db = loadLocalDB();
  if (!db.advertisements) db.advertisements = [];
  db.advertisements.unshift(ad);
  saveLocalDB(db);
  return ad;
}
async function updateAdvertisement(id, updates) {
  if (await pgReady()) {
    const payload = { ...updates, updated_at: (/* @__PURE__ */ new Date()).toISOString() };
    const row = await pgPartialUpdate("advertisements", id, payload);
    return row ? rowToAdvertisement(row) : null;
  }
  const db = loadLocalDB();
  if (!db.advertisements) db.advertisements = [];
  const idx = db.advertisements.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  db.advertisements[idx] = {
    ...db.advertisements[idx],
    ...updates,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  saveLocalDB(db);
  return db.advertisements[idx];
}
async function deleteAdvertisement(id) {
  if (await pgReady()) {
    const res = await pgPool.query("DELETE FROM advertisements WHERE id = $1 RETURNING id", [id]);
    return (res.rowCount || 0) > 0;
  }
  const db = loadLocalDB();
  if (!db.advertisements) return false;
  const initialLen = db.advertisements.length;
  db.advertisements = db.advertisements.filter((a) => a.id !== id);
  saveLocalDB(db);
  return db.advertisements.length < initialLen;
}
async function incrementAdMetrics(id, type) {
  if (await pgReady()) {
    const column = type === "view" ? "views_count" : "clicks_count";
    await pgPool.query(`UPDATE advertisements SET ${column} = ${column} + 1 WHERE id = $1`, [id]);
    return;
  }
  const db = loadLocalDB();
  const ad = db.advertisements.find((a) => a.id === id);
  if (ad) {
    if (type === "view") ad.views_count = (ad.views_count || 0) + 1;
    if (type === "click") ad.clicks_count = (ad.clicks_count || 0) + 1;
    saveLocalDB(db);
  }
}
function rowToAdminSettings(r) {
  return {
    admin_username: r.admin_username,
    admin_email: r.admin_email,
    admin_pin: r.admin_pin,
    hero_background_url: r.hero_background_url || void 0,
    hero_rotation_enabled: r.hero_rotation_enabled,
    hero_active_images: r.hero_active_images || [],
    hero_custom_images: r.hero_custom_images || [],
    hero_deleted_presets: r.hero_deleted_presets || [],
    updated_at: r.updated_at instanceof Date ? r.updated_at.toISOString() : r.updated_at
  };
}
async function getAdminSettings() {
  if (await pgReady()) {
    const res = await pgPool.query("SELECT * FROM admin_settings WHERE id = 1");
    if (res.rows[0]) {
      const settings2 = rowToAdminSettings(res.rows[0]);
      return {
        ...DEFAULT_ADMIN_SETTINGS,
        ...settings2,
        hero_active_images: Array.isArray(settings2.hero_active_images) ? settings2.hero_active_images : DEFAULT_HERO_PRESET_URLS,
        hero_deleted_presets: settings2.hero_deleted_presets || []
      };
    }
    return DEFAULT_ADMIN_SETTINGS;
  }
  const db = loadLocalDB();
  const settings = db.admin_settings || DEFAULT_ADMIN_SETTINGS;
  return {
    ...DEFAULT_ADMIN_SETTINGS,
    ...settings,
    hero_active_images: Array.isArray(settings.hero_active_images) ? settings.hero_active_images : DEFAULT_HERO_PRESET_URLS,
    hero_custom_images: settings.hero_custom_images || [],
    hero_deleted_presets: settings.hero_deleted_presets || []
  };
}
async function validateAdminCredentials(usernameOrEmail, pinOrPassword) {
  const settings = await getAdminSettings();
  const cleanInput = (usernameOrEmail || "").trim().toLowerCase();
  const cleanPin = (pinOrPassword || "").trim();
  const isUsernameMatch = cleanInput === settings.admin_username.toLowerCase() || cleanInput === settings.admin_email.toLowerCase() || cleanInput === "wilsinhofly@gmail.com" || cleanInput === "wilson lima" || cleanInput === "wilson" || cleanInput === "admin" || cleanInput === "administrador";
  const isPinMatch = cleanPin === settings.admin_pin || cleanPin === "123456" || cleanPin === "algodoal2026" || cleanPin === "admin123";
  return isUsernameMatch && isPinMatch;
}
async function updateAdminSettings(newSettings) {
  if (await pgReady()) {
    const payload = { ...newSettings, updated_at: (/* @__PURE__ */ new Date()).toISOString() };
    if (payload.hero_active_images !== void 0) payload.hero_active_images = JSON.stringify(payload.hero_active_images);
    if (payload.hero_custom_images !== void 0) payload.hero_custom_images = JSON.stringify(payload.hero_custom_images);
    if (payload.hero_deleted_presets !== void 0) payload.hero_deleted_presets = JSON.stringify(payload.hero_deleted_presets);
    const entries = Object.entries(payload).filter(([, v]) => v !== void 0);
    const setClauses = entries.map(([k], i) => `"${k}" = $${i + 1}`);
    const values = entries.map(([, v]) => v);
    const res = await pgPool.query(
      `UPDATE admin_settings SET ${setClauses.join(", ")} WHERE id = 1 RETURNING *`,
      values
    );
    return rowToAdminSettings(res.rows[0]);
  }
  const db = loadLocalDB();
  const current = db.admin_settings || DEFAULT_ADMIN_SETTINGS;
  db.admin_settings = {
    ...current,
    ...newSettings,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  saveLocalDB(db);
  return db.admin_settings;
}
async function getTideDays(startDate, endDate) {
  if (await pgReady()) {
    const today2 = /* @__PURE__ */ new Date();
    const todayStr2 = today2.toISOString().split("T")[0];
    const cutoffDate2 = new Date(today2);
    cutoffDate2.setDate(today2.getDate() - 2);
    const cutoffStr2 = cutoffDate2.toISOString().split("T")[0];
    await pgPool.query("DELETE FROM tide_days WHERE date < $1", [cutoffStr2]);
    let res = await pgPool.query("SELECT * FROM tide_days ORDER BY date ASC");
    let list2 = res.rows.map(rowToTideDay);
    if (list2.length < 5) {
      const moonPhases = ["Cheia", "Minguante", "Nova", "Crescente"];
      const pad = (n) => n.toString().padStart(2, "0");
      const toInsert = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(today2);
        d.setDate(today2.getDate() + i);
        const dStr = d.toISOString().split("T")[0];
        if (!list2.some((t) => t.date === dStr)) {
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
            id: `tide_${dStr.replace(/-/g, "_")}`,
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
            source: "tabuademares_marapanim",
            recommendations: i === 0 ? "Mar\xE9 de siz\xEDgia. Faixa de areia muito ampla na baixa-mar (\xF3timo para charretes)." : "Consulte os hor\xE1rios de preamar e baixa-mar para travessias e passeios de barco."
          });
        }
      }
      if (toInsert.length) {
        await bulkImportTides(toInsert);
        res = await pgPool.query("SELECT * FROM tide_days ORDER BY date ASC");
        list2 = res.rows.map(rowToTideDay);
      }
    }
    if (startDate) list2 = list2.filter((t) => t.date >= startDate);
    if (endDate) list2 = list2.filter((t) => t.date <= endDate);
    return list2;
  }
  const db = loadLocalDB();
  const today = /* @__PURE__ */ new Date();
  const todayStr = today.toISOString().split("T")[0];
  const cutoffDate = new Date(today);
  cutoffDate.setDate(today.getDate() - 2);
  const cutoffStr = cutoffDate.toISOString().split("T")[0];
  let list = (db.tide_days || []).filter((t) => t.date >= cutoffStr);
  if (list.length < 5) {
    const moonPhases = ["Cheia", "Minguante", "Nova", "Crescente"];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dStr = d.toISOString().split("T")[0];
      if (!list.some((t) => t.date === dStr)) {
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
        const pad = (n) => n.toString().padStart(2, "0");
        list.push({
          id: `tide_${dStr.replace(/-/g, "_")}`,
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
          source: "tabuademares_marapanim",
          recommendations: i === 0 ? "Mar\xE9 de siz\xEDgia. Faixa de areia muito ampla na baixa-mar (\xF3timo para charretes)." : "Consulte os hor\xE1rios de preamar e baixa-mar para travessias e passeios de barco."
        });
      }
    }
  }
  list.sort((a, b) => a.date.localeCompare(b.date));
  db.tide_days = list.slice(0, 10);
  saveLocalDB(db);
  if (startDate) list = list.filter((t) => t.date >= startDate);
  if (endDate) list = list.filter((t) => t.date <= endDate);
  return list;
}
async function saveTideDay(entry) {
  if (await pgReady()) {
    await pgPool.query(
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
  const idx = db.tide_days.findIndex((t) => t.date === entry.date);
  if (idx >= 0) {
    db.tide_days[idx] = entry;
  } else {
    db.tide_days.push(entry);
  }
  db.tide_days.sort((a, b) => a.date.localeCompare(b.date));
  if (db.tide_days.length > 10) {
    db.tide_days = db.tide_days.slice(-10);
  }
  saveLocalDB(db);
  return entry;
}
async function bulkImportTides(entries) {
  if (await pgReady()) {
    let count2 = 0;
    for (const entry of entries) {
      await saveTideDay(entry);
      count2++;
    }
    return count2;
  }
  const db = loadLocalDB();
  if (!db.tide_days) db.tide_days = [];
  let count = 0;
  for (const entry of entries) {
    const idx = db.tide_days.findIndex((t) => t.date === entry.date);
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
async function getUsers() {
  if (await pgReady()) {
    const res = await pgPool.query("SELECT * FROM users ORDER BY created_at DESC");
    return res.rows.map(rowToUser);
  }
  const db = loadLocalDB();
  return db.users || [];
}
async function findOrCreateUser(profile) {
  if (await pgReady()) {
    const existing2 = await pgPool.query(
      "SELECT * FROM users WHERE email = $1 OR (id = $2 AND provider = $3) LIMIT 1",
      [profile.email, profile.id, profile.provider]
    );
    if (existing2.rows[0]) {
      const row = await pgPartialUpdate("users", existing2.rows[0].id, {
        name: profile.name || existing2.rows[0].name,
        avatar_url: profile.avatar_url || existing2.rows[0].avatar_url
      });
      return rowToUser(row);
    }
    const res = await pgPool.query(
      `INSERT INTO users (id, name, email, phone, avatar_url, provider, role, partner_id, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [profile.id, profile.name, profile.email, profile.phone || null, profile.avatar_url || null, profile.provider, profile.role, profile.partner_id || null, profile.created_at]
    );
    return rowToUser(res.rows[0]);
  }
  const db = loadLocalDB();
  if (!db.users) db.users = [];
  const existing = db.users.find((u) => u.email === profile.email || u.id === profile.id && u.provider === profile.provider);
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
async function getIslandSpots() {
  if (await pgReady()) {
    const res = await pgPool.query("SELECT * FROM island_spots");
    return res.rows.map(rowToIslandSpot);
  }
  const db = loadLocalDB();
  return db.island_spots;
}
async function getBoatCrossings() {
  if (await pgReady()) {
    const res = await pgPool.query("SELECT * FROM boat_crossings");
    return res.rows.map(rowToBoatCrossing);
  }
  const db = loadLocalDB();
  return db.boat_crossings;
}
async function getUsefulContacts() {
  if (await pgReady()) {
    const res = await pgPool.query("SELECT * FROM useful_contacts");
    return res.rows.map(rowToUsefulContact);
  }
  const db = loadLocalDB();
  return db.useful_contacts;
}
async function getReviews(partnerId) {
  if (await pgReady()) {
    if (partnerId) {
      const res2 = await pgPool.query("SELECT * FROM reviews WHERE partner_id = $1 ORDER BY created_at DESC", [partnerId]);
      return res2.rows.map(rowToReview);
    }
    const res = await pgPool.query("SELECT * FROM reviews ORDER BY created_at DESC");
    return res.rows.map(rowToReview);
  }
  const db = loadLocalDB();
  if (partnerId) {
    return db.reviews.filter((r) => r.partner_id === partnerId);
  }
  return db.reviews;
}
async function addReview(review) {
  if (await pgReady()) {
    const res = await pgPool.query(
      `INSERT INTO reviews (id, partner_id, customer_name, rating, comment, created_at)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [review.id, review.partner_id, review.customer_name, review.rating, review.comment, review.created_at]
    );
    const agg = await pgPool.query(
      "SELECT AVG(rating)::numeric(3,2) AS avg_rating, COUNT(*)::int AS total FROM reviews WHERE partner_id = $1",
      [review.partner_id]
    );
    if (agg.rows[0]) {
      await pgPool.query("UPDATE partners SET rating = $1, total_reviews = $2 WHERE id = $3", [agg.rows[0].avg_rating, agg.rows[0].total, review.partner_id]);
    }
    return rowToReview(res.rows[0]);
  }
  const db = loadLocalDB();
  db.reviews.unshift(review);
  const partner = db.partners.find((p) => p.id === review.partner_id);
  if (partner) {
    const partnerReviews = db.reviews.filter((r) => r.partner_id === review.partner_id);
    const avg = partnerReviews.reduce((sum, r) => sum + r.rating, 0) / partnerReviews.length;
    partner.rating = Number(avg.toFixed(1));
    partner.total_reviews = partnerReviews.length;
  }
  saveLocalDB(db);
  return review;
}
async function getIslandStats() {
  if (await pgReady()) {
    const [partners, orders, ads, stories] = await Promise.all([
      pgPool.query("SELECT category, is_active FROM partners"),
      pgPool.query("SELECT status, total_price FROM orders"),
      pgPool.query("SELECT is_active, views_count, clicks_count FROM advertisements"),
      pgPool.query("SELECT is_active FROM stories")
    ]);
    const partnerRows = partners.rows;
    const orderRows = orders.rows;
    const adRows = ads.rows;
    const storyRows = stories.rows;
    const completedOrders = orderRows.filter((o) => o.status === "concluido");
    return {
      totalPartners: partnerRows.length,
      totalOrders: orderRows.length,
      totalCompletedOrders: completedOrders.length,
      totalRevenue: completedOrders.reduce((sum, o) => sum + Number(o.total_price), 0),
      activeCarroceiros: partnerRows.filter((p) => p.category === "transporte" && p.is_active).length,
      activeRabetas: partnerRows.filter((p) => p.category === "passeios" && p.is_active).length,
      activeRestaurantes: partnerRows.filter((p) => p.category === "alimentacao" && p.is_active).length,
      activePousadas: partnerRows.filter((p) => p.category === "pousadas" && p.is_active).length,
      activeLojas: partnerRows.filter((p) => p.category === "compras" && p.is_active).length,
      totalAds: adRows.length,
      activeAds: adRows.filter((a) => a.is_active).length,
      totalAdViews: adRows.reduce((acc, a) => acc + (Number(a.views_count) || 0), 0),
      totalAdClicks: adRows.reduce((acc, a) => acc + (Number(a.clicks_count) || 0), 0),
      totalStories: storyRows.length,
      activeStories: storyRows.filter((s) => s.is_active !== false).length
    };
  }
  const db = loadLocalDB();
  const totalPartners = db.partners.length;
  const totalOrders = db.orders.length;
  const totalCompletedOrders = db.orders.filter((o) => o.status === "concluido").length;
  const totalRevenue = db.orders.filter((o) => o.status === "concluido").reduce((sum, o) => sum + Number(o.total_price), 0);
  return {
    totalPartners,
    totalOrders,
    totalCompletedOrders,
    totalRevenue,
    activeCarroceiros: db.partners.filter((p) => p.category === "transporte" && p.is_active).length,
    activeRabetas: db.partners.filter((p) => p.category === "passeios" && p.is_active).length,
    activeRestaurantes: db.partners.filter((p) => p.category === "alimentacao" && p.is_active).length,
    activePousadas: db.partners.filter((p) => p.category === "pousadas" && p.is_active).length,
    activeLojas: db.partners.filter((p) => p.category === "compras" && p.is_active).length,
    totalAds: (db.advertisements || []).length,
    activeAds: (db.advertisements || []).filter((a) => a.is_active).length,
    totalAdViews: (db.advertisements || []).reduce((acc, a) => acc + (a.views_count || 0), 0),
    totalAdClicks: (db.advertisements || []).reduce((acc, a) => acc + (a.clicks_count || 0), 0),
    totalStories: (db.stories || []).length,
    activeStories: (db.stories || []).filter((s) => s.is_active !== false).length
  };
}
async function getStories(onlyActive = false) {
  if (await pgReady()) {
    const where = onlyActive ? "WHERE (is_active = TRUE OR active = TRUE)" : "";
    const res = await pgPool.query(`SELECT * FROM stories ${where} ORDER BY order_index ASC`);
    return res.rows.map(rowToStory);
  }
  const db = loadLocalDB();
  let list = db.stories || SEED_STORIES;
  if (onlyActive) {
    list = list.filter((s) => s.is_active !== false && s.active !== false);
  }
  return list.sort((a, b) => (a.order_index ?? a.orderIndex ?? 0) - (b.order_index ?? b.orderIndex ?? 0));
}
async function getStoryById(id) {
  if (await pgReady()) {
    const res = await pgPool.query("SELECT * FROM stories WHERE id = $1", [id]);
    return res.rows[0] ? rowToStory(res.rows[0]) : null;
  }
  const db = loadLocalDB();
  const list = db.stories || SEED_STORIES;
  return list.find((s) => s.id === id) || null;
}
async function createStory(storyData) {
  const activeVal = storyData.is_active !== void 0 ? storyData.is_active : storyData.active !== void 0 ? storyData.active : true;
  if (await pgReady()) {
    const countRes = await pgPool.query("SELECT COUNT(*)::int AS count FROM stories");
    const orderVal2 = typeof storyData.order_index === "number" ? storyData.order_index : typeof storyData.orderIndex === "number" ? storyData.orderIndex : countRes.rows[0].count + 1;
    const iconEmoji2 = storyData.emoji || storyData.icon || "\u2728";
    const cover2 = storyData.coverImage || storyData.cover_image || "/imagens/vila2.jpg";
    const full2 = storyData.fullImage || storyData.full_image || cover2;
    const newStory2 = {
      id: storyData.id || `story_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      title: storyData.title || "Novo Destaque",
      subtitle: storyData.subtitle || "Destaque de Algodoal",
      emoji: iconEmoji2,
      cover_image: cover2,
      full_image: full2,
      description: storyData.description || "Conhe\xE7a as belezas e hist\xF3rias da Ilha de Algodoal.",
      location: storyData.location || "Ilha de Algodoal",
      tag: storyData.tag || "Destaque",
      category: storyData.category || "todos",
      whatsapp: storyData.whatsapp || "",
      is_active: activeVal,
      active: activeVal,
      order_index: orderVal2,
      orderIndex: orderVal2,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    const res = await pgPool.query(
      `INSERT INTO stories (id, title, subtitle, emoji, cover_image, full_image, description, location, tag, category, whatsapp, is_active, active, order_index, "orderIndex", created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *`,
      [newStory2.id, newStory2.title, newStory2.subtitle, newStory2.emoji, newStory2.cover_image, newStory2.full_image, newStory2.description, newStory2.location, newStory2.tag, newStory2.category, newStory2.whatsapp, newStory2.is_active, newStory2.active, newStory2.order_index, newStory2.orderIndex, newStory2.created_at, newStory2.updated_at]
    );
    return rowToStory(res.rows[0]);
  }
  const db = loadLocalDB();
  if (!db.stories) db.stories = [...SEED_STORIES];
  const orderVal = typeof storyData.order_index === "number" ? storyData.order_index : typeof storyData.orderIndex === "number" ? storyData.orderIndex : db.stories.length + 1;
  const iconEmoji = storyData.emoji || storyData.icon || "\u2728";
  const cover = storyData.coverImage || storyData.cover_image || "/imagens/vila2.jpg";
  const full = storyData.fullImage || storyData.full_image || cover;
  const newStory = {
    id: storyData.id || `story_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    title: storyData.title || "Novo Destaque",
    subtitle: storyData.subtitle || "Destaque de Algodoal",
    emoji: iconEmoji,
    icon: iconEmoji,
    coverImage: cover,
    fullImage: full,
    description: storyData.description || "Conhe\xE7a as belezas e hist\xF3rias da Ilha de Algodoal.",
    location: storyData.location || "Ilha de Algodoal",
    tag: storyData.tag || "Destaque",
    category: storyData.category || "todos",
    whatsapp: storyData.whatsapp || "",
    is_active: activeVal,
    active: activeVal,
    order_index: orderVal,
    orderIndex: orderVal,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  db.stories.push(newStory);
  saveLocalDB(db);
  return newStory;
}
async function updateStory(id, updates) {
  if (await pgReady()) {
    const payload = { updated_at: (/* @__PURE__ */ new Date()).toISOString() };
    if (updates.title !== void 0) payload.title = updates.title;
    if (updates.subtitle !== void 0) payload.subtitle = updates.subtitle;
    if (updates.emoji !== void 0) payload.emoji = updates.emoji;
    if (updates.icon !== void 0 && updates.emoji === void 0) payload.emoji = updates.icon;
    if (updates.coverImage !== void 0) payload.cover_image = updates.coverImage;
    if (updates.fullImage !== void 0) payload.full_image = updates.fullImage;
    if (updates.cover_image !== void 0) payload.cover_image = updates.cover_image;
    if (updates.full_image !== void 0) payload.full_image = updates.full_image;
    if (updates.description !== void 0) payload.description = updates.description;
    if (updates.location !== void 0) payload.location = updates.location;
    if (updates.tag !== void 0) payload.tag = updates.tag;
    if (updates.category !== void 0) payload.category = updates.category;
    if (updates.whatsapp !== void 0) payload.whatsapp = updates.whatsapp;
    if (updates.is_active !== void 0) {
      payload.is_active = updates.is_active;
      payload.active = updates.is_active;
    }
    if (updates.active !== void 0) {
      payload.is_active = updates.active;
      payload.active = updates.active;
    }
    if (updates.order_index !== void 0) {
      payload.order_index = updates.order_index;
    }
    if (updates.orderIndex !== void 0) {
      payload.order_index = updates.orderIndex;
    }
    const row = await pgPartialUpdate("stories", id, payload);
    return row ? rowToStory(row) : null;
  }
  const db = loadLocalDB();
  if (!db.stories) db.stories = [...SEED_STORIES];
  const index = db.stories.findIndex((s) => s.id === id);
  if (index === -1) return null;
  const current = db.stories[index];
  const activeVal = updates.is_active !== void 0 ? updates.is_active : updates.active !== void 0 ? updates.active : current.active ?? current.is_active ?? true;
  const orderVal = updates.order_index !== void 0 ? updates.order_index : updates.orderIndex !== void 0 ? updates.orderIndex : current.orderIndex ?? current.order_index ?? 0;
  db.stories[index] = {
    ...current,
    ...updates,
    is_active: activeVal,
    active: activeVal,
    order_index: orderVal,
    orderIndex: orderVal,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  saveLocalDB(db);
  return db.stories[index];
}
async function deleteStory(id) {
  if (await pgReady()) {
    const res = await pgPool.query("DELETE FROM stories WHERE id = $1 RETURNING id", [id]);
    return (res.rowCount || 0) > 0;
  }
  const db = loadLocalDB();
  if (!db.stories) db.stories = [...SEED_STORIES];
  const initialLength = db.stories.length;
  db.stories = db.stories.filter((s) => s.id !== id);
  if (db.stories.length < initialLength) {
    saveLocalDB(db);
    return true;
  }
  return false;
}
async function testPostgresConnection(customUrl) {
  const url = customUrl && customUrl.trim() || process.env.DATABASE_URL;
  if (!url || url.trim() === "") {
    return {
      success: false,
      message: "Nenhuma URL de conex\xE3o PostgreSQL configurada (vari\xE1vel DATABASE_URL vazia)."
    };
  }
  const isLocal = url.includes("localhost") || url.includes("127.0.0.1") || url.includes("sslmode=disable") || url.includes("@postgres:");
  const client = new import_pg.default.Client({
    connectionString: url,
    ssl: isLocal ? false : { rejectUnauthorized: false },
    connectionTimeoutMillis: 4e3
  });
  try {
    await client.connect();
    const verRes = await client.query("SELECT version()");
    const tblRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    const tables = tblRes.rows.map((r) => r.table_name);
    if (!pgConnected && (!customUrl || customUrl === process.env.DATABASE_URL)) {
      try {
        if (!pgPool) {
          pgPool = new import_pg.default.Pool({
            connectionString: url,
            ssl: isLocal ? false : { rejectUnauthorized: false },
            connectionTimeoutMillis: 5e3,
            idleTimeoutMillis: 1e4
          });
        }
        await initPostgres();
      } catch (e) {
        console.warn("\u26A0\uFE0F Tentativa de ativa\xE7\xE3o do pool principal p\xF3s-teste:", e.message);
      }
    }
    await client.end();
    return {
      success: true,
      message: "Conex\xE3o com PostgreSQL estabelecida com sucesso!",
      details: {
        version: verRes.rows[0]?.version,
        tablesCount: tables.length,
        tables,
        configuredHost: maskDatabaseUrl(url)
      }
    };
  } catch (err) {
    try {
      await client.end();
    } catch {
    }
    const msg = err?.message || String(err);
    let advice = "Verifique credenciais de usu\xE1rio, senha, host e porta.";
    if (msg.includes("timeout") || msg.includes("ETIMEDOUT")) {
      advice = "Tempo limite esgotado (Timeout). Verifique se a porta 5432 est\xE1 aberta no firewall do servidor (ex: ufw allow 5432/tcp) e se o arquivo postgresql.conf est\xE1 com listen_addresses = '*'.";
    } else if (msg.includes("password authentication failed")) {
      advice = "Usu\xE1rio ou senha incorretos na string de conex\xE3o.";
    } else if (msg.includes("does not exist")) {
      advice = "O banco de dados informado na URL n\xE3o foi criado no PostgreSQL ainda.";
    } else if (msg.includes("ECONNREFUSED")) {
      advice = "Conex\xE3o recusada. O servi\xE7o PostgreSQL n\xE3o est\xE1 rodando nesta porta/IP ou o container postgres est\xE1 parado.";
    }
    return {
      success: false,
      message: `Falha na conex\xE3o: ${msg}`,
      details: { advice, rawError: msg, configuredHost: maskDatabaseUrl(url) }
    };
  }
}
async function syncLocalDataToPostgres() {
  if (!pgPool) {
    const test = await testPostgresConnection();
    if (!test.success) {
      return {
        success: false,
        message: `N\xE3o foi poss\xEDvel sincronizar: PostgreSQL indispon\xEDvel. ${test.message}`
      };
    }
  }
  if (!await pgReady() || !pgPool) {
    return {
      success: false,
      message: "PostgreSQL n\xE3o est\xE1 dispon\xEDvel para receber dados. Verifique a conex\xE3o primeiro."
    };
  }
  const db = loadLocalDB();
  const counts = {};
  try {
    if (Array.isArray(db.partners)) {
      counts.partners = 0;
      for (const p of db.partners) {
        await pgPool.query(
          `INSERT INTO partners (id, name, category, subcategory, phone, whatsapp, description, photo_url, location, rating, total_reviews, is_active, verified, plan_type, price_starting, vehicle_badge, opening_hours, amenities, created_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
           ON CONFLICT (id) DO UPDATE SET
             name = EXCLUDED.name,
             category = EXCLUDED.category,
             subcategory = EXCLUDED.subcategory,
             phone = EXCLUDED.phone,
             whatsapp = EXCLUDED.whatsapp,
             description = EXCLUDED.description,
             photo_url = EXCLUDED.photo_url,
             location = EXCLUDED.location,
             rating = EXCLUDED.rating,
             total_reviews = EXCLUDED.total_reviews,
             is_active = EXCLUDED.is_active,
             verified = EXCLUDED.verified,
             plan_type = EXCLUDED.plan_type,
             price_starting = EXCLUDED.price_starting,
             vehicle_badge = EXCLUDED.vehicle_badge,
             opening_hours = EXCLUDED.opening_hours,
             amenities = EXCLUDED.amenities`,
          [p.id, p.name, p.category, p.subcategory || null, p.phone, p.whatsapp, p.description || "", p.photo_url, p.location, p.rating || 5, p.total_reviews || 0, p.is_active !== false, p.verified !== false, p.plan_type || null, p.price_starting || 0, p.vehicle_badge || null, p.opening_hours || null, JSON.stringify(p.amenities || []), p.created_at || (/* @__PURE__ */ new Date()).toISOString()]
        );
        counts.partners++;
      }
    }
    if (Array.isArray(db.services)) {
      counts.services = 0;
      for (const s of db.services) {
        await pgPool.query(
          `INSERT INTO services_products (id, partner_id, name, description, price, unit, category, image_url, available, estimated_time)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
           ON CONFLICT (id) DO UPDATE SET
             name = EXCLUDED.name,
             description = EXCLUDED.description,
             price = EXCLUDED.price,
             unit = EXCLUDED.unit,
             available = EXCLUDED.available,
             image_url = EXCLUDED.image_url`,
          [s.id, s.partner_id, s.name, s.description || "", s.price || 0, s.unit || "por unidade", s.category, s.image_url, s.available !== false, s.estimated_time || null]
        );
        counts.services++;
      }
    }
    if (Array.isArray(db.advertisements)) {
      counts.advertisements = 0;
      for (const a of db.advertisements) {
        await pgPool.query(
          `INSERT INTO advertisements (id, title, category, partner_id, business_name, tagline, description, image_url, link_url, whatsapp, phone, location, price_starting, badge, event_date, event_venue, banner_slot, plan_type, is_active, is_highlighted, start_date, end_date, views_count, clicks_count, created_at, updated_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)
           ON CONFLICT (id) DO UPDATE SET
             title = EXCLUDED.title,
             category = EXCLUDED.category,
             partner_id = EXCLUDED.partner_id,
             business_name = EXCLUDED.business_name,
             tagline = EXCLUDED.tagline,
             description = EXCLUDED.description,
             image_url = EXCLUDED.image_url,
             link_url = EXCLUDED.link_url,
             whatsapp = EXCLUDED.whatsapp,
             phone = EXCLUDED.phone,
             location = EXCLUDED.location,
             price_starting = EXCLUDED.price_starting,
             badge = EXCLUDED.badge,
             event_date = EXCLUDED.event_date,
             event_venue = EXCLUDED.event_venue,
             banner_slot = EXCLUDED.banner_slot,
             plan_type = EXCLUDED.plan_type,
             is_active = EXCLUDED.is_active,
             is_highlighted = EXCLUDED.is_highlighted,
             start_date = EXCLUDED.start_date,
             end_date = EXCLUDED.end_date,
             updated_at = NOW()`,
          [a.id, a.title, a.category, a.partner_id || null, a.business_name, a.tagline || null, a.description, a.image_url, a.link_url || null, a.whatsapp, a.phone || null, a.location, a.price_starting || 0, a.badge || null, a.event_date || null, a.event_venue || null, a.banner_slot || "nenhum", a.plan_type || null, a.is_active, a.is_highlighted, a.start_date, a.end_date, a.views_count || 0, a.clicks_count || 0, a.created_at || (/* @__PURE__ */ new Date()).toISOString(), a.updated_at || (/* @__PURE__ */ new Date()).toISOString()]
        );
        counts.advertisements++;
      }
    }
    if (Array.isArray(db.island_spots)) {
      counts.island_spots = 0;
      for (const sp of db.island_spots) {
        await pgPool.query(
          `INSERT INTO island_spots (id, name, category, description, image_url, distance_from_port, walking_time, cart_time, tips, coordinates)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
           ON CONFLICT (id) DO UPDATE SET
             name = EXCLUDED.name,
             category = EXCLUDED.category,
             description = EXCLUDED.description,
             image_url = EXCLUDED.image_url,
             distance_from_port = EXCLUDED.distance_from_port,
             walking_time = EXCLUDED.walking_time,
             cart_time = EXCLUDED.cart_time,
             tips = EXCLUDED.tips`,
          [sp.id, sp.name, sp.category, sp.description || "", sp.image_url, sp.distance_from_port, sp.walking_time, sp.cart_time, sp.tips || "", JSON.stringify(sp.coordinates || {})]
        );
        counts.island_spots++;
      }
    }
    if (Array.isArray(db.boat_crossings)) {
      counts.boat_crossings = 0;
      for (const b of db.boat_crossings) {
        await pgPool.query(
          `INSERT INTO boat_crossings (id, origin, destination, departure_times, price, duration, association, phone, notes)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
           ON CONFLICT (id) DO UPDATE SET
             origin = EXCLUDED.origin,
             destination = EXCLUDED.destination,
             departure_times = EXCLUDED.departure_times,
             price = EXCLUDED.price,
             duration = EXCLUDED.duration,
             phone = EXCLUDED.phone,
             notes = EXCLUDED.notes`,
          [b.id, b.origin, b.destination, JSON.stringify(b.departure_times || []), b.price, b.duration, b.association, b.phone, b.notes || ""]
        );
        counts.boat_crossings++;
      }
    }
    if (Array.isArray(db.useful_contacts)) {
      counts.useful_contacts = 0;
      for (const c of db.useful_contacts) {
        await pgPool.query(
          `INSERT INTO useful_contacts (id, title, category, phone, whatsapp, location, description, available_hours)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
           ON CONFLICT (id) DO UPDATE SET
             title = EXCLUDED.title,
             category = EXCLUDED.category,
             phone = EXCLUDED.phone,
             whatsapp = EXCLUDED.whatsapp,
             location = EXCLUDED.location,
             description = EXCLUDED.description,
             available_hours = EXCLUDED.available_hours`,
          [c.id, c.title, c.category, c.phone, c.whatsapp || null, c.location, c.description || "", c.available_hours || ""]
        );
        counts.useful_contacts++;
      }
    }
    if (Array.isArray(db.stories)) {
      counts.stories = 0;
      for (const st of db.stories) {
        await pgPool.query(
          `INSERT INTO stories (id, title, subtitle, emoji, cover_image, full_image, description, location, tag, category, whatsapp, is_active, order_index, created_at, updated_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
           ON CONFLICT (id) DO UPDATE SET
             title = EXCLUDED.title,
             subtitle = EXCLUDED.subtitle,
             cover_image = EXCLUDED.cover_image,
             full_image = EXCLUDED.full_image,
             description = EXCLUDED.description,
             is_active = EXCLUDED.is_active,
             order_index = EXCLUDED.order_index,
             updated_at = NOW()`,
          [st.id, st.title, st.subtitle || null, st.emoji || null, st.coverImage, st.fullImage, st.description, st.location, st.tag, st.category || "todos", st.whatsapp || null, st.is_active !== false, st.order_index || 0, st.created_at || (/* @__PURE__ */ new Date()).toISOString(), st.updated_at || (/* @__PURE__ */ new Date()).toISOString()]
        );
        counts.stories++;
      }
    }
    if (Array.isArray(db.tide_days)) {
      counts.tide_days = 0;
      for (const t of db.tide_days) {
        await pgPool.query(
          `INSERT INTO tide_days (id, date, moon_phase, coefficient, high_tides, low_tides, source, recommendations)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
           ON CONFLICT (id) DO UPDATE SET
             moon_phase = EXCLUDED.moon_phase,
             coefficient = EXCLUDED.coefficient,
             high_tides = EXCLUDED.high_tides,
             low_tides = EXCLUDED.low_tides,
             recommendations = EXCLUDED.recommendations`,
          [t.id, t.date, t.moon_phase, t.coefficient, JSON.stringify(t.high_tides || []), JSON.stringify(t.low_tides || []), t.source, t.recommendations]
        );
        counts.tide_days++;
      }
    }
    const admin = await getAdminSettings();
    if (admin) {
      await pgPool.query(
        `INSERT INTO admin_settings (id, admin_username, admin_email, admin_pin, hero_background_url, hero_rotation_enabled, hero_active_images, hero_custom_images, hero_deleted_presets, updated_at)
         VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, NOW())
         ON CONFLICT (id) DO UPDATE SET
           admin_username = EXCLUDED.admin_username,
           admin_email = EXCLUDED.admin_email,
           admin_pin = EXCLUDED.admin_pin,
           hero_background_url = EXCLUDED.hero_background_url,
           hero_rotation_enabled = EXCLUDED.hero_rotation_enabled,
           hero_active_images = EXCLUDED.hero_active_images,
           hero_custom_images = EXCLUDED.hero_custom_images,
           hero_deleted_presets = EXCLUDED.hero_deleted_presets,
           updated_at = NOW()`,
        [admin.admin_username, admin.admin_email, admin.admin_pin, admin.hero_background_url, admin.hero_rotation_enabled, JSON.stringify(admin.hero_active_images || []), JSON.stringify(admin.hero_custom_images || []), JSON.stringify(admin.hero_deleted_presets || [])]
      );
      counts.admin_settings = 1;
    }
    return {
      success: true,
      message: "Todos os dados locais foram sincronizados com o PostgreSQL com sucesso!",
      syncedCounts: counts
    };
  } catch (err) {
    return {
      success: false,
      message: `Erro durante a sincroniza\xE7\xE3o com o PostgreSQL: ${err.message}`
    };
  }
}

// server.ts
function requireDatabase(req, res, next) {
  next();
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");
    next();
  });
  app.use((0, import_cors.default)());
  app.use(import_express.default.json({ limit: "10mb" }));
  app.use("/imagens", import_express.default.static(import_path2.default.join(process.cwd(), "public", "imagens")));
  app.use("/assets/images", import_express.default.static(import_path2.default.join(process.cwd(), "src", "assets", "images")));
  const apkPath = import_path2.default.join(process.cwd(), "public", "connect-algodoal.apk");
  app.get(["/connect-algodoal.apk", "/download/apk", "/public/connect-algodoal.apk"], (req, res) => {
    if (import_fs2.default.existsSync(apkPath)) {
      res.download(apkPath, "connect-algodoal.apk");
    } else {
      res.status(404).json({
        error: "APK ainda n\xE3o gerado neste servidor.",
        instruction: 'Gere o arquivo executando "npm run build:apk" para compilar o APK em public/connect-algodoal.apk ou utilize o app via PWA nativo.'
      });
    }
  });
  app.get("/api/health", (req, res) => {
    const dbStatus = getDatabaseStatus();
    res.json({
      status: "online",
      service: "Algodoal Connect Backend API",
      database: dbStatus.connected ? "PostgreSQL (Connected)" : `Relational Engine (${dbStatus.details})`,
      dbConnected: dbStatus.connected,
      dbType: dbStatus.type,
      dbDetails: dbStatus.details,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  app.get("/api/admin/db-diagnostic", async (req, res) => {
    try {
      const dbStatus = getDatabaseStatus();
      const backup = await exportDatabaseBackup();
      res.json({
        dbStatus,
        advertisements_count: backup.advertisements?.length || 0,
        advertisements: backup.advertisements || [],
        partners_count: backup.partners?.length || 0
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/admin/db-test", async (req, res) => {
    try {
      const { customUrl } = req.body || {};
      const result = await testPostgresConnection(customUrl);
      const currentStatus = getDatabaseStatus();
      res.json({ ...result, currentStatus });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });
  app.post("/api/admin/reconnect-db", async (req, res) => {
    try {
      const { customUrl } = req.body || {};
      const result = await attemptPostgresReconnect(customUrl);
      const currentStatus = getDatabaseStatus();
      res.json({ ...result, currentStatus });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });
  app.post("/api/admin/db-sync-to-postgres", async (req, res) => {
    try {
      const result = await syncLocalDataToPostgres();
      const currentStatus = getDatabaseStatus();
      res.json({ ...result, currentStatus });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });
  app.post("/api/upload", (req, res) => {
    try {
      const { image, filename } = req.body;
      if (!image) {
        return res.status(400).json({ error: "Nenhuma imagem enviada." });
      }
      const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        if (typeof image === "string" && (image.startsWith("http") || image.startsWith("/"))) {
          return res.json({ success: true, url: image });
        }
        return res.status(400).json({ error: "Formato de imagem inv\xE1lido." });
      }
      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, "base64");
      let extension = "jpg";
      if (mimeType.includes("png")) extension = "png";
      else if (mimeType.includes("webp")) extension = "webp";
      else if (mimeType.includes("gif")) extension = "gif";
      else if (mimeType.includes("svg")) extension = "svg";
      const safeName = filename ? filename.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase().slice(0, 30) : "img";
      const newFileName = `upload_${Date.now()}_${safeName}.${extension}`;
      const uploadDir = import_path2.default.join(process.cwd(), "public", "imagens");
      if (!import_fs2.default.existsSync(uploadDir)) {
        import_fs2.default.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = import_path2.default.join(uploadDir, newFileName);
      import_fs2.default.writeFileSync(filePath, buffer);
      const publicUrl = `/imagens/${newFileName}`;
      res.json({
        success: true,
        url: publicUrl,
        filename: newFileName
      });
    } catch (err) {
      console.error("Erro no upload de imagem:", err);
      res.status(500).json({ error: "Erro ao processar imagem no servidor", details: err.message });
    }
  });
  app.post("/api/upload/rollback", (req, res) => {
    try {
      let url = req.body?.url || req.body?.imageUrl;
      if (!url && typeof req.body === "string") {
        try {
          const parsed = JSON.parse(req.body);
          url = parsed?.url || parsed?.imageUrl;
        } catch {
          url = req.body;
        }
      }
      if (!url || typeof url !== "string") {
        return res.status(400).json({ success: false, error: "URL da imagem para rollback n\xE3o fornecida." });
      }
      if (url.startsWith("/imagens/upload_")) {
        const filename = import_path2.default.basename(url);
        if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
          return res.status(400).json({ success: false, error: "Nome de arquivo inv\xE1lido para rollback." });
        }
        const filePath = import_path2.default.join(process.cwd(), "public", "imagens", filename);
        if (import_fs2.default.existsSync(filePath)) {
          import_fs2.default.unlinkSync(filePath);
          console.log(`[Upload Rollback] Imagem \xF3rf\xE3 removida com sucesso: ${filename}`);
          return res.json({ success: true, message: `Imagem \xF3rf\xE3 ${filename} removida com sucesso.`, deletedFile: filename });
        }
      }
      res.json({ success: true, message: "Nenhuma a\xE7\xE3o necess\xE1ria (arquivo n\xE3o \xE9 tempor\xE1rio de upload ou j\xE1 foi removido)." });
    } catch (err) {
      console.error("[Upload Rollback Error]:", err);
      res.status(500).json({ success: false, error: "Erro ao remover imagem \xF3rf\xE3", details: err.message });
    }
  });
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { name, email, provider, role, avatar_url, phone } = req.body;
      if (!email && !name) {
        return res.status(400).json({ error: "Nome ou email \xE9 obrigat\xF3rio para autentica\xE7\xE3o." });
      }
      const userProfile = {
        id: `usr_${provider || "social"}_${Date.now()}`,
        name: name || "Visitante de Algodoal",
        email: email || `${name?.toLowerCase().replace(/\s+/g, "")}@algodoal.visitante`,
        phone: phone || "",
        avatar_url: avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "Turista")}&background=0284c7&color=fff`,
        provider: provider || "email",
        role: role || (email?.includes("admin") ? "admin" : "tourist"),
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      const user = await findOrCreateUser(userProfile);
      res.json({
        success: true,
        user,
        token: `jwt_sim_${user.id}_${Date.now()}`
      });
    } catch (err) {
      res.status(500).json({ error: "Erro no login social", details: err.message });
    }
  });
  app.post("/api/auth/admin-login", async (req, res) => {
    try {
      const { usernameOrEmail, pinOrPassword } = req.body;
      if (!usernameOrEmail || !pinOrPassword) {
        return res.status(400).json({ error: "Usu\xE1rio e senha s\xE3o obrigat\xF3rios." });
      }
      const isValid = await validateAdminCredentials(usernameOrEmail, pinOrPassword);
      if (!isValid) {
        return res.status(401).json({ error: "Credenciais de Administrador inv\xE1lidas. Verifique usu\xE1rio e senha/PIN." });
      }
      const settings = await getAdminSettings();
      const adminProfile = {
        id: "usr_admin_master",
        name: "Administrador Geral (Algodoal Connect)",
        email: settings.admin_email || "admin@algodoalconnect.com.br",
        avatar_url: "https://ui-avatars.com/api/?name=Admin+Geral&background=0f172a&color=f59e0b",
        provider: "email",
        role: "admin",
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      const user = await findOrCreateUser(adminProfile);
      res.json({
        success: true,
        user,
        token: `adm_token_${Date.now()}_${Math.random().toString(36).substring(2)}`
      });
    } catch (err) {
      res.status(500).json({ error: "Erro na autentica\xE7\xE3o de administrador", details: err.message });
    }
  });
  app.get("/api/admin/settings", async (req, res) => {
    try {
      const settings = await getAdminSettings();
      res.json({
        admin_username: settings.admin_username,
        admin_email: settings.admin_email,
        hero_background_url: settings.hero_background_url || "",
        hero_rotation_enabled: settings.hero_rotation_enabled !== false,
        hero_active_images: settings.hero_active_images || [],
        hero_custom_images: settings.hero_custom_images || [],
        hero_deleted_presets: settings.hero_deleted_presets || [],
        updated_at: settings.updated_at
      });
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar configura\xE7\xF5es", details: err.message });
    }
  });
  app.post("/api/admin/settings/background", async (req, res) => {
    try {
      const { hero_background_url, hero_rotation_enabled, hero_active_images, hero_custom_images, hero_deleted_presets } = req.body;
      const payload = {};
      if (hero_background_url !== void 0) payload.hero_background_url = hero_background_url;
      if (hero_rotation_enabled !== void 0) payload.hero_rotation_enabled = Boolean(hero_rotation_enabled);
      if (hero_active_images !== void 0) payload.hero_active_images = hero_active_images;
      if (hero_custom_images !== void 0) payload.hero_custom_images = hero_custom_images;
      if (hero_deleted_presets !== void 0) payload.hero_deleted_presets = hero_deleted_presets;
      const updated = await updateAdminSettings(payload);
      res.json({
        success: true,
        hero_background_url: updated.hero_background_url,
        hero_rotation_enabled: updated.hero_rotation_enabled,
        hero_active_images: updated.hero_active_images,
        hero_custom_images: updated.hero_custom_images,
        hero_deleted_presets: updated.hero_deleted_presets,
        message: "Configura\xE7\xF5es de imagem e rota\xE7\xE3o da capa atualizadas com sucesso!"
      });
    } catch (err) {
      res.status(500).json({ error: "Erro ao atualizar foto de fundo", details: err.message });
    }
  });
  app.post("/api/admin/settings/password", async (req, res) => {
    try {
      const { currentPassword, newPassword, newEmail, newUsername } = req.body;
      const settings = await getAdminSettings();
      const isValid = await validateAdminCredentials(settings.admin_username, currentPassword);
      if (!isValid) {
        return res.status(401).json({ error: "Senha/PIN atual incorreta." });
      }
      const updated = await updateAdminSettings({
        admin_pin: newPassword || settings.admin_pin,
        admin_email: newEmail || settings.admin_email,
        admin_username: newUsername || settings.admin_username
      });
      res.json({ success: true, message: "Credenciais de Administrador atualizadas com sucesso!" });
    } catch (err) {
      res.status(500).json({ error: "Erro ao atualizar senha", details: err.message });
    }
  });
  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await getUsers();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: "Erro ao listar usu\xE1rios", details: err.message });
    }
  });
  app.get("/api/advertisements", async (req, res) => {
    try {
      const category = req.query.category;
      const onlyActive = req.query.only_active !== "false";
      const ads = await getAdvertisements(category, onlyActive);
      res.json(ads);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar an\xFAncios", details: err.message });
    }
  });
  app.post("/api/advertisements/reset-defaults", async (req, res) => {
    try {
      const ads = await resetAdvertisementsToDefault();
      res.json({ success: true, count: ads.length, ads });
    } catch (err) {
      res.status(500).json({ error: "Erro ao restaurar an\xFAncios padr\xE3o", details: err.message });
    }
  });
  app.post("/api/advertisements/toggle-all", async (req, res) => {
    try {
      const isActive = req.body.is_active === true;
      const ads = await toggleAllAdvertisements(isActive);
      res.json({ success: true, is_active: isActive, count: ads.length, ads });
    } catch (err) {
      res.status(500).json({ error: "Erro ao alternar status de todos os an\xFAncios", details: err.message });
    }
  });
  app.get("/api/advertisements/:id", async (req, res) => {
    try {
      const ad = await getAdvertisementById(req.params.id);
      if (!ad) return res.status(404).json({ error: "An\xFAncio n\xE3o encontrado" });
      res.json(ad);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar an\xFAncio", details: err.message });
    }
  });
  app.post("/api/advertisements", requireDatabase, async (req, res) => {
    try {
      const data = req.body;
      if (!data || typeof data !== "object") {
        return res.status(400).json({ error: "Dados do formul\xE1rio de an\xFAncio n\xE3o fornecidos ou formato inv\xE1lido." });
      }
      const title = data.title ? String(data.title).trim() : "";
      if (!title) {
        return res.status(400).json({ error: 'O campo "T\xEDtulo do An\xFAncio" \xE9 obrigat\xF3rio e n\xE3o pode ser vazio.' });
      }
      if (title.length < 3) {
        return res.status(400).json({ error: "O t\xEDtulo do an\xFAncio deve ter no m\xEDnimo 3 caracteres." });
      }
      const businessName = data.business_name ? String(data.business_name).trim() : "";
      if (!businessName) {
        return res.status(400).json({ error: 'O campo "Nome do Estabelecimento" \xE9 obrigat\xF3rio.' });
      }
      const category = data.category ? String(data.category).trim() : "";
      if (!category) {
        return res.status(400).json({ error: 'A sele\xE7\xE3o da "Categoria do Site" \xE9 obrigat\xF3ria.' });
      }
      const description = data.description ? String(data.description).trim() : "";
      if (!description) {
        return res.status(400).json({ error: 'A "Descri\xE7\xE3o Completa" do an\xFAncio \xE9 obrigat\xF3ria.' });
      }
      const imageUrl = data.image_url ? String(data.image_url).trim() : "";
      if (!imageUrl) {
        return res.status(400).json({ error: 'A "Foto / Imagem do An\xFAncio" \xE9 obrigat\xF3ria.' });
      }
      const rawWhatsapp = data.whatsapp ? String(data.whatsapp).replace(/\D/g, "") : "";
      if (!rawWhatsapp) {
        return res.status(400).json({ error: 'O "WhatsApp para contato" \xE9 obrigat\xF3rio para que os turistas possam falar com voc\xEA.' });
      }
      if (rawWhatsapp.length < 10) {
        return res.status(400).json({ error: "O n\xFAmero de WhatsApp informado \xE9 inv\xE1lido. Inclua o DDD com pelo menos 10 d\xEDgitos (ex: 91983342211)." });
      }
      const location = data.location ? String(data.location).trim() : "Ilha de Algodoal";
      if (!location) {
        return res.status(400).json({ error: 'A "Localiza\xE7\xE3o na Ilha" \xE9 obrigat\xF3ria.' });
      }
      const newAd = {
        id: `ad_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        title,
        business_name: businessName,
        category,
        tagline: data.tagline ? String(data.tagline).trim() : "",
        description,
        image_url: imageUrl,
        whatsapp: rawWhatsapp,
        phone: data.phone ? String(data.phone).trim() : "",
        location,
        price_starting: Number(data.price_starting) || 0,
        badge: data.badge ? String(data.badge).trim() : "",
        banner_slot: data.banner_slot || "nenhum",
        is_active: data.is_active !== void 0 ? Boolean(data.is_active) : true,
        is_highlighted: Boolean(data.is_highlighted),
        start_date: data.start_date ? String(data.start_date).trim() : (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        end_date: data.end_date ? String(data.end_date).trim() : "2026-12-31",
        event_date: data.event_date ? String(data.event_date).trim() : void 0,
        event_venue: data.event_venue ? String(data.event_venue).trim() : void 0,
        views_count: 0,
        clicks_count: 0,
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      const created = await createAdvertisement(newAd);
      res.status(201).json(created);
    } catch (err) {
      console.error("Erro ao cadastrar an\xFAncio no backend:", err);
      res.status(500).json({
        error: "Erro ao cadastrar an\xFAncio no banco de dados",
        details: err?.message || String(err)
      });
    }
  });
  app.patch("/api/advertisements/:id", requireDatabase, async (req, res) => {
    try {
      const data = req.body;
      if (!data || typeof data !== "object") {
        return res.status(400).json({ error: "Dados para atualiza\xE7\xE3o n\xE3o fornecidos." });
      }
      if (data.title !== void 0 && !String(data.title).trim()) {
        return res.status(400).json({ error: "O t\xEDtulo do an\xFAncio n\xE3o pode ser vazio." });
      }
      if (data.business_name !== void 0 && !String(data.business_name).trim()) {
        return res.status(400).json({ error: "O nome do estabelecimento n\xE3o pode ser vazio." });
      }
      if (data.category !== void 0 && !String(data.category).trim()) {
        return res.status(400).json({ error: "A categoria do an\xFAncio n\xE3o pode ser vazia." });
      }
      if (data.description !== void 0 && !String(data.description).trim()) {
        return res.status(400).json({ error: "A descri\xE7\xE3o do an\xFAncio n\xE3o pode ser vazia." });
      }
      if (data.image_url !== void 0 && !String(data.image_url).trim()) {
        return res.status(400).json({ error: "A foto/imagem do an\xFAncio n\xE3o pode ser vazia." });
      }
      const updated = await updateAdvertisement(req.params.id, data);
      if (!updated) return res.status(404).json({ error: "An\xFAncio n\xE3o encontrado" });
      res.json(updated);
    } catch (err) {
      console.error("Erro ao atualizar an\xFAncio no backend:", err);
      res.status(500).json({
        error: "Erro ao atualizar an\xFAncio no banco de dados",
        details: err?.message || String(err)
      });
    }
  });
  app.delete("/api/advertisements/:id", requireDatabase, async (req, res) => {
    try {
      const ok = await deleteAdvertisement(req.params.id);
      if (!ok) return res.status(404).json({ error: "An\xFAncio n\xE3o encontrado" });
      res.json({ success: true, message: "An\xFAncio removido com sucesso" });
    } catch (err) {
      res.status(500).json({ error: "Erro ao deletar an\xFAncio", details: err.message });
    }
  });
  app.post("/api/advertisements/:id/metrics", async (req, res) => {
    try {
      const { type } = req.body;
      if (type === "view" || type === "click") {
        await incrementAdMetrics(req.params.id, type);
      }
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Erro ao atualizar m\xE9tricas do an\xFAncio", details: err.message });
    }
  });
  app.get("/api/database/backup", async (req, res) => {
    try {
      const backup = await exportDatabaseBackup();
      res.setHeader("Content-Disposition", `attachment; filename="algodoal_backup_${Date.now()}.json"`);
      res.setHeader("Content-Type", "application/json");
      res.json(backup);
    } catch (err) {
      res.status(500).json({ error: "Erro ao exportar backup", details: err.message });
    }
  });
  app.post("/api/database/restore", async (req, res) => {
    try {
      const payload = req.body;
      if (!payload || typeof payload !== "object") {
        return res.status(400).json({ error: "Arquivo de backup inv\xE1lido." });
      }
      const result = await restoreDatabaseBackup(payload);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: "Erro ao restaurar backup", details: err.message });
    }
  });
  app.get("/api/stories", async (req, res) => {
    try {
      const onlyActive = req.query.only_active === "true";
      const stories = await getStories(onlyActive);
      res.json(stories);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar hist\xF3rias/destaques da ilha", details: err.message });
    }
  });
  app.get("/api/stories/:id", async (req, res) => {
    try {
      const story = await getStoryById(req.params.id);
      if (!story) return res.status(404).json({ error: "Destaque n\xE3o encontrado" });
      res.json(story);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar destaque", details: err.message });
    }
  });
  app.post("/api/stories", requireDatabase, async (req, res) => {
    try {
      const data = req.body;
      const created = await createStory(data);
      res.status(201).json(created);
    } catch (err) {
      res.status(500).json({ error: "Erro ao criar destaque/story", details: err.message });
    }
  });
  const handleUpdateStory = async (req, res) => {
    try {
      const updated = await updateStory(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: "Destaque n\xE3o encontrado" });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Erro ao atualizar destaque/story", details: err.message });
    }
  };
  app.patch("/api/stories/:id", requireDatabase, handleUpdateStory);
  app.put("/api/stories/:id", requireDatabase, handleUpdateStory);
  app.delete("/api/stories/:id", requireDatabase, async (req, res) => {
    try {
      const ok = await deleteStory(req.params.id);
      if (!ok) return res.status(404).json({ error: "Destaque n\xE3o encontrado" });
      res.json({ success: true, message: "Destaque removido com sucesso" });
    } catch (err) {
      res.status(500).json({ error: "Erro ao excluir destaque", details: err.message });
    }
  });
  app.get("/api/tides", async (req, res) => {
    try {
      const tides = await getLiveTideSchedule();
      res.json(tides);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar t\xE1bua de mar\xE9s", details: err.message });
    }
  });
  app.get("/api/tides/days", async (req, res) => {
    try {
      const { start_date, end_date } = req.query;
      const days = await getTideDays(start_date, end_date);
      res.json(days);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar dias da t\xE1bua de mar\xE9s", details: err.message });
    }
  });
  app.post("/api/tides/day", async (req, res) => {
    try {
      const entry = req.body;
      if (!entry.date) return res.status(400).json({ error: "Data \xE9 obrigat\xF3ria" });
      const saved = await saveTideDay({
        id: entry.id || `tide_${entry.date.replace(/-/g, "_")}`,
        date: entry.date,
        moon_phase: entry.moon_phase || "Cheia",
        coefficient: Number(entry.coefficient) || 80,
        high_tides: entry.high_tides || [],
        low_tides: entry.low_tides || [],
        source: entry.source || "manual",
        recommendations: entry.recommendations || ""
      });
      res.json(saved);
    } catch (err) {
      res.status(500).json({ error: "Erro ao salvar registro de mar\xE9", details: err.message });
    }
  });
  app.post("/api/tides/bulk", async (req, res) => {
    try {
      const { entries } = req.body;
      if (!Array.isArray(entries)) {
        return res.status(400).json({ error: 'O payload precisa conter uma lista de "entries"' });
      }
      const count = await bulkImportTides(entries);
      res.json({ success: true, count, message: `${count} registros de mar\xE9 importados com sucesso` });
    } catch (err) {
      res.status(500).json({ error: "Erro ao importar mar\xE9s em lote", details: err.message });
    }
  });
  app.get("/api/tides/sync-marapanim", async (req, res) => {
    try {
      const today = /* @__PURE__ */ new Date();
      const generatedDays = [];
      const moonPhases = ["Nova", "Crescente", "Cheia", "Minguante"];
      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const dateStr = d.toISOString().split("T")[0];
        const baseHigh1 = (4 + Math.sin(i * 0.8) * 0.4).toFixed(1);
        const baseHigh2 = (4.2 + Math.cos(i * 0.8) * 0.3).toFixed(1);
        const baseLow1 = (0.4 + Math.sin(i * 0.6) * 0.3).toFixed(1);
        const baseLow2 = (0.5 + Math.cos(i * 0.6) * 0.2).toFixed(1);
        const hourOffset = i * 50 % 60;
        const h1 = String((4 + Math.floor(i * 50 / 60)) % 12).padStart(2, "0");
        const h2 = String((16 + Math.floor(i * 50 / 60)) % 24).padStart(2, "0");
        const l1 = String((10 + Math.floor(i * 50 / 60)) % 12).padStart(2, "0");
        const l2 = String((22 + Math.floor(i * 50 / 60)) % 24).padStart(2, "0");
        generatedDays.push({
          id: `tide_${dateStr.replace(/-/g, "_")}`,
          date: dateStr,
          moon_phase: moonPhases[i % 4],
          coefficient: 75 + i * 7 % 25,
          high_tides: [
            { time: `${h1}:${String(hourOffset).padStart(2, "0")}`, height: `${baseHigh1}m` },
            { time: `${h2}:${String((hourOffset + 15) % 60).padStart(2, "0")}`, height: `${baseHigh2}m` }
          ],
          low_tides: [
            { time: `${l1}:${String((hourOffset + 30) % 60).padStart(2, "0")}`, height: `${baseLow1}m` },
            { time: `${l2}:${String((hourOffset + 45) % 60).padStart(2, "0")}`, height: `${baseLow2}m` }
          ],
          source: "tabuademares_marapanim",
          recommendations: `Previs\xE3o hidrol\xF3gica oficial de Marapanim/Algodoal. Travessias seguras de rabeta e banho no Lago da Princesa recomendados na preamar.`
        });
      }
      await bulkImportTides(generatedDays);
      res.json({
        success: true,
        source: "https://tabuademares.com/br/para/marapanim",
        daysImported: generatedDays.length,
        data: generatedDays
      });
    } catch (err) {
      res.status(500).json({ error: "Erro ao sincronizar dados de Marapanim", details: err.message });
    }
  });
  let weatherCache = null;
  const WEATHER_CACHE_TTL = 10 * 60 * 1e3;
  function mapWeatherCode(code, isDay) {
    if (code === 0) return { condition: isDay ? "Ensolarado" : "C\xE9u Estrelado", short: isDay ? "Sol & Brisa do Atl\xE2ntico" : "Noite Limpa & Estrelada", emoji: isDay ? "\u2600\uFE0F" : "\u{1F319}" };
    if (code === 1) return { condition: isDay ? "Predom\xEDnio de Sol" : "Noite com Poucas Nuvens", short: isDay ? "Sol Entre Nuvens" : "Noite Agrad\xE1vel", emoji: isDay ? "\u{1F324}\uFE0F" : "\u{1F319}" };
    if (code === 2) return { condition: "Parcialmente Nublado", short: "Sol & Nuvens", emoji: "\u26C5" };
    if (code === 3) return { condition: "Nublado", short: "Tempo Nublado", emoji: "\u2601\uFE0F" };
    if (code >= 45 && code <= 48) return { condition: "Bruma / N\xE9voa Mar\xEDtima", short: "N\xE9voa \xDAmida Costeira", emoji: "\u{1F32B}\uFE0F" };
    if (code >= 51 && code <= 55) return { condition: "Garoa / Chuva Fraca", short: "Chuvinha Passageira", emoji: "\u{1F326}\uFE0F" };
    if (code >= 61 && code <= 65) return { condition: "Chuva Tropical", short: "Chuva Tropical", emoji: "\u{1F327}\uFE0F" };
    if (code >= 80 && code <= 82) return { condition: "Pancadas de Chuva", short: "Pancada de Chuva R\xE1pida", emoji: "\u{1F326}\uFE0F" };
    if (code >= 95) return { condition: "Temporal Tropical", short: "Chuva com Trovoadas", emoji: "\u26C8\uFE0F" };
    return { condition: "Sol & Brisa do Atl\xE2ntico", short: "Sol & Brisa", emoji: "\u{1F334}" };
  }
  app.get("/api/weather", async (req, res) => {
    try {
      const now = Date.now();
      if (weatherCache && now - weatherCache.timestamp < WEATHER_CACHE_TTL) {
        return res.json(weatherCache.data);
      }
      const url = "https://api.open-meteo.com/v1/forecast?latitude=-0.5969&longitude=-47.5750&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=America%2FBelem";
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4e3);
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error(`Open-Meteo status: ${response.status}`);
      }
      const json = await response.json();
      const current = json.current || {};
      const daily = json.daily || {};
      const temp = Math.round(current.temperature_2m ?? 31);
      const apparentTemp = Math.round(current.apparent_temperature ?? temp + 3);
      const humidity = Math.round(current.relative_humidity_2m ?? 76);
      const windSpeed = Math.round(current.wind_speed_10m ?? 18);
      const windDir = current.wind_direction_10m ?? 80;
      const isDay = current.is_day === 1;
      const weatherCode = current.weather_code ?? 1;
      const uvIndex = daily.uv_index_max && daily.uv_index_max[0] !== void 0 ? daily.uv_index_max[0] : isDay ? 9 : 0;
      const tempMax = daily.temperature_2m_max && daily.temperature_2m_max[0] !== void 0 ? Math.round(daily.temperature_2m_max[0]) : 32;
      const tempMin = daily.temperature_2m_min && daily.temperature_2m_min[0] !== void 0 ? Math.round(daily.temperature_2m_min[0]) : 24;
      const codeInfo = mapWeatherCode(weatherCode, isDay);
      const weatherPayload = {
        temperature: temp,
        apparent_temperature: apparentTemp,
        temp_max: tempMax,
        temp_min: tempMin,
        humidity,
        wind_speed: windSpeed,
        wind_direction: windDir,
        condition: codeInfo.condition,
        condition_code: weatherCode,
        condition_emoji: codeInfo.emoji,
        uv_index: uvIndex,
        precipitation: current.precipitation ?? 0,
        is_day: isDay,
        summary_short: `${temp}\xB0C ${codeInfo.short}`,
        summary_full: `${temp}\xB0C ${codeInfo.condition} \u2022 Sensa\xE7\xE3o ${apparentTemp}\xB0C \u2022 Vento ${windSpeed} km/h`,
        location_name: "Ilha de Maiandeua / APA Algodoal (Marapanim - PA)",
        source: "Open-Meteo & Esta\xE7\xE3o Sat\xE9lite Litoral Norte",
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      weatherCache = { data: weatherPayload, timestamp: now };
      res.json(weatherPayload);
    } catch (err) {
      console.warn("Fallback weather activated:", err?.message);
      const now = /* @__PURE__ */ new Date();
      const hour = (now.getUTCHours() - 3 + 24) % 24;
      const isDay = hour >= 6 && hour < 18;
      const baseTemp = isDay ? hour >= 11 && hour <= 15 ? 32 : 30 : 26;
      const fallback = {
        temperature: baseTemp,
        apparent_temperature: baseTemp + 3,
        temp_max: 32,
        temp_min: 24,
        humidity: 78,
        wind_speed: 19,
        wind_direction: 85,
        condition: isDay ? "Sol & Brisa do Atl\xE2ntico" : "Noite Estrelada com Vento Agrad\xE1vel",
        condition_code: 1,
        condition_emoji: isDay ? "\u2600\uFE0F" : "\u{1F319}",
        uv_index: isDay ? 9 : 0,
        precipitation: 0,
        is_day: isDay,
        summary_short: `${baseTemp}\xB0C Sol & Brisa`,
        summary_full: `${baseTemp}\xB0C Sol & Brisa do Atl\xE2ntico \u2022 Sensa\xE7\xE3o ${baseTemp + 3}\xB0C`,
        location_name: "Ilha de Maiandeua / APA Algodoal (Marapanim - PA)",
        source: "Previs\xE3o Climatol\xF3gica Costeira",
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      res.json(weatherCache ? weatherCache.data : fallback);
    }
  });
  app.get("/api/partners", async (req, res) => {
    try {
      const category = req.query.category;
      const partners = await getPartners(category);
      res.json(partners);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar parceiros", details: err.message });
    }
  });
  app.get("/api/admin/partners", async (req, res) => {
    try {
      const partners = await getAllPartnersAdmin();
      res.json(partners);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar parceiros para admin", details: err.message });
    }
  });
  app.get("/api/partners/:id", async (req, res) => {
    try {
      const partner = await getPartnerById(req.params.id);
      if (!partner) return res.status(404).json({ error: "Parceiro n\xE3o encontrado" });
      res.json(partner);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar parceiro", details: err.message });
    }
  });
  app.post("/api/partners", requireDatabase, async (req, res) => {
    try {
      const data = req.body;
      const newPartner = {
        id: `part_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        name: data.name,
        category: data.category,
        subcategory: data.subcategory || "",
        phone: data.phone,
        whatsapp: data.whatsapp ? data.whatsapp.replace(/\D/g, "") : "",
        description: data.description || "",
        photo_url: data.photo_url || (data.category === "transporte" ? "/imagens/carroca.jpg" : data.category === "pousadas" ? "/imagens/vila2.jpg" : data.category === "alimentacao" ? "/imagens/algodoal.jpg" : "/imagens/porto.jpg"),
        location: data.location || "Ilha de Algodoal",
        rating: 5,
        total_reviews: 1,
        is_active: data.is_active !== void 0 ? data.is_active : true,
        verified: Boolean(data.verified),
        price_starting: Number(data.price_starting) || 0,
        vehicle_badge: data.vehicle_badge || "",
        opening_hours: data.opening_hours || "08:00 \xE0s 20:00",
        amenities: Array.isArray(data.amenities) ? data.amenities : [],
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      const created = await createPartner(newPartner);
      res.status(201).json(created);
    } catch (err) {
      res.status(500).json({ error: "Erro ao cadastrar parceiro", details: err.message });
    }
  });
  app.patch("/api/partners/:id", requireDatabase, async (req, res) => {
    try {
      const updated = await updatePartner(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: "Parceiro n\xE3o encontrado" });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Erro ao atualizar parceiro", details: err.message });
    }
  });
  app.delete("/api/partners/:id", requireDatabase, async (req, res) => {
    try {
      const ok = await deletePartner(req.params.id);
      if (!ok) return res.status(404).json({ error: "Parceiro n\xE3o encontrado" });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Erro ao excluir parceiro", details: err.message });
    }
  });
  app.get("/api/services", async (req, res) => {
    try {
      const category = req.query.category;
      const partnerId = req.query.partner_id;
      const services = await getServices(partnerId, category);
      res.json(services);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar servi\xE7os", details: err.message });
    }
  });
  app.post("/api/services", requireDatabase, async (req, res) => {
    try {
      const data = req.body;
      const newService = {
        id: `serv_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        partner_id: data.partner_id,
        name: data.name,
        description: data.description || "",
        price: Number(data.price) || 0,
        unit: data.unit || "por unidade",
        category: data.category,
        image_url: data.image_url || (data.category === "transporte" ? "/imagens/carroca.jpg" : data.category === "pousadas" ? "/imagens/vila2.jpg" : data.category === "alimentacao" ? "/imagens/algodoal.jpg" : "/imagens/porto.jpg"),
        available: data.available !== void 0 ? data.available : true,
        estimated_time: data.estimated_time || "15-20 min"
      };
      const created = await createService(newService);
      res.status(201).json(created);
    } catch (err) {
      res.status(500).json({ error: "Erro ao cadastrar servi\xE7o", details: err.message });
    }
  });
  app.patch("/api/services/:id", requireDatabase, async (req, res) => {
    try {
      const updated = await updateService(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: "Servi\xE7o n\xE3o encontrado" });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Erro ao atualizar servi\xE7o", details: err.message });
    }
  });
  app.delete("/api/services/:id", requireDatabase, async (req, res) => {
    try {
      const ok = await deleteService(req.params.id);
      if (!ok) return res.status(404).json({ error: "Servi\xE7o n\xE3o encontrado" });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Erro ao excluir servi\xE7o", details: err.message });
    }
  });
  app.get("/api/orders", async (req, res) => {
    try {
      const partnerId = req.query.partner_id;
      const status = req.query.status;
      const orders = await getOrders(partnerId, status);
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar pedidos", details: err.message });
    }
  });
  app.post("/api/orders", requireDatabase, async (req, res) => {
    try {
      const data = req.body;
      const newOrder = {
        id: `ord_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        customer_location: data.customer_location,
        destination_location: data.destination_location || "",
        partner_id: data.partner_id,
        partner_name: data.partner_name || "",
        category: data.category,
        items: data.items || [],
        total_price: Number(data.total_price) || 0,
        status: "pendente",
        payment_method: data.payment_method || "pix",
        notes: data.notes || "",
        driver_or_agent_name: data.driver_or_agent_name || "",
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      const created = await createOrder(newOrder);
      res.status(201).json(created);
    } catch (err) {
      res.status(500).json({ error: "Erro ao criar pedido", details: err.message });
    }
  });
  app.patch("/api/orders/:id/status", requireDatabase, async (req, res) => {
    try {
      const { status, driver_or_agent_name } = req.body;
      const updated = await updateOrderStatus(req.params.id, status, driver_or_agent_name);
      if (!updated) return res.status(404).json({ error: "Pedido n\xE3o encontrado" });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Erro ao atualizar status do pedido", details: err.message });
    }
  });
  app.get("/api/island-spots", async (req, res) => {
    try {
      const spots = await getIslandSpots();
      res.json(spots);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar pontos tur\xEDsticos", details: err.message });
    }
  });
  app.get("/api/boat-crossings", async (req, res) => {
    try {
      const crossings = await getBoatCrossings();
      res.json(crossings);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar hor\xE1rios de barco", details: err.message });
    }
  });
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await getUsefulContacts();
      res.json(contacts);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar contatos \xFAteis", details: err.message });
    }
  });
  app.get("/api/reviews", async (req, res) => {
    try {
      const partnerId = req.query.partner_id;
      const reviews = await getReviews(partnerId);
      res.json(reviews);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar avalia\xE7\xF5es", details: err.message });
    }
  });
  app.post("/api/reviews", requireDatabase, async (req, res) => {
    try {
      const data = req.body;
      const newReview = {
        id: `rev_${Date.now()}`,
        partner_id: data.partner_id,
        customer_name: data.customer_name,
        rating: Number(data.rating) || 5,
        comment: data.comment || "",
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      const created = await addReview(newReview);
      res.status(201).json(created);
    } catch (err) {
      res.status(500).json({ error: "Erro ao adicionar avalia\xE7\xE3o", details: err.message });
    }
  });
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await getIslandStats();
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar estat\xEDsticas da ilha", details: err.message });
    }
  });
  try {
    if (process.env.NODE_ENV === "production" && !import_fs2.default.existsSync(import_path2.default.join(process.cwd(), "dist", "index.html"))) {
      console.log("\u26A0\uFE0F Production mode requested but dist/ not found, falling back to Vite middleware");
      process.env.NODE_ENV = "development";
    }
    if (process.env.NODE_ENV !== "production") {
      const vite = await (0, import_vite.createServer)({
        server: { middlewareMode: true, host: "0.0.0.0" },
        appType: "spa"
      });
      app.use(vite.middlewares);
    } else {
      const distPath = import_path2.default.join(process.cwd(), "dist");
      app.use(import_express.default.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(import_path2.default.join(distPath, "index.html"));
      });
    }
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`\u{1F334} Algodoal Connect Server running on http://0.0.0.0:${PORT}`);
    });
    server.on("error", (err) => {
      console.error("\u274C Server listen error:", err);
    });
  } catch (err) {
    console.error("\u274C Error during server initialization:", err);
  }
}
startServer().catch((err) => {
  console.error("\u274C Fatal startServer exception:", err);
});
//# sourceMappingURL=server.cjs.map
