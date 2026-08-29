import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  ShieldCheck, 
  User, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Lock, 
  Sparkles,
  ArrowRight,
  LogOut,
  Settings
} from 'lucide-react';
import { UserProfile, AuthProvider, UserRole } from '../types/index.ts';

interface SocialAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  onLogout: () => void;
  onOpenAdminPanel?: () => void;
}

export const SocialAuthModal: React.FC<SocialAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  onOpenAdminPanel
}) => {
  const [authMode, setAuthMode] = useState<'social' | 'email' | 'admin_pin'>('social');
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSocialAuth = async (provider: AuthProvider) => {
    setIsLoading(true);
    setErrorMsg('');

    try {
      let defaultName = 'Turista de Algodoal';
      let defaultEmail = `turista_${Math.floor(Math.random() * 1000)}@exemplo.com`;
      let avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

      if (provider === 'google') {
        defaultName = 'Wilson Lima (Gmail)';
        defaultEmail = 'wilsonlima@gmail.com';
        avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
      } else if (provider === 'instagram') {
        defaultName = '@turista_algodoal';
        defaultEmail = 'instagram.user@algodoal.app';
        avatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80';
      } else if (provider === 'facebook') {
        defaultName = 'Visitante Facebook';
        defaultEmail = 'face.user@algodoal.app';
        avatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';
      } else if (provider === 'apple') {
        defaultName = 'Usuário Apple iCloud';
        defaultEmail = 'apple.id@icloud.com';
        avatar = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80';
      }

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameInput || defaultName,
          email: emailInput || defaultEmail,
          phone: phoneInput || '(91) 98000-0000',
          provider,
          role: 'tourist',
          avatar_url: avatar
        })
      });

      const data = await res.json();
      if (data.success && data.user) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setErrorMsg(data.error || 'Erro ao autenticar com rede social');
      }
    } catch (err: any) {
      setErrorMsg('Falha na comunicação com o servidor de login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    // Master PIN code or admin password
    if (adminPin === 'algodoal2026' || adminPin === 'admin123' || adminPin === '123456') {
      const adminProfile: UserProfile = {
        id: 'usr_admin_master',
        name: 'Administrador Master',
        email: 'admin@algodoalconnect.com.br',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        provider: 'email',
        role: 'admin',
        created_at: new Date().toISOString()
      };

      try {
        await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(adminProfile)
        });
      } catch (e) {
        // continue
      }

      onLoginSuccess(adminProfile);
      onClose();
      if (onOpenAdminPanel) onOpenAdminPanel();
    } else {
      setErrorMsg('PIN de administrador incorreto. Use "admin123" ou "algodoal2026".');
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white text-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-sky-200 relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* If user is already logged in */}
        {currentUser ? (
          <div className="text-center py-4 space-y-4">
            <div className="relative inline-block mx-auto">
              <img
                src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                className="w-20 h-20 rounded-full border-4 border-amber-400 shadow-md object-cover"
              />
              <span className="absolute bottom-0 right-0 p-1 bg-emerald-500 rounded-full border-2 border-white"></span>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-black uppercase mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Conta Conectada ({currentUser.provider})</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 font-heading">{currentUser.name}</h3>
              <p className="text-xs text-slate-500">{currentUser.email}</p>
              {currentUser.role === 'admin' && (
                <span className="inline-block mt-2 text-[11px] font-black uppercase px-2.5 py-0.5 bg-amber-400 text-slate-950 rounded-md">
                  ⭐ Administrador Master
                </span>
              )}
            </div>

            <div className="pt-2 space-y-2">
              {currentUser.role === 'admin' && onOpenAdminPanel && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAdminPanel();
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                >
                  <Settings className="w-4 h-4" />
                  <span>Abrir Painel Administrativo</span>
                </button>
              )}

              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Desconectar da Conta</span>
              </button>
            </div>
          </div>
        ) : (
          /* Login View */
          <div className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-black uppercase mb-2">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Identificação do Usuário</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 font-heading">
                Acesse o Algodoal Connect
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Faça login para salvar pedidos de charrete, avaliar restaurantes e ter acesso completo.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Mode Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setAuthMode('social')}
                className={`flex-1 py-1.5 rounded-lg transition ${
                  authMode === 'social' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Redes Sociais
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('admin_pin')}
                className={`flex-1 py-1.5 rounded-lg transition ${
                  authMode === 'admin_pin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Painel Admin (PIN)
              </button>
            </div>

            {authMode === 'social' ? (
              <div className="space-y-2.5">
                {/* Google Button */}
                <button
                  type="button"
                  onClick={() => handleSocialAuth('google')}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-black flex items-center justify-center gap-3 transition shadow-xs cursor-pointer active:scale-98"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Entrar com Gmail / Google</span>
                </button>

                {/* Instagram Button */}
                <button
                  type="button"
                  onClick={() => handleSocialAuth('instagram')}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-3 transition shadow-xs cursor-pointer active:scale-98"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Entrar com Instagram</span>
                </button>

                {/* Facebook Button */}
                <button
                  type="button"
                  onClick={() => handleSocialAuth('facebook')}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs sm:text-sm font-black flex items-center justify-center gap-3 transition shadow-xs cursor-pointer active:scale-98"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Entrar com Facebook</span>
                </button>

                {/* Apple Button */}
                <button
                  type="button"
                  onClick={() => handleSocialAuth('apple')}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-black flex items-center justify-center gap-3 transition shadow-xs cursor-pointer active:scale-98"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.72-.93 2.74 1 .08 2.02-.49 2.64-1.24z"/>
                  </svg>
                  <span>Entrar com Apple / iCloud</span>
                </button>
              </div>
            ) : (
              /* Admin PIN Form */
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                  <strong>Área Restrita da Administração:</strong> Digite a senha master para gerenciar anúncios, tábua de marés e parceiros da ilha. (Senha padrão: <code className="bg-amber-200 px-1 py-0.5 rounded font-black">admin123</code> ou <code className="bg-amber-200 px-1 py-0.5 rounded font-black">algodoal2026</code>)
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1.5">
                    Senha / PIN Master:
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={adminPin}
                      onChange={(e) => setAdminPin(e.target.value)}
                      placeholder="Digite a senha master"
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold focus:outline-hidden focus:border-amber-500 focus:bg-white text-slate-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Acessar Painel Administrativo</span>
                </button>
              </form>
            )}

            <div className="pt-2 text-center">
              <p className="text-[11px] text-slate-400">
                Seus dados são protegidos e usados apenas para a experiência no app de Algodoal.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
