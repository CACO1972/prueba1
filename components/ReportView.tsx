import React, { useState, useEffect } from 'react';
import BeforeAfterSlider from './BeforeAfterSlider';
import Button from './Button';

interface ReportViewProps {
  originalImage: string;
  generatedImage: string;
  onReset: () => void;
}

const AnalysisHotspots = [
  { x: 50, y: 55, label: "LUMINOSIDAD", desc: "Recuperación del blanco natural sin perder textura." },
  { x: 45, y: 35, label: "VECTORES", desc: "Ajuste de soporte en el labio superior para efecto lifting." },
  { x: 55, y: 48, label: "SIMETRÍA", desc: "Equilibrio de troneras y corredores bucales." }
];

const DiagnosticCards = [
  { title: "Efecto Lifting & Flacidez", priority: "ALTA", desc: "Necesidad de recuperación de vectores ascendentes en el tercio inferior." },
  { title: "Perfilado Nariz", priority: "MEDIA", desc: "Optimización del ángulo nasolabial para mejorar la proyección de la sonrisa." },
  { title: "Labios (Volumen y Forma)", priority: "ALTA", desc: "Ajuste de bermellón para enmarcar la nueva estética dental." },
  { title: "Líneas de Expresión", priority: "BAJA", desc: "Tratamiento preventivo para suavizar el contorno periocular al sonreír." }
];

const SymmetryMetrics = [
  { side: "IZQUIERDA", score: "88%", dev: "-1.2mm", status: "Estable" },
  { side: "DERECHA", score: "92%", dev: "+0.8mm", status: "Óptimo" }
];

const RecommendedProcedures = [
  { name: "Armonización con Ácido Hialurónico", target: "Surco Nasogeniano & Labios", duration: "12-18 meses" },
  { name: "Bioestimulación de Colágeno", target: "Tercio Inferior (Jawline)", duration: "24 meses" },
  { name: "Toxina Botulínica Tipo A", target: "Músculo Masetero & Periorbital", duration: "4-6 meses" }
];

const ReportView: React.FC<ReportViewProps> = ({ originalImage, generatedImage, onReset }) => {
  const [isReady, setIsReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(48 * 60 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsReady(true), 500);
          return 100;
        }
        return prev + 1;
      });
    }, 40);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isReady) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
          <div className="relative w-48 h-48 mb-12">
              <svg className="w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-white/5" />
                  <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="2" fill="transparent" 
                      className="text-amber-500 transition-all duration-300" 
                      style={{ strokeDasharray: 502, strokeDashoffset: 502 - (502 * loadingProgress) / 100 }} 
                  />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-white text-3xl font-light tracking-tighter">{loadingProgress}%</span>
                  <span className="text-[8px] text-amber-500 font-black tracking-widest uppercase">Sync_AI</span>
              </div>
          </div>
          <h2 className="text-white text-lg font-light tracking-[0.4em] uppercase mb-4">Computando Diagnóstico 360</h2>
          <div className="space-y-1">
              <p className="text-slate-600 text-[9px] font-mono uppercase tracking-widest">Analizando Hitos Óseos...</p>
              <p className="text-slate-600 text-[9px] font-mono uppercase tracking-widest">Sincronizando Mapeo Facial...</p>
          </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in pb-20 px-4 md:px-0">
      
      {/* 1. HEADER DE PRESTIGIO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 print:mb-8">
          <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white p-2 rounded-xl flex items-center justify-center shadow-xl print:shadow-none print:border print:border-slate-200">
                  <img src="https://mirousa.com/wp-content/uploads/2022/10/logo-miro-vertical.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="text-left">
                  <h1 className="text-3xl md:text-4xl font-light text-white leading-none tracking-tighter print:text-slate-900">INFORME <span className="font-bold text-amber-500">BIOMÉTRICO ELITE</span></h1>
                  <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] mt-2 print:text-slate-400">Symmetry Engine v4.0 &bull; Clínica Miró Certification</p>
              </div>
          </div>
          <div className="no-print hidden md:flex gap-4">
              <button onClick={() => window.print()} className="px-6 py-2 rounded-full border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">Exportar PDF</button>
              <button onClick={onReset} className="px-6 py-2 rounded-full bg-amber-500 text-slate-900 text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Nueva Simulación</button>
          </div>
      </div>

      {/* 2. AREA DE VISUALIZACIÓN INTERACTIVA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 print:gap-4 print:mb-8">
          
          {/* COMPARATIVA PRINCIPAL */}
          <div className="lg:col-span-8 bg-[#121418] rounded-[2.5rem] p-6 md:p-10 border border-white/5 shadow-3xl print:bg-white print:border-slate-200 print:rounded-none print:shadow-none print:p-0">
              <div className="flex justify-between items-center mb-8 print:mb-4">
                  <h3 className="text-xs font-black text-amber-500 uppercase tracking-[0.4em] print:text-amber-700">Arquitectura Dental Dinámica</h3>
                  <div className="flex gap-4 print:hidden">
                       <span className="text-[9px] text-slate-500 font-mono">MAPA_ORO_V4</span>
                       <span className="text-[9px] text-green-500 font-mono">IA_VALID_99.8%</span>
                  </div>
              </div>
              <div className="relative rounded-[2rem] overflow-hidden border border-white/5 shadow-inner print:rounded-none print:border-slate-300">
                  <BeforeAfterSlider before={originalImage} after={generatedImage} />
                  
                  {/* HOTSPOTS INTERACTIVOS - Ocultos en impresión para limpieza visual */}
                  <div className="absolute inset-0 pointer-events-none no-print">
                      {AnalysisHotspots.map((pt, i) => (
                          <div key={i} className="absolute pointer-events-auto group" style={{ left: `${pt.x}%`, top: `${pt.y}%` }}>
                              <button 
                                  onClick={() => setActiveHotspot(activeHotspot === i ? null : i)}
                                  className="relative flex h-6 w-6 items-center justify-center"
                              >
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-40"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white border-2 border-indigo-600 shadow-lg"></span>
                              </button>
                              
                              <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 w-48 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border-l-4 border-indigo-600 transition-all duration-300 ${activeHotspot === i ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4 pointer-events-none'}`}>
                                  <p className="text-[10px] font-black text-indigo-900 uppercase tracking-widest mb-1">{pt.label}</p>
                                  <p className="text-[10px] text-slate-600 leading-tight">{pt.desc}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          {/* DASHBOARD DE MÉTRICAS */}
          <div className="lg:col-span-4 flex flex-col gap-6 print:gap-4">
              <div className="bg-[#1a1c22] rounded-[2rem] p-8 border border-white/5 shadow-2xl flex-grow print:bg-white print:border-slate-200 print:rounded-none print:shadow-none print:p-4">
                  <h3 className="text-xs font-black text-amber-500 uppercase tracking-[0.4em] mb-8 border-b border-white/5 pb-4 print:text-amber-700 print:border-slate-100">Diagnóstico Orofacial</h3>
                  <div className="space-y-6 print:space-y-4">
                      {DiagnosticCards.map((card, i) => (
                          <div key={i} className="group cursor-default">
                              <div className="flex justify-between items-center mb-2">
                                  <h4 className="text-[11px] font-bold text-white uppercase tracking-wider print:text-slate-900">{card.title}</h4>
                                  <span className={`text-[8px] px-2 py-0.5 rounded font-black tracking-widest ${card.priority === 'ALTA' ? 'bg-red-500/20 text-red-400' : card.priority === 'MEDIA' ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'} print:bg-slate-100 print:text-slate-700`}>
                                      {card.priority}
                                  </span>
                              </div>
                              <p className="text-[10px] text-slate-500 leading-relaxed font-light group-hover:text-slate-300 transition-colors print:text-slate-600">{card.desc}</p>
                          </div>
                      ))}
                  </div>
              </div>

              {/* CUPON / CALL TO ACTION (Oculto en parte en PDF) */}
              <div className="bg-gradient-to-br from-amber-600 to-amber-400 rounded-[2.5rem] p-8 text-center shadow-3xl relative overflow-hidden group print:bg-none print:bg-slate-50 print:border print:border-slate-200 print:rounded-none print:shadow-none print:p-6">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)] print:hidden"></div>
                  <span className="text-[9px] font-black text-slate-900 uppercase tracking-[0.4em] mb-2 block relative z-10">Beneficio Reservado</span>
                  <h2 className="text-4xl font-black text-slate-900 mb-6 italic tracking-tighter relative z-10">10% <span className="text-white print:text-amber-700">DESC</span></h2>
                  
                  <div className="bg-white/10 backdrop-blur border border-white/20 py-4 rounded-2xl mb-6 relative z-10 print:bg-white print:border-slate-300">
                      <p className="text-[9px] text-slate-800 font-bold uppercase tracking-widest mb-1">CÓDIGO DE VALIDACIÓN</p>
                      <p className="text-2xl font-mono font-black text-slate-900">SIMETRIA-V4</p>
                  </div>

                  <div className="no-print">
                      <a 
                        href="https://wa.me/56935572986?text=Hola%2C%20tengo%20mi%20Informe%20Elite%20y%20quiero%20mi%20evaluaci%C3%B3n%20para%20usar%20mi%20cup%C3%B3n%20SIMETRIA-V4"
                        target="_blank"
                        className="block w-full bg-slate-900 text-white font-black py-5 rounded-2xl text-[12px] uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-800 transition-all relative z-10"
                      >
                        Agendar Evaluación
                      </a>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-center gap-2 text-slate-800 text-[9px] font-black uppercase tracking-widest relative z-10 print:mt-2">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse print:animate-none"></span>
                      Validez: <span className="text-slate-900 font-mono">48 HORAS POST-EMISIÓN</span>
                  </div>
              </div>
          </div>
      </div>

      {/* 3. NUEVA SECCIÓN: ANÁLISIS DE SIMETRÍA BILATERAL (Elite Content) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 print:gap-4 print:mb-8 page-break-before">
          <div className="bg-[#1a1c22] rounded-[2.5rem] p-10 border border-white/5 print:bg-white print:border-slate-200 print:rounded-none print:p-6">
              <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em] mb-8 print:text-indigo-800">Comparativa de Perfiles</h3>
              <div className="flex gap-4 mb-8">
                  <div className="flex-1 aspect-square rounded-3xl bg-slate-800 overflow-hidden relative border border-white/5 print:border-slate-300">
                      <img src={originalImage} className="w-full h-full object-cover scale-150 origin-left grayscale" alt="Profile L" />
                      <div className="absolute inset-0 bg-indigo-500/10"></div>
                      <span className="absolute bottom-4 left-4 text-[8px] font-black text-white bg-black/50 px-2 py-1 rounded">IZQUIERDO</span>
                  </div>
                  <div className="flex-1 aspect-square rounded-3xl bg-slate-800 overflow-hidden relative border border-white/5 print:border-slate-300">
                      <img src={originalImage} className="w-full h-full object-cover scale-150 origin-right grayscale" alt="Profile R" />
                      <div className="absolute inset-0 bg-indigo-500/10"></div>
                      <span className="absolute bottom-4 right-4 text-[8px] font-black text-white bg-black/50 px-2 py-1 rounded">DERECHO</span>
                  </div>
              </div>
              <div className="space-y-4">
                  {SymmetryMetrics.map((m, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-white/5 pb-2 print:border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 print:text-slate-600">{m.side}</span>
                          <div className="flex gap-6">
                              <div className="text-right">
                                  <span className="block text-[8px] text-slate-600 uppercase">Score</span>
                                  <span className="text-[11px] font-mono text-white print:text-slate-900">{m.score}</span>
                              </div>
                              <div className="text-right">
                                  <span className="block text-[8px] text-slate-600 uppercase">Dev</span>
                                  <span className="text-[11px] font-mono text-white print:text-slate-900">{m.dev}</span>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          <div className="bg-[#1a1c22] rounded-[2.5rem] p-10 border border-white/5 print:bg-white print:border-slate-200 print:rounded-none print:p-6">
              <h3 className="text-xs font-black text-amber-500 uppercase tracking-[0.4em] mb-8 print:text-amber-800">Plan Estético Recomendado</h3>
              <div className="space-y-6">
                  {RecommendedProcedures.map((proc, i) => (
                      <div key={i} className="relative pl-6 border-l border-amber-500/30">
                          <div className="absolute top-0 left-[-4px] w-2 h-2 rounded-full bg-amber-500"></div>
                          <h4 className="text-[11px] font-bold text-white uppercase mb-1 print:text-slate-900">{proc.name}</h4>
                          <p className="text-[9px] text-slate-500 mb-1 print:text-slate-600"><span className="font-bold text-slate-400">Zona:</span> {proc.target}</p>
                          <p className="text-[8px] font-mono text-amber-500/70 uppercase">Efectividad Estimada: {proc.duration}</p>
                      </div>
                  ))}
              </div>
              <div className="mt-10 p-4 bg-white/5 rounded-2xl border border-white/5 print:bg-slate-50 print:border-slate-200">
                  <p className="text-[9px] text-slate-500 italic leading-relaxed print:text-slate-600">
                      * Este plan es preliminar. Los procedimientos no invasivos sugeridos complementan el diseño de sonrisa para lograr una armonización facial completa (Full Face Approach).
                  </p>
              </div>
          </div>
      </div>

      {/* 4. SECCIÓN EBOOKS Y ASSETS */}
      <div className="bg-[#1a1c22] rounded-[3rem] p-10 md:p-16 border border-white/5 mb-20 text-center relative overflow-hidden print:bg-white print:border-slate-200 print:rounded-none print:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] -z-0 print:hidden"></div>
          <div className="max-w-3xl mx-auto relative z-10">
              <h3 className="text-xl md:text-2xl text-white font-light tracking-widest mb-12 print:text-slate-900">CERTIFICACIÓN <span className="text-amber-500 font-bold">ESTÁNDAR MIRÓ</span></h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 print:gap-4">
                  {[
                      { icon: "📄", title: "Guía de Implantes", detail: "Todo antes de elegir" },
                      { icon: "✨", title: "Botox Estético", detail: "Manejo de arrugas" },
                      { icon: "🕒", title: "Evaluación Online", detail: "Sesión personalizada" }
                  ].map((asset, i) => (
                      <div key={i} className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-amber-500/30 transition-all group print:bg-white print:border-slate-200 print:p-4">
                          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform print:text-2xl print:mb-2">{asset.icon}</div>
                          <h4 className="text-white text-xs font-black uppercase tracking-widest mb-2 print:text-slate-900">{asset.title}</h4>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest print:text-slate-600">{asset.detail}</p>
                          <div className="no-print">
                            <button className="mt-6 text-[8px] font-black text-amber-500 uppercase tracking-widest border-b border-amber-500/20 pb-1">Disponible para descarga</button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      <style>{`
          @media print {
              .no-print { display: none !important; }
              body { background: white !important; color: black !important; padding: 0 !important; margin: 0 !important; }
              .bg-[#121418], .bg-[#1a1c22] { background: white !important; border-color: #eee !important; box-shadow: none !important; }
              .text-white { color: #1a1a1a !important; }
              .text-slate-500, .text-slate-400 { color: #666 !important; }
              .text-amber-500 { color: #854d0e !important; }
              .rounded-[2.5rem], .rounded-[3rem], .rounded-[2rem] { border-radius: 8px !important; }
              .page-break-before { page-break-before: always; }
              header, footer, .glow-effect { display: none !important; }
              .aspect-square { height: 150px !important; }
              main { padding-top: 0 !important; }
          }
          /* Safari iOS Fixes */
          body { -webkit-font-smoothing: antialiased; }
          .shadow-3xl { box-shadow: 0 50px 100px -20px rgba(0,0,0,0.8); }
      `}</style>
    </div>
  );
};

export default ReportView;