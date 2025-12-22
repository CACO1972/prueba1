import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ImageProcessor from './components/ImageProcessor';
import AestheticSimulator from './components/AestheticSimulator';
import MarketingShowcase from './components/MarketingShowcase';
import Footer from './components/Footer';

export type AppStep = 'intro' | 'processing' | 'result' | 'aesthetic' | 'marketing';

const App: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [step, setStep] = useState<AppStep>('intro');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [hasPaid, setHasPaid] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    const savedStep = sessionStorage.getItem('mir_step') as AppStep;
    const savedOriginal = sessionStorage.getItem('mir_original');
    const savedGenerated = sessionStorage.getItem('mir_generated');
    const savedPaid = sessionStorage.getItem('mir_paid') === 'true';

    if (savedStep && savedStep !== 'marketing') setStep(savedStep);
    if (savedOriginal) setOriginalImage(savedOriginal);
    if (savedGenerated) setGeneratedImage(savedGenerated);
    if (savedPaid) setHasPaid(true);

    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');
    const status = searchParams.get('status');

    if (token || status === 'paid') {
      setHasPaid(true);
      sessionStorage.setItem('mir_paid', 'true');
      setStep('result');
      window.history.replaceState({}, '', window.location.origin + window.location.pathname);
    } else if (status === 'failure') {
      setPaymentError("No se pudo confirmar el pago. Por favor intenta nuevamente.");
      setStep('result');
      window.history.replaceState({}, '', window.location.origin + window.location.pathname);
    }
    
    setIsVerifying(false);
  }, []);

  useEffect(() => {
    if (!isVerifying) {
      sessionStorage.setItem('mir_step', step);
      if (originalImage) sessionStorage.setItem('mir_original', originalImage);
      if (generatedImage) sessionStorage.setItem('mir_generated', generatedImage);
    }
  }, [step, originalImage, generatedImage, isVerifying]);

  const handleReset = () => {
    sessionStorage.clear();
    setStep('intro');
    setOriginalImage(null);
    setGeneratedImage(null);
    setHasPaid(false);
    setPaymentError(null);
  };

  if (isVerifying) {
    return (
      <div className="bg-[#0f1115] min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#050608] min-h-screen text-slate-300 antialiased relative overflow-x-hidden flex flex-col">
      <Glow />
      <Header />
      <main className="relative z-10 flex-grow flex flex-col pt-32">
        {paymentError && (
          <div className="max-w-4xl mx-auto w-full mb-8 px-4">
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl flex items-center gap-4">
              <p className="text-[10px] font-black uppercase tracking-widest">{paymentError}</p>
              <button onClick={() => setPaymentError(null)} className="ml-auto text-xs">✕</button>
            </div>
          </div>
        )}

        {step === 'intro' && <Hero onStart={() => setStep('processing')} />}
        
        {(step === 'processing' || step === 'result') && (
          <ImageProcessor
            step={step}
            originalImage={originalImage}
            generatedImage={generatedImage}
            hasPaid={hasPaid}
            onSimulationComplete={(orig, gen) => {
                setOriginalImage(orig);
                setGeneratedImage(gen);
                setStep('result');
            }}
            onStartAesthetic={() => setStep('aesthetic')}
            onOpenMarketing={() => setStep('marketing')}
            onReset={handleReset}
          />
        )}

        {step === 'marketing' && originalImage && generatedImage && (
            <MarketingShowcase 
                originalImage={originalImage} 
                generatedImage={generatedImage} 
                onClose={() => setStep('result')} 
            />
        )}

        {step === 'aesthetic' && originalImage && (
            <AestheticSimulator imageSrc={originalImage} onBack={() => setStep('result')} />
        )}
      </main>
      <Footer />
    </div>
  );
};

const Glow: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none z-0">
    <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[100vw] h-[60vh] bg-amber-500/5 blur-[150px] rounded-full" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vh] bg-indigo-500/5 blur-[120px] rounded-full" />
  </div>
);

export default App;