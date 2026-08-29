import React, { useState } from 'react';
import { 
  Store, 
  Car, 
  Sailboat, 
  ShoppingBag, 
  Utensils, 
  CheckCircle, 
  Clock, 
  Truck, 
  Plus, 
  Trash2, 
  Phone, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck,
  RefreshCw,
  Edit2
} from 'lucide-react';
import { Partner, ServiceProduct, Order, OrderStatus } from '../types/index.ts';

interface PartnerPortalProps {
  partners: Partner[];
  services: ServiceProduct[];
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  onAddNewService: (serviceData: Partial<ServiceProduct>) => Promise<void>;
  onDeleteService: (serviceId: string) => Promise<void>;
  onRefreshData: () => void;
}

export const PartnerPortal: React.FC<PartnerPortalProps> = ({
  partners,
  services,
  orders,
  onUpdateOrderStatus,
  onAddNewService,
  onDeleteService,
  onRefreshData
}) => {
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(partners[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'pedidos' | 'servicos' | 'estatisticas'>('pedidos');
  const [orderFilter, setOrderFilter] = useState<'todos' | 'pendente' | 'em_rota' | 'concluido'>('todos');

  // Form for new service/product
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceUnit, setNewServiceUnit] = useState('por viagem');
  const [newServiceTime, setNewServiceTime] = useState('20 min');
  const [isSaving, setIsSaving] = useState(false);

  const currentPartner = partners.find(p => p.id === selectedPartnerId) || partners[0];

  // Filter orders for the selected partner
  const partnerOrders = orders.filter(o => 
    !selectedPartnerId || o.partner_id === selectedPartnerId
  );

  const filteredOrders = partnerOrders.filter(o => {
    if (orderFilter === 'todos') return true;
    return o.status === orderFilter;
  });

  const partnerServices = services.filter(s => s.partner_id === selectedPartnerId);

  const completedRevenue = partnerOrders
    .filter(o => o.status === 'concluido')
    .reduce((sum, o) => sum + Number(o.total_price), 0);

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim() || !newServicePrice) return;

    try {
      setIsSaving(true);
      await onAddNewService({
        partner_id: selectedPartnerId,
        name: newServiceName.trim(),
        description: newServiceDesc.trim(),
        price: Number(newServicePrice),
        unit: newServiceUnit.trim(),
        category: currentPartner?.category || 'transporte',
        image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
        available: true,
        estimated_time: newServiceTime.trim()
      });
      setNewServiceName('');
      setNewServiceDesc('');
      setNewServicePrice('');
      setShowAddServiceModal(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 text-slate-800">
      {/* Top Banner / Partner Selector */}
      <div className="bg-gradient-to-r from-teal-700 via-sky-700 to-indigo-800 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-teal-500 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-amber-300 text-xs font-bold mb-2">
            <Store className="w-3.5 h-3.5" />
            <span>PAINEL DO PRESTADOR & COMERCIANTE DE ALGODOAL</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
            Gestão de Pedidos e Serviços
          </h2>
          <p className="text-xs sm:text-sm text-sky-100 mt-1">
            Controle corridas, passeios, vendas de mercadinho e refeições em tempo real.
          </p>
        </div>

        {/* Partner Switcher */}
        <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/20 max-w-sm w-full">
          <label className="text-[11px] font-bold text-amber-300 block mb-1">
            Alternar Prestador / Negócio:
          </label>
          <select
            id="select-partner-portal-profile"
            value={selectedPartnerId}
            onChange={(e) => setSelectedPartnerId(e.target.value)}
            className="w-full bg-white text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-amber-400"
          >
            {partners.map((p) => (
              <option key={p.id} value={p.id} className="bg-white text-slate-900">
                {p.name} ({p.category.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block">Total de Solicitações</span>
            <span className="text-2xl font-black text-slate-900 font-heading">{partnerOrders.length}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block">Atendimentos Concluídos</span>
            <span className="text-2xl font-black text-emerald-600 font-heading">
              {partnerOrders.filter(o => o.status === 'concluido').length}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block">Faturamento Realizado</span>
            <span className="text-2xl font-black text-amber-600 font-heading">
              R$ {completedRevenue.toFixed(2)}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('pedidos')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'pedidos'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Pedidos Recebidos ({partnerOrders.length})
          </button>

          <button
            onClick={() => setActiveTab('servicos')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'servicos'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Meus Itens & Cardápio ({partnerServices.length})
          </button>
        </div>

        <button
          onClick={onRefreshData}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 px-3.5 py-2 rounded-xl transition border border-slate-200 shadow-xs cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-sky-600" />
          <span>Atualizar</span>
        </button>
      </div>

      {/* Tab: Pedidos Recebidos */}
      {activeTab === 'pedidos' && (
        <div className="space-y-4">
          {/* Order Status Filters */}
          <div className="flex flex-wrap gap-2">
            {(['todos', 'pendente', 'em_rota', 'concluido'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setOrderFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${
                  orderFilter === filter
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {filter === 'todos' ? 'Todos os Status' : filter.replace('_', ' ')}
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h4 className="text-base font-black text-slate-800 font-heading">
                Nenhum pedido encontrado com esse filtro
              </h4>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-slate-900 font-mono">
                        Pedido #{order.id}
                      </span>
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 ml-2">
                        {order.category}
                      </span>
                    </div>

                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                      order.status === 'pendente' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                      order.status === 'aceito' ? 'bg-sky-100 text-sky-800 border-sky-300' :
                      order.status === 'em_rota' ? 'bg-indigo-100 text-indigo-800 border-indigo-300' :
                      order.status === 'concluido' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                      'bg-red-100 text-red-800 border-red-300'
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                    <p className="font-bold text-slate-900">
                      Turista: {order.customer_name} ({order.customer_phone})
                    </p>
                    <p className="text-slate-700 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-sky-600" />
                      Local: <strong>{order.customer_location}</strong>
                    </p>
                    {order.destination_location && (
                      <p className="text-slate-700 pl-4">
                        Destino: <strong>{order.destination_location}</strong>
                      </p>
                    )}
                    {order.notes && (
                      <p className="text-amber-900 italic bg-amber-50 border border-amber-200 p-1.5 rounded">
                        "{order.notes}"
                      </p>
                    )}
                  </div>

                  {/* Items */}
                  <div className="text-xs space-y-1">
                    {order.items.map((it, i) => (
                      <div key={i} className="flex items-center justify-between text-slate-700">
                        <span>{it.quantity}x {it.name}</span>
                        <span className="font-bold text-slate-900">R$ {(it.price * it.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold text-slate-900">
                      <span>Total do Pedido:</span>
                      <span className="text-sky-800 font-heading text-sm">R$ {order.total_price.toFixed(2)} ({order.payment_method.toUpperCase()})</span>
                    </div>
                  </div>

                  {/* Partner Actions to advance order status */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                    {order.status === 'pendente' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'aceito')}
                        className="flex-1 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold py-2 px-3 rounded-xl transition cursor-pointer"
                      >
                        Aceitar Pedido
                      </button>
                    )}

                    {(order.status === 'pendente' || order.status === 'aceito') && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'em_rota')}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 px-3 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>A Caminho / Em Rota</span>
                      </button>
                    )}

                    {order.status !== 'concluido' && order.status !== 'cancelado' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'concluido')}
                        className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold py-2 px-3 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Concluir</span>
                      </button>
                    )}

                    <a
                      href={`https://wa.me/${order.customer_phone.replace(/\D/g, '')}?text=Olá ${order.customer_name}, aqui é do Algodoal Connect sobre seu pedido #${order.id}!`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold transition flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Meus Itens & Cardápio */}
      {activeTab === 'servicos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 font-heading">
              Itens Cadastrados no seu Perfil
            </h3>
            <button
              onClick={() => setShowAddServiceModal(true)}
              className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-4 py-2 rounded-xl transition shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Novo Item / Rota</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {partnerServices.map((srv) => (
              <div
                key={srv.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-32 rounded-xl overflow-hidden mb-3">
                    <img
                      src={srv.image_url}
                      alt={srv.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h4 className="text-sm font-black text-slate-900 font-heading">{srv.name}</h4>
                  <span className="text-[11px] font-bold text-sky-700 block">{srv.unit}</span>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{srv.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-base font-black text-sky-800 font-heading">
                    R$ {srv.price.toFixed(2)}
                  </span>

                  <button
                    onClick={() => onDeleteService(srv.id)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
                    title="Remover item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal to Add New Service */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 text-slate-800">
            <h3 className="text-lg font-black text-slate-900 font-heading mb-4">
              Cadastrar Novo Item / Serviço
            </h3>

            <form onSubmit={handleCreateService} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nome do Item / Rota *
                </label>
                <input
                  type="text"
                  required
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  placeholder="Ex: Corrida para Dunas do Lago"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Descrição
                </label>
                <textarea
                  rows={2}
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  placeholder="Detalhes sobre o serviço ou refeição..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    required
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(e.target.value)}
                    placeholder="35.00"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Unidade
                  </label>
                  <input
                    type="text"
                    value={newServiceUnit}
                    onChange={(e) => setNewServiceUnit(e.target.value)}
                    placeholder="por viagem / por pessoa"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {isSaving ? 'Salvando...' : 'Salvar Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
