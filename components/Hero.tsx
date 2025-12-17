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
         <div className="absolute inset-0 bg-white/80 z-10"></div> {/* Overlay to ensure text readability */}
         {/* Placeholder for the video provided by user. In a real scenario, src would be the video file URL */}
         <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-40 grayscale-[20%]"
            poster="https://images.unsplash.com/photo-1606811841689-230391b42b94?q=80&w=2070&auto=format&fit=crop"
         >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-young-woman-smiling-at-camera-close-up-12726-large.mp4" type="video/mp4" />
         </video>
         
         {/* Gradient fade at bottom */}
         <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 to-transparent z-10"></div>
      </div>

      <div className="relative z-20 max-w-4xl mx-auto px-4">
        <div className="animate-fade-in-down mb-6">
            <span className="inline-block py-1.5 px-4 rounded-full bg-white/80 backdrop-blur border border-slate-200 text-amber-600 text-[10px] tracking-[0.2em] uppercase font-bold shadow-sm">
            Inteligencia Artificial Biométrica
            </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-light text-slate-900 mb-6 leading-tight animate-fade-in-down font-sans tracking-tight">
          Descubre tu <br/>
          <span className="font-medium relative inline-block">
            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700">Perfecta Simetría</span>
            {/* Underline decorative */}
            <svg className="absolute w-full h-3 -bottom-1 left-0 text-amber-300/40 z-0" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </span>
        </h1>
        
        <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-600 font-light leading-relaxed animate-fade-in-down" style={{ animationDelay: '0.2s' }}>
          La tecnología de <strong>SIMETRÍA by Clínica Miró</strong> diseña tu sonrisa ideal basándose en las proporciones áureas de tu rostro. Sin compromisos, en segundos.
        </p>

        {/* Process Steps - Minimalist */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 mb-12 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {[
                { step: "01", title: "Captura", desc: "Selfie biométrica" },
                { step: "02", title: "Simetría IA", desc: "Análisis & Diseño" },
                { step: "03", title: "Revelación", desc: "Tu nueva imagen" }
            ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center group relative">
                    <div className="text-4xl font-light text-slate-200 group-hover:text-amber-200 transition-colors duration-500 mb-2 font-serif italic">
                        {item.step}
                    </div>
                    <h3 className="text-slate-800 font-medium text-sm uppercase tracking-widest mb-1">{item.title}</h3>
                    <p className="text-xs text-slate-500 font-light">{item.desc}</p>
                    {idx !== 2 && <div className="hidden md:block absolute top-8 -right-1/2 w-full h-[1px] bg-slate-200"></div>}
                </div>
            ))}
        </div>

        <div className="animate-fade-in-up flex flex-col items-center gap-4" style={{ animationDelay: '0.6s' }}>
          <Button onClick={onStart} className="min-w-[240px] py-5 text-sm tracking-[0.15em] shadow-2xl shadow-amber-500/20 hover:scale-105">
            INICIAR SIMULACIÓN
          </Button>
          
          <div className="text-[10px] text-slate-400 max-w-md text-center leading-tight mt-4">
             Al continuar, aceptas los <a href="#" className="underline hover:text-slate-600">Términos de Uso</a> de Simetría. 
             La simulación es referencial y no clínica.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;