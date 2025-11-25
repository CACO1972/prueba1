import React, { useState, useRef, useEffect, useCallback } from 'react';

interface BeforeAfterSliderProps {
  before: string;
  after: string;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ before, after }) => {
  const [sliderPosition, setSliderPosition] = useState(0); // 0 = Full Before, 100 = Full After
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
      setSliderPosition(percentage);
    }
  }, []);

  const onMouseDown = () => setIsDragging(true);
  const onTouchStart = () => setIsDragging(true);

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMove(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) handleMove(e.touches[0].clientX);
    };
    const handleTouchEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMove]);

  // Animation on mount: Reveal effect
  useEffect(() => {
     // Start at 0 (Before), wipe to 50%
     const timer = setTimeout(() => {
         const start = 0;
         const end = 50;
         const duration = 1200;
         const startTime = performance.now();

         const animate = (currentTime: number) => {
             const elapsed = currentTime - startTime;
             if (elapsed < duration) {
                 // EaseOutCubic
                 const t = elapsed / duration;
                 const easeOut = 1 - Math.pow(1 - t, 3);
                 setSliderPosition(start + (end - start) * easeOut);
                 requestAnimationFrame(animate);
             } else {
                 setSliderPosition(end);
             }
         };
         requestAnimationFrame(animate);
     }, 500);
     return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full max-w-3xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-gray-700 select-none group cursor-ew-resize" 
         ref={containerRef}
         onMouseDown={(e) => { onMouseDown(); handleMove(e.clientX); }}
         onTouchStart={(e) => { onTouchStart(); handleMove(e.touches[0].clientX); }}
    >
        {/* Base Layer: Before Image (Controls height) */}
        <img 
          src={before} 
          alt="Antes" 
          className="w-full h-auto block pointer-events-none select-none" 
        />
        
        {/* Top Layer: After Image (Clipped) */}
        <div 
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
            <img 
              src={after} 
              alt="Después" 
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none" 
            />
        </div>

        {/* Slider Handle Line */}
        <div 
            className="absolute top-0 bottom-0 w-0.5 bg-white/80 shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10 pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
        >
            {/* Handle Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-amber-500/90 border-2 border-white rounded-full shadow-lg flex items-center justify-center text-white backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M15.75 11.25v1.5H9.75l2.625 2.625-1.06 1.06L6.56 11.25l4.755-5.185 1.06 1.06L9.75 9.75h6ZM18 12a.75.75 0 0 1-.75.75H18a.75.75 0 0 1 0-1.5h.01A.75.75 0 0 1 18 12Z" clipRule="evenodd" />
                    <path d="M12 2.25a.75.75 0 0 1 .75.75v18a.75.75 0 0 1-1.5 0v-18a.75.75 0 0 1 .75-.75Z" fillOpacity="0" />
                    <path d="M8.25 12l3.75-3.75 3.75 3.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" className="hidden"/>
                    <g transform="rotate(90 12 12)">
                       <path d="M8 12L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                       <path d="M11 9L8 12L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                       <path d="M13 9L16 12L13 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </g>
                </svg>
            </div>
        </div>

        {/* Floating Labels */}
        <div className={`absolute top-4 left-4 bg-white/90 text-amber-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md transition-opacity duration-300 border border-slate-200 shadow-sm ${sliderPosition < 10 ? 'opacity-0' : 'opacity-100'}`}>
            Después
        </div>
        <div className={`absolute top-4 right-4 bg-white/90 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md transition-opacity duration-300 border border-slate-200 shadow-sm ${sliderPosition > 90 ? 'opacity-0' : 'opacity-100'}`}>
            Antes
        </div>
    </div>
  );
};

export default BeforeAfterSlider;