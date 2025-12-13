import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import Button from './Button';
import Spinner from './Spinner';
import ContactForm from './ContactForm';
import BeforeAfterSlider from './BeforeAfterSlider';
import ReportView from './ReportView';
import { AppStep } from '../App';

// --- CONFIGURACIÓN DE PAGO FLOW ---
// INSTRUCCIONES:
// 1. Ingresa a tu portal de Flow (flow.cl) con tu API Key/Secret si es necesario para entrar, o usa tus credenciales de acceso.
// 2. Ve a "Cobros" -> "Botones de Pago".
// 3. Crea un botón por el valor de $5.900.
// 4. Copia el enlace que te genera Flow y pégalo abajo reemplazando el texto entre comillas.
const FLOW_PAYMENT_URL = "https://www.flow.cl/btn.php?token=TU_TOKEN_AQUI"; 
// ----------------------------------

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
  const [hasPaid, setHasPaid] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Gemini
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Check for payment return status
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    // Flow usually returns a 'token' or we can check for a custom status parameter
    if (searchParams.has('token') || searchParams.get('status') === 'paid' || searchParams.get('payment') === 'success') {
        setHasPaid(true);
        // Optional: Clean URL
        window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

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
          // If paid, we don't really use this function anymore as logic moved to ReportView,
          // but kept for fallback or non-paid partial flow
      } else {
          setShowLeadModal(true);
      }
  };

  const handleLeadSubmit = () => {
      setLeadCaptured(true);
      setShowLeadModal(false);
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

  // 3. PREMIUM REPORT VIEW (IF PAID)
  if (hasPaid && originalImage && generatedImage) {
      return (
        <ReportView 
            originalImage={originalImage} 
            generatedImage={generatedImage} 
            onReset={onReset} 
        />
      );
  }

  // 4. FREE RESULT MODE (BEFORE PAYMENT)
  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto animate-fade-in pb-20">
      
      {/* Header Result */}
      <div className="text-center mb-8">
          <span className="text-amber-600 font-medium tracking-widest text-sm uppercase mb-2 block">Análisis Finalizado</span>
          <h2 className="text-3xl md:text-4xl font-light text-slate-800">Tu Sonrisa <span className="font-semibold text-slate-900">Rediseñada</span></h2>
      </div>

      {/* BEFORE / AFTER SLIDER */}
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
          
          <Button 
            onClick={() => window.open(FLOW_PAYMENT_URL, '_blank')} 
            className="w-full py-4 text-sm font-bold shadow-xl animate-pulse flex items-center justify-center gap-2"
          >
            IR AL PAGO (FLOW)
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Button>
      </div>

      {/* TRIPWIRE OFFER SECTION */}
      <div className="mt-12 w-full max-w-2xl px-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-amber-500/50 rounded-2xl p-1 overflow-hidden shadow-2xl">
              
              {/* Gold Shimmer Effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-75"></div>

              <div className="bg-slate-900/90 rounded-xl p-6 md:p-8 text-center relative z-10">
                  <div className="inline-block bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse">
                      Oferta Flash Limitada
                  </div>

                  <h2 className="text-3xl md:text-4xl font-light text-white mb-8 leading-tight">
                      ¡Tu sonrisa perfecta está a un paso!
                  </h2>

                  <div className="text-left bg-white/5 rounded-xl p-6 md:p-8 mb-8 border border-white/10">
                      {/* NEW BIGGER TITLE */}
                      <h3 className="text-amber-400 font-bold text-2xl md:text-3xl mb-6 text-center md:text-left leading-tight">
                          Informe Análisis Dentofacial
                          <span className="block text-white text-lg md:text-xl font-light mt-1">clinicamiro.cl</span>
                      </h3>

                      {/* NEW BIGGER LIST */}
                      <ul className="space-y-4 text-slate-300 text-base md:text-lg">
                          <li className="flex items-start gap-3">
                              <span className="text-amber-500 mt-1 min-w-[20px]">✓</span> 
                              <span>Análisis facial + dental detallado con IA y revisión clínica</span>
                          </li>
                          <li className="flex items-start gap-3">
                              <span className="text-amber-500 mt-1 min-w-[20px]">✓</span> 
                              <span>Presupuesto estimado personalizado</span>
                          </li>
                          <li className="flex items-start gap-3">
                              <span className="text-amber-500 mt-1 min-w-[20px]">✓</span> 
                              <span>Video 3D de tu simulación + PDF descargable</span>
                          </li>
                          <li className="flex items-start gap-3">
                              <span className="text-amber-500 mt-1 min-w-[20px]">✓</span> 
                              <span><span className="text-white font-bold">Cupón 10% descuento</span> válido solo 48h</span>
                          </li>
                      </ul>
                  </div>

                  <div className="flex flex-col items-center justify-center gap-2 mb-8">
                      <div className="text-slate-400 text-base md:text-lg line-through decoration-slate-500 mb-1">
                          Valor consulta privada $80.000
                      </div>
                      <div className="text-5xl md:text-6xl font-black text-white drop-shadow-md">
                          $5.900 <span className="text-xl font-bold text-amber-500">CLP</span>
                      </div>
                  </div>

                  {/* PREMIUM BUTTON - FLOW INTEGRATION */}
                  <a 
                      href={FLOW_PAYMENT_URL}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block w-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-slate-900 font-black text-xl md:text-2xl py-6 rounded-xl shadow-[0_0_40px_rgba(245,158,11,0.6)] hover:shadow-[0_0_60px_rgba(245,158,11,0.8)] transition-all transform hover:-translate-y-1 hover:scale-[1.02] uppercase tracking-wider relative overflow-hidden group border-2 border-white/20"
                  >
                      <span className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3">
                        <span className="hidden md:inline">👉</span> 
                        <span>Sí, quiero mi informe + Cupón 10%</span>
                      </span>
                      {/* Shine effect */}
                      <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
                  </a>
                  
                  {/* TRUST BADGES TO REDUCE FRICTION */}
                  <div className="mt-6 flex flex-col items-center gap-3">
                      <p className="text-[11px] md:text-xs text-slate-400 uppercase tracking-widest font-medium flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Garantía de Satisfacción Clínica Miró
                      </p>
                      <p className="text-[10px] text-slate-500">
                          🔒 Pago procesado seguramente por Flow
                      </p>
                  </div>
              </div>
          </div>
      </div>

      {/* LEAD MODAL (Used for unpaid fallback data capture if needed) */}
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