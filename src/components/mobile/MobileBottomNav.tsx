import React from 'react';
import { Home, Waves, Truck, ShoppingBag, ShieldCheck, User } from 'lucide-react';

export type TabType = 'home' | 'mares' | 'transporte' | 'pedidos' | 'admin';

interface MobileBottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isAdminLoggedIn?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  isAdminLoggedIn = false
}) => {
  const NAV_ITEMS: Array<{ id: TabType; label: string; icon: any; badge?: string }> = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'mares', label: 'Marés', icon: Waves, badge: 'Hoje' },
    { id: 'transporte', label: 'Charretes', icon: Truck },
    { id: 'pedidos', label: 'Gelo & Água', icon: ShoppingBag },
    { id: 'admin', label: 'Admin', icon: ShieldCheck, badge: isAdminLoggedIn ? '🟢' : undefined }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white shadow-2xl safe-area-bottom">
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
                  ? 'text-teal-300 font-black'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-teal-400 shadow-sm shadow-teal-400" />
              )}
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-teal-400' : ''}`} />
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
