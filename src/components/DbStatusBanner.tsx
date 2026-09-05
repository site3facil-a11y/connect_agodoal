import React, { useEffect, useState } from 'react';
import { api } from '../services/api.ts';

export const DbStatusBanner: React.FC = () => {
  const [connected, setConnected] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const health = await api.getHealth();
        if (mounted) setConnected(!!health.dbConnected);
      } catch {
        if (mounted) setConnected(false);
      }
    };
    check();
    const interval = setInterval(check, 60000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (connected !== false) return null;

  return (
    <div className="w-full bg-red-600 text-white text-xs sm:text-sm font-semibold text-center py-2 px-3 z-[100] sticky top-0">
      ⚠️ Sem conexão com o banco de dados principal no momento — exibindo dados locais temporários. A equipe já foi notificada.
    </div>
  );
};
