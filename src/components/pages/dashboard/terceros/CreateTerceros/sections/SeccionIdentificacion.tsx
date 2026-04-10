import React from 'react';
import { ShieldCheck, Hash } from 'lucide-react';
import type { TerceroCreateDTO } from '../../../../../../models/Tercero';
import SelectField from '../../../../../common/SelectField';
import InputField from '../../../../../common/InputField';
import type { Parametros } from '../../../../../../models/Parametros';

interface Props {
  formData: TerceroCreateDTO;
  parametros: Parametros;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const SeccionIdentificacion: React.FC<Props> = ({ formData, parametros, errors, onChange }) => (
  <section className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4 shadow-sm h-full">
    <div className="flex flex-col gap-1 pb-2 border-b border-slate-50">
      <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
        <ShieldCheck size={16} className="text-blue-600"/> Identificación Legal
      </h3>
    </div>

    <div className="space-y-3">
      <SelectField 
        label="Tipo Persona" 
        name="tipoPersonaId" 
        value={formData.tipoPersonaId ?? ""} 
        onChange={onChange} 
        error={errors.tipoPersonaId}
        options={parametros?.tiposPersona || []} 
        displayExpr={t => t.nombre} 
        placeholder="Seleccione Tipo Persona"
      />

      <SelectField 
        label="Tipo Documento" 
        name="tipoIdentificacionId" 
        value={formData.tipoIdentificacionId ?? ""} 
        onChange={onChange} 
        error={errors.tipoIdentificacionId}
        options={parametros?.tiposIdentificacion || []} 
        displayExpr={t => t.nombre} 
        placeholder="Seleccione Documento"
      />

      <div className="flex gap-3">
        <div className="flex-1">
          <InputField 
            label="Número" 
            name="identificacion" 
            value={formData.identificacion || ""} 
            onChange={onChange} 
            error={errors.identificacion} 
            onlyNumbers 
            icon={Hash} 
            required
          />
        </div>

        <div className="w-20 pl-2 border-l border-slate-100">
          <InputField 
            label="DV" 
            name="dv" 
            value={formData.dv || ""} 
            onChange={() => {}}  
            placeholder="-"
          />
        </div>
      </div>
    </div>
  </section>
);
