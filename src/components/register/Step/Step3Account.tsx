import { useState, type ChangeEvent, type FormEvent } from "react";
import { Lock, ShieldCheck, Upload } from "lucide-react";
import InputField from "../../common/InputField";
import { validators } from "../../../utils/validators";
import { validateForm } from "../../../utils/validateForm";
import type { RegistroFormData } from "../RegisterForm";
import Button from "../../common/Button";

interface Step3Props {
  formData: RegistroFormData;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void; // Parent change
  prevStep: () => void;
  onSubmit: (data: RegistroFormData) => void;
}

const Step3Account: React.FC<Step3Props> = ({
  formData,
  handleChange,
  prevStep,
  onSubmit,
}) => {
  // Estado local para inputs controlados
  const [localFormData, setLocalFormData] = useState<RegistroFormData>({
    email: formData.email || "",
    password: formData.password || "",
    confirmPassword: formData.confirmPassword || "",
    logo: formData.logo || undefined,
    planSeleccionado: formData.planSeleccionado || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  // Previsualización del logo
  const logoPreview =
    localFormData.logo instanceof File
      ? URL.createObjectURL(localFormData.logo)
      : null;

  // Validación de contraseñas
  const passwordsMatch = () => (_value: string, form: RegistroFormData) =>
    form.password !== form.confirmPassword
      ? "Las contraseñas no coinciden"
      : null;

  const schema = {
    email: [validators.required()],
    password: [validators.required(), validators.minLength(6)],
    confirmPassword: [validators.required(), passwordsMatch()],
  };

  // Manejar cambios locales
  const handleLocalChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, files } = e.target;

    const fieldValue =
      type === "checkbox" ? checked : type === "file" ? files?.[0] : value;

    setLocalFormData((prev) => ({ ...prev, [name]: fieldValue }));

    // También propagar al parent si es necesario
    handleChange(e);
  };

  // Manejar submit
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(localFormData, schema);

    if (Object.keys(validationErrors).length === 0) {
      onSubmit(localFormData); // Enviar datos al parent
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500"
    >
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="bg-amber-100 p-3 rounded-xl text-amber-700 shadow-sm">
          <Lock size={24} />
        </div>
        <h2 className="text-2xl font-bold border-b-2 border-amber-500 pr-6 italic text-slate-800">
          Acceso al Sistema
        </h2>
      </div>

      {/* Tarjeta de Plan */}
      <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-[2.5rem] border-2 border-dashed border-slate-200 shadow-inner">
        {/*   <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
            Plan de Suscripción
          </span>
          <span className="bg-[#1e3a8a] text-white text-[10px] font-black px-5 py-1.5 rounded-full uppercase shadow-lg shadow-blue-900/20">
            {localFormData.planSeleccionado}
          </span>
        </div> */}
        <div className="flex items-center gap-5">
          <div className="bg-white p-3 rounded-2xl shadow-sm">
            <ShieldCheck className="text-emerald-500" size={32} />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-base">
              Suscripción Activada
            </p>
            <p className="text-xs text-slate-500 font-medium">
              Módulo contable completo + Facturación ilimitada
            </p>
          </div>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 gap-6">
        <InputField
          label="Correo Electrónico Administrador"
          type="email"
          name="email"
          value={localFormData.email ?? ""}
          onChange={handleLocalChange}
          placeholder="admin@colegio.com"
          required
          error={errors.email}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Contraseña"
            type="password"
            name="password"
            value={localFormData.password ?? ""}
            onChange={handleLocalChange}
            placeholder="••••••••"
            required
            showToggle
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            error={errors.password}
          />

          <InputField
            label="Confirmar Contraseña"
            type="password"
            name="confirmPassword"
            value={localFormData.confirmPassword ?? ""}
            onChange={handleLocalChange}
            placeholder="••••••••"
            required
            showToggle
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            error={errors.confirmPassword}
          />
        </div>

        {/* Logo */}
        <div className="flex flex-col items-center pt-4">
          <label className="mb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
            Identidad Institucional (Logo)
          </label>
          <div className="relative w-44 h-44 rounded-[2.5rem] border-2 border-dashed border-slate-300 bg-white shadow-xl overflow-hidden hover:border-[#1e3a8a] transition-all flex items-center justify-center cursor-pointer group">
            {logoPreview ? (
              <div className="relative w-full h-full p-4 animate-in zoom-in-95 duration-300">
                <img
                  src={logoPreview}
                  alt="Logo Colegio"
                  className="object-contain w-full h-full drop-shadow-md"
                  onLoad={() => {
                    if (logoPreview) URL.revokeObjectURL(logoPreview);
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Upload className="text-white" size={24} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <Upload size={32} />
                <span className="text-[10px] font-black mt-2">SUBIR LOGO</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              name="logo"
              onChange={handleLocalChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex flex-col md:flex-row gap-4 pt-6">
     <Button
          type="button"
          variant="secondary"
          onClick={prevStep}
          className="order-2 md:order-1 py-5"
        >
          Atrás
        </Button>

        <Button
          type="submit"
          variant="primary"
          className="flex-[2] order-1 md:order-2 py-5 text-sm tracking-[0.2em]"
        >
          Finalizar Registro
        </Button>
      </div>
    </form>
  );
};

export default Step3Account;
