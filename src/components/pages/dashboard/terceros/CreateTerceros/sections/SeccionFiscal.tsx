import React from "react";
import { Globe, Mail, ShieldCheck, MapPin } from "lucide-react";
import type { TerceroCreateDTO } from "../../../../../../models/Tercero";
import InputField from "../../../../../common/InputField";
import SelectField from "../../../../../common/SelectField";
import CheckboxCard from "../../../../../common/CheckboxCard";
import type { Parametros } from "../../../../../../models/Parametros";
import type { ResponsabilidadFiscal } from "../../../../../../models/Colegio";

interface Props {
  formData: TerceroCreateDTO;
  parametros: Parametros;
  errors: Record<string, string>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onCheckboxChange: (id: number) => void;
  onCategoriaChange?: (id: number) => void;
}

export const SeccionFiscal: React.FC<Props> = ({
  formData,
  parametros,
  errors,
  onChange,
  onCheckboxChange,
  onCategoriaChange,
}) => {
  const selectedIds = formData.responsabilidadesFiscalesIds || [];
  const selectedCategoriaIds = formData.categoriaIds || [];

  return (
    <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full space-y-4">
      <div className="flex flex-col gap-1 pb-3 mb-4 border-b border-slate-50">
        <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
          <Globe size={16} className="text-blue-600" /> Datos Tributarios y Facturación
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          error={errors.codigoPostal}
          placeholder="000000"
          onlyNumbers
          icon={MapPin}
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
        {/* Categorías Section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 ml-1">
            <ShieldCheck size={14} className="text-slate-400" />
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
              Categorías del Tercero <span className="text-blue-500 font-bold">(Selección Múltiple)</span>
            </label>
          </div>
          
          {errors.categoriaIds && (
            <p className="text-[10px] text-red-500 font-bold uppercase ml-1 animate-pulse">
              {errors.categoriaIds}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {parametros?.categorias?.map((cat: any) => {
            const isChecked = selectedCategoriaIds.includes(cat.id);
            const hasGroupError = !!errors.categoriaIds;

            return (
              <CheckboxCard
                key={cat.id}
                label={cat.nombre}
                checked={isChecked}
                onChange={() => onCategoriaChange && onCategoriaChange(cat.id)}
                colorTheme="indigo"
                hasError={hasGroupError}
              />
            );
          })}
        </div>
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
              <CheckboxCard
                key={resp.id}
                label={resp.nombre}
                checked={isChecked}
                onChange={() => onCheckboxChange(resp.id)}
                colorTheme="blue"
                hasError={hasGroupError}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
