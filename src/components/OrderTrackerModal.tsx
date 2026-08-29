import React from 'react';
import { 
  X, 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Car, 
  Sailboat, 
  Utensils, 
  RefreshCw,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { Order, OrderStatus } from '../types/index.ts';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onRefresh: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  orders,
  onRefresh
}) => {
  if (!isOpen) return null;

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pendente':
        return {
          label: 'Aguardando Confirmação',
          color: 'bg-amber-100 text-amber-900 border-amber-300',
          step: 1,
          desc: 'Aguardando o parceiro/charreteiro aceitar sua solicitação.'
        };
      case 'aceito':
        return {
          label: 'Aceito pelo Parceiro',
          color: 'bg-sky-100 text-sky-800 border-sky-300',
          step: 2,
          desc: 'Prestador confirmado e preparando seu atendimento.'
        };
      case 'em_rota':
        return {
          label: 'A Caminho / Em Rota',
          color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
          step: 3,
          desc: 'A charrete / entregador está se deslocando para o seu local!'
        };
      case 'concluido':
        return {
          label: 'Atendimento Concluído',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          step: 4,
          desc: 'Serviço finalizado com sucesso. Aproveite a Ilha de Algodoal!'
        };
      case 'cancelado':
        return {
          label: 'Cancelado',
          color: 'bg-red-100 text-red-800 border-red-300',
          step: 0,
          desc: 'Esta solicitação foi cancelada.'
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-8 text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 font-heading">
                Acompanhar Minhas Solicitações
              </h3>
              <p className="text-xs text-slate-500">
                Status em tempo real das suas charretes, passeios e pedidos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              title="Atualizar status"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {orders.length === 0 ? (
            <div className="text-center py-12 px-4">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h4 className="text-base font-black text-slate-800 font-heading">
                Nenhum pedido realizado ainda
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Chame uma charrete, reserve um passeio de rabeta ou peça itens para sua pousada no menu principal.
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const statusInfo = getStatusBadge(order.status);

              const whatsappMessage = encodeURIComponent(
                `Olá! Sou ${order.customer_name} e fiz o pedido #${order.id} pelo Algodoal Connect para: ${order.customer_location}. Poderia me atualizar sobre o atendimento?`
              );

              return (
                <div
                  key={order.id}
                  id={`order-item-${order.id}`}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition space-y-3"
                >
                  {/* Top line: ID, Category, Status Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900 font-mono">
                        #{order.id}
                      </span>
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {order.category}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Visual Step Progress Bar */}
                  {order.status !== 'cancelado' && (
                    <div className="py-2">
                      <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                        <span className={statusInfo.step >= 1 ? 'text-sky-700' : 'text-slate-400'}>
                          1. Enviado
                        </span>
                        <span className={statusInfo.step >= 2 ? 'text-sky-700' : 'text-slate-400'}>
                          2. Confirmado
                        </span>
                        <span className={statusInfo.step >= 3 ? 'text-sky-700' : 'text-slate-400'}>
                          3. A Caminho
                        </span>
                        <span className={statusInfo.step >= 4 ? 'text-emerald-700' : 'text-slate-400'}>
                          4. Concluído
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                        <div
                          className="bg-sky-600 h-full transition-all duration-500 rounded-full"
                          style={{ width: `${(statusInfo.step / 4) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1.5 font-medium">
                        ✦ {statusInfo.desc}
                      </p>
                    </div>
                  )}

                  {/* Order Items & Details */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
                    {order.items.map((it, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="font-medium text-slate-700">
                          {it.quantity}x {it.name}
                        </span>
                        <span className="font-bold text-slate-900">
                          R$ {(it.price * it.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold text-slate-900">
                      <span>Total:</span>
                      <span className="text-sky-800 text-sm font-heading">
                        R$ {order.total_price.toFixed(2)} ({order.payment_method.toUpperCase()})
                      </span>
                    </div>
                  </div>

                  {/* Location info */}
                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span>Local: <strong className="text-slate-900">{order.customer_location}</strong></span>
                    </p>
                    {order.destination_location && (
                      <p className="flex items-center gap-1.5 pl-5">
                        <span>Destino: <strong className="text-slate-900">{order.destination_location}</strong></span>
                      </p>
                    )}
                    {order.notes && (
                      <p className="text-slate-500 italic pl-5">
                        Obs: "{order.notes}"
                      </p>
                    )}
                  </div>

                  {/* Actions & WhatsApp Contact */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                      {order.partner_name || 'Algodoal Connect'}
                    </span>

                    <a
                      href={`https://wa.me/?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 rounded-xl transition shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Falar no WhatsApp</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
