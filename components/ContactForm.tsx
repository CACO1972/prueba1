import React, { useState } from 'react';
import Button from './Button';

interface ContactFormProps {
  onDownload: () => void;
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <div className="relative">
    <input
      className="w-full bg-transparent border-b border-slate-300 px-2 py-4 text-slate-800 placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-colors duration-300 text-lg font-medium"
      {...props}
    />
  </div>
);

const ContactForm: React.FC<ContactFormProps> = ({ 
  onDownload, 
  title = "Desbloquear Diseño", 
  subtitle = "Ingresa tus datos para revelar tu simulación", 
  buttonText = "VER MI NUEVA SONRISA"
}) => {
  const [whatsapp, setWhatsapp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API delay for realism
    setTimeout(() => {
        setIsSubmitting(false);
        onDownload(); // Trigger parent action
    }, 1000);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in-up relative z-20">
      <div className="p-8 bg-slate-50 border-b border-slate-100">
        <h3 className="text-2xl font-medium text-center text-slate-800 mb-3">{title}</h3>
        <p className="text-center text-slate-600 text-sm uppercase tracking-wide font-semibold leading-relaxed">{subtitle}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-8 bg-white">
        <div>
          <label htmlFor="name" className="sr-only">Nombre</label>
          <InputField type="text" id="name" name="name" placeholder="NOMBRE COMPLETO" required />
        </div>
        <div>
          <label htmlFor="whatsapp" className="sr-only">WhatsApp</label>
          <div className="relative flex items-center border-b border-slate-300 transition-colors duration-300 focus-within:border-amber-400">
             <span className="text-slate-600 pl-2 text-lg font-medium">+56</span>
             <input
                type="tel"
                id="whatsapp"
                name="whatsapp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder=" 9 1234 5678"
                className="w-full bg-transparent border-none px-2 py-4 text-slate-800 placeholder-slate-600 focus:outline-none focus:ring-0 text-lg font-medium"
                required
             />
          </div>
        </div>
        <div className="pt-4">
          <Button type="submit" disabled={isSubmitting} className="w-full py-4 text-base font-bold shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]">
            {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    PROCESANDO...
                </span>
            ) : (
                buttonText
            )}
          </Button>
          <p className="text-center text-xs text-slate-500 mt-5 leading-tight font-medium">
            Al continuar, aceptas ser contactado para validar tu diagnóstico.
          </p>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;