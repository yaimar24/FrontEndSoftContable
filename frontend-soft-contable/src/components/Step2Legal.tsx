// components/Step2Legal.tsx
import type { ChangeEvent } from "react";
import { FileText, UserCheck } from "lucide-react";
import InputField from "./InputField";

interface Step2Props {
  formData: {
    resDian: string;
    fechaCertificado: string;
    representanteLegal: string;
    cedula: string;
    archivoDian?: File; // Nuevo campo opcional
  };
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const Step2Legal: React.FC<Step2Props> = ({
  formData,
  handleChange,
  handleFileChange,
  nextStep,
  prevStep,
}) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
    {/* Título */}
    <div className="flex items-center space-x-3">
      <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-700">
        <FileText size={22} />
      </div>
      <h2 className="text-xl font-bold border-b-2 border-emerald-500 pr-6 italic">
        Legalidad y Facturación
      </h2>
    </div>

    {/* Inputs */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <InputField
        label="Resolución DIAN"
        name="resDian"
        value={formData.resDian}
        onChange={handleChange}
        placeholder="Número oficial"
      />

      <InputField
        label="Vencimiento Certificado"
        type="date"
        name="fechaCertificado"
        value={formData.fechaCertificado}
        onChange={handleChange}
      />

      <InputField
        label="Representante Legal"
        name="representanteLegal"
        value={formData.representanteLegal}
        onChange={handleChange}
        placeholder="Nombre completo"
        icon={UserCheck}
      />

      <InputField
        label="Cédula"
        name="cedula"
        value={formData.cedula}
        onChange={handleChange}
        placeholder="Número de identificación"
      />

      {/* Campo para adjuntar archivo */}
      <div className="flex flex-col space-y-2 md:col-span-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
          Subir Resolución DIAN (PDF)
        </label>
        <input
          type="file"
          name="archivoDian"
          accept=".pdf"
          onChange={handleFileChange}
          className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
        />
        {formData.archivoDian && (
          <p className="text-xs text-slate-500 mt-1">
            Archivo seleccionado: {formData.archivoDian.name}
          </p>
        )}
      </div>
    </div>

    {/* Botones */}
    <div className="flex gap-4">
      <button
        type="button"
        onClick={prevStep}
        className="flex-1 bg-slate-100 text-slate-600 font-bold py-5 rounded-2xl hover:bg-slate-200 transition-all uppercase text-xs tracking-widest flex items-center justify-center gap-2"
      >
        Volver
      </button>

      <button
        type="button"
        onClick={nextStep}
        className="flex-[2] bg-[#1e3a8a] text-white font-black py-5 rounded-2xl hover:bg-[#152a61] transition-all shadow-xl uppercase text-sm tracking-widest flex items-center justify-center gap-2"
      >
        Siguiente: Crear Cuenta
      </button>
    </div>
  </div>
);

export default Step2Legal;
