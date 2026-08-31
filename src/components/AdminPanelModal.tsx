import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  MousePointerClick, 
  Calendar, 
  Clock, 
  Waves, 
  Megaphone, 
  Hotel, 
  Utensils, 
  Compass, 
  Truck, 
  PartyPopper, 
  ShoppingBag, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink,
  ShieldCheck,
  Search,
  Sparkles,
  UploadCloud,
  FileText,
  Lock,
  User,
  KeyRound,
  LogOut,
  Sliders,
  DollarSign,
  Phone,
  MessageCircle,
  MapPin,
  Tag,
  CheckCircle2,
  BarChart2,
  TrendingUp,
  Image as ImageIcon,
  Info
} from 'lucide-react';
import { Advertisement, AdCategory, TideDayEntry, Partner, UserProfile, ServiceCategory } from '../types/index.ts';
import { api } from '../services/api.ts';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData?: () => void;
  currentUser?: UserProfile | null;
  onLoginSuccess?: (user: UserProfile) => void;
  onLogout?: () => void;
  onRequireAuth?: () => void;
}

const CATEGORY_TABS: Array<{ id: string; label: string; icon: any; color: string; bg: string }> = [
  { id: 'todos', label: 'Todos os Anúncios', icon: Megaphone, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200 text-amber-900' },
  { id: 'transporte', label: 'Transporte', icon: Truck, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200 text-amber-900' },
  { id: 'pousadas', label: 'Pousadas & Chalés', icon: Hotel, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200 text-emerald-900' },
  { id: 'passeios', label: 'Passeios & Rabetas', icon: Compass, color: 'text-sky-600', bg: 'bg-sky-50 border-sky-200 text-sky-900' },
  { id: 'alimentacao', label: 'Alimentação', icon: Utensils, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200 text-rose-900' },
  { id: 'compras', label: 'Compras & Depósito', icon: ShoppingBag, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200 text-emerald-900' },
  { id: 'eventos', label: 'Eventos & Cultura', icon: PartyPopper, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200 text-purple-900' },
  { id: 'informacoes', label: 'Guia da Ilha', icon: Info, color: 'text-teal-600', bg: 'bg-teal-50 border-teal-200 text-teal-900' },
];

const OFFICIAL_IMAGE_PRESETS = [
  { name: 'Charrete Tradicional', url: '/imagens/carroca.jpg' },
  { name: 'Vila Algodoal Rua', url: '/imagens/vila.jpg' },
  { name: 'Porto de Chegada', url: '/imagens/porto.jpg' },
  { name: 'Canal & Rabetas', url: '/imagens/canal.jpg' },
  { name: 'Praia & Ilha', url: '/imagens/algodoal.jpg' },
  { name: 'Luau & Noite', url: '/imagens/festa.jpg' },
  { name: 'Porto Barcos', url: '/imagens/porto2.jpg' },
  { name: 'Vila & Passeios', url: '/imagens/vila2.jpg' },
  { name: 'Restaurante / Peixada', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80' },
  { name: 'Depósito Água & Gelo', url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=800&auto=format&fit=crop&q=80' }
];

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  onRefreshData,
  currentUser,
  onLoginSuccess,
  onLogout
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'anuncios' | 'mares' | 'parceiros' | 'seguranca'>('anuncios');
  
  // Auth Form State (when not authenticated as admin)
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Data states
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [tideDays, setTideDays] = useState<TideDayEntry[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // Ad Filter & Search
  const [selectedAdCategory, setSelectedAdCategory] = useState<string>('todos');
  const [adSearchTerm, setAdSearchTerm] = useState('');
  const [adStatusFilter, setAdStatusFilter] = useState<'todos' | 'ativos' | 'pausados'>('todos');
  const [adSlotFilter, setAdSlotFilter] = useState<string>('todos');

  // Ad Form Modal state
  const [isEditingAd, setIsEditingAd] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url' | 'presets'>('upload');
  const [isDragOver, setIsDragOver] = useState(false);
  const [currentAd, setCurrentAd] = useState<Partial<Advertisement>>({
    title: '',
    business_name: '',
    category: 'alimentacao',
    tagline: '',
    description: '',
    image_url: '/imagens/carroca.jpg',
    whatsapp: '',
    phone: '',
    location: 'Praia da Princesa, Ilha de Algodoal',
    price_starting: 0,
    badge: 'Destaque',
    banner_slot: 'nenhum',
    is_active: true,
    is_highlighted: true,
    start_date: new Date().toISOString().split('T')[0],
    end_date: '2026-12-31'
  });

  // Password Change state
  const [currentAdminPass, setCurrentAdminPass] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [confirmAdminPass, setConfirmAdminPass] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Tide Form & Bulk Import states
  const [isAddingTideDay, setIsAddingTideDay] = useState(false);
  const [currentTideDay, setCurrentTideDay] = useState<Partial<TideDayEntry>>({
    date: new Date().toISOString().split('T')[0],
    moon_phase: 'Cheia',
    coefficient: 85,
    high_tides: [{ time: '05:00', height: '4.2m' }, { time: '17:30', height: '4.4m' }],
    low_tides: [{ time: '11:15', height: '0.4m' }, { time: '23:45', height: '0.5m' }],
    source: 'tabuademares_marapanim',
    recommendations: 'Maré alta ideal para banho e navegação de rabeta.'
  });
  const [bulkTideText, setBulkTideText] = useState('');
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);

  // Partner Form Modal state
  const [isAddingPartner, setIsAddingPartner] = useState(false);
  const [newPartner, setNewPartner] = useState<Partial<Partner>>({
    name: '',
    category: 'pousadas',
    subcategory: 'Hospedagem & Chalés',
    phone: '',
    whatsapp: '',
    description: '',
    location: 'Praia da Princesa, Ilha de Algodoal',
    price_starting: 150,
    opening_hours: 'Recepção 24h',
    verified: true,
    is_active: true,
    amenities: ['Wi-Fi', 'Ar-Condicionado', 'Café da Manhã']
  });

  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    if (isOpen && isAdmin) {
      loadAllAdminData();
    }
  }, [isOpen, isAdmin]);

  const loadAllAdminData = async () => {
    setIsLoading(true);
    setActionError('');
    try {
      // Load Ads (both active and inactive) directly from real DB
      const resAds = await fetch('/api/advertisements?only_active=false');
      const dataAds = await resAds.json();
      setAds(dataAds || []);

      // Load Tide Days
      const resTides = await fetch('/api/tides/days');
      const dataTides = await resTides.json();
      setTideDays(dataTides || []);

      // Load Partners
      const resPartners = await fetch('/api/admin/partners');
      const dataPartners = await resPartners.json();
      setPartners(dataPartners || []);

      // Load Users
      const resUsers = await fetch('/api/admin/users');
      const dataUsers = await resUsers.json();
      setUsers(dataUsers || []);
    } catch (err: any) {
      console.error('Erro ao carregar dados do admin:', err);
      setActionError('Falha ao conectar com o banco de dados do servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const showSuccess = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 4000);
  };

  // ==========================
  // ADMIN AUTHENTICATION
  // ==========================
  const handleAdminSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError('');

    try {
      const data = await api.adminLogin(loginUsername, loginPassword);
      if (data.success && data.user) {
        localStorage.setItem('algodoal_admin_token', data.token);
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
        showSuccess('Autenticado com sucesso no Painel de Administração!');
        loadAllAdminData();
      }
    } catch (err: any) {
      setAuthError(err.message || 'Senha ou usuário de Administrador incorretos.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('algodoal_admin_token');
    if (onLogout) {
      onLogout();
    }
    showSuccess('Sessão administrativa encerrada.');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newAdminPass && newAdminPass !== confirmAdminPass) {
      alert('A nova senha e a confirmação não coincidem.');
      return;
    }
    setIsChangingPass(true);
    try {
      await api.updateAdminPassword({
        currentPassword: currentAdminPass,
        newPassword: newAdminPass || undefined,
        newEmail: newAdminEmail || undefined
      });
      showSuccess('Credenciais de Administrador atualizadas com sucesso no banco de dados!');
      setCurrentAdminPass('');
      setNewAdminPass('');
      setConfirmAdminPass('');
    } catch (err: any) {
      alert(err.message || 'Erro ao alterar credenciais.');
    } finally {
      setIsChangingPass(false);
    }
  };

  // ==========================
  // AD ACTIONS (REAL BACKEND)
  // ==========================
  const handleToggleAdActive = async (ad: Advertisement) => {
    try {
      const res = await fetch(`/api/advertisements/${ad.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !ad.is_active })
      });
      if (res.ok) {
        const updated = await res.json();
        setAds(prev => prev.map(a => a.id === ad.id ? updated : a));
        showSuccess(`Anúncio "${ad.title}" ${updated.is_active ? 'ATIVADO' : 'PAUSADO'} com sucesso!`);
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickSlotChange = async (ad: Advertisement, newSlot: string) => {
    try {
      const res = await fetch(`/api/advertisements/${ad.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banner_slot: newSlot })
      });
      if (res.ok) {
        const updated = await res.json();
        setAds(prev => prev.map(a => a.id === ad.id ? updated : a));
        showSuccess(`Slot do banner atualizado para: ${newSlot.toUpperCase()}`);
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAd = async (id: string, title: string) => {
    if (!window.confirm(`Tem certeza absoluta que deseja excluir o anúncio "${title}"? Esta ação é irreversível no banco de dados.`)) return;
    try {
      const res = await fetch(`/api/advertisements/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAds(prev => prev.filter(a => a.id !== id));
        showSuccess('Anúncio excluído com sucesso do banco de dados.');
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageFileUpload = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido (JPG, PNG, WebP, GIF).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 10MB.');
      return;
    }

    setIsUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        try {
          const res = await api.uploadImage(base64Data, file.name);
          if (res.success && res.url) {
            setCurrentAd(prev => ({ ...prev, image_url: res.url }));
            showSuccess(`Imagem "${file.name}" enviada com sucesso!`);
          } else {
            setCurrentAd(prev => ({ ...prev, image_url: base64Data }));
            showSuccess(`Imagem "${file.name}" pronta!`);
          }
        } catch (err) {
          console.warn('Fallback base64 para imagem:', err);
          setCurrentAd(prev => ({ ...prev, image_url: base64Data }));
          showSuccess(`Imagem "${file.name}" carregada!`);
        } finally {
          setIsUploadingImage(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setIsUploadingImage(false);
      alert('Erro ao ler arquivo de imagem.');
    }
  };

  const handleSaveAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAd.title || !currentAd.category) {
      alert('Preencha pelo menos o título e a categoria do anúncio.');
      return;
    }

    try {
      if (currentAd.id) {
        // Edit existing ad in DB
        const res = await fetch(`/api/advertisements/${currentAd.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentAd)
        });
        const updated = await res.json();
        setAds(prev => prev.map(a => a.id === updated.id ? updated : a));
        showSuccess('Anúncio salvo e sincronizado no banco de dados!');
      } else {
        // Create new ad in DB
        const res = await fetch('/api/advertisements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentAd)
        });
        const created = await res.json();
        setAds(prev => [created, ...prev]);
        showSuccess('Novo anúncio cadastrado e veiculado com sucesso!');
      }
      setIsEditingAd(false);
      setCurrentAd({});
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar anúncio no servidor.');
    }
  };

  // ==========================
  // TIDE ACTIONS
  // ==========================
  const handleSyncMarapanim = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/tides/sync-marapanim');
      const data = await res.json();
      if (data.success) {
        setTideDays(data.data);
        showSuccess(`Sincronizados ${data.daysImported} dias da tábua de marés de Marapanim (tabuademares.com)!`);
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTideDay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTideDay.date) return;
    try {
      const res = await fetch('/api/tides/day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentTideDay)
      });
      const saved = await res.json();
      setTideDays(prev => {
        const filtered = prev.filter(t => t.date !== saved.date);
        return [...filtered, saved].sort((a, b) => a.date.localeCompare(b.date));
      });
      showSuccess(`Registro de maré para o dia ${currentTideDay.date} salvo com sucesso!`);
      setIsAddingTideDay(false);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkImportTides = async () => {
    if (!bulkTideText.trim()) return;
    try {
      const lines = bulkTideText.trim().split('\n');
      const parsedEntries: TideDayEntry[] = [];

      lines.forEach((line, idx) => {
        const parts = line.split(',').map(s => s.trim());
        if (parts.length >= 4) {
          parsedEntries.push({
            id: `tide_bulk_${Date.now()}_${idx}`,
            date: parts[0] || new Date().toISOString().split('T')[0],
            moon_phase: (parts[1] as any) || 'Cheia',
            coefficient: Number(parts[2]) || 80,
            high_tides: [
              { time: parts[3] || '04:00', height: parts[4] || '4.0m' },
              ...(parts[5] ? [{ time: parts[5], height: parts[6] || '4.2m' }] : [])
            ],
            low_tides: [
              { time: parts[7] || '10:00', height: parts[8] || '0.5m' },
              ...(parts[9] ? [{ time: parts[9], height: parts[10] || '0.6m' }] : [])
            ],
            source: 'marinha_brasil',
            recommendations: 'Tabela oficial da Marinha do Brasil'
          });
        }
      });

      if (parsedEntries.length === 0) {
        alert('Formato inválido. Use: Data (AAAA-MM-DD), Lua, Coeficiente, HoraAlta1, Altura1...');
        return;
      }

      const res = await fetch('/api/tides/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries: parsedEntries })
      });
      const data = await res.json();
      showSuccess(`${data.count} registros de maré importados com sucesso!`);
      setIsBulkImportOpen(false);
      setBulkTideText('');
      loadAllAdminData();
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================
  // PARTNER ACTIONS
  // ==========================
  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartner.name || !newPartner.category) return;
    try {
      const res = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPartner)
      });
      const created = await res.json();
      setPartners(prev => [created, ...prev]);
      showSuccess(`Parceiro/Pousada "${created.name}" cadastrado com sucesso!`);
      setIsAddingPartner(false);
      setNewPartner({
        name: '',
        category: 'pousadas',
        subcategory: 'Hospedagem & Chalés',
        location: 'Praia da Princesa, Ilha de Algodoal',
        price_starting: 150,
        opening_hours: 'Recepção 24h',
        verified: true,
        is_active: true,
        amenities: ['Wi-Fi', 'Ar-Condicionado', 'Café da Manhã']
      });
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered Ads Computation
  const filteredAds = useMemo(() => {
    return ads.filter(ad => {
      // Category filter
      if (selectedAdCategory !== 'todos') {
        const cat = (ad.category || '').toLowerCase();
        if (selectedAdCategory === 'transporte' && cat !== 'transporte') return false;
        if (selectedAdCategory === 'pousadas' && cat !== 'pousadas' && cat !== 'pousada') return false;
        if (selectedAdCategory === 'passeios' && cat !== 'passeios' && cat !== 'passeio') return false;
        if (selectedAdCategory === 'alimentacao' && cat !== 'alimentacao' && cat !== 'restaurante') return false;
        if (selectedAdCategory === 'compras' && cat !== 'compras') return false;
        if (selectedAdCategory === 'eventos' && cat !== 'eventos' && cat !== 'evento') return false;
        if (selectedAdCategory === 'informacoes' && cat !== 'informacoes' && cat !== 'guia') return false;
      }

      // Status filter
      if (adStatusFilter === 'ativos' && !ad.is_active) return false;
      if (adStatusFilter === 'pausados' && ad.is_active) return false;

      // Slot filter
      if (adSlotFilter !== 'todos' && ad.banner_slot !== adSlotFilter) return false;

      // Search term
      if (adSearchTerm.trim()) {
        const term = adSearchTerm.toLowerCase();
        const matchesTitle = (ad.title || '').toLowerCase().includes(term);
        const matchesBiz = (ad.business_name || '').toLowerCase().includes(term);
        const matchesLoc = (ad.location || '').toLowerCase().includes(term);
        if (!matchesTitle && !matchesBiz && !matchesLoc) return false;
      }

      return true;
    });
  }, [ads, selectedAdCategory, adStatusFilter, adSlotFilter, adSearchTerm]);

  // Category counts and metrics
  const categoryStats = useMemo(() => {
    const total = filteredAds.length;
    const active = filteredAds.filter(a => a.is_active).length;
    const views = filteredAds.reduce((acc, a) => acc + (a.views_count || 0), 0);
    const clicks = filteredAds.reduce((acc, a) => acc + (a.clicks_count || 0), 0);
    const ctr = views > 0 ? ((clicks / views) * 100).toFixed(1) : '0.0';
    return { total, active, views, clicks, ctr };
  }, [filteredAds]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white text-slate-900 rounded-3xl max-w-7xl w-full h-[94vh] max-h-[900px] shadow-2xl border border-sky-300/40 flex flex-col overflow-hidden">
        
        {/* ======================================================== */}
        {/* 1. TOP HEADER                                            */}
        {/* ======================================================== */}
        <div className="px-5 sm:px-8 py-4 border-b border-slate-800 bg-slate-900 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg sm:text-xl font-black font-serif text-white tracking-tight">
                  Painel de Controle do Administrador
                </h2>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Banco em Tempo Real
                </span>
              </div>
              <p className="text-xs text-slate-300 hidden sm:block">
                Gerenciador de Anúncios por Categorias, Banners Hero, Tábua de Marés e Estabelecimentos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-slate-300 font-bold">{currentUser?.name || 'Admin Geral'}</span>
                <button
                  onClick={handleAdminLogout}
                  title="Encerrar Sessão"
                  className="ml-2 text-slate-400 hover:text-red-400 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Toast Alert */}
        {actionSuccess && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-black flex items-center justify-between shadow-inner animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess('')} className="cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {actionError && (
          <div className="bg-red-600 text-white px-6 py-2.5 text-xs font-bold flex items-center justify-between animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{actionError}</span>
            </div>
            <button onClick={() => setActionError('')} className="cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. AUTHENTICATION GATE (Se não for Admin)                 */}
        {/* ======================================================== */}
        {!isAdmin ? (
          <div className="flex-1 overflow-y-auto p-6 sm:p-12 flex items-center justify-center bg-slate-100">
            <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center">
              <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 font-serif mb-1">
                Acesso Restrito ao Administrador
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Informe o usuário e a senha master configurada no banco de dados para acessar o Gerenciador de Anúncios.
              </p>

              {authError && (
                <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-left flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleAdminSubmitLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                    Usuário ou Email de Admin
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      placeholder="admin"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                    Senha / PIN Master
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Digite a senha (padrão: algodoal2026)"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                    />
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900">
                  💡 <strong>Credenciais Padrão:</strong> Usuário: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">admin</code> | Senha: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">algodoal2026</code>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoggingIn ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-5 h-5" />
                  )}
                  <span>Entrar no Gerenciador</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          <>
            {/* ======================================================== */}
            {/* 3. MAIN NAVIGATION TABS                                  */}
            {/* ======================================================== */}
            <div className="flex bg-slate-100 border-b border-slate-200 px-6 pt-2 gap-2 overflow-x-auto text-xs font-black shrink-0">
              <button
                onClick={() => setActiveMainTab('anuncios')}
                className={`py-3 px-4 rounded-t-xl border-b-2 flex items-center gap-2 transition cursor-pointer ${
                  activeMainTab === 'anuncios'
                    ? 'border-amber-500 bg-white text-amber-950 shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Megaphone className="w-4 h-4 text-amber-600" />
                <span>🎯 Gerenciador de Anúncios & Banners ({ads.length})</span>
              </button>

              <button
                onClick={() => setActiveMainTab('mares')}
                className={`py-3 px-4 rounded-t-xl border-b-2 flex items-center gap-2 transition cursor-pointer ${
                  activeMainTab === 'mares'
                    ? 'border-sky-500 bg-white text-sky-950 shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Waves className="w-4 h-4 text-sky-600" />
                <span>🌊 Tábua de Marés (Marapanim)</span>
              </button>

              <button
                onClick={() => setActiveMainTab('parceiros')}
                className={`py-3 px-4 rounded-t-xl border-b-2 flex items-center gap-2 transition cursor-pointer ${
                  activeMainTab === 'parceiros'
                    ? 'border-emerald-500 bg-white text-emerald-950 shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Hotel className="w-4 h-4 text-emerald-600" />
                <span>🏨 Pousadas & Parceiros ({partners.length})</span>
              </button>

              <button
                onClick={() => setActiveMainTab('seguranca')}
                className={`py-3 px-4 rounded-t-xl border-b-2 flex items-center gap-2 transition cursor-pointer ${
                  activeMainTab === 'seguranca'
                    ? 'border-indigo-500 bg-white text-indigo-950 shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <KeyRound className="w-4 h-4 text-indigo-600" />
                <span>⚙️ Segurança & Senha Admin</span>
              </button>
            </div>

            {/* ======================================================== */}
            {/* 4. TAB CONTENTS                                          */}
            {/* ======================================================== */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
              
              {/* TAB 1: GERENCIADOR DE ANÚNCIOS */}
              {activeMainTab === 'anuncios' && (
                <div className="space-y-6 max-w-7xl mx-auto">
                  
                  {/* Category Filter Pills (Matching Site Categories) */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-amber-600" />
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                          Filtrar por Categoria do Site
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-slate-500">
                        {filteredAds.length} anúncios encontrados
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                      {CATEGORY_TABS.map((tab) => {
                        const Icon = tab.icon;
                        const count = tab.id === 'todos' 
                          ? ads.length 
                          : ads.filter(a => {
                              const c = (a.category || '').toLowerCase();
                              if (tab.id === 'transporte') return c === 'transporte';
                              if (tab.id === 'pousadas') return c === 'pousadas' || c === 'pousada';
                              if (tab.id === 'passeios') return c === 'passeios' || c === 'passeio';
                              if (tab.id === 'alimentacao') return c === 'alimentacao' || c === 'restaurante';
                              if (tab.id === 'compras') return c === 'compras';
                              if (tab.id === 'eventos') return c === 'eventos' || c === 'evento';
                              if (tab.id === 'informacoes') return c === 'informacoes' || c === 'guia';
                              return false;
                            }).length;

                        const isSelected = selectedAdCategory === tab.id;

                        return (
                          <button
                            key={tab.id}
                            onClick={() => setSelectedAdCategory(tab.id)}
                            className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-amber-400 border-amber-500 text-slate-950 shadow-sm font-black'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-bold'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <Icon className={`w-4 h-4 ${isSelected ? 'text-slate-950' : tab.color}`} />
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-slate-950 text-amber-300' : 'bg-slate-200 text-slate-700'}`}>
                                {count}
                              </span>
                            </div>
                            <span className="text-xs truncate">{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary Metric Strip for Selected Category */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                        <Megaphone className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase block">Total Anúncios</span>
                        <span className="text-lg font-black text-slate-900">{categoryStats.total}</span>
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase block">Ativos Agora</span>
                        <span className="text-lg font-black text-emerald-600">{categoryStats.active}</span>
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-black">
                        <Eye className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase block">Visualizações</span>
                        <span className="text-lg font-black text-sky-600">{categoryStats.views.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                        <MousePointerClick className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase block">Cliques WhatsApp</span>
                        <span className="text-lg font-black text-indigo-600">{categoryStats.clicks.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3 col-span-2 sm:col-span-1">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase block">Taxa CTR</span>
                        <span className="text-lg font-black text-purple-600">{categoryStats.ctr}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Filter Toolbar & Add Button */}
                  <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <div className="relative min-w-[220px]">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Buscar por título ou empresa..."
                          value={adSearchTerm}
                          onChange={(e) => setAdSearchTerm(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-amber-500"
                        />
                      </div>

                      <select
                        value={adStatusFilter}
                        onChange={(e) => setAdStatusFilter(e.target.value as any)}
                        className="py-2 px-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-slate-50 focus:bg-white"
                      >
                        <option value="todos">Status: Todos</option>
                        <option value="ativos">🟢 Somente Ativos</option>
                        <option value="pausados">⏸️ Somente Pausados</option>
                      </select>

                      <select
                        value={adSlotFilter}
                        onChange={(e) => setAdSlotFilter(e.target.value)}
                        className="py-2 px-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-slate-50 focus:bg-white"
                      >
                        <option value="todos">Slot: Todos os Banners</option>
                        <option value="banner_1">🏷️ Banner 1 (Amarelo - Transporte)</option>
                        <option value="banner_2">🏷️ Banner 2 (Vinho - Alimentação)</option>
                        <option value="banner_3">🏷️ Banner 3 (Verde - Compras)</option>
                        <option value="banner_4">🏷️ Banner 4 (Azul - Passeios)</option>
                        <option value="destaque_topo">⭐ Destaque Topo</option>
                        <option value="nenhum">Sem Slot Hero</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={loadAllAdminData}
                        disabled={isLoading}
                        title="Recarregar Dados Reais"
                        className="p-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                      >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                      </button>

                      <button
                        onClick={() => {
                          setCurrentAd({
                            title: '',
                            business_name: '',
                            category: (selectedAdCategory !== 'todos' ? selectedAdCategory : 'alimentacao') as any,
                            banner_slot: 'banner_1',
                            is_active: true,
                            is_highlighted: true,
                            start_date: new Date().toISOString().split('T')[0],
                            end_date: '2026-12-31',
                            price_starting: 0,
                            image_url: '/assets/images/rabeta_barco_mar_1787985502030.jpg',
                            location: 'Praia da Princesa, Ilha de Algodoal'
                          });
                          setIsEditingAd(true);
                        }}
                        className="py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-sm transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Novo Anúncio / Banner</span>
                      </button>
                    </div>
                  </div>

                  {/* Ads Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAds.length === 0 ? (
                      <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-200 p-8">
                        <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h4 className="text-base font-black text-slate-700">Nenhum anúncio encontrado</h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Nenhum anúncio corresponde aos filtros selecionados. Crie um novo anúncio ou limpe os filtros.
                        </p>
                      </div>
                    ) : (
                      filteredAds.map((ad) => (
                        <div
                          key={ad.id}
                          className={`bg-white rounded-2xl border transition shadow-xs flex flex-col justify-between overflow-hidden ${
                            ad.is_active ? 'border-slate-200' : 'border-slate-300 opacity-75 bg-slate-50'
                          }`}
                        >
                          {/* Card Header & Media */}
                          <div className="p-4">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  ad.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                                }`}>
                                  {ad.is_active ? '🟢 Ativo' : '⏸️ Pausado'}
                                </span>

                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                  {ad.category}
                                </span>

                                {ad.banner_slot && ad.banner_slot !== 'nenhum' && (
                                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                                    Slot: {ad.banner_slot.replace('_', ' ')}
                                  </span>
                                )}
                              </div>

                              <button
                                onClick={() => handleToggleAdActive(ad)}
                                title={ad.is_active ? 'Pausar anúncio' : 'Ativar anúncio'}
                                className={`text-[11px] font-bold px-2 py-1 rounded-lg transition cursor-pointer ${
                                  ad.is_active ? 'bg-amber-100 text-amber-900 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                                }`}
                              >
                                {ad.is_active ? 'Pausar' : 'Ativar'}
                              </button>
                            </div>

                            <div className="flex gap-3 mt-2">
                              <img
                                src={ad.image_url || '/assets/images/rabeta_barco_mar_1787985502030.jpg'}
                                alt={ad.title}
                                className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <h4 className="text-sm font-black text-slate-900 line-clamp-1">
                                  {ad.title}
                                </h4>
                                <span className="text-xs font-bold text-amber-700 block line-clamp-1">
                                  {ad.business_name || 'Estabelecimento'}
                                </span>
                                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                                  {ad.description || ad.tagline || 'Sem descrição'}
                                </p>
                              </div>
                            </div>

                            {/* Details meta */}
                            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
                              <div className="flex items-center gap-1.5 truncate">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">{ad.location || 'Algodoal'}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="font-bold text-slate-900">
                                  {ad.price_starting ? `A partir de R$ ${ad.price_starting.toFixed(2)}` : 'Consulte valores'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Card Footer: Metrics & Actions */}
                          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3 text-slate-600 font-bold">
                              <span className="flex items-center gap-1" title="Visualizações">
                                <Eye className="w-3.5 h-3.5 text-sky-600" />
                                {ad.views_count || 0}
                              </span>
                              <span className="flex items-center gap-1" title="Cliques / WhatsApp">
                                <MousePointerClick className="w-3.5 h-3.5 text-emerald-600" />
                                {ad.clicks_count || 0}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {ad.whatsapp && (
                                <a
                                  href={`https://wa.me/${ad.whatsapp.replace(/\D/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Testar WhatsApp"
                                  className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                </a>
                              )}

                              <button
                                onClick={() => {
                                  setCurrentAd(ad);
                                  setIsEditingAd(true);
                                }}
                                title="Editar Anúncio"
                                className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 transition cursor-pointer"
                              >
                                <Edit className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleDeleteAd(ad.id, ad.title)}
                                title="Excluir Anúncio"
                                className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: TÁBUA DE MARÉS */}
              {activeMainTab === 'mares' && (
                <div className="space-y-6 max-w-6xl mx-auto">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-black text-slate-900 font-serif">
                        Tábua de Marés Oficial (Estação Marapanim / Algodoal)
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Dados de preamar e baixa-mar sincronizados com a capitania e tabuademares.com.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSyncMarapanim}
                        disabled={isLoading}
                        className="py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                        <span>Sincronizar Marapanim</span>
                      </button>

                      <button
                        onClick={() => setIsAddingTideDay(true)}
                        className="py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Inserir Dia</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 font-black uppercase text-[11px] border-b border-slate-200">
                          <th className="py-3 px-4">Data</th>
                          <th className="py-3 px-4">Lua & Coeficiente</th>
                          <th className="py-3 px-4">Marés Altas</th>
                          <th className="py-3 px-4">Marés Baixas</th>
                          <th className="py-3 px-4">Recomendações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {tideDays.map((tide) => (
                          <tr key={tide.id || tide.date} className="hover:bg-slate-50">
                            <td className="py-3 px-4 font-black text-slate-900">{tide.date}</td>
                            <td className="py-3 px-4">
                              <span className="font-bold text-amber-700">{tide.moon_phase}</span> (Coef: {tide.coefficient})
                            </td>
                            <td className="py-3 px-4 text-sky-700 font-bold">
                              {tide.high_tides.map(h => `${h.time} (${h.height})`).join(' | ')}
                            </td>
                            <td className="py-3 px-4 text-emerald-700 font-bold">
                              {tide.low_tides.map(l => `${l.time} (${l.height})`).join(' | ')}
                            </td>
                            <td className="py-3 px-4 text-slate-500 text-[11px] max-w-xs truncate">
                              {tide.recommendations || 'Normal'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: POUSADAS & PARCEIROS */}
              {activeMainTab === 'parceiros' && (
                <div className="space-y-6 max-w-6xl mx-auto">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-slate-900 font-serif">
                        Parceiros Credenciados e Pousadas
                      </h3>
                      <p className="text-xs text-slate-500">
                        {partners.length} estabelecimentos cadastrados na base de dados.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsAddingPartner(true)}
                      className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Cadastrar Pousada / Parceiro</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {partners.map((p) => (
                      <div key={p.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex gap-3">
                        <img
                          src={p.photo_url || '/assets/images/rabeta_barco_mar_1787985502030.jpg'}
                          alt={p.name}
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-black text-slate-900 truncate">{p.name}</h4>
                          <span className="text-[10px] font-bold uppercase text-emerald-700 block">{p.subcategory || p.category}</span>
                          <span className="text-[11px] text-slate-500 block truncate mt-0.5">{p.location}</span>
                          <span className="text-[11px] font-bold text-slate-900 block mt-1">
                            A partir de R$ {p.price_starting?.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: SEGURANÇA & CREDENCIAIS */}
              {activeMainTab === 'seguranca' && (
                <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black">
                      <KeyRound className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 font-serif">
                        Segurança & Senha Master do Admin
                      </h3>
                      <p className="text-xs text-slate-500">
                        Altere os dados de acesso salvos no banco de dados do servidor.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-4 text-xs font-bold text-slate-700">
                    <div>
                      <label className="block mb-1 text-slate-900 uppercase tracking-wider text-[10px]">
                        Senha / PIN Atual
                      </label>
                      <input
                        type="password"
                        required
                        value={currentAdminPass}
                        onChange={(e) => setCurrentAdminPass(e.target.value)}
                        placeholder="Digite a senha atual"
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-slate-900 uppercase tracking-wider text-[10px]">
                        Novo Email de Administrador (Opcional)
                      </label>
                      <input
                        type="email"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        placeholder="admin@algodoalconnect.com.br"
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-slate-900 uppercase tracking-wider text-[10px]">
                        Nova Senha / PIN Master
                      </label>
                      <input
                        type="password"
                        value={newAdminPass}
                        onChange={(e) => setNewAdminPass(e.target.value)}
                        placeholder="Deixe em branco se não desejar alterar a senha"
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-slate-900 uppercase tracking-wider text-[10px]">
                        Confirmar Nova Senha
                      </label>
                      <input
                        type="password"
                        value={confirmAdminPass}
                        onChange={(e) => setConfirmAdminPass(e.target.value)}
                        placeholder="Repita a nova senha"
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isChangingPass}
                      className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition cursor-pointer shadow-md"
                    >
                      {isChangingPass ? 'Atualizando Banco de Dados...' : 'Salvar Novas Credenciais no Banco'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </>
        )}

        {/* ======================================================== */}
        {/* 5. MODAL FORM: CRIAR / EDITAR ANÚNCIO (LIVE PREVIEW)     */}
        {/* ======================================================== */}
        {isEditingAd && (
          <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-amber-300 overflow-hidden animate-in zoom-in-95 duration-200">
              
              {/* Header */}
              <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Megaphone className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-black font-serif">
                    {currentAd.id ? 'Editar Anúncio no Banco de Dados' : 'Cadastrar Novo Anúncio / Banner'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsEditingAd(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form & Live Preview Grid */}
              <form onSubmit={handleSaveAd} className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50">
                
                {/* Form Fields (Col 7) */}
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                      Título do Anúncio *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Peixada com Jambu no Restaurante O Marujo"
                      value={currentAd.title || ''}
                      onChange={(e) => setCurrentAd(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                        Nome do Estabelecimento
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Restaurante O Marujo"
                        value={currentAd.business_name || ''}
                        onChange={(e) => setCurrentAd(prev => ({ ...prev, business_name: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                        Categoria do Site *
                      </label>
                      <select
                        value={currentAd.category || 'alimentacao'}
                        onChange={(e) => setCurrentAd(prev => ({ ...prev, category: e.target.value as any }))}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                      >
                        <option value="transporte">🚖 Transporte & Charretes</option>
                        <option value="pousadas">🏨 Pousadas & Chalés</option>
                        <option value="passeios">⛵ Passeios & Rabetas</option>
                        <option value="alimentacao">🍲 Alimentação & Restaurantes</option>
                        <option value="compras">🛍️ Compras & Depósito</option>
                        <option value="eventos">🎉 Eventos & Cultura</option>
                        <option value="informacoes">ℹ️ Guia da Ilha</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                        Slot do Banner no Hero
                      </label>
                      <select
                        value={currentAd.banner_slot || 'nenhum'}
                        onChange={(e) => setCurrentAd(prev => ({ ...prev, banner_slot: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                      >
                        <option value="nenhum">Nenhum (Apenas na Categoria)</option>
                        <option value="banner_1">🏷️ Banner 1 (Amarelo - Transporte)</option>
                        <option value="banner_2">🏷️ Banner 2 (Vinho - Alimentação)</option>
                        <option value="banner_3">🏷️ Banner 3 (Verde - Compras/Depósito)</option>
                        <option value="banner_4">🏷️ Banner 4 (Azul - Passeios)</option>
                        <option value="destaque_topo">⭐ Destaque Topo</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                        Selo / Badge Promocional
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Mais Recomendado, Top 1"
                        value={currentAd.badge || ''}
                        onChange={(e) => setCurrentAd(prev => ({ ...prev, badge: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                      Slogan / Subtítulo Curto
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: O melhor peixe frito com açaí grosso na beira da praia"
                      value={currentAd.tagline || ''}
                      onChange={(e) => setCurrentAd(prev => ({ ...prev, tagline: e.target.value }))}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                      Descrição Completa
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Detalhes sobre a oferta, localização, diferenciais e horários..."
                      value={currentAd.description || ''}
                      onChange={(e) => setCurrentAd(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                        WhatsApp (apenas números com DDD)
                      </label>
                      <input
                        type="text"
                        placeholder="5591983342211"
                        value={currentAd.whatsapp || ''}
                        onChange={(e) => setCurrentAd(prev => ({ ...prev, whatsapp: e.target.value.replace(/\D/g, '') }))}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                        Preço Inicial (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={currentAd.price_starting || 0}
                        onChange={(e) => setCurrentAd(prev => ({ ...prev, price_starting: Number(e.target.value) }))}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                      Localização na Ilha
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Praia da Princesa, Barraca 04"
                      value={currentAd.location || ''}
                      onChange={(e) => setCurrentAd(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
                    />
                  </div>

                  {/* Image Selector & Upload Section */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-black uppercase text-slate-800">
                        Foto / Imagem do Anúncio *
                      </label>
                      <div className="flex bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                        <button
                          type="button"
                          onClick={() => setImageInputMode('upload')}
                          className={`px-2 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
                            imageInputMode === 'upload' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <UploadCloud className="w-3 h-3" />
                          <span>Subir Imagem</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageInputMode('presets')}
                          className={`px-2 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
                            imageInputMode === 'presets' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <ImageIcon className="w-3 h-3" />
                          <span>Fotos da Ilha</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageInputMode('url')}
                          className={`px-2 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
                            imageInputMode === 'url' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>URL / Link</span>
                        </button>
                      </div>
                    </div>

                    {/* Mode 1: Subir Imagem do Dispositivo */}
                    {imageInputMode === 'upload' && (
                      <div className="space-y-2">
                        <div
                          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                          onDragLeave={() => setIsDragOver(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDragOver(false);
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                              handleImageFileUpload(e.dataTransfer.files[0]);
                            }
                          }}
                          onClick={() => {
                            const input = document.getElementById('ad-image-file-input') as HTMLInputElement;
                            if (input) input.click();
                          }}
                          className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition ${
                            isDragOver
                              ? 'border-amber-500 bg-amber-50/80 scale-[1.01]'
                              : 'border-slate-300 hover:border-amber-400 bg-slate-50/70 hover:bg-amber-50/30'
                          }`}
                        >
                          <input
                            type="file"
                            id="ad-image-file-input"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleImageFileUpload(e.target.files[0]);
                              }
                            }}
                            className="hidden"
                          />

                          {isUploadingImage ? (
                            <div className="py-3 flex flex-col items-center justify-center gap-2">
                              <RefreshCw className="w-6 h-6 text-amber-500 animate-spin" />
                              <span className="text-xs font-black text-slate-800">Enviando e processando imagem...</span>
                            </div>
                          ) : (
                            <div className="py-2 flex flex-col items-center justify-center gap-1.5">
                              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs">
                                <UploadCloud className="w-5 h-5" />
                              </div>
                              <div className="text-xs font-black text-slate-800">
                                Clique para escolher uma foto ou arraste o arquivo aqui
                              </div>
                              <p className="text-[11px] text-slate-500">
                                Suporta JPG, PNG, WebP do seu celular ou computador (Máx: 10MB)
                              </p>
                            </div>
                          )}
                        </div>

                        {currentAd.image_url && (
                          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={currentAd.image_url}
                                alt="Miniatura"
                                className="w-8 h-8 rounded-lg object-cover border border-slate-300 shrink-0"
                              />
                              <span className="text-[11px] font-bold text-slate-700 truncate">
                                Imagem selecionada: {currentAd.image_url.split('/').pop()}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const input = document.getElementById('ad-image-file-input') as HTMLInputElement;
                                if (input) input.click();
                              }}
                              className="text-[11px] font-black text-amber-700 hover:text-amber-800 underline ml-2 shrink-0 cursor-pointer"
                            >
                              Trocar foto
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Mode 2: Fotos Pré-configuradas da Ilha */}
                    {imageInputMode === 'presets' && (
                      <div className="space-y-2">
                        <span className="text-[11px] text-slate-500 font-bold block">
                          Selecione uma foto temática da Ilha de Algodoal:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-44 overflow-y-auto pr-1">
                          {OFFICIAL_IMAGE_PRESETS.map((preset, idx) => {
                            const isChosen = currentAd.image_url === preset.url;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setCurrentAd(prev => ({ ...prev, image_url: preset.url }))}
                                className={`p-1.5 rounded-xl border text-left flex items-center gap-2 transition cursor-pointer ${
                                  isChosen
                                    ? 'border-amber-500 bg-amber-100/70 font-black text-slate-900 shadow-xs'
                                    : 'border-slate-200 hover:border-amber-300 bg-slate-50 text-slate-700'
                                }`}
                              >
                                <img
                                  src={preset.url}
                                  alt={preset.name}
                                  className="w-7 h-7 rounded-lg object-cover border border-slate-300 shrink-0"
                                />
                                <span className="text-[10px] font-bold truncate leading-tight">
                                  {preset.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Mode 3: Digitar URL direta */}
                    {imageInputMode === 'url' && (
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          placeholder="https://exemplo.com/foto.jpg ou /imagens/carroca.jpg"
                          value={currentAd.image_url || ''}
                          onChange={(e) => setCurrentAd(prev => ({ ...prev, image_url: e.target.value }))}
                          className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
                        />
                        <p className="text-[10px] text-slate-400">
                          Cole o link direto da imagem hospedada ou caminho relativo local.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Status checkbox */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="ad_active_toggle"
                      checked={currentAd.is_active ?? true}
                      onChange={(e) => setCurrentAd(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="w-4 h-4 text-amber-600 rounded"
                    />
                    <label htmlFor="ad_active_toggle" className="text-xs font-black text-slate-900 cursor-pointer">
                      Anúncio Ativo e Visível no Site
                    </label>
                  </div>
                </div>

                {/* Live Preview Column (Col 5) */}
                <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                      <Eye className="w-4 h-4 text-amber-600" />
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                        Prévia em Tempo Real
                      </h4>
                    </div>

                    {/* Preview Card */}
                    <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
                      <div className="relative h-40 bg-slate-100">
                        <img
                          src={currentAd.image_url || '/imagens/carroca.jpg'}
                          alt="Prévia"
                          className="w-full h-full object-cover"
                        />
                        {currentAd.badge && (
                          <span className="absolute top-2 left-2 bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-md">
                            {currentAd.badge}
                          </span>
                        )}
                        {currentAd.banner_slot && currentAd.banner_slot !== 'nenhum' && (
                          <span className="absolute top-2 right-2 bg-slate-950/80 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-white/20">
                            {currentAd.banner_slot}
                          </span>
                        )}
                      </div>

                      <div className="p-4 space-y-2">
                        <span className="text-[10px] font-bold uppercase text-amber-700 block">
                          {currentAd.business_name || 'Nome do Estabelecimento'}
                        </span>
                        <h5 className="text-sm font-black text-slate-900">
                          {currentAd.title || 'Título do Anúncio'}
                        </h5>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {currentAd.description || currentAd.tagline || 'Descrição prévia do anúncio...'}
                        </p>

                        <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                          <span className="font-bold text-slate-900">
                            {currentAd.price_starting ? `R$ ${currentAd.price_starting.toFixed(2)}` : 'Consulte'}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            📍 {currentAd.location || 'Algodoal'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditingAd(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Salvar</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Inserir Dia de Maré */}
        {isAddingTideDay && (
          <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-sky-300">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h4 className="text-sm font-black font-serif text-slate-900">Inserir Registro de Maré</h4>
                <button onClick={() => setIsAddingTideDay(false)}><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleSaveTideDay} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold">Data (AAAA-MM-DD)</label>
                  <input
                    type="date"
                    required
                    value={currentTideDay.date}
                    onChange={(e) => setCurrentTideDay(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold">Fase da Lua</label>
                  <select
                    value={currentTideDay.moon_phase}
                    onChange={(e) => setCurrentTideDay(prev => ({ ...prev, moon_phase: e.target.value as any }))}
                    className="w-full p-2 border rounded-xl"
                  >
                    <option value="Nova">Nova</option>
                    <option value="Crescente">Crescente</option>
                    <option value="Cheia">Cheia</option>
                    <option value="Minguante">Minguante</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold">Recomendações</label>
                  <textarea
                    rows={2}
                    value={currentTideDay.recommendations || ''}
                    onChange={(e) => setCurrentTideDay(prev => ({ ...prev, recommendations: e.target.value }))}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-500 transition"
                >
                  Salvar Maré no Banco
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
