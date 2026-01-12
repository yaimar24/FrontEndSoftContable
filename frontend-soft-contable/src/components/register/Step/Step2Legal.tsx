import React, { useState, type ChangeEvent } from "react";
import { FileText, UserCheck, CreditCard } from "lucide-react";
import InputField from "../../common/InputField";
import SelectField from "../../common/SelectField";
import { validators } from "../../../utils/validators";
import { validateForm } from "../../../utils/validateForm";
import type { RegistroFormData, ParametrosSistema } from "../RegisterForm";
import Button from "../../common/Button";

interface Step2Props {
  formData: RegistroFormData;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  nextStep: () => void;
  prevStep: () => void;
  params: ParametrosSistema;
}

interface SelectConfig {
  label: string;
  name: keyof RegistroFormData;
  options: { id: number | string; nombre: string }[];
  full?: boolean;
}

const Step2Legal: React.FC<Step2Props> = ({ formData, handleChange, nextStep, prevStep, params }) => {
  const [errors, setErrors] = useState<Partial<Record<keyof RegistroFormData, string>>>({});

  const schema = {
    nombreRepresentante: [validators.required()],
    numeroIdentificacionRepresentante: [validators.required(), validators.onlyNumbers()],
    tipoIdentificacionId: [validators.requiredSelect()],
    tarifaIca: [validators.required(), validators.onlyNumbers()],
    regimenIvaId: [validators.requiredSelect()],
    tributoId: [validators.requiredSelect()],
    responsabilidadFiscalId: [validators.requiredSelect()],
  };

  // Usamos el operador ?? [] para asegurar que siempre haya un array, incluso si params tiene propiedades undefined
  const SELECTS: SelectConfig[] = [
    { label: "Tipo Identificación", name: "tipoIdentificacionId", options: params?.tiposIdentificacion ?? [] },
    { label: "Régimen IVA", name: "regimenIvaId", options: params?.regimenesIva ?? [] },
    { label: "Tributo", name: "tributoId", options: params?.tributos ?? [] },
    { label: "Responsabilidad Fiscal", name: "responsabilidadFiscalId", options: params?.responsabilidadesFiscales ?? [], full: true },
  ];

  const CHECKBOXES: { label: string; name: keyof RegistroFormData }[] = [
    { label: "¿Maneja AIU?", name: "manejaAiu" },
    { label: "¿Retención IVA?", name: "ivaRetencion" },
    { label: "¿Doble Impuesto?", name: "usaDobleImpuesto" },
    { label: "¿Ad-Valorem?", name: "usaImpuestoAdValorem" },
  ];

  const handleNext = () => {
    const errs = validateForm(formData, schema);
    if (Object.keys(errs).length === 0) {
      setErrors({});
      nextStep();
    } else {
      setErrors(errs as Partial<Record<keyof RegistroFormData, string>>);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center space-x-3">
        <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-700"><FileText size={22} /></div>
        <h2 className="text-xl font-bold italic text-slate-800 border-b-2 border-emerald-500 pr-6">Legalidad</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Nombre Representante" name="nombreRepresentante" value={formData.nombreRepresentante || ""} onChange={handleChange} icon={UserCheck} error={errors.nombreRepresentante} required />
        <InputField label="Identificación" name="numeroIdentificacionRepresentante" value={formData.numeroIdentificacionRepresentante || ""} onChange={handleChange} icon={CreditCard} error={errors.numeroIdentificacionRepresentante} required onlyNumbers maxLength={10} />
        <InputField label="Tarifa ICA (%)" name="tarifaIca" value={formData.tarifaIca || ""} onChange={handleChange} error={errors.tarifaIca} required onlyNumbers />

        {SELECTS.map((s) => (
          <div key={s.name} className={s.full ? "md:col-span-2" : ""}>
            <SelectField
              label={s.label}
              name={s.name}
              options={s.options}
              value={formData[s.name] as string | number}
              onChange={handleChange}
              error={errors[s.name]}
              displayExpr={(item) => item.nombre}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
        {CHECKBOXES.map((cb) => (
          <InputField 
            key={cb.name} 
            type="checkbox" 
            label={cb.label} 
            name={cb.name} 
            value={!!formData[cb.name]} 
            onChange={handleChange} 
          />
        ))}
      </div>

      <div className="flex gap-4 pt-4">
        <Button 
          variant="secondary" 
          onClick={prevStep}
        >
          Anterior
        </Button>
        
        <Button 
          variant="primary" 
          onClick={handleNext}
        >
          Siguiente paso
        </Button>
</div>
    </div>
  );
};

export default Step2Legal;