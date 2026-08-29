import React, { useState } from 'react';
import { X, Store, User, Phone, MapPin, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { ServiceCategory } from '../types/index.ts';

interface NewPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterPartner: (data: any) => Promise<void>;
}

export const NewPartnerModal: React.FC<NewPartnerModalProps> = ({
  isOpen,
  onClose,
  onRegisterPartner
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('transporte');
  const [subcategory, setSubcategory] = useState('Charreteiro / Bagagens');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [location, setLocation] = useState('Porto de Algodoal / Vila de Maiandeua');
  const [vehicleBadge, setVehicleBadge] = useState('');
  const [description, setDescription] = useState('');
  const [priceStarting, setPriceStarting] = useState('30.00');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Por favor, informe seu nome/nome do negócio e telefone.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onRegisterPartner({
        name: name.trim(),
        category,
        subcategory: subcategory.trim(),
        phone: phone.trim(),
        whatsapp: (whatsapp || phone).trim(),
        location: location.trim(),
        vehicle_badge: vehicleBadge.trim(),
        description: description.trim() || 'Prestador cadastrado na plataforma Algodoal Connect.',
        price_starting: Number(priceStarting) || 0
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao registrar parceiro.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-8 text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full">
              CREDENCIAMENTO DE PARCEIROS
            </span>
            <h3 className="text-xl font-black text-slate-900 font-heading mt-1.5">
              Cadastrar Meu Negócio / Charrete
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Seu Nome ou Nome do Negócio *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Seu Raimundo (Charrete #22) ou Barraca Sol & Mar"
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Categoria Principal *
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const cat = e.target.value as ServiceCategory;
                  setCategory(cat);
                  if (cat === 'transporte') setSubcategory('Charreteiro / Bagagens');
                  else if (cat === 'passeios') setSubcategory('Rabeta / Ecoturismo');
                  else if (cat === 'compras') setSubcategory('Depósito / Mercearia');
                  else if (cat === 'alimentacao') setSubcategory('Restaurante / Quiosque');
                }}
                className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              >
                <option value="transporte">Transporte (Charretes)</option>
                <option value="passeios">Passeios (Rabetas)</option>
                <option value="compras">Compras (Água/Gás/Gelo)</option>
                <option value="alimentacao">Alimentação (Restaurantes)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Subcategoria / Ramo
              </label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="Ex: Peixaria & Caldeirada"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                WhatsApp de Atendimento *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(91) 98888-7777"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Número/Identificação
              </label>
              <input
                type="text"
                value={vehicleBadge}
                onChange={(e) => setVehicleBadge(e.target.value)}
                placeholder="Ex: Charrete #22 / Rabeta Sol"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Ponto de Atendimento
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Porto de Algodoal"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Preço Inicial Médio (R$)
              </label>
              <input
                type="number"
                value={priceStarting}
                onChange={(e) => setPriceStarting(e.target.value)}
                placeholder="30.00"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Breve Descrição para os Turistas
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Atendimento rápido no desembarque de barcos, charrete espaçosa para malas e caixas térmicas."
              className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm py-3 px-4 rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Cadastrando...' : 'Finalizar Cadastro de Parceiro'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
