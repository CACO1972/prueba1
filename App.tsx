import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ImageProcessor from './components/ImageProcessor';
import Footer from './components/Footer';

export type AppStep = 'intro' | 'processing' | 'result';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('intro');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Scroll to top whenever step changes to fix navigation position
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleStart = () => {
    setStep('processing');
  };

  const handleReset = () => {
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
            onReset={handleReset}
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