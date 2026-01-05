// components/Step1BasicInfo.tsx
import type { ChangeEvent } from 'react';
import { School, MapPin } from 'lucide-react';
import InputField from './InputField';

interface Step1Props {
  formData: {
    nombreColegio: string;
    nit: string;
    direccion: string;
  };
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  nextStep: () => void;
}

const Step1BasicInfo: React.FC<Step1Props> = ({ formData, handleChange, nextStep }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
    <div className="flex items-center space-x-3">
      <div className="bg-blue-100 p-2.5 rounded-xl text-[#1e3a8a]"><School size={22} /></div>
      <h2 className="text-xl font-bold border-b-2 border-blue-500 pr-6 italic">Información de Identidad</h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <InputField label="Nombre de la Institución" name="nombreColegio" value={formData.nombreColegio} onChange={handleChange} placeholder="Ej: Liceo Moderno" />
      <InputField label="NIT / ID Fiscal" name="nit" value={formData.nit} onChange={handleChange} placeholder="800.000.000-0" />
      <InputField label="Dirección Física" name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Dirección completa del plantel" icon={MapPin} />
    </div>

    <button type="button" onClick={nextStep} className="w-full mt-6 bg-[#1e3a8a] hover:bg-[#152a61] text-white font-black py-5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl uppercase tracking-widest text-sm">
      Siguiente: Datos Legales
    </button>
  </div>
);

export default Step1BasicInfo;
