import React, { useState, type ChangeEvent } from "react";
import { FileText, UserCheck, Hash, Percent, ShieldCheck } from "lucide-react";
import InputField from "../../InputField";
import { validators } from "../../../utils/validators";
import { validateForm } from "../../../utils/validateForm";
import type { Colegio, RegimenIva, TipoIdentificacion, Tributo } from "../../../models/Colegio"; // Importamos el tipo real

interface MaestroBase {
  id: number;
  nombre: string;
}

interface Step2Props {
  formData: Partial<Colegio>; 
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  nextStep: () => void;
  prevStep: () => void;
  tipoIdentificaciones: TipoIdentificacion[];
  regimenIvas: RegimenIva[];
  tributos: Tributo[];
  responsabilidadesFiscales: MaestroBase[];
}

const Step2Legal: React.FC<Step2Props> = ({
  formData,
  handleChange,
  nextStep,
  prevStep,
  tipoIdentificaciones,
  regimenIvas,
  tributos,
  responsabilidadesFiscales,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const schema = {
    nombreRepresentante: [validators.required()],
    numeroIdentificacionRepresentante: [
      validators.required(),
      validators.onlyNumbers(),
    ],
    tipoIdentificacionId: [validators.requiredSelect()],
    tarifaIca: [
      validators.required(),
      validators.onlyNumbers(),
    ],
  };

  const handleNext = () => {
    const validationErrors = validateForm(formData, schema) as Record<string, string>;

    if (Object.keys(validationErrors).length === 0) {
      nextStep();
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-700">
          <FileText size={22} />
        </div>
        <h2 className="text-xl font-bold border-b-2 border-emerald-500 pr-6 italic">
          Legalidad y Facturación
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InputField
          label="Nombre Representante Legal"
          name="representanteLegal"
          value={formData.representanteLegal || ""}
          onChange={handleChange}
          icon={UserCheck}
          required
          error={errors.representanteLegal}
        />

        <InputField
          label="Número Identificación"
          name="identificacion"
          value={formData.identificacion || ""}
          onChange={handleChange}
          icon={Hash}
          required
          onlyNumbers
          maxLength={12}
          error={errors.identificacion}
        />

        {/* Tipo Identificación */}
        <div className="flex flex-col space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Tipo Identificación <span className="text-red-500">*</span>
          </label>
          <select
            name="tipoIdentificacionId"
            value={formData.tipoIdentificacionId || 0}
            onChange={handleChange}
            className={`w-full bg-slate-50 border-2 rounded-2xl p-4 font-bold text-slate-700 outline-none transition-all ${
              errors.tipoIdentificacionId ? 'border-red-500 focus:ring-red-500' : 'border-slate-100 focus:ring-emerald-500'
            }`}
          >
            <option value={0}>Selecciona tipo</option>
            {tipoIdentificaciones.map((t) => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
          {errors.tipoIdentificacionId && <span className="text-red-500 text-xs mt-1">{errors.tipoIdentificacionId}</span>}
        </div>

        <InputField
          label="Tarifa ICA (%)"
          name="tarifaIca"
          value={formData.tarifaIca || ""}
          onChange={handleChange}
          icon={Percent}
          required
          onlyNumbers
          allowDecimals
          error={errors.tarifaIca}
        />

        {/* Mapeo dinámico de selectores fiscales para reducir código repetido */}
        {[
          { label: "Régimen IVA", name: "regimenIvaId", options: regimenIvas },
          { label: "Tributo", name: "tributoId", options: tributos },
          { label: "Responsabilidad Fiscal", name: "responsabilidadFiscalId", options: responsabilidadesFiscales }
        ].map((field) => (
          <div key={field.name} className="flex flex-col space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{field.label}</label>
            <select
              name={field.name}
              // Usamos keyof Colegio para acceder a las propiedades de forma segura
              value={(formData[field.name as keyof Colegio] as string | number) || 0}
              onChange={handleChange}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            >
              <option value={0}>Seleccionar...</option>
              {field.options.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.nombre}</option>
              ))}
            </select>
          </div>
        ))}

        {/* Checkboxes con InputField (Tipo Tarjeta) */}
        <div className="grid grid-cols-1 md:col-span-2 gap-4 pt-4">
            <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                <ShieldCheck size={14}/> Configuración Avanzada
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CheckWrapper checked={!!formData.manejaAiu}>
                    <InputField type="checkbox" label="¿Maneja AIU?" name="manejaAiu" value={!!formData.manejaAiu} onChange={handleChange} />
                </CheckWrapper>
                <CheckWrapper checked={!!formData.ivaRetencion}>
                    <InputField type="checkbox" label="¿Retención de IVA?" name="ivaRetencion" value={!!formData.ivaRetencion} onChange={handleChange} />
                </CheckWrapper>
                <CheckWrapper checked={!!formData.usaDobleImpuesto}>
                    <InputField type="checkbox" label="Doble Impuesto" name="usaDobleImpuesto" value={!!formData.usaDobleImpuesto} onChange={handleChange} />
                </CheckWrapper>
                <CheckWrapper checked={!!formData.usaImpuestoAdValorem}>
                    <InputField type="checkbox" label="Impuesto Ad-Valorem" name="usaImpuestoAdValorem" value={!!formData.usaImpuestoAdValorem} onChange={handleChange} />
                </CheckWrapper>
            </div>
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <button
          type="button"
          onClick={prevStep}
          className="flex-1 bg-slate-100 text-slate-500 font-black py-5 rounded-2xl hover:bg-slate-200 uppercase text-xs tracking-widest"
        >
          Volver
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex-1 bg-emerald-600 text-white font-black py-5 rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 uppercase text-sm"
        >
          Finalizar
        </button>
      </div>
    </div>
  );
};

const CheckWrapper = ({ children, checked }: { children: React.ReactNode, checked: boolean }) => (
    <div className={`p-2 rounded-2xl border-2 transition-all ${checked ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-50'}`}>
      {children}
    </div>
);

export default Step2Legal;