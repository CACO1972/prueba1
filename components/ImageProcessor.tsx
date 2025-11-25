import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import Button from './Button';
import Spinner from './Spinner';
import ContactForm from './ContactForm';
import BeforeAfterSlider from './BeforeAfterSlider';
import { AppStep } from '../App';

interface ImageProcessorProps {
  step: AppStep;
  originalImage: string | null;
  generatedImage: string | null;
  onSimulationComplete: (original: string, generated: string) => void;
  onReset: () => void;
}

// Helper to convert data URL to File object
const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) throw new Error("Invalid data URL");
  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type:mime});
};

// Watermark Helper Function
const addWatermark = async (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
          resolve(imageUrl);
          return;
      }

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Dimensions
      const w = canvas.width;
      const h = canvas.height;

      // Gradient Overlay at bottom
      const gradientHeight = h * 0.25;
      const gradient = ctx.createLinearGradient(0, h - gradientHeight, 0, h);
      gradient.addColorStop(0, "transparent");
      gradient.addColorStop(1, "rgba(0,0,0,0.95)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, h - gradientHeight, w, gradientHeight);

      // Logo Calculation
      const logoSize = Math.min(w * 0.18, 220); 
      const padding = w * 0.05;
      
      // Draw Text
      const fontSizeTitle = logoSize * 0.35; // MIRŌ
      const fontSizeSub = logoSize * 0.14; // CLINICA
      const fontSizeTagline = logoSize * 0.12; // DISEÑO IA
      
      ctx.textAlign = "right";
      
      // "CLINICA" (Small top text)
      ctx.font = `500 ${fontSizeSub}px "Jost", sans-serif`;
      ctx.fillStyle = "#e2e8f0";
      // Manually implementing letter spacing for canvas since ctx.letterSpacing is experimental in some browsers
      // Simplified: Just drawing it normally as standard fonts render ok
      ctx.fillText("CLINICA", w - logoSize - padding - (w * 0.01), h - padding - (logoSize * 0.45));

      // "MIRŌ" (Main text)
      ctx.font = `bold ${fontSizeTitle}px "Jost", sans-serif`;
      ctx.fillStyle = "white";
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 10;
      ctx.fillText("MIRŌ", w - logoSize - padding - (w * 0.01), h - padding - (logoSize * 0.12));

      // "DISEÑO DE SONRISA IA" (Tagline)
      ctx.font = `${fontSizeTagline}px "Jost", sans-serif`;
      ctx.fillStyle = "#fbbf24"; // Amber-400
      ctx.shadowBlur = 0;
      ctx.fillText("DISEÑO DE SONRISA IA", w - logoSize - padding - (w * 0.01), h - padding);

      // Constructing the New Logo SVG Data URI for Canvas
      // We reconstruct the hexagon paths here
      const logoSvgString = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${logoSize}" height="${logoSize}">
            <defs>
              <filter id="shadow">
                <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="black" flood-opacity="0.5"/>
              </filter>
            </defs>
            <g fill="white" filter="url(#shadow)">
               ${[0, 60, 120, 180, 240, 300].map(angle => `
                 <g transform="rotate(${angle} 50 50)">
                   <path d="M50 18 L70 18 L62 32 L50 32 Z" opacity="0.9"/>
                   <path d="M72 18 L88 46 L80 46 L68 25 Z" opacity="1"/>
                 </g>
               `).join('')}
            </g>
            <g fill="#fbbf24">
               ${[0, 60, 120, 180, 240, 300].map(angle => `
                 <circle cx="50" cy="50" r="2" transform="rotate(${angle} 50 50) translate(0, -36)" opacity="0.8"/>
               `).join('')}
            </g>
        </svg>
      `;
      
      const logoImg = new Image();
      logoImg.onload = () => {
          // Draw logo icon
          ctx.drawImage(logoImg, w - logoSize - padding, h - logoSize - padding, logoSize, logoSize);
          resolve(canvas.toDataURL('image/jpeg', 0.95));
      };
      logoImg.src = "data:image/svg+xml;base64," + btoa(logoSvgString);
    };
    img.onerror = () => resolve(imageUrl);
    img.src = imageUrl;
  });
};

const PhotoTips: React.FC = () => (
  <div className="w-full max-w-3xl mx-auto mt-12 animate-fade-in-up opacity-90" style={{ animationDelay: '0.2s' }}>
    <div className="border-t border-slate-300 pt-8">
      <h3 className="text-sm uppercase tracking-[0.2em] text-center text-slate-700 mb-8 font-bold">Guía para resultados óptimos</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {[
          { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", text: "Mirada al frente", desc: "Evita ángulos" },
          { icon: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707", text: "Buena iluminación", desc: "Luz natural" },
          { icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z", text: "Rostro despejado", desc: "Sin cabello/gafas" },
          { icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", text: "Sonrisa natural", desc: "Muestra dientes" }
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col items-center group p-4 rounded-lg hover:bg-slate-100 transition-colors duration-300">
            <div className="w-12 h-12 mb-3 rounded-full bg-white border border-slate-300 flex items-center justify-center text-slate-600 group-hover:text-amber-600 group-hover:border-amber-500/50 transition-all shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
              </svg>
            </div>
            <span className="text-base font-semibold text-slate-800">{item.text}</span>
            <span className="text-sm text-slate-600 mt-1">{item.desc}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ImageProcessor: React.FC<ImageProcessorProps> = ({ 
  step, 
  originalImage, 
  generatedImage, 
  onSimulationComplete,
  onReset 
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Gemini
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
        setUploadError("Por favor, sube un archivo de imagen válido (JPG, PNG).");
        return;
    }
    if (file.size > 5 * 1024 * 1024) {
        setUploadError("La imagen es muy pesada. El máximo es 5MB.");
        return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      setLocalPreview(result); // Show local preview immediately in scanner
      // Call generate immediately with result to ensure consistency
      generateSmile(result);
    };
    reader.readAsDataURL(file);
  };

  const timeoutPromise = (ms: number) => {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('La solicitud ha excedido el tiempo de espera')), ms);
    });
  };

  const generateSmile = async (base64Image: string) => {
    setIsAnalyzing(true);
    setUploadError(null);
    
    try {
        // Strip data prefix for API
        const cleanBase64 = base64Image.split(',')[1];

        // Race between the API call and a 45s timeout to prevent hanging
        const response: any = await Promise.race([
            ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [
                        { inlineData: { data: cleanBase64, mimeType: 'image/jpeg' } },
                        { text: 'Enhance this person\'s smile. Make teeth perfectly aligned, naturally white, and aesthetically pleasing. Keep facial features exactly the same, only modify the teeth area for a perfect dental veneer look. High realism, 4k quality.' }
                    ]
                },
                config: {
                    responseModalities: [Modality.IMAGE],
                },
            }),
            timeoutPromise(45000)
        ]);

        // Extract image
        let generatedUrl = null;
        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    generatedUrl = `data:image/jpeg;base64,${part.inlineData.data}`;
                    break;
                }
            }
        }

        if (generatedUrl) {
            onSimulationComplete(base64Image, generatedUrl);
        } else {
            console.error("No image generated in response", response);
            throw new Error("No se pudo generar la imagen.");
        }

    } catch (error) {
        console.error("Error generating smile:", error);
        setUploadError("El proceso tardó demasiado o hubo un error. Intenta con otra foto (buena luz, frente).");
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleDownloadClick = () => {
      if (leadCaptured) {
          executeDownload();
      } else {
          setShowLeadModal(true);
      }
  };

  const handleLeadSubmit = () => {
      setLeadCaptured(true);
      setShowLeadModal(false);
      executeDownload();
  };

  const executeDownload = async () => {
      if (!generatedImage) return;
      
      try {
        const watermarked = await addWatermark(generatedImage);
        const link = document.createElement('a');
        link.href = watermarked;
        link.download = `clinica-miro-simulacion-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (e) {
          console.error("Download failed", e);
      }
  };

  // 1. ANALYSIS MODE
  if (isAnalyzing) {
    return <Spinner imageSrc={localPreview || originalImage} />;
  }

  // 2. UPLOAD MODE (Default if not analyzing and no result yet)
  if (step === 'processing' && !generatedImage) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in px-4">
              <div className="w-full max-w-xl p-8 bg-white rounded-2xl shadow-xl border border-slate-100 text-center relative overflow-hidden">
                  
                  {/* Decorative background blob */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-300 to-amber-500"></div>

                  <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                  </div>
                  
                  <h2 className="text-2xl font-light text-slate-800 mb-3">Sube tu mejor foto</h2>
                  <p className="text-slate-600 mb-8 leading-relaxed font-medium">Para un diseño perfecto, asegúrate de tener buena iluminación y mirar de frente sonriendo.</p>

                  {/* ERROR DISPLAY */}
                  {uploadError && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-bold flex items-center gap-3 animate-pulse text-left">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <span>{uploadError}</span>
                      </div>
                  )}

                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  
                  <div className="flex flex-col gap-4">
                    <Button onClick={() => fileInputRef.current?.click()} className="w-full py-4 text-base shadow-lg shadow-amber-500/20">
                        Seleccionar Foto de Galería
                    </Button>
                    <button onClick={onReset} className="text-slate-400 text-xs font-bold tracking-widest uppercase hover:text-slate-600 transition-colors py-2">
                        ← Volver al inicio
                    </button>
                  </div>
              </div>
              
              <PhotoTips />
          </div>
      );
  }

  // 3. RESULT MODE
  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto animate-fade-in pb-20">
      
      {/* Header Result */}
      <div className="text-center mb-8">
          <span className="text-amber-600 font-medium tracking-widest text-sm uppercase mb-2 block">Análisis Finalizado</span>
          <h2 className="text-3xl md:text-4xl font-light text-slate-800">Tu Sonrisa <span className="font-semibold text-slate-900">Rediseñada</span></h2>
      </div>

      {/* BEFORE / AFTER SLIDER - NO GATE */}
      {originalImage && generatedImage && (
          <div className="w-full mb-10">
             <BeforeAfterSlider before={originalImage} after={generatedImage} />
             <div className="flex justify-center mt-4 gap-8 text-sm font-medium text-slate-600 uppercase tracking-widest">
                 <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-slate-300"></div> Antes
                 </div>
                 <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-amber-500"></div> Después
                 </div>
             </div>
          </div>
      )}

      {/* ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-4">
          <Button onClick={onReset} variant="outline" className="w-full py-4 text-sm font-bold border-slate-300 text-slate-700 hover:bg-slate-50">
              PROBAR OTRA FOTO
          </Button>
          
          <Button onClick={handleDownloadClick} className="w-full py-4 text-sm font-bold shadow-xl">
              DESCARGAR DISEÑO
          </Button>
      </div>

      {/* SCHEDULING SECTION */}
      <div className="mt-8 w-full max-w-2xl px-4">
         <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
             <h3 className="text-lg font-bold text-slate-800 mb-2">¿Te gusta tu nueva sonrisa?</h3>
             <p className="text-slate-600 mb-6 text-sm">Agenda tu evaluación diagnóstica y hazlo realidad.</p>
             
             <div className="flex flex-col sm:flex-row gap-3 justify-center">
                 <button 
                    onClick={() => window.open('https://ff.healthatom.io/41knMr', '_blank')}
                    className="flex-1 bg-amber-500 text-white px-4 py-3 rounded-lg font-bold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 text-sm uppercase tracking-wide"
                 >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                     </svg>
                     Agendar Online
                 </button>

                 <button 
                    onClick={() => window.open('https://wa.me/56935572986?text=Hola,%20me%20gustaría%20agendar%20una%20evaluación%20de%20diseño%20de%20sonrisa', '_blank')}
                    className="flex-1 bg-[#25D366] text-white px-4 py-3 rounded-lg font-bold hover:bg-[#20bd5a] transition-colors shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 text-sm uppercase tracking-wide"
                 >
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                     </svg>
                     WhatsApp
                 </button>
             </div>
         </div>
      </div>

      {/* LEAD MODAL */}
      {showLeadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" onClick={() => setShowLeadModal(false)}></div>
              <div className="relative w-full max-w-md transform transition-all scale-100">
                  <button 
                    onClick={() => setShowLeadModal(false)}
                    className="absolute -top-12 right-0 text-white/80 hover:text-white"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                  </button>
                  <ContactForm 
                    onDownload={handleLeadSubmit} 
                    title="Guarda tu Diseño"
                    subtitle="Completa tus datos para descargar tu simulación de alta calidad"
                    buttonText="DESCARGAR IMAGEN"
                  />
              </div>
          </div>
      )}
    </div>
  );
};

export default ImageProcessor;