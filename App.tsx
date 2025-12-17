import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ImageProcessor from './components/ImageProcessor';
import AestheticSimulator from './components/AestheticSimulator';
import Footer from './components/Footer';

export type AppStep = 'intro' | 'processing' | 'result' | 'aesthetic';

const App: React.FC = () => {
  // Initialize state from sessionStorage if available to handle return from payment gateway
  const [step, setStep] = useState<AppStep>(() => 
    (sessionStorage.getItem('mir_step') as AppStep) || 'intro'
  );
  const [originalImage, setOriginalImage] = useState<string | null>(() => 
    sessionStorage.getItem('mir_original')
  );
  const [generatedImage, setGeneratedImage] = useState<string | null>(() => 
    sessionStorage.getItem('mir_generated')
  );

  // Persist state changes to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('mir_step', step);
    if (originalImage) sessionStorage.setItem('mir_original', originalImage);
    if (generatedImage) sessionStorage.setItem('mir_generated', generatedImage);
  }, [step, originalImage, generatedImage]);

  // Scroll to top whenever step changes to fix navigation position
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleStart = () => {
    setStep('processing');
  };

  const handleStartAesthetic = () => {
    setStep('aesthetic');
  };

  const handleReset = () => {
    // Clear session storage on reset
    sessionStorage.removeItem('mir_step');
    sessionStorage.removeItem('mir_original');
    sessionStorage.removeItem('mir_generated');
    
    setStep('intro');
    setOriginalImage(null);
    setGeneratedImage(null);
  };
  
  const handleSimulationComplete = (original: string, generated: string) => {
    setOriginalImage(original);
    setGeneratedImage(generated);
    setStep('result');
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 antialiased relative overflow-x-hidden font-sans selection:bg-amber-500/30 flex flex-col">
      <Glow />
      <Header />
      {/* Added pt-24 (mobile) and pt-32 (desktop) to prevent Header from overlapping content */}
      <main className="relative z-10 px-4 sm:px-6 lg:px-8 flex-grow flex flex-col pt-24 md:pt-32">
        {step === 'intro' && <Hero onStart={handleStart} />}
        
        {(step === 'processing' || step === 'result') && (
          <ImageProcessor
            step={step}
            originalImage={originalImage}
            generatedImage={generatedImage}
            onSimulationComplete={handleSimulationComplete}
            onStartAesthetic={handleStartAesthetic}
            onReset={handleReset}
          />
        )}

        {step === 'aesthetic' && originalImage && (
            <AestheticSimulator 
                imageSrc={originalImage} 
                onBack={() => setStep('result')}
            />
        )}
      </main>
      <Footer />
    </div>
  );
};

const Glow: React.FC = () => (
  <>
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[50vh] bg-indigo-200/30 blur-[120px] rounded-full z-0 pointer-events-none" />
    <div className="absolute bottom-0 right-0 w-[40vw] h-[40vh] bg-amber-400/10 blur-[100px] rounded-full z-0 pointer-events-none" />
  </>
);

export default App;