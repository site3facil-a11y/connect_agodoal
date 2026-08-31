import React, { useState } from 'react';
import { Truck, MapPin, DollarSign, Clock, MessageCircle, Phone, Sparkles, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface CharreteGoCalculatorProps {
  isOpen?: boolean;
  onClose?: () => void;
  isModal?: boolean;
}

const CHARRETE_ROUTES = [
  { id: 'porto-princesa', from: 'Porto de Algodoal', to: 'Praia da Princesa', price: 35.00, time: '15-20 min', distance: '3.2 km' },
  { id: 'porto-vila', from: 'Porto de Algodoal', to: 'Vila Central / Pousadas', price: 20.00, time: '8-12 min', distance: '1.4 km' },
  { id: 'vila-princesa', from: 'Vila Central', to: 'Praia da Princesa', price: 25.00, time: '12-15 min', distance: '2.1 km' },
  { id: 'porto-fortalezinha', from: 'Porto de Algodoal', to: 'Vila de Fortalezinha', price: 70.00, time: '40-50 min', distance: '7.5 km' },
  { id: 'porto-lago', from: 'Porto de Algodoal', to: 'Trilha do Lago da Princesa', price: 45.00, time: '25-30 min', distance: '4.5 km' }
];

const CERTIFIED_DRIVERS = [
  { name: 'Seu Raimundo Silva', number: '14', phone: '5591981234567', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', status: 'Disponível no Porto' },
  { name: 'Zé do Carrocel', number: '08', phone: '5591982345678', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', status: 'Em rota na Princesa' },
  { name: 'Manoel das Dunas', number: '22', phone: '5591983456789', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', status: 'Disponível na Vila' }
];

export const CharreteGoCalculator: React.FC<CharreteGoCalculatorProps> = ({
  isOpen = true,
  onClose,
  isModal = false
}) => {
  const [selectedRouteId, setSelectedRouteId] = useState('porto-princesa');
  const [selectedDriver, setSelectedDriver] = useState(CERTIFIED_DRIVERS[0]);
  const [baggageCount, setBaggageCount] = useState(2);
  const [passengerCount, setPassengerCount] = useState(2);

  const route = CHARRETE_ROUTES.find(r => r.id === selectedRouteId) || CHARRETE_ROUTES[0];
  const finalPrice = route.price + (baggageCount > 3 ? (baggageCount - 3) * 5 : 0);

  const whatsappMessage = `Olá ${selectedDriver.name} (Charrete #${selectedDriver.number})! Gostaria de solicitar uma corrida pelo Algodoal Connect:\n\n📍 Trajeto: ${route.from} ➔ ${route.to}\n👥 Passageiros: ${passengerCount}\n🧳 Malas/Volumes: ${baggageCount}\n💰 Valor Estimado: R$ ${finalPrice.toFixed(2)}\n\nVocê está disponível agora?`;

  const content = (
    <div className="rounded-3xl bg-slate-900 border border-amber-500/30 p-4 sm:p-5 text-white shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Charrete<span className="text-amber-400">GO</span>
              </h3>
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Tabela Oficial APA
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Transporte ecológico e tradicional credenciado
            </p>
          </div>
        </div>

        {isModal && onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Route Selector */}
      <div className="space-y-2 mb-3.5">
        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-300">
          Selecione o Trajeto na Ilha:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {CHARRETE_ROUTES.map((r) => {
            const isSelected = r.id === selectedRouteId;
            return (
              <button
                key={r.id}
                onClick={() => setSelectedRouteId(r.id)}
                className={`p-2.5 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400/15 border-amber-400 text-white shadow-sm'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <span className="text-xs font-bold block truncate">
                    {r.from} ➔ {r.to}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-amber-400" />
                    {r.time} • {r.distance}
                  </span>
                </div>
                <span className="text-xs font-black text-amber-400 shrink-0">
                  R$ {r.price.toFixed(2)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Passengers and Bags Controls */}
      <div className="grid grid-cols-2 gap-2 mb-3.5 bg-slate-800/40 p-3 rounded-2xl border border-slate-700/50">
        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
            Passageiros
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPassengerCount(Math.max(1, passengerCount - 1))}
              className="w-7 h-7 rounded-xl bg-slate-700 text-white font-black text-xs cursor-pointer hover:bg-slate-600"
            >
              -
            </button>
            <span className="text-xs font-black text-white">{passengerCount}</span>
            <button
              onClick={() => setPassengerCount(Math.min(4, passengerCount + 1))}
              className="w-7 h-7 rounded-xl bg-slate-700 text-white font-black text-xs cursor-pointer hover:bg-slate-600"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
            Malas / Volumes
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBaggageCount(Math.max(0, baggageCount - 1))}
              className="w-7 h-7 rounded-xl bg-slate-700 text-white font-black text-xs cursor-pointer hover:bg-slate-600"
            >
              -
            </button>
            <span className="text-xs font-black text-white">{baggageCount}</span>
            <button
              onClick={() => setBaggageCount(Math.min(8, baggageCount + 1))}
              className="w-7 h-7 rounded-xl bg-slate-700 text-white font-black text-xs cursor-pointer hover:bg-slate-600"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Charreteiro Selector */}
      <div className="mb-3.5">
        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-300 mb-1.5">
          Charreteiro Credenciado:
        </label>
        <div className="grid grid-cols-3 gap-2">
          {CERTIFIED_DRIVERS.map((driver) => {
            const isSelected = driver.number === selectedDriver.number;
            return (
              <button
                key={driver.number}
                onClick={() => setSelectedDriver(driver)}
                className={`p-2 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                  isSelected
                    ? 'bg-amber-400 border-amber-400 text-slate-950 font-black shadow-md'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                  <img src={driver.photo} alt={driver.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-[11px] font-black leading-none truncate w-full">
                  #{driver.number} {driver.name.split(' ')[0]}
                </span>
                <span className={`text-[9px] ${isSelected ? 'text-slate-900 font-bold' : 'text-emerald-400'}`}>
                  {driver.status.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Summary & WhatsApp Call Action */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">
            Valor Tabelado
          </span>
          <span className="text-xl font-black text-amber-400 leading-none">
            R$ {finalPrice.toFixed(2)}
          </span>
        </div>

        <a
          href={`https://wa.me/${selectedDriver.phone}?text=${encodeURIComponent(whatsappMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Chamar Charrete #{selectedDriver.number}</span>
        </a>
      </div>
    </div>
  );

  if (isModal) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="max-w-md w-full">
          {content}
        </div>
      </div>
    );
  }

  return (
    <section className="px-4 py-3 bg-slate-950">
      {content}
    </section>
  );
};
