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

interface Props {
  formData: any; // Idealmente usar la interfaz Colegio o Institucion
  parametros: any;
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
    <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 space-y-6 shadow-sm h-fit">
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
          const isChecked = !!formData[field.id];
          const Icon = field.icon;

          return (
            <div
              key={field.id}
              className={`flex items-center p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer 
                ${
                  isChecked
                    ? "bg-blue-50/50 border-blue-100 shadow-sm"
                    : "bg-white border-slate-50 hover:border-slate-200"
                }`}
              onClick={() => {
                // Simulamos el evento para el handler global onChange
                const fakeEvent = {
                  target: {
                    name: field.id,
                    type: "checkbox",
                    checked: !isChecked,
                  },
                } as any;
                onChange(fakeEvent);
              }}
            >
              <div className="flex items-center gap-3 w-full pointer-events-none">
                <InputField
                  type="checkbox"
                  label=""
                  name={field.id}
                  value={isChecked}
                  onChange={() => {}}
                />
                <div className="flex flex-col">
                  <span
                    className={`text-[11px] font-black uppercase tracking-tight ${
                      isChecked ? "text-blue-600" : "text-slate-600"
                    }`}
                  >
                    {field.label}
                  </span>
                  <Icon
                    size={12}
                    className={isChecked ? "text-blue-400" : "text-slate-300"}
                  />
                </div>
              </div>
            </div>
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
          displayExpr={(a: any) => `${a.codigo} - ${a.descripcion}`}
          placeholder="Seleccionar código CIIU"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField
            label="Regimen IVA"
            name="regimenIvaId"
            value={formData.regimenIvaId ?? ""}
            onChange={onChange}
            options={parametros?.regimenesIva || []}
            displayExpr={(r: any) => r.nombre}
            placeholder="Seleccionar..."
          />
          <SelectField
            label="Tributo"
            name="tributoId"
            value={formData.tributoId ?? ""}
            onChange={onChange}
            options={parametros?.tributos || []}
            displayExpr={(t: any) => t.nombre}
            placeholder="Seleccionar..."
          />
        </div>
      </div>
    </section>
  );
};
