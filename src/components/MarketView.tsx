import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  Truck, 
  Droplets, 
  Flame, 
  Sparkles, 
  Clock, 
  MapPin, 
  Check, 
  ShoppingCart,
  Phone
} from 'lucide-react';
import { Partner, ServiceProduct } from '../types/index.ts';

interface MarketViewProps {
  partners: Partner[];
  services: ServiceProduct[];
  onOpenMultiOrder: (items: Array<{ service: ServiceProduct; partner: Partner; quantity: number }>) => void;
  onCallPartnerDirect: (partner: Partner) => void;
}

export const MarketView: React.FC<MarketViewProps> = ({
  partners,
  services,
  onOpenMultiOrder,
  onCallPartnerDirect
}) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const marketPartners = partners.filter(p => p.category === 'compras');
  const marketServices = services.filter(s => s.category === 'compras');

  const handleUpdateQuantity = (serviceId: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[serviceId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[serviceId];
        return copy;
      }
      return { ...prev, [serviceId]: next };
    });
  };

  // Calculate cart totals
  const selectedItems = Object.entries(quantities)
    .filter(([_, q]) => Number(q) > 0)
    .map(([id, q]) => {
      const quantity = Number(q);
      const service = marketServices.find(s => s.id === id)!;
      const partner = partners.find(p => p.id === service?.partner_id) || marketPartners[0];
      return { service, partner, quantity };
    })
    .filter(item => item.service !== undefined);

  const totalCartPrice = selectedItems.reduce(
    (sum, item) => sum + item.service.price * item.quantity,
    0
  );
  const totalItemCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-8">
      {/* Header Info Box */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-700 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-emerald-400 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-3 backdrop-blur-xs">
            <Truck className="w-4 h-4 text-amber-300" />
            <span>Entrega Rápida na sua Pousada ou Casa de Aluguel</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-heading">
            Compras, Água, Gelo & Gás
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-2 leading-relaxed font-normal">
            Não carregue peso nas dunas ou na areia! Peça galão de <strong>água mineral 20L</strong>, <strong>sacos de gelo</strong>, <strong>gás de cozinha</strong> e itens de mercearia. Nossos parceiros entregam direto no seu quarto ou cozinha.
          </p>
        </div>

        {/* Quick Island Essentials highlights */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl">
          <div className="bg-white/15 backdrop-blur-xs rounded-2xl p-3 border border-white/20 text-center">
            <Droplets className="w-5 h-5 text-amber-300 mx-auto mb-1" />
            <span className="text-xs font-bold text-white block">Água Mineral 20L</span>
            <span className="text-[10px] text-emerald-100">Galão Lacrado</span>
          </div>

          <div className="bg-white/15 backdrop-blur-xs rounded-2xl p-3 border border-white/20 text-center">
            <Sparkles className="w-5 h-5 text-amber-300 mx-auto mb-1" />
            <span className="text-xs font-bold text-white block">Sacos de Gelo</span>
            <span className="text-[10px] text-emerald-100">Cubo & Escama</span>
          </div>

          <div className="bg-white/15 backdrop-blur-xs rounded-2xl p-3 border border-white/20 text-center">
            <Flame className="w-5 h-5 text-amber-300 mx-auto mb-1" />
            <span className="text-xs font-bold text-white block">Gás P13 Cheio</span>
            <span className="text-[10px] text-emerald-100">Com Instalação</span>
          </div>

          <div className="bg-white/15 backdrop-blur-xs rounded-2xl p-3 border border-white/20 text-center">
            <ShoppingBag className="w-5 h-5 text-amber-300 mx-auto mb-1" />
            <span className="text-xs font-bold text-white block">Bebidas & Mercado</span>
            <span className="text-[10px] text-emerald-100">Cerveja Gelada</span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 font-heading">
              Itens Essenciais para sua Hospedagem
            </h3>
            <p className="text-xs text-slate-500">
              Selecione os itens desejados para fazer um pedido único
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {marketServices.map((product) => {
            const currentQty = quantities[product.id] || 0;
            const partner = partners.find(p => p.id === product.partner_id) || marketPartners[0];

            return (
              <div
                key={product.id}
                id={`product-card-${product.id}`}
                className={`p-4 rounded-2xl bg-white border transition-all flex flex-col justify-between shadow-xs ${
                  currentQty > 0
                    ? 'border-emerald-500 ring-2 ring-emerald-400 bg-emerald-50/30'
                    : 'border-slate-200 hover:border-emerald-300 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="relative h-40 rounded-xl overflow-hidden mb-3 border border-slate-100">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-slate-900/85 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                      {product.estimated_time || 'Entrega Rápida'}
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm sm:text-base font-black text-slate-900 font-heading">
                      {product.name}
                    </h4>
                  </div>

                  <span className="text-[11px] font-bold text-emerald-700 block mt-0.5">
                    {product.unit}
                  </span>

                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium block">Preço</span>
                    <span className="text-base sm:text-lg font-black text-emerald-800">
                      R$ {product.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity Counter Control */}
                  <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      id={`btn-minus-${product.id}`}
                      onClick={() => handleUpdateQuantity(product.id, -1)}
                      disabled={currentQty === 0}
                      className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer shadow-2xs"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    <span className="w-6 text-center text-xs font-black text-slate-900">
                      {currentQty}
                    </span>

                    <button
                      id={`btn-plus-${product.id}`}
                      onClick={() => handleUpdateQuantity(product.id, 1)}
                      className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center transition cursor-pointer shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Cart Bar if items are selected */}
      {totalItemCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-3xl mx-auto z-30 animate-in slide-in-from-bottom duration-300">
          <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-emerald-400 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 shrink-0 font-black">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-emerald-300 font-semibold block">
                  {totalItemCount} {totalItemCount === 1 ? 'item selecionado' : 'itens selecionados'}
                </span>
                <span className="text-lg font-black text-white font-heading">
                  Total: R$ {totalCartPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantities({})}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 font-semibold cursor-pointer"
              >
                Limpar
              </button>

              <button
                id="btn-checkout-market-cart"
                onClick={() => onOpenMultiOrder(selectedItems)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg transition transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Finalizar Pedido</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Partners / Depots list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 font-heading">
              Depósitos & Mercadinhos Parceiros
            </h3>
            <p className="text-xs text-slate-500">
              Estabelecimentos da Vila de Maiandeua com entrega em toda a ilha
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {marketPartners.map((partner) => (
            <div
              key={partner.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition flex flex-col sm:flex-row gap-4"
            >
              <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                <img
                  src={partner.photo_url}
                  alt={partner.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-black text-slate-900 font-heading">{partner.name}</h4>
                      <span className="text-xs font-bold text-emerald-700">{partner.subcategory}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    {partner.description}
                  </p>

                  <span className="text-xs text-slate-500 mt-2 block">
                    <MapPin className="w-3 h-3 inline mr-1 text-emerald-600" />
                    {partner.location} • {partner.opening_hours}
                  </span>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-end">
                  <button
                    onClick={() => onCallPartnerDirect(partner)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition border border-slate-200 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Falar no WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
