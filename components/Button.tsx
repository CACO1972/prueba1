import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  const baseClasses = 'px-8 py-3 font-medium tracking-wide rounded transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0f1115] disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-amber-400 via-amber-200 to-amber-600 text-slate-900 hover:scale-[1.02] shadow-xl shadow-amber-500/10 hover:shadow-amber-500/20 transform border border-transparent font-bold',
    secondary: 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20',
    outline: 'bg-transparent border border-white/10 text-slate-300 hover:border-amber-500/50 hover:text-white hover:bg-white/5'
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;