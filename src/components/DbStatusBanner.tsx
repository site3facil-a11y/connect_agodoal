import React, { useEffect, useState } from 'react';
import { api } from '../services/api.ts';
import { RefreshCw, X, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const DbStatusBanner: React.FC = () => {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [dbDetails, setDbDetails] = useState<string>('');
  const [isRetrying, setIsRetrying] = useState(false);
  const [reconnectSuccess, setReconnectSuccess] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const checkStatus = async () => {
    try {
      const health = await api.getHealth();
      const isConn = !!health.dbConnected;
      setConnected(isConn);
      if (health.dbDetails) {
        setDbDetails(health.dbDetails);
      }
      return isConn;
    } catch {
      setConnected(false);
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;
    const runCheck = async () => {
      const isConn = await checkStatus();
      if (mounted && isConn) {
        setReconnectSuccess(false);
      }
    };

    runCheck();
    // Verifica periodicamente a cada 15 segundos para atualizar status assim que o PostgreSQL subir
    const interval = setInterval(runCheck, 15000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleManualReconnect = async () => {
    setIsRetrying(true);
    try {
      const res = await fetch('/api/admin/reconnect-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await res.json();
      if (data.success || data.currentStatus?.connected) {
        setConnected(true);
        setReconnectSuccess(true);
        setTimeout(() => {
          setReconnectSuccess(false);
        }, 4000);
      } else {
        await checkStatus();
      }
    } catch {
      await checkStatus();
    } finally {
      setIsRetrying(false);
    }
  };

  if (reconnectSuccess) {
    return (
      <div id="db-status-banner-success" className="w-full bg-emerald-600 text-white text-xs sm:text-sm font-semibold py-2 px-4 z-[100] sticky top-0 flex items-center justify-center gap-2 shadow-md transition-all animate-fadeIn">
        <CheckCircle2 className="w-4 h-4 text-white" />
        <span>Conexão com o banco de dados principal (PostgreSQL) restabelecida com sucesso!</span>
      </div>
    );
  }

  if (connected !== false || isDismissed) return null;

  return (
    <div id="db-status-banner" className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white text-xs sm:text-sm font-medium py-2 px-4 z-[100] sticky top-0 shadow-md flex flex-wrap items-center justify-between gap-2 border-b border-red-800/40">
      <div className="flex items-center gap-2 max-w-3xl">
        <AlertTriangle className="w-4 h-4 text-amber-200 shrink-0" />
        <div>
          <span className="font-bold">Sem conexão com o banco de dados principal (PostgreSQL):</span>{' '}
          <span className="text-red-100 text-xs">
            Exibindo dados locais com segurança. {dbDetails && `(${dbDetails})`}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleManualReconnect}
          disabled={isRetrying}
          className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold py-1 px-3 rounded-lg border border-white/40 flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
          title="Tentar reconectar ao banco de dados agora"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
          <span>{isRetrying ? 'Tentando...' : 'Reconectar'}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="text-white/80 hover:text-white p-1 rounded-md transition cursor-pointer"
          title="Fechar aviso temporariamente"
          aria-label="Fechar aviso"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
