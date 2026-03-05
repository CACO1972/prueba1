
import React, { useState, useEffect } from 'react';
import Button from './Button';

interface HeroProps {
  onStart: () => void;
  onOpenDemo: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart, onOpenDemo }) => {
  const [sliderPos, setSliderPos] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSliderPos(prev => (prev >= 100 ? 0 : prev + 0.3));
    }, 45);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center px-6 py-10 md:py-20 relative overflow-hidden min-h-[80vh]">
      
      {/* CINEMATIC BACKGROUND CON MÁS LUZ */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050608] via-transparent to-[#050608] z-10"></div>
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        
        <div className="relative w-full h-full opacity-60 grayscale-[30%] scale-105 transition-transform duration-[20s] ease-linear">
             <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2000&auto=format&fit=crop" 
                className="absolute inset-0 w-full h-full object-cover" 
                alt="Original Facial Study"
             />
             <div 
                className="absolute inset-0 w-full h-full overflow-hidden border-r border-amber-500/50 shadow-[10px_0_50px_rgba(245,158,11,0.3)]"
                style={{ width: `${sliderPos}%` }}
             >
                <img 
                    src="https://images.unsplash.com/photo-1595567021422-2255b05d209c?q=80&w=2000&auto=format&fit=crop" 
                    className="absolute inset-0 w-[100vw] h-full object-cover" 
                    alt="AI Transformation Study"
                />
             </div>
        </div>
      </div>

      <div className="relative z-20 max-w-5xl mx-auto pt-4 md:pt-12 flex flex-col items-center">
        <div className="mb-10 animate-fade-in-down">
            <span className="inline-flex items-center gap-3 py-3.5 px-10 rounded-full bg-white/5 backdrop-blur-3xl border border-white/10 text-amber-500 text-[10px] tracking-[0.6em] uppercase font-black shadow-[0_0_40px_rgba(245,158,11,0.15)]">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                AI BIOMETRIC STANDARD 3.0
            </span>
        </div>
        
        <h1 className="text-6xl md:text-9xl font-light text-slate-100 mb-10 leading-[0.85] tracking-tighter animate-fade-in drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          Tu Sonrisa <br/>
          <span className="font-bold italic text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-200 to-amber-700">
            Reimaginada.
          </span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-xl md:text-3xl text-slate-400 font-light leading-relaxed animate-fade-in [animation-delay:200ms] mb-20 px-4">
          Más que estética, una <span className="text-white font-medium italic underline decoration-amber-500/40 underline-offset-8">ingeniería de simetría facial</span> de Clínica Miró.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-10 w-full max-w-3xl animate-fade-in [animation-delay:400ms]">
          <Button onClick={onStart} className="w-full md:w-[350px] py-10 text-[14px] shadow-[0_25px_80px_rgba(245,158,11,0.3)] hover:scale-105 transition-transform">
            DISEÑAR MI SONRISA
          </Button>
          
          <button 
            onClick={onOpenDemo}
            className="group w-full md:w-[350px] flex items-center justify-center gap-6 px-12 py-9 rounded-full bg-white/5 border border-white/10 text-slate-200 text-[12px] font-black uppercase tracking-[0.5em] hover:bg-white/10 transition-all backdrop-blur-2xl"
          >
            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center group-hover:bg-amber-500 transition-all">
                <svg className="w-5 h-5 text-amber-500 group-hover:text-black fill-current translate-x-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </div>
            SHOWCASE IA
          </button>
        </div>

        <div className="mt-28 md:mt-36 pt-16 border-t border-white/10 flex flex-wrap justify-center items-center gap-12 md:gap-32 opacity-40 grayscale-[50%] contrast-125">
             <img src="https://mirousa.com/wp-content/uploads/2022/10/logo-miro-vertical.png" className="h-16 object-contain" alt="Miró Clinical Logo" />
             <div className="text-[12px] text-white font-black tracking-[0.7em] uppercase border-l border-white/20 pl-12 hidden md:block">Certified Clinical Excellence</div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
