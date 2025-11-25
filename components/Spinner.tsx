import React, { useState, useEffect } from 'react';

interface SpinnerProps {
  imageSrc?: string | null;
}

const Spinner: React.FC<SpinnerProps> = ({ imageSrc }) => {
  const [progress, setProgress] = useState(0);
  const [activeMetric, setActiveMetric] = useState(0);
  
  // WOW EFFECT: Updated messages to imply holistic facial analysis, not just teeth.
  const messages = [
    "ESCANEO BIOMÉTRICO INICIAL...",
    "DETECTANDO FACCIONES DEL ROSTRO...",
    "ANALIZANDO SIMETRÍA DENTAL...",
    "CALCULANDO PROPORCIÓN ÁUREA FACIAL...", // Golden Ratio
    "OPTIMIZANDO TEXTURA DE PIEL...", // Skin texture
    "DISEÑANDO SONRISA PERFECTA...",
    "APLICANDO ARMONIZACIÓN INTEGRAL..." // Final step
  ];

  const metrics = [
    { label: "PIEL", val: "SUAVIZADA" },
    { label: "LUZ", val: "BALANCEADA" },
    { label: "SONRISA", val: "DETECTADA" },
    { label: "ÁNGULO", val: "OPTIMIZADO" },
  ];

  useEffect(() => {
    const duration = 15000; // 15s expected duration
    const interval = 100;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      // Cap at 99% so it doesn't look "finished but stuck"
      setProgress(prev => {
          const next = (currentStep / steps) * 100;
          return next >= 99 ? 99 : next;
      });
    }, interval);

    const metricTimer = setInterval(() => {
        setActiveMetric(prev => (prev + 1) % metrics.length);
    }, 800);

    return () => {
      clearInterval(timer);
      clearInterval(metricTimer);
    };
  }, []);

  const activeMessageIndex = Math.min(
    Math.floor((progress / 100) * messages.length),
    messages.length - 1
  );

  return (
    <div className="relative w-full max-w-3xl mx-auto h-[600px] rounded-2xl overflow-hidden bg-white border border-amber-500/20 shadow-2xl flex flex-col items-center justify-center animate-fade-in">
        
        {/* Background Grid / Noise */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white"></div>
        </div>

        {/* --- AI SCANNER MODE --- */}
        <div className="relative w-full h-full flex items-center justify-center p-8">
            
            {/* Central Image Frame */}
            <div className="relative w-full max-w-md aspect-[3/4] md:aspect-square rounded-lg overflow-hidden border border-amber-500/30 shadow-[0_0_100px_rgba(245,158,11,0.15)] group">
                {/* The User's Image or Placeholder */}
                {imageSrc ? (
                    <img 
                        src={imageSrc} 
                        alt="Analyzing" 
                        className="w-full h-full object-cover filter grayscale opacity-60 scale-105 animate-pulse" 
                        style={{ animationDuration: '4s' }}
                    />
                ) : (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                        <span className="text-amber-500/50 text-xs tracking-widest">NO SIGNAL</span>
                    </div>
                )}
                
                {/* Scanning Laser Beam */}
                <div className="absolute top-0 left-0 w-full h-[20%] bg-gradient-to-b from-amber-400/0 via-amber-400/50 to-amber-400/0 animate-[scan_3s_ease-in-out_infinite] shadow-[0_0_20px_rgba(245,158,11,0.5)] opacity-80 z-10">
                    <div className="w-full h-[1px] bg-amber-300 blur-[1px]"></div>
                </div>
                
                {/* Face Targeting Reticles - Expanded for whole face */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[60%] border border-amber-500/30 rounded-[40%] animate-[ping_3s_ease-out_infinite]"></div>
                
                {/* Corner Markers */}
                <div className="absolute top-[20%] left-[20%] w-6 h-6 border-t-2 border-l-2 border-amber-400"></div>
                <div className="absolute top-[20%] right-[20%] w-6 h-6 border-t-2 border-r-2 border-amber-400"></div>
                <div className="absolute bottom-[20%] left-[20%] w-6 h-6 border-b-2 border-l-2 border-amber-400"></div>
                <div className="absolute bottom-[20%] right-[20%] w-6 h-6 border-b-2 border-r-2 border-amber-400"></div>

                {/* Coding Overlay */}
                <div className="absolute top-4 right-4 text-[8px] font-mono text-amber-600/70 leading-tight hidden sm:block text-right">
                    {Array.from({length: 8}).map((_, i) => (
                        <div key={i} className="opacity-60">{`0x${Math.random().toString(16).substr(2, 8).toUpperCase()}`}</div>
                    ))}
                </div>
            </div>

            {/* HUD Side Panels */}
            <div className="absolute top-10 left-10 font-mono text-xs text-amber-600/80 space-y-2 hidden md:block">
                <div className="border-l-2 border-amber-500/50 pl-2">
                    <span className="block text-[10px] text-slate-400">SISTEMA</span>
                    <span className="tracking-widest">CLINICA_MIRO_AI_V2</span>
                </div>
                <div className="border-l-2 border-amber-500/50 pl-2">
                    <span className="block text-[10px] text-slate-400">MODO</span>
                    <span className="tracking-widest animate-pulse">ESTÉTICA INTEGRAL</span>
                </div>
            </div>

            <div className="absolute bottom-32 right-10 font-mono text-[10px] text-amber-600 hidden md:block">
                {metrics.map((m, idx) => (
                     <div key={idx} className={`flex justify-between w-40 border-b border-slate-200 py-1 ${idx === activeMetric ? 'opacity-100' : 'opacity-40'}`}>
                         <span>{m.label}</span>
                         <span>{m.val}</span>
                     </div>
                ))}
            </div>

            {/* Progress Bar & Text */}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white via-white/95 to-transparent p-8 text-center z-20">
                <h3 className="text-xl md:text-2xl font-light text-slate-800 tracking-[0.2em] mb-4 drop-shadow-sm">
                    {messages[activeMessageIndex]}
                </h3>
                <div className="w-full max-w-md mx-auto h-0.5 bg-slate-200 rounded-full overflow-hidden relative">
                    <div 
                        className="absolute top-0 left-0 h-full bg-amber-500 shadow-[0_0_10px_#F59E0B] transition-all duration-200 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <p className="text-[10px] text-slate-500 mt-3 font-mono tracking-widest">
                    PROCESANDO IA: {Math.round(progress)}%
                </p>
            </div>
        </div>

        <style>{`
            @keyframes scan {
                0%, 100% { top: 0%; opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { top: 100%; opacity: 0; }
            }
        `}</style>
    </div>
  );
};

export default Spinner;