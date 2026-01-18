import React from 'react';
import { ShieldCheck, Hash } from 'lucide-react';
import type { TerceroCreateDTO } from '../../../../../../models/Tercero';
import SelectField from '../../../../../common/SelectField';
import InputField from '../../../../../common/InputField';
import type { ParametrosSistema } from '../../../../../../models/parametros';

interface Props {
  formData: TerceroCreateDTO;
  parametros: ParametrosSistema;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const SeccionIdentificacion: React.FC<Props> = ({ formData, parametros, errors, onChange }) => (
  <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 space-y-6 shadow-sm">
    <div className="flex flex-col gap-1">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
        <ShieldCheck size={14} className="text-blue-600"/> Identificación Legal
      </h3>
    </div>

    <div className="space-y-4">
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
            label="Número de Identificación" 
            name="identificacion" 
            value={formData.identificacion || ""} 
            onChange={onChange} 
            error={errors.identificacion} 
            onlyNumbers 
            icon={Hash} 
            required
          />
        </div>

        <div className="w-24">
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