import React, { useEffect, useState, useRef } from 'react';
import Button from './Button';

interface AestheticSimulatorProps {
  imageSrc: string; // The image captured in the previous step
  onBack: () => void;
}

// Extend Window interface for Perfect Corp SDK
declare global {
  interface Window {
    YMK?: {
      init: (config: any) => Promise<void>;
      apply: (feature: string, option?: any) => void;
      open: () => void;
      source: {
          set: (image: string) => void;
      }
    };
  }
}

const JawlineMetrics = [
  { label: "Ángulo Mandibular", value: "125°", status: "Ideal", desc: "Proyección óptima del ángulo goniaco." },
  { label: "Definición de Mentón", value: "Subóptima", status: "Mejorable", desc: "Necesidad de proyección anterior (Rellenos)." },
  { label: "Tensión de Maseteros", value: "Alta", status: "Tratamiento", desc: "Sugerencia: Aplicación de Toxina Botulínica." },
  { label: "Vectores de Soporte", value: "65%", status: "Preventivo", desc: "Bioestimulación recomendada para prevenir flacidez." }
];

const JawlineTreatments = [
  { name: "Marcaje Mandibular", tech: "Hialurónico Alta Densidad", goal: "Definir contorno" },
  { name: "Radiesse / Sculptra", tech: "Bioestimuladores", goal: "Soporte estructural" },
  { name: "Botox Maseteros", tech: "Relajación Muscular", goal: "Afinamiento facial" }
];

const AestheticSimulator: React.FC<AestheticSimulatorProps> = ({ imageSrc, onBack }) => {
  const [loading, setLoading] = useState(false); 
  const [sdkError, setSdkError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<{clientId: string, clientSecret: string} | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Form State
  const [clientIdInput, setClientIdInput] = useState('');
  const [clientSecretInput, setClientSecretInput] = useState('');

  useEffect(() => {
      const storedClientId = localStorage.getItem('mir_pc_client_id');
      const storedClientSecret = localStorage.getItem('mir_pc_client_secret');

      if (storedClientId && storedClientSecret) {
          setCredentials({ clientId: storedClientId, clientSecret: storedClientSecret });
          setLoading(true); 
      }
  }, []);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (clientIdInput && clientSecretInput) {
          localStorage.setItem('mir_pc_client_id', clientIdInput);
          localStorage.setItem('mir_pc_client_secret', clientSecretInput);
          setCredentials({ clientId: clientIdInput, clientSecret: clientSecretInput });
          setLoading(true);
      }
  };

  const handleLogout = () => {
      localStorage.removeItem('mir_pc_client_id');
      localStorage.removeItem('mir_pc_client_secret');
      setCredentials(null);
      window.location.reload();
  };

  useEffect(() => {
    if (!credentials) return;

    let script: HTMLScriptElement | null = null;

    const initPerfectCorpSDK = async () => {
      try {
        if (!window.YMK) {
          script = document.createElement('script');
          script.src = "https://yce-web-sdk.perfectcorp.com/sdk/v1/ycsdk.js"; 
          script.async = true;
          
          await new Promise((resolve, reject) => {
            script!.onload = resolve;
            script!.onerror = () => reject(new Error("Error de conexión con el servidor de análisis biométrico."));
            document.body.appendChild(script!);
          });
        }

        if (window.YMK && containerRef.current) {
          await window.YMK.init({
            container: containerRef.current,
            clientId: credentials.clientId, 
            clientSecret: credentials.clientSecret,
            language: 'es',
            region: 'EU', 
          });

          if (window.YMK.source && imageSrc) {
             window.YMK.source.set(imageSrc);
          }
          
          window.YMK.open();
          setLoading(false);
          // Auto-reveal analysis after a short delay
          setTimeout(() => setShowAnalysis(true), 2500);
        }
      } catch (err: any) {
        setSdkError(err.message || "Error inicializando el análisis facial.");
        setLoading(false);
      }
    };

    initPerfectCorpSDK();

    return () => {
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [imageSrc, credentials]);

  return (
    <div className="animate-fade-in w-full max-w-7xl mx-auto pb-20 px-4">
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <button onClick={onBack} className="text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                REGRESAR A SIMULACIÓN DENTAL
            </button>
            <div className="flex items-center gap-4">
                {credentials && (
                    <button onClick={handleLogout} className="text-[10px] text-red-500/50 hover:text-red-500 font-bold uppercase tracking-widest transition-colors">
                        [ REINICIAR_AUTH ]
                    </button>
                )}
                <div className="bg-indigo-600/10 border border-indigo-500/30 px-6 py-2 rounded-full flex items-center gap-3">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em]">FaceAI: Módulo de Armonización</span>
                </div>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
            
            {/* 1. CONTENEDOR SDK (VISUALIZADOR PRINCIPAL) */}
            <div className="lg:w-2/3 bg-[#121418] rounded-[3rem] overflow-hidden border border-white/5 shadow-3xl relative min-h-[600px] lg:min-h-[800px]">
                
                {/* OVERLAY DE ANÁLISIS MANDIBULAR (Visual Cues) */}
                {showAnalysis && !loading && (
                    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                        {/* Vector de Tensión Mandibular */}
                        <svg className="absolute inset-0 w-full h-full opacity-60">
                            <defs>
                                <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="transparent" />
                                    <stop offset="50%" stopColor="#6366f1" />
                                    <stop offset="100%" stopColor="transparent" />
                                </linearGradient>
                            </defs>
                            <path d="M 30,70 Q 50,95 70,70" stroke="url(#glow)" strokeWidth="2" fill="none" strokeDasharray="10,5" className="animate-[dash_5s_linear_infinite]" transform="scale(1.5)" />
                        </svg>

                        {/* Hotspots en la mandíbula */}
                        <div className="absolute top-[65%] left-[30%] w-32 h-[1px] bg-indigo-500/50 animate-pulse origin-left rotate-45"></div>
                        <div className="absolute top-[65%] right-[30%] w-32 h-[1px] bg-indigo-500/50 animate-pulse origin-right -rotate-45"></div>
                        
                        <div className="absolute top-[62%] left-[28%] bg-indigo-600 p-1.5 rounded-full border-2 border-white shadow-xl animate-bounce"></div>
                        <div className="absolute top-[62%] right-[28%] bg-indigo-600 p-1.5 rounded-full border-2 border-white shadow-xl animate-bounce"></div>
                    </div>
                )}

                {loading && (
                    <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center">
                        <div className="w-20 h-20 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
                        <p className="mt-6 text-indigo-400 font-black text-[10px] uppercase tracking-[0.5em]">Escaneando Geometría Facial...</p>
                    </div>
                )}

                {!credentials && (
                    <div className="absolute inset-0 z-40 bg-slate-900/95 flex items-center justify-center p-8">
                        <div className="w-full max-w-md bg-black/50 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
                             <h3 className="text-white text-2xl font-light mb-8 text-center uppercase tracking-widest">Activación <span className="font-bold text-indigo-500">Módulo Estético</span></h3>
                             <form onSubmit={handleCredentialsSubmit} className="space-y-6">
                                <div>
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Service Client ID</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-xs font-mono focus:border-indigo-500 transition-colors"
                                        placeholder="PC-ID-XXXXX"
                                        value={clientIdInput}
                                        onChange={(e) => setClientIdInput(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Secure Token</label>
                                    <input 
                                        type="password" 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-xs font-mono focus:border-indigo-500 transition-colors"
                                        placeholder="••••••••••••"
                                        value={clientSecretInput}
                                        onChange={(e) => setClientSecretInput(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" variant="secondary" className="w-full !py-6 text-[11px] font-black tracking-[0.2em] shadow-indigo-500/20 shadow-lg">CONECTAR Y ANALIZAR</Button>
                             </form>
                        </div>
                    </div>
                )}

                <div ref={containerRef} className="w-full h-full min-h-[600px] flex-grow"></div>
            </div>

            {/* 2. PANEL DE HALLAZGOS Y RECOMENDACIONES (DERECHA) */}
            <div className={`lg:w-1/3 space-y-8 transition-all duration-700 ${showAnalysis ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
                
                {/* Métrica de Jawline */}
                <div className="bg-[#1a1c22] rounded-[2.5rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors"></div>
                    <h3 className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.5em] mb-10 pb-4 border-b border-white/5">Reporte de Definición Mandibular</h3>
                    
                    <div className="space-y-8">
                        {JawlineMetrics.map((m, idx) => (
                            <div key={idx} className="relative">
                                <div className="flex justify-between items-end mb-3">
                                    <span className="text-[11px] font-bold text-white uppercase tracking-wider">{m.label}</span>
                                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${m.status === 'Ideal' ? 'text-green-400 bg-green-400/10' : 'text-amber-400 bg-amber-400/10'}`}>{m.status}</span>
                                </div>
                                <div className="text-[12px] text-indigo-300 font-mono mb-2">{m.value}</div>
                                <p className="text-[10px] text-slate-500 font-light leading-relaxed">{m.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Plan de Tratamiento Sugerido */}
                <div className="bg-gradient-to-br from-indigo-900/40 to-black rounded-[2.5rem] p-10 border border-indigo-500/20 shadow-2xl">
                    <h3 className="text-white text-xs font-black uppercase tracking-[0.4em] mb-10">Propuesta de Armonización</h3>
                    <div className="space-y-6">
                        {JawlineTreatments.map((t, idx) => (
                            <div key={idx} className="flex items-start gap-5 p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 font-black border border-indigo-500/30 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    {idx + 1}
                                </div>
                                <div>
                                    <h4 className="text-white text-[11px] font-bold uppercase mb-1">{t.name}</h4>
                                    <p className="text-[9px] text-indigo-300 uppercase font-mono tracking-widest mb-1">{t.tech}</p>
                                    <p className="text-[10px] text-slate-500 font-light italic">{t.goal}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <Button 
                        onClick={() => window.open('https://wa.me/56935572986?text=Quiero%20consultar%20por%20el%20Plan%20de%20Armonizac%C3%B3n%20Mandibular%20v4', '_blank')}
                        className="w-full mt-10 !py-5 !bg-indigo-600 !text-white text-[11px] font-black shadow-2xl shadow-indigo-500/40"
                    >
                        SOLICITAR EVALUACIÓN MÉDICA
                    </Button>
                </div>
            </div>
        </div>

        <style>{`
            @keyframes dash {
                to { stroke-dashoffset: -50; }
            }
        `}</style>
    </div>
  );
};

export default AestheticSimulator;