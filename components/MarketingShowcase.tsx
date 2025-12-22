import React, { useState, useEffect } from 'react';
import Button from './Button';

interface MarketingShowcaseProps {
  originalImage: string;
  generatedImage: string;
  onClose: () => void;
}

const MarketingShowcase: React.FC<MarketingShowcaseProps> = ({ originalImage, generatedImage, onClose }) => {
  const [phase, setPhase] = useState<'scan' | 'reveal' | 'detail'>('scan');
  const [showGoldRatio, setShowGoldRatio] = useState(false);

  useEffect(() => {
    const sequence = async () => {
      setPhase('scan');
      await new Promise(r => setTimeout(r, 2500));
      setPhase('reveal');
      await new Promise(r => setTimeout(r, 2000));
      setShowGoldRatio(true);
      setPhase('detail');
    };
    sequence();
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-0 md:p-10 animate-fade-in overflow-hidden">
        
        {/* Background Ambient Particles */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.05)_0%,transparent_70%)]"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        </div>

        {/* Cinematic Viewport */}
        <div className="relative w-full max-w-5xl aspect-[9/16] md:aspect-video bg-[#0a0a0a] rounded-none md:rounded-[4rem] shadow-[0_0_150px_rgba(0,0,0,1)] border border-white/5 overflow-hidden flex items-center justify-center">
            
            {/* The Image Layer with Parallax-Zoom */}
            <div className={`relative w-full h-full transition-transform duration-[10000ms] ease-out scale-100 ${phase !== 'scan' ? 'scale-110 translate-y-[-2%]' : ''}`}>
                <img 
                    src={phase === 'scan' ? originalImage : generatedImage} 
                    alt="Transformation" 
                    className="w-full h-full object-cover grayscale-[30%] brightness-[0.8] contrast-[1.1]"
                />
                
                {/* Golden Ratio Overlay */}
                {showGoldRatio && (
                    <div className="absolute inset-0 z-20 opacity-40 mix-blend-screen animate-fade-in">
                        <svg className="w-full h-full text-amber-500/50" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0,0 Q100,0 100,100" fill="none" stroke="currentColor" strokeWidth="0.1" />
                            <path d="M100,100 Q0,100 0,0" fill="none" stroke="currentColor" strokeWidth="0.1" />
                            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="1,1" />
                            <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.05" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Scanning Laser Line */}
            {phase === 'scan' && (
                <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 shadow-[0_0_40px_rgba(245,158,11,1)] z-30 animate-[scan-marketing_2s_ease-in-out_infinite]"></div>
            )}

            {/* Floating Detail Tags */}
            <div className={`absolute inset-0 z-40 transition-opacity duration-1000 ${phase === 'detail' ? 'opacity-100' : 'opacity-0'}`}>
                {/* Tag 1: Blanco Elite */}
                <div className="absolute top-[55%] left-[45%] animate-[float-tag_4s_ease-in-out_infinite]">
                    <div className="bg-white/10 backdrop-blur-xl border-l-2 border-amber-500 p-4 rounded-r-2xl shadow-2xl">
                        <span className="block text-[8px] font-black text-amber-500 tracking-[0.4em] uppercase mb-1">Textura</span>
                        <span className="text-white text-[11px] font-bold tracking-widest uppercase">Esmalte Vitrificado</span>
                    </div>
                </div>

                {/* Tag 2: Simetría */}
                <div className="absolute top-[45%] right-[20%] animate-[float-tag_5s_ease-in-out_infinite_1s]">
                    <div className="bg-white/10 backdrop-blur-xl border-l-2 border-amber-500 p-4 rounded-r-2xl shadow-2xl">
                        <span className="block text-[8px] font-black text-amber-500 tracking-[0.4em] uppercase mb-1">Alineación</span>
                        <span className="text-white text-[11px] font-bold tracking-widest uppercase">Proporción Áurea</span>
                    </div>
                </div>
            </div>

            {/* Narrative Overlays */}
            <div className="absolute bottom-20 left-10 z-50 max-w-sm pointer-events-none">
                <div className="overflow-hidden">
                    <h2 className={`text-4xl md:text-6xl font-black text-white italic tracking-tighter transition-transform duration-700 ${phase === 'reveal' ? 'translate-y-0' : 'translate-y-full'}`}>
                        ELITE <span className="text-amber-500">SMILE</span>
                    </h2>
                </div>
                <p className={`text-slate-400 text-[10px] uppercase tracking-[0.5em] mt-4 transition-all duration-1000 delay-500 ${phase === 'detail' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    Ingeniería de Simetría Facial Aplicada
                </p>
            </div>

            {/* UI Controls */}
            <div className="absolute top-8 right-8 z-50">
                <button 
                    onClick={onClose}
                    className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md border border-white/10 transition-all"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        </div>

        {/* Marketing Call to Action */}
        <div className={`mt-12 text-center transition-all duration-1000 delay-1000 ${phase === 'detail' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] mb-6">Esta es tu mejor versión.</p>
            <Button onClick={onClose} className="!px-12 !py-6 !text-[12px] shadow-amber-500/20 shadow-2xl">SOLICITAR INFORME DE BIOMETRÍA</Button>
        </div>

        <style>{`
            @keyframes scan-marketing {
                0% { top: 10%; }
                100% { top: 90%; }
            }
            @keyframes float-tag {
                0%, 100% { transform: translateY(0) translateX(0); }
                50% { transform: translateY(-15px) translateX(10px); }
            }
        `}</style>
    </div>
  );
};

export default MarketingShowcase;