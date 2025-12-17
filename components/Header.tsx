import React, { memo } from 'react';

// Memoized Logo to prevent re-renders when parent state changes
const Logo = memo(() => (
  <div className="flex items-center gap-4 group cursor-pointer select-none">
    {/* Geometric Stylized Icon representing Symmetry */}
    <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0 text-slate-900 group-hover:text-amber-500 transition-colors duration-300">
       <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full drop-shadow-sm">
          <line x1="50" y1="10" x2="50" y2="90" className="opacity-50" />
          <path d="M50 20 C 70 20, 90 40, 90 50 C 90 60, 70 80, 50 80" />
          <path d="M50 20 C 30 20, 10 40, 10 50 C 10 60, 30 80, 50 80" />
          <circle cx="50" cy="50" r="4" fill="currentColor" className="text-amber-500" stroke="none" />
       </svg>
    </div>
    
    {/* Brand Text - Specific Typography for SIMETRÍA */}
    <div className="flex flex-col justify-center h-full pt-1">
        <h1 className="text-2xl md:text-3xl font-light text-slate-900 leading-none tracking-[0.15em] relative font-sans">
            SIMETRÍA
        </h1>
        <h2 className="text-[9px] md:text-[10px] font-medium text-slate-500 tracking-[0.2em] uppercase leading-none mt-1 ml-0.5 border-t border-slate-300 pt-1 inline-block w-full text-center">
            BY CLÍNICA MIRÓ
        </h2>
    </div>
  </div>
));

Logo.displayName = 'Logo';

const Header = memo(() => {
  return (
    <header className="absolute top-0 left-0 w-full z-40 py-4 px-4 md:px-8 lg:px-12 transition-all duration-300 bg-gradient-to-b from-white/90 to-transparent backdrop-blur-[1px] md:backdrop-blur-none">
      <nav className="flex justify-between items-center max-w-7xl mx-auto">
        <Logo />
        
        {/* Status Indicator - Memoized implicitly as it is static JSX */}
        <div className="hidden sm:flex items-center space-x-2 opacity-0 animate-fade-in bg-white/60 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 shadow-sm" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
             <div className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
             </div>
             <span className="text-[9px] font-semibold text-slate-600 uppercase tracking-widest">IA Activa</span>
        </div>
      </nav>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;