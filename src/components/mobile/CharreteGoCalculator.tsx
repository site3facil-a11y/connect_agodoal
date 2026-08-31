import React, { useState } from 'react';
import { Truck, MapPin, DollarSign, Clock, MessageCircle, Phone, Sparkles, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface CharreteGoCalculatorProps {
  theme?: 'dark' | 'light';
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
  theme = 'dark',
  isOpen = true,
  onClose,
  isModal = false
}) => {
  const isDark = theme === 'dark';
  const [selectedRouteId, setSelectedRouteId] = useState('porto-princesa');
  const [selectedDriver, setSelectedDriver] = useState(CERTIFIED_DRIVERS[0]);
  const [baggageCount, setBaggageCount] = useState(2);
  const [passengerCount, setPassengerCount] = useState(2);

  const route = CHARRETE_ROUTES.find(r => r.id === selectedRouteId) || CHARRETE_ROUTES[0];
  const finalPrice = route.price + (baggageCount > 3 ? (baggageCount - 3) * 5 : 0);

  const whatsappMessage = `Olá ${selectedDriver.name} (Charrete #${selectedDriver.number})! Gostaria de solicitar uma corrida pelo Algodoal Connect:\n\n📍 Trajeto: ${route.from} ➔ ${route.to}\n👥 Passageiros: ${passengerCount}\n🧳 Malas/Volumes: ${baggageCount}\n💰 Valor Estimado: R$ ${finalPrice.toFixed(2)}\n\nVocê está disponível agora?`;

  const content = (
    <div className={`rounded-3xl border p-4 sm:p-5 shadow-xl transition-colors ${
      isDark ? 'bg-slate-900 border-amber-500/30 text-white' : 'bg-white border-amber-300 text-slate-900'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className={`text-sm font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Charrete<span className="text-amber-500">GO</span>
              </h3>
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-600 border border-amber-400/30">
                Oficial APA
              </span>
            </div>
            <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Transporte ecológico tradicional de Maiandeua
            </p>
          </div>
        </div>

        {isModal && onClose && (
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full ${isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Select Route */}
      <div className="space-y-2 mb-3.5">
        <label className={`text-[11px] font-bold block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          1. Escolha o Trajeto Tabelado
        </label>
        <div className="grid grid-cols-1 gap-2">
          {CHARRETE_ROUTES.map((r) => {
            const isSelected = r.id === selectedRouteId;
            return (
              <button
                key={r.id}
                onClick={() => setSelectedRouteId(r.id)}
                className={`p-3 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400/15 border-amber-400 text-amber-500 font-bold ring-1 ring-amber-400'
                    : isDark 
                      ? 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span className={isDark ? 'text-white' : 'text-slate-900'}>{r.from} ➔ {r.to}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 pl-5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {r.time}
                    </span>
                    <span>•</span>
                    <span>{r.distance}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-amber-400 text-slate-950 shadow-xs">
                    R$ {r.price.toFixed(2)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Select Drivers */}
      <div className="space-y-2 mb-4">
        <label className={`text-[11px] font-bold block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          2. Charreteiro Cadastrado
        </label>
        <div className="grid grid-cols-3 gap-2">
          {CERTIFIED_DRIVERS.map((d) => {
            const isSelected = d.number === selectedDriver.number;
            return (
              <button
                key={d.number}
                onClick={() => setSelectedDriver(d)}
                className={`p-2 rounded-2xl border text-center transition cursor-pointer ${
                  isSelected
                    ? 'bg-teal-500/20 border-teal-400 text-teal-600 ring-1 ring-teal-400'
                    : isDark 
                      ? 'bg-slate-950/60 border-slate-800 text-slate-400' 
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className="relative w-9 h-9 mx-auto mb-1">
                  <img
                    src={d.photo}
                    alt={d.name}
                    className="w-full h-full rounded-full object-cover border border-amber-400"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                    #{d.number}
                  </span>
                </div>
                <span className={`text-[11px] font-black block truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{d.name.split(' ')[0]}</span>
                <span className="text-[9px] text-emerald-500 font-bold block truncate">● {d.status.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Passengers and Bags Controls */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className={`p-2.5 rounded-2xl border flex items-center justify-between ${
          isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div>
            <span className="text-[10px] text-slate-400 block">Passageiros</span>
            <span className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{passengerCount} pessoas</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPassengerCount(Math.max(1, passengerCount - 1))}
              className={`w-6 h-6 rounded-lg font-black text-xs ${isDark ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-800'}`}
            >
              -
            </button>
            <button
              onClick={() => setPassengerCount(Math.min(6, passengerCount + 1))}
              className={`w-6 h-6 rounded-lg font-black text-xs ${isDark ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-800'}`}
            >
              +
            </button>
          </div>
        </div>

        <div className={`p-2.5 rounded-2xl border flex items-center justify-between ${
          isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div>
            <span className="text-[10px] text-slate-400 block">Malas / Cargas</span>
            <span className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{baggageCount} volumes</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setBaggageCount(Math.max(0, baggageCount - 1))}
              className={`w-6 h-6 rounded-lg font-black text-xs ${isDark ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-800'}`}
            >
              -
            </button>
            <button
              onClick={() => setBaggageCount(Math.min(10, baggageCount + 1))}
              className={`w-6 h-6 rounded-lg font-black text-xs ${isDark ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-800'}`}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Total & Action Button */}
      <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 mb-3 ${
        isDark ? 'bg-amber-400/10 border-amber-400/30' : 'bg-amber-50 border-amber-200'
      }`}>
        <div>
          <span className="text-[10px] text-amber-600 font-bold block">VALOR ESTIMADO</span>
          <span className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
            R$ {finalPrice.toFixed(2)}
          </span>
        </div>

        <a
          href={`https://wa.me/${selectedDriver.phone}?text=${encodeURIComponent(whatsappMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg transition"
        >
          <MessageCircle className="w-4 h-4 fill-slate-950" />
          <span>Solicitar no WhatsApp</span>
        </a>
      </div>

      {/* Regulation Badge */}
      <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 text-center">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Preços tabelados e fiscalizados pela Associação Comunitária da Ilha</span>
      </div>
    </div>
  );

  if (isModal) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="w-full max-w-md max-h-[90vh] overflow-y-auto">
          {content}
        </div>
      </div>
    );
  }

  return <div className="px-4 py-2">{content}</div>;
};
