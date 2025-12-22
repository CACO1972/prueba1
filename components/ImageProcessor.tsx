import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import Button from './Button';
import Spinner from './Spinner';
import BeforeAfterSlider from './BeforeAfterSlider';
import ReportView from './ReportView';
import { AppStep } from '../App';

const FLOW_PAYMENT_URL = "https://www.flow.cl/btn.php?token=afdffb24cc8cef3f65a6cb7f0aec8a9373efedf8"; 

interface ImageProcessorProps {
  step: AppStep;
  originalImage: string | null;
  generatedImage: string | null;
  hasPaid: boolean;
  onSimulationComplete: (original: string, generated: string) => void;
  onStartAesthetic: () => void;
  onOpenMarketing: () => void;
  onReset: () => void;
}

const ImageProcessor: React.FC<ImageProcessorProps> = ({ 
  originalImage, 
  generatedImage, 
  hasPaid,
  onSimulationComplete,
  onOpenMarketing,
  onReset 
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setCapturedPreview(base64);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
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
                    { text: "Create a photorealistic dental smile reconstruction. Apply high-end aesthetic white porcelain veneers with perfect alignment and natural translucency. Maintain facial features, eyes, and skin texture exactly as the original. Only modify the dental area to show a celebrity-grade smile. Return ONLY the modified image." }
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
            throw new Error("Mapeo facial insuficiente.");
        }
    } catch (err) {
        console.error("AI Error:", err);
        setError("Error de procesamiento. Asegúrate de que la foto sea de frente, con buena luz y boca visible.");
    } finally {
        setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) return <Spinner imageSrc={capturedPreview || originalImage} />;

  if (hasPaid && originalImage && generatedImage) {
      return <ReportView originalImage={originalImage} generatedImage={generatedImage} onReset={onReset} />;
  }

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto pb-24 px-4">
      {error && (
        <div className="mb-8 bg-red-500/10 border border-red-500/20 px-6 py-4 rounded-2xl text-red-400 text-[10px] font-black uppercase tracking-widest w-full max-w-xl text-center flex items-center justify-center gap-3">
            <span className="text-sm">⚠️</span> {error}
        </div>
      )}

      {!capturedPreview && !originalImage && (
        <div className="w-full max-w-xl p-12 md:p-16 bg-[#121418] rounded-[3.5rem] border border-white/5 text-center shadow-3xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.05),transparent)] pointer-events-none"></div>
            
            <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-10 border border-amber-500/20 relative">
                <div className="absolute inset-0 rounded-full border border-amber-500/20 animate-ping opacity-20"></div>
                <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <circle cx="12" cy="13" r="3" strokeWidth={1.2} />
                </svg>
            </div>
            
            <h2 className="text-4xl font-light text-white mb-6 tracking-tight">Análisis <span className="text-amber-500 font-bold italic">Symmetry v4</span></h2>
            <p className="text-slate-500 mb-12 font-light text-sm max-w-xs mx-auto uppercase tracking-[0.2em] leading-relaxed">
                Captura tu rostro de frente para un diagnóstico biométrico de precisión.
            </p>

            <div className="flex flex-col gap-4">
                <input 
                    id="cameraInput" type="file" accept="image/*" capture="user"
                    className="hidden" onChange={handleFilePicked}
                />
                <input 
                    id="galleryInput" type="file" accept="image/*"
                    className="hidden" onChange={handleFilePicked}
                />

                <label 
                  htmlFor="cameraInput" 
                  className="cursor-pointer bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black py-6 rounded-2xl text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><circle cx="12" cy="13" r="3" strokeWidth={2} /></svg>
                    TOMAR IMAGEN FRAME PRO
                </label>

                <label 
                  htmlFor="galleryInput" 
                  className="cursor-pointer bg-white/5 border border-white/10 text-slate-400 font-black py-5 rounded-2xl text-[11px] uppercase tracking-[0.3em] hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-3"
                >
                    Subir desde Galería
                </label>
            </div>
        </div>
      )}

      {capturedPreview && !generatedImage && (
          <div className="w-full max-w-xl bg-[#121418] rounded-[3.5rem] overflow-hidden border border-white/5 shadow-3xl animate-fade-in-up">
              <div className="relative">
                <img src={capturedPreview} alt="Preview" className="w-full h-[60vh] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121418] via-transparent to-transparent"></div>
                {/* Visual Corners */}
                <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-amber-500/40 rounded-tl-2xl"></div>
                <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-amber-500/40 rounded-tr-2xl"></div>
                <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-amber-500/40 rounded-bl-2xl"></div>
                <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-amber-500/40 rounded-br-2xl"></div>
              </div>
              <div className="p-12 text-center">
                  <h3 className="text-white text-xl font-light mb-10 uppercase tracking-[0.3em]">Análisis Biométrico <span className="font-bold text-amber-500">Confirmado</span></h3>
                  <div className="flex flex-col gap-5">
                      <Button onClick={generateSmile} className="w-full py-6 text-[12px] font-black uppercase tracking-[0.2em] shadow-amber-500/20 shadow-2xl">
                          INICIAR SINCRONIZACIÓN IA
                      </Button>
                      <button onClick={() => setCapturedPreview(null)} className="text-slate-600 text-[9px] font-black uppercase tracking-[0.5em] hover:text-white transition-colors">
                          ← Volver a capturar
                      </button>
                  </div>
              </div>
          </div>
      )}

      {originalImage && generatedImage && !hasPaid && (
        <div className="w-full flex flex-col items-center">
          <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-5xl font-light text-white tracking-tighter uppercase mb-4 italic">Simetría <span className="font-bold text-amber-500">Perfecta</span></h2>
              <div className="flex flex-wrap justify-center gap-4">
                <p className="text-slate-500 text-[10px] tracking-[0.5em] uppercase font-black">Diagnóstico v4.0 Elite</p>
                <button 
                    onClick={onOpenMarketing}
                    className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full text-[9px] font-black text-amber-500 uppercase tracking-widest hover:bg-amber-500 hover:text-slate-900 transition-all"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    Ver Tour 360 Marketing
                </button>
              </div>
          </div>

          <div className="w-full mb-20 animate-fade-in">
             <BeforeAfterSlider before={originalImage} after={generatedImage} />
          </div>

          <div className="w-full max-w-3xl bg-gradient-to-br from-[#1a1c22] to-black rounded-[4rem] border border-amber-500/20 p-12 md:p-20 text-center shadow-3xl relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/5 blur-[100px]"></div>
              <h3 className="text-3xl text-white font-light mb-12 tracking-widest">OBTENER <span className="text-amber-500 font-bold uppercase">Informe Completo</span></h3>
              
              <div className="bg-white/5 rounded-[2.5rem] p-10 mb-14 text-left space-y-6 border border-white/5">
                  <p className="text-white text-[10px] font-black uppercase tracking-[0.4em] border-b border-white/10 pb-4">Desbloqueas hoy:</p>
                  <ul className="text-slate-400 text-sm space-y-5 font-light">
                      <li className="flex gap-4 items-center"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Mapa Orofacial Interactivo con IA</li>
                      <li className="flex gap-4 items-center"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Guía Dental de Vanguardia 2024</li>
                      <li className="flex gap-4 items-center"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Cupón de Cortesía 10% Tratamientos</li>
                  </ul>
              </div>

              <div className="mb-14">
                  <span className="text-7xl font-black text-white tracking-tighter">$5.900 <span className="text-2xl text-amber-500 font-bold ml-2">CLP</span></span>
              </div>

              <a 
                  href={FLOW_PAYMENT_URL} 
                  className="block w-full bg-amber-500 text-slate-950 font-black text-[14px] py-7 rounded-3xl shadow-[0_25px_60px_rgba(245,158,11,0.2)] hover:scale-[1.03] transition-all uppercase tracking-[0.3em]"
              >
                  GENERAR INFORME + CUPÓN
              </a>
              <p className="mt-8 text-[9px] text-slate-600 uppercase tracking-widest font-bold">Pago Seguro vía Flow Redirección Encriptada</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageProcessor;