import React, { useState, useEffect } from "react";
import { Search, Edit3, Building2, User, UserMinus, Link } from "lucide-react";
import { Table } from "../../../../common/Table";
import { FilterGroup } from "../../../../common/FilterGroup";
import { ExportButtons } from "../../../../common/ExportButtons";
import StatusModal from "../../../../common/StatusModal";
import { desvincularTercero } from "../../../../../services/terceros/terceroService";
import type { TerceroupdateDTO } from "../../../../../models/Tercero";
import { useFilter } from "../../../../../hooks/useGenericFilter";
import {
  exportToExcel,
  exportToPDF,
  type ExportConfig,
} from "../../../../../utils/exportUtils";

interface TercerosListProps {
  data: TerceroupdateDTO[];
  onEdit: (tercero: TerceroupdateDTO) => void;
}

const TercerosList: React.FC<TercerosListProps> = ({ data, onEdit }) => {
  const [localData, setLocalData] = useState(data);
  useEffect(() => setLocalData(data), [data]);

  const {
    searchTerm,
    setSearchTerm,
    activeFilters,
    updateFilter,
    filteredData,
  } = useFilter(localData, {
    searchFields: ["nombres", "apellidos", "nombreComercial", "identificacion"],
    customFilters: {
      categoria: (item, value) => item.categoriaId === value,
    },
  });

  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    terceroId?: string;
    isActivo?: boolean;
  }>({ show: false });
  const [resultModal, setResultModal] = useState<{
    show: boolean;
    success?: boolean;
    message?: string;
  }>({ show: false });

  // CONFIGURACIÓN DE EXPORTACIÓN CON TIPADO EXPLÍCITO
  const exportConfig: ExportConfig<TerceroupdateDTO> = {
    filename: `Reporte_Terceros`,
    data: filteredData,
    columns: [
      { header: "NIT/CÉDULA", dataKey: "identificacion" },
      { header: "DV", dataKey: "dv" },
      {
        header: "RAZÓN SOCIAL",
        dataKey: (t) =>
          (t.tipoPersonaId === 1
            ? `${t.nombres} ${t.apellidos}`
            : t.nombreComercial) || "SIN NOMBRE",
      },
      { header: "EMAIL", dataKey: "email" },
      { header: "TELÉFONO", dataKey: "telefono" },
      {
        header: "CATEGORÍA",
        dataKey: (t) => (t.categoriaId === 1 ? "CLIENTE" : "PROVEEDOR"),
      },
      {
        header: "ESTADO",
        dataKey: (t) => (t.activo ? "ACTIVO" : "DESVINCULADO"),
      },
    ],
  };

  const confirmAction = async () => {
    if (!confirmModal.terceroId) return;
    try {
      const response = await desvincularTercero(confirmModal.terceroId);
      setResultModal({
        show: true,
        success: response.success,
        message: response.message,
      });
      if (response.success) {
        setLocalData((prev) =>
          prev.map((t) =>
            t.id === confirmModal.terceroId
              ? { ...t, activo: !confirmModal.isActivo }
              : t
          )
        );
      }
    } catch (err: any) {
      setResultModal({
        show: true,
        success: false,
        message: err.message || "Error",
      });
    } finally {
      setConfirmModal({ show: false });
    }
  };

  const columns = [
    {
      header: "Tercero / Razón Social",
      className:
        "min-w-[300px] sticky left-0 bg-white group-hover:bg-slate-50 z-20",
      render: (t: TerceroupdateDTO) => {
        const esNatural = t.tipoPersonaId === 1;
        return (
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                esNatural
                  ? "bg-blue-50 text-blue-600"
                  : "bg-purple-50 text-purple-600"
              }`}
            >
              {esNatural ? <User size={16} /> : <Building2 size={16} />}
            </div>
            <div className="flex flex-col">
              <span
                className={`font-black uppercase text-[11px] ${
                  t.activo ? "text-slate-800" : "text-slate-400 italic"
                }`}
              >
                {(esNatural
                  ? `${t.nombres} ${t.apellidos}`
                  : t.nombreComercial) || "SIN NOMBRE"}
              </span>
              <div className="flex gap-1.5 mt-1">
                <span
                  className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase ${
                    t.categoriaId === 1
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {t.categoriaId === 1 ? "Cliente" : "Proveedor"}
                </span>
                <span
                  className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase ${
                    t.activo
                      ? "bg-blue-100 text-blue-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {t.activo ? "Activo" : "Desvinculado"}
                </span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Identificación",
      className: "min-w-[140px]",
      render: (t: TerceroupdateDTO) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-700">{t.identificacion}</span>
          <span className="text-[10px] text-slate-400 font-black">
            DV: {t.dv}
          </span>
        </div>
      ),
    },
    {
      header: "Acciones",
      className:
        "text-right sticky right-0 bg-white group-hover:bg-slate-50 z-20",
      render: (t: TerceroupdateDTO) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onEdit(t)}
            className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() =>
              setConfirmModal({
                show: true,
                terceroId: t.id,
                isActivo: t.activo,
              })
            }
            className={`p-2 rounded-xl transition-all ${
              t.activo
                ? "bg-rose-50 text-rose-600 hover:bg-rose-600"
                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-600"
            } hover:text-white`}
          >
            {t.activo ? <UserMinus size={16} /> : <Link size={16} />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <FilterGroup
          activeId={activeFilters.categoria || "all"}
          onChange={(id) => updateFilter("categoria", id)}
          options={[
            { id: "all", label: "Todos" },
            { id: 1, label: "Clientes" },
            { id: 2, label: "Proveedores" },
          ]}
        />
        <ExportButtons
          onExportExcel={() => exportToExcel(exportConfig)}
          onExportPDF={() => exportToPDF(exportConfig)}
        />
      </div>
      <div className="relative group w-full">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
          size={20}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="BUSCAR..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-500/5 transition-all text-[11px] font-bold uppercase"
        />
      </div>
      <Table columns={columns} data={filteredData} />
      <StatusModal
        show={confirmModal.show}
        type="confirm"
        message={confirmModal.isActivo ? "¿Desvincular?" : "¿Vincular?"}
        onClose={() => setConfirmModal({ show: false })}
        onConfirm={confirmAction}
      />
      <StatusModal
        show={resultModal.show}
        success={resultModal.success}
        // Solución al error: Garantizamos que siempre sea string
        message={resultModal.message || ""}
        onClose={() => setResultModal((prev) => ({ ...prev, show: false }))}
      />{" "}
    </div>
  );
};

export default TercerosList;
