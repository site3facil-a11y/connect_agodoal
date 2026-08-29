import React, { useState, useEffect } from 'react';
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
  FileText
} from 'lucide-react';
import { Advertisement, AdCategory, TideDayEntry, Partner, UserProfile } from '../types/index.ts';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData?: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'anuncios' | 'mares' | 'parceiros' | 'metricas'>('anuncios');
  
  // Data states
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [tideDays, setTideDays] = useState<TideDayEntry[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // Ad Filter & Search
  const [adFilterCategory, setAdFilterCategory] = useState<string>('todos');
  const [adSearchTerm, setAdSearchTerm] = useState('');

  // Ad Form Modal state
  const [isEditingAd, setIsEditingAd] = useState(false);
  const [currentAd, setCurrentAd] = useState<Partial<Advertisement>>({
    category: 'restaurante',
    banner_slot: 'nenhum',
    is_active: true,
    is_highlighted: true,
    start_date: new Date().toISOString().split('T')[0],
    end_date: '2026-12-31',
    price_starting: 0
  });

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

  useEffect(() => {
    if (isOpen) {
      loadAllAdminData();
    }
  }, [isOpen]);

  const loadAllAdminData = async () => {
    setIsLoading(true);
    try {
      // Load Ads (both active and inactive)
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
    } catch (err) {
      console.error('Erro ao carregar dados do admin:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const showSuccess = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 4000);
  };

  // ==========================
  // AD ACTIONS
  // ==========================
  const handleToggleAdActive = async (ad: Advertisement) => {
    try {
      const res = await fetch(`/api/advertisements/${ad.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !ad.is_active })
      });
      if (res.ok) {
        setAds(prev => prev.map(a => a.id === ad.id ? { ...a, is_active: !a.is_active } : a));
        showSuccess(`Anúncio "${ad.title}" agora está ${!ad.is_active ? 'ATIVO' : 'INATIVO'}.`);
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAd = async (id: string, title: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o anúncio "${title}"?`)) return;
    try {
      const res = await fetch(`/api/advertisements/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAds(prev => prev.filter(a => a.id !== id));
        showSuccess('Anúncio excluído com sucesso.');
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      console.error(err);
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
        // Edit
        const res = await fetch(`/api/advertisements/${currentAd.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentAd)
        });
        const updated = await res.json();
        setAds(prev => prev.map(a => a.id === updated.id ? updated : a));
        showSuccess('Anúncio atualizado com sucesso!');
      } else {
        // Create
        const res = await fetch('/api/advertisements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentAd)
        });
        const created = await res.json();
        setAds(prev => [created, ...prev]);
        showSuccess('Novo anúncio cadastrado e veiculado!');
      }
      setIsEditingAd(false);
      setCurrentAd({});
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error(err);
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
        // Example format: 2026-08-27, Cheia, 88, 04:12, 4.2m, 16:38, 4.4m, 10:25, 0.4m, 22:50, 0.5m
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

  if (!isOpen) return null;

  const filteredAds = ads.filter(ad => {
    const matchesCat = adFilterCategory === 'todos' || ad.category === adFilterCategory;
    const matchesSearch = !adSearchTerm || 
      ad.title.toLowerCase().includes(adSearchTerm.toLowerCase()) ||
      ad.business_name.toLowerCase().includes(adSearchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white text-slate-900 rounded-3xl max-w-6xl w-full h-[90vh] max-h-[850px] shadow-2xl border border-sky-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black font-heading text-white">
                  Painel Administrativo Algodoal Connect
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Gerenciamento de Anúncios, Tábua de Marés de Marapanim, Pousadas e Métricas da Ilha
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {actionSuccess && (
          <div className="bg-emerald-600 text-white px-6 py-2 text-xs font-bold flex items-center justify-between animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess('')} className="cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex bg-slate-100 border-b border-slate-200 px-6 pt-2 gap-2 overflow-x-auto text-xs font-black">
          <button
            onClick={() => setActiveTab('anuncios')}
            className={`py-3 px-4 rounded-t-xl border-b-2 flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'anuncios'
                ? 'border-amber-500 bg-white text-amber-950 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Megaphone className="w-4 h-4 text-amber-600" />
            <span>Gerenciar Anúncios & Banners ({ads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('mares')}
            className={`py-3 px-4 rounded-t-xl border-b-2 flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'mares'
                ? 'border-sky-500 bg-white text-sky-950 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Waves className="w-4 h-4 text-sky-600" />
            <span>Tábua de Marés (Marapanim / Marinha)</span>
          </button>

          <button
            onClick={() => setActiveTab('parceiros')}
            className={`py-3 px-4 rounded-t-xl border-b-2 flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'parceiros'
                ? 'border-emerald-500 bg-white text-emerald-950 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Hotel className="w-4 h-4 text-emerald-600" />
            <span>Pousadas & Estabelecimentos ({partners.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('metricas')}
            className={`py-3 px-4 rounded-t-xl border-b-2 flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'metricas'
                ? 'border-indigo-500 bg-white text-indigo-950 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Eye className="w-4 h-4 text-indigo-600" />
            <span>Métricas & Usuários ({users.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          
          {/* ======================================================== */}
          {/* TAB 1: GESTÃO DE ANÚNCIOS & BANNERS                      */}
          {/* ======================================================== */}
          {activeTab === 'anuncios' && (
            <div className="space-y-6">
              
              {/* Actions & Filters */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar anúncio ou comércio..."
                      value={adSearchTerm}
                      onChange={(e) => setAdSearchTerm(e.target.value)}
                      className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <select
                    value={adFilterCategory}
                    onChange={(e) => setAdFilterCategory(e.target.value)}
                    className="py-1.5 px-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-slate-50 focus:bg-white"
                  >
                    <option value="todos">Todas Categorias</option>
                    <option value="restaurante">Restaurantes</option>
                    <option value="pousada">Pousadas</option>
                    <option value="passeio">Passeios</option>
                    <option value="transporte">Transporte (Charrete / Barco)</option>
                    <option value="evento">Eventos</option>
                    <option value="compras">Compras & Água/Gás</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setCurrentAd({
                      category: 'restaurante',
                      banner_slot: 'nenhum',
                      is_active: true,
                      is_highlighted: true,
                      start_date: new Date().toISOString().split('T')[0],
                      end_date: '2026-12-31',
                      price_starting: 0
                    });
                    setIsEditingAd(true);
                  }}
                  className="py-2 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-sm transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Anúncio / Banner</span>
                </button>
              </div>

              {/* Ads Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 font-black uppercase text-[11px] border-b border-slate-200">
                        <th className="py-3 px-4">Anúncio / Negócio</th>
                        <th className="py-3 px-4">Categoria</th>
                        <th className="py-3 px-4">Slot do Banner</th>
                        <th className="py-3 px-4">Período de Veiculação</th>
                        <th className="py-3 px-4 text-center">Visualizações</th>
                        <th className="py-3 px-4 text-center">Cliques / WhatsApp</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAds.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-slate-400 font-semibold">
                            Nenhum anúncio cadastrado nesta categoria.
                          </td>
                        </tr>
                      ) : (
                        filteredAds.map((ad) => (
                          <tr key={ad.id} className="hover:bg-slate-50 transition">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={ad.image_url}
                                  alt={ad.title}
                                  className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                                />
                                <div>
                                  <div className="font-bold text-slate-900 line-clamp-1">{ad.title}</div>
                                  <div className="text-[11px] text-slate-500 font-semibold">{ad.business_name} • {ad.location}</div>
                                  {ad.badge && (
                                    <span className="inline-block mt-0.5 text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-100 text-amber-900">
                                      {ad.badge}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center gap-1 font-bold text-slate-700 capitalize bg-slate-100 px-2 py-0.5 rounded-md">
                                {ad.category}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-block font-black text-[10px] uppercase px-2 py-0.5 rounded-full ${
                                ad.banner_slot === 'banner_1' ? 'bg-sky-100 text-sky-800' :
                                ad.banner_slot === 'banner_2' ? 'bg-amber-100 text-amber-800' :
                                ad.banner_slot === 'banner_3' ? 'bg-emerald-100 text-emerald-800' :
                                ad.banner_slot === 'banner_4' ? 'bg-purple-100 text-purple-800' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {ad.banner_slot === 'nenhum' ? 'Feed Comum' : ad.banner_slot.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-600 text-[11px]">
                              <div>{ad.start_date || 'Início imediato'}</div>
                              <div className="text-slate-400">até {ad.end_date || 'Indeterminado'}</div>
                            </td>
                            <td className="py-3 px-4 text-center font-bold text-slate-700">
                              <div className="flex items-center justify-center gap-1">
                                <Eye className="w-3.5 h-3.5 text-slate-400" />
                                <span>{ad.views_count || 0}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center font-bold text-emerald-700">
                              <div className="flex items-center justify-center gap-1">
                                <MousePointerClick className="w-3.5 h-3.5 text-emerald-500" />
                                <span>{ad.clicks_count || 0}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => handleToggleAdActive(ad)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase transition cursor-pointer ${
                                  ad.is_active
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                                }`}
                              >
                                {ad.is_active ? '● Ativo' : '○ Inativo'}
                              </button>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => {
                                    setCurrentAd(ad);
                                    setIsEditingAd(true);
                                  }}
                                  className="p-1.5 rounded-lg text-slate-600 hover:text-amber-700 hover:bg-amber-50 transition cursor-pointer"
                                  title="Editar anúncio"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteAd(ad.id, ad.title)}
                                  className="p-1.5 rounded-lg text-slate-600 hover:text-red-700 hover:bg-red-50 transition cursor-pointer"
                                  title="Excluir anúncio"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: TÁBUA DE MARÉS (MARAPANIM / MARINHA DO BRASIL)    */}
          {/* ======================================================== */}
          {activeTab === 'mares' && (
            <div className="space-y-6">
              
              {/* Header Box with Info */}
              <div className="bg-gradient-to-r from-sky-900 to-sky-700 text-white p-5 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/30 text-sky-200 text-[11px] font-black uppercase mb-1">
                    <Waves className="w-3.5 h-3.5 text-sky-300" />
                    <span>Fonte Oficial Hidrográfica</span>
                  </div>
                  <h3 className="text-xl font-black font-heading">
                    Tábua de Marés de Marapanim & Algodoal
                  </h3>
                  <p className="text-xs text-sky-100 max-w-xl mt-0.5">
                    Os horários de maré alta (preamar) e maré baixa (baixa-mar) orientam as saídas de barco em Marudá, passeios de rabeta e caminhadas nas dunas.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleSyncMarapanim}
                    disabled={isLoading}
                    className="py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Sincronizar Marapanim Online</span>
                  </button>

                  <button
                    onClick={() => setIsBulkImportOpen(true)}
                    className="py-2.5 px-3.5 rounded-xl bg-sky-800 hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-1.5 border border-sky-400/30 transition cursor-pointer"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Importar Tabela Marinha</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentTideDay({
                        date: new Date().toISOString().split('T')[0],
                        moon_phase: 'Cheia',
                        coefficient: 85,
                        high_tides: [{ time: '05:00', height: '4.2m' }, { time: '17:30', height: '4.4m' }],
                        low_tides: [{ time: '11:15', height: '0.4m' }, { time: '23:45', height: '0.5m' }],
                        source: 'manual',
                        recommendations: ''
                      });
                      setIsAddingTideDay(true);
                    }}
                    className="py-2.5 px-3.5 rounded-xl bg-white text-slate-900 font-black text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Novo Dia</span>
                  </button>
                </div>
              </div>

              {/* Tides Schedule Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tideDays.map((tide) => (
                  <div key={tide.id || tide.date} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-sky-300 transition">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div>
                        <div className="text-sm font-black text-slate-900 font-heading">
                          {tide.date}
                        </div>
                        <div className="text-[11px] text-slate-500 font-semibold">
                          Lua {tide.moon_phase} • Coef. {tide.coefficient}
                        </div>
                      </div>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                        {tide.source === 'tabuademares_marapanim' ? 'TabuaDeMares' : 'Marinha'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 my-3">
                      <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-100">
                        <div className="text-[10px] font-black uppercase text-sky-800 flex items-center gap-1 mb-1">
                          <Waves className="w-3 h-3 text-sky-600" />
                          <span>Preamar (Alta)</span>
                        </div>
                        {tide.high_tides.map((h, i) => (
                          <div key={i} className="text-xs font-black text-slate-900 flex justify-between">
                            <span>{h.time}</span>
                            <span className="text-sky-700">{h.height}</span>
                          </div>
                        ))}
                      </div>

                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                        <div className="text-[10px] font-black uppercase text-amber-800 flex items-center gap-1 mb-1">
                          <Waves className="w-3 h-3 text-amber-600 rotate-180" />
                          <span>Baixa-mar</span>
                        </div>
                        {tide.low_tides.map((l, i) => (
                          <div key={i} className="text-xs font-black text-slate-900 flex justify-between">
                            <span>{l.time}</span>
                            <span className="text-amber-800">{l.height}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {tide.recommendations && (
                      <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg leading-relaxed">
                        💡 {tide.recommendations}
                      </p>
                    )}
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: POUSADAS & ESTABELECIMENTOS                      */}
          {/* ======================================================== */}
          {activeTab === 'parceiros' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                  <h3 className="text-base font-black text-slate-900">Catálogo de Pousadas e Parceiros Locais</h3>
                  <p className="text-xs text-slate-500">Credencie charreteiros, barqueiros, pousadas e quiosques de Algodoal.</p>
                </div>
                <button
                  onClick={() => setIsAddingPartner(true)}
                  className="py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs flex items-center gap-2 shadow-sm transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Pousada / Parceiro</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {partners.map(p => (
                  <div key={p.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <img src={p.photo_url} alt={p.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-200" />
                        <div>
                          <div className="text-xs font-bold uppercase text-emerald-700">{p.subcategory || p.category}</div>
                          <h4 className="font-black text-sm text-slate-900 line-clamp-1">{p.name}</h4>
                          <div className="text-xs text-slate-500">⭐ {p.rating} ({p.total_reviews} avaliações)</div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-2">{p.description}</p>
                      
                      {p.amenities && p.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {p.amenities.map((am, i) => (
                            <span key={i} className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                              {am}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-black text-slate-900">A partir de R$ {p.price_starting?.toFixed(2)}</span>
                      <span className="text-slate-500 font-semibold">{p.phone}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: MÉTRICAS & USUÁRIOS                               */}
          {/* ======================================================== */}
          {activeTab === 'metricas' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="text-xs font-bold text-slate-500">Total de Anúncios</div>
                  <div className="text-2xl font-black text-amber-600 mt-1">{ads.length}</div>
                  <div className="text-[11px] text-emerald-600 font-bold mt-1">● {ads.filter(a => a.is_active).length} ativos</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="text-xs font-bold text-slate-500">Visualizações de Banners</div>
                  <div className="text-2xl font-black text-sky-600 mt-1">
                    {ads.reduce((acc, a) => acc + (a.views_count || 0), 0)}
                  </div>
                  <div className="text-[11px] text-slate-400 font-semibold mt-1">Impressões totais</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="text-xs font-bold text-slate-500">Cliques & Contatos</div>
                  <div className="text-2xl font-black text-emerald-600 mt-1">
                    {ads.reduce((acc, a) => acc + (a.clicks_count || 0), 0)}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold mt-1">Conversões no WhatsApp</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="text-xs font-bold text-slate-500">Usuários Conectados</div>
                  <div className="text-2xl font-black text-purple-600 mt-1">{users.length}</div>
                  <div className="text-[11px] text-purple-700 font-semibold mt-1">Gmail / Social Login</div>
                </div>
              </div>

              {/* Users List */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                <h4 className="font-black text-sm text-slate-900 mb-3">Usuários Registrados via Social Login</h4>
                <div className="divide-y divide-slate-100">
                  {users.map(u => (
                    <div key={u.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'} className="w-8 h-8 rounded-full" />
                        <div>
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="text-slate-500">{u.email}</div>
                        </div>
                      </div>
                      <span className="font-black uppercase text-[10px] px-2 py-0.5 bg-slate-100 rounded-md text-slate-700">
                        {u.provider} ({u.role})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ======================================================== */}
      {/* MODAL: AD EDIT / CREATE FORM                             */}
      {/* ======================================================== */}
      {isEditingAd && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-amber-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-black font-heading text-slate-900">
                {currentAd.id ? 'Editar Anúncio / Banner' : 'Criar Novo Anúncio'}
              </h3>
              <button onClick={() => setIsEditingAd(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAd} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Título do Anúncio *</label>
                  <input
                    type="text"
                    required
                    value={currentAd.title || ''}
                    onChange={(e) => setCurrentAd({ ...currentAd, title: e.target.value })}
                    placeholder="Ex: Peixada com Jambu na Beira-Mar"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nome do Estabelecimento / Negócio *</label>
                  <input
                    type="text"
                    required
                    value={currentAd.business_name || ''}
                    onChange={(e) => setCurrentAd({ ...currentAd, business_name: e.target.value })}
                    placeholder="Ex: Restaurante O Marujo"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoria *</label>
                  <select
                    value={currentAd.category || 'restaurante'}
                    onChange={(e) => setCurrentAd({ ...currentAd, category: e.target.value as AdCategory })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold capitalize"
                  >
                    <option value="restaurante">Restaurante / Culinária</option>
                    <option value="pousada">Pousada / Hospedagem</option>
                    <option value="passeio">Passeio de Barco / Rabeta</option>
                    <option value="transporte">Transporte / Charrete</option>
                    <option value="evento">Evento / Festa / Luau</option>
                    <option value="compras">Compras / Galão de Água & Gelo</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Slot de Banner (Posição)</label>
                  <select
                    value={currentAd.banner_slot || 'nenhum'}
                    onChange={(e) => setCurrentAd({ ...currentAd, banner_slot: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="nenhum">Nenhum (Somente Listagem)</option>
                    <option value="banner_1">Banner 1 (Charretes & Transporte)</option>
                    <option value="banner_2">Banner 2 (Restaurante Principal)</option>
                    <option value="banner_3">Banner 3 (Galão de Água & Gás)</option>
                    <option value="banner_4">Banner 4 (Passeios de Rabeta)</option>
                    <option value="destaque_topo">Destaque Topo</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Selo de Destaque</label>
                  <input
                    type="text"
                    value={currentAd.badge || ''}
                    onChange={(e) => setCurrentAd({ ...currentAd, badge: e.target.value })}
                    placeholder="Ex: Mais Pedido, Top Escolha"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Frase de Efeito (Tagline)</label>
                <input
                  type="text"
                  value={currentAd.tagline || ''}
                  onChange={(e) => setCurrentAd({ ...currentAd, tagline: e.target.value })}
                  placeholder="Ex: Peixe frito na hora com açaí e vista privilegiada para o mar"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descrição Completa</label>
                <textarea
                  rows={3}
                  value={currentAd.description || ''}
                  onChange={(e) => setCurrentAd({ ...currentAd, description: e.target.value })}
                  placeholder="Detalhes sobre o prato, acomodação, pacote de passeio ou serviço oferecido..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">URL da Imagem</label>
                  <input
                    type="url"
                    value={currentAd.image_url || ''}
                    onChange={(e) => setCurrentAd({ ...currentAd, image_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp (apenas números)</label>
                  <input
                    type="text"
                    value={currentAd.whatsapp || ''}
                    onChange={(e) => setCurrentAd({ ...currentAd, whatsapp: e.target.value })}
                    placeholder="5591983342211"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preço Inicial (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={currentAd.price_starting || 0}
                    onChange={(e) => setCurrentAd({ ...currentAd, price_starting: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Início da Veiculação</label>
                  <input
                    type="date"
                    value={currentAd.start_date || ''}
                    onChange={(e) => setCurrentAd({ ...currentAd, start_date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Término da Veiculação</label>
                  <input
                    type="date"
                    value={currentAd.end_date || ''}
                    onChange={(e) => setCurrentAd({ ...currentAd, end_date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={currentAd.is_active}
                    onChange={(e) => setCurrentAd({ ...currentAd, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-600"
                  />
                  <span>Anúncio Ativo</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={currentAd.is_highlighted}
                    onChange={(e) => setCurrentAd({ ...currentAd, is_highlighted: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-600"
                  />
                  <span>Destacar no Topo</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingAd(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black shadow-md transition cursor-pointer"
                >
                  Salvar Anúncio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: BULK IMPORT TIDES (MARINHA DO BRASIL)             */}
      {/* ======================================================== */}
      {isBulkImportOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white text-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-sky-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-black font-heading text-slate-900">
                Importação em Massa da Tábua da Marinha
              </h3>
              <button onClick={() => setIsBulkImportOpen(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 pt-3 text-xs">
              <p className="text-slate-600">
                Cole linhas de texto no formato CSV (Data, Fase da Lua, Coeficiente, HoraAlta1, Altura1, HoraAlta2, Altura2, HoraBaixa1, AlturaBaixa1, HoraBaixa2, AlturaBaixa2):
              </p>
              
              <textarea
                rows={6}
                value={bulkTideText}
                onChange={(e) => setBulkTideText(e.target.value)}
                placeholder="2026-09-01, Cheia, 90, 04:30, 4.3m, 17:00, 4.5m, 10:45, 0.4m, 23:10, 0.5m"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-mono"
              />

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsBulkImportOpen(false)}
                  className="py-2 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleBulkImportTides}
                  className="py-2 px-5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black cursor-pointer shadow-md"
                >
                  Importar Dados
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: SINGLE TIDE DAY FORM                              */}
      {/* ======================================================== */}
      {isAddingTideDay && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white text-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-sky-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-black font-heading text-slate-900">
                Adicionar Registro de Maré
              </h3>
              <button onClick={() => setIsAddingTideDay(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTideDay} className="space-y-3 pt-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Data *</label>
                <input
                  type="date"
                  required
                  value={currentTideDay.date || ''}
                  onChange={(e) => setCurrentTideDay({ ...currentTideDay, date: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fase da Lua</label>
                  <select
                    value={currentTideDay.moon_phase || 'Cheia'}
                    onChange={(e) => setCurrentTideDay({ ...currentTideDay, moon_phase: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Nova">Nova</option>
                    <option value="Crescente">Crescente</option>
                    <option value="Cheia">Cheia</option>
                    <option value="Minguante">Minguante</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Coeficiente</label>
                  <input
                    type="number"
                    value={currentTideDay.coefficient || 80}
                    onChange={(e) => setCurrentTideDay({ ...currentTideDay, coefficient: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Dicas & Recomendações</label>
                <input
                  type="text"
                  value={currentTideDay.recommendations || ''}
                  onChange={(e) => setCurrentTideDay({ ...currentTideDay, recommendations: e.target.value })}
                  placeholder="Ex: Maré excelente para travessias e banho de tarde"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingTideDay(false)}
                  className="py-2 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black cursor-pointer shadow-md"
                >
                  Salvar Dia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD PARTNER / POUSADA FORM                        */}
      {/* ======================================================== */}
      {isAddingPartner && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-emerald-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-black font-heading text-slate-900">
                Cadastrar Pousada ou Parceiro
              </h3>
              <button onClick={() => setIsAddingPartner(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePartner} className="space-y-3 pt-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome *</label>
                <input
                  type="text"
                  required
                  value={newPartner.name || ''}
                  onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                  placeholder="Ex: Pousada Recanto dos Pássaros"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoria *</label>
                  <select
                    value={newPartner.category || 'pousadas'}
                    onChange={(e) => setNewPartner({ ...newPartner, category: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold capitalize"
                  >
                    <option value="pousadas">Pousadas & Chalés</option>
                    <option value="transporte">Transporte (Charretes)</option>
                    <option value="passeios">Passeios de Rabeta</option>
                    <option value="alimentacao">Restaurante & Peixaria</option>
                    <option value="compras">Mercado & Água/Gelo</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subcategoria</label>
                  <input
                    type="text"
                    value={newPartner.subcategory || ''}
                    onChange={(e) => setNewPartner({ ...newPartner, subcategory: e.target.value })}
                    placeholder="Ex: Hospedagem com Wi-Fi"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={newPartner.whatsapp || ''}
                    onChange={(e) => setNewPartner({ ...newPartner, whatsapp: e.target.value })}
                    placeholder="5591981129988"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preço Inicial (R$)</label>
                  <input
                    type="number"
                    value={newPartner.price_starting || 0}
                    onChange={(e) => setNewPartner({ ...newPartner, price_starting: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Localização</label>
                <input
                  type="text"
                  value={newPartner.location || ''}
                  onChange={(e) => setNewPartner({ ...newPartner, location: e.target.value })}
                  placeholder="Praia da Princesa, Ilha de Algodoal"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingPartner(false)}
                  className="py-2 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black cursor-pointer shadow-md"
                >
                  Cadastrar Parceiro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
