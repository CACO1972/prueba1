
import React, { useState, useEffect } from 'react';
import Button from './Button';

interface MarketingShowcaseProps {
  onClose: () => void;
  isDemo?: boolean;
}

const MarketingShowcase: React.FC<MarketingShowcaseProps> = ({ onClose, isDemo = false }) => {
  const [phase, setPhase] = useState(0); 
  const [progress, setProgress] = useState(0);

  // Imágenes coherentes de un mismo sujeto para la demostración
  const images = [
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop", // Base
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop", // Escaneo
    "https://images.unsplash.com/photo-1595567021422-2255b05d209c?q=80&w=1000&auto=format&fit=crop", // Resultado Proceso
    "https://images.unsplash.com/photo-1595567021422-2255b05d209c?q=80&w=1000&auto=format&fit=crop"  // Resultado Final
  ];

  const phases = [
    { title: "ESTUDIO BASE", tag: "REGISTRO_BIO", desc: "CAPTURA DE FACCIONES Y ESTRUCTURA ÓSEA ACTUAL." },
    { title: "ESCANEO IA", tag: "SIMETRÍA_SCAN", desc: "DETECTANDO TERCIOS FACIALES Y ARCO DENTAL." },
    { title: "SÍNTESIS DIGITAL", tag: "IA_RENDERING", desc: "DISEÑANDO CARILLAS DE PORCELANA A MEDIDA." },
    { title: "SONRISA ELITE", tag: "TRANSFORMACIÓN", desc: "SIMULACIÓN FINALIZADA CON ÉXITO CLÍNICO." }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
        setProgress(p => {
            if (p >= 100) {
                if (phase < phases.length - 1) {
                    setPhase(prev => prev + 1);
                    return 0;
                } else {
                    setTimeout(() => setPhase(0), 3000);
                    return 100;
                }
            }
            return p + 2.5;
        });
    }, 50);
    return () => clearInterval(timer);
  }, [phase]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#050608] flex flex-col items-center justify-center animate-fade-in overflow-hidden">
        
        <div className="relative w-full h-[100dvh] md:h-[92vh] max-w-lg bg-black md:rounded-[4rem] border border-white/5 overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,1)]">
            
            <div className="absolute top-0 left-0 w-full z-50 p-10 flex justify-between items-start bg-gradient-to-b from-black/90 to-transparent">
                <div className="flex flex-col">
                    <span className="text-[10px] text-white/40 font-black tracking-widest uppercase">CASE_DEMO_01</span>
                    <span className="text-[11px] text-amber-500 font-light tracking-widest uppercase">{phases[phase].tag}</span>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-full">
                    <span className="text-amber-500 text-[9px] font-black uppercase tracking-widest">LIVE IA</span>
                </div>
            </div>

            <div className="relative flex-grow flex items-center justify-center overflow-hidden">
                <img 
                    src={images[phase]} 
                    className={`w-full h-full object-cover transition-all duration-1000 ${phase === 1 ? 'brightness-50 grayscale-[50%]' : ''}`}
                    alt="Dental Showcase"
                />

                {phase === 1 && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center">
                        <div className="w-full h-1 bg-amber-500/80 shadow-[0_0_30px_rgba(245,158,11,1)] animate-[scan_2.5s_linear_infinite] absolute top-0"></div>
                        <div className="w-[70%] h-[55%] border-2 border-amber-500/30 rounded-[10rem] relative">
                             <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10"></div>
                             <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/10"></div>
                             <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-4 h-4 border border-amber-500 rounded-full animate-ping"></div>
                        </div>
                    </div>
                )}

                {phase === 3 && (
                    <div className="absolute inset-0 z-20 bg-amber-500/5 backdrop-blur-[1px] flex items-center justify-center animate-fade-in">
                         <div className="px-10 py-4 bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-[0.8em] shadow-2xl">OPTIMIZADO</div>
                    </div>
                )}
            </div>

            <div className="p-10 pb-16 space-y-10 bg-gradient-to-t from-black via-black/95 to-transparent relative z-30">
                <div className="text-center space-y-4">
                    <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
                        {phases[phase].title}
                    </h2>
                    <p className="text-[10px] text-slate-400 font-light uppercase tracking-widest leading-relaxed max-w-xs mx-auto">
                        {phases[phase].desc}
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between text-[9px] text-amber-500 font-black tracking-widest uppercase">
                        <span>PROCESANDO_NODOS</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-amber-500 transition-all duration-100 shadow-[0_0_20px_rgba(245,158,11,0.6)]" 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                <div className="pt-4 flex flex-col items-center gap-6">
                    <Button onClick={onClose} className="w-full py-8 text-[12px] shadow-2xl shadow-amber-500/20">
                        INICIAR MI SIMULACIÓN
                    </Button>
                    <button onClick={onClose} className="text-[10px] text-white/30 font-black uppercase tracking-widest hover:text-white transition-colors">SALTAR DEMO</button>
                </div>
            </div>
        </div>

        <style>{`
            @keyframes scan {
                0% { top: 10%; opacity: 0; }
                20% { opacity: 1; }
                80% { opacity: 1; }
                100% { top: 90%; opacity: 0; }
            }
        `}</style>
    </div>
  );
};

export default MarketingShowcase;
