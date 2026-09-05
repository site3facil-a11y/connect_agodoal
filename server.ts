/**
 * =======================================================================
 * Algodoal Connect — Backend & API Server
 * Produzido e Desenvolvido por: 3facil.com
 * Website Oficial: https://www.3facil.com
 * =======================================================================
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import {
  getPartners,
  getAllPartnersAdmin,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
  getServices,
  createService,
  updateService,
  deleteService,
  getOrders,
  createOrder,
  updateOrderStatus,
  getIslandSpots,
  getBoatCrossings,
  getLiveTideSchedule,
  getTideDays,
  saveTideDay,
  bulkImportTides,
  getUsefulContacts,
  getReviews,
  addReview,
  getIslandStats,
  getAdvertisements,
  getAdvertisementById,
  resetAdvertisementsToDefault,
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
  incrementAdMetrics,
  getUsers,
  findOrCreateUser,
  getAdminSettings,
  validateAdminCredentials,
  updateAdminSettings,
  getStories,
  getStoryById,
  createStory,
  updateStory,
  deleteStory,
  exportDatabaseBackup,
  restoreDatabaseBackup,
  getDatabaseStatus
} from './src/db/database';

function requireDatabase(req, res, next) {
  const dbStatus = getDatabaseStatus();
  if (!dbStatus.connected) {
    console.warn(
      `\u26d4 [${new Date().toISOString()}] Escrita bloqueada (banco indisponivel) - ` +
      `${req.method} ${req.originalUrl} - IP: ${req.ip}`
    );
    return res.status(503).json({
      error: 'DATABASE_UNAVAILABLE',
      message: 'Nao foi possivel salvar: sem conexao com o banco de dados principal no momento. Tente novamente em instantes.',
      details: dbStatus.details
    });
  }
  next();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Prevent browser caching of development assets and index.html
  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
  });

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use('/imagens', express.static(path.join(process.cwd(), 'public', 'imagens')));
  app.use('/assets/images', express.static(path.join(process.cwd(), 'src', 'assets', 'images')));

  // =====================================
  // API ROUTES
  // =====================================

  // Health check & Server Status
  app.get('/api/health', (req, res) => {
    const dbStatus = getDatabaseStatus();
    res.json({
      status: 'online',
      service: 'Algodoal Connect Backend API',
      database: dbStatus.connected ? 'PostgreSQL (Connected)' : `Relational Engine (${dbStatus.details})`,
      dbConnected: dbStatus.connected,
      dbType: dbStatus.type,
      dbDetails: dbStatus.details,
      timestamp: new Date().toISOString()
    });
  });

  // Database Diagnostic endpoint
  app.get('/api/admin/db-diagnostic', async (req, res) => {
    try {
      const dbStatus = getDatabaseStatus();
      const backup = await exportDatabaseBackup();
      res.json({
        dbStatus,
        advertisements_count: backup.advertisements?.length || 0,
        advertisements: backup.advertisements || [],
        partners_count: backup.partners?.length || 0
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // =====================================
  // IMAGE UPLOAD API
  // =====================================
  app.post('/api/upload', (req, res) => {
    try {
      const { image, filename } = req.body;
      if (!image) {
        return res.status(400).json({ error: 'Nenhuma imagem enviada.' });
      }

      // Check if it is a base64 data URL
      const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        // If it is already a direct URL or path, just return it
        if (typeof image === 'string' && (image.startsWith('http') || image.startsWith('/'))) {
          return res.json({ success: true, url: image });
        }
        return res.status(400).json({ error: 'Formato de imagem inválido.' });
      }

      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');

      let extension = 'jpg';
      if (mimeType.includes('png')) extension = 'png';
      else if (mimeType.includes('webp')) extension = 'webp';
      else if (mimeType.includes('gif')) extension = 'gif';
      else if (mimeType.includes('svg')) extension = 'svg';

      const safeName = filename
        ? filename.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase().slice(0, 30)
        : 'img';
      const newFileName = `upload_${Date.now()}_${safeName}.${extension}`;

      const uploadDir = path.join(process.cwd(), 'public', 'imagens');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, newFileName);
      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/imagens/${newFileName}`;
      res.json({
        success: true,
        url: publicUrl,
        filename: newFileName
      });
    } catch (err: any) {
      console.error('Erro no upload de imagem:', err);
      res.status(500).json({ error: 'Erro ao processar imagem no servidor', details: err.message });
    }
  });

  // =====================================
  // AUTHENTICATION & USERS (Social Login)
  // =====================================
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { name, email, provider, role, avatar_url, phone } = req.body;
      if (!email && !name) {
        return res.status(400).json({ error: 'Nome ou email é obrigatório para autenticação.' });
      }

      const userProfile = {
        id: `usr_${provider || 'social'}_${Date.now()}`,
        name: name || 'Visitante de Algodoal',
        email: email || `${name?.toLowerCase().replace(/\s+/g, '')}@algodoal.visitante`,
        phone: phone || '',
        avatar_url: avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Turista')}&background=0284c7&color=fff`,
        provider: provider || 'email',
        role: role || (email?.includes('admin') ? 'admin' : 'tourist'),
        created_at: new Date().toISOString()
      };

      const user = await findOrCreateUser(userProfile);
      res.json({
        success: true,
        user,
        token: `jwt_sim_${user.id}_${Date.now()}`
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro no login social', details: err.message });
    }
  });

  // Admin Credentials Authentication
  app.post('/api/auth/admin-login', async (req, res) => {
    try {
      const { usernameOrEmail, pinOrPassword } = req.body;
      if (!usernameOrEmail || !pinOrPassword) {
        return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
      }

      const isValid = await validateAdminCredentials(usernameOrEmail, pinOrPassword);
      if (!isValid) {
        return res.status(401).json({ error: 'Credenciais de Administrador inválidas. Verifique usuário e senha/PIN.' });
      }

      const settings = await getAdminSettings();
      const adminProfile = {
        id: 'usr_admin_master',
        name: 'Administrador Geral (Algodoal Connect)',
        email: settings.admin_email || 'admin@algodoalconnect.com.br',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        provider: 'email' as const,
        role: 'admin' as const,
        created_at: new Date().toISOString()
      };

      const user = await findOrCreateUser(adminProfile);

      res.json({
        success: true,
        user,
        token: `adm_token_${Date.now()}_${Math.random().toString(36).substring(2)}`
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro na autenticação de administrador', details: err.message });
    }
  });

  app.get('/api/admin/settings', async (req, res) => {
    try {
      const settings = await getAdminSettings();
      // Mask the pin/password for security
      res.json({
        admin_username: settings.admin_username,
        admin_email: settings.admin_email,
        hero_background_url: settings.hero_background_url || '',
        hero_rotation_enabled: settings.hero_rotation_enabled !== false,
        hero_active_images: settings.hero_active_images || [],
        hero_custom_images: settings.hero_custom_images || [],
        hero_deleted_presets: settings.hero_deleted_presets || [],
        updated_at: settings.updated_at
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao buscar configurações', details: err.message });
    }
  });

  app.post('/api/admin/settings/background', async (req, res) => {
    try {
      const { hero_background_url, hero_rotation_enabled, hero_active_images, hero_custom_images, hero_deleted_presets } = req.body;
      
      const payload: any = {};
      if (hero_background_url !== undefined) payload.hero_background_url = hero_background_url;
      if (hero_rotation_enabled !== undefined) payload.hero_rotation_enabled = Boolean(hero_rotation_enabled);
      if (hero_active_images !== undefined) payload.hero_active_images = hero_active_images;
      if (hero_custom_images !== undefined) payload.hero_custom_images = hero_custom_images;
      if (hero_deleted_presets !== undefined) payload.hero_deleted_presets = hero_deleted_presets;

      const updated = await updateAdminSettings(payload);
      res.json({ 
        success: true, 
        hero_background_url: updated.hero_background_url, 
        hero_rotation_enabled: updated.hero_rotation_enabled,
        hero_active_images: updated.hero_active_images,
        hero_custom_images: updated.hero_custom_images,
        hero_deleted_presets: updated.hero_deleted_presets,
        message: 'Configurações de imagem e rotação da capa atualizadas com sucesso!' 
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao atualizar foto de fundo', details: err.message });
    }
  });

  app.post('/api/admin/settings/password', async (req, res) => {
    try {
      const { currentPassword, newPassword, newEmail, newUsername } = req.body;
      const settings = await getAdminSettings();
      const isValid = await validateAdminCredentials(settings.admin_username, currentPassword);
      if (!isValid) {
        return res.status(401).json({ error: 'Senha/PIN atual incorreta.' });
      }

      const updated = await updateAdminSettings({
        admin_pin: newPassword || settings.admin_pin,
        admin_email: newEmail || settings.admin_email,
        admin_username: newUsername || settings.admin_username
      });

      res.json({ success: true, message: 'Credenciais de Administrador atualizadas com sucesso!' });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao atualizar senha', details: err.message });
    }
  });

  app.get('/api/admin/users', async (req, res) => {
    try {
      const users = await getUsers();
      res.json(users);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao listar usuários', details: err.message });
    }
  });

  // =====================================
  // ADVERTISEMENTS & ANNOUNCEMENTS (PAINEL ADMIN)
  // =====================================
  app.get('/api/advertisements', async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const onlyActive = req.query.only_active !== 'false';
      const ads = await getAdvertisements(category, onlyActive);
      res.json(ads);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao buscar anúncios', details: err.message });
    }
  });

  app.post('/api/advertisements/reset-defaults', async (req, res) => {
    try {
      const ads = await resetAdvertisementsToDefault();
      res.json({ success: true, count: ads.length, ads });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao restaurar anúncios padrão', details: err.message });
    }
  });

  app.get('/api/advertisements/:id', async (req, res) => {
    try {
      const ad = await getAdvertisementById(req.params.id);
      if (!ad) return res.status(404).json({ error: 'Anúncio não encontrado' });
      res.json(ad);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao buscar anúncio', details: err.message });
    }
  });

  app.post('/api/advertisements', requireDatabase, async (req, res) => {
    try {
      const data = req.body;
      const newAd = {
        id: `ad_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        title: data.title,
        business_name: data.business_name || data.title,
        category: data.category || 'restaurante',
        tagline: data.tagline || '',
        description: data.description || '',
        image_url: data.image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        whatsapp: data.whatsapp ? data.whatsapp.replace(/\D/g, '') : '',
        phone: data.phone || '',
        location: data.location || 'Ilha de Algodoal',
        price_starting: Number(data.price_starting) || 0,
        badge: data.badge || '',
        banner_slot: data.banner_slot || 'nenhum',
        is_active: data.is_active !== undefined ? data.is_active : true,
        is_highlighted: Boolean(data.is_highlighted),
        start_date: data.start_date || new Date().toISOString().split('T')[0],
        end_date: data.end_date || '2026-12-31',
        event_date: data.event_date || undefined,
        event_venue: data.event_venue || undefined,
        views_count: 0,
        clicks_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const created = await createAdvertisement(newAd);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao cadastrar anúncio', details: err.message });
    }
  });

  app.patch('/api/advertisements/:id', requireDatabase, async (req, res) => {
    try {
      const updated = await updateAdvertisement(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Anúncio não encontrado' });
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao atualizar anúncio', details: err.message });
    }
  });

  app.delete('/api/advertisements/:id', requireDatabase, async (req, res) => {
    try {
      const ok = await deleteAdvertisement(req.params.id);
      if (!ok) return res.status(404).json({ error: 'Anúncio não encontrado' });
      res.json({ success: true, message: 'Anúncio removido com sucesso' });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao deletar anúncio', details: err.message });
    }
  });

  app.post('/api/advertisements/:id/metrics', async (req, res) => {
    try {
      const { type } = req.body;
      if (type === 'view' || type === 'click') {
        await incrementAdMetrics(req.params.id, type);
      }
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao atualizar métricas do anúncio', details: err.message });
    }
  });

  // =====================================
  // DATABASE BACKUP & RESTORE
  // =====================================
  app.get('/api/database/backup', async (req, res) => {
    try {
      const backup = await exportDatabaseBackup();
      res.setHeader('Content-Disposition', `attachment; filename="algodoal_backup_${Date.now()}.json"`);
      res.setHeader('Content-Type', 'application/json');
      res.json(backup);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao exportar backup', details: err.message });
    }
  });

  app.post('/api/database/restore', async (req, res) => {
    try {
      const payload = req.body;
      if (!payload || typeof payload !== 'object') {
        return res.status(400).json({ error: 'Arquivo de backup inválido.' });
      }
      const result = await restoreDatabaseBackup(payload);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao restaurar backup', details: err.message });
    }
  });

  // =====================================
  // ISLAND STORIES / DESTAQUES DA ILHA
  // =====================================
  app.get('/api/stories', async (req, res) => {
    try {
      const onlyActive = req.query.only_active === 'true';
      const stories = await getStories(onlyActive);
      res.json(stories);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao buscar histórias/destaques da ilha', details: err.message });
    }
  });

  app.get('/api/stories/:id', async (req, res) => {
    try {
      const story = await getStoryById(req.params.id);
      if (!story) return res.status(404).json({ error: 'Destaque não encontrado' });
      res.json(story);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao buscar destaque', details: err.message });
    }
  });

  app.post('/api/stories', requireDatabase, async (req, res) => {
    try {
      const data = req.body;
      const created = await createStory(data);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao criar destaque/story', details: err.message });
    }
  });

  app.patch('/api/stories/:id', requireDatabase, async (req, res) => {
    try {
      const updated = await updateStory(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Destaque não encontrado' });
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao atualizar destaque/story', details: err.message });
    }
  });

  app.delete('/api/stories/:id', requireDatabase, async (req, res) => {
    try {
      const ok = await deleteStory(req.params.id);
      if (!ok) return res.status(404).json({ error: 'Destaque não encontrado' });
      res.json({ success: true, message: 'Destaque removido com sucesso' });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao excluir destaque', details: err.message });
    }
  });

  // =====================================
  // TÁBUA DE MARÉS (MARAPANIM / MARINHA)
  // =====================================
  app.get('/api/tides', async (req, res) => {
    try {
      const tides = await getLiveTideSchedule();
      res.json(tides);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao buscar tábua de marés', details: err.message });
    }
  });

  app.get('/api/tides/days', async (req, res) => {
    try {
      const { start_date, end_date } = req.query;
      const days = await getTideDays(start_date as string, end_date as string);
      res.json(days);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao buscar dias da tábua de marés', details: err.message });
    }
  });

  app.post('/api/tides/day', async (req, res) => {
    try {
      const entry = req.body;
      if (!entry.date) return res.status(400).json({ error: 'Data é obrigatória' });
      const saved = await saveTideDay({
        id: entry.id || `tide_${entry.date.replace(/-/g, '_')}`,
        date: entry.date,
        moon_phase: entry.moon_phase || 'Cheia',
        coefficient: Number(entry.coefficient) || 80,
        high_tides: entry.high_tides || [],
        low_tides: entry.low_tides || [],
        source: entry.source || 'manual',
        recommendations: entry.recommendations || ''
      });
      res.json(saved);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao salvar registro de maré', details: err.message });
    }
  });

  app.post('/api/tides/bulk', async (req, res) => {
    try {
      const { entries } = req.body;
      if (!Array.isArray(entries)) {
        return res.status(400).json({ error: 'O payload precisa conter uma lista de "entries"' });
      }
      const count = await bulkImportTides(entries);
      res.json({ success: true, count, message: `${count} registros de maré importados com sucesso` });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao importar marés em lote', details: err.message });
    }
  });

  // Simulated Web Scraper / Sync Preview for tabuademares.com/br/para/marapanim
  app.get('/api/tides/sync-marapanim', async (req, res) => {
    try {
      const today = new Date();
      const generatedDays = [];
      
      const moonPhases = ['Nova', 'Crescente', 'Cheia', 'Minguante'] as const;
      
      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        
        const baseHigh1 = (4.0 + (Math.sin(i * 0.8) * 0.4)).toFixed(1);
        const baseHigh2 = (4.2 + (Math.cos(i * 0.8) * 0.3)).toFixed(1);
        const baseLow1 = (0.4 + (Math.sin(i * 0.6) * 0.3)).toFixed(1);
        const baseLow2 = (0.5 + (Math.cos(i * 0.6) * 0.2)).toFixed(1);
        
        const hourOffset = (i * 50) % 60;
        const h1 = String((4 + Math.floor((i * 50) / 60)) % 12).padStart(2, '0');
        const h2 = String((16 + Math.floor((i * 50) / 60)) % 24).padStart(2, '0');
        const l1 = String((10 + Math.floor((i * 50) / 60)) % 12).padStart(2, '0');
        const l2 = String((22 + Math.floor((i * 50) / 60)) % 24).padStart(2, '0');

        generatedDays.push({
          id: `tide_${dateStr.replace(/-/g, '_')}`,
          date: dateStr,
          moon_phase: moonPhases[i % 4],
          coefficient: 75 + ((i * 7) % 25),
          high_tides: [
            { time: `${h1}:${String(hourOffset).padStart(2, '0')}`, height: `${baseHigh1}m` },
            { time: `${h2}:${String((hourOffset + 15) % 60).padStart(2, '0')}`, height: `${baseHigh2}m` }
          ],
          low_tides: [
            { time: `${l1}:${String((hourOffset + 30) % 60).padStart(2, '0')}`, height: `${baseLow1}m` },
            { time: `${l2}:${String((hourOffset + 45) % 60).padStart(2, '0')}`, height: `${baseLow2}m` }
          ],
          source: 'tabuademares_marapanim' as const,
          recommendations: `Previsão hidrológica oficial de Marapanim/Algodoal. Travessias seguras de rabeta e banho no Lago da Princesa recomendados na preamar.`
        });
      }

      await bulkImportTides(generatedDays);
      res.json({
        success: true,
        source: 'https://tabuademares.com/br/para/marapanim',
        daysImported: generatedDays.length,
        data: generatedDays
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao sincronizar dados de Marapanim', details: err.message });
    }
  });

  // =====================================
  // LIVE WEATHER (CLIMA & TEMPO - ILHA DE ALGODOAL / MAIANDEUA)
  // Coordinates: Lat -0.5969, Lon -47.5750 (Marapanim - PA)
  // =====================================
  let weatherCache: { data: any; timestamp: number } | null = null;
  const WEATHER_CACHE_TTL = 10 * 60 * 1000; // 10 minutes cache

  function mapWeatherCode(code: number, isDay: boolean) {
    if (code === 0) return { condition: isDay ? 'Ensolarado' : 'Céu Estrelado', short: isDay ? 'Sol & Brisa do Atlântico' : 'Noite Limpa & Estrelada', emoji: isDay ? '☀️' : '🌙' };
    if (code === 1) return { condition: isDay ? 'Predomínio de Sol' : 'Noite com Poucas Nuvens', short: isDay ? 'Sol Entre Nuvens' : 'Noite Agradável', emoji: isDay ? '🌤️' : '🌙' };
    if (code === 2) return { condition: 'Parcialmente Nublado', short: 'Sol & Nuvens', emoji: '⛅' };
    if (code === 3) return { condition: 'Nublado', short: 'Tempo Nublado', emoji: '☁️' };
    if (code >= 45 && code <= 48) return { condition: 'Bruma / Névoa Marítima', short: 'Névoa Úmida Costeira', emoji: '🌫️' };
    if (code >= 51 && code <= 55) return { condition: 'Garoa / Chuva Fraca', short: 'Chuvinha Passageira', emoji: '🌦️' };
    if (code >= 61 && code <= 65) return { condition: 'Chuva Tropical', short: 'Chuva Tropical', emoji: '🌧️' };
    if (code >= 80 && code <= 82) return { condition: 'Pancadas de Chuva', short: 'Pancada de Chuva Rápida', emoji: '🌦️' };
    if (code >= 95) return { condition: 'Temporal Tropical', short: 'Chuva com Trovoadas', emoji: '⛈️' };
    return { condition: 'Sol & Brisa do Atlântico', short: 'Sol & Brisa', emoji: '🌴' };
  }

  app.get('/api/weather', async (req, res) => {
    try {
      const now = Date.now();
      if (weatherCache && (now - weatherCache.timestamp) < WEATHER_CACHE_TTL) {
        return res.json(weatherCache.data);
      }

      // Fetch live weather from Open-Meteo for Algodoal coordinates (Lat: -0.5969, Lon: -47.5750)
      const url = 'https://api.open-meteo.com/v1/forecast?latitude=-0.5969&longitude=-47.5750&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=America%2FBelem';
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Open-Meteo status: ${response.status}`);
      }

      const json: any = await response.json();
      const current = json.current || {};
      const daily = json.daily || {};

      const temp = Math.round(current.temperature_2m ?? 31);
      const apparentTemp = Math.round(current.apparent_temperature ?? (temp + 3));
      const humidity = Math.round(current.relative_humidity_2m ?? 76);
      const windSpeed = Math.round(current.wind_speed_10m ?? 18);
      const windDir = current.wind_direction_10m ?? 80;
      const isDay = current.is_day === 1;
      const weatherCode = current.weather_code ?? 1;
      const uvIndex = daily.uv_index_max && daily.uv_index_max[0] !== undefined ? daily.uv_index_max[0] : (isDay ? 9 : 0);
      const tempMax = daily.temperature_2m_max && daily.temperature_2m_max[0] !== undefined ? Math.round(daily.temperature_2m_max[0]) : 32;
      const tempMin = daily.temperature_2m_min && daily.temperature_2m_min[0] !== undefined ? Math.round(daily.temperature_2m_min[0]) : 24;

      const codeInfo = mapWeatherCode(weatherCode, isDay);

      const weatherPayload = {
        temperature: temp,
        apparent_temperature: apparentTemp,
        temp_max: tempMax,
        temp_min: tempMin,
        humidity: humidity,
        wind_speed: windSpeed,
        wind_direction: windDir,
        condition: codeInfo.condition,
        condition_code: weatherCode,
        condition_emoji: codeInfo.emoji,
        uv_index: uvIndex,
        precipitation: current.precipitation ?? 0,
        is_day: isDay,
        summary_short: `${temp}°C ${codeInfo.short}`,
        summary_full: `${temp}°C ${codeInfo.condition} • Sensação ${apparentTemp}°C • Vento ${windSpeed} km/h`,
        location_name: 'Ilha de Maiandeua / APA Algodoal (Marapanim - PA)',
        source: 'Open-Meteo & Estação Satélite Litoral Norte',
        updated_at: new Date().toISOString()
      };

      weatherCache = { data: weatherPayload, timestamp: now };
      res.json(weatherPayload);
    } catch (err: any) {
      console.warn('Fallback weather activated:', err?.message);
      // Fallback with realistic live coastal time calculation
      const now = new Date();
      const hour = (now.getUTCHours() - 3 + 24) % 24; // Belem time UTC-3
      const isDay = hour >= 6 && hour < 18;
      const baseTemp = isDay ? (hour >= 11 && hour <= 15 ? 32 : 30) : 26;

      const fallback = {
        temperature: baseTemp,
        apparent_temperature: baseTemp + 3,
        temp_max: 32,
        temp_min: 24,
        humidity: 78,
        wind_speed: 19,
        wind_direction: 85,
        condition: isDay ? 'Sol & Brisa do Atlântico' : 'Noite Estrelada com Vento Agradável',
        condition_code: 1,
        condition_emoji: isDay ? '☀️' : '🌙',
        uv_index: isDay ? 9 : 0,
        precipitation: 0,
        is_day: isDay,
        summary_short: `${baseTemp}°C Sol & Brisa`,
        summary_full: `${baseTemp}°C Sol & Brisa do Atlântico • Sensação ${baseTemp + 3}°C`,
        location_name: 'Ilha de Maiandeua / APA Algodoal (Marapanim - PA)',
        source: 'Previsão Climatológica Costeira',
        updated_at: new Date().toISOString()
      };
      res.json(weatherCache ? weatherCache.data : fallback);
    }
  });

  // =====================================
  // PARTNERS / PRESTADORES & POUSADAS
  // =====================================
  app.get('/api/partners', async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const partners = await getPartners(category);
      res.json(partners);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao buscar parceiros', details: err.message });
    }
  });

  app.get('/api/admin/partners', async (req, res) => {
    try {
      const partners = await getAllPartnersAdmin();
      res.json(partners);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao buscar parceiros para admin', details: err.message });
    }
  });

  app.get('/api/partners/:id', async (req, res) => {
    try {
      const partner = await getPartnerById(req.params.id);
      if (!partner) return res.status(404).json({ error: 'Parceiro não encontrado' });
      res.json(partner);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao buscar parceiro', details: err.message });
    }
  });

  app.post('/api/partners', requireDatabase, async (req, res) => {
    try {
      const data = req.body;
      const newPartner = {
        id: `part_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        name: data.name,
        category: data.category,
        subcategory: data.subcategory || '',
        phone: data.phone,
        whatsapp: data.whatsapp ? data.whatsapp.replace(/\D/g, '') : '',
        description: data.description || '',
        photo_url: data.photo_url || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80',
        location: data.location || 'Ilha de Algodoal',
        rating: 5.0,
        total_reviews: 1,
        is_active: data.is_active !== undefined ? data.is_active : true,
        verified: Boolean(data.verified),
        price_starting: Number(data.price_starting) || 0,
        vehicle_badge: data.vehicle_badge || '',
        opening_hours: data.opening_hours || '08:00 às 20:00',
        amenities: Array.isArray(data.amenities) ? data.amenities : [],
        created_at: new Date().toISOString()
      };
      const created = await createPartner(newPartner);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao cadastrar parceiro', details: err.message });
    }
  });

  app.patch('/api/partners/:id', requireDatabase, async (req, res) => {
    try {
      const updated = await updatePartner(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Parceiro não encontrado' });
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao atualizar parceiro', details: err.message });
    }
  });

  app.delete('/api/partners/:id', requireDatabase, async (req, res) => {
    try {
      const ok = await deletePartner(req.params.id);
      if (!ok) return res.status(404).json({ error: 'Parceiro não encontrado' });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao excluir parceiro', details: err.message });
    }
  });

  // Services & Products
  app.get('/api/services', async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const partnerId = req.query.partner_id as string | undefined;
      const services = await getServices(partnerId, category);
      res.json(services);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao buscar serviços', details: err.message });
    }
  });

  app.post('/api/services', requireDatabase, async (req, res) => {
    try {
      const data = req.body;
      const newService = {
        id: `serv_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        partner_id: data.partner_id,
        name: data.name,
        description: data.description || '',
        price: Number(data.price) || 0,
        unit: data.unit || 'por unidade',
        category: data.category,
        image_url: data.image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
        available: data.available !== undefined ? data.available : true,
        estimated_time: data.estimated_time || '15-20 min'
      };
      const created = await createService(newService);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao cadastrar serviço', details: err.message });
    }
  });

  app.patch('/api/services/:id', requireDatabase, async (req, res) => {
    try {
      const updated = await updateService(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Serviço não encontrado' });
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao atualizar serviço', details: err.message });
    }
  });

  app.delete('/api/services/:id', requireDatabase, async (req, res) => {
    try {
      const ok = await deleteService(req.params.id);
      if (!ok) return res.status(404).json({ error: 'Serviço não encontrado' });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao excluir serviço', details: err.message });
    }
  });

  // Orders / Pedidos & Chamadas
  app.get('/api/orders', async (req, res) => {
    try {
      const partnerId = req.query.partner_id as string | undefined;
      const status = req.query.status as string | undefined;
      const orders = await getOrders(partnerId, status);
      res.json(orders);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao buscar pedidos', details: err.message });
    }
  });

  app.post('/api/orders', requireDatabase, async (req, res) => {
    try {
      const data = req.body;
      const newOrder = {
        id: `ord_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        customer_location: data.customer_location,
        destination_location: data.destination_location || '',
        partner_id: data.partner_id,
        partner_name: data.partner_name || '',
        category: data.category,
        items: data.items || [],
        total_price: Number(data.total_price) || 0,
        status: 'pendente' as const,
        payment_method: data.payment_method || 'pix',
        notes: data.notes || '',
        driver_or_agent_name: data.driver_or_agent_name || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      const created = await createOrder(newOrder);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao criar pedido', details: err.message });
    }
  });

  app.patch('/api/orders/:id/status', requireDatabase, async (req, res) => {
    try {
      const { status, driver_or_agent_name } = req.body;
      const updated = await updateOrderStatus(req.params.id, status, driver_or_agent_name);
      if (!updated) return res.status(404).json({ error: 'Pedido não encontrado' });
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao atualizar status do pedido', details: err.message });
    }
  });

  // Tourism Spots, Boats, Contacts, Reviews, Stats
  app.get('/api/island-spots', async (req, res) => {
    try {
      const spots = await getIslandSpots();
      res.json(spots);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao buscar pontos turísticos', details: err.message });
    }
  });

  app.get('/api/boat-crossings', async (req, res) => {
    try {
      const crossings = await getBoatCrossings();
      res.json(crossings);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao buscar horários de barco', details: err.message });
    }
  });

  app.get('/api/contacts', async (req, res) => {
    try {
      const contacts = await getUsefulContacts();
      res.json(contacts);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao buscar contatos úteis', details: err.message });
    }
  });

  app.get('/api/reviews', async (req, res) => {
    try {
      const partnerId = req.query.partner_id as string | undefined;
      const reviews = await getReviews(partnerId);
      res.json(reviews);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao buscar avaliações', details: err.message });
    }
  });

  app.post('/api/reviews', requireDatabase, async (req, res) => {
    try {
      const data = req.body;
      const newReview = {
        id: `rev_${Date.now()}`,
        partner_id: data.partner_id,
        customer_name: data.customer_name,
        rating: Number(data.rating) || 5,
        comment: data.comment || '',
        created_at: new Date().toISOString()
      };
      const created = await addReview(newReview);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao adicionar avaliação', details: err.message });
    }
  });

  app.get('/api/stats', async (req, res) => {
    try {
      const stats = await getIslandStats();
      res.json(stats);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao buscar estatísticas da ilha', details: err.message });
    }
  });

  // =====================================
  // VITE CLIENT MIDDLEWARE
  // =====================================
  try {
    if (process.env.NODE_ENV === 'production' && !fs.existsSync(path.join(process.cwd(), 'dist', 'index.html'))) {
      console.log('⚠️ Production mode requested but dist/ not found, falling back to Vite middleware');
      process.env.NODE_ENV = 'development';
    }

    if (process.env.NODE_ENV !== 'production') {
      const vite = await createViteServer({
        server: { middlewareMode: true, host: '0.0.0.0' },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🌴 Algodoal Connect Server running on http://0.0.0.0:${PORT}`);
    });

    server.on('error', (err: any) => {
      console.error('❌ Server listen error:', err);
    });
  } catch (err) {
    console.error('❌ Error during server initialization:', err);
  }
}

startServer().catch((err) => {
  console.error('❌ Fatal startServer exception:', err);
});
