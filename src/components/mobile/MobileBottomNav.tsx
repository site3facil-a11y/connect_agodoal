import React from 'react';
import { Home, Sparkles, Compass, Tag, ShieldCheck } from 'lucide-react';

export type TabType = 'home' | 'portal' | 'guia' | 'anuncie' | 'admin' | 'pousadas' | 'transporte' | 'compras' | 'mares';

interface MobileBottomNavProps {
  theme?: 'dark' | 'light';
  activeTab: string;
  onTabChange: (tab: any) => void;
  isAdminLoggedIn?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  theme = 'dark',
  activeTab,
  onTabChange,
  isAdminLoggedIn = false
}) => {
  const isDark = theme === 'dark';

  const NAV_ITEMS: Array<{ id: string; label: string; icon: any; badge?: string; badgeColor?: string }> = [
    { id: 'inicio', label: 'Início', icon: Home },
    { id: 'portal', label: 'Anúncios', icon: Sparkles, badge: 'Portal', badgeColor: 'bg-amber-400 text-slate-950' },
    { id: 'guia', label: 'Guia', icon: Compass, badge: 'Ilha', badgeColor: 'bg-teal-400 text-slate-950' },
    { id: 'anuncie', label: 'Anuncie', icon: Tag, badge: 'R$30', badgeColor: 'bg-amber-400 text-slate-950' },
    { id: 'admin', label: 'Admin', icon: ShieldCheck, badge: isAdminLoggedIn ? '🟢' : undefined }
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md border-t shadow-2xl safe-area-bottom transition-colors ${
      isDark ? 'bg-slate-900/95 border-slate-800 text-white' : 'bg-white/95 border-slate-200 text-slate-800'
    }`}>
      <div className="max-w-md mx-auto px-2 py-1.5 flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'inicio' && activeTab === 'home');
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition cursor-pointer relative ${
                isActive
                  ? 'text-amber-400 font-black'
                  : isDark 
                    ? 'text-slate-400 hover:text-slate-200 font-medium' 
                    : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-amber-400 shadow-xs shadow-amber-400" />
              )}
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-amber-400' : ''}`} />
                {item.badge && (
                  <span className={`absolute -top-1 -right-2.5 text-[8px] font-black px-1 rounded-full ${item.badgeColor || 'bg-amber-400 text-slate-950'}`}>
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
