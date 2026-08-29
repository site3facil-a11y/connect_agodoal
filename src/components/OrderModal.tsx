import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  User, 
  CreditCard, 
  Banknote, 
  QrCode, 
  AlertCircle,
  MessageCircle,
  ShieldCheck,
  Send
} from 'lucide-react';
import { Partner, ServiceProduct, PaymentMethod } from '../types/index.ts';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: ServiceProduct;
  partner?: Partner;
  multiItems?: Array<{ service: ServiceProduct; partner: Partner; quantity: number }>;
  initialOrigin?: string;
  initialDest?: string;
  onSubmitOrder: (orderData: {
    customer_name: string;
    customer_phone: string;
    customer_location: string;
    destination_location?: string;
    partner_id: string;
    partner_name: string;
    category: any;
    items: Array<{ service_id: string; name: string; price: number; quantity: number; unit: string }>;
    total_price: number;
    payment_method: PaymentMethod;
    notes?: string;
  }) => Promise<void>;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  service,
  partner,
  multiItems,
  initialOrigin,
  initialDest,
  onSubmitOrder
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerLocation, setCustomerLocation] = useState(initialOrigin || 'Porto de Algodoal');
  const [destinationLocation, setDestinationLocation] = useState(initialDest || 'Praia da Princesa');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const isMulti = multiItems && multiItems.length > 0;

  // Compute items & total price
  const items = isMulti
    ? multiItems.map(item => ({
        service_id: item.service.id,
        name: item.service.name,
        price: item.service.price,
        quantity: item.quantity,
        unit: item.service.unit
      }))
    : service
    ? [
        {
          service_id: service.id,
          name: service.name,
          price: service.price,
          quantity: quantity,
          unit: service.unit
        }
      ]
    : [];

  const totalPrice = isMulti
    ? multiItems.reduce((sum, item) => sum + item.service.price * item.quantity, 0)
    : service
    ? service.price * quantity
    : 0;

  const primaryPartner = isMulti ? multiItems[0].partner : partner;
  const category = isMulti ? 'compras' : service?.category || 'transporte';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage('Por favor, informe seu nome.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 8) {
      setErrorMessage('Por favor, informe seu WhatsApp para o prestador poder lhe responder.');
      return;
    }
    if (!customerLocation.trim()) {
      setErrorMessage('Por favor, informe o local de encontro, pousada ou ponto de partida.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmitOrder({
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        customer_location: customerLocation.trim(),
        destination_location: category === 'transporte' ? destinationLocation.trim() : undefined,
        partner_id: primaryPartner?.id || 'part_carroca_14',
        partner_name: primaryPartner?.name || 'Prestador Algodoal',
        category,
        items,
        total_price: totalPrice,
        payment_method: paymentMethod,
        notes: notes.trim()
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao preparar mensagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-8 text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <MessageCircle className="w-3 h-3 text-emerald-600" />
                CONTATO DIRETO VIA WHATSAPP
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 font-heading mt-1">
              Falar com o Prestador
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Clear Notice about Direct WhatsApp & Non-Intermediation */}
        <div className="mt-3.5 p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold text-emerald-900 block mb-0.5">Sem Intermediação ou Taxas:</strong>
            O Algodoal Connect fornece o contato direto do prestador para facilitar a comunicação. O acordo, agendamento e pagamento são combinados diretamente entre você e o profissional no WhatsApp.
          </div>
        </div>

        {/* Order Summary Box */}
        <div className="mt-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-xs font-bold text-slate-600 block mb-1.5">
            Detalhes do Serviço Selecionado:
          </span>

          {items.map((it, idx) => (
            <div key={idx} className="flex items-center justify-between py-1 text-xs sm:text-sm">
              <div className="font-medium text-slate-800">
                <span>{it.quantity}x {it.name}</span>
                <span className="text-[11px] text-slate-500 block">({it.unit})</span>
              </div>
              <span className="font-bold text-sky-800 shrink-0 ml-2">
                R$ {(it.price * it.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          {primaryPartner && (
            <div className="mt-2 pt-2 border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span>Prestador/Comércio:</span>
              <strong className="text-slate-900">{primaryPartner.name}</strong>
            </div>
          )}

          <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-800">Valor Tabelado Sugerido:</span>
            <span className="text-xl font-black text-emerald-700 font-heading">
              R$ {totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-3 space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Seu Nome *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="input-order-name"
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ex: Carlos Mendes"
                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Seu WhatsApp de Contato *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="input-order-phone"
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Ex: (91) 98765-4321"
                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {category === 'transporte' ? 'Ponto de Partida na Ilha *' : 'Sua Pousada ou Local de Entrega *'}
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="input-order-location"
                type="text"
                required
                value={customerLocation}
                onChange={(e) => setCustomerLocation(e.target.value)}
                placeholder="Ex: Desembarque do Porto / Pousada Chalé da Ilha"
                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {category === 'transporte' && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Destino Final da Corrida
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  id="input-order-destination"
                  type="text"
                  value={destinationLocation}
                  onChange={(e) => setDestinationLocation(e.target.value)}
                  placeholder="Ex: Praia da Princesa / Pousada Mar & Sol"
                  className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Preferred Payment Method to mention in WhatsApp */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Forma de Pagamento Preferida (para informar no WhatsApp)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                  paymentMethod === 'pix'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900'
                }`}
              >
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>PIX</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('dinheiro')}
                className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                  paymentMethod === 'dinheiro'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900'
                }`}
              >
                <Banknote className="w-4 h-4 text-emerald-600" />
                <span>Dinheiro</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cartao')}
                className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                  paymentMethod === 'cartao'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Cartão</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Observações / Horário / Malas (Opcional)
            </label>
            <textarea
              id="input-order-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Estamos com 2 malas grandes e queremos saída às 15h."
              className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-2">
            <button
              id="btn-submit-order-confirm"
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm py-3 px-4 rounded-xl shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 text-white" />
              <span>{isSubmitting ? 'Abrindo WhatsApp...' : 'Conversar Diretamente no WhatsApp'}</span>
            </button>
            <p className="text-[11px] text-center text-slate-500 mt-2">
              Ao clicar, você será direcionado ao WhatsApp do prestador com a mensagem já pronta.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

