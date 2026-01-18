import React from 'react';
import { Globe, Mail, ShieldCheck } from 'lucide-react';
import type { TerceroCreateDTO } from '../../../../../../models/Tercero';
import InputField from '../../../../../common/InputField';
import SelectField from '../../../../../common/SelectField';
import type { ParametrosSistema } from '../../../../../../models/parametros';
import type { ResponsabilidadFiscal } from '../../../../../../models/Colegio';

interface Props {
  formData: TerceroCreateDTO;
  parametros: ParametrosSistema;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onCheckboxChange: (id: number) => void;
}

export const SeccionFiscal: React.FC<Props> = ({ 
  formData, 
  parametros, 
  errors, 
  onChange, 
  onCheckboxChange 
}) => {
  // Garantizamos que sea un array para evitar errores de TS
  const selectedIds = formData.responsabilidadesFiscalesIds || [];

  return (
    <section className="lg:col-span-3 bg-slate-50 p-8 rounded-[2.5rem] border border-dashed border-slate-300 space-y-8">
      {/* Título de la Sección */}
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
          <Globe size={22} className="text-blue-600"/> Datos Tributarios y Facturación
        </h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-8">
          Configuración obligatoria para emisión de documentos
        </p>
      </div>

      {/* Campos de Entrada Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <InputField 
          label="Correo Facturación" 
          name="correoFacturacion" 
          value={formData.correoFacturacion || ""} 
          onChange={onChange} 
          error={errors.correoFacturacion} 
          icon={Mail} 
        />
        <InputField 
          label="Cód. Postal" 
          name="codigoPostal" 
          value={formData.codigoPostal || ""} 
          onChange={onChange} 
          placeholder="000000" 
          onlyNumbers
        />
        <SelectField 
          label="Categoría" 
          name="categoriaId" 
          value={formData.categoriaId ?? ""} 
          onChange={onChange} 
          error={errors.categoriaId} 
          options={parametros?.categorias || []} 
          displayExpr={c => c.nombre} 
        />
        <SelectField 
          label="Régimen IVA" 
          name="regimenIvaId" 
          value={formData.regimenIvaId ?? ""} 
          onChange={onChange} 
          error={errors.regimenIvaId} 
          options={parametros?.regimenesIva || []} 
          displayExpr={r => r.nombre} 
        />
      </div>

      {/* Grid de Responsabilidades Fiscales usando tu InputField */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 ml-1">
          <ShieldCheck size={16} className="text-slate-400" />
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
            Responsabilidades Fiscales <span className="text-blue-500">(Selección Múltiple)</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {parametros?.responsabilidadesFiscales?.map((resp: ResponsabilidadFiscal) => {
            const isChecked = selectedIds.includes(resp.id);
            
            return (
              <div 
                key={resp.id}
                // Contenedor visual que envuelve el InputField tipo checkbox
                className={`flex items-center p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer 
                  ${isChecked 
                    ? "bg-blue-50/50 border-blue-200 shadow-sm" 
                    : "bg-white border-slate-100 hover:border-slate-200"
                  }`}
                onClick={() => onCheckboxChange(resp.id)}
              >
                <div className="flex items-center gap-3 w-full pointer-events-none">
                  <InputField
                    type="checkbox"
                    label="" // Dejamos el label vacío porque usamos el span personalizado
                    name={`resp_${resp.id}`}
                    value={isChecked}
                    onChange={() => {}} // El onClick del padre maneja el cambio
                  />
                  <span className={`text-xs font-black uppercase tracking-tight transition-colors ${
                    isChecked ? "text-blue-700" : "text-slate-600"
                  }`}>
                    {resp.nombre}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};