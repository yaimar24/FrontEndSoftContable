import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface StatusModalProps {
  show: boolean;
  success: boolean;
  message: string;
  onClose: () => void;
}

const StatusModal: React.FC<StatusModalProps> = ({
  show,
  success,
  message,
  onClose,
}) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full shadow-2xl text-center animate-in zoom-in duration-300">
        
        {/* Icon */}
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            success
              ? 'bg-emerald-50 text-emerald-500'
              : 'bg-red-50 text-red-500'
          }`}
        >
          {success ? (
            <CheckCircle size={48} strokeWidth={2.5} />
          ) : (
            <XCircle size={48} strokeWidth={2.5} />
          )}
        </div>

        {/* Title */}
        <h3 className="text-2xl font-black mb-2 uppercase text-slate-900">
          {success ? '¡Proceso Exitoso!' : 'Ocurrió un Error'}
        </h3>

        {/* Message */}
        <p className="text-slate-500 mb-8 text-sm leading-relaxed">
          {message}
        </p>

        {/* Action */}
        <button
          type="button"
          onClick={onClose}
          className={`w-full font-black py-4 rounded-2xl transition-all uppercase tracking-widest text-xs ${
            success
              ? 'bg-[#1e3a8a] text-white hover:bg-black'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          {success ? 'Continuar' : 'Intentar Nuevamente'}
        </button>
      </div>
    </div>
  );
};

export default StatusModal;
