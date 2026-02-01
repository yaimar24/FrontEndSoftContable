import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, subtitle, children }) => {
  // Cerrar con la tecla Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-500/20 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
      <div 
        className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera Estándar */}
        <div className="p-8 pb-0 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter leading-none">
              {title}
            </h2>
            {subtitle && (
              <div className="mt-2 text-blue-600">
                 <span className="px-2 py-0.5 bg-blue-50 text-[10px] font-bold rounded-full uppercase tracking-wider">
                    {subtitle}
                 </span>
              </div>
            )}
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido Inyectado */}
        <div className="p-8 pt-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;