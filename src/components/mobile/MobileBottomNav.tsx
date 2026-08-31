import React from 'react';
import { Home, Waves, Truck, ShoppingBag, ShieldCheck, Hotel } from 'lucide-react';

export type TabType = 'home' | 'pousadas' | 'transporte' | 'compras' | 'mares' | 'admin';

interface MobileBottomNavProps {
  theme?: 'dark' | 'light';
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isAdminLoggedIn?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  theme = 'dark',
  activeTab,
  onTabChange,
  isAdminLoggedIn = false
}) => {
  const isDark = theme === 'dark';

  const NAV_ITEMS: Array<{ id: TabType; label: string; icon: any; badge?: string }> = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'pousadas', label: 'Pousadas', icon: Hotel },
    { id: 'transporte', label: 'Charretes', icon: Truck },
    { id: 'compras', label: 'Depósitos', icon: ShoppingBag },
    { id: 'mares', label: 'Marés', icon: Waves, badge: 'Hoje' },
    { id: 'admin', label: 'Admin', icon: ShieldCheck, badge: isAdminLoggedIn ? '🟢' : undefined }
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md border-t shadow-2xl safe-area-bottom transition-colors ${
      isDark ? 'bg-slate-900/95 border-slate-800 text-white' : 'bg-white/95 border-slate-200 text-slate-800'
    }`}>
      <div className="max-w-md mx-auto px-2 py-1.5 flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition cursor-pointer relative ${
                isActive
                  ? 'text-teal-500 font-black'
                  : isDark 
                    ? 'text-slate-400 hover:text-slate-200 font-medium' 
                    : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-teal-500 shadow-xs shadow-teal-400" />
              )}
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-teal-500' : ''}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2.5 text-[8px] font-black px-1 rounded-full bg-amber-400 text-slate-950">
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
