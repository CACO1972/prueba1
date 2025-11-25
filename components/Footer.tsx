import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 px-4 text-center border-t border-slate-200 bg-white">
      <div className="flex flex-col items-center gap-4">
        
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
             <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
             <span className="text-[9px] text-slate-500 uppercase tracking-widest">Powered by Gemini 2.5 AI</span>
        </div>

        <div className="flex flex-col gap-1">
            <p className="text-slate-400 text-xs tracking-widest uppercase">&copy; {new Date().getFullYear()} Clínica Miró. All rights reserved.</p>
            <p className="text-slate-500 text-[10px] max-w-md mx-auto leading-relaxed">
                La simulación es una representación artística generada por Inteligencia Artificial con fines ilustrativos y no constituye un diagnóstico médico definitivo.
            </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;