import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Button from './Button'; 

interface StatusModalProps {
  show: boolean;
  success?: boolean;
  type?: 'success' | 'error' | 'confirm';
  message: string;
  onClose: () => void;
  onConfirm?: () => void; 
  confirmText?: string;   
  cancelText?: string;    
}

const StatusModal: React.FC<StatusModalProps> = ({
  show,
  success,
  type = success ? 'success' : 'error',
  message,
  onClose,
  onConfirm,
  confirmText = "Confirmar",
  cancelText = "Cancelar"
}) => {
  const [isAnimate, setIsAnimate] = useState(false);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => setIsAnimate(true), 10);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'unset';
      };
    } else {
      setIsAnimate(false);
    }
  }, [show]);

  if (!show) return null;

  const config = {
    success: {
      color: 'bg-emerald-400',
      iconBg: 'bg-emerald-50 text-emerald-500 ring-emerald-50/50',
      icon: <CheckCircle size={52} strokeWidth={2.5} className="animate-bounce" />,
      title: '¡Exitoso!',
      btnVariant: 'primary' as const
    },
    error: {
      color: 'bg-red-400',
      iconBg: 'bg-red-50 text-red-500 ring-red-50/50',
      icon: <XCircle size={52} strokeWidth={2.5} className="animate-pulse" />,
      title: '¡Algo Falló!',
      btnVariant: 'danger' as const
    },
    confirm: {
      color: 'bg-blue-400',
      iconBg: 'bg-blue-50 text-blue-500 ring-blue-50/50',
      icon: <AlertCircle size={52} strokeWidth={2.5} />,
      title: '¿Seguro?',
      btnVariant: 'primary' as const
    }
  };

  const currentType = onConfirm ? 'confirm' : (type as 'success' | 'error' | 'confirm');
  const theme = config[currentType];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog">
      <div 
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-500 ${isAnimate ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      <div className={`
        relative bg-white rounded-[3.5rem] p-10 max-w-sm w-full text-center shadow-2xl transition-all duration-700
        ${isAnimate ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-20 scale-50 opacity-0'}
      `}
      style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 blur-[80px] opacity-30 -z-10 rounded-full transition-all duration-1000 ${isAnimate ? 'scale-150' : 'scale-0'} ${theme.color}`} />

        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 transition-all duration-700 delay-300 ${isAnimate ? 'scale-110 opacity-100' : 'scale-0 opacity-0'} ${theme.iconBg}`}>
          {theme.icon}
        </div>

        <div className={`space-y-3 mb-10 transition-all duration-700 delay-500 ${isAnimate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
            {theme.title}
          </h3>
          <p className="text-slate-500 text-sm font-medium leading-relaxed px-4">{message}</p>
        </div>

        {/* --- BOTONES USANDO SOLO COMPONENTES COMMON --- */}
        <div className={`flex flex-col gap-2 transition-all duration-700 delay-700 ${isAnimate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          
          {/* Botón de Acción Principal */}
          <Button 
            variant={theme.btnVariant} 
            onClick={onConfirm || onClose} 
            fullWidth 
            className="py-5 rounded-[2rem] shadow-xl shadow-blue-100"
          >
            {onConfirm ? confirmText : "Entendido"}
          </Button>
          
          {/* Botón de Acción Secundaria (Solo en Confirmación) */}
          {onConfirm && (
            <Button 
              variant="outline" 
              onClick={onClose}
              fullWidth
              className="border-none bg-transparent text-slate-400 hover:text-slate-600 shadow-none py-2 text-[10px] uppercase tracking-widest font-black"
            >
              {cancelText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusModal;