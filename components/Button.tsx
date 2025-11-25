import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  const baseClasses = 'px-8 py-3 font-medium tracking-wide rounded transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-amber-300 to-amber-500 text-slate-900 hover:from-amber-200 hover:to-amber-400 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transform hover:-translate-y-0.5 border border-transparent',
    secondary: 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20',
    outline: 'bg-transparent border border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-900 hover:bg-slate-100'
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;