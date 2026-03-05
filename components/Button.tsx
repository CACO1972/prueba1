import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  const baseClasses = 'px-12 py-6 font-black tracking-[0.4em] rounded-full transition-all duration-700 focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed text-[12px] uppercase select-none relative overflow-hidden group';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-amber-700 via-amber-200 to-amber-800 text-slate-950 border-none shadow-2xl hover:shadow-amber-500/40 active:scale-95',
    secondary: 'bg-white/5 border border-white/10 text-white hover:bg-white/10 shadow-xl backdrop-blur-3xl active:scale-95',
    outline: 'bg-transparent border border-white/20 text-slate-400 hover:border-amber-500 hover:text-white active:scale-95'
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {/* Light sweep effect */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default Button;