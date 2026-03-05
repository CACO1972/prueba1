
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import Button from './Button';
import Spinner from './Spinner';
import BeforeAfterSlider from './BeforeAfterSlider';
import ReportView from './ReportView';
import ContactForm from './ContactForm';
import { AppStep } from '../App';

const FLOW_PAYMENT_URL = "https://www.flow.cl/btn.php?token=afdffb24cc8cef3f65a6cb7f0aec8a9373efedf8";

interface ImageProcessorProps {
  step: AppStep;
  originalImage: string | null;
  generatedImage: string | null;
  hasPaid: boolean;
  onSimulationComplete: (original: string, generated: string) => void;
  onFormComplete: () => void;
  onOpenMarketing: () => void;
  onReset: () => void;
}

const ImageProcessor: React.FC<ImageProcessorProps> = ({ 
  originalImage, 
  generatedImage, 
  hasPaid,
  onSimulationComplete,
  onFormComplete,
  onOpenMarketing,
  onReset 
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [expertAnalysis, setExpertAnalysis] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentVerified, setPaymentVerified] = useState(false);
  
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      const constraints = { 
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false 
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        videoRef.current.muted = true;
        
        videoRef.current.onloadedmetadata = async () => {
          try {
            await videoRef.current?.play();
            setShowCamera(true);
          } catch (e) {
            setError("Toca la pantalla para activar la cámara.");
          }
        };
      }
    } catch (err: any) {
      setError("No se pudo acceder a la cámara. Revisa los permisos.");
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const takePhoto = () => {
    if (videoRef.current && videoRef.current.readyState === 4) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0);
        setCapturedPreview(canvas.toDataURL('image/jpeg', 0.9));
        stopCamera();
      }
    }
  };

  const handleFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setCapturedPreview(event.target?.result as string);
    reader.readAsDataURL(file);
  };

  const generateSmile = async () => {
    if (!capturedPreview) return;
    setIsAnalyzing(true);
    setError(null);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const cleanBase64 = capturedPreview.split(',')[1];
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: cleanBase64, mimeType: 'image/jpeg' } },
                    { text: "DENTAL CLINICAL SIMULATION: Perform a professional dental restoration. Detect the teeth. Replace them with ultra-realistic, natural-white (Bleach 2 tone), symmetrical porcelain veneers. The smile must follow the lower lip curvature. Keep facial skin texture, lighting, and expression IDENTICAL. Focus on cinematic dental quality. Return ONLY the edited image." }
                ]
            }
        });
        
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
            onSimulationComplete(capturedPreview, generatedUrl);
        } else {
            throw new Error("Procesamiento fallido. Intenta con una foto frontal más clara.");
        }
    } catch (err: any) {
        setError("Error en la IA. Revisa tu conexión.");
    } finally {
        setIsAnalyzing(false);
    }
  };

  const analyzeImage = async () => {
    if (!originalImage) return;
    setIsAnalyzing(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: {
                parts: [
                    { inlineData: { data: originalImage.split(',')[1], mimeType: 'image/jpeg' } },
                    { text: "Eres un odontólogo experto en estética. Analiza esta foto. Entrega un diagnóstico rápido (máximo 100 palabras) sobre la línea media, el arco de sonrisa y la armonía general. Usa un tono clínico de alta gama." }
                ]
            }
        });
        setExpertAnalysis(response.text);
    } catch (e) {
        setError("Análisis no disponible en este momento.");
    } finally {
        setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) return <Spinner imageSrc={capturedPreview || originalImage} />;
  
  if (hasPaid && originalImage && generatedImage) {
      return <ReportView originalImage={originalImage} generatedImage={generatedImage} onReset={onReset} />;
  }

  return (
    <div className="flex flex-col items-center w-full max-w-7xl mx-auto pb-32 px-6">
      {error && (
        <div className="mb-8 bg-red-500/10 border border-red-500/20 px-8 py-4 rounded-full text-red-400 text-[10px] font-black uppercase tracking-widest w-full max-w-md text-center backdrop-blur-xl animate-fade-in shadow-lg">
            ⚠️ {error}
        </div>
      )}

      {showCamera && (
        <div className="fixed inset-0 z-[60] bg-[#050608] flex flex-col items-center justify-center animate-fade-in">
            <div className="relative w-full h-full max-w-lg md:h-[85vh] bg-black md:rounded-[4rem] overflow-hidden shadow-2xl">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                    <div className="w-[75%] h-[55%] border-2 border-amber-500/20 rounded-[10rem] shadow-[0_0_0_9999px_rgba(5,6,8,0.7)]"></div>
                </div>
                <div className="absolute bottom-16 inset-x-0 flex flex-col items-center gap-10">
                    <button onClick={takePhoto} className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-transform">
                        <div className="w-20 h-20 rounded-full border-2 border-slate-900/10"></div>
                    </button>
                    <button onClick={stopCamera} className="text-white/40 text-[10px] font-black uppercase tracking-widest">Cerrar</button>
                </div>
            </div>
        </div>
      )}

      {!capturedPreview && !originalImage && !showCamera && (
        <div className="w-full max-w-2xl p-12 md:p-24 bg-[#0f1115] rounded-[3.5rem] border border-white/5 text-center shadow-3xl animate-fade-in-up">
            <div className="w-24 h-24 bg-amber-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-12 border border-amber-500/20">
                <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
            </div>
            <h2 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tighter italic uppercase">Análisis de <span className="text-amber-500 font-bold not-italic">Simetría</span></h2>
            <p className="text-slate-500 text-sm mb-12 uppercase tracking-[0.2em]">Inicia tu transformación dental con estándares de Clínica Miró.</p>
            <div className="flex flex-col gap-6 max-w-sm mx-auto">
                <Button onClick={startCamera} className="w-full py-8">USAR CÁMARA LIVE</Button>
                <label className="cursor-pointer bg-white/5 border border-white/10 text-slate-400 font-black py-6 rounded-full text-[10px] uppercase tracking-widest text-center hover:bg-white/10 transition-colors">
                  <input type="file" accept="image/*" className="hidden" onChange={handleFilePicked} />
                  CARGAR ARCHIVO
                </label>
            </div>
        </div>
      )}

      {capturedPreview && !generatedImage && (
          <div className="w-full max-w-xl bg-[#0f1115] rounded-[4rem] overflow-hidden border border-white/5 shadow-3xl animate-fade-in-up">
              <img src={capturedPreview} className="w-full aspect-[4/5] object-cover" alt="Preview" />
              <div className="p-16 text-center">
                  <h3 className="text-white text-2xl font-light mb-12 uppercase tracking-widest italic">¿Procesar <span className="font-bold text-amber-500 not-italic">Caso Clínico</span>?</h3>
                  <Button onClick={generateSmile} className="w-full py-8">SINTETIZAR RESULTADO</Button>
                  <button onClick={() => setCapturedPreview(null)} className="mt-8 text-slate-600 text-[10px] font-black uppercase tracking-widest">TOMAR OTRA FOTO</button>
              </div>
          </div>
      )}

      {originalImage && generatedImage && !hasPaid && (
        <div className="w-full flex flex-col items-center animate-fade-in">
          {/* PAYWALL SECTION */}
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Visual Preview Blocker */}
              <div className="relative rounded-[4rem] overflow-hidden border border-white/5 shadow-3xl bg-black">
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl p-12 text-center">
                      <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(245,158,11,0.5)]">
                          <svg className="w-8 h-8 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      </div>
                      <h3 className="text-white text-3xl font-black uppercase tracking-widest leading-none mb-4">INFORME BLOQUEADO</h3>
                      <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.5em] mb-12">TRANSFORMACIÓN DISPONIBLE AL 100%</p>
                      
                      <div className="w-full space-y-4 text-left">
                          {[
                              "Simulación de Alta Definición 4K",
                              "Análisis Biométrico de Proporción",
                              "Guía de Materiales (Zirconio/Emax)",
                              "Plan de Armonización Personalizado",
                              "Certificado de Excelencia Miró"
                          ].map((item, i) => (
                              <div key={i} className="flex items-center gap-4 text-[11px] text-white/70 font-bold uppercase tracking-widest border-b border-white/5 pb-2">
                                  <span className="text-amber-500">✓</span> {item}
                              </div>
                          ))}
                      </div>
                  </div>
                  <div className="opacity-40 grayscale pointer-events-none">
                     <BeforeAfterSlider before={originalImage} after={generatedImage} />
                  </div>
              </div>

              {/* Payment Action Area */}
              <div className="p-12 md:p-20 bg-[#0f1115] rounded-[4rem] border border-white/10 shadow-3xl text-center lg:text-left">
                  <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.8em] block mb-6">ACCESO EXCLUSIVO ELITE</span>
                  <h2 className="text-5xl md:text-7xl font-light text-white mb-10 leading-none tracking-tighter">Desbloquea tu <br/><span className="font-bold italic text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-200">Nueva Realidad.</span></h2>
                  
                  <div className="bg-white/5 p-10 rounded-3xl border border-white/5 mb-12">
                      <div className="flex justify-between items-end mb-4">
                          <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Valor Único</span>
                          <span className="text-4xl font-black text-white">$5.900 <span className="text-xs text-amber-500">CLP</span></span>
                      </div>
                      <p className="text-[10px] text-slate-600 uppercase font-bold tracking-widest leading-relaxed">Incluye simulación completa y reporte descargable en PDF de grado clínico.</p>
                  </div>

                  <a 
                    href={FLOW_PAYMENT_URL} 
                    onClick={() => setPaymentVerified(true)} 
                    className="block w-full bg-amber-500 text-slate-950 font-black py-10 rounded-full text-[14px] uppercase tracking-[0.6em] text-center shadow-[0_25px_60px_rgba(245,158,11,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    COMPRAR ACCESO TOTAL
                  </a>
                  
                  <div className="mt-12 opacity-50 flex items-center justify-center lg:justify-start gap-8 grayscale contrast-125">
                      <img src="https://mirousa.com/wp-content/uploads/2022/10/logo-miro-vertical.png" className="h-10 object-contain" alt="Miró" />
                      <div className="text-[9px] text-white font-black tracking-widest border-l border-white/20 pl-8">SECURE ENCRYPTION 256-BIT</div>
                  </div>
              </div>
          </div>

          {/* Verification Area (Post-Click) */}
          {paymentVerified && (
            <div className="w-full max-w-6xl mt-20 animate-fade-in-up">
                 <ContactForm onDownload={onFormComplete} title="VALIDACIÓN DE PAGO" subtitle="Ingresa tus datos para recibir el Informe Certificado" buttonText="GENERAR MI INFORME AHORA" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageProcessor;
