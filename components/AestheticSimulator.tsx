import React, { useEffect, useState, useRef } from 'react';
import Button from './Button';

interface AestheticSimulatorProps {
  imageSrc: string; // The image captured in the previous step
  onBack: () => void;
}

// Extend Window interface for Perfect Corp SDK
declare global {
  interface Window {
    YMK?: {
      init: (config: any) => Promise<void>;
      apply: (feature: string, option?: any) => void;
      open: () => void;
      source: {
          set: (image: string) => void;
      }
    };
  }
}

const AestheticSimulator: React.FC<AestheticSimulatorProps> = ({ imageSrc, onBack }) => {
  const [loading, setLoading] = useState(false); // Starts false, waits for credentials
  const [sdkError, setSdkError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<{clientId: string, clientSecret: string} | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Form State
  const [clientIdInput, setClientIdInput] = useState('');
  const [clientSecretInput, setClientSecretInput] = useState('');

  const handleCredentialsSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (clientIdInput && clientSecretInput) {
          setCredentials({ clientId: clientIdInput, clientSecret: clientSecretInput });
          setLoading(true); // Start loading SDK
      }
  };

  // 1. Script Loader & SDK Initialization
  useEffect(() => {
    // Only proceed if credentials are provided
    if (!credentials) return;

    let script: HTMLScriptElement | null = null;

    const initPerfectCorpSDK = async () => {
      try {
        if (!window.YMK) {
          // Create and append the Perfect Corp SDK script
          script = document.createElement('script');
          script.src = "https://yce-web-sdk.perfectcorp.com/sdk/v1/ycsdk.js"; 
          script.async = true;
          
          await new Promise((resolve, reject) => {
            script!.onload = resolve;
            script!.onerror = () => reject(new Error("No se pudo cargar el SDK de Perfect Corp. Verifique su conexión o la URL."));
            document.body.appendChild(script!);
          });
        }

        if (window.YMK && containerRef.current) {
          await window.YMK.init({
            container: containerRef.current,
            clientId: credentials.clientId, 
            clientSecret: credentials.clientSecret,
            language: 'es',
            region: 'EU', // Change to 'US' or 'AP' if needed based on your key origin
          });

          // Once initialized, load the image captured previously
          if (window.YMK.source && imageSrc) {
             window.YMK.source.set(imageSrc);
          }
          
          // Open/Start the widget
          window.YMK.open();
          
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Perfect Corp Init Error:", err);
        setSdkError(err.message || "Error inicializando el análisis facial. Verifique sus credenciales.");
        setLoading(false);
        setCredentials(null); // Reset to allow retry
      }
    };

    initPerfectCorpSDK();

    return () => {
      // Cleanup if necessary
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [imageSrc, credentials]);

  return (
    <div className="animate-fade-in w-full max-w-6xl mx-auto pb-20">
        <div className="mb-6 flex items-center justify-between">
            <button onClick={onBack} className="text-slate-500 hover:text-slate-800 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Volver a Resultados Dentales
            </button>
            <span className="text-indigo-600 text-xs font-bold uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Módulo Estético Avanzado
            </span>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative min-h-[700px] flex flex-col">
            
            {/* TOOLBAR HEADER */}
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center z-10 relative shadow-md">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg border border-white/20">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                    </div>
                    <div>
                        <span className="font-light tracking-wide text-lg block leading-none">Simetría <b className="font-bold">FaceAI</b></span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest">Powered by Perfect Corp</span>
                    </div>
                </div>
                
                {loading && !sdkError && (
                    <div className="flex items-center gap-2 text-xs font-mono text-indigo-300">
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        INICIALIZANDO MOTOR...
                    </div>
                )}
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-grow relative bg-slate-50 flex flex-col">
                
                {/* 1. CREDENTIALS FORM (Secure Box) */}
                {!credentials && (
                    <div className="absolute inset-0 z-30 bg-slate-100 flex items-center justify-center p-4">
                        <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-2xl border border-slate-200">
                            <div className="text-center mb-6">
                                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3 text-indigo-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-light text-slate-800">Activación de Módulo</h3>
                                <p className="text-xs text-slate-500 mt-1">Ingresa tus credenciales de Perfect Corp Console</p>
                            </div>

                            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Client ID</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                                        placeholder="Pegar Client ID aquí"
                                        value={clientIdInput}
                                        onChange={(e) => setClientIdInput(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Client Secret</label>
                                    <input 
                                        type="password" 
                                        className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                                        placeholder="Pegar Secret Key aquí"
                                        value={clientSecretInput}
                                        onChange={(e) => setClientSecretInput(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="pt-2">
                                    <Button type="submit" className="w-full" variant="secondary">
                                        CONECTAR E INICIAR
                                    </Button>
                                    {sdkError && (
                                        <p className="text-red-500 text-xs mt-3 text-center bg-red-50 p-2 rounded border border-red-100">
                                            {sdkError}
                                        </p>
                                    )}
                                </div>
                            </form>
                            <p className="text-[10px] text-center text-slate-400 mt-6 border-t border-slate-100 pt-4">
                                Las claves se usarán solo para esta sesión y no se guardarán permanentemente.
                            </p>
                        </div>
                    </div>
                )}

                {/* 2. LOADING STATE */}
                {loading && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-white/90 backdrop-blur-sm">
                         <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                         <h3 className="text-slate-800 font-bold uppercase tracking-widest text-sm">Autenticando</h3>
                         <p className="text-slate-500 text-xs mt-2">Conectando con servidores biométricos...</p>
                     </div>
                )}

                {/* 3. PERFECT CORP CONTAINER */}
                <div 
                    ref={containerRef} 
                    id="perfect-corp-container" 
                    className="flex-grow w-full h-full bg-slate-100 relative min-h-[600px]"
                >
                    {/* The SDK usually injects an Iframe here. */}
                </div>
            </div>

            {/* FOOTER INFO */}
            <div className="bg-white border-t border-slate-200 p-3 text-center text-[10px] text-slate-400 uppercase tracking-wider">
                Simetría AI by Clínica Miró &bull; Tecnología de Análisis Facial Avanzado
            </div>

        </div>
    </div>
  );
};

export default AestheticSimulator;