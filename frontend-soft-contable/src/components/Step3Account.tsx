import type { ChangeEvent } from 'react';
import { Lock, Mail, ShieldCheck, Upload } from 'lucide-react';
import InputField from './InputField';

interface Step3Props {
  formData: {
    email: string;
    password: string;
    confirmPassword: string;
    planSeleccionado: string;
    logo?: File; // Nuevo campo
  };
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  prevStep: () => void;
}

const Step3Account: React.FC<Step3Props> = ({ formData, handleChange, prevStep }) => {
  const logoPreview = formData.logo ? URL.createObjectURL(formData.logo) : null;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">

      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="bg-amber-100 p-3 rounded-xl text-amber-700">
          <Lock size={24} />
        </div>
        <h2 className="text-2xl font-bold border-b-2 border-amber-500 pr-6 italic">Acceso al Sistema</h2>
      </div>

      {/* Plan */}
      <div className="p-6 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Plan de Suscripción</span>
          <span className="bg-[#1e3a8a] text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase">{formData.planSeleccionado}</span>
        </div>
        <div className="flex items-center gap-4">
          <ShieldCheck className="text-[#10b981]" size={36} />
          <div>
            <p className="font-bold text-slate-800 text-sm">Suscripción Activada</p>
            <p className="text-xs text-slate-500">Módulo contable completo + Facturación ilimitada</p>
          </div>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 gap-6">
        <InputField
          label="Correo Electrónico Administrador"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="admin@colegio.com"
          icon={Mail}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Contraseña" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" />
          <InputField label="Confirmar Contraseña" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" />
        </div>

        {/* Logo del Colegio */}
        <div className="flex flex-col items-center">
          <label className="mb-2 text-xs font-black text-slate-500 uppercase tracking-widest">Logo del Colegio</label>
          <div className="relative w-40 h-40 rounded-xl border-2 border-dashed border-slate-300 bg-white shadow-md overflow-hidden hover:border-[#1e3a8a] transition-all flex items-center justify-center cursor-pointer group">
            {logoPreview ? (
              <img src={logoPreview} alt="Logo Colegio" className="object-contain w-full h-full p-2" />
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <Upload size={32} />
                <span className="text-sm mt-2">Sube tu logo</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              name="logo"
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 pt-6">
        <button
          type="button"
          onClick={prevStep}
          className="flex-1 bg-slate-100 text-slate-600 font-bold py-5 rounded-2xl hover:bg-slate-200 transition-all uppercase text-xs tracking-widest"
        >
          Atrás
        </button>
        <button
          type="submit"
          className="flex-[2] bg-[#1e3a8a] text-white font-black py-5 rounded-2xl hover:bg-black transition-all shadow-xl uppercase text-sm tracking-widest"
        >
          Finalizar Registro
        </button>
      </div>
    </div>
  );
};

export default Step3Account;
