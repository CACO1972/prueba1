
import React, { useState, useEffect } from 'react';
import BeforeAfterSlider from './BeforeAfterSlider';
import Button from './Button';

interface ReportViewProps {
  originalImage: string;
  generatedImage: string;
  onReset: () => void;
}

const ReportView: React.FC<ReportViewProps> = ({ originalImage, generatedImage, onReset }) => {
  const [isReady, setIsReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsReady(true), 1200);
          return 100;
        }
        return prev + 1.8;
      });
    }, 40);
    return () => clearInterval(timer);
  }, []);

  if (!isReady) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#050608] flex flex-col items-center justify-center p-8 text-center">
          <div className="w-64 h-64 mb-16 relative flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-amber-500/10 rounded-full animate-pulse"></div>
              <div className="absolute inset-[-20px] border border-indigo-500/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
              <div className="text-center z-10">
                  <span className="text-white text-7xl font-light tracking-tighter">{Math.round(loadingProgress)}%</span>
                  <p className="text-[10px] text-amber-500 font-black tracking-[0.8em] uppercase mt-6 animate-pulse">GENERATING_ELITE_ASSETS</p>
              </div>
          </div>
          <h2 className="text-white text-3xl font-light tracking-[0.5em] uppercase mb-6 italic">Sincronizando Parámetros Miró v4</h2>
          <p className="text-slate-600 text-[10px] uppercase tracking-[0.4em] font-mono max-w-sm leading-relaxed">Ajustando proporciones áureas y calibrando tonalidad de porcelana para exportación final...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in pb-40 px-6">
      
      {/* HEADER DE GRADO CLÍNICO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-32 gap-12 border-b border-white/5 pb-20 no-print">
          <div className="flex items-center gap-10">
              <div className="w-24 h-24 bg-white p-4 rounded-[2rem] shadow-2xl">
                  <img src="https://mirousa.com/wp-content/uploads/2022/10/logo-miro-vertical.png" className="w-full h-full object-contain" alt="Miró" />
              </div>
              <div className="space-y-4 text-left">
                  <div className="flex items-center gap-4">
                    <span className="px-5 py-2 bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-[0.4em] rounded-full">CERTIFICADO PREMIUM</span>
                    <span className="text-slate-500 text-[9px] font-mono tracking-widest uppercase">REF: MR4-ELITE-X2</span>
                  </div>
                  <h1 className="text-6xl md:text-8xl font-light text-white leading-none tracking-tighter uppercase italic">REPORT <span className="font-bold text-amber-500 not-italic">ELITE</span></h1>
                  <p className="text-[11px] text-slate-500 uppercase tracking-[0.6em] font-black">Clinical Standard for Digital Smile Design &bull; Clínica Miró Chile</p>
              </div>
          </div>
          <div className="flex gap-6 w-full md:w-auto">
              <Button onClick={() => window.print()} variant="outline" className="flex-grow md:flex-grow-0 !py-6">DESCARGAR PDF</Button>
              <Button onClick={onReset} className="flex-grow md:flex-grow-0 !py-6 !bg-amber-500 !text-slate-950">NUEVA SIMULACIÓN</Button>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 no-print">
          
          <div className="lg:col-span-8 space-y-24">
              
              {/* Main Visual Analysis */}
              <div className="bg-[#121418] rounded-[5rem] p-12 md:p-20 border border-white/5 shadow-3xl relative overflow-hidden group">
                  <div className="absolute top-12 left-16 flex items-center gap-6 z-10">
                      <div className="w-4 h-4 bg-amber-500 rounded-full animate-ping"></div>
                      <span className="text-[12px] font-black text-amber-500 uppercase tracking-[0.6em]">SIMULACIÓN 4K ACTIVE_VIEW</span>
                  </div>
                  <div className="rounded-[4rem] overflow-hidden border border-white/10 mt-16 shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
                      <BeforeAfterSlider before={originalImage} after={generatedImage} />
                  </div>
              </div>

              {/* Advanced Clinical Diagnostics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {[
                    { label: "Smile Curve Score", val: "98.5/100", desc: "Alineación perfecta del borde incisal con el labio inferior.", color: "text-green-400" },
                    { label: "Golden Ratio", val: "1.618:1", desc: "Proporciones áureas detectadas en el sector anterior.", color: "text-amber-500" },
                    { label: "Veneer Material", val: "E-MAX PRO", desc: "Se recomienda porcelana de alta translucidez para este caso.", color: "text-indigo-400" }
                  ].map((stat, i) => (
                    <div key={i} className="bg-[#0f1115] rounded-[3rem] p-12 border border-white/5 hover:border-white/20 transition-all text-center group">
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] block mb-6">{stat.label}</span>
                        <p className={`text-4xl font-black ${stat.color} italic mb-4 tracking-tighter`}>{stat.val}</p>
                        <p className="text-[10px] text-slate-400 font-light uppercase tracking-widest leading-relaxed">{stat.desc}</p>
                    </div>
                  ))}
              </div>

              {/* Geometric Analysis Map */}
              <div className="bg-[#121418] rounded-[4rem] p-16 border border-white/5 relative overflow-hidden">
                  <h3 className="text-white text-2xl font-light uppercase tracking-[0.5em] mb-12 italic">Mapeo Biométrico Dental</h3>
                  <div className="grid md:grid-cols-2 gap-16">
                      <div className="space-y-6">
                          <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Sector Anterior</h4>
                          <ul className="space-y-4">
                              <li className="flex justify-between text-[11px] border-b border-white/5 pb-2">
                                  <span className="text-slate-400">Línea Media Facial</span>
                                  <span className="text-white font-mono">Centrada [0.1mm]</span>
                              </li>
                              <li className="flex justify-between text-[11px] border-b border-white/5 pb-2">
                                  <span className="text-slate-400">Exposición Gingival</span>
                                  <span className="text-white font-mono">Optimizada [2.5mm]</span>
                              </li>
                          </ul>
                      </div>
                      <div className="space-y-6">
                          <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Sector Posterior</h4>
                          <ul className="space-y-4">
                              <li className="flex justify-between text-[11px] border-b border-white/5 pb-2">
                                  <span className="text-slate-400">Corredores Bucales</span>
                                  <span className="text-white font-mono">Ampliación Sugerida</span>
                              </li>
                              <li className="flex justify-between text-[11px] border-b border-white/5 pb-2">
                                  <span className="text-slate-400">Plano Oclusal</span>
                                  <span className="text-white font-mono">Horizontal [99%]</span>
                              </li>
                          </ul>
                      </div>
                  </div>
              </div>
          </div>

          {/* SIDEBAR CONVERSION MODS */}
          <div className="lg:col-span-4 space-y-12">
              
              {/* Conversion Card: VIP Treatment */}
              <div className="bg-gradient-to-br from-indigo-900/40 to-black rounded-[4rem] p-14 border border-indigo-500/20 shadow-2xl relative group overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full animate-pulse"></div>
                  <h3 className="text-white text-xl font-bold uppercase tracking-widest mb-10 relative">Siguiente Paso <span className="text-indigo-400 italic">Clínico</span></h3>
                  <p className="text-slate-400 text-sm mb-12 leading-relaxed uppercase tracking-widest font-light">Para validar este informe, es necesaria una <span className="text-white font-bold">Evaluación 3D</span> presencial con nuestro Director Médico.</p>
                  
                  <div className="space-y-6 mb-12">
                      <div className="flex items-center gap-4 text-[10px] text-indigo-300 font-bold uppercase tracking-widest">
                          <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Prioridad en Agenda
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-indigo-300 font-bold uppercase tracking-widest">
                          <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Escaneo Iterativo Gratis
                      </div>
                  </div>

                  <a 
                    href={`https://wa.me/56935572986?text=Hola%2C%20tengo%20mi%20Informe%20Elite%20REF%3AMR4-ELITE-X2%20y%20quiero%20mi%20evaluaci%C3%B3n%20presencial%20prioritaria`}
                    target="_blank"
                    className="block w-full bg-indigo-600 text-white font-black py-8 rounded-full text-[12px] uppercase tracking-widest text-center shadow-2xl shadow-indigo-600/30 hover:scale-105 transition-all"
                  >
                    RESERVAR EVALUACIÓN
                  </a>
              </div>

              {/* Upsell: Aesthetic Module */}
              <div className="bg-[#1a1c22] rounded-[4rem] p-14 border border-white/5">
                  <span className="text-amber-500 text-[9px] font-black uppercase tracking-widest block mb-4">MÓDULO ADICIONAL DISPONIBLE</span>
                  <h3 className="text-white text-lg font-light uppercase tracking-widest mb-8 italic">Análisis de <span className="font-bold">Armonía Facial</span></h3>
                  <p className="text-slate-500 text-[10px] mb-10 uppercase tracking-widest leading-relaxed">Completa tu transformación analizando la mandíbula y el mentón para un balance total.</p>
                  <Button onClick={() => window.location.hash = '#aesthetic'} className="w-full !py-6 !text-[10px]">ANALIZAR ROSTRO</Button>
              </div>
          </div>
      </div>

      <style>{`
        @media screen {
            .only-print { display: none; }
        }
        @media print {
            body { background: white !important; margin: 0; padding: 20px; }
            .no-print { display: none !important; }
            .only-print { display: block !important; }
            @page { size: A4; margin: 0; }
        }
      `}</style>
    </div>
  );
};

export default ReportView;
