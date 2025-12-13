
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface BeforeAfterSliderProps {
  before: string;
  after: string;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ before, after }) => {
  const [sliderPosition, setSliderPosition] = useState(50); 
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

  // Intro Animation: Scan back and forth once to show the effect
  useEffect(() => {
     const timer = setTimeout(() => {
         const start = 0; // Start fully covered
         const end = 50;  // End in middle
         const duration = 1500;
         const startTime = performance.now();

         const animate = (currentTime: number) => {
             const elapsed = currentTime - startTime;
             if (elapsed < duration) {
                 // Elastic ease out
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
  }, []);

  return (
    <div className="relative w-full max-w-3xl mx-auto rounded-xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border border-slate-800/50 select-none group cursor-ew-resize bg-slate-900" 
         ref={containerRef}
         onMouseDown={(e) => { onMouseDown(); handleMove(e.clientX); }}
         onTouchStart={(e) => { onTouchStart(); handleMove(e.touches[0].clientX); }}
    >
        {/* Base Layer: Before Image */}
        <div className="relative">
            <img 
              src={before} 
              alt="Antes" 
              className="w-full h-auto block pointer-events-none select-none filter sepia-[0.2] grayscale-[0.3]" 
            />
            {/* "Before" Label integrated */}
            <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md border border-white/10 text-white/70 px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase">
                Original
            </div>
        </div>
        
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
            
            {/* Gloss/Shine Effect on the After image to emphasize "New Teeth" */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-100%] animate-[shimmer_3s_infinite_delay-1000ms] pointer-events-none" />
            
            {/* "After" Label integrated */}
            <div className="absolute top-4 right-4 bg-amber-500/90 backdrop-blur-md text-slate-900 px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase shadow-lg shadow-amber-500/20">
                Diseño IA
            </div>
        </div>

        {/* The "Laser" Scanner Line */}
        <div 
            className="absolute top-0 bottom-0 w-1 z-20 pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
        >
            {/* Central Line */}
            <div className="absolute inset-0 bg-amber-400"></div>
            {/* Glow Bloom */}
            <div className="absolute inset-y-0 -left-4 -right-4 bg-amber-500/30 blur-md"></div>
            
            {/* The Handle - Hexagon Tech Style */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 group-active:scale-110 transition-transform duration-150">
                {/* Outer Glow */}
                <div className="absolute inset-0 bg-amber-500 blur-lg opacity-50 rounded-full animate-pulse"></div>
                
                {/* Hexagon Shape */}
                <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg text-slate-900 fill-current">
                        <path d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z" fill="white" stroke="#F59E0B" strokeWidth="3" />
                    </svg>
                    
                    {/* Inner Icons */}
                    <div className="absolute inset-0 flex items-center justify-center gap-1 text-amber-500">
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                             <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                         </svg>
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                             <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                         </svg>
                    </div>
                </div>
            </div>
        </div>

        <style>{`
            @keyframes shimmer {
                0% { transform: translateX(-100%) skewX(12deg); }
                20% { transform: translateX(200%) skewX(12deg); }
                100% { transform: translateX(200%) skewX(12deg); }
            }
        `}</style>
    </div>
  );
};

export default BeforeAfterSlider;
