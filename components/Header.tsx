import React, { memo } from 'react';

// Memoized Logo to prevent re-renders when parent state changes
const Logo = memo(() => (
  <div className="flex items-center gap-3 group cursor-pointer select-none">
    {/* Geometric Hexagon Icon */}
    <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0 text-slate-900 group-hover:text-amber-500 transition-colors duration-300">
      <svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
         {/* Constructing the Hexagonal Aperture Icon using 6 rotated segments */}
         {[0, 60, 120, 180, 240, 300].map((angle, i) => (
           <g key={i} transform={`rotate(${angle} 50 50)`}>
             {/* Each segment is an angled bracket forming the hexagon */}
             <path 
                d="M50 18 L70 18 L62 32 L50 32 Z" 
                opacity="0.9"
             />
             <path 
                d="M72 18 L88 46 L80 46 L68 25 Z" 
                opacity="1"
             />
           </g>
         ))}
         {/* Center Hexagon Negative Space */}
         <circle cx="50" cy="50" r="12" fill="none" />
      </svg>
    </div>
    
    {/* Brand Text - Specific Typography */}
    <div className="flex flex-col justify-center h-full pt-1">
        <h2 className="text-[10px] md:text-[11px] font-medium text-slate-900 tracking-[0.35em] uppercase leading-none mb-1 ml-0.5">
            Clinica
        </h2>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-none tracking-[0.05em] relative font-sans">
            MIRŌ
            {/* Custom visual touch to ensure the macron over the O looks distinct if font doesn't support it well, 
                though we use the character Ō here. */}
        </h1>
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
             <span className="text-[9px] font-semibold text-slate-600 uppercase tracking-widest">Sistema Online</span>
        </div>
      </nav>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;