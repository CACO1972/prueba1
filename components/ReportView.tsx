import React, { useState, useEffect } from 'react';
import BeforeAfterSlider from './BeforeAfterSlider';
import Button from './Button';

interface ReportViewProps {
  originalImage: string;
  generatedImage: string;
  onReset: () => void;
}

const ReportView: React.FC<ReportViewProps> = ({ originalImage, generatedImage, onReset }) => {
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(48 * 60 * 60); // 48 hours in seconds

  useEffect(() => {
    // Simulate "Generating Report" delay
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
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

  const handleDownloadImage = () => {
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `clinica-miro-diseño-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-fade-in">
        <div className="relative w-24 h-24 mb-6">
           <div className="absolute inset-0 border-t-2 border-amber-500 rounded-full animate-spin"></div>
           <div className="absolute inset-2 border-r-2 border-cyan-400 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
           <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-amber-500 animate-pulse">
             AI
           </div>
        </div>
        <h2 className="text-xl font-light text-slate-800 tracking-widest uppercase">Generando Informe Clínico</h2>
        <p className="text-slate-500 text-sm mt-2">Compilando análisis biométrico y presupuesto...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in pb-20">
      {/* --- HEADER REPORT --- */}
      <div className="bg-slate-900 text-white p-6 md:p-10 rounded-t-2xl shadow-2xl relative overflow-hidden border-b border-amber-500/30">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="white"><path d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z" /></svg>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <span className="bg-amber-500 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Premium Access</span>
               <span className="text-slate-400 text-xs font-mono">ID: #{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-light tracking-wide text-white">Informe de Diseño Digital</h1>
            <p className="text-slate-400 mt-1 font-light">Análisis asistido por Inteligencia Artificial - Clínica Miró</p>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-2xl font-bold text-amber-400">{new Date().toLocaleDateString()}</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest">Fecha de Emisión</div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="bg-white shadow-xl rounded-b-2xl overflow-hidden border border-slate-200">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* LEFT COLUMN: VISUALS (7/12) */}
          <div className="lg:col-span-7 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              Simulación de Resultado
            </h3>
            
            <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200 mb-6">
              <BeforeAfterSlider before={originalImage} after={generatedImage} />
            </div>

            <div className="grid grid-cols-3 gap-4">
               {[
                 { label: "Estética", val: "98%", color: "text-emerald-600" },
                 { label: "Simetría", val: "94%", color: "text-blue-600" },
                 { label: "Armonía", val: "Alta", color: "text-amber-600" }
               ].map((stat, i) => (
                 <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 text-center shadow-sm">
                    <div className={`text-xl font-bold ${stat.color}`}>{stat.val}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">{stat.label}</div>
                 </div>
               ))}
            </div>
          </div>

          {/* RIGHT COLUMN: ANALYSIS & ACTIONS (5/12) */}
          <div className="lg:col-span-5 bg-white p-6 md:p-8 flex flex-col h-full relative">
             
             {/* ANALYSIS LIST */}
             <div className="mb-8">
               <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Hallazgos Clínicos (IA)</h3>
               <ul className="space-y-4">
                 {[
                   "Alineación del arco dental superior optimizada.",
                   "Corrección de luminosidad y tono (B1/BL1).",
                   "Rediseño de bordes incisales para rejuvenecimiento.",
                   "Proporción áurea aplicada a la línea de la sonrisa."
                 ].map((item, i) => (
                   <li key={i} className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed">
                     <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                     </svg>
                     {item}
                   </li>
                 ))}
               </ul>
             </div>

             {/* BUDGET ESTIMATION */}
             <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-xs font-bold text-slate-500 uppercase">Presupuesto Estimado</span>
                   <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">Ref. Carillas Cerámicas</span>
                </div>
                <div className="text-3xl font-light text-slate-800">
                   $1.8M <span className="text-lg text-slate-400">-</span> $2.8M <span className="text-xs text-slate-400 font-medium">CLP</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 italic">*Valores referenciales sujetos a evaluación clínica presencial.</p>
             </div>

             {/* COUPON TICKET */}
             <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-5 text-white overflow-hidden shadow-lg group hover:shadow-amber-500/20 transition-all cursor-pointer border border-slate-700 mb-auto">
                <div className="absolute right-0 top-0 h-full w-24 bg-white/5 skew-x-12 transform translate-x-12 group-hover:translate-x-full transition-transform duration-700"></div>
                
                <div className="flex justify-between items-start relative z-10">
                   <div>
                      <div className="text-amber-400 font-bold text-xs uppercase tracking-widest mb-1">Tu Beneficio Exclusivo</div>
                      <div className="text-2xl font-bold text-white">10% DESCUENTO</div>
                      <div className="text-xs text-slate-400 mt-1">En tu tratamiento de diseño de sonrisa.</div>
                   </div>
                   <div className="text-right">
                      <div className="text-[10px] text-slate-500 uppercase">Vence en</div>
                      <div className="font-mono text-amber-400 text-lg font-bold">{formatTime(timeLeft)}</div>
                   </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                   <span className="font-mono text-slate-400 tracking-[0.2em] text-sm">CÓDIGO:</span>
                   <span className="font-mono bg-white/10 px-3 py-1 rounded text-amber-300 font-bold tracking-widest border border-amber-500/30">MIRO-AI-2024</span>
                </div>
             </div>

             {/* ACTIONS */}
             <div className="mt-8 space-y-3">
               <Button onClick={() => window.open('https://wa.me/56935572986?text=Hola,%20tengo%20mi%20código%20MIRO-AI-2024%20y%20quiero%20agendar%20mi%20evaluación', '_blank')} className="w-full py-4 text-sm font-bold shadow-lg shadow-amber-500/20">
                  AGENDAR Y APLICAR DESCUENTO
               </Button>
               
               <div className="grid grid-cols-2 gap-3">
                 <button onClick={handleDownloadImage} className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-lg text-slate-600 text-xs font-bold uppercase hover:bg-slate-50 transition-colors">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                   Imagen HD
                 </button>
                 <button onClick={handlePrintReport} className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-lg text-slate-600 text-xs font-bold uppercase hover:bg-slate-50 transition-colors">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                   Imprimir PDF
                 </button>
               </div>
             </div>

          </div>
        </div>
      </div>
      
      <div className="text-center mt-8">
        <button onClick={onReset} className="text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-widest transition-colors">
           ← Iniciar Nueva Simulación
        </button>
      </div>

    </div>
  );
};

export default ReportView;
