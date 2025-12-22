import React from 'react';
import Button from './Button';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center py-20 relative overflow-hidden min-h-[80vh]">
      
      {/* VIDEO BACKGROUND LAYER */}
      <div className="absolute inset-0 overflow-hidden z-0">
         {/* Oscurecemos el overlay para el tema dark minimalista */}
         <div className="absolute inset-0 bg-[#0f1115]/70 z-10"></div> 
         <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-30 grayscale-[40%]"
            poster="https://images.unsplash.com/photo-1606811841689-230391b42b94?q=80&w=2070&auto=format&fit=crop"
         >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-young-woman-smiling-at-camera-close-up-12726-large.mp4" type="video/mp4" />
         </video>
      </div>

      <div className="relative z-20 max-w-4xl mx-auto px-4">
        <div className="mb-6">
            <span className="inline-block py-1.5 px-4 rounded-full bg-white/5 backdrop-blur border border-white/10 text-amber-500 text-[10px] tracking-[0.2em] uppercase font-bold shadow-sm">
            Inteligencia Artificial Biométrica
            </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-light text-white mb-6 leading-tight font-sans tracking-tight">
          Descubre tu <br/>
          <span className="font-medium relative inline-block">
            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">Perfecta Simetría</span>
            {/* Underline decorative */}
            <svg className="absolute w-full h-3 -bottom-1 left-0 text-amber-400/20 z-0" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </span>
        </h1>
        
        <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-400 font-light leading-relaxed">
          La tecnología de <strong>SIMETRÍA by Clínica Miró</strong> diseña tu sonrisa ideal basándose en las proporciones áureas de tu rostro. Sin compromisos, en segundos.
        </p>

        {/* Process Steps - Minimalist */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 mb-12 max-w-3xl mx-auto">
            {[
                { step: "01", title: "Captura", desc: "Selfie biométrica" },
                { step: "02", title: "Simetría IA", desc: "Análisis & Diseño" },
                { step: "03", title: "Revelación", desc: "Tu nueva imagen" }
            ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center group relative">
                    <div className="text-4xl font-light text-white/10 group-hover:text-amber-500/20 transition-colors duration-500 mb-2 font-serif italic">
                        {item.step}
                    </div>
                    <h3 className="text-white/90 font-medium text-sm uppercase tracking-widest mb-1">{item.title}</h3>
                    <p className="text-xs text-slate-500 font-light">{item.desc}</p>
                    {idx !== 2 && <div className="hidden md:block absolute top-8 -right-1/2 w-full h-[1px] bg-white/5"></div>}
                </div>
            ))}
        </div>

        <div className="flex flex-col items-center gap-4">
          <Button onClick={onStart} className="min-w-[240px] py-5 text-sm tracking-[0.15em] shadow-2xl shadow-amber-500/10 hover:scale-105">
            INICIAR SIMULACIÓN
          </Button>
          
          <div className="text-[10px] text-slate-500 max-w-md text-center leading-tight mt-4 uppercase tracking-widest">
             Al continuar, aceptas los <a href="#" className="underline hover:text-slate-300">Términos de Uso</a>. 
             La simulación es referencial y no clínica.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;