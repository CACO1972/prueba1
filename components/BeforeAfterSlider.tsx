import React, { useState, useRef, useEffect, useCallback } from 'react';

interface BeforeAfterSliderProps {
  before: string;
  after: string;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ before, after }) => {
  const [sliderPosition, setSliderPosition] = useState(50); 
  const [isDragging, setIsDragging] = useState(false);
  const [zoomMode, setZoomMode] = useState(false);
  const [tourMode, setTourMode] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle Slider Move
  const handleMove = useCallback((clientX: number) => {
    if (containerRef.current && !zoomMode) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
      setSliderPosition(percentage);
    }
  }, [zoomMode]);

  // Handle Zoom Move
  const handleZoomMove = useCallback((clientX: number, clientY: number) => {
    if (containerRef.current && zoomMode) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;
        setZoomCoords({ x, y });
    }
  }, [zoomMode]);

  const onMouseDown = () => setIsDragging(true);
  const onTouchStart = () => setIsDragging(true);

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !zoomMode) handleMove(e.clientX);
      if (zoomMode) handleZoomMove(e.clientX, e.clientY);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && !zoomMode) handleMove(e.touches[0].clientX);
    };
    const handleTouchEnd = () => setIsDragging(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMove, handleZoomMove, zoomMode]);

  // Intro Animation
  useEffect(() => {
     if (!zoomMode && !tourMode) {
        const timer = setTimeout(() => {
            const start = 0; const end = 50; const duration = 1500;
            const startTime = performance.now();
            const animate = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                if (elapsed < duration) {
                    const t = elapsed / duration;
                    const ease = 1 - Math.pow(1 - t, 4); 
                    setSliderPosition(start + (end - start) * ease);
                    requestAnimationFrame(animate);
                } else {
                    setSliderPosition(end);
                }
            };
            requestAnimationFrame(animate);
        }, 300);
        return () => clearTimeout(timer);
     }
  }, [zoomMode, tourMode]);

  // --- ENHANCED TOUR HOTSPOTS DATA ---
  const tourPoints = [
      { x: 50, y: 52, title: "Línea Media Facial", desc: "Alineación vertical exacta con el eje de simetría del rostro para un equilibrio perfecto." },
      { x: 40, y: 58, title: "Curvatura Labial", desc: "Rediseño de los bordes incisales siguiendo la curvatura natural del labio inferior." },
      { x: 25, y: 40, title: "Soporte de Pómulos", desc: "La nueva estructura dental proporciona un soporte muscular que realza la definición de los pómulos." },
      { x: 50, y: 30, title: "Balance de Tercios", desc: "Armonización de las proporciones entre el tercio medio e inferior para un aspecto más juvenil." },
      { x: 65, y: 55, title: "Corredores Bucales", desc: "Optimización del espacio lateral para una sonrisa más amplia y estéticamente llena." },
      { x: 50, y: 65, title: "Exposición Gingival", desc: "Ajuste preciso de la línea de la encía para un marco dental armónico y saludable." }
  ];

  return (
    <div className="flex flex-col gap-4">
        {/* CONTROLS */}
        <div className="flex justify-between items-center px-2">
            <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                {zoomMode ? "Modo Exploración Detallada" : (tourMode ? "Tour de Análisis Facial Activo" : "Desliza para Comparar")}
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={() => { setZoomMode(!zoomMode); setTourMode(false); }}
                    className={`p-2 rounded-full border transition-all ${zoomMode ? 'bg-amber-500 text-white border-amber-500 shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                    title="Zoom / Lupa"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                </button>
                <button 
                    onClick={() => { setTourMode(!tourMode); setZoomMode(false); setSliderPosition(0); }}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-all flex items-center gap-1 ${tourMode ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Tour Estético
                </button>
            </div>
        </div>

        {/* IMAGE CONTAINER */}
        <div className="relative w-full aspect-[4/5] md:aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border border-slate-200 select-none group cursor-crosshair bg-slate-100" 
             ref={containerRef}
             onMouseDown={(e) => { if(!zoomMode) { onMouseDown(); handleMove(e.clientX); } }}
             onTouchStart={(e) => { if(!zoomMode) { onTouchStart(); handleMove(e.touches[0].clientX); } }}
        >
            {/* ZOOM WRAPPER */}
            <div 
                className="relative w-full h-full transition-transform duration-100 ease-out"
                style={{ 
                    transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`,
                    transform: zoomMode ? 'scale(2.5)' : 'scale(1)'
                }}
            >
                {/* Layer 1: BEFORE (Original) */}
                <img 
                    src={before} 
                    alt="Original" 
                    className="absolute inset-0 w-full h-full object-cover" 
                />

                {/* Layer 2: AFTER (Simulated) - Clipped */}
                <div 
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                    <img 
                        src={after} 
                        alt="Simetría" 
                        className="absolute inset-0 w-full h-full object-cover" 
                    />
                    
                    {/* Gloss Overlay in After Image */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none mix-blend-overlay" />
                </div>

                {/* VIRTUAL TOUR LAYER (Only visible in Tour Mode) */}
                {tourMode && (
                    <div className="absolute inset-0 z-40 animate-fade-in">
                        {tourPoints.map((point, idx) => (
                            <div 
                                key={idx}
                                className="absolute group/hotspot"
                                style={{ left: `${point.x}%`, top: `${point.y}%` }}
                            >
                                {/* Pulse Dot */}
                                <div className="relative -ml-3 -mt-3 w-6 h-6 flex items-center justify-center cursor-pointer">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600 border-2 border-white shadow-[0_0_10px_rgba(79,70,229,0.5)]"></span>
                                </div>
                                
                                {/* Tooltip - Responsive positioning */}
                                <div className={`absolute ${point.y > 50 ? 'bottom-8' : 'top-8'} left-1/2 -translate-x-1/2 w-56 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border-l-4 border-indigo-500 opacity-0 group-hover/hotspot:opacity-100 transition-all duration-300 pointer-events-none transform ${point.y > 50 ? 'translate-y-2 group-hover/hotspot:translate-y-0' : '-translate-y-2 group-hover/hotspot:translate-y-0'}`}>
                                    <h4 className="text-[11px] font-black text-indigo-900 uppercase tracking-widest mb-1.5">{point.title}</h4>
                                    <p className="text-[10px] text-slate-600 leading-relaxed font-medium">{point.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* SLIDER HANDLE (Hidden in Zoom or Full Tour Mode) */}
            {!zoomMode && !tourMode && (
                <div 
                    className="absolute top-0 bottom-0 w-1 z-30 pointer-events-none"
                    style={{ left: `${sliderPosition}%` }}
                >
                    <div className="absolute inset-0 bg-white/80 shadow-[0_0_15px_rgba(0,0,0,0.3)]"></div>
                    
                    {/* Handle Icon */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 shadow-lg border border-slate-100 transform active:scale-95 transition-transform">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                        </svg>
                    </div>
                </div>
            )}
            
            {/* LABELS */}
            {!zoomMode && !tourMode && (
                <>
                    <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur text-white text-[10px] px-2 py-1 rounded font-medium uppercase tracking-wider">Original</div>
                    <div className="absolute bottom-4 right-4 bg-amber-500/90 backdrop-blur text-white text-[10px] px-2 py-1 rounded font-medium uppercase tracking-wider shadow-sm">Simetría</div>
                </>
            )}
        </div>
    </div>
  );
};

export default BeforeAfterSlider;