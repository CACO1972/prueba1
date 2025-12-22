import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-12 px-4 text-center border-t border-white/5 bg-[#0f1115]">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
        
        {/* BRANDING */}
        <div className="flex flex-col items-center">
            <h3 className="text-lg font-light tracking-[0.2em] text-white">SIMETRÍA</h3>
            <span className="text-[9px] uppercase tracking-widest text-slate-500">by Clínica Miró</span>
        </div>

        {/* TECH BADGE */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-sm">
             <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
             <span className="text-[9px] text-slate-400 uppercase tracking-widest font-medium">Powered by Gemini 2.5 AI Technology</span>
        </div>

        {/* LEGAL DISCLAIMERS */}
        <div className="text-left md:text-center w-full bg-white/5 p-6 rounded-xl border border-white/5">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 text-center">Aviso Legal & Responsabilidad</h4>
            <div className="grid md:grid-cols-2 gap-4 text-[10px] text-slate-500 leading-relaxed text-justify">
                <p>
                    <strong>1. Simulación No Clínica:</strong> Las imágenes generadas por "Simetría" son representaciones artísticas basadas en Inteligencia Artificial. No constituyen un diagnóstico odontológico, plan de tratamiento médico ni garantía de resultados exactos. La anatomía real del paciente puede limitar los resultados clínicos.
                </p>
                <p>
                    <strong>2. Privacidad de Datos:</strong> Las fotografías subidas se procesan en tiempo real para la generación de la simulación y se eliminan de nuestros servidores de procesamiento inmediato tras la sesión.
                </p>
                <p>
                    <strong>3. Valoración Profesional:</strong> Para un presupuesto y plan de tratamiento definitivo, es obligatoria una evaluación clínica presencial por parte de los especialistas de Clínica Miró.
                </p>
                <p>
                    <strong>4. Términos:</strong> El uso de esta herramienta implica la aceptación de que los resultados son meramente ilustrativos con fines educativos y comerciales.
                </p>
            </div>
        </div>

        <div className="flex flex-col gap-1 mt-4">
            <p className="text-slate-600 text-xs tracking-widest uppercase">&copy; {new Date().getFullYear()} Clínica Miró. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;