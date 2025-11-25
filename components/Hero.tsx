import React from 'react';
import Button from './Button';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center py-20 relative overflow-hidden">
      {/* Abstract background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
         <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-amber-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <span className="inline-block py-1 px-3 rounded-full bg-white border border-slate-200 text-amber-600 text-xs tracking-widest uppercase mb-6 animate-fade-in-down shadow-sm font-medium">
          Tecnología Estética Avanzada
        </span>
        
        <h1 className="text-5xl md:text-7xl font-light text-slate-900 mb-8 leading-tight animate-fade-in-down" style={{ fontFamily: '"Jost", sans-serif' }}>
          Revela el Poder de <br/>
          <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600">Tu Mejor Versión</span>
        </h1>
        
        <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-700 font-light leading-relaxed animate-fade-in-down" style={{ animationDelay: '0.2s' }}>
          Más que dientes, es armonía. Nuestra IA exclusiva analiza tu rostro para diseñar la sonrisa y el equilibrio estético que mereces en segundos.
        </p>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 mb-12 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex flex-col items-center space-y-3 group">
                <div className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm group-hover:border-amber-500/50 group-hover:text-amber-500 transition-colors duration-300 flex items-center justify-center text-slate-500 text-xl">1</div>
                <h3 className="text-slate-800 font-medium text-lg">Sube tu Foto</h3>
                <p className="text-base text-slate-600">Inicia tu transformación.</p>
            </div>
            <div className="flex flex-col items-center space-y-3 group">
                <div className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm group-hover:border-amber-500/50 group-hover:text-amber-500 transition-colors duration-300 flex items-center justify-center text-slate-500 text-xl">2</div>
                <h3 className="text-slate-800 font-medium text-lg">Análisis Integral</h3>
                <p className="text-base text-slate-600">Sonrisa + Armonización Facial.</p>
            </div>
            <div className="flex flex-col items-center space-y-3 group">
                <div className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm group-hover:border-amber-500/50 group-hover:text-amber-500 transition-colors duration-300 flex items-center justify-center text-slate-500 text-xl">3</div>
                <h3 className="text-slate-800 font-medium text-lg">Hazlo Realidad</h3>
                <p className="text-base text-slate-600">Agenda tu plan clínico.</p>
            </div>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <Button onClick={onStart} className="min-w-[220px] text-base py-4 shadow-[0_0_25px_rgba(245,158,11,0.3)] hover:shadow-[0_0_35px_rgba(245,158,11,0.5)]">
            Iniciar Experiencia
          </Button>
          <p className="mt-4 text-xs text-slate-600 tracking-widest uppercase font-medium">Sin costo • Resultados inmediatos</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;