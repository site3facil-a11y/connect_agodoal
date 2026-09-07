import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // Check if user dismissed recently
    try {
      const saved = sessionStorage.getItem('algodoal_pwa_dismissed');
      if (saved === 'true') {
        setDismissed(true);
      }
    } catch {
      // ignore
    }
  }, []);

  // Hide if already installed as PWA or user closed it for the session
  if (isInstalled || dismissed) {
    return null;
  }

  // Only show if browser supports install or if on iOS
  if (!isInstallable && !isIOS) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem('algodoal_pwa_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  const handleInstall = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (outcome) {
        setDismissed(true);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  return (
    <>
      <aside 
        id="pwa-install-banner" 
        aria-label="Instalação do Aplicativo"
        className="fixed bottom-16 sm:bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-slate-900/95 backdrop-blur-md border border-teal-500/30 rounded-2xl p-3.5 shadow-2xl flex items-center gap-3 text-white transition-all animate-in fade-in slide-in-from-bottom-4 duration-300"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm">
          <Smartphone className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-slate-100 truncate">App Algodoal Connect</h4>
          <p className="text-[11px] text-slate-300 leading-tight">Instale no seu celular para acesso rápido e marés</p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id="pwa-banner-action-btn"
            onClick={handleInstall}
            className="flex items-center gap-1 px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Instalar</span>
          </button>
          
          <button
            id="pwa-banner-dismiss-btn"
            onClick={handleDismiss}
            aria-label="Fechar aviso"
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* iOS modal guidance if requested */}
      {showIOSModal && (
        <div 
          id="pwa-ios-banner-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
          onClick={() => setShowIOSModal(false)}
        >
          <div 
            className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-white relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              id="pwa-ios-modal-close"
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold text-slate-100 mb-2">Instalar no iPhone / Safari</h3>
            <p className="text-xs text-slate-300 mb-4">
              1. Toque no ícone de <strong>Compartilhar</strong> na barra do Safari.<br/>
              2. Selecione <strong>Adicionar à Tela de Início</strong>.
            </p>
            <button
              id="pwa-ios-modal-confirm"
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2 bg-teal-500 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              OK, entendi
            </button>
          </div>
        </div>
      )}
    </>
  );
};
