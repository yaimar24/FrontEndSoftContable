import React, { useState, type ChangeEvent } from "react";
import { Lock, ShieldCheck, Upload, Mail } from "lucide-react";
import InputField from "../../InputField";
import { validators } from "../../../utils/validators";
import { validateForm } from "../../../utils/validateForm";
import type { Colegio } from "../../../models/Colegio";

/**
 * Extendemos Colegio para el flujo de registro.
 * Agregamos campos que no están en el modelo de base de datos
 * pero son necesarios para la validación del formulario.
 */
interface RegistroFormData extends Partial<Colegio> {
  // Campos para la cuenta de usuario inicial
  email?: string;
  password?: string;
  confirmPassword?: string;
  // Campos auxiliares para UI
  logo?: File;
  // Mapeo temporal si no estás usando el array de representantesLegales aún
  nombreRepresentante?: string; 
  numeroIdentificacionRepresentante?: string;
}

interface Step3Props {
  formData: RegistroFormData;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  prevStep: () => void;
  onSubmit: () => void;
}

const Step3Account: React.FC<Step3Props> = ({
  formData,
  handleChange,
  prevStep,
  onSubmit,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPass, setShowPass] = useState(false);

  const logoPreview = formData.logo instanceof File
    ? URL.createObjectURL(formData.logo)
    : null;

  const passwordsMatch = () => (_value: string | undefined, form: RegistroFormData) =>
    form.password !== form.confirmPassword
      ? "Las contraseñas no coinciden"
      : null;

  const schema = {
    email: [validators.required(), validators.email?.() || ((v: string) => !v.includes('@') ? 'Email inválido' : null)],
    password: [validators.required(), validators.minLength(6)],
    confirmPassword: [validators.required(), passwordsMatch()],
  };

  const handleFinalSubmit = () => {
    const validationErrors = validateForm(formData, schema) as Record<string, string>;

    if (Object.keys(validationErrors).length === 0) {
      onSubmit();
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="bg-amber-100 p-3 rounded-xl text-amber-700">
          <Lock size={24} />
        </div>
        <h2 className="text-2xl font-bold border-b-2 border-amber-500 pr-6 italic">
          Acceso al Sistema
        </h2>
      </div>

      {/* Card de Resumen con datos del Colegio */}
      <div className="p-6 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Institución</p>
            <p className="font-bold text-slate-700">{formData.nombreColegio || 'No definido'}</p>
          </div>
          <span className="bg-[#1e3a8a] text-white text-[9px] font-black px-3 py-1 rounded-lg uppercase">
            Plan {formData.planSeleccionado}
          </span>
        </div>
        
        <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
          <ShieldCheck className="text-emerald-500" size={20} />
          <p className="text-[11px] text-slate-500 font-medium">
            Al finalizar, se creará el perfil para el NIT: <span className="font-bold text-slate-700">{formData.nit}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <InputField
          label="Email del Administrador"
          type="email"
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          icon={Mail}
          placeholder="ejemplo@colegio.edu.co"
          required
          error={errors.email}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password || ""}
            onChange={handleChange}
            placeholder="••••••••"
            required
            showToggle
            showPassword={showPass}
            setShowPassword={setShowPass}
            error={errors.password}
          />

          <InputField
            label="Confirmar"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword || ""}
            onChange={handleChange}
            placeholder="••••••••"
            required
            showToggle
            showPassword={showPass}
            setShowPassword={setShowPass}
            error={errors.confirmPassword}
          />
        </div>

        {/* Logo con manejo de interfaz */}
        <div className="flex flex-col items-center pt-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Logo Institucional</span>
          <div className="relative group">
            <div className="w-40 h-40 rounded-[2.5rem] border-4 border-white shadow-xl overflow-hidden bg-slate-50 flex items-center justify-center transition-transform hover:scale-105">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-4" />
              ) : (
                <Upload size={40} className="text-slate-300 group-hover:text-[#1e3a8a] transition-colors" />
              )}
              <input 
                type="file" 
                name="logo" 
                onChange={handleChange} 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                accept="image/*"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={prevStep}
          className="flex-1 bg-slate-100 text-slate-500 font-black py-5 rounded-2xl hover:bg-slate-200 uppercase text-[10px] tracking-widest transition-all"
        >
          Atrás
        </button>

        <button
          type="button"
          onClick={handleFinalSubmit}
          className="flex-[2] bg-[#1e3a8a] text-white font-black py-5 rounded-2xl hover:bg-black shadow-2xl shadow-blue-200 uppercase text-xs tracking-[0.15em] transition-all"
        >
          Finalizar Registro
        </button>
      </div>
    </div>
  );
};

export default Step3Account;