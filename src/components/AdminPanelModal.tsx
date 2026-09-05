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
  RotateCcw,
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
  Info,
  Download,
  Upload,
  Database,
  Save
} from 'lucide-react';
import { Advertisement, AdCategory, TideDayEntry, Partner, UserProfile, ServiceCategory, IslandStory, AdPlan, AdPlanType } from '../types/index.ts';
import { api } from '../services/api.ts';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData?: () => void;
  currentUser?: UserProfile | null;
  onLoginSuccess?: (user: UserProfile) => void;
  onLogout?: () => void;
  onRequireAuth?: () => void;
  heroBackgroundUrl?: string;
  onUpdateHeroBackground?: (url: string) => void;
  initialTab?: 'anuncios' | 'planos' | 'stories' | 'parceiros' | 'fundo' | 'seguranca';
}

export const PRESET_HERO_BACKGROUNDS = [
  {
    id: 'praia_princesa_hd',
    name: 'Praia da Princesa & Dunas (Alta Resolução HD)',
    subtitle: 'Águas cristalinas, areia dourada e coqueiros de Maiandeua',
    url: '/imagens/algodoal_hd.jpg',
    tag: '✨ Ultra HD'
  },
  {
    id: 'praia_sunset',
    name: 'Pôr do Sol na Praia da Princesa (Padrão)',
    subtitle: 'Tons dourados e horizonte tropical da ilha',
    url: '/imagens/algodoal.jpg',
    tag: '🌅 Sunset'
  },
  {
    id: 'vila_pescadores',
    name: 'Vila de Algodoal & Trilha Nativa',
    subtitle: 'Centro pacato, coqueirais e areia clara',
    url: '/imagens/vila.jpg',
    tag: '🌴 Vila'
  },
  {
    id: 'charretes_vila',
    name: 'Ruas de Areia & Charretes',
    subtitle: 'Transporte ecológico tradicional de Maiandeua',
    url: '/imagens/vila2.jpg',
    tag: '🐴 Charretes'
  },
  {
    id: 'canal_mangues',
    name: 'Canal dos Manguezais & Furo Velho',
    subtitle: 'Águas serenas, rabetas e ecoturismo',
    url: '/imagens/canal.jpg',
    tag: '🚤 Ecoturismo'
  },
  {
    id: 'porto_chegada',
    name: 'Porto de Algodoal & Embarcações',
    subtitle: 'Chegada dos barcos e fluxo de visitantes',
    url: '/imagens/porto.jpg',
    tag: '⚓ Porto'
  },
  {
    id: 'porto_crepusculo',
    name: 'Porto ao Entardecer & Marés',
    subtitle: 'Cores quentes ao cair da tarde',
    url: '/imagens/porto2.jpg',
    tag: '⛵ Entardecer'
  }
];

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

export const AD_PLANS: AdPlan[] = [
  {
    id: 'mensal',
    name: 'Plano Mensal',
    price: 30,
    priceLabel: 'R$ 30 /mês',
    target: 'Pousadas e Restaurantes Principais',
    includes: [
      'Banner rotativo no topo (Hero Carousel)',
      'Destaque 1º lugar na categoria',
      'Saiba Mais (página com detalhes e galeria de fotos)',
      'Botão de WhatsApp direto para reservas e pedidos',
      'Prioridade de recomendação para turistas'
    ],
    color: 'from-amber-500 to-amber-600',
    badge: 'Mais Recomendado'
  },
  {
    id: 'free',
    name: 'Plano Free',
    price: 0,
    priceLabel: 'Grátis',
    target: 'Barracas, Depósitos e Passeios de Barco',
    includes: [
      'Anúncio menor na listagem da categoria',
      'Botão de WhatsApp direto',
      'Localização e horários no guia da Ilha'
    ],
    color: 'from-slate-600 to-slate-700',
    badge: 'Comunitário'
  },
  {
    id: 'divulgacao',
    name: 'Divulgação',
    price: 0,
    priceLabel: 'Grátis',
    target: 'Luau, Shows de Reggae, Festas e Artesanato',
    includes: [
      'Banner rotativo na tela inicial e eventos',
      'Divulgação cultural de Carimbó, Reggae e Artesanato',
      'Data e local em destaque para visitantes'
    ],
    color: 'from-purple-600 to-indigo-600',
    badge: 'Cultural / Eventos'
  }
];

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  onRefreshData,
  currentUser,
  onLoginSuccess,
  onLogout,
  heroBackgroundUrl,
  onUpdateHeroBackground,
  initialTab
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'anuncios' | 'planos' | 'stories' | 'parceiros' | 'fundo' | 'seguranca'>(initialTab || 'anuncios');
  
  // Auth Form State (when not authenticated as admin)
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Hero Background & Dynamic Rotation State
  const [selectedHeroBg, setSelectedHeroBg] = useState<string>(() => {
    return heroBackgroundUrl || localStorage.getItem('algodoal_hero_background') || '/imagens/algodoal.jpg';
  });
  const [isHeroRotationEnabled, setIsHeroRotationEnabled] = useState<boolean>(true);
  const [activeHeroImages, setActiveHeroImages] = useState<string[]>([
    '/imagens/algodoal.jpg',
    '/imagens/vila.jpg',
    '/imagens/vila2.jpg',
    '/imagens/canal.jpg',
    '/imagens/porto.jpg',
    '/imagens/porto2.jpg'
  ]);
  const [customHeroImages, setCustomHeroImages] = useState<Array<{
    id: string;
    name: string;
    url: string;
    tag?: string;
    subtitle?: string;
    created_at?: string;
  }>>([]);
  const [deletedHeroPresets, setDeletedHeroPresets] = useState<string[]>([]);
  const [isSavingHeroBg, setIsSavingHeroBg] = useState<boolean>(false);
  const [isHeroBgDragOver, setIsHeroBgDragOver] = useState<boolean>(false);
  const [isUploadingHeroBgFile, setIsUploadingHeroBgFile] = useState<boolean>(false);

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
  const [isSavingAd, setIsSavingAd] = useState(false);
  const [adFormError, setAdFormError] = useState<string | null>(null);
  const [adValidationErrors, setAdValidationErrors] = useState<Record<string, string>>({});
  const [tempUploadedImageUrl, setTempUploadedImageUrl] = useState<string | null>(null);
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

  // Password Change & Backup states
  const [currentAdminPass, setCurrentAdminPass] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [confirmAdminPass, setConfirmAdminPass] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [isExportingBackup, setIsExportingBackup] = useState(false);
  const [isRestoringBackup, setIsRestoringBackup] = useState(false);

  // PostgreSQL Connection & Diagnostics states
  const [dbDiagnostic, setDbDiagnostic] = useState<{
    dbStatus?: { type: 'postgresql' | 'json'; connected: boolean; details: string; configuredUrl?: string };
    advertisements_count?: number;
    partners_count?: number;
  } | null>(null);
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [dbTestResult, setDbTestResult] = useState<{ success: boolean; message: string; details?: any } | null>(null);
  const [isSyncingDb, setIsSyncingDb] = useState(false);
  const [dbSyncResult, setDbSyncResult] = useState<{ success: boolean; message: string; syncedCounts?: Record<string, number> } | null>(null);
  const [showPgGuide, setShowPgGuide] = useState<'vps' | 'docker' | null>(null);

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

  // Plans & Monetization Filter & Search
  const [planSearchTerm, setPlanSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState<'todos' | 'mensal' | 'free' | 'divulgacao'>('todos');

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
    if (initialTab) {
      setActiveMainTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (heroBackgroundUrl) {
      setSelectedHeroBg(heroBackgroundUrl);
    }
  }, [heroBackgroundUrl]);

  useEffect(() => {
    if (isOpen && isAdmin) {
      loadAllAdminData();
    }
  }, [isOpen, isAdmin]);

  // Limpeza automática se o usuário fechar a aba ou navegador enquanto há uma foto temporária não salva no anúncio
  useEffect(() => {
    if (!tempUploadedImageUrl || !tempUploadedImageUrl.startsWith('/imagens/upload_')) return;

    const handleBeforeUnload = () => {
      try {
        const blob = new Blob([JSON.stringify({ url: tempUploadedImageUrl })], { type: 'application/json' });
        navigator.sendBeacon('/api/upload/rollback', blob);
      } catch (err) {
        console.warn('Falha no rollback automático via beacon:', err);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [tempUploadedImageUrl]);

  const loadAllAdminData = async () => {
    setIsLoading(true);
    setActionError('');
    try {
      // Load Admin Settings (including hero_background_url, hero_rotation_enabled, hero_active_images, hero_custom_images)
      try {
        const resSettings = await fetch('/api/admin/settings');
        const dataSettings = await resSettings.json();
        if (dataSettings) {
          if (dataSettings.hero_background_url) {
            setSelectedHeroBg(dataSettings.hero_background_url);
          }
          if (typeof dataSettings.hero_rotation_enabled === 'boolean') {
            setIsHeroRotationEnabled(dataSettings.hero_rotation_enabled);
          }
          if (Array.isArray(dataSettings.hero_active_images) && dataSettings.hero_active_images.length > 0) {
            setActiveHeroImages(dataSettings.hero_active_images);
          }
          if (Array.isArray(dataSettings.hero_custom_images)) {
            setCustomHeroImages(dataSettings.hero_custom_images);
          }
          if (Array.isArray(dataSettings.hero_deleted_presets)) {
            setDeletedHeroPresets(dataSettings.hero_deleted_presets);
          }
        }
      } catch (err) {
        console.warn('Configurações do admin não puderam ser lidas:', err);
      }

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

      // Load Database Diagnostic
      try {
        const diag = await api.getDatabaseDiagnostic();
        setDbDiagnostic(diag);
      } catch {
        // ignore
      }
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
  // HERO BACKGROUND & ROTATION HANDLERS
  // ==========================
  const handleSaveHeroFullSettings = async (
    url: string = selectedHeroBg,
    rotation: boolean = isHeroRotationEnabled,
    activeList: string[] = activeHeroImages,
    customList = customHeroImages,
    deletedPresets: string[] = deletedHeroPresets
  ) => {
    setIsSavingHeroBg(true);
    setActionError('');
    try {
      const res = await api.updateHeroSettings({
        hero_background_url: url,
        hero_rotation_enabled: rotation,
        hero_active_images: activeList,
        hero_custom_images: customList,
        hero_deleted_presets: deletedPresets
      });
      if (res.success) {
        setSelectedHeroBg(url);
        setIsHeroRotationEnabled(rotation);
        setActiveHeroImages(activeList);
        setCustomHeroImages(customList);
        setDeletedHeroPresets(deletedPresets);
        localStorage.setItem('algodoal_hero_background', url);
        if (onUpdateHeroBackground) {
          onUpdateHeroBackground(url);
        }
        if (onRefreshData) {
          onRefreshData();
        }
        showSuccess('✨ Configurações da capa e galeria salvas com sucesso no servidor!');
      } else {
        setActionError(res.message || 'Erro ao atualizar configurações da capa.');
      }
    } catch (err: any) {
      console.error('Erro ao salvar capa:', err);
      setSelectedHeroBg(url);
      setIsHeroRotationEnabled(rotation);
      setActiveHeroImages(activeList);
      setCustomHeroImages(customList);
      setDeletedHeroPresets(deletedPresets);
      localStorage.setItem('algodoal_hero_background', url);
      if (onUpdateHeroBackground) {
        onUpdateHeroBackground(url);
      }
      showSuccess('✨ Configurações da capa salvas!');
    } finally {
      setIsSavingHeroBg(false);
    }
  };

  const handleToggleImageInRotation = async (imgUrl: string) => {
    let nextList: string[];
    if (activeHeroImages.includes(imgUrl)) {
      if (activeHeroImages.length <= 1) {
        alert('É necessário manter pelo menos 1 imagem selecionada para a capa.');
        return;
      }
      nextList = activeHeroImages.filter(u => u !== imgUrl);
    } else {
      nextList = [...activeHeroImages, imgUrl];
    }
    setActiveHeroImages(nextList);
    // Persist immediately
    await handleSaveHeroFullSettings(selectedHeroBg, isHeroRotationEnabled, nextList, customHeroImages, deletedHeroPresets);
  };

  const handleSelectAllImagesForRotation = async () => {
    const availablePresets = PRESET_HERO_BACKGROUNDS.filter(p => !deletedHeroPresets.includes(p.id));
    const allUrls = [
      ...availablePresets.map(p => p.url),
      ...customHeroImages.map(c => c.url)
    ];
    const unique = Array.from(new Set(allUrls));
    setActiveHeroImages(unique);
    await handleSaveHeroFullSettings(selectedHeroBg, true, unique, customHeroImages, deletedHeroPresets);
    showSuccess('Todas as fotos ativas foram incluídas na rotação da capa!');
  };

  const handleResetToDefaultRotation = async () => {
    const defaultUrls = PRESET_HERO_BACKGROUNDS.map(p => p.url);
    const defaultHero = defaultUrls[0] || '/imagens/algodoal_hd.jpg';
    setSelectedHeroBg(defaultHero);
    setIsHeroRotationEnabled(true);
    setActiveHeroImages(defaultUrls);
    setDeletedHeroPresets([]);
    await handleSaveHeroFullSettings(defaultHero, true, defaultUrls, customHeroImages, []);
    showSuccess('Galeria restaurada para o padrão com todas as fotos nativas em alta resolução!');
  };

  const handleDeletePresetHeroImage = async (presetId: string, name: string, url: string) => {
    if (!window.confirm(`Deseja excluir a foto "${name}" da galeria da capa? Ela não aparecerá mais na galeria nem na rotação.`)) return;
    const nextDeleted = Array.from(new Set([...deletedHeroPresets, presetId]));
    setDeletedHeroPresets(nextDeleted);

    // Remaining pool of available images in the system
    const remainingPresets = PRESET_HERO_BACKGROUNDS.filter(p => !nextDeleted.includes(p.id));
    const allRemainingUrls = [
      ...remainingPresets.map(p => p.url),
      ...customHeroImages.map(c => c.url)
    ];

    // Keep only active images that actually still exist
    const safeActive = activeHeroImages.filter(u => u !== url && allRemainingUrls.includes(u));
    setActiveHeroImages(safeActive);

    // Determine what image to preview
    let nextSelectedBg = '';
    if (selectedHeroBg !== url && allRemainingUrls.includes(selectedHeroBg)) {
      nextSelectedBg = selectedHeroBg;
    } else if (safeActive.length > 0) {
      nextSelectedBg = safeActive[0];
    } else if (allRemainingUrls.length > 0) {
      nextSelectedBg = allRemainingUrls[0];
    } else {
      nextSelectedBg = ''; // Everything was deleted!
    }
    setSelectedHeroBg(nextSelectedBg);

    await handleSaveHeroFullSettings(
      nextSelectedBg,
      isHeroRotationEnabled,
      safeActive,
      customHeroImages,
      nextDeleted
    );
    showSuccess(`Foto "${name}" excluída da galeria!`);
  };

  const handleDeleteCustomHeroImage = async (id: string, name: string) => {
    if (!window.confirm(`Deseja remover a foto "${name}" da galeria?`)) return;
    const itemToDelete = customHeroImages.find(c => c.id === id);
    const nextCustom = customHeroImages.filter(c => c.id !== id);
    setCustomHeroImages(nextCustom);

    const remainingPresets = PRESET_HERO_BACKGROUNDS.filter(p => !deletedHeroPresets.includes(p.id));
    const allRemainingUrls = [
      ...remainingPresets.map(p => p.url),
      ...nextCustom.map(c => c.url)
    ];

    const safeActive = activeHeroImages.filter(u => (itemToDelete ? u !== itemToDelete.url : true) && allRemainingUrls.includes(u));
    setActiveHeroImages(safeActive);

    let nextSelectedBg = '';
    if (itemToDelete && selectedHeroBg === itemToDelete.url) {
      nextSelectedBg = safeActive[0] || allRemainingUrls[0] || '';
    } else if (allRemainingUrls.includes(selectedHeroBg)) {
      nextSelectedBg = selectedHeroBg;
    } else {
      nextSelectedBg = safeActive[0] || allRemainingUrls[0] || '';
    }
    setSelectedHeroBg(nextSelectedBg);

    await handleSaveHeroFullSettings(
      nextSelectedBg,
      isHeroRotationEnabled,
      safeActive,
      nextCustom,
      deletedHeroPresets
    );
    showSuccess(`Foto "${name}" excluída da galeria!`);
  };

  const handleHeroBgFileUpload = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setActionError('Por favor envie um arquivo de imagem válido (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setActionError('A imagem deve ter no máximo 15MB.');
      return;
    }
    setIsUploadingHeroBgFile(true);
    setActionError('');
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      let finalUrl = base64;
      try {
        const res = await api.uploadImage(base64, file.name);
        if (res.success && res.url) {
          finalUrl = res.url;
        }
      } catch (errUpload) {
        console.warn('Fallback base64 para foto da capa:', errUpload);
      }

      const newCustomEntry = {
        id: `hero_custom_${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, "") || 'Foto Personalizada',
        url: finalUrl,
        tag: '📸 Upload',
        subtitle: 'Foto enviada em alta resolução',
        created_at: new Date().toISOString()
      };

      const nextCustom = [newCustomEntry, ...customHeroImages];
      
      // Clean active pool to only include valid existing images plus the new one
      const remainingPresets = PRESET_HERO_BACKGROUNDS.filter(p => !deletedHeroPresets.includes(p.id));
      const validPool = [...remainingPresets.map(p => p.url), ...customHeroImages.map(c => c.url)];
      const cleanedActive = activeHeroImages.filter(u => validPool.includes(u));
      const nextActive = Array.from(new Set([...cleanedActive, finalUrl]));
      
      setSelectedHeroBg(finalUrl);
      setCustomHeroImages(nextCustom);
      setActiveHeroImages(nextActive);

      await handleSaveHeroFullSettings(finalUrl, isHeroRotationEnabled, nextActive, nextCustom, deletedHeroPresets);
      setIsUploadingHeroBgFile(false);
      showSuccess(`Nova foto "${file.name}" definida com sucesso como capa da ilha!`);
    };
    reader.onerror = () => {
      setActionError('Erro ao processar o arquivo de imagem.');
      setIsUploadingHeroBgFile(false);
    };
    reader.readAsDataURL(file);
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

  const handleExportBackup = async () => {
    try {
      setIsExportingBackup(true);
      const data = await api.getDatabaseBackup();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `algodoal_connect_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showSuccess('Backup completo baixado com sucesso!');
    } catch (err: any) {
      alert('Erro ao baixar backup: ' + err.message);
    } finally {
      setIsExportingBackup(false);
    }
  };

  const handleRestoreBackupFile = async (file: File) => {
    if (!file) return;
    try {
      setIsRestoringBackup(true);
      const text = await file.text();
      const json = JSON.parse(text);
      if (!json || typeof json !== 'object') {
        throw new Error('Formato de arquivo inválido. Deve ser um JSON válido.');
      }
      const res = await api.restoreDatabaseBackup(json);
      showSuccess(`Backup restaurado com sucesso! ${res.count || 0} registros sincronizados.`);
      if (onRefreshData) onRefreshData();
      const updatedAds = await api.getAdvertisements();
      setAds(updatedAds);
    } catch (err: any) {
      alert('Falha ao restaurar backup: ' + err.message);
    } finally {
      setIsRestoringBackup(false);
    }
  };

  // ==========================
  // POSTGRESQL & DB ACTIONS
  // ==========================
  const loadDbDiagnostic = async () => {
    try {
      const data = await api.getDatabaseDiagnostic();
      setDbDiagnostic(data);
    } catch {
      // ignore
    }
  };

  const handleTestDbConnection = async () => {
    setIsTestingDb(true);
    setDbTestResult(null);
    try {
      const res = await api.testDatabaseConnection();
      setDbTestResult(res);
      if (res.success) {
        showSuccess('Conexão com PostgreSQL bem-sucedida!');
      }
      loadDbDiagnostic();
    } catch (err: any) {
      setDbTestResult({
        success: false,
        message: err.message || 'Erro inesperado ao testar conexão'
      });
    } finally {
      setIsTestingDb(false);
    }
  };

  const handleSyncToPostgres = async () => {
    if (!confirm('Deseja sincronizar todos os parceiros, anúncios, fotos, histórias e configurações do banco local para o PostgreSQL?')) return;
    setIsSyncingDb(true);
    setDbSyncResult(null);
    try {
      const res = await api.syncDatabaseToPostgres();
      setDbSyncResult(res);
      if (res.success) {
        showSuccess('Todos os dados locais foram replicados com sucesso no PostgreSQL!');
        if (onRefreshData) onRefreshData();
      } else {
        setActionError(res.message || 'Falha na sincronização.');
      }
      loadDbDiagnostic();
    } catch (err: any) {
      setDbSyncResult({
        success: false,
        message: err.message || 'Erro ao sincronizar dados com PostgreSQL'
      });
    } finally {
      setIsSyncingDb(false);
    }
  };

  // ==========================
  // AD ACTIONS (REAL BACKEND)
  // ==========================
  const handleResetDefaultAds = async () => {
    if (!confirm('Deseja restaurar e reativar todos os anúncios comerciais oficiais da Ilha de Algodoal (Pousadas, Charretes, Restaurantes, Passeios)?')) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/advertisements/reset-defaults', { method: 'POST' });
      const data = await res.json();
      if (data.ads) {
        setAds(data.ads);
        showSuccess(`Sucesso! ${data.ads.length} anúncios comerciais foram restaurados e ativados.`);
        if (onRefreshData) onRefreshData();
      }
    } catch (err: any) {
      setActionError('Falha ao restaurar anúncios: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

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

    // Trava de segurança: impede upload de foto se título ou nome do estabelecimento estiverem vazios
    const titleTrim = (currentAd.title || '').trim();
    const businessNameTrim = (currentAd.business_name || '').trim();
    if (!titleTrim || !businessNameTrim) {
      const missing: string[] = [];
      if (!titleTrim) missing.push('Título do Anúncio');
      if (!businessNameTrim) missing.push('Nome do Estabelecimento');

      const warningMsg = `⚠️ Upload Bloqueado: Preencha o ${missing.join(' e o ')} antes de carregar a foto do anúncio.\nEsta validação impede que fotos fiquem órfãs no servidor caso o cadastro seja interrompido.`;
      setAdFormError(warningMsg);
      setAdValidationErrors(prev => ({
        ...prev,
        ...(!titleTrim ? { title: 'Preencha o título antes de carregar a foto.' } : {}),
        ...(!businessNameTrim ? { business_name: 'Preencha o nome do estabelecimento antes de carregar a foto.' } : {})
      }));

      // Limpa o input de arquivo caso tenha sido acionado
      const fileInput = document.getElementById('ad-image-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      const formEl = document.getElementById('ad-edit-form');
      if (formEl) formEl.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido (JPG, PNG, WebP, GIF).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 10MB.');
      return;
    }

    setIsUploadingImage(true);
    setAdFormError(null);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        try {
          // If another temporary image was uploaded in this session without being saved, rollback previous to avoid orphan files
          if (tempUploadedImageUrl && tempUploadedImageUrl.startsWith('/imagens/upload_')) {
            api.rollbackUploadedImage(tempUploadedImageUrl).catch(() => {});
          }

          const res = await api.uploadImage(base64Data, file.name);
          if (res.success && res.url) {
            setCurrentAd(prev => ({ ...prev, image_url: res.url }));
            if (res.url.startsWith('/imagens/upload_')) {
              setTempUploadedImageUrl(res.url);
            }
            // Clear validation error on image_url
            setAdValidationErrors(prev => {
              const next = { ...prev };
              delete next.image_url;
              return next;
            });
            showSuccess(`Imagem "${file.name}" enviada ao servidor com sucesso!`);
          } else {
            setCurrentAd(prev => ({ ...prev, image_url: base64Data }));
            showSuccess(`Imagem "${file.name}" pronta!`);
          }
        } catch (err: any) {
          console.warn('Fallback base64 para imagem:', err);
          setCurrentAd(prev => ({ ...prev, image_url: base64Data }));
          showSuccess(`Imagem "${file.name}" carregada!`);
        } finally {
          setIsUploadingImage(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error(err);
      setIsUploadingImage(false);
      setAdFormError('Erro ao ler arquivo de imagem: ' + (err?.message || ''));
    }
  };

  // Rollback uploaded temporary photo if user discards or changes mind
  const handleManualImageRollback = async () => {
    if (tempUploadedImageUrl && tempUploadedImageUrl.startsWith('/imagens/upload_')) {
      try {
        await api.rollbackUploadedImage(tempUploadedImageUrl);
        showSuccess('Foto órfã descartada e removida do servidor.');
      } catch (err: any) {
        console.warn('Erro ao descartar foto do servidor:', err);
      }
    }
    setTempUploadedImageUrl(null);
    setCurrentAd(prev => ({ ...prev, image_url: '/imagens/carroca.jpg' }));
    setAdValidationErrors(prev => {
      const next = { ...prev };
      delete next.image_url;
      return next;
    });
  };

  // Safe ad modal close with automatic rollback of uncommitted uploaded images
  const handleCloseAdModal = async () => {
    if (tempUploadedImageUrl && tempUploadedImageUrl.startsWith('/imagens/upload_')) {
      try {
        await api.rollbackUploadedImage(tempUploadedImageUrl);
        showSuccess('Upload cancelado: foto temporária removida do servidor para evitar arquivo órfão.');
      } catch (err) {
        console.warn('Erro ao limpar imagem órfã no cancelamento:', err);
      }
    }
    setTempUploadedImageUrl(null);
    setAdValidationErrors({});
    setAdFormError(null);
    setIsEditingAd(false);
    setCurrentAd({});
  };

  // Client-side schema validation enforcing NOT NULL database columns
  const validateAdForm = (): { valid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    const title = (currentAd.title || '').trim();
    if (!title) {
      errors.title = 'Título do anúncio é obrigatório e não pode ser vazio.';
    } else if (title.length < 3) {
      errors.title = 'O título deve ter no mínimo 3 caracteres.';
    }

    const businessName = (currentAd.business_name || '').trim();
    if (!businessName) {
      errors.business_name = 'Nome do estabelecimento é obrigatório (ex: Restaurante O Marujo).';
    }

    const category = (currentAd.category || '').trim();
    if (!category) {
      errors.category = 'Selecione uma categoria válida para o anúncio.';
    }

    const description = (currentAd.description || '').trim();
    if (!description) {
      errors.description = 'Descrição completa é obrigatória com detalhes do serviço ou produto.';
    }

    const imageUrl = (currentAd.image_url || '').trim();
    if (!imageUrl) {
      errors.image_url = 'A foto/imagem do anúncio é obrigatória. Envie um arquivo ou selecione uma imagem.';
    }

    const whatsapp = (currentAd.whatsapp || '').replace(/\D/g, '');
    if (!whatsapp) {
      errors.whatsapp = 'WhatsApp para contato direto é obrigatório.';
    } else if (whatsapp.length < 10) {
      errors.whatsapp = 'Informe um WhatsApp válido com DDD (mínimo 10 dígitos).';
    }

    const location = (currentAd.location || '').trim();
    if (!location) {
      errors.location = 'Localização na Ilha é obrigatória (ex: Praia da Princesa, Porto).';
    }

    return { valid: Object.keys(errors).length === 0, errors };
  };

  const handleSaveAd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdFormError(null);

    // 1. Client-side schema validation (NOT NULL enforcement)
    const { valid, errors } = validateAdForm();
    if (!valid) {
      setAdValidationErrors(errors);
      setAdFormError('Atenção: existem campos obrigatórios não preenchidos ou inválidos. Veja os avisos em vermelho abaixo.');
      const formEl = document.getElementById('ad-edit-form');
      if (formEl) formEl.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setAdValidationErrors({});
    setIsSavingAd(true);

    try {
      if (currentAd.id) {
        // Edit existing ad in DB
        const updated = await api.updateAdvertisement(currentAd.id, currentAd);
        setAds(prev => prev.map(a => a.id === updated.id ? updated : a));
        // Ad saved successfully: disarm rollback tracker
        setTempUploadedImageUrl(null);
        showSuccess('Anúncio atualizado e salvo no banco de dados com sucesso!');
      } else {
        // Create new ad in DB
        const created = await api.createAdvertisement(currentAd);
        setAds(prev => [created, ...prev]);
        // Ad saved successfully: disarm rollback tracker
        setTempUploadedImageUrl(null);
        showSuccess('Novo anúncio cadastrado e veiculado com sucesso!');
      }

      setIsEditingAd(false);
      setCurrentAd({});
      setAdFormError(null);
      setAdValidationErrors({});
      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      console.error('Erro ao salvar anúncio:', err);
      const errorMsg = err?.message || 'Erro inesperado ao salvar anúncio no servidor.';
      // Keep form open, preserve typed data, and display prominent error banner
      setAdFormError(errorMsg);
      const formEl = document.getElementById('ad-edit-form');
      if (formEl) formEl.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSavingAd(false);
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
        showSuccess(`Status de "${partner.name}" atualizado com sucesso!`);
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePartnerPlan = async (partner: Partner, newPlan: AdPlanType) => {
    try {
      const res = await fetch(`/api/partners/${partner.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          plan_type: newPlan,
          verified: newPlan === 'mensal'
        })
      });
      if (res.ok) {
        setPartners(prev => prev.map(p => p.id === partner.id ? { ...p, plan_type: newPlan, verified: newPlan === 'mensal' } : p));
        const planName = newPlan === 'mensal' ? 'Plano Mensal (R$ 30/mês)' : newPlan === 'free' ? 'Plano Free (Grátis)' : 'Divulgação (Grátis)';
        showSuccess(`Plano de "${partner.name}" atualizado para ${planName}!`);
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendPartnerPlanWhatsApp = (partner: Partner) => {
    const plan = partner.plan_type || (partner.category === 'pousadas' || partner.category === 'alimentacao' ? 'mensal' : partner.category === 'eventos' ? 'divulgacao' : 'free');
    let text = '';
    if (plan === 'mensal') {
      text = `Olá ${partner.name}! Tudo bem?\n\nSeu estabelecimento está ativo no *Plano Mensal (R$ 30/mês)* no *Algodoal Connect*.\n\n✨ *Seus Benefícios Exclusivos:*\n- 🏆 Banner Rotativo no Topo\n- 🥇 Destaque 1º Lugar na Categoria\n- 📸 Página "Saiba Mais" com fotos e detalhes\n- 💬 Botão de WhatsApp direto para reservas\n\nConte sempre conosco para divulgar seu negócio na Ilha de Algodoal!`;
    } else if (plan === 'divulgacao') {
      text = `Olá ${partner.name}! Tudo bem?\n\nSeu evento cultural / show está ativo na *Divulgação Gratuita* com Banner Rotativo no *Algodoal Connect*! 🎉`;
    } else {
      text = `Olá ${partner.name}! Tudo bem?\n\nSeu negócio está cadastrado no *Plano Free (Grátis)* no *Algodoal Connect*.\n\n💡 Gostaria de ter seu *Banner no topo do aplicativo*, *Destaque em 1º Lugar na sua Categoria* e *Página Saiba Mais*? Conheça nosso *Plano Mensal por apenas R$ 30/mês*!`;
    }
    const cleanPhone = (partner.whatsapp || partner.phone || '').replace(/\D/g, '');
    const phone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    if (!phone || phone === '55') {
      alert('Este parceiro não possui número de WhatsApp ou telefone cadastrado.');
      return;
    }
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
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
      const currentActive = story.active !== undefined 
        ? story.active 
        : (story.is_active !== undefined ? story.is_active : true);
      const nextActive = !currentActive;
      const updated = await api.updateStory(story.id, { active: nextActive, is_active: nextActive });
      if (updated) {
        setStories(prev => prev.map(s => s.id === story.id ? { ...s, ...updated, active: nextActive, is_active: nextActive } : s));
        showSuccess(`Destaque "${story.title}" ${nextActive ? 'ativado' : 'pausado'}!`);
        window.dispatchEvent(new CustomEvent('algodoal_stories_updated'));
      }
    } catch (err: any) {
      console.error(err);
      alert(`Erro ao atualizar status do destaque: ${err?.message || 'Falha de comunicação'}`);
    }
  };

  const handleDeleteStory = async (id: string, title: string) => {
    if (!confirm(`Deseja realmente excluir o destaque "${title}"?`)) return;
    try {
      const success = await api.deleteStory(id);
      if (success) {
        setStories(prev => prev.filter(s => s.id !== id));
        showSuccess(`Destaque "${title}" excluído com sucesso!`);
        window.dispatchEvent(new CustomEvent('algodoal_stories_updated'));
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir destaque.');
    }
  };

  const handleMoveStory = async (story: IslandStory, direction: 'up' | 'down') => {
    const sorted = [...stories].sort((a, b) => ((a.orderIndex ?? a.order_index) || 0) - ((b.orderIndex ?? b.order_index) || 0));
    const currentIndex = sorted.findIndex(s => s.id === story.id);
    if (currentIndex === -1) return;
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const targetStory = sorted[targetIndex];
    const currentOrder = story.orderIndex ?? story.order_index ?? (currentIndex + 1);
    const targetOrder = targetStory.orderIndex ?? targetStory.order_index ?? (targetIndex + 1);

    try {
      await api.updateStory(story.id, { orderIndex: targetOrder, order_index: targetOrder });
      await api.updateStory(targetStory.id, { orderIndex: currentOrder, order_index: currentOrder });
      setStories(prev => prev.map(s => {
        if (s.id === story.id) return { ...s, orderIndex: targetOrder, order_index: targetOrder };
        if (s.id === targetStory.id) return { ...s, orderIndex: currentOrder, order_index: currentOrder };
        return s;
      }));
      showSuccess(`Ordem de exibição dos destaques atualizada!`);
      window.dispatchEvent(new CustomEvent('algodoal_stories_updated'));
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
                onClick={() => setActiveMainTab('planos')}
                className={`py-3 px-4 rounded-t-xl border-b-2 flex items-center gap-2 transition cursor-pointer ${
                  activeMainTab === 'planos'
                    ? 'border-emerald-500 bg-white text-emerald-950 shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>💎 Planos & Preços (R$ 30/mês)</span>
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
                onClick={() => setActiveMainTab('fundo')}
                className={`py-3 px-4 rounded-t-xl border-b-2 flex items-center gap-2 transition cursor-pointer ${
                  activeMainTab === 'fundo'
                    ? 'border-amber-500 bg-white text-amber-950 shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-amber-600" />
                <span>🖼️ Fundo da Capa (Hero)</span>
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
                        type="button"
                        onClick={handleResetDefaultAds}
                        disabled={isLoading}
                        title="Restaurar e ativar todos os anúncios comerciais oficiais"
                        className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-slate-300"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="hidden sm:inline">Restaurar Anúncios Padrão</span>
                      </button>

                      <button
                        onClick={() => {
                          setTempUploadedImageUrl(null);
                          setAdFormError(null);
                          setAdValidationErrors({});
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
                          Nenhum anúncio corresponde aos filtros selecionados. Crie um novo anúncio ou restaure os anúncios comerciais oficiais da ilha.
                        </p>
                        <div className="mt-4 flex flex-wrap justify-center gap-3">
                          <button
                            type="button"
                            onClick={handleResetDefaultAds}
                            disabled={isLoading}
                            className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition cursor-pointer"
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span>Restaurar 6 Anúncios Oficiais da Ilha</span>
                          </button>
                          {(selectedAdCategory !== 'todos' || adSearchTerm) && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedAdCategory('todos');
                                setAdSearchTerm('');
                              }}
                              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                            >
                              Limpar Filtros
                            </button>
                          )}
                        </div>
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
                                  setTempUploadedImageUrl(null);
                                  setAdFormError(null);
                                  setAdValidationErrors({});
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

              {/* TAB: PLANOS & MONETIZAÇÃO */}
              {activeMainTab === 'planos' && (
                <div className="space-y-6 max-w-7xl mx-auto">
                  
                  {/* Header Banner */}
                  <div className="bg-linear-to-r from-amber-600 via-amber-700 to-slate-900 text-white p-6 rounded-3xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="inline-flex items-center gap-2 bg-amber-500/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-200 border border-amber-400/30">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Tabela Oficial de Planos Comerciais</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black font-serif text-white tracking-tight">
                        Planos de Anúncio & Divulgação de Algodoal
                      </h3>
                      <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                        Estrutura comercial justa e transparente: Pousadas e restaurantes principais no Plano Mensal (R$ 30/mês) com banner no topo e destaque 1º lugar, e planos gratuitos para serviços comunitários e atrações culturais.
                      </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex flex-col items-center justify-center shrink-0 min-w-48 text-center">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200">
                        Faturamento Estimado
                      </span>
                      <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-0.5">
                        R$ {(partners.filter(p => (p.plan_type === 'mensal' || (!p.plan_type && (p.category === 'pousadas' || p.category === 'alimentacao')))).length * 30).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                      <span className="text-[10px] text-white/80 font-medium">
                        /mês ({partners.filter(p => (p.plan_type === 'mensal' || (!p.plan_type && (p.category === 'pousadas' || p.category === 'alimentacao')))).length} assinantes ativos)
                      </span>
                    </div>
                  </div>

                  {/* 3 Main Pricing Plan Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    
                    {/* PLANO MENSAL */}
                    <div className="bg-white rounded-3xl border-2 border-amber-500 shadow-lg p-6 flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                        Mais Recomendado
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">🏆</span>
                          <div>
                            <h4 className="text-lg font-black text-slate-900 font-serif">Plano Mensal</h4>
                            <p className="text-[11px] font-bold text-amber-700">Destaque Total & Hero Banner</p>
                          </div>
                        </div>

                        <div className="mt-4 pb-4 border-b border-slate-100 flex items-baseline gap-1.5">
                          <span className="text-3xl font-black text-slate-950">R$ 30</span>
                          <span className="text-xs font-bold text-slate-500">/mês</span>
                        </div>

                        <div className="mt-4 bg-amber-50 rounded-xl p-3 border border-amber-100 mb-4">
                          <span className="text-[11px] font-black uppercase text-amber-900 block mb-1">Indicado Para:</span>
                          <p className="text-xs font-bold text-amber-950">Pousadas e Restaurantes Principais</p>
                        </div>

                        <div className="space-y-2.5 text-xs text-slate-700">
                          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">O que inclui:</span>
                          <div className="flex items-start gap-2 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <span><strong>Banner rotativo no topo</strong> (Hero Carousel da tela inicial)</span>
                          </div>
                          <div className="flex items-start gap-2 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <span><strong>Destaque 1º lugar</strong> na categoria</span>
                          </div>
                          <div className="flex items-start gap-2 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <span><strong>Saiba mais:</strong> página completa com fotos e detalhes</span>
                          </div>
                          <div className="flex items-start gap-2 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <span><strong>Botão de WhatsApp direto</strong> para reservas e pedidos</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Empresas neste plano:</span>
                        <span className="bg-amber-100 text-amber-900 font-black px-2.5 py-0.5 rounded-full">
                          {partners.filter(p => (p.plan_type === 'mensal' || (!p.plan_type && (p.category === 'pousadas' || p.category === 'alimentacao')))).length} ativas
                        </span>
                      </div>
                    </div>

                    {/* PLANO FREE */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-slate-200 text-slate-700 text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                        Comunitário
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">🏪</span>
                          <div>
                            <h4 className="text-lg font-black text-slate-900 font-serif">Plano Free</h4>
                            <p className="text-[11px] font-bold text-slate-600">Cadastro Gratuito no Guia</p>
                          </div>
                        </div>

                        <div className="mt-4 pb-4 border-b border-slate-100 flex items-baseline gap-1.5">
                          <span className="text-3xl font-black text-emerald-600">Grátis</span>
                        </div>

                        <div className="mt-4 bg-slate-50 rounded-xl p-3 border border-slate-200 mb-4">
                          <span className="text-[11px] font-black uppercase text-slate-700 block mb-1">Indicado Para:</span>
                          <p className="text-xs font-bold text-slate-900">Barracas, Depósitos e Passeios de Barco</p>
                        </div>

                        <div className="space-y-2.5 text-xs text-slate-700">
                          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">O que inclui:</span>
                          <div className="flex items-start gap-2 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span><strong>Anúncio menor</strong> na listagem da categoria</span>
                          </div>
                          <div className="flex items-start gap-2 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span><strong>Botão de WhatsApp</strong> direto com o cliente</span>
                          </div>
                          <div className="flex items-start gap-2 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>Localização, horários e contato no guia da Ilha</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Estabelecimentos:</span>
                        <span className="bg-slate-100 text-slate-800 font-black px-2.5 py-0.5 rounded-full">
                          {partners.filter(p => (p.plan_type === 'free' || (!p.plan_type && p.category !== 'pousadas' && p.category !== 'alimentacao' && p.category !== 'eventos'))).length} cadastrados
                        </span>
                      </div>
                    </div>

                    {/* PLANO DIVULGAÇÃO */}
                    <div className="bg-white rounded-3xl border border-purple-200 shadow-xs p-6 flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                        Cultural / Eventos
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">🎉</span>
                          <div>
                            <h4 className="text-lg font-black text-slate-900 font-serif">Divulgação</h4>
                            <p className="text-[11px] font-bold text-purple-700">Apoio Cultural & Atrações</p>
                          </div>
                        </div>

                        <div className="mt-4 pb-4 border-b border-slate-100 flex items-baseline gap-1.5">
                          <span className="text-3xl font-black text-purple-600">Grátis</span>
                        </div>

                        <div className="mt-4 bg-purple-50 rounded-xl p-3 border border-purple-100 mb-4">
                          <span className="text-[11px] font-black uppercase text-purple-900 block mb-1">Indicado Para:</span>
                          <p className="text-xs font-bold text-purple-950">Luau, Shows de Reggae, Festas e Artesanato</p>
                        </div>

                        <div className="space-y-2.5 text-xs text-slate-700">
                          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">O que inclui:</span>
                          <div className="flex items-start gap-2 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                            <span><strong>Banner rotativo</strong> na página inicial e eventos</span>
                          </div>
                          <div className="flex items-start gap-2 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                            <span>Divulgação cultural e apoio a artistas locais</span>
                          </div>
                          <div className="flex items-start gap-2 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                            <span>Data, local e WhatsApp dos organizadores</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Eventos ativos:</span>
                        <span className="bg-purple-100 text-purple-900 font-black px-2.5 py-0.5 rounded-full">
                          {ads.filter(a => a.category === 'eventos' || a.plan_type === 'divulgacao').length + partners.filter(p => p.category === 'eventos' || p.plan_type === 'divulgacao').length} eventos
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Plan Manager Table */}
                  <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-base font-black text-slate-900 font-serif">
                          Gerenciamento de Planos por Estabelecimento
                        </h4>
                        <p className="text-xs text-slate-500">
                          Altere o plano comercial de qualquer parceiro com 1 clique ou envie mensagem no WhatsApp.
                        </p>
                      </div>

                      {/* Search and filter controls */}
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Buscar parceiro..."
                            value={planSearchTerm}
                            onChange={(e) => setPlanSearchTerm(e.target.value)}
                            className="text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-amber-500 w-44"
                          />
                        </div>

                        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-[11px] font-bold">
                          <button
                            onClick={() => setPlanFilter('todos')}
                            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                              planFilter === 'todos' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            Todos
                          </button>
                          <button
                            onClick={() => setPlanFilter('mensal')}
                            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                              planFilter === 'mensal' ? 'bg-amber-500 text-slate-950 font-black shadow-xs' : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            Mensal (R$ 30)
                          </button>
                          <button
                            onClick={() => setPlanFilter('free')}
                            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                              planFilter === 'free' ? 'bg-emerald-600 text-white font-black shadow-xs' : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            Free
                          </button>
                          <button
                            onClick={() => setPlanFilter('divulgacao')}
                            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                              planFilter === 'divulgacao' ? 'bg-purple-600 text-white font-black shadow-xs' : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            Divulgação
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 uppercase font-black text-[11px] border-b border-slate-200">
                            <th className="py-3 px-4">Estabelecimento / Contato</th>
                            <th className="py-3 px-4">Categoria</th>
                            <th className="py-3 px-4">Plano Atual</th>
                            <th className="py-3 px-4">Alterar Plano</th>
                            <th className="py-3 px-4 text-right">Ações Rápidas</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {partners
                            .filter(p => {
                              const currentPlan = p.plan_type || (p.category === 'pousadas' || p.category === 'alimentacao' ? 'mensal' : p.category === 'eventos' ? 'divulgacao' : 'free');
                              if (planFilter !== 'todos' && currentPlan !== planFilter) return false;
                              if (planSearchTerm) {
                                const term = planSearchTerm.toLowerCase();
                                return p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term) || (p.location || '').toLowerCase().includes(term);
                              }
                              return true;
                            })
                            .map(partner => {
                              const currentPlan = partner.plan_type || (partner.category === 'pousadas' || partner.category === 'alimentacao' ? 'mensal' : partner.category === 'eventos' ? 'divulgacao' : 'free');
                              return (
                                <tr key={partner.id} className="hover:bg-slate-50 transition">
                                  <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                      <img
                                        src={partner.photo_url || '/imagens/algodoal.jpg'}
                                        alt={partner.name}
                                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                                      />
                                      <div>
                                        <div className="font-black text-slate-900 flex items-center gap-1.5">
                                          <span>{partner.name}</span>
                                          {partner.verified && (
                                            <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-1.5 py-0.2 rounded-md">
                                              Destaque
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-[11px] text-slate-500 flex items-center gap-2">
                                          <span>{partner.phone || partner.whatsapp || 'Sem contato'}</span>
                                          <span>•</span>
                                          <span className="truncate max-w-40">{partner.location || 'Ilha de Algodoal'}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </td>

                                  <td className="py-3 px-4">
                                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-bold text-[11px] uppercase">
                                      {partner.category}
                                    </span>
                                  </td>

                                  <td className="py-3 px-4">
                                    {currentPlan === 'mensal' && (
                                      <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-lg font-black text-xs inline-flex items-center gap-1">
                                        <span>🏆</span> Plano Mensal (R$ 30/mês)
                                      </span>
                                    )}
                                    {currentPlan === 'free' && (
                                      <span className="bg-slate-100 text-slate-800 border border-slate-300 px-2.5 py-1 rounded-lg font-bold text-xs inline-flex items-center gap-1">
                                        <span>🏪</span> Plano Free (Grátis)
                                      </span>
                                    )}
                                    {currentPlan === 'divulgacao' && (
                                      <span className="bg-purple-100 text-purple-900 border border-purple-300 px-2.5 py-1 rounded-lg font-bold text-xs inline-flex items-center gap-1">
                                        <span>🎉</span> Divulgação (Grátis)
                                      </span>
                                    )}
                                  </td>

                                  <td className="py-3 px-4">
                                    <div className="flex items-center gap-1.5">
                                      <button
                                        onClick={() => handleUpdatePartnerPlan(partner, 'mensal')}
                                        className={`px-2 py-1 rounded-lg text-[11px] font-black transition cursor-pointer ${
                                          currentPlan === 'mensal'
                                            ? 'bg-amber-500 text-slate-950 shadow-xs ring-2 ring-amber-300'
                                            : 'bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-900'
                                        }`}
                                      >
                                        R$ 30/mês
                                      </button>
                                      <button
                                        onClick={() => handleUpdatePartnerPlan(partner, 'free')}
                                        className={`px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                                          currentPlan === 'free'
                                            ? 'bg-emerald-600 text-white font-black shadow-xs ring-2 ring-emerald-300'
                                            : 'bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-900'
                                        }`}
                                      >
                                        Free
                                      </button>
                                      <button
                                        onClick={() => handleUpdatePartnerPlan(partner, 'divulgacao')}
                                        className={`px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                                          currentPlan === 'divulgacao'
                                            ? 'bg-purple-600 text-white font-black shadow-xs ring-2 ring-purple-300'
                                            : 'bg-slate-100 text-slate-600 hover:bg-purple-100 hover:text-purple-900'
                                        }`}
                                      >
                                        Divulgação
                                      </button>
                                    </div>
                                  </td>

                                  <td className="py-3 px-4 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        onClick={() => handleSendPartnerPlanWhatsApp(partner)}
                                        title="Enviar mensagem comercial no WhatsApp"
                                        className="py-1 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-black text-[11px] flex items-center gap-1 transition cursor-pointer"
                                      >
                                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>WhatsApp</span>
                                      </button>
                                      <button
                                        onClick={() => handleOpenEditPartner(partner)}
                                        title="Editar detalhes do parceiro"
                                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition cursor-pointer"
                                      >
                                        <Edit className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
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
                        Gerencie pousadas, chalés, charretes, restaurantes, passeios de rabeta e comércios da Ilha.
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs font-bold text-slate-600">
                        <span className="bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                          Total: <strong className="text-slate-900">{partners.length}</strong>
                        </span>
                        <span className="bg-emerald-50 px-2.5 py-0.5 rounded-lg text-emerald-700 border border-emerald-200">
                          Ativos: <strong className="text-emerald-900">{partners.filter(p => p.is_active).length}</strong>
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
                        { id: 'transporte', label: 'Charretes & Transporte', icon: Truck },
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
                              
                              {/* Highlight/Plan Badge */}
                              {p.verified && (
                                <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                                  <Sparkles className="w-3 h-3" />
                                  <span>Destaque</span>
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
                <div className="max-w-4xl mx-auto space-y-6">
                  
                  {/* CARD 0: POSTGRESQL & STATUS DO BANCO DE DADOS */}
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${
                          dbDiagnostic?.dbStatus?.connected ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          <Database className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-base font-black text-slate-900 font-serif flex items-center gap-2">
                            PostgreSQL & Arquitetura de Dados
                            {dbDiagnostic?.dbStatus?.connected ? (
                              <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                PostgreSQL Conectado
                              </span>
                            ) : (
                              <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                Modo Contingência Local JSON
                              </span>
                            )}
                          </h3>
                          <p className="text-xs text-slate-500">
                            Persistência dual resiliente com tolerância a falhas de rede e sincronização bidirecional.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Botão Testar Conexão */}
                        <button
                          type="button"
                          onClick={handleTestDbConnection}
                          disabled={isTestingDb}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition cursor-pointer disabled:opacity-50"
                        >
                          {isTestingDb ? (
                            <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                          ) : (
                            <RefreshCw className="w-4 h-4 text-emerald-400" />
                          )}
                          <span>{isTestingDb ? 'Testando Conexão...' : 'Testar Conexão PostgreSQL'}</span>
                        </button>

                        {/* Botão Sincronizar com PostgreSQL */}
                        <button
                          type="button"
                          onClick={handleSyncToPostgres}
                          disabled={isSyncingDb}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition cursor-pointer disabled:opacity-50"
                          title="Grava todos os parceiros, anúncios, fotos e contatos locais diretamente nas tabelas PostgreSQL"
                        >
                          {isSyncingDb ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                          <span>{isSyncingDb ? 'Sincronizando...' : 'Sincronizar Dados p/ PostgreSQL'}</span>
                        </button>
                      </div>
                    </div>

                    {/* STATUS DETAILS ROW */}
                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Host / String de Conexão Configurada
                        </div>
                        <div className="text-xs font-mono font-medium text-slate-700 break-all bg-white px-3 py-2 rounded-xl border border-slate-200/80">
                          {dbDiagnostic?.dbStatus?.configuredUrl || 'Carregando...'}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>A senha é mantida oculta por segurança.</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Estado Atual do Mecanismo de Dados
                        </div>
                        <div className="text-xs font-semibold text-slate-800 bg-white px-3 py-2 rounded-xl border border-slate-200/80 flex items-center justify-between">
                          <span>{dbDiagnostic?.dbStatus?.details || 'Armazenamento Local JSON Ativo'}</span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            {dbDiagnostic?.dbStatus?.type === 'postgresql' ? 'PGSQL' : 'JSON'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Se o PostgreSQL estiver inacessível, o app nunca cai: o modo local assume instantaneamente.</span>
                        </div>
                      </div>
                    </div>

                    {/* RESULTADO DO TESTE DE CONEXÃO */}
                    {dbTestResult && (
                      <div className={`mt-4 p-4 rounded-2xl border text-xs ${
                        dbTestResult.success
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                          : 'bg-amber-50 border-amber-200 text-amber-950'
                      }`}>
                        <div className="flex items-start gap-2.5">
                          {dbTestResult.success ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                          )}
                          <div className="space-y-1">
                            <div className="font-bold text-sm">
                              {dbTestResult.message}
                            </div>
                            {dbTestResult.details?.advice && (
                              <p className="text-slate-700 leading-relaxed font-medium">
                                💡 <strong>Orientação:</strong> {dbTestResult.details.advice}
                              </p>
                            )}
                            {dbTestResult.details?.tablesCount !== undefined && (
                              <p className="text-emerald-800 text-[11px]">
                                Tabelas disponíveis encontradas no schema: <strong>{dbTestResult.details.tablesCount}</strong> ({dbTestResult.details.tables?.join(', ')})
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* RESULTADO DA SINCRONIZAÇÃO */}
                    {dbSyncResult && (
                      <div className={`mt-4 p-4 rounded-2xl border text-xs ${
                        dbSyncResult.success
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                          : 'bg-rose-50 border-rose-200 text-rose-950'
                      }`}>
                        <div className="flex items-start gap-2.5">
                          {dbSyncResult.success ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                          )}
                          <div className="space-y-1">
                            <div className="font-bold text-sm">{dbSyncResult.message}</div>
                            {dbSyncResult.syncedCounts && (
                              <div className="flex flex-wrap gap-2 pt-1">
                                {Object.entries(dbSyncResult.syncedCounts).map(([key, val]) => (
                                  <span key={key} className="px-2 py-0.5 rounded-lg bg-emerald-100/80 border border-emerald-200 text-emerald-900 text-[10px] font-bold">
                                    {key}: {val}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* GUIAS EXPLICATIVOS EXPANSÍVEIS */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setShowPgGuide(showPgGuide === 'vps' ? null : 'vps')}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Info className="w-4 h-4" />
                        <span>{showPgGuide === 'vps' ? 'Ocultar Guia do Servidor VPS' : 'Como liberar o PostgreSQL remoto (Porta 5432 / Firewall)'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowPgGuide(showPgGuide === 'docker' ? null : 'docker')}
                        className="text-xs font-bold text-slate-600 hover:text-slate-800 flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Database className="w-4 h-4" />
                        <span>{showPgGuide === 'docker' ? 'Ocultar Guia Docker' : 'Como rodar no Docker com Postgres local incluído'}</span>
                      </button>
                    </div>

                    {showPgGuide === 'vps' && (
                      <div className="mt-4 p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs space-y-3">
                        <div className="font-bold text-indigo-950 text-sm flex items-center gap-2">
                          Passo a Passo para liberar o PostgreSQL no seu servidor (56.125.35.169):
                        </div>
                        <ol className="list-decimal list-inside space-y-2 text-slate-700">
                          <li>
                            <strong>Liberar a porta 5432 no Firewall:</strong>
                            <code className="block mt-1 p-2 rounded-lg bg-slate-900 text-emerald-300 font-mono text-[11px]">
                              sudo ufw allow 5432/tcp
                            </code>
                          </li>
                          <li>
                            <strong>Configurar o PostgreSQL para escutar conexões externas:</strong>
                            <div className="text-[11px] text-slate-600 mt-0.5">No arquivo <code>/etc/postgresql/16/main/postgresql.conf</code>:</div>
                            <code className="block mt-1 p-2 rounded-lg bg-slate-900 text-emerald-300 font-mono text-[11px]">
                              listen_addresses = '*'
                            </code>
                          </li>
                          <li>
                            <strong>Permitir autenticação de rede:</strong>
                            <div className="text-[11px] text-slate-600 mt-0.5">No final do arquivo <code>/etc/postgresql/16/main/pg_hba.conf</code>:</div>
                            <code className="block mt-1 p-2 rounded-lg bg-slate-900 text-emerald-300 font-mono text-[11px]">
                              host    all    all    0.0.0.0/0    md5
                            </code>
                          </li>
                          <li>
                            <strong>Reiniciar o serviço do PostgreSQL:</strong>
                            <code className="block mt-1 p-2 rounded-lg bg-slate-900 text-emerald-300 font-mono text-[11px]">
                              sudo systemctl restart postgresql
                            </code>
                          </li>
                        </ol>
                        <p className="text-[11px] text-slate-500 pt-1">
                          Assim que executar esses comandos no seu servidor, clique no botão <strong>"Testar Conexão PostgreSQL"</strong> acima para conectar imediatamente!
                        </p>
                      </div>
                    )}

                    {showPgGuide === 'docker' && (
                      <div className="mt-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          Rodando via Docker Compose (Sem precisar de servidor externo):
                        </div>
                        <p className="text-slate-700 text-xs leading-relaxed">
                          O arquivo <code>docker-compose.yml</code> deste projeto já está configurado com um serviço oficial do <strong>PostgreSQL 16 Alpine</strong>, com volume persistente (<code>postgres_data</code>), checagem de saúde automática (<code>healthcheck pg_isready</code>) e rede interna dedicada.
                        </p>
                        <code className="block p-2.5 rounded-lg bg-slate-900 text-emerald-300 font-mono text-[11px]">
                          docker compose up -d --build
                        </code>
                        <p className="text-[11px] text-slate-600">
                          O banco de dados sobe automaticamente e o Algodoal Connect se conecta nele internamente em <code>postgres:5432</code> de forma 100% segura e rápida.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* CARD 1: BACKUP & PREVENÇÃO DE PERDA DE DADOS */}
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                          <Database className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-base font-black text-slate-900 font-serif flex items-center gap-2">
                            Backup & Salvaguarda dos Dados
                            <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                              🛡️ Proteção Ativa
                            </span>
                          </h3>
                          <p className="text-xs text-slate-500">
                            Evite perdas acidentais de anúncios, imagens enviadas e dados dos parceiros.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Botão Baixar Backup */}
                        <button
                          type="button"
                          onClick={handleExportBackup}
                          disabled={isExportingBackup}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition cursor-pointer disabled:opacity-50"
                        >
                          {isExportingBackup ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                          <span>Baixar Backup (.JSON)</span>
                        </button>

                        {/* Botão Restaurar Backup */}
                        <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow-xs transition cursor-pointer disabled:opacity-50">
                          {isRestoringBackup ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                          <span>Restaurar Backup</span>
                          <input
                            type="file"
                            accept=".json,application/json"
                            className="hidden"
                            disabled={isRestoringBackup}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleRestoreBackupFile(e.target.files[0]);
                                e.target.value = '';
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                        <div className="font-black text-emerald-950 flex items-center gap-1.5 mb-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          Espelho Automático Ativo
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          Toda gravação cria automaticamente uma réplica idêntica em <code>data/algodoal_db.backup.json</code>.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100">
                        <div className="font-black text-amber-950 flex items-center gap-1.5 mb-1">
                          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                          Anti-Sobrescrita Inteligente
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          Mesmo se o servidor reiniciar, anúncios personalizados e fotos enviadas nunca são apagados pelo padrão de fábrica.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                        <div className="font-black text-indigo-950 flex items-center gap-1.5 mb-1">
                          <Save className="w-4 h-4 text-indigo-600 shrink-0" />
                          Cópia Local no seu PC
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          Clique em "Baixar Backup" após cadastrar novos parceiros ou fotos para ter um arquivo de segurança no seu computador.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CARD 2: SENHA MASTER DO ADMIN */}
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
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

                    <form onSubmit={handleChangePassword} className="space-y-4 text-xs font-bold text-slate-700 max-w-xl">
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
                </div>
              )}

              {/* TAB 6: GERENCIADOR DE FUNDO DA CAPA & ROTAÇÃO DINÂMICA */}
              {activeMainTab === 'fundo' && (
                <div className="space-y-6 max-w-5xl mx-auto">
                  
                  {/* Top Bar Header */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
                          <ImageIcon className="w-5 h-5" />
                        </span>
                        <h3 className="text-base font-black text-slate-900 font-serif">
                          Galeria e Rotação da Capa Principal (Hero)
                        </h3>
                        <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          {isHeroRotationEnabled ? '🔄 Rotação Ativa' : '📌 Modo Fixo'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Defina as imagens da capa e ative a rotação automática para trocar a foto a cada atualização da página.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={handleResetToDefaultRotation}
                        disabled={isSavingHeroBg}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer border border-slate-300"
                        title="Restaurar galeria e rotação padrão"
                      >
                        Restaurar Padrão
                      </button>
                      <button
                        onClick={() => handleSaveHeroFullSettings(selectedHeroBg, isHeroRotationEnabled, activeHeroImages, customHeroImages)}
                        disabled={isSavingHeroBg}
                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isSavingHeroBg ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        <span>Salvar Configurações</span>
                      </button>
                    </div>
                  </div>

                  {/* Mode Selector Card */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                          <span>⚙️</span>
                          <span>Modo de Exibição da Capa</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Escolha se a imagem deve trocar a cada visita ou permanecer fixa em uma foto específica.
                        </p>
                      </div>

                      {/* Mode Toggle Buttons */}
                      <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setIsHeroRotationEnabled(true);
                            handleSaveHeroFullSettings(selectedHeroBg, true, activeHeroImages, customHeroImages);
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                            isHeroRotationEnabled
                              ? 'bg-amber-500 text-slate-950 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <span>🔄</span>
                          <span>Trocar a Cada Atualização</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsHeroRotationEnabled(false);
                            handleSaveHeroFullSettings(selectedHeroBg, false, activeHeroImages, customHeroImages);
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                            !isHeroRotationEnabled
                              ? 'bg-amber-500 text-slate-950 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <span>📌</span>
                          <span>Imagem Fixa</span>
                        </button>
                      </div>
                    </div>

                    {/* Status & Quick Actions Bar */}
                    <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                        <span>
                          {isHeroRotationEnabled
                            ? `Rotação ativa com ${activeHeroImages.length} foto(s) selecionada(s) para o sorteio.`
                            : `Modo fixo ativo. A imagem selecionada abaixo permanecerá fixa no topo.`}
                        </span>
                      </div>

                      {isHeroRotationEnabled && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleSelectAllImagesForRotation}
                            className="px-3 py-1 rounded-lg bg-white hover:bg-slate-50 text-slate-800 text-[11px] font-black border border-slate-300 transition cursor-pointer shadow-2xs"
                          >
                            ✓ Marcar Todas ({PRESET_HERO_BACKGROUNDS.filter(p => !deletedHeroPresets.includes(p.id)).length + customHeroImages.length})
                          </button>
                          <button
                            type="button"
                            onClick={handleResetToDefaultRotation}
                            className="px-3 py-1 rounded-lg bg-white hover:bg-slate-50 text-slate-800 text-[11px] font-black border border-slate-300 transition cursor-pointer shadow-2xs"
                          >
                            {deletedHeroPresets.length > 0 ? `Restaurar Padrão (${deletedHeroPresets.length} excluídas)` : 'Restaurar Padrão'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Live Interactive Preview Box */}
                  <div className="bg-slate-900 rounded-3xl border border-slate-800 p-4 sm:p-6 text-white shadow-xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3 relative z-20">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-500/30">
                        ● Prévia em Tempo Real da Capa
                      </span>
                      <div className="flex items-center gap-2">
                        {isHeroRotationEnabled && activeHeroImages.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const pool = activeHeroImages;
                              const currentIdx = pool.indexOf(selectedHeroBg);
                              const nextIdx = (currentIdx + 1) % pool.length;
                              setSelectedHeroBg(pool[nextIdx]);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-slate-700 text-[11px] font-bold transition cursor-pointer flex items-center gap-1"
                            title="Alternar entre as imagens selecionadas na rotação para testar"
                          >
                            <span>🎲</span>
                            <span>Testar Próxima Foto</span>
                          </button>
                        )}
                        <span className="text-xs text-slate-400 font-medium truncate max-w-xs">
                          {selectedHeroBg ? (selectedHeroBg.startsWith('data:') ? 'Foto personalizada carregada' : selectedHeroBg) : 'Nenhuma imagem definida'}
                        </span>
                      </div>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden min-h-[200px] sm:min-h-[240px] flex items-center p-6 border border-slate-700/80">
                      {/* Background image preview without distortion */}
                      {selectedHeroBg ? (
                        <img 
                          src={selectedHeroBg}
                          alt="Prévia da capa"
                          className="absolute inset-0 w-full h-full object-cover object-center z-0 select-none"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-center p-6 z-0">
                          <Sparkles className="w-8 h-8 text-amber-400 mb-2 opacity-80" />
                          <span className="text-sm font-black text-white">Nenhuma foto selecionada para a capa</span>
                          <span className="text-xs text-slate-400 max-w-sm mt-1">
                            Envie a sua foto no formulário de upload abaixo ou clique em "Restaurar Padrão" para reativar as fotos originais.
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/25 to-transparent z-10" />

                      <div className="relative z-20 space-y-2 max-w-md">
                        <h4 className="text-2xl font-black font-heading leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                          Conectando você ao melhor de <span className="text-amber-400">Algodoal</span>
                        </h4>
                        <p className="text-xs text-white font-medium drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
                          Tudo que você precisa para aproveitar a Ilha de Maiandeua.
                        </p>
                        <div className="bg-white/90 text-slate-500 text-xs px-4 py-2 rounded-full font-medium w-full max-w-xs shadow-md">
                          🔍 Buscar charretes, pousadas, peixadas...
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gallery of Images (Native Presets + Custom Uploads) with Rotation Checkboxes */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    {(() => {
                      const availablePresets = PRESET_HERO_BACKGROUNDS.filter(p => !deletedHeroPresets.includes(p.id));
                      const totalAvailable = availablePresets.length + customHeroImages.length;
                      const validUrls = [...availablePresets.map(p => p.url), ...customHeroImages.map(c => c.url)];
                      const activeValidCount = activeHeroImages.filter(u => validUrls.includes(u)).length;

                      return (
                        <>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                                <span>🏖️</span>
                                <span>Galeria de Imagens da Ilha</span>
                              </h4>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {isHeroRotationEnabled
                                  ? 'Marque/desmarque as caixas de seleção para definir quais fotos farão parte da rotação a cada atualização.'
                                  : 'Clique na foto desejada para defini-la como fundo fixo permanente da capa.'}
                              </p>
                            </div>
                            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 shrink-0">
                              {activeValidCount} de {totalAvailable} ativas na rotação
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                            {totalAvailable === 0 ? (
                              <div className="col-span-full p-8 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
                                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3">
                                  <Sparkles className="w-6 h-6 text-amber-600" />
                                </div>
                                <h5 className="text-sm font-black text-slate-800">Todas as fotos da galeria foram removidas</h5>
                                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                                  A galeria está vazia. Você pode enviar a sua foto em alta resolução no campo abaixo para definir a nova capa, ou restaurar as fotos padrão da plataforma a qualquer momento.
                                </p>
                                <button
                                  type="button"
                                  onClick={handleResetToDefaultRotation}
                                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-sm transition cursor-pointer"
                                >
                                  Restaurar Fotos Padrão da Ilha
                                </button>
                              </div>
                            ) : (
                              <>
                                {/* 1. Native Preset Images */}
                                {availablePresets.map((preset) => {
                                  const isInRotation = activeHeroImages.includes(preset.url);
                                  const isCurrentlyPreviewed = selectedHeroBg === preset.url;

                                  return (
                                    <div
                                      key={preset.id}
                                      onClick={() => {
                                        setSelectedHeroBg(preset.url);
                                        if (isHeroRotationEnabled) {
                                          handleToggleImageInRotation(preset.url);
                                        } else {
                                          handleSaveHeroFullSettings(preset.url, false, [preset.url], customHeroImages, deletedHeroPresets);
                                        }
                                      }}
                                      className={`group rounded-2xl border-2 transition p-3 cursor-pointer flex flex-col justify-between overflow-hidden relative ${
                                        isInRotation
                                          ? 'border-amber-500 bg-amber-50/40 shadow-sm ring-2 ring-amber-400/20'
                                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/70 hover:bg-white opacity-70'
                                      }`}
                                    >
                                      <div className="relative h-32 w-full rounded-xl overflow-hidden mb-2.5">
                                        <img
                                          src={preset.url}
                                          alt={preset.name}
                                          className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                                        />
                                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 text-white text-[10px] font-bold backdrop-blur-xs">
                                          {preset.tag}
                                        </span>

                                        {/* Checkbox / Active Status Badge */}
                                        <div className="absolute top-2 right-2">
                                          {isHeroRotationEnabled ? (
                                            <div
                                              className={`w-6 h-6 rounded-lg flex items-center justify-center transition shadow-md ${
                                                isInRotation
                                                  ? 'bg-amber-500 text-slate-950'
                                                  : 'bg-black/60 text-white/40 border border-white/30'
                                              }`}
                                            >
                                              {isInRotation && <Check className="w-4 h-4 stroke-[3]" />}
                                            </div>
                                          ) : (
                                            isCurrentlyPreviewed && (
                                              <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shadow-md">
                                                <Check className="w-4 h-4 stroke-[3]" />
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </div>

                                      <div>
                                        <div className="flex items-center justify-between gap-1">
                                          <h5 className="text-xs font-black text-slate-900 leading-tight line-clamp-1">
                                            {preset.name}
                                          </h5>
                                        </div>
                                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                                          {preset.subtitle}
                                        </p>
                                      </div>

                                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                                        <span className={`text-[11px] font-bold ${isInRotation ? 'text-amber-700' : 'text-slate-400'}`}>
                                          {isInRotation ? '✓ Incluída na Rotação' : '✕ Fora da Rotação'}
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-[10px] text-slate-400 font-medium">Nativa da Ilha</span>
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeletePresetHeroImage(preset.id, preset.name, preset.url);
                                            }}
                                            className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                                            title="Excluir esta foto da galeria"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}

                                {/* 2. Custom Uploaded Images */}
                                {customHeroImages.map((custom) => {
                                  const isInRotation = activeHeroImages.includes(custom.url);
                                  const isCurrentlyPreviewed = selectedHeroBg === custom.url;

                                  return (
                                    <div
                                      key={custom.id}
                                      className={`group rounded-2xl border-2 transition p-3 flex flex-col justify-between overflow-hidden relative ${
                                        isInRotation
                                          ? 'border-amber-500 bg-amber-50/40 shadow-sm ring-2 ring-amber-400/20'
                                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/70 hover:bg-white opacity-70'
                                      }`}
                                    >
                                      <div 
                                        className="relative h-32 w-full rounded-xl overflow-hidden mb-2.5 cursor-pointer"
                                        onClick={() => {
                                          setSelectedHeroBg(custom.url);
                                          if (isHeroRotationEnabled) {
                                            handleToggleImageInRotation(custom.url);
                                          } else {
                                            handleSaveHeroFullSettings(custom.url, false, [custom.url], customHeroImages, deletedHeroPresets);
                                          }
                                        }}
                                      >
                                        <img
                                          src={custom.url}
                                          alt={custom.name}
                                          className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                                        />
                                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-indigo-950/80 text-white text-[10px] font-bold backdrop-blur-xs">
                                          {custom.tag || '📸 Enviada'}
                                        </span>

                                        {/* Checkbox / Active Status Badge */}
                                        <div className="absolute top-2 right-2">
                                          {isHeroRotationEnabled ? (
                                            <div
                                              className={`w-6 h-6 rounded-lg flex items-center justify-center transition shadow-md ${
                                                isInRotation
                                                  ? 'bg-amber-500 text-slate-950'
                                                  : 'bg-black/60 text-white/40 border border-white/30'
                                              }`}
                                            >
                                              {isInRotation && <Check className="w-4 h-4 stroke-[3]" />}
                                            </div>
                                          ) : (
                                            isCurrentlyPreviewed && (
                                              <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shadow-md">
                                                <Check className="w-4 h-4 stroke-[3]" />
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </div>

                                      <div 
                                        className="cursor-pointer"
                                        onClick={() => {
                                          setSelectedHeroBg(custom.url);
                                          if (isHeroRotationEnabled) {
                                            handleToggleImageInRotation(custom.url);
                                          } else {
                                            handleSaveHeroFullSettings(custom.url, false, [custom.url], customHeroImages, deletedHeroPresets);
                                          }
                                        }}
                                      >
                                        <h5 className="text-xs font-black text-slate-900 leading-tight line-clamp-1">
                                          {custom.name}
                                        </h5>
                                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                                          {custom.subtitle || 'Foto enviada pelo administrador'}
                                        </p>
                                      </div>

                                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                                        <span className={`text-[11px] font-bold ${isInRotation ? 'text-amber-700' : 'text-slate-400'}`}>
                                          {isInRotation ? '✓ Incluída na Rotação' : '✕ Fora da Rotação'}
                                        </span>

                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteCustomHeroImage(custom.id, custom.name);
                                          }}
                                          className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                                          title="Excluir esta foto da galeria"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Upload New Custom Photo to Gallery (No Direct URL input as requested) */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 mb-1 flex items-center gap-2">
                        <UploadCloud className="w-4 h-4 text-amber-600" />
                        <span>Enviar Nova Foto para a Galeria da Capa</span>
                      </h4>
                      <p className="text-xs text-slate-500 mb-4">
                        Adicione fotos de alta resolução da Ilha de Algodoal (praias, pousadas, passeios de barco ou pôr do sol). A imagem será adicionada à galeria e automaticamente incluída na rotação.
                      </p>
                    </div>

                    {/* GUIA DE TAMANHO E QUALIDADE DE IMAGEM */}
                    <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-amber-50/80 via-sky-50/60 to-emerald-50/80 border border-amber-200/70 text-slate-800">
                      <div className="flex items-center gap-2 mb-2 text-xs font-black uppercase tracking-wider text-amber-950">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span>Recomendações para a Imagem Ficar Perfeita e Sem Distorção</span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs mt-3">
                        <div className="bg-white/90 p-3 rounded-xl border border-amber-200/60 shadow-2xs">
                          <span className="text-[10px] font-black uppercase text-amber-700 block">📐 Tamanho Recomendado</span>
                          <p className="font-extrabold text-slate-900 mt-0.5">1920 × 800 px</p>
                          <span className="text-[10px] text-slate-500 block">Mínimo: 1600 × 700 px (Panorâmica)</span>
                        </div>

                        <div className="bg-white/90 p-3 rounded-xl border border-sky-200/60 shadow-2xs">
                          <span className="text-[10px] font-black uppercase text-sky-700 block">🔄 Proporção Ideal</span>
                          <p className="font-extrabold text-slate-900 mt-0.5">16:9 ou 21:9 (Horizontal)</p>
                          <span className="text-[10px] text-slate-500 block">Evite fotos em pé (verticais de celular)</span>
                        </div>

                        <div className="bg-white/90 p-3 rounded-xl border border-emerald-200/60 shadow-2xs">
                          <span className="text-[10px] font-black uppercase text-emerald-700 block">💾 Formato & Peso</span>
                          <p className="font-extrabold text-slate-900 mt-0.5">WebP ou JPG (300KB a 2MB)</p>
                          <span className="text-[10px] text-slate-500 block">Qualidade 85% a 92% para carregar rápido</span>
                        </div>

                        <div className="bg-white/90 p-3 rounded-xl border border-purple-200/60 shadow-2xs">
                          <span className="text-[10px] font-black uppercase text-purple-700 block">🎯 Enquadramento</span>
                          <p className="font-extrabold text-slate-900 mt-0.5">Horizonte Centralizado</p>
                          <span className="text-[10px] text-slate-500 block">Mantenha o assunto na faixa central</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-amber-200/50 flex items-start gap-2 text-[11px] text-slate-700">
                        <span className="font-bold text-amber-800 shrink-0">💡 Por que a imagem distorce?</span>
                        <span>
                          Se a foto for vertical (tirada em pé no celular) ou quadrada (1:1), o navegador precisa cortar até 70% da altura e dar zoom no centro para cobrir a largura da tela do computador, causando corte de cabeças ou pixelamento. Use sempre fotos tiradas com o celular deitado (horizontal) com boa luz natural.
                        </span>
                      </div>
                    </div>

                    <label
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsHeroBgDragOver(true);
                      }}
                      onDragLeave={() => setIsHeroBgDragOver(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsHeroBgDragOver(false);
                        if (e.dataTransfer.files?.[0]) {
                          handleHeroBgFileUpload(e.dataTransfer.files[0]);
                        }
                      }}
                      className={`w-full border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2.5 ${
                        isHeroBgDragOver
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-slate-300 hover:border-amber-400 bg-slate-50 hover:bg-white'
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleHeroBgFileUpload(e.target.files[0]);
                          }
                        }}
                      />
                      <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs">
                        {isUploadingHeroBgFile ? (
                          <RefreshCw className="w-6 h-6 animate-spin" />
                        ) : (
                          <UploadCloud className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-800 block">
                          {isUploadingHeroBgFile ? 'Processando e enviando imagem...' : 'Clique para selecionar do computador ou arraste a foto aqui'}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          Formatos aceitos: JPG, PNG, WebP (Recomendado: 1920x800 ou horizontal)
                        </span>
                      </div>
                    </label>
                  </div>

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
                              {(() => {
                                const isStoryActive = story.active !== undefined 
                                  ? story.active 
                                  : (story.is_active !== undefined ? story.is_active : true);
                                return (
                                  <button
                                    onClick={() => handleToggleStoryActive(story)}
                                    className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border transition cursor-pointer shrink-0 ${
                                      isStoryActive
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                        : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                                    }`}
                                    title={isStoryActive ? 'Clique para pausar este destaque' : 'Clique para ativar este destaque'}
                                  >
                                    {isStoryActive ? '● Ativo' : '○ Pausado'}
                                  </button>
                                );
                              })()}
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
                    </div>
                  </div>

                  {/* Status checkboxes */}
                  <div className="space-y-2 pt-2">
                    <div className="pt-2">
                      <label className="block text-xs font-black uppercase text-slate-800 mb-1.5">
                        Plano Comercial do Estabelecimento *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setCurrentPartner(prev => ({ ...prev, plan_type: 'mensal', verified: true }))}
                          className={`p-2.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                            (currentPartner.plan_type === 'mensal' || (!currentPartner.plan_type && (currentPartner.category === 'pousadas' || currentPartner.category === 'alimentacao')))
                              ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-400'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-amber-950">Plano Mensal</span>
                              <span className="text-sm">🏆</span>
                            </div>
                            <span className="text-[10px] font-black text-amber-700 block mt-0.5">R$ 30 /mês</span>
                          </div>
                          <span className="text-[9px] text-slate-500 mt-2 block leading-tight">
                            Banner Topo + 1º Lugar + Saiba Mais + WhatsApp
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCurrentPartner(prev => ({ ...prev, plan_type: 'free', verified: false }))}
                          className={`p-2.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                            currentPartner.plan_type === 'free' || (!currentPartner.plan_type && currentPartner.category !== 'pousadas' && currentPartner.category !== 'alimentacao' && currentPartner.category !== 'eventos')
                              ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-400'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-slate-900">Plano Free</span>
                              <span className="text-sm">🏪</span>
                            </div>
                            <span className="text-[10px] font-black text-emerald-700 block mt-0.5">Grátis</span>
                          </div>
                          <span className="text-[9px] text-slate-500 mt-2 block leading-tight">
                            Anúncio menor na categoria + WhatsApp
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCurrentPartner(prev => ({ ...prev, plan_type: 'divulgacao', verified: false }))}
                          className={`p-2.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                            currentPartner.plan_type === 'divulgacao' || (!currentPartner.plan_type && currentPartner.category === 'eventos')
                              ? 'border-purple-500 bg-purple-50/80 ring-2 ring-purple-400'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-purple-950">Divulgação</span>
                              <span className="text-sm">🎉</span>
                            </div>
                            <span className="text-[10px] font-black text-purple-700 block mt-0.5">Grátis</span>
                          </div>
                          <span className="text-[9px] text-slate-500 mt-2 block leading-tight">
                            Banner rotativo para shows, luau e artesanato
                          </span>
                        </button>
                      </div>
                    </div>

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
                        checked={currentPartner.verified ?? (currentPartner.plan_type === 'mensal')}
                        onChange={(e) => setCurrentPartner(prev => ({ ...prev, verified: e.target.checked }))}
                        className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                      />
                      <label htmlFor="partner_verified_toggle" className="text-xs font-black text-slate-900 cursor-pointer flex items-center gap-1">
                        <span>Destaque Especial (1º Lugar da Categoria / Plano Mensal)</span>
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 inline" />
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
                          <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                            <Sparkles className="w-3 h-3" />
                            <span>Destaque</span>
                          </span>
                        )}
                      </div>

                      <div className="p-4 space-y-2.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">
                          {currentPartner.category || 'Estabelecimento'}
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
                  onClick={handleCloseAdModal}
                  className="p-1 rounded-full text-slate-400 hover:text-white"
                  title="Fechar e cancelar (remove fotos temporárias)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form & Live Preview Grid */}
              <form id="ad-edit-form" onSubmit={handleSaveAd} className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50">
                
                {/* PROMINENT ERROR BANNER */}
                {adFormError && (
                  <div className="lg:col-span-12 p-4 rounded-2xl bg-rose-50 border-2 border-rose-400 text-rose-950 shadow-sm animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-rose-200 text-rose-800 shrink-0 mt-0.5">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-black text-rose-900">
                          Aviso ao Salvar Anúncio
                        </h4>
                        <p className="text-xs font-semibold text-rose-800 mt-1 whitespace-pre-wrap">
                          {adFormError}
                        </p>
                        {tempUploadedImageUrl && (
                          <div className="mt-3 pt-2.5 border-t border-rose-200 flex flex-wrap items-center justify-between gap-2">
                            <span className="text-[11px] text-rose-700">
                              🛡️ <strong>Sua foto está segura:</strong> O upload foi mantido para você não perder tempo. Caso deseje desistir ou trocar de foto, você pode removê-la do servidor agora:
                            </span>
                            <button
                              type="button"
                              onClick={handleManualImageRollback}
                              className="text-[11px] font-black text-rose-900 hover:text-white bg-rose-200 hover:bg-rose-700 px-3 py-1.5 rounded-lg transition cursor-pointer"
                            >
                              Remover Foto do Servidor (Rollback)
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Fields (Col 7) */}
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                      Título do Anúncio <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Peixada com Jambu no Restaurante O Marujo"
                      value={currentAd.title || ''}
                      onChange={(e) => {
                        setCurrentAd(prev => ({ ...prev, title: e.target.value }));
                        if (adValidationErrors.title) {
                          setAdValidationErrors(prev => {
                            const next = { ...prev };
                            delete next.title;
                            return next;
                          });
                        }
                      }}
                      className={`w-full p-2.5 rounded-xl border text-xs font-semibold text-slate-900 bg-white transition ${
                        adValidationErrors.title
                          ? 'border-rose-500 bg-rose-50/30 focus:ring-2 focus:ring-rose-400'
                          : 'border-slate-300 focus:ring-2 focus:ring-amber-400'
                      }`}
                    />
                    {adValidationErrors.title && (
                      <p className="mt-1 text-[11px] font-bold text-rose-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {adValidationErrors.title}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                        Nome do Estabelecimento <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Restaurante O Marujo"
                        value={currentAd.business_name || ''}
                        onChange={(e) => {
                          setCurrentAd(prev => ({ ...prev, business_name: e.target.value }));
                          if (adValidationErrors.business_name) {
                            setAdValidationErrors(prev => {
                              const next = { ...prev };
                              delete next.business_name;
                              return next;
                            });
                          }
                        }}
                        className={`w-full p-2.5 rounded-xl border text-xs font-semibold text-slate-900 bg-white transition ${
                          adValidationErrors.business_name
                            ? 'border-rose-500 bg-rose-50/30 focus:ring-2 focus:ring-rose-400'
                            : 'border-slate-300 focus:ring-2 focus:ring-amber-400'
                        }`}
                      />
                      {adValidationErrors.business_name && (
                        <p className="mt-1 text-[11px] font-bold text-rose-600 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {adValidationErrors.business_name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                        Categoria do Site <span className="text-rose-600">*</span>
                      </label>
                      <select
                        value={currentAd.category || 'alimentacao'}
                        onChange={(e) => {
                          setCurrentAd(prev => ({ ...prev, category: e.target.value as any }));
                          if (adValidationErrors.category) {
                            setAdValidationErrors(prev => {
                              const next = { ...prev };
                              delete next.category;
                              return next;
                            });
                          }
                        }}
                        className={`w-full p-2.5 rounded-xl border text-xs font-bold text-slate-900 bg-white transition ${
                          adValidationErrors.category
                            ? 'border-rose-500 bg-rose-50/30 focus:ring-2 focus:ring-rose-400'
                            : 'border-slate-300 focus:ring-2 focus:ring-amber-400'
                        }`}
                      >
                        <option value="transporte">🚖 Transporte & Charretes</option>
                        <option value="pousadas">🏨 Pousadas & Chalés</option>
                        <option value="passeios">⛵ Passeios & Rabetas</option>
                        <option value="alimentacao">🍲 Alimentação & Restaurantes</option>
                        <option value="compras">🛍️ Compras & Depósito</option>
                        <option value="eventos">🎉 Eventos & Cultura</option>
                        <option value="informacoes">ℹ️ Guia da Ilha</option>
                      </select>
                      {adValidationErrors.category && (
                        <p className="mt-1 text-[11px] font-bold text-rose-600 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {adValidationErrors.category}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                      Descrição Completa <span className="text-rose-600">*</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Detalhes sobre a oferta, localização, diferenciais e horários..."
                      value={currentAd.description || ''}
                      onChange={(e) => {
                        setCurrentAd(prev => ({ ...prev, description: e.target.value }));
                        if (adValidationErrors.description) {
                          setAdValidationErrors(prev => {
                            const next = { ...prev };
                            delete next.description;
                            return next;
                          });
                        }
                      }}
                      className={`w-full p-2.5 rounded-xl border text-xs font-semibold text-slate-900 bg-white transition ${
                        adValidationErrors.description
                          ? 'border-rose-500 bg-rose-50/30 focus:ring-2 focus:ring-rose-400'
                          : 'border-slate-300 focus:ring-2 focus:ring-amber-400'
                      }`}
                    />
                    {adValidationErrors.description && (
                      <p className="mt-1 text-[11px] font-bold text-rose-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {adValidationErrors.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                        WhatsApp (apenas números com DDD) <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="5591983342211"
                        value={currentAd.whatsapp || ''}
                        onChange={(e) => {
                          setCurrentAd(prev => ({ ...prev, whatsapp: e.target.value.replace(/\D/g, '') }));
                          if (adValidationErrors.whatsapp) {
                            setAdValidationErrors(prev => {
                              const next = { ...prev };
                              delete next.whatsapp;
                              return next;
                            });
                          }
                        }}
                        className={`w-full p-2.5 rounded-xl border text-xs font-semibold text-slate-900 bg-white transition ${
                          adValidationErrors.whatsapp
                            ? 'border-rose-500 bg-rose-50/30 focus:ring-2 focus:ring-rose-400'
                            : 'border-slate-300 focus:ring-2 focus:ring-amber-400'
                        }`}
                      />
                      {adValidationErrors.whatsapp && (
                        <p className="mt-1 text-[11px] font-bold text-rose-600 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {adValidationErrors.whatsapp}
                        </p>
                      )}
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
                      Localização na Ilha <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Praia da Princesa, Barraca 04"
                      value={currentAd.location || ''}
                      onChange={(e) => {
                        setCurrentAd(prev => ({ ...prev, location: e.target.value }));
                        if (adValidationErrors.location) {
                          setAdValidationErrors(prev => {
                            const next = { ...prev };
                            delete next.location;
                            return next;
                          });
                        }
                      }}
                      className={`w-full p-2.5 rounded-xl border text-xs font-semibold text-slate-900 bg-white transition ${
                        adValidationErrors.location
                          ? 'border-rose-500 bg-rose-50/30 focus:ring-2 focus:ring-rose-400'
                          : 'border-slate-300 focus:ring-2 focus:ring-amber-400'
                      }`}
                    />
                    {adValidationErrors.location && (
                      <p className="mt-1 text-[11px] font-bold text-rose-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {adValidationErrors.location}
                      </p>
                    )}
                  </div>

                  {/* Image Upload Section */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <label className="block text-xs font-black uppercase text-slate-800">
                      Foto / Imagem do Anúncio <span className="text-rose-600">*</span>
                    </label>

                    {/* Server status alert if temp uploaded */}
                    {tempUploadedImageUrl && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          Foto carregada com sucesso no servidor
                        </span>
                        <button
                          type="button"
                          onClick={handleManualImageRollback}
                          className="text-[11px] font-bold text-rose-700 hover:text-rose-900 bg-rose-100 hover:bg-rose-200 px-2.5 py-1 rounded-lg transition cursor-pointer"
                        >
                          Descartar foto
                        </button>
                      </div>
                    )}

                    {/* Trava visual quando campos obrigatórios ainda não foram preenchidos */}
                    {(!currentAd.title?.trim() || !currentAd.business_name?.trim()) ? (
                      <div
                        onClick={() => {
                          const missing: string[] = [];
                          if (!currentAd.title?.trim()) missing.push('Título do Anúncio');
                          if (!currentAd.business_name?.trim()) missing.push('Nome do Estabelecimento');

                          setAdFormError(`⚠️ Upload Bloqueado: Preencha o ${missing.join(' e o ')} antes de carregar a foto do anúncio.\nEsta validação protege o servidor contra fotos órfãs caso o cadastro seja interrompido.`);
                          setAdValidationErrors(prev => ({
                            ...prev,
                            ...(!currentAd.title?.trim() ? { title: 'Preencha o título antes de carregar a foto.' } : {}),
                            ...(!currentAd.business_name?.trim() ? { business_name: 'Preencha o nome do estabelecimento antes de carregar a foto.' } : {})
                          }));
                          const formEl = document.getElementById('ad-edit-form');
                          if (formEl) formEl.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="border-2 border-dashed border-amber-300 bg-amber-50/70 hover:bg-amber-100/80 rounded-2xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2"
                      >
                        <div className="w-12 h-12 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center shadow-xs">
                          <Lock className="w-6 h-6" />
                        </div>
                        <div className="text-sm font-black text-amber-950">
                          Upload de Foto Bloqueado
                        </div>
                        <p className="text-xs font-semibold text-amber-800 max-w-sm">
                          Preencha primeiro o <strong>Título</strong> e o <strong>Nome do Estabelecimento</strong> acima para liberar o envio da foto.
                        </p>
                        <span className="text-[11px] font-bold text-amber-700 underline mt-1">
                          Clique aqui para preencher os campos obrigatórios
                        </span>
                      </div>
                    ) : (
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
                            adValidationErrors.image_url
                              ? 'border-rose-400 bg-rose-50/20'
                              : isDragOver
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

                        {adValidationErrors.image_url && (
                          <p className="mt-1 text-[11px] font-bold text-rose-600 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {adValidationErrors.image_url}
                          </p>
                        )}
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
                      </div>

                      <div className="p-4 space-y-2">
                        <span className="text-[10px] font-bold uppercase text-amber-700 block">
                          {currentAd.business_name || 'Nome do Estabelecimento'}
                        </span>
                        <h5 className="text-sm font-black text-slate-900">
                          {currentAd.title || 'Título do Anúncio'}
                        </h5>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {currentAd.description || 'Descrição prévia do anúncio...'}
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
                      onClick={handleCloseAdModal}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      disabled={isSavingAd}
                      className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:bg-slate-300 disabled:cursor-not-allowed text-slate-950 font-black text-xs transition shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      {isSavingAd ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Salvando no banco...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Salvar Anúncio</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
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
