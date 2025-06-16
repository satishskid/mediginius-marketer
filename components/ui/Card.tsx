
import React from 'react';

interface CardProps {
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className, titleClassName }) => {
  return (
    <div className={`bg-slate-800/70 p-6 rounded-xl shadow-2xl border border-slate-700 backdrop-blur-sm ${className}`}>
      {title && <h3 className={`text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300 mb-4 ${titleClassName}`}>{title}</h3>}
      {children}
    </div>
  );
};
