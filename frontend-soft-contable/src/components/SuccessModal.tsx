// components/SuccessModal.tsx
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessModalProps {
  showModal: boolean;
  closeModal: () => void;
  nombreColegio: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ showModal, closeModal, nombreColegio }) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full shadow-2xl text-center animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} strokeWidth={2.5} />
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase">¡Plataforma Lista!</h3>
        <p className="text-slate-500 mb-8 text-sm leading-relaxed">
          Hemos creado el entorno para <strong>{nombreColegio}</strong>. Recibirás un correo de bienvenida con las instrucciones de acceso.
        </p>
        <button onClick={closeModal} className="w-full bg-[#1e3a8a] text-white font-black py-4 rounded-2xl hover:bg-black transition-all uppercase tracking-widest text-xs">
          Ir al Dashboard
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
