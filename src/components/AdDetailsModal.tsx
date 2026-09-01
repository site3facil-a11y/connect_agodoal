import React from 'react';
import { 
  X, 
  MessageCircle, 
  MapPin, 
  Tag, 
  Sparkles, 
  ExternalLink, 
  Phone, 
  ShieldCheck, 
  Calendar, 
  Share2, 
  Check, 
  ArrowRight,
  Info,
  DollarSign
} from 'lucide-react';
import { Advertisement, ServiceCategory } from '../types/index.ts';
import { api } from '../services/api.ts';

interface AdDetailsModalProps {
  ad: Advertisement | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory?: (category: ServiceCategory) => void;
}

export const AdDetailsModal: React.FC<AdDetailsModalProps> = ({
  ad,
  isOpen,
  onClose,
  onSelectCategory
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !ad) return null;

  const handleWhatsAppClick = () => {
    if (ad.id) {
      api.recordAdMetric(ad.id, 'click');
    }
    const cleanPhone = (ad.whatsapp || ad.phone || '').replace(/\D/g, '');
    const message = encodeURIComponent(`Olá! Vi o anúncio "${ad.title}" (${ad.business_name}) no Algodoal Connect e gostaria de mais informações.`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handleShare = async () => {
    const shareData = {
      title: `${ad.title} - Algodoal Connect`,
      text: `${ad.business_name}: ${ad.tagline || ad.description}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Ignored if cancelled
      }
    } else {
      navigator.clipboard.writeText(`${ad.title} - ${ad.business_name} | Algodoal Connect: ${window.location.href}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCategoryClick = () => {
    if (onSelectCategory && ad.category) {
      // Map category to standard ServiceCategory if needed
      const standardCat = (ad.category === 'pousada' ? 'pousadas' : ad.category === 'restaurante' ? 'alimentacao' : ad.category === 'passeio' ? 'passeios' : ad.category === 'evento' ? 'eventos' : ad.category) as ServiceCategory;
      onSelectCategory(standardCat);
      onClose();
    }
  };

  const formattedPrice = ad.price_starting 
    ? `A partir de R$ ${ad.price_starting.toFixed(2).replace('.', ',')}`
    : 'Consulte valores';

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-auto transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Media - Natural Color */}
        <div className="relative h-60 sm:h-72 w-full bg-slate-900 overflow-hidden">
          <img
            src={ad.image_url || '/imagens/vila2.jpg'}
            alt={ad.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/imagens/vila2.jpg';
            }}
          />
          {/* Localized bottom shadow solely behind text */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none" />

          {/* Close & Share Top Buttons */}
          <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition cursor-pointer"
              title="Compartilhar Anúncio"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition cursor-pointer"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Badges on Image */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
            {ad.badge && (
              <span className="px-2.5 py-1 rounded-xl bg-amber-400 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-md flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {ad.badge}
              </span>
            )}
            <span className="px-2.5 py-1 rounded-xl bg-teal-600/90 text-white font-black text-[11px] uppercase tracking-wider backdrop-blur-md shadow-md">
              {ad.category}
            </span>
          </div>

          {/* Bottom Title on Image */}
          <div className="absolute bottom-3 left-4 right-4 z-10 text-white">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
              {ad.business_name}
            </span>
            <h2 className="text-lg sm:text-xl font-black font-heading leading-tight drop-shadow-md">
              {ad.title}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          
          {/* Tagline / Subtitle */}
          {ad.tagline && (
            <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60">
              <p className="text-xs sm:text-sm font-bold text-teal-900 dark:text-teal-200 leading-snug">
                "{ad.tagline}"
              </p>
            </div>
          )}

          {/* Key Info Pill Bar */}
          <div className="grid grid-cols-2 gap-2.5 text-xs font-semibold">
            {/* Price Starting */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">Investimento</span>
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  {formattedPrice}
                </span>
              </div>
            </div>

            {/* Location */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">Localização</span>
                <span className="text-xs font-black text-slate-900 dark:text-white truncate block">
                  {ad.location || 'Ilha de Algodoal'}
                </span>
              </div>
            </div>
          </div>

          {/* Event specific venue / date if available */}
          {(ad.event_venue || ad.event_date) && (
            <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 space-y-1 text-xs">
              {ad.event_venue && (
                <div className="flex items-center gap-2 text-purple-900 dark:text-purple-200 font-bold">
                  <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Local do Evento: {ad.event_venue}</span>
                </div>
              )}
              {ad.event_date && (
                <div className="flex items-center gap-2 text-purple-900 dark:text-purple-200 font-bold">
                  <Calendar className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Data: {new Date(ad.event_date).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
            </div>
          )}

          {/* Full Description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Sobre o Estabelecimento & Serviços
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {ad.description || 'Entre em contato para saber todas as informações sobre este anúncio e reservar diretamente.'}
            </p>
          </div>

          {/* Direct Guarantee Notice */}
          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
              <strong className="text-slate-900 dark:text-slate-200">Negociação 100% Direta:</strong> Sem comissões ou taxas adicionais. Fale diretamente com o proprietário via WhatsApp ou telefone.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-2.5">
          {/* WhatsApp Direct Action Button */}
          {ad.whatsapp ? (
            <button
              onClick={handleWhatsAppClick}
              className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 transition cursor-pointer active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Conversar no WhatsApp</span>
            </button>
          ) : (
            ad.phone && (
              <a
                href={`tel:${ad.phone.replace(/\D/g, '')}`}
                className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 transition cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Ligar: {ad.phone}</span>
              </a>
            )
          )}

          {/* Direct Link if exists */}
          {ad.link_url && (
            <a
              href={ad.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Site</span>
            </a>
          )}

          {/* Category Exploration Button */}
          {onSelectCategory && (
            <button
              onClick={handleCategoryClick}
              className="py-3 px-4 rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <span>Ver mais</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
