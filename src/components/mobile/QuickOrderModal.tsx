import React, { useState } from 'react';
import { ShoppingBag, X, Plus, Minus, MessageCircle, MapPin, CheckCircle2, Sparkles } from 'lucide-react';

interface QuickOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SupplyItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
  icon: string;
}

const SUPPLY_ITEMS: SupplyItem[] = [
  { id: 'agua-20l', name: 'Galão Água Mineral 20L', price: 18.00, unit: 'galão', description: 'Água mineral lacrada Indaiá / Nossa Água', icon: '💧' },
  { id: 'gelo-10kg', name: 'Saco de Gelo Filtrado 10kg', price: 15.00, unit: 'saco', description: 'Gelo em cubos para cooler e bebidas', icon: '🧊' },
  { id: 'gelo-5kg', name: 'Saco de Gelo Filtrado 5kg', price: 9.00, unit: 'saco', description: 'Gelo filtrado pacote individual', icon: '🧊' },
  { id: 'carvao-3kg', name: 'Saco de Carvão Vegetal 3kg', price: 16.00, unit: 'saco', description: 'Ideal para churrasco na praia', icon: '🪵' },
  { id: 'refrigerante-2l', name: 'Refrigerante 2 Litros Gelado', price: 12.00, unit: 'garrafa', description: 'Coca-Cola ou Guaraná Antarctica gelados', icon: '🥤' }
];

export const QuickOrderModal: React.FC<QuickOrderModalProps> = ({ isOpen, onClose }) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'agua-20l': 1,
    'gelo-10kg': 1
  });
  const [deliveryLocation, setDeliveryLocation] = useState('Praia da Princesa (Próximo à Barraca do Sol)');
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'dinheiro'>('pix');

  if (!isOpen) return null;

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const selectedItems = SUPPLY_ITEMS.filter((item) => (quantities[item.id] || 0) > 0);
  const totalPrice = selectedItems.reduce((acc, item) => acc + item.price * (quantities[item.id] || 0), 0);
  const deliveryFee = 5.00;
  const finalTotal = totalPrice > 0 ? totalPrice + deliveryFee : 0;

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      alert('Selecione pelo menos um item para pedir.');
      return;
    }

    const itemsSummary = selectedItems
      .map((item) => `• ${quantities[item.id]}x ${item.name} (R$ ${(item.price * quantities[item.id]).toFixed(2)})`)
      .join('\n');

    const message = `🌊 *NOVO PEDIDO DE SUPRIMENTOS — ALGODOAL CONNECT*\n\n` +
      `👤 *Cliente:* ${customerName || 'Turista na Ilha'}\n` +
      `📍 *Local de Entrega:* ${deliveryLocation}\n` +
      `💳 *Forma de Pagamento:* ${paymentMethod.toUpperCase()}\n\n` +
      `📦 *Itens do Pedido:*\n${itemsSummary}\n\n` +
      `🛵 *Taxa de Entrega de Charrete Express:* R$ ${deliveryFee.toFixed(2)}\n` +
      `💰 *VALOR TOTAL: R$ ${finalTotal.toFixed(2)}*\n\n` +
      `Poderiam confirmar a entrega e me passar a chave PIX?`;

    window.open(`https://wa.me/5591981234567?text=${encodeURIComponent(message)}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 text-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-sky-500/30 shadow-2xl p-5">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-500 text-slate-950 flex items-center justify-center font-black shadow-md">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase text-white tracking-tight font-heading">
                Disk Água & Gelo
              </h3>
              <p className="text-[11px] text-sky-300 font-semibold">
                Entrega rápida de charrete na praia ou pousada
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items List */}
        <form onSubmit={handleSendWhatsApp} className="mt-4 space-y-4">
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
              Escolha os Produtos:
            </label>
            {SUPPLY_ITEMS.map((item) => {
              const qty = quantities[item.id] || 0;
              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl border transition flex items-center justify-between ${
                    qty > 0 ? 'bg-slate-800/80 border-sky-400/50' : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <span className="text-xs font-bold text-white block leading-tight">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-sky-400 font-bold">
                        R$ {item.price.toFixed(2)} /{item.unit}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-7 h-7 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-black text-xs flex items-center justify-center cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-black w-4 text-center">{qty}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-7 h-7 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Delivery Details */}
          <div className="space-y-2.5 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                Seu Nome
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ex: Carlos Oliveira"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-sky-400"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                Local de Entrega na Ilha (Pousada ou Barraca)
              </label>
              <input
                type="text"
                required
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                placeholder="Ex: Pousada Chalé da Ilha, Quarto 4"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-sky-400"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                Forma de Pagamento
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    paymentMethod === 'pix'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  ⚡ PIX Direto
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('dinheiro')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    paymentMethod === 'dinheiro'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  💵 Dinheiro
                </button>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Total com Entrega
              </span>
              <span className="text-xl font-black text-sky-300">
                R$ {finalTotal.toFixed(2)}
              </span>
            </div>

            <button
              type="submit"
              disabled={selectedItems.length === 0}
              className="py-3 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg transition cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enviar Pedido WhatsApp</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
