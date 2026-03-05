import React, { useState } from 'react';
import Button from './Button';

interface ContactFormProps {
  onDownload: () => void;
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <div className="relative group">
    <input
      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all duration-300 text-sm font-medium tracking-wide uppercase"
      {...props}
    />
  </div>
);

const ContactForm: React.FC<ContactFormProps> = ({ 
  onDownload, 
  title = "Recepción de Informe", 
  subtitle = "Recibe tu análisis profesional Miró Elite", 
  buttonText = "VER MI NUEVA SONRISA"
}) => {
  const [whatsapp, setWhatsapp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
        setIsSubmitting(false);
        onDownload();
    }, 1500);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-[#121418] rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.6)] border border-white/5 overflow-hidden animate-fade-in-up relative z-20">
      <div className="p-12 md:p-16 border-b border-white/5 bg-[#1a1c22]">
        <h3 className="text-2xl md:text-3xl font-light text-center text-white mb-4 uppercase tracking-[0.4em] italic leading-tight">{title}</h3>
        <p className="text-center text-slate-500 text-[11px] uppercase tracking-[0.4em] font-black leading-relaxed">{subtitle}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-12 md:p-16 space-y-10">
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Nombre Completo</label>
          <InputField type="text" id="name" name="name" placeholder="EJ: JUAN PÉREZ" required />
        </div>
        
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">WhatsApp de Contacto</label>
          <div className="relative flex items-center group">
             <span className="absolute left-6 text-amber-500 text-sm font-black tracking-widest">+56</span>
             <input
                type="tel"
                id="whatsapp"
                name="whatsapp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="9 1234 5678"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-white placeholder-slate-700 focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all text-sm font-medium tracking-wide"
                required
             />
          </div>
        </div>

        <div className="pt-8 space-y-8">
          <Button type="submit" disabled={isSubmitting} className="w-full py-8 text-[12px] font-black tracking-[0.4em] shadow-2xl shadow-amber-500/20">
            {isSubmitting ? (
                <span className="flex items-center justify-center gap-4">
                    <svg className="animate-spin h-5 w-5 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    SINCRO_DATA...
                </span>
            ) : (
                buttonText
            )}
          </Button>
          <p className="text-center text-[10px] text-slate-600 leading-relaxed font-black uppercase tracking-[0.3em]">
            Al continuar, certificas que tus datos son válidos para recibir la documentación oficial de Clínica Miró.
          </p>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;