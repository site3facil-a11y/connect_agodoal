import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div 
      id="pwa-offline-indicator"
      className="fixed bottom-20 sm:bottom-6 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600/95 text-white px-3 py-2 text-xs font-semibold shadow-xl border border-amber-400/30 backdrop-blur-xs animate-pulse"
    >
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>Modo Offline — exibindo dados salvos em cache</span>
    </div>
  );
};
