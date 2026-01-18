import React from "react";
import { Globe, Mail, ShieldCheck, MapPin } from "lucide-react";
import type { TerceroCreateDTO } from "../../../../../../models/Tercero";
import InputField from "../../../../../common/InputField";
import SelectField from "../../../../../common/SelectField";
import type { ParametrosSistema } from "../../../../../../models/parametros";
import type { ResponsabilidadFiscal } from "../../../../../../models/Colegio";

interface Props {
  formData: TerceroCreateDTO;
  parametros: ParametrosSistema;
  errors: Record<string, string>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onCheckboxChange: (id: number) => void;
}

export const SeccionFiscal: React.FC<Props> = ({
  formData,
  parametros,
  errors,
  onChange,
  onCheckboxChange,
}) => {
  const selectedIds = formData.responsabilidadesFiscalesIds || [];

  return (
    <section className="lg:col-span-3 bg-white p-8 rounded-[2.5rem] border border-slate-100 space-y-8 shadow-sm">
      <div className="flex flex-col gap-1">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <Globe size={14} className="text-blue-600" /> Datos Tributarios y Facturación
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <InputField
          label="Correo Facturación"
          name="correoFacturacion"
          value={formData.correoFacturacion || ""}
          onChange={onChange}
          error={errors.correoFacturacion}
          icon={Mail}
          required
        />

        <InputField
          label="Cód. Postal"
          name="codigoPostal"
          value={formData.codigoPostal || ""}
          onChange={onChange}
          error={errors.codigoPostal}
          placeholder="000000"
          onlyNumbers
          icon={MapPin}
          required
        />

        <SelectField
          label="Categoría"
          name="categoriaId"
          value={formData.categoriaId ?? ""}
          onChange={onChange}
          error={errors.categoriaId}
          options={parametros?.categorias || []}
          displayExpr={(c) => c.nombre}
          placeholder="Seleccione Categoría"
        />

        <SelectField
          label="Régimen IVA"
          name="regimenIvaId"
          value={formData.regimenIvaId ?? ""}
          onChange={onChange}
          error={errors.regimenIvaId}
          options={parametros?.regimenesIva || []}
          displayExpr={(r) => r.nombre}
          placeholder="Seleccione Régimen"
        />
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 ml-1">
            <ShieldCheck size={14} className="text-slate-400" />
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
              Responsabilidades Fiscales <span className="text-blue-500 font-bold">(Selección Múltiple)</span>
            </label>
          </div>
          
          {errors.responsabilidadesFiscalesIds && (
            <p className="text-[10px] text-red-500 font-bold uppercase ml-1 animate-pulse">
              {errors.responsabilidadesFiscalesIds}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {parametros?.responsabilidadesFiscales?.map((resp: ResponsabilidadFiscal) => {
            const isChecked = selectedIds.includes(resp.id);
            const hasGroupError = !!errors.responsabilidadesFiscalesIds;

            return (
              <div
                key={resp.id}
                onClick={() => onCheckboxChange(resp.id)}
                className={`flex items-center p-4 rounded-2xl border transition-all duration-200 cursor-pointer 
                ${isChecked 
                    ? "bg-blue-50/30 border-blue-200 shadow-sm" 
                    : hasGroupError 
                      ? "bg-red-50/10 border-red-200" 
                      : "bg-white border-slate-100 hover:border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3 w-full pointer-events-none">
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                    isChecked ? "bg-blue-600 border-blue-600" : "bg-white border-slate-300"
                  }`}>
                    {isChecked && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <span
                    className={`text-[11px] font-bold uppercase tracking-tight transition-colors ${
                      isChecked ? "text-blue-700" : "text-slate-600"
                    }`}
                  >
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