import React, { useState, useEffect } from 'react';

interface SpinnerProps {
  imageSrc?: string | null;
}

const Spinner: React.FC<SpinnerProps> = ({ imageSrc }) => {
  const [progress, setProgress] = useState(0);
  const [activeMetric, setActiveMetric] = useState(0);
  
  const messages = [
    "ESCANEO BIOMÉTRICO INICIAL...",
    "DETECTANDO FACCIONES DEL ROSTRO...",
    "ANALIZANDO SIMETRÍA DENTAL...",
    "CALCULANDO PROPORCIÓN ÁUREA FACIAL...",
    "OPTIMIZANDO TEXTURA DE PIEL...",
    "DISEÑANDO SONRISA PERFECTA...",
    "APLICANDO ARMONIZACIÓN INTEGRAL..."
  ];

  const metrics = [
    { label: "PIEL", val: "SUAVIZADA" },
    { label: "LUZ", val: "BALANCEADA" },
    { label: "SONRISA", val: "DETECTADA" },
    { label: "ÁNGULO", val: "OPTIMIZADO" },
  ];

  useEffect(() => {
    // Velocidad de carga variable para simular análisis real
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev < 30) return prev + 0.8;
        if (prev < 70) return prev + 0.4;
        if (prev < 95) return prev + 0.1;
        return prev;
      });
    }, 50);

    const metricTimer = setInterval(() => {
        setActiveMetric(prev => (prev + 1) % metrics.length);
    }, 1200);

    return () => {
      clearInterval(interval);
      clearInterval(metricTimer);
    };
  }, []);

  const activeMessageIndex = Math.min(
    Math.floor((progress / 100) * messages.length),
    messages.length - 1
  );

  return (
    <div className="relative w-full max-w-4xl mx-auto h-[70vh] min-h-[500px] rounded-[3rem] overflow-hidden bg-black border border-white/5 shadow-3xl flex flex-col items-center justify-center animate-fade-in">
        
        {/* Radar/Grid Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black"></div>
        </div>

        <div className="relative w-full h-full flex flex-col items-center justify-center p-8">
            
            {/* Central Analysis Frame */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border border-amber-500/20 shadow-[0_0_80px_rgba(245,158,11,0.1)] group mb-12">
                {imageSrc ? (
                    <img 
                        src={imageSrc} 
                        alt="Analyzing" 
                        className="w-full h-full object-cover filter grayscale brightness-50 scale-110" 
                    />
                ) : (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                        <span className="text-amber-500/50 text-[10px] tracking-[0.5em] animate-pulse">NO_DATA</span>
                    </div>
                )}
                
                {/* Laser Scanning Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.8)] animate-[scan_2s_ease-in-out_infinite] z-20"></div>
                
                {/* Circular Progress Border */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 z-10">
                    <circle 
                        cx="50%" cy="50%" r="48%" 
                        stroke="rgba(245,158,11,0.3)" strokeWidth="1" fill="none" 
                        strokeDasharray="1000"
                        style={{ strokeDashoffset: 1000 - (1000 * progress) / 100 }}
                        className="transition-all duration-500"
                    />
                </svg>
            </div>

            {/* Status Information */}
            <div className="text-center space-y-4 max-w-md">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">Symmetry_Engine_v4</span>
                </div>
                
                <h3 className="text-xl md:text-2xl font-light text-white tracking-[0.3em] uppercase transition-all duration-700">
                    {messages[activeMessageIndex]}
                </h3>
                
                <div className="flex justify-center gap-6 mt-8">
                    {metrics.map((m, idx) => (
                        <div key={idx} className={`transition-all duration-500 ${idx === activeMetric ? 'opacity-100 scale-110' : 'opacity-20'}`}>
                            <span className="block text-[8px] text-slate-500 uppercase tracking-widest">{m.label}</span>
                            <span className="text-[10px] font-mono text-white">{m.val}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Progress Bar */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-xs">
                <div className="flex justify-between text-[9px] text-slate-600 font-mono mb-2 uppercase tracking-widest">
                    <span>Procesando_Nodos</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-amber-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>

        <style>{`
            @keyframes scan {
                0%, 100% { top: 10%; opacity: 0; }
                50% { top: 90%; opacity: 1; }
            }
        `}</style>
    </div>
  );
};

export default Spinner;