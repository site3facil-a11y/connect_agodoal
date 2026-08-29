import React from 'react';
import { 
  Compass, 
  Heart, 
  ShieldCheck, 
  QrCode, 
  Leaf, 
  Waves, 
  Sun, 
  Trash2,
  Sparkles
} from 'lucide-react';
import { AlgodoalLogoBadge } from './AlgodoalLogoBadge.tsx';

interface PreservationFooterProps {
  onOpenCategory: (cat: any) => void;
}

export const PreservationFooter: React.FC<PreservationFooterProps> = ({
  onOpenCategory
}) => {
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      {/* Environmental Banner */}
      <div className="bg-emerald-900/40 border-b border-emerald-800/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800/80 text-amber-300 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-amber-300 tracking-wider font-heading">
                  Lixo Zero na Praia
                </h4>
                <p className="text-xs text-emerald-100 mt-1">
                  Leve sua sacolinha e traga todo o seu lixo de volta das praias e dunas para as lixeiras da vila.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800/80 text-amber-300 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-amber-300 tracking-wider font-heading">
                  APA de Maiandeua
                </h4>
                <p className="text-xs text-emerald-100 mt-1">
                  Área de Proteção Ambiental. Não é permitida a circulação de veículos automotores terrestres na ilha.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800/80 text-amber-300 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                <Waves className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-amber-300 tracking-wider font-heading">
                  Respeite as Marés
                </h4>
                <p className="text-xs text-emerald-100 mt-1">
                  Acompanhe a tábua de marés antes de travessias a pé e sempre utilize colete nos passeios de barco.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800/80 text-amber-300 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-amber-300 tracking-wider font-heading">
                  Valorize o Nativo
                </h4>
                <p className="text-xs text-emerald-100 mt-1">
                  Contrate charreteiros, guias, barqueiros e quiosques da comunidade local para fortalecer a ilha.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & QR Code section from flyer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-slate-950 font-black shadow-md">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-tight text-white font-heading">
                    ALGODOAL
                  </span>
                  <span className="text-xl font-black text-amber-400 font-heading">
                    CONNECT
                  </span>
                </div>
                <p className="text-[10px] font-bold text-sky-300 uppercase tracking-widest -mt-0.5">
                  Ilha de Maiandeua • APA de Algodoal - PA
                </p>
              </div>
            </div>

            {/* Official Island Badge with White Garça */}
            <div className="pt-1">
              <AlgodoalLogoBadge size="sm" showSubtitle={false} />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              Catálogo comunitário e guia digital da Ilha de Maiandeua. Fornecemos os contatos para que você fale diretamente com charreteiros, barqueiros, pousadas e restaurantes pelo WhatsApp, sem cobrança de taxas nem controle de pagamentos.
            </p>

            <div className="flex flex-wrap gap-2 text-[11px] text-amber-300 font-bold pt-2">
              <span>✦ CONTATO DIRETO</span>
              <span>•</span>
              <span>🌿 SEM TAXA DE INTERMEDIAÇÃO</span>
              <span>•</span>
              <span>🌊 COMUNIDADE NATIVA</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs font-black text-white uppercase tracking-wider font-heading">
              Navegação Rápida
            </h5>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button onClick={() => onOpenCategory('transporte')} className="hover:text-amber-300 transition cursor-pointer">
                  Transporte de Charrete
                </button>
              </li>
              <li>
                <button onClick={() => onOpenCategory('passeios')} className="hover:text-amber-300 transition cursor-pointer">
                  Passeios de Rabeta & Lago
                </button>
              </li>
              <li>
                <button onClick={() => onOpenCategory('compras')} className="hover:text-amber-300 transition cursor-pointer">
                  Água 20L, Gelo & Gás
                </button>
              </li>
              <li>
                <button onClick={() => onOpenCategory('alimentacao')} className="hover:text-amber-300 transition cursor-pointer">
                  Restaurantes & Peixadas
                </button>
              </li>
              <li>
                <button onClick={() => onOpenCategory('informacoes')} className="hover:text-amber-300 transition cursor-pointer">
                  Tábua de Marés & Barcos
                </button>
              </li>
            </ul>
          </div>

          {/* QR Code / Share Card */}
          <div className="md:col-span-4 bg-slate-800/80 rounded-2xl p-5 border border-slate-700 flex items-center gap-4">
            <div className="w-20 h-20 bg-white p-2 rounded-xl shrink-0 flex items-center justify-center text-slate-900 shadow-md">
              <QrCode className="w-16 h-16" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">
                COMPARTILHE NA POUSADA
              </span>
              <h5 className="text-sm font-black text-white mt-0.5 font-heading">
                Escaneie o QR Code
              </h5>
              <p className="text-[11px] text-slate-300 mt-1">
                Compartilhe o Algodoal Connect com outros hóspedes e amigos na ilha.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright & tech stack note */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} Algodoal Connect — Desenvolvido com Node.js, PostgreSQL e Express.
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Banco de Dados Relacional Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
