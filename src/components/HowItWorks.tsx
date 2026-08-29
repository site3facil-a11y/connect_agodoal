import React from 'react';
import { Smartphone, Search, MessageSquare, ShieldCheck, Sparkles, MessageCircle } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '1',
      title: 'ESCOLHA NO CATÁLOGO',
      subtitle: 'Sem complicação',
      desc: 'Navegue entre condutores de charrete, barqueiros de rabeta, pousadas, mercadinhos e restaurantes.',
      icon: Search,
      color: 'bg-sky-600 text-white',
      border: 'border-sky-200'
    },
    {
      num: '2',
      title: 'CONTATO DIRETO POR WHATSAPP',
      subtitle: 'Sem intermediários',
      desc: 'O site disponibiliza o WhatsApp do prestador e já formata os dados do seu pedido para agilizar.',
      icon: MessageCircle,
      color: 'bg-emerald-600 text-white',
      border: 'border-emerald-200'
    },
    {
      num: '3',
      title: 'COMBINE E ACERTE DIRETO',
      subtitle: 'Você & o Prestador',
      desc: 'Negocie horários, número de malas e faça o pagamento (PIX ou dinheiro) direto com o morador local.',
      icon: ShieldCheck,
      color: 'bg-amber-500 text-slate-950',
      border: 'border-amber-200'
    },
    {
      num: '4',
      title: 'APROVEITE A ILHA',
      subtitle: 'Turismo Sustentável',
      desc: 'Desfrute das praias paradisíacas e fortaleça a economia tradicional da APA de Algodoal.',
      icon: Sparkles,
      color: 'bg-teal-700 text-white',
      border: 'border-teal-200'
    }
  ];

  return (
    <section className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-[10px] font-bold uppercase tracking-widest mb-2 shadow-2xs">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>COMUNICAÇÃO 100% DIRETA VIA WHATSAPP</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading mt-1">
            Como Funciona o Algodoal Connect?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Somos um <strong>catálogo e guia digital comunitário</strong>. Fornecemos os contatos e tabelas da ilha para você falar diretamente com os prestadores pelo WhatsApp, sem cobrar taxas nem intermediar pagamentos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                id={`how-it-works-step-${step.num}`}
                className="relative p-5 rounded-2xl bg-white border border-slate-200/80 flex flex-col items-center text-center shadow-xs hover:shadow-md hover:border-emerald-300 transition group"
              >
                {/* Step Number Badge */}
                <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full ${step.color} text-xs font-black flex items-center justify-center border-2 border-white shadow-md`}>
                  {step.num}
                </div>

                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 flex items-center justify-center mb-3 mt-2 shadow-2xs group-hover:scale-110 transition transform">
                  <Icon className="w-6 h-6 text-emerald-700" />
                </div>

                <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-wide font-heading">
                  {step.title}
                </h3>
                <span className="text-[11px] font-bold text-emerald-700 mb-1">
                  {step.subtitle}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
