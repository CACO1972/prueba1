import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import Button from './Button';
import Spinner from './Spinner';
import ContactForm from './ContactForm';
import BeforeAfterSlider from './BeforeAfterSlider';
import ReportView from './ReportView';
import { AppStep } from '../App';

// --- CONFIGURACIÓN DE PAGO FLOW ---
const FLOW_PAYMENT_URL = "https://www.flow.cl/btn.php?token=afdffb24cc8cef3f65a6cb7f0aec8a9373efedf8"; 
// ----------------------------------

interface ImageProcessorProps {
  step: AppStep;
  originalImage: string | null;
  generatedImage: string | null;
  onSimulationComplete: (original: string, generated: string) => void;
  onStartAesthetic: () => void;
  onReset: () => void;
}

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
  onStartAesthetic,
  onReset 
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [hasPaid, setHasPaid] = useState(false);
  
  // Camera State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [qualityScore, setQualityScore] = useState(0); // 0 to 100
  const [qualityMessage, setQualityMessage] = useState("Iniciando cámara...");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analysisFrameRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Gemini
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Check for payment return status
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('token') || searchParams.get('status') === 'paid' || searchParams.get('payment') === 'success') {
        setHasPaid(true);
        window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // AUTO-OPEN CAMERA ON MOUNT
  useEffect(() => {
    if (step === 'processing' && !originalImage && !generatedImage) {
        // Attempt to start camera immediately
        startCamera();
    }
    // Cleanup on unmount
    return () => {
        stopCamera();
    };
  }, [step, originalImage, generatedImage]);

  // IMAGE QUALITY ANALYSIS LOOP
  const analyzeVideoQuality = () => {
      if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) return;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Small sample size for performance
      canvas.width = 50; 
      canvas.height = 50;
      ctx.drawImage(videoRef.current, 0, 0, 50, 50);
      
      const imageData = ctx.getImageData(0, 0, 50, 50);
      const data = imageData.data;
      
      let totalBrightness = 0;
      for (let i = 0; i < data.length; i += 4) {
          // Weighted RGB for human perception
          totalBrightness += (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
      }
      const avgBrightness = totalBrightness / (data.length / 4);

      // Scoring Logic (Simple Heuristic)
      // Brightness should be between 80 and 200 roughly
      let score = 0;
      let message = "";

      if (avgBrightness < 50) {
          score = 20;
          message = "Muy oscuro. Busca más luz.";
      } else if (avgBrightness > 220) {
          score = 40;
          message = "Demasiada luz de fondo.";
      } else if (avgBrightness >= 50 && avgBrightness < 90) {
          score = 60;
          message = "Luz aceptable. Acerca tu rostro.";
      } else {
          score = 95;
          message = "Iluminación Perfecta.";
      }

      // Smooth transition for UI
      setQualityScore(prev => prev + (score - prev) * 0.1);
      setQualityMessage(message);

      analysisFrameRef.current = requestAnimationFrame(analyzeVideoQuality);
  };

  // Start analysis when camera opens
  useEffect(() => {
      if (isCameraOpen && videoRef.current) {
          videoRef.current.addEventListener('play', () => {
             analyzeVideoQuality();
          });
      }
      return () => {
          if (analysisFrameRef.current) cancelAnimationFrame(analysisFrameRef.current);
      };
  }, [isCameraOpen]);

  // CAMERA LOGIC
  const startCamera = async () => {
    setUploadError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
        } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      // Fallback message if auto-open fails or permission denied
      setUploadError("Para la experiencia automática, permite el acceso a la cámara. O selecciona una foto abajo.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (analysisFrameRef.current) {
        cancelAnimationFrame(analysisFrameRef.current);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw image directly (no flip logic needed for processing, but CSS mirrors it for user)
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95); 
        setLocalPreview(dataUrl);
        stopCamera();
        generateSmile(dataUrl);
      }
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        setUploadError("Por favor, sube un archivo de imagen válido (JPG, PNG).");
        return;
    }
    if (file.size > 10 * 1024 * 1024) { 
        setUploadError("La imagen es muy pesada. El máximo es 10MB.");
        return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      setLocalPreview(result);
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
        const cleanBase64 = base64Image.split(',')[1];
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
      if (!leadCaptured) {
          setShowLeadModal(true);
      }
  };

  const handleLeadSubmit = () => {
      setLeadCaptured(true);
      setShowLeadModal(false);
  };

  // Helper for quality bar color
  const getQualityColor = (score: number) => {
      if (score < 40) return 'bg-red-500';
      if (score < 80) return 'bg-yellow-400';
      return 'bg-green-500';
  };

  // 1. ANALYSIS MODE
  if (isAnalyzing) {
    return <Spinner imageSrc={localPreview || originalImage} />;
  }

  // 2. CAMERA UI OVERLAY (Active Mode)
  if (isCameraOpen) {
    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
            <div className="relative flex-grow overflow-hidden bg-black">
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 opacity-90" 
                />
                
                {/* PROFESSIONAL FRAME OVERLAY */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    {/* Darken outer edges */}
                    <div className="absolute inset-0 border-[40px] md:border-[80px] border-black/60 mask-frame transition-all duration-500"
                         style={{ borderColor: `rgba(0,0,0, ${Math.max(0.3, 1 - qualityScore/100)})` }}></div>
                    
                    {/* SVG Guides */}
                    <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] max-w-md opacity-80 drop-shadow-lg">
                        {/* Dynamic Stroke Color based on quality */}
                        <ellipse cx="50" cy="50" rx="28" ry="38" fill="none" 
                            stroke={qualityScore > 80 ? "#10B981" : (qualityScore > 40 ? "#FBBF24" : "#EF4444")} 
                            strokeWidth="0.5" strokeDasharray="4 2" className="transition-colors duration-300" 
                        />
                        <line x1="32" y1="42" x2="68" y2="42" stroke="rgba(255,255,255,0.5)" strokeWidth="0.2" />
                        <rect x="38" y="60" width="24" height="12" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.2" rx="2" />
                    </svg>
                </div>

                {/* TOP BAR: QUALITY INDICATOR */}
                <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/80 to-transparent">
                    <div className="max-w-xs mx-auto">
                        <div className="flex justify-between items-end mb-1">
                            <span className="text-white text-[10px] uppercase tracking-widest font-bold">Calidad de Imagen</span>
                            <span className={`text-[10px] uppercase font-bold transition-colors duration-300 ${qualityScore > 80 ? 'text-green-400' : 'text-yellow-400'}`}>
                                {qualityMessage}
                            </span>
                        </div>
                        {/* THE REQUESTED BAR: RED -> YELLOW -> GREEN */}
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden relative">
                             {/* Gradient Background */}
                             <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 opacity-30"></div>
                             {/* Active Level Indicator */}
                             <div className="h-full transition-all duration-300 ease-out flex items-center justify-end" style={{ width: `${qualityScore}%` }}>
                                 <div className={`h-full w-full ${getQualityColor(qualityScore)} shadow-[0_0_10px_currentColor]`}></div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-6 flex flex-col items-center pb-10 gap-6">
                
                <p className="text-slate-400 text-xs text-center max-w-xs animate-pulse">
                    {qualityScore > 80 ? "¡Excelente! Mantén quieto y dispara." : "Ajusta la posición para activar el botón."}
                </p>

                <div className="flex justify-between items-center w-full max-w-sm px-4">
                    <button 
                        onClick={stopCamera} 
                        className="text-white p-4 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <span className="text-xs uppercase font-bold tracking-widest block text-slate-400">Cancelar</span>
                    </button>
                    
                    <button 
                        onClick={capturePhoto} 
                        disabled={qualityScore < 40} // Prevent bad photos
                        className={`w-20 h-20 rounded-full border-4 flex items-center justify-center group relative transition-all duration-300 ${qualityScore > 80 ? 'border-green-400 shadow-[0_0_30px_rgba(16,185,129,0.4)]' : 'border-slate-600 opacity-50 cursor-not-allowed'}`}
                    >
                        <div className={`w-16 h-16 rounded-full transition-all duration-300 ${qualityScore > 80 ? 'bg-white group-active:scale-90' : 'bg-slate-500'}`}></div>
                    </button>
                    
                    <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 text-white/50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
  }

  // 3. UPLOAD MODE (Backup / Initial State if camera blocked)
  if (step === 'processing' && !generatedImage) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in px-4">
              <div className="w-full max-w-xl p-8 bg-white rounded-2xl shadow-xl border border-slate-100 text-center relative overflow-hidden">
                  
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-300 to-amber-500"></div>

                  <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                  </div>
                  
                  <h2 className="text-2xl font-light text-slate-800 mb-3">Sube tu mejor foto</h2>
                  <p className="text-slate-600 mb-8 leading-relaxed font-medium">
                     Estamos intentando abrir tu cámara. Si no se inicia, usa los botones de abajo.
                  </p>

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
                  
                  <div className="flex flex-col gap-3">
                    <Button onClick={startCamera} className="w-full py-4 text-base shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        REINTENTAR CÁMARA
                    </Button>
                    <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full py-3 text-sm">
                        SUBIR DESDE GALERÍA
                    </Button>
                    <button onClick={onReset} className="text-slate-400 text-xs font-bold tracking-widest uppercase hover:text-slate-600 transition-colors py-2 mt-2">
                        ← Volver al inicio
                    </button>
                  </div>
              </div>
              
              <PhotoTips />
          </div>
      );
  }

  // 4. PREMIUM REPORT VIEW (IF PAID)
  if (hasPaid && originalImage && generatedImage) {
      return (
        <ReportView 
            originalImage={originalImage} 
            generatedImage={generatedImage} 
            onReset={onReset} 
        />
      );
  }

  // 5. FREE RESULT MODE (BEFORE PAYMENT)
  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto animate-fade-in pb-20">
      
      {/* Header Result */}
      <div className="text-center mb-8">
          <span className="text-amber-600 font-medium tracking-widest text-sm uppercase mb-2 block">Simulación Gratuita Finalizada</span>
          <h2 className="text-3xl md:text-4xl font-light text-slate-800">Resultado <span className="font-semibold text-slate-900">Preliminar</span></h2>
          <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto">Esta es una vista previa de baja resolución. Para obtener tu estudio completo y alta calidad, desbloquea el informe.</p>
      </div>

      {/* BEFORE / AFTER SLIDER */}
      {originalImage && generatedImage && (
          <div className="w-full mb-8">
             <BeforeAfterSlider before={originalImage} after={generatedImage} />
             <div className="flex justify-center mt-4 gap-8 text-sm font-medium text-slate-600 uppercase tracking-widest">
                 <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-slate-300"></div> Antes
                 </div>
                 <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-amber-500"></div> Diseño Simetría (Vista Previa)
                 </div>
             </div>
          </div>
      )}

      {/* TEMPTING PHRASE */}
      <div className="text-center mb-6 px-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <p className="text-lg md:text-xl font-light text-slate-700 leading-snug">
              Si te gustó tu nueva sonrisa, <br className="hidden md:block" />
              <span className="font-semibold text-amber-600">desbloquea el análisis dento facial 360.</span>
          </p>
      </div>

      {/* TRIPWIRE OFFER SECTION (MOVED UP) */}
      <div className="w-full max-w-2xl px-4 animate-fade-in-up mb-8" style={{ animationDelay: '0.2s' }}>
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-amber-500/50 rounded-2xl p-1 overflow-hidden shadow-2xl">
              
              {/* Gold Shimmer Effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-75"></div>

              <div className="bg-slate-900/90 rounded-xl p-6 md:p-8 text-center relative z-10">
                  {/* REMOVED: "Has completado la Simulación Gratuita" Badge */}

                  <h2 className="text-2xl md:text-3xl font-light text-white mb-6 leading-tight">
                      Desbloquea tu <span className="text-amber-400 font-bold">Informe Clínico & Beneficios</span>
                  </h2>

                  <div className="text-left bg-white/5 rounded-xl p-6 md:p-8 mb-8 border border-white/10">
                      <h3 className="text-amber-400 font-bold text-xl md:text-2xl mb-6 text-center md:text-left leading-tight">
                          Lo que obtienes por $5.900:
                          <span className="block text-white text-sm md:text-base font-light mt-1">Acceso inmediato a:</span>
                      </h3>

                      <ul className="space-y-4 text-slate-300 text-sm md:text-base">
                          <li className="flex items-start gap-3">
                              <span className="text-amber-500 mt-0.5 min-w-[20px]">🔓</span> 
                              <span><strong className="text-white">Video Consulta GRATUITA:</strong> Agenda una sesión con un especialista para revisar tu caso.</span>
                          </li>
                          <li className="flex items-start gap-3">
                              <span className="text-amber-500 mt-0.5 min-w-[20px]">🔓</span> 
                              <span><strong className="text-white">Informe Estético Facial:</strong> Incluye recomendaciones de <span className="text-amber-300 font-semibold">procedimientos NO invasivos</span> para armonización facial completa.</span>
                          </li>
                          <li className="flex items-start gap-3">
                              <span className="text-amber-500 mt-0.5 min-w-[20px]">🔓</span> 
                              <span><strong className="text-white">Pack Digital HD:</strong> Simulación en alta resolución + PDF descargable.</span>
                          </li>
                          <li className="flex items-start gap-3">
                              <span className="text-amber-500 mt-0.5 min-w-[20px]">🔓</span> 
                              <span><strong className="text-white">Cupón 10% DCTO:</strong> Recupere los $5.900 abonándolos a su tratamiento.</span>
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
                      className="block w-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-slate-900 font-black text-lg md:text-xl py-5 rounded-xl shadow-[0_0_40px_rgba(245,158,11,0.6)] hover:shadow-[0_0_60px_rgba(245,158,11,0.8)] transition-all transform hover:-translate-y-1 hover:scale-[1.02] uppercase tracking-wider relative overflow-hidden group border-2 border-white/20"
                  >
                      <span className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3">
                        <span className="hidden md:inline">👉</span> 
                        <span>DESBLOQUEAR INFORME + CUPÓN</span>
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
                          Garantía de Satisfacción Simetría
                      </p>
                      <p className="text-[10px] text-slate-500">
                          🔒 Pago procesado seguramente por Flow
                      </p>
                  </div>
              </div>
          </div>
      </div>

      {/* SECONDARY ACTIONS - MOVED BELOW OFFER */}
      <div className="w-full max-w-2xl px-4 flex flex-col items-center gap-4">
          <Button onClick={onStartAesthetic} variant="outline" className="w-full py-4 text-sm font-bold border-indigo-200 text-indigo-700 hover:bg-indigo-50 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              PROBAR ANÁLISIS FACIAL (Perfect Corp)
          </Button>

          <button onClick={onReset} className="text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-slate-600 transition-colors py-2">
              Descartar y Probar Otra Foto
          </button>
      </div>

    </div>
  );
};

export default ImageProcessor;