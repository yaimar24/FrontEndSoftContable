import React from 'react';

interface LoadingOverlayProps {
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = "Cargando..." }) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative flex items-center justify-center">
        <div className="w-24 h-24 border-8 border-slate-100 border-t-[#1e3a8a] rounded-full animate-spin"></div>
{/*         <img src="sicpie-icon.png" alt="Logo" className="absolute w-10 h-10 animate-pulse" />
 */}      </div>
      <div className="mt-8 text-center">
        <p className="text-sm font-black text-[#1e3a8a] uppercase tracking-[0.4em] animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;