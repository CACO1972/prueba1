
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
            const startPos = 0;
            const endPos = 50;
            const duration = 1500;
            const startTime = performance.now();
            
            const animate = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                if (elapsed < duration) {
                    const t = elapsed / duration;
                    const ease = 1 - Math.pow(1 - t, 4); 
                    setSliderPosition(startPos + (endPos - startPos) * ease);
                    requestAnimationFrame(animate);
                } else {
                    setSliderPosition(endPos);
                }
            };
            requestAnimationFrame(animate);
        }, 300);
        return () => clearTimeout(timer);
     }
  }, [zoomMode, tourMode]);

  // --- ENHANCED TOUR HOTSPOTS DATA ---
  const tourPoints = [
      { x: 50, y: 28, title: "Proporción Áurea", desc: "La IA ajusta la altura de los dientes frontales para cumplir con el canon de belleza 1.6:1." },
      { x: 32, y: 42, title: "Soporte Malar", desc: "El volumen dental restaurado devuelve el soporte a los pómulos, rejuveneciendo la expresión facial." },
      { x: 22, y: 72, title: "Ángulo Mandibular", desc: "Definición lineal mejorada mediante el equilibrio de las sombras del tercio inferior." },
      { x: 50, y: 55, title: "Línea Media", desc: "Sincronización exacta del centro dental con el eje vertical de la nariz y el mentón." },
      { x: 40, y: 62, title: "Arco de Sonrisa", desc: "Curvatura convexa que imita la línea del labio inferior para una estética natural y fluida." },
      { x: 68, y: 60, title: "Corredor Bucal", desc: "Reducción de los espacios negros laterales, logrando una sonrisa más amplia y llena." },
      { x: 50, y: 86, title: "Proyección Mentoniana", desc: "Alineación estética del perfil mediante el balance de la oclusión simulada." },
      { x: 45, y: 58, title: "Textura Cerámica", desc: "Micro-relieve y traslucidez de carillas E-Max para un realismo clínico indistinguible." }
  ];

  return (
    <div className="flex flex-col gap-6">
        {/* CONTROLS */}
        <div className="flex justify-between items-center px-4">
            <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-[0.4em] text-amber-500 font-black">Clinical Dashboard</span>
                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">
                    {zoomMode ? "MODO_LUPA_ACTIVO" : (tourMode ? "MODO_TOUR_ANÁLISIS" : "MODO_COMPARATIVA_DRAG")}
                </span>
            </div>
            <div className="flex gap-4">
                <button 
                    onClick={() => { setZoomMode(!zoomMode); setTourMode(false); }}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border ${zoomMode ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}`}
                    title="Zoom / Lupa"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                </button>
                <button 
                    onClick={() => { setTourMode(!tourMode); setZoomMode(false); setSliderPosition(0); }}
                    className={`px-6 h-12 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border transition-all flex items-center gap-3 ${tourMode ? 'bg-indigo-600 text-white border-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.4)]' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}`}
                >
                    <div className={`w-2 h-2 rounded-full ${tourMode ? 'bg-white animate-pulse' : 'bg-indigo-500'}`}></div>
                    Tour Estético
                </button>
            </div>
        </div>

        {/* IMAGE CONTAINER */}
        <div className="relative w-full aspect-[4/5] md:aspect-[4/3] rounded-[3rem] overflow-hidden shadow-3xl border border-white/5 select-none group cursor-crosshair bg-black" 
             ref={containerRef}
             onMouseDown={(e) => { if(!zoomMode) { onMouseDown(); handleMove(e.clientX); } }}
             onTouchStart={(e) => { if(!zoomMode) { onTouchStart(); handleMove(e.touches[0].clientX); } }}
        >
            {/* ZOOM WRAPPER */}
            <div 
                className="relative w-full h-full transition-transform duration-300 ease-out"
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
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
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
                                <div className="relative -ml-4 -mt-4 w-8 h-8 flex items-center justify-center cursor-pointer">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-slate-950 shadow-2xl"></span>
                                </div>
                                
                                {/* Tooltip - HUD Style */}
                                <div className={`absolute ${point.y > 50 ? 'bottom-10' : 'top-10'} left-1/2 -translate-x-1/2 w-64 bg-slate-950/90 backdrop-blur-xl p-5 rounded-2xl border border-amber-500/30 opacity-0 group-hover/hotspot:opacity-100 transition-all duration-300 pointer-events-none transform shadow-2xl z-50 ${point.y > 50 ? 'translate-y-2 group-hover/hotspot:translate-y-0' : '-translate-y-2 group-hover/hotspot:translate-y-0'}`}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                                        <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{point.title}</h4>
                                    </div>
                                    <p className="text-[10px] text-slate-300 leading-relaxed font-light uppercase tracking-widest">{point.desc}</p>
                                    <div className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-950/90 border-r border-b border-amber-500/30 rotate-45 ${point.y > 50 ? '-bottom-2' : '-top-2 !border-t !border-l !border-r-0 !border-b-0'}`}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* SLIDER HANDLE */}
            {!zoomMode && !tourMode && (
                <div 
                    className="absolute top-0 bottom-0 w-[2px] z-30 pointer-events-none"
                    style={{ left: `${sliderPosition}%` }}
                >
                    <div className="absolute inset-0 bg-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.8)]"></div>
                    
                    {/* Handle Icon */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-slate-950 transform active:scale-90 transition-transform">
                        <svg className="w-4 h-4 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                        </svg>
                    </div>
                </div>
            )}
            
            {/* LABELS */}
            {!zoomMode && !tourMode && (
                <>
                    <div className="absolute bottom-8 left-8 bg-black/60 backdrop-blur-xl border border-white/10 text-white text-[9px] px-4 py-2 rounded-full font-black uppercase tracking-[0.3em]">Status: Original</div>
                    <div className="absolute bottom-8 right-8 bg-amber-500/90 backdrop-blur-xl text-slate-950 text-[9px] px-4 py-2 rounded-full font-black uppercase tracking-[0.3em] shadow-xl animate-pulse">Status: Simetría AI</div>
                </>
            )}
        </div>
    </div>
  );
};

export default BeforeAfterSlider;
