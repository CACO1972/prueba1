
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ImageProcessor from './components/ImageProcessor';
import AestheticSimulator from './components/AestheticSimulator';
import MarketingShowcase from './components/MarketingShowcase';
import Footer from './components/Footer';

export type AppStep = 'intro' | 'processing' | 'result' | 'aesthetic' | 'marketing' | 'demo';

const App: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [step, setStep] = useState<AppStep>('intro');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [hasPaid, setHasPaid] = useState<boolean>(false);

  useEffect(() => {
    const savedStep = sessionStorage.getItem('mir_step') as AppStep;
    const savedOriginal = sessionStorage.getItem('mir_original');
    const savedGenerated = sessionStorage.getItem('mir_generated');
    const savedPaid = sessionStorage.getItem('mir_paid') === 'true';

    if (savedStep && !['marketing', 'demo'].includes(savedStep)) setStep(savedStep);
    if (savedOriginal) setOriginalImage(savedOriginal);
    if (savedGenerated) setGeneratedImage(savedGenerated);
    if (savedPaid) setHasPaid(true);

    setIsVerifying(false);
  }, []);

  useEffect(() => {
    if (!isVerifying) {
      sessionStorage.setItem('mir_step', step);
      if (originalImage) sessionStorage.setItem('mir_original', originalImage);
      if (generatedImage) sessionStorage.setItem('mir_generated', generatedImage);
      if (hasPaid) sessionStorage.setItem('mir_paid', 'true');
    }
  }, [step, originalImage, generatedImage, hasPaid, isVerifying]);

  const handleReset = () => {
    sessionStorage.clear();
    setStep('intro');
    setOriginalImage(null);
    setGeneratedImage(null);
    setHasPaid(false);
  };

  if (isVerifying) {
    return (
      <div className="bg-[#050608] min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin shadow-[0_0_20px_rgba(99,102,241,0.3)]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#050608] min-h-screen text-slate-300 antialiased relative overflow-x-hidden flex flex-col">
      <Glow />
      <Header />
      <main className="relative z-10 flex-grow flex flex-col pt-32 md:pt-40">
        
        {step === 'intro' && (
            <Hero 
                onStart={() => setStep('processing')} 
                onOpenDemo={() => setStep('demo')} 
            />
        )}
        
        {step === 'demo' && (
            <MarketingShowcase 
                isDemo={true} 
                onClose={() => setStep('intro')} 
            />
        )}

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
            onFormComplete={() => {
                setHasPaid(true);
                setStep('result');
            }}
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
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    {/* Neón Lilas y Azules para profundidad */}
    <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vh] bg-indigo-600/10 blur-[180px] rounded-full animate-pulse" />
    <div className="absolute top-[10%] right-[-10%] w-[50vw] h-[60vh] bg-fuchsia-600/5 blur-[160px] rounded-full" />
    <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[100vw] h-[40vh] bg-amber-500/5 blur-[200px] rounded-full" />
    
    {/* Textura de rejilla sutil */}
    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]"></div>
  </div>
);

export default App;
