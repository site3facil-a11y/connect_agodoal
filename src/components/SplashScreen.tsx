import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Waves, Palmtree, Sun, Compass } from 'lucide-react';

interface SplashScreenProps {
  onFinish?: () => void;
  minDuration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onFinish, 
  minDuration = 1800 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onFinish) onFinish();
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onFinish]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="native-splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-teal-700 via-teal-800 to-slate-950 text-white select-none overflow-hidden"
        >
          {/* Background subtle animated elements */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-amber-400 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-teal-400 blur-3xl" />
          </div>

          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.7, type: 'spring', damping: 14 }}
            className="flex flex-col items-center text-center px-6 relative z-10"
          >
            {/* Logo Emblem */}
            <div className="relative mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="w-28 h-28 rounded-full border-2 border-dashed border-teal-300/40 absolute -inset-2"
              />
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-teal-500 to-amber-400 p-0.5 shadow-2xl shadow-teal-900/60 flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center relative overflow-hidden">
                  <Palmtree className="w-11 h-11 text-teal-400 relative z-10" />
                  <Sun className="w-5 h-5 text-amber-400 absolute top-2 right-2 animate-pulse" />
                  <Waves className="w-12 h-12 text-teal-500/20 absolute -bottom-2" />
                </div>
              </div>
            </div>

            {/* Title & Tagline */}
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-200 via-white to-amber-200">
              Connect-Algodoal
            </h1>
            <p className="mt-2 text-sm text-teal-200/80 font-medium tracking-wide">
              Ilha de Maiandeua • Marudá • Pará
            </p>
            <p className="mt-1 text-xs text-teal-300/60 font-light">
              Pousadas • Travessias • Marés • Charretes • Cultura
            </p>

            {/* Animated Loader Bar */}
            <div className="mt-8 w-48 h-1.5 bg-teal-950/60 rounded-full overflow-hidden border border-teal-500/30">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                className="w-full h-full bg-gradient-to-r from-teal-400 to-amber-400 rounded-full"
              />
            </div>
            
            <span className="mt-3 text-[11px] text-teal-400/60 flex items-center gap-1">
              <Compass className="w-3 h-3 animate-spin" /> Conectando você ao melhor da ilha...
            </span>
          </motion.div>

          <div className="absolute bottom-6 text-[10px] text-teal-200/40 tracking-wider uppercase font-semibold">
            Versão 2.4.0 • APA Algodoal-Maiandeua
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
