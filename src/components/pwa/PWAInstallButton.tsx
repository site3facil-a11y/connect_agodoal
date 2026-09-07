import React, { useState } from 'react';
import { Download, Smartphone, Share2, PlusSquare, X, Check } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  className = '', 
  variant = 'compact' 
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  // If already running as standalone app on Android/iOS/Desktop, hide the install button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (outcome) {
        setJustInstalled(true);
        setTimeout(() => setJustInstalled(false), 4000);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // Fallback for browsers that haven't fired beforeinstallprompt yet (or desktop)
      setShowIOSGuide(true);
    }
  };

  if (justInstalled) {
    return (
      <div id="pwa-installed-badge" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
        <Check className="w-3.5 h-3.5" />
        <span>Instalado!</span>
      </div>
    );
  }

  return (
    <>
      <button
        id="pwa-header-install-btn"
        onClick={handleInstallClick}
        title="Instalar App no celular (Android / iOS)"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-medium text-xs shadow-md transition transform active:scale-95 cursor-pointer ${className}`}
      >
        <Smartphone className="w-3.5 h-3.5 shrink-0" />
        <span>{variant === 'full' ? 'Baixar App Android / iOS' : 'Baixar App'}</span>
      </button>

      {/* Guide modal for iOS or manual install */}
      {showIOSGuide && (
        <div 
          id="pwa-install-guide-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
          onClick={() => setShowIOSGuide(false)}
        >
          <div 
            className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-white relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              id="pwa-guide-close-btn"
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Instalar Algodoal Connect</h3>
                <p className="text-xs text-slate-400">Instale como aplicativo nativo</p>
              </div>
            </div>

            {isIOS ? (
              <div className="space-y-3 text-xs text-slate-300">
                <p className="font-medium text-teal-300">No iPhone / iPad (Safari):</p>
                <div className="flex items-start gap-2 bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                  <Share2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>1. Toque no botão de <strong>Compartilhar</strong> na barra inferior do Safari.</span>
                </div>
                <div className="flex items-start gap-2 bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                  <PlusSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>2. Role para baixo e selecione <strong>Adicionar à Tela de Início</strong>.</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-slate-300">
                <p className="font-medium text-teal-300">No Android (Google Chrome):</p>
                <div className="flex items-start gap-2 bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                  <Download className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>1. Toque nos <strong>três pontinhos</strong> (menu) no canto superior do Chrome.</span>
                </div>
                <div className="flex items-start gap-2 bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                  <PlusSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>2. Toque em <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</span>
                </div>
              </div>
            )}

            <button
              id="pwa-guide-confirm-btn"
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg transition cursor-pointer"
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </>
  );
};
