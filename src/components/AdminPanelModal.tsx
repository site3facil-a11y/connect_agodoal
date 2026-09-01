import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit, 
  Edit2,
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
import { Advertisement, AdCategory, TideDayEntry, Partner, UserProfile, ServiceCategory, IslandStory } from '../types/index.ts';
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

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  onRefreshData,
  currentUser,
  onLoginSuccess,
  onLogout
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'anuncios' | 'stories' | 'mares' | 'parceiros' | 'seguranca'>('anuncios');
  
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
  const [isEditingPartner, setIsEditingPartner] = useState(false);
  const [currentPartner, setCurrentPartner] = useState<Partial<Partner>>({});
  const [isUploadingPartnerImage, setIsUploadingPartnerImage] = useState(false);
  const [isPartnerDragOver, setIsPartnerDragOver] = useState(false);
  const [partnerSearchTerm, setPartnerSearchTerm] = useState('');
  const [partnerCategoryFilter, setPartnerCategoryFilter] = useState('todos');
  const [partnerStatusFilter, setPartnerStatusFilter] = useState<'todos' | 'ativos' | 'inativos'>('todos');
  const [newAmenityInput, setNewAmenityInput] = useState('');

  // Stories (Destaques da Ilha) Form & List states
  const [stories, setStories] = useState<IslandStory[]>([]);
  const [isEditingStory, setIsEditingStory] = useState(false);
  const [currentStory, setCurrentStory] = useState<Partial<IslandStory>>({});
  const [storySearchTerm, setStorySearchTerm] = useState('');
  const [isUploadingStoryCover, setIsUploadingStoryCover] = useState(false);
  const [isUploadingStoryFull, setIsUploadingStoryFull] = useState(false);
  const [isStoryDragOverCover, setIsStoryDragOverCover] = useState(false);
  const [isStoryDragOverFull, setIsStoryDragOverFull] = useState(false);

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

      // Load Stories
      const resStories = await fetch('/api/stories');
      const dataStories = await resStories.json();
      setStories(dataStories || []);

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
  // PARTNER ACTIONS (POUSADAS & CREDENCIADOS)
  // ==========================
  const handleOpenAddPartner = () => {
    setCurrentPartner({
      name: '',
      category: 'pousadas',
      subcategory: 'Hospedagem & Chalés',
      phone: '',
      whatsapp: '',
      description: '',
      location: 'Praia da Princesa, Ilha de Algodoal',
      price_starting: 150,
      vehicle_badge: '',
      opening_hours: 'Recepção 24h',
      verified: true,
      is_active: true,
      photo_url: '',
      amenities: ['Wi-Fi Starlink', 'Ar-Condicionado', 'Café da Manhã']
    });
    setIsEditingPartner(true);
  };

  const handleOpenEditPartner = (partner: Partner) => {
    setCurrentPartner({
      ...partner,
      amenities: Array.isArray(partner.amenities) ? [...partner.amenities] : []
    });
    setIsEditingPartner(true);
  };

  const handleDeletePartner = async (id: string, name: string) => {
    if (!window.confirm(`Tem certeza absoluta que deseja excluir o parceiro "${name}" do banco de dados? Esta ação não pode ser desfeita.`)) return;
    try {
      const res = await fetch(`/api/partners/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPartners(prev => prev.filter(p => p.id !== id));
        showSuccess(`Parceiro/Pousada "${name}" excluído com sucesso do banco de dados!`);
        if (onRefreshData) onRefreshData();
      } else {
        alert('Erro ao excluir parceiro no servidor.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir parceiro.');
    }
  };

  const handleTogglePartnerStatus = async (partner: Partner) => {
    try {
      const newStatus = !partner.is_active;
      const res = await fetch(`/api/partners/${partner.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: newStatus })
      });
      if (res.ok) {
        setPartners(prev => prev.map(p => p.id === partner.id ? { ...p, is_active: newStatus } : p));
        showSuccess(`Status de "${partner.name}" alterado para ${newStatus ? 'Ativo' : 'Inativo/Pausado'}`);
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePartnerVerified = async (partner: Partner) => {
    try {
      const newVerified = !partner.verified;
      const res = await fetch(`/api/partners/${partner.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: newVerified })
      });
      if (res.ok) {
        setPartners(prev => prev.map(p => p.id === partner.id ? { ...p, verified: newVerified } : p));
        showSuccess(`Selo de "${partner.name}" alterado para ${newVerified ? 'Credenciado Oficial APA' : 'Sem Selo'}`);
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePartnerImageUpload = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 10MB.');
      return;
    }

    setIsUploadingPartnerImage(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        try {
          const res = await api.uploadImage(base64Data, file.name);
          if (res.success && res.url) {
            setCurrentPartner(prev => ({ ...prev, photo_url: res.url }));
            showSuccess(`Foto "${file.name}" enviada com sucesso!`);
          } else {
            setCurrentPartner(prev => ({ ...prev, photo_url: base64Data }));
            showSuccess(`Foto pronta!`);
          }
        } catch (err) {
          console.warn('Fallback base64 para foto do parceiro:', err);
          setCurrentPartner(prev => ({ ...prev, photo_url: base64Data }));
          showSuccess(`Foto carregada!`);
        } finally {
          setIsUploadingPartnerImage(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setIsUploadingPartnerImage(false);
      alert('Erro ao processar imagem.');
    }
  };

  const handleAddPartnerAmenity = (amenity: string) => {
    const trimmed = amenity.trim();
    if (!trimmed) return;
    const current = currentPartner.amenities || [];
    if (!current.includes(trimmed)) {
      setCurrentPartner(prev => ({ ...prev, amenities: [...current, trimmed] }));
    }
    setNewAmenityInput('');
  };

  const handleRemovePartnerAmenity = (amenity: string) => {
    const current = currentPartner.amenities || [];
    setCurrentPartner(prev => ({ ...prev, amenities: current.filter(a => a !== amenity) }));
  };

  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPartner.name || !currentPartner.category) {
      alert('Preencha pelo menos o nome e a categoria do estabelecimento.');
      return;
    }

    try {
      if (currentPartner.id) {
        // Edit existing in DB
        const res = await fetch(`/api/partners/${currentPartner.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentPartner)
        });
        const updated = await res.json();
        setPartners(prev => prev.map(p => p.id === updated.id ? updated : p));
        showSuccess(`Pousada/Parceiro "${updated.name}" atualizado e salvo com sucesso!`);
      } else {
        // Create new in DB
        const res = await fetch('/api/partners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentPartner)
        });
        const created = await res.json();
        setPartners(prev => [created, ...prev]);
        showSuccess(`Pousada/Parceiro "${created.name}" cadastrado com sucesso!`);
      }
      setIsEditingPartner(false);
      setCurrentPartner({});
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar parceiro no servidor.');
    }
  };

  // Story Handlers
  const handleToggleStoryActive = async (story: IslandStory) => {
    try {
      const nextActive = !story.active;
      const updated = await api.updateStory(story.id, { active: nextActive });
      if (updated) {
        setStories(prev => prev.map(s => s.id === story.id ? { ...s, active: nextActive } : s));
        showSuccess(`Destaque "${story.title}" ${nextActive ? 'ativado' : 'pausado'}!`);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar status do destaque.');
    }
  };

  const handleDeleteStory = async (id: string, title: string) => {
    if (!confirm(`Deseja realmente excluir o destaque "${title}"?`)) return;
    try {
      const success = await api.deleteStory(id);
      if (success) {
        setStories(prev => prev.filter(s => s.id !== id));
        showSuccess(`Destaque "${title}" excluído com sucesso!`);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir destaque.');
    }
  };

  const handleMoveStory = async (story: IslandStory, direction: 'up' | 'down') => {
    const sorted = [...stories].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
    const currentIndex = sorted.findIndex(s => s.id === story.id);
    if (currentIndex === -1) return;
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const targetStory = sorted[targetIndex];
    const currentOrder = story.orderIndex ?? currentIndex + 1;
    const targetOrder = targetStory.orderIndex ?? targetIndex + 1;

    try {
      await api.updateStory(story.id, { orderIndex: targetOrder });
      await api.updateStory(targetStory.id, { orderIndex: currentOrder });
      setStories(prev => prev.map(s => {
        if (s.id === story.id) return { ...s, orderIndex: targetOrder };
        if (s.id === targetStory.id) return { ...s, orderIndex: currentOrder };
        return s;
      }));
      showSuccess(`Ordem de exibição dos destaques atualizada!`);
    } catch (err) {
      console.error(err);
      alert('Erro ao reordenar destaques.');
    }
  };

  const handleStoryImageUpload = async (file: File, field: 'coverImage' | 'fullImage') => {
    if (field === 'coverImage') setIsUploadingStoryCover(true);
    else setIsUploadingStoryFull(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        try {
          const res = await api.uploadImage(base64Data, file.name);
          const finalUrl = (res.success && res.url) ? res.url : base64Data;
          setCurrentStory(prev => ({ ...prev, [field]: finalUrl }));
          showSuccess(`Imagem "${file.name}" processada com sucesso!`);
        } catch (err) {
          console.warn('Fallback base64 para imagem:', err);
          setCurrentStory(prev => ({ ...prev, [field]: base64Data }));
          showSuccess(`Imagem "${file.name}" carregada!`);
        } finally {
          if (field === 'coverImage') setIsUploadingStoryCover(false);
          else setIsUploadingStoryFull(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      if (field === 'coverImage') setIsUploadingStoryCover(false);
      else setIsUploadingStoryFull(false);
      alert('Erro ao ler arquivo de imagem.');
    }
  };

  const handleSaveStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStory.title || !currentStory.subtitle) {
      alert('Preencha pelo menos o título e o subtítulo do destaque.');
      return;
    }

    try {
      if (currentStory.id) {
        const updated = await api.updateStory(currentStory.id, currentStory);
        if (updated) {
          setStories(prev => prev.map(s => s.id === updated.id ? updated : s));
          showSuccess(`Destaque "${updated.title}" atualizado com sucesso!`);
        }
      } else {
        const payload: Omit<IslandStory, 'id'> = {
          title: currentStory.title || 'Novo Story',
          subtitle: currentStory.subtitle || '',
          coverImage: currentStory.coverImage || '/imagens/vila2.jpg',
          fullImage: currentStory.fullImage || currentStory.coverImage || '/imagens/vila2.jpg',
          tag: currentStory.tag || 'Destaque da Ilha',
          description: currentStory.description || '',
          icon: currentStory.icon || '🏝️',
          category: currentStory.category || 'todos',
          location: currentStory.location || 'Ilha de Algodoal',
          whatsapp: currentStory.whatsapp || '',
          active: currentStory.active ?? true,
          orderIndex: currentStory.orderIndex ?? (stories.length + 1)
        };
        const created = await api.createStory(payload);
        if (created) {
          setStories(prev => [...prev, created]);
          showSuccess(`Destaque "${created.title}" criado com sucesso!`);
        }
      }
      setIsEditingStory(false);
      setCurrentStory({});
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar story no servidor.');
    }
  };

  // Filtered Stories Computation
  const filteredStories = useMemo(() => {
    return [...stories]
      .filter(s => {
        if (!storySearchTerm.trim()) return true;
        const term = storySearchTerm.toLowerCase();
        const matchTitle = (s.title || '').toLowerCase().includes(term);
        const matchSub = (s.subtitle || '').toLowerCase().includes(term);
        const matchTag = (s.tag || '').toLowerCase().includes(term);
        const matchLoc = (s.location || '').toLowerCase().includes(term);
        const matchDesc = (s.description || '').toLowerCase().includes(term);
        return matchTitle || matchSub || matchTag || matchLoc || matchDesc;
      })
      .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  }, [stories, storySearchTerm]);

  // Filtered Partners Computation
  const filteredPartners = useMemo(() => {
    return partners.filter(p => {
      // Category filter
      if (partnerCategoryFilter !== 'todos') {
        const cat = (p.category || '').toLowerCase();
        if (partnerCategoryFilter === 'pousadas' && cat !== 'pousadas' && cat !== 'pousada') return false;
        if (partnerCategoryFilter === 'transporte' && cat !== 'transporte') return false;
        if (partnerCategoryFilter === 'alimentacao' && cat !== 'alimentacao' && cat !== 'restaurante') return false;
        if (partnerCategoryFilter === 'passeios' && cat !== 'passeios' && cat !== 'passeio') return false;
        if (partnerCategoryFilter === 'compras' && cat !== 'compras') return false;
        if (partnerCategoryFilter === 'eventos' && cat !== 'eventos' && cat !== 'evento') return false;
        if (partnerCategoryFilter === 'informacoes' && cat !== 'informacoes' && cat !== 'guia') return false;
      }

      // Status filter
      if (partnerStatusFilter === 'ativos' && !p.is_active) return false;
      if (partnerStatusFilter === 'inativos' && p.is_active) return false;

      // Search term
      if (partnerSearchTerm.trim()) {
        const term = partnerSearchTerm.toLowerCase();
        const matchName = (p.name || '').toLowerCase().includes(term);
        const matchSub = (p.subcategory || '').toLowerCase().includes(term);
        const matchLoc = (p.location || '').toLowerCase().includes(term);
        const matchDesc = (p.description || '').toLowerCase().includes(term);
        const matchBadge = (p.vehicle_badge || '').toLowerCase().includes(term);
        const matchPhone = (p.phone || '').includes(term) || (p.whatsapp || '').includes(term);
        if (!matchName && !matchSub && !matchLoc && !matchDesc && !matchBadge && !matchPhone) return false;
      }

      return true;
    });
  }, [partners, partnerCategoryFilter, partnerStatusFilter, partnerSearchTerm]);

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
                onClick={() => setActiveMainTab('stories')}
                className={`py-3 px-4 rounded-t-xl border-b-2 flex items-center gap-2 transition cursor-pointer ${
                  activeMainTab === 'stories'
                    ? 'border-purple-500 bg-white text-purple-950 shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>🏝️ Destaques da Ilha (Stories) ({stories.length})</span>
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
                  {/* Top Summary & Action Card */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Hotel className="w-5 h-5 text-emerald-600" />
                        <h3 className="text-base font-black text-slate-900 font-serif">
                          Parceiros Credenciados e Pousadas
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Gerencie pousadas, chalés, charretes APA, restaurantes, passeios de rabeta e comércios da Ilha.
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs font-bold text-slate-600">
                        <span className="bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                          Total: <strong className="text-slate-900">{partners.length}</strong>
                        </span>
                        <span className="bg-emerald-50 px-2.5 py-0.5 rounded-lg text-emerald-700 border border-emerald-200">
                          Ativos: <strong className="text-emerald-900">{partners.filter(p => p.is_active).length}</strong>
                        </span>
                        <span className="bg-amber-50 px-2.5 py-0.5 rounded-lg text-amber-700 border border-amber-200">
                          Credenciados APA: <strong className="text-amber-900">{partners.filter(p => p.verified).length}</strong>
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleOpenAddPartner}
                      className="py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 transition shadow-md shadow-emerald-700/20 cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Cadastrar Pousada / Parceiro</span>
                    </button>
                  </div>

                  {/* Search and Filter Controls */}
                  <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                      {/* Search Bar */}
                      <div className="relative w-full sm:w-80">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Buscar por nome, local, badge, whatsapp..."
                          value={partnerSearchTerm}
                          onChange={(e) => setPartnerSearchTerm(e.target.value)}
                          className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                        {partnerSearchTerm && (
                          <button
                            onClick={() => setPartnerSearchTerm('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Status Filter Toggle */}
                      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 self-stretch sm:self-auto justify-center">
                        <button
                          type="button"
                          onClick={() => setPartnerStatusFilter('todos')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                            partnerStatusFilter === 'todos'
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Todos ({partners.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setPartnerStatusFilter('ativos')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                            partnerStatusFilter === 'ativos'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Ativos ({partners.filter(p => p.is_active).length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setPartnerStatusFilter('inativos')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                            partnerStatusFilter === 'inativos'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Pausados ({partners.filter(p => !p.is_active).length})
                        </button>
                      </div>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none pt-1">
                      {[
                        { id: 'todos', label: 'Todas as Categorias', icon: Sparkles },
                        { id: 'pousadas', label: 'Pousadas & Chalés', icon: Hotel },
                        { id: 'transporte', label: 'Charretes APA', icon: Truck },
                        { id: 'alimentacao', label: 'Gastronomia', icon: Utensils },
                        { id: 'passeios', label: 'Rabetas & Lago', icon: Compass },
                        { id: 'compras', label: 'Disk Gelo & Compras', icon: ShoppingBag },
                        { id: 'eventos', label: 'Eventos & Luaus', icon: PartyPopper }
                      ].map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = partnerCategoryFilter === cat.id;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => setPartnerCategoryFilter(cat.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer border ${
                              isSelected
                                ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Partner Cards Grid */}
                  {filteredPartners.length === 0 ? (
                    <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                        <Search className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-black text-slate-800">Nenhum parceiro ou pousada encontrado</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Nenhum estabelecimento corresponde aos filtros de busca atuais. Tente limpar os filtros ou cadastrar um novo.
                      </p>
                      <button
                        onClick={handleOpenAddPartner}
                        className="py-2 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition cursor-pointer"
                      >
                        + Cadastrar Parceiro Agora
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredPartners.map((p) => (
                        <div
                          key={p.id}
                          className={`bg-white rounded-3xl border transition shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden ${
                            p.is_active ? 'border-slate-200' : 'border-slate-300 opacity-80 bg-slate-50/50'
                          }`}
                        >
                          <div>
                            {/* Card Media Header */}
                            <div className="relative h-36 bg-slate-100">
                              <img
                                src={p.photo_url || '/imagens/vila2.jpg'}
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                              
                              {/* Verified Badge */}
                              {p.verified && (
                                <span className="absolute top-2.5 left-2.5 bg-emerald-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                                  <ShieldCheck className="w-3 h-3" />
                                  <span>Oficial APA</span>
                                </span>
                              )}

                              {/* Vehicle Badge if any */}
                              {p.vehicle_badge && (
                                <span className="absolute top-2.5 right-2.5 bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-md">
                                  {p.vehicle_badge}
                                </span>
                              )}

                              {/* Status Toggle on image corner */}
                              <button
                                type="button"
                                onClick={() => handleTogglePartnerStatus(p)}
                                title={p.is_active ? 'Clique para desativar' : 'Clique para ativar'}
                                className={`absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1 shadow-md transition cursor-pointer ${
                                  p.is_active 
                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${p.is_active ? 'bg-white animate-pulse' : 'bg-white'}`} />
                                {p.is_active ? 'Ativo no Site' : 'Pausado'}
                              </button>
                            </div>

                            {/* Body Content */}
                            <div className="p-4 space-y-2.5">
                              <div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">
                                  {p.subcategory || p.category}
                                </span>
                                <h4 className="text-sm font-black text-slate-900 line-clamp-1 mt-0.5" title={p.name}>
                                  {p.name}
                                </h4>
                              </div>

                              {p.description && (
                                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                  {p.description}
                                </p>
                              )}

                              {/* Location & Price */}
                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                                <span className="text-slate-500 font-medium flex items-center gap-1 truncate max-w-[150px]" title={p.location}>
                                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span className="truncate">{p.location || 'Ilha de Algodoal'}</span>
                                </span>
                                <span className="font-black text-slate-900 shrink-0">
                                  {p.price_starting ? `A partir de R$ ${p.price_starting.toFixed(2)}` : 'Sob Consulta'}
                                </span>
                              </div>

                              {/* Contacts */}
                              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                                {p.whatsapp && (
                                  <a
                                    href={`https://wa.me/${p.whatsapp.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-emerald-700 hover:underline flex items-center gap-1 truncate"
                                  >
                                    <MessageCircle className="w-3 h-3 text-emerald-600" />
                                    <span>WhatsApp: {p.whatsapp}</span>
                                  </a>
                                )}
                              </div>

                              {/* Amenities Tags */}
                              {p.amenities && p.amenities.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-1">
                                  {p.amenities.slice(0, 3).map((amenity, idx) => (
                                    <span
                                      key={idx}
                                      className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200"
                                    >
                                      {amenity}
                                    </span>
                                  ))}
                                  {p.amenities.length > 3 && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-400">
                                      +{p.amenities.length - 3}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons: Editar & Excluir */}
                          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditPartner(p)}
                              className="flex-1 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer border border-indigo-200/60"
                              title="Editar dados desta pousada/parceiro"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Editar</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeletePartner(p.id, p.name)}
                              className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer border border-rose-200/60"
                              title="Excluir permanentemente do banco de dados"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Excluir</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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

              {/* TAB 5: GERENCIADOR DE DESTAQUES & STORIES DA ILHA */}
              {activeMainTab === 'stories' && (
                <div className="space-y-6 max-w-7xl mx-auto">
                  
                  {/* Top Bar / Header Card */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
                          <Sparkles className="w-5 h-5" />
                        </span>
                        <h3 className="text-base font-black text-slate-900 font-serif">
                          Destaques da Ilha (Stories do Feed)
                        </h3>
                        <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                          {stories.length} cadastrados
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Gerencie os círculos interativos no topo do feed. Adicione fotos, ordene a sequência e configure botões de WhatsApp.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="relative flex-1 sm:w-64">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Buscar por título, tag, local..."
                          value={storySearchTerm}
                          onChange={(e) => setStorySearchTerm(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50 focus:bg-white"
                        />
                      </div>

                      <button
                        onClick={() => {
                          setCurrentStory({
                            title: '',
                            subtitle: '',
                            icon: '🏝️',
                            tag: 'Destaque',
                            category: 'todos',
                            location: 'Ilha de Algodoal',
                            coverImage: '/imagens/vila2.jpg',
                            fullImage: '/imagens/vila2.jpg',
                            description: '',
                            whatsapp: '',
                            active: true,
                            orderIndex: stories.length + 1
                          });
                          setIsEditingStory(true);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Novo Story</span>
                      </button>
                    </div>
                  </div>

                  {/* Stories Grid */}
                  {filteredStories.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
                      <Sparkles className="w-12 h-12 text-purple-300 mx-auto mb-3" />
                      <h4 className="text-sm font-black text-slate-800">Nenhum story ou destaque encontrado</h4>
                      <p className="text-xs text-slate-500 mt-1 mb-4">
                        {storySearchTerm ? 'Tente buscar com outros termos.' : 'Clique no botão acima para adicionar o primeiro destaque.'}
                      </p>
                      <button
                        onClick={() => {
                          setCurrentStory({
                            title: '',
                            subtitle: '',
                            icon: '🏝️',
                            tag: 'Destaque',
                            category: 'todos',
                            location: 'Ilha de Algodoal',
                            coverImage: '/imagens/vila2.jpg',
                            fullImage: '/imagens/vila2.jpg',
                            description: '',
                            whatsapp: '',
                            active: true,
                            orderIndex: stories.length + 1
                          });
                          setIsEditingStory(true);
                        }}
                        className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
                      >
                        Criar Novo Story
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredStories.map((story, index) => (
                        <div
                          key={story.id}
                          className={`bg-white rounded-3xl border transition shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden ${
                            story.active ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50/70'
                          }`}
                        >
                          {/* Card Header & Preview */}
                          <div className="p-4 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              {/* Circle Avatar Ring Preview */}
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <div className="w-14 h-14 rounded-full p-[2.5px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-sm shrink-0">
                                    <img
                                      src={story.coverImage || '/imagens/vila2.jpg'}
                                      alt={story.title}
                                      className="w-full h-full rounded-full object-cover border-2 border-white bg-slate-100"
                                    />
                                  </div>
                                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-xs">
                                    {story.icon || '🏝️'}
                                  </span>
                                </div>

                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 truncate">
                                      {story.tag || 'Destaque'}
                                    </span>
                                    <span className="text-[10px] font-black text-slate-400">
                                      #{story.orderIndex ?? (index + 1)}
                                    </span>
                                  </div>
                                  <h4 className="text-sm font-black text-slate-900 truncate mt-0.5">
                                    {story.title}
                                  </h4>
                                  <p className="text-xs text-slate-500 truncate">
                                    {story.subtitle}
                                  </p>
                                </div>
                              </div>

                              {/* Active Status Badge */}
                              <button
                                onClick={() => handleToggleStoryActive(story)}
                                className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border transition cursor-pointer shrink-0 ${
                                  story.active
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                    : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                                }`}
                              >
                                {story.active ? '● Ativo' : '○ Pausado'}
                              </button>
                            </div>

                            {/* Story Description & Meta */}
                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                              {story.description || 'Sem descrição cadastrada...'}
                            </p>

                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 pt-1">
                              {story.location && (
                                <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md font-medium text-slate-700">
                                  📍 {story.location}
                                </span>
                              )}
                              {story.whatsapp && (
                                <span className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                                  💬 {story.whatsapp}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Card Footer Actions */}
                          <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                            {/* Reordering Up/Down */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleMoveStory(story, 'up')}
                                disabled={index === 0}
                                title="Mover para frente"
                                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed text-xs font-bold"
                              >
                                ◀
                              </button>
                              <button
                                onClick={() => handleMoveStory(story, 'down')}
                                disabled={index === filteredStories.length - 1}
                                title="Mover para trás"
                                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed text-xs font-bold"
                              >
                                ▶
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setCurrentStory(story);
                                  setIsEditingStory(true);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                <span>Editar</span>
                              </button>

                              <button
                                onClick={() => handleDeleteStory(story.id, story.title)}
                                className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                                title="Excluir Story"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* ======================================================== */}
        {/* 6. MODAL FORM: CRIAR / EDITAR PARCEIRO & POUSADA        */}
        {/* ======================================================== */}
        {isEditingPartner && (
          <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-emerald-300 overflow-hidden animate-in zoom-in-95 duration-200">
              
              {/* Header */}
              <div className="px-6 py-4 bg-emerald-950 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Hotel className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-black font-serif">
                    {currentPartner.id ? 'Editar Pousada / Parceiro no Banco de Dados' : 'Cadastrar Novo Parceiro ou Pousada'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsEditingPartner(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form & Live Preview Grid */}
              <form onSubmit={handleSavePartner} className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50">
                
                {/* Form Fields (Col 7) */}
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                      Nome do Estabelecimento / Pousada *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Pousada & Chalés Princesa do Mar"
                      value={currentPartner.name || ''}
                      onChange={(e) => setCurrentPartner(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                        Categoria do Site *
                      </label>
                      <select
                        value={currentPartner.category || 'pousadas'}
                        onChange={(e) => setCurrentPartner(prev => ({ ...prev, category: e.target.value as any }))}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                      >
                        <option value="pousadas">🏨 Pousadas & Chalés</option>
                        <option value="transporte">🚖 Transporte & Charretes</option>
                        <option value="alimentacao">🍲 Gastronomia & Restaurantes</option>
                        <option value="passeios">⛵ Passeios & Rabetas</option>
                        <option value="compras">🛍️ Compras & Disk Gelo/Água</option>
                        <option value="eventos">🎉 Eventos & Cultura</option>
                        <option value="informacoes">ℹ️ Guia da Ilha</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                        Subcategoria / Especialidade
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Chalés Beira-Mar, Peixada Regional"
                        value={currentPartner.subcategory || ''}
                        onChange={(e) => setCurrentPartner(prev => ({ ...prev, subcategory: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                        WhatsApp (apenas números com DDD)
                      </label>
                      <input
                        type="text"
                        placeholder="5591981234567"
                        value={currentPartner.whatsapp || ''}
                        onChange={(e) => setCurrentPartner(prev => ({ ...prev, whatsapp: e.target.value.replace(/\D/g, '') }))}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                        Telefone Comercial
                      </label>
                      <input
                        type="text"
                        placeholder="(91) 98123-4567"
                        value={currentPartner.phone || ''}
                        onChange={(e) => setCurrentPartner(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                        Preço Inicial (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="150.00"
                        value={currentPartner.price_starting || 0}
                        onChange={(e) => setCurrentPartner(prev => ({ ...prev, price_starting: Number(e.target.value) }))}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                        Identificação / Veículo / Placa
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Charrete #14, Rabeta Estrela"
                        value={currentPartner.vehicle_badge || ''}
                        onChange={(e) => setCurrentPartner(prev => ({ ...prev, vehicle_badge: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                        Localização na Ilha
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Praia da Princesa (Beira-mar)"
                        value={currentPartner.location || ''}
                        onChange={(e) => setCurrentPartner(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                        Horário de Funcionamento
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Recepção 24h, 08h às 22h"
                        value={currentPartner.opening_hours || ''}
                        onChange={(e) => setCurrentPartner(prev => ({ ...prev, opening_hours: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                      Descrição do Estabelecimento / Serviços
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Detalhes sobre comodidades, quartos, cardápio, passeios e diferenciais..."
                      value={currentPartner.description || ''}
                      onChange={(e) => setCurrentPartner(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
                    />
                  </div>

                  {/* Amenities / Tags Selector */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
                    <label className="block text-xs font-black uppercase text-slate-800">
                      Comodidades e Diferenciais
                    </label>
                    
                    {/* Quick Add Pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Wi-Fi Starlink',
                        'Ar-Condicionado',
                        'Café da Manhã',
                        'Frente ao Mar',
                        'Pé na Areia',
                        'Piscina',
                        'Frigobar',
                        'Aceita PIX',
                        'Coletes Salva-Vidas',
                        'Guia Local',
                        'Ducha de Água Doce',
                        'Capacidade 4 pax'
                      ].map((amenity) => {
                        const isSelected = (currentPartner.amenities || []).includes(amenity);
                        return (
                          <button
                            type="button"
                            key={amenity}
                            onClick={() => {
                              if (isSelected) {
                                handleRemovePartnerAmenity(amenity);
                              } else {
                                handleAddPartnerAmenity(amenity);
                              }
                            }}
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                            }`}
                          >
                            {isSelected ? `✓ ${amenity}` : `+ ${amenity}`}
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Amenity Input */}
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Outra comodidade..."
                        value={newAmenityInput}
                        onChange={(e) => setNewAmenityInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddPartnerAmenity(newAmenityInput);
                          }
                        }}
                        className="flex-1 p-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-slate-50"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddPartnerAmenity(newAmenityInput)}
                        className="px-3 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-700 transition cursor-pointer"
                      >
                        Adicionar
                      </button>
                    </div>

                    {/* Selected List */}
                    {currentPartner.amenities && currentPartner.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {currentPartner.amenities.map((item) => (
                          <span
                            key={item}
                            className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200"
                          >
                            <span>{item}</span>
                            <button
                              type="button"
                              onClick={() => handleRemovePartnerAmenity(item)}
                              className="text-emerald-700 hover:text-rose-600 ml-0.5 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Image Upload Section */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <label className="block text-xs font-black uppercase text-slate-800">
                      Foto Principal do Estabelecimento
                    </label>

                    <div className="space-y-2">
                      <div
                        onDragOver={(e) => { e.preventDefault(); setIsPartnerDragOver(true); }}
                        onDragLeave={() => setIsPartnerDragOver(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsPartnerDragOver(false);
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            handlePartnerImageUpload(e.dataTransfer.files[0]);
                          }
                        }}
                        onClick={() => {
                          const input = document.getElementById('partner-image-file-input') as HTMLInputElement;
                          if (input) input.click();
                        }}
                        className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition ${
                          isPartnerDragOver
                            ? 'border-emerald-500 bg-emerald-50/80 scale-[1.01]'
                            : 'border-slate-300 hover:border-emerald-400 bg-slate-50/70 hover:bg-emerald-50/30'
                        }`}
                      >
                        <input
                          type="file"
                          id="partner-image-file-input"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handlePartnerImageUpload(e.target.files[0]);
                            }
                          }}
                          className="hidden"
                        />

                        {isUploadingPartnerImage ? (
                          <div className="py-4 flex flex-col items-center justify-center gap-2">
                            <RefreshCw className="w-7 h-7 text-emerald-500 animate-spin" />
                            <span className="text-xs font-black text-slate-800">Enviando e processando foto...</span>
                          </div>
                        ) : (
                          <div className="py-2 flex flex-col items-center justify-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                              <UploadCloud className="w-6 h-6" />
                            </div>
                            <div className="text-sm font-black text-slate-800">
                              Clique para escolher uma foto ou arraste o arquivo aqui
                            </div>
                            <p className="text-xs text-slate-500">
                              JPG, PNG, WebP do seu dispositivo (Máx: 10MB)
                            </p>
                          </div>
                        )}
                      </div>

                      {currentPartner.photo_url && (
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={currentPartner.photo_url}
                              alt="Miniatura"
                              className="w-10 h-10 rounded-lg object-cover border border-slate-300 shrink-0"
                            />
                            <span className="text-xs font-bold text-slate-700 truncate">
                              Foto carregada: {currentPartner.photo_url.split('/').pop()}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.getElementById('partner-image-file-input') as HTMLInputElement;
                              if (input) input.click();
                            }}
                            className="text-xs font-black text-emerald-700 hover:text-emerald-800 underline ml-2 shrink-0 cursor-pointer"
                          >
                            Trocar foto
                          </button>
                        </div>
                      )}

                      {/* Direct URL input fallback */}
                      <div className="pt-1">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">
                          Ou digite o link direto da imagem:
                        </label>
                        <input
                          type="text"
                          placeholder="https://exemplo.com/foto.jpg ou /imagens/vila2.jpg"
                          value={currentPartner.photo_url || ''}
                          onChange={(e) => setCurrentPartner(prev => ({ ...prev, photo_url: e.target.value }))}
                          className="w-full p-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Status checkboxes */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="partner_active_toggle"
                        checked={currentPartner.is_active ?? true}
                        onChange={(e) => setCurrentPartner(prev => ({ ...prev, is_active: e.target.checked }))}
                        className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                      />
                      <label htmlFor="partner_active_toggle" className="text-xs font-black text-slate-900 cursor-pointer">
                        Estabelecimento Ativo e Visível no Site
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="partner_verified_toggle"
                        checked={currentPartner.verified ?? true}
                        onChange={(e) => setCurrentPartner(prev => ({ ...prev, verified: e.target.checked }))}
                        className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                      />
                      <label htmlFor="partner_verified_toggle" className="text-xs font-black text-slate-900 cursor-pointer flex items-center gap-1">
                        <span>Selo de Credenciado / Verificado Oficial APA</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Live Preview Column (Col 5) */}
                <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                      <Eye className="w-4 h-4 text-emerald-600" />
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                        Prévia em Tempo Real
                      </h4>
                    </div>

                    {/* Preview Card */}
                    <div className="rounded-3xl border border-slate-200 overflow-hidden shadow-sm bg-white">
                      <div className="relative h-44 bg-slate-100">
                        <img
                          src={currentPartner.photo_url || '/imagens/vila2.jpg'}
                          alt="Prévia"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                        
                        {currentPartner.verified && (
                          <span className="absolute top-2.5 left-2.5 bg-emerald-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Oficial APA</span>
                          </span>
                        )}

                        {currentPartner.vehicle_badge && (
                          <span className="absolute top-2.5 right-2.5 bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-md">
                            {currentPartner.vehicle_badge}
                          </span>
                        )}
                      </div>

                      <div className="p-4 space-y-2.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">
                          {currentPartner.subcategory || currentPartner.category || 'Categoria'}
                        </span>
                        <h5 className="text-sm font-black text-slate-900">
                          {currentPartner.name || 'Nome da Pousada / Parceiro'}
                        </h5>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {currentPartner.description || 'Descrição detalhada dos serviços e estrutura oferecidos aos visitantes...'}
                        </p>

                        <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                          <span className="font-black text-slate-900">
                            {currentPartner.price_starting ? `A partir de R$ ${Number(currentPartner.price_starting).toFixed(2)}` : 'Sob Consulta'}
                          </span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            📍 {currentPartner.location || 'Algodoal'}
                          </span>
                        </div>

                        {currentPartner.whatsapp && (
                          <div className="pt-1 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>WhatsApp: {currentPartner.whatsapp}</span>
                          </div>
                        )}

                        {currentPartner.amenities && currentPartner.amenities.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {currentPartner.amenities.map((item, idx) => (
                              <span
                                key={idx}
                                className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditingPartner(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Salvar Pousada / Parceiro</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
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

                  {/* Image Upload Section */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <label className="block text-xs font-black uppercase text-slate-800">
                      Foto / Imagem do Anúncio *
                    </label>

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
                        className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition ${
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
                          <div className="py-4 flex flex-col items-center justify-center gap-2">
                            <RefreshCw className="w-7 h-7 text-amber-500 animate-spin" />
                            <span className="text-xs font-black text-slate-800">Enviando e processando imagem...</span>
                          </div>
                        ) : (
                          <div className="py-2 flex flex-col items-center justify-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs">
                              <UploadCloud className="w-6 h-6" />
                            </div>
                            <div className="text-sm font-black text-slate-800">
                              Clique para escolher uma imagem ou arraste o arquivo aqui
                            </div>
                            <p className="text-xs text-slate-500">
                              Suporta JPG, PNG, WebP do seu celular ou computador (Máx: 10MB)
                            </p>
                          </div>
                        )}
                      </div>

                      {currentAd.image_url && (
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={currentAd.image_url}
                              alt="Miniatura"
                              className="w-10 h-10 rounded-lg object-cover border border-slate-300 shrink-0"
                            />
                            <span className="text-xs font-bold text-slate-700 truncate">
                              Imagem carregada: {currentAd.image_url.split('/').pop()}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.getElementById('ad-image-file-input') as HTMLInputElement;
                              if (input) input.click();
                            }}
                            className="text-xs font-black text-amber-700 hover:text-amber-800 underline ml-2 shrink-0 cursor-pointer"
                          >
                            Trocar imagem
                          </button>
                        </div>
                      )}
                    </div>
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

        {/* ======================================================== */}
        {/* 7. MODAL FORM: CRIAR / EDITAR STORY & DESTAQUE DA ILHA   */}
        {/* ======================================================== */}
        {isEditingStory && (
          <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-purple-300 overflow-hidden animate-in zoom-in-95 duration-200">
              
              {/* Header */}
              <div className="px-6 py-4 bg-purple-950 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-black font-serif">
                    {currentStory.id ? 'Editar Destaque (Story) no Banco de Dados' : 'Cadastrar Novo Story / Destaque'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsEditingStory(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form & Live Preview Grid */}
              <form onSubmit={handleSaveStory} className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50">
                
                {/* Form Fields (Col 7) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                        Título do Story *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Trapiche de Chegada"
                        value={currentStory.title || ''}
                        onChange={(e) => setCurrentStory(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                        Emoji do Ícone
                      </label>
                      <input
                        type="text"
                        placeholder="🏝️"
                        value={currentStory.icon || '🏝️'}
                        onChange={(e) => setCurrentStory(prev => ({ ...prev, icon: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white text-center"
                      />
                    </div>
                  </div>

                  {/* Quick Emoji Pickers */}
                  <div className="flex flex-wrap gap-1.5 items-center bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 mr-1">Sugestões:</span>
                    {['🏝️', '🌅', '⛵', '🐎', '🌊', '🍹', '🦀', '🌴', '🔥', '🌸', '🏨', '🍲', '🛍️', '🎉', 'ℹ️'].map((emoji) => (
                      <button
                        type="button"
                        key={emoji}
                        onClick={() => setCurrentStory(prev => ({ ...prev, icon: emoji }))}
                        className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-sm transition cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                        Subtítulo Curto *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Porto de Algodoal"
                        value={currentStory.subtitle || ''}
                        onChange={(e) => setCurrentStory(prev => ({ ...prev, subtitle: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                        Tag / Selo do Story
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Chegada na Ilha"
                        value={currentStory.tag || ''}
                        onChange={(e) => setCurrentStory(prev => ({ ...prev, tag: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                        Categoria Relacionada
                      </label>
                      <select
                        value={currentStory.category || 'todos'}
                        onChange={(e) => setCurrentStory(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                      >
                        <option value="todos">🌐 Geral (Todas)</option>
                        <option value="transporte">🚖 Transporte & Chegada</option>
                        <option value="pousadas">🏨 Pousadas & Hospedagem</option>
                        <option value="passeios">⛵ Passeios & Praias</option>
                        <option value="alimentacao">🍲 Gastronomia & Bares</option>
                        <option value="compras">🛍️ Compras & Utilitários</option>
                        <option value="eventos">🎉 Eventos & Noite</option>
                        <option value="informacoes">ℹ️ Dicas & Guia</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                        Ordem de Exibição
                      </label>
                      <input
                        type="number"
                        min="1"
                        placeholder="1"
                        value={currentStory.orderIndex || 1}
                        onChange={(e) => setCurrentStory(prev => ({ ...prev, orderIndex: Number(e.target.value) }))}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                        Localização na Ilha
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Porto de Algodoal / Vila de Maiandeua"
                        value={currentStory.location || ''}
                        onChange={(e) => setCurrentStory(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                        WhatsApp de Contato Direto
                      </label>
                      <input
                        type="text"
                        placeholder="5591981234567"
                        value={currentStory.whatsapp || ''}
                        onChange={(e) => setCurrentStory(prev => ({ ...prev, whatsapp: e.target.value.replace(/\D/g, '') }))}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                      Descrição Detalhada do Story
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Texto que o turista lê quando o story é aberto em tela cheia..."
                      value={currentStory.description || ''}
                      onChange={(e) => setCurrentStory(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
                    />
                  </div>

                  {/* 1. Cover / Avatar Image Uploader */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <label className="block text-xs font-black uppercase text-slate-800">
                      Foto de Capa (Avatar Redondo do Feed)
                    </label>

                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsStoryDragOverCover(true); }}
                      onDragLeave={() => setIsStoryDragOverCover(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsStoryDragOverCover(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleStoryImageUpload(e.dataTransfer.files[0], 'coverImage');
                        }
                      }}
                      onClick={() => {
                        const input = document.getElementById('story-cover-file-input') as HTMLInputElement;
                        if (input) input.click();
                      }}
                      className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition ${
                        isStoryDragOverCover
                          ? 'border-purple-500 bg-purple-50/80'
                          : 'border-slate-300 hover:border-purple-400 bg-slate-50/70 hover:bg-purple-50/30'
                      }`}
                    >
                      <input
                        type="file"
                        id="story-cover-file-input"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleStoryImageUpload(e.target.files[0], 'coverImage');
                          }
                        }}
                        className="hidden"
                      />

                      {isUploadingStoryCover ? (
                        <div className="py-2 flex flex-col items-center justify-center gap-1.5">
                          <RefreshCw className="w-6 h-6 text-purple-500 animate-spin" />
                          <span className="text-xs font-black text-slate-800">Enviando foto de capa...</span>
                        </div>
                      ) : (
                        <div className="py-1 flex flex-col items-center justify-center gap-1">
                          <UploadCloud className="w-5 h-5 text-purple-600" />
                          <div className="text-xs font-black text-slate-800">
                            Clique ou arraste a foto redonda de capa
                          </div>
                        </div>
                      )}
                    </div>

                    <input
                      type="text"
                      placeholder="Ou digite o link direto: /imagens/porto.jpg ou https://..."
                      value={currentStory.coverImage || ''}
                      onChange={(e) => setCurrentStory(prev => ({ ...prev, coverImage: e.target.value }))}
                      className="w-full p-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50"
                    />
                  </div>

                  {/* 2. Full Background Image Uploader */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <label className="block text-xs font-black uppercase text-slate-800">
                      Foto de Fundo em Tela Cheia (Story Aberto)
                    </label>

                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsStoryDragOverFull(true); }}
                      onDragLeave={() => setIsStoryDragOverFull(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsStoryDragOverFull(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleStoryImageUpload(e.dataTransfer.files[0], 'fullImage');
                        }
                      }}
                      onClick={() => {
                        const input = document.getElementById('story-full-file-input') as HTMLInputElement;
                        if (input) input.click();
                      }}
                      className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition ${
                        isStoryDragOverFull
                          ? 'border-purple-500 bg-purple-50/80'
                          : 'border-slate-300 hover:border-purple-400 bg-slate-50/70 hover:bg-purple-50/30'
                      }`}
                    >
                      <input
                        type="file"
                        id="story-full-file-input"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleStoryImageUpload(e.target.files[0], 'fullImage');
                          }
                        }}
                        className="hidden"
                      />

                      {isUploadingStoryFull ? (
                        <div className="py-2 flex flex-col items-center justify-center gap-1.5">
                          <RefreshCw className="w-6 h-6 text-purple-500 animate-spin" />
                          <span className="text-xs font-black text-slate-800">Enviando foto de fundo...</span>
                        </div>
                      ) : (
                        <div className="py-1 flex flex-col items-center justify-center gap-1">
                          <UploadCloud className="w-5 h-5 text-purple-600" />
                          <div className="text-xs font-black text-slate-800">
                            Clique ou arraste a foto de fundo vertical
                          </div>
                        </div>
                      )}
                    </div>

                    <input
                      type="text"
                      placeholder="Ou digite o link direto: /imagens/vila2.jpg ou https://..."
                      value={currentStory.fullImage || ''}
                      onChange={(e) => setCurrentStory(prev => ({ ...prev, fullImage: e.target.value }))}
                      className="w-full p-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50"
                    />
                  </div>

                  {/* Active Toggle */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="story_active_toggle"
                      checked={currentStory.active ?? true}
                      onChange={(e) => setCurrentStory(prev => ({ ...prev, active: e.target.checked }))}
                      className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                    />
                    <label htmlFor="story_active_toggle" className="text-xs font-black text-slate-900 cursor-pointer">
                      Story Ativo e Visível no Feed Principal
                    </label>
                  </div>
                </div>

                {/* Live Preview Column (Col 5) */}
                <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-200 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <Eye className="w-4 h-4 text-purple-600" />
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                        Prévia em Tempo Real
                      </h4>
                    </div>

                    {/* 1. Feed Avatar Ring Preview */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-2">
                        Como aparece no topo do feed:
                      </span>
                      <div className="inline-flex flex-col items-center">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-md">
                            <img
                              src={currentStory.coverImage || '/imagens/vila2.jpg'}
                              alt="Prévia Avatar"
                              className="w-full h-full rounded-full object-cover border-2 border-white bg-slate-100"
                            />
                          </div>
                          <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-xs">
                            {currentStory.icon || '🏝️'}
                          </span>
                        </div>
                        <span className="text-xs font-black text-slate-900 mt-1 max-w-[80px] truncate">
                          {currentStory.title || 'Título'}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 max-w-[80px] truncate">
                          {currentStory.subtitle || 'Subtítulo'}
                        </span>
                      </div>
                    </div>

                    {/* 2. Full Story Card Modal Preview */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">
                        Como aparece quando o turista clica:
                      </span>
                      <div className="relative h-64 rounded-3xl overflow-hidden shadow-lg border border-slate-300 bg-slate-950 flex flex-col justify-between p-4 text-white">
                        <img
                          src={currentStory.fullImage || currentStory.coverImage || '/imagens/vila2.jpg'}
                          alt="Prévia Fundo"
                          className="absolute inset-0 w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60" />

                        {/* Top Story Header */}
                        <div className="relative z-10 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{currentStory.icon || '🏝️'}</span>
                            <div>
                              <h5 className="text-xs font-black">{currentStory.title || 'Título do Story'}</h5>
                              <p className="text-[10px] text-white/70">{currentStory.location || 'Ilha de Algodoal'}</p>
                            </div>
                          </div>
                          {currentStory.tag && (
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                              {currentStory.tag}
                            </span>
                          )}
                        </div>

                        {/* Bottom Story Content */}
                        <div className="relative z-10 space-y-2">
                          <p className="text-xs text-white/90 line-clamp-3 leading-relaxed">
                            {currentStory.description || 'Aqui aparecerá a descrição e dicas sobre o local selecionado...'}
                          </p>
                          {currentStory.whatsapp && (
                            <div className="w-full py-2 rounded-xl bg-emerald-500 text-white font-black text-[11px] flex items-center justify-center gap-1.5 shadow-md">
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Saber Mais no WhatsApp</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditingStory(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Salvar Story</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
