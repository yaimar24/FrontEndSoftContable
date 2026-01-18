import React, { useState, type ChangeEvent } from "react";
import { FileText, UserCheck, CreditCard } from "lucide-react";
import InputField from "../../../common/InputField";
import SelectField from "../../../common/SelectField";
import { validators } from "../../../../utils/validators";
import { validateForm } from "../../../../utils/validateForm";
import type { RegistroFormData } from "../RegisterForm";
import Button from "../../../common/Button";
import type { ParametrosSistema } from "../../../../models/parametros";

interface Step2Props {
  formData: RegistroFormData;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  nextStep: () => void;
  prevStep: () => void;
  params: ParametrosSistema;
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

  // Lista unificada de toggles (Sin iconos internos para máxima limpieza)
  const FISCAL_TOGGLES = [
    { label: "Maneja AIU", name: "manejaAiu" as const },
    { label: "Retención IVA", name: "ivaRetencion" as const },
    { label: "Doble Impuesto", name: "usaDobleImpuesto" as const },
    { label: "Impuesto Ad-Valorem", name: "usaImpuestoAdValorem" as const },
  ];

  const handleNext = () => {
    const errs = validateForm(formData, schema);
    if (Object.keys(errs).length === 0) {
      setErrors({});
      nextStep();
    } else {
      setErrors(errs as Partial<Record<keyof RegistroFormData, string>>);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
      
      {/* HEADER UNIFICADO (AZUL) */}
      <div className="flex items-center space-x-3">
        <div className="bg-blue-100 p-2.5 rounded-xl text-blue-700">
          <FileText size={22} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Información Legal</h2>
          <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Paso 2 de 3 • Configuración Fiscal</p>
        </div>
      </div>

      {/* SECCIÓN FORMULARIO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField 
          label="Nombre Representante" 
          name="nombreRepresentante" 
          value={formData.nombreRepresentante || ""} 
          onChange={handleChange} 
          icon={UserCheck} 
          error={errors.nombreRepresentante} 
          required 
        />
        
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-1">
            <SelectField 
              label="Tipo" 
              name="tipoIdentificacionId" 
              options={params?.tiposIdentificacion ?? []} 
              value={formData.tipoIdentificacionId ?? ""} 
              onChange={handleChange} 
              error={errors.tipoIdentificacionId} 
              displayExpr={(item) => item.nombre} 
            />
          </div>
          <div className="col-span-2">
            <InputField 
              label="Identificación" 
              name="numeroIdentificacionRepresentante" 
              value={formData.numeroIdentificacionRepresentante || ""} 
              onChange={handleChange} 
              icon={CreditCard} 
              error={errors.numeroIdentificacionRepresentante} 
              required 
              onlyNumbers 
              maxLength={10} 
            />
          </div>
        </div>

        <InputField 
          label="Tarifa ICA (%)" 
          name="tarifaIca" 
          value={formData.tarifaIca || ""} 
          onChange={handleChange} 
          error={errors.tarifaIca} 
          required 
          onlyNumbers 
          allowDecimals 
        />
        
        <SelectField 
          label="Régimen IVA" 
          name="regimenIvaId" 
          options={params?.regimenesIva ?? []} 
          value={formData.regimenIvaId ?? ""} 
          onChange={handleChange} 
          error={errors.regimenIvaId} 
          displayExpr={(item) => item.nombre} 
        />
        
        <SelectField 
          label="Tributo" 
          name="tributoId" 
          options={params?.tributos ?? []} 
          value={formData.tributoId ?? ""} 
          onChange={handleChange} 
          error={errors.tributoId} 
          displayExpr={(item) => item.nombre} 
        />
        
        <div className="md:col-span-2">
          <SelectField 
            label="Responsabilidad Fiscal" 
            name="responsabilidadFiscalId" 
            options={params?.responsabilidadesFiscales ?? []} 
            value={formData.responsabilidadFiscalId ?? ""} 
            onChange={handleChange} 
            error={errors.responsabilidadFiscalId} 
            displayExpr={(item) => item.nombre} 
          />
        </div>
      </div>

      {/* GRID DE CARDS INTERACTIVAS (IDÉNTICO A TERCEROS) */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
          Configuración Tributaria
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {FISCAL_TOGGLES.map((cb) => {
            const isChecked = !!formData[cb.name];
            
            return (
              <div 
                key={cb.name}
                onClick={() => {
                   const event = {
                     target: { name: cb.name, type: 'checkbox', checked: !isChecked }
                   } as any;
                   handleChange(event);
                }}
                className={`flex items-center p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer 
                  ${isChecked 
                    ? "bg-blue-50/50 border-blue-200 shadow-sm" 
                    : "bg-white border-slate-100 hover:border-slate-200"
                  }`}
              >
                <div className="flex items-center gap-3 w-full pointer-events-none">
                  <InputField 
                    type="checkbox" 
                    label="" 
                    name={cb.name} 
                    value={isChecked} 
                    onChange={() => {}} 
                  />
                  <span className={`text-[10px] font-black uppercase tracking-tight transition-colors ${
                    isChecked ? "text-blue-700" : "text-slate-600"
                  }`}>
                    {cb.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* NAVEGACIÓN */}
      <div className="flex gap-4 pt-6 border-t border-slate-100">
        <Button variant="secondary" onClick={prevStep} className="flex-1">
          Anterior
        </Button>
        <Button variant="primary" onClick={handleNext} className="flex-[2]">
          Siguiente
        </Button>
      </div>
    </div>
  );
};

export default Step2Legal;