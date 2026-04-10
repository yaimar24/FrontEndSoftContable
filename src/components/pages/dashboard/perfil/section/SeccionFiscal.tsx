import React from "react";
import {
  ShieldCheck,
  Percent,
  Calculator,
  Receipt,
  Landmark,
} from "lucide-react";
import InputField from "../../../../common/InputField";
import SelectField from "../../../../common/SelectField";
import CheckboxCard from "../../../../common/CheckboxCard";
import type { ActividadEconomica, Colegio, RegimenIva, Tributo } from "../../../../../models/Colegio";
import type { Parametros } from "../../../../../models/Parametros";

interface Props {
  formData: Partial<Colegio>; 
  parametros: Parametros;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export const SeccionFiscal: React.FC<Props> = ({
  formData,
  parametros,
  onChange,
}) => {
  // Definición de los campos booleanos para mapear las cards
  const fiscalToggles = [
    { id: "manejaAiu", label: "Maneja AIU", icon: Calculator },
    { id: "ivaRetencion", label: "IVA Retención", icon: Receipt },
    { id: "usaDobleImpuesto", label: "Doble Impuesto", icon: Landmark },
    { id: "usaImpuestoAdValorem", label: "Imp. Ad Valorem", icon: ShieldCheck },
  ];

  return (
    <section className="bg-white p-5 rounded-2xl border border-slate-100 space-y-4 shadow-sm h-fit">
      {/* Encabezado de Sección */}
      <div className="flex flex-col gap-1 mb-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <ShieldCheck size={14} className="text-amber-500" /> Configuración
          Fiscal y Tributaria
        </h3>
      </div>

      {/* Grid de Cards Interactivas (Toggles) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fiscalToggles.map((field) => {
          const isChecked = !!formData[field.id as keyof Colegio];

          return (
            <CheckboxCard
              key={field.id}
              label={field.label}
              checked={isChecked}
              onChange={() => {
                const fakeEvent = {
                  target: {
                    name: field.id,
                    type: "checkbox",
                    checked: !isChecked,
                  },
                } as any;
                onChange(fakeEvent);
              }}
              icon={field.icon}
              colorTheme="blue"
            />
          );
        })}
      </div>

      {/* Campos de Selección y Numéricos */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <InputField
          label="Tarifa ICA (%)"
          name="tarifaIca"
          value={formData.tarifaIca || ""}
          onChange={onChange}
          icon={Percent}
          onlyNumbers
          allowDecimals
        />

        <SelectField
          label="Actividad Económica"
          name="actividadEconomicaId"
          value={formData.actividadEconomicaId ?? ""}
          onChange={onChange}
          options={parametros?.actividadesEconomicas || []}
          displayExpr={(a: ActividadEconomica) => `${a.codigo} - ${a.descripcion}`}
          placeholder="Seleccionar código CIIU"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField
            label="Regimen IVA"
            name="regimenIvaId"
            value={formData.regimenIvaId ?? ""}
            onChange={onChange}
            options={parametros?.regimenesIva || []}
            displayExpr={(r: RegimenIva) => r.nombre}
            placeholder="Seleccionar..."
          />
          <SelectField
            label="Tributo"
            name="tributoId"
            value={formData.tributoId ?? ""}
            onChange={onChange}
            options={parametros?.tributos || []}
            displayExpr={(t: Tributo) => t.nombre}
            placeholder="Seleccionar..."
          />
        </div>
      </div>
    </section>
  );
};
