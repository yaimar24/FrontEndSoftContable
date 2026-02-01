import React, { useState, useEffect } from "react";
import { Edit3, Building2, User, UserMinus, Link as LinkIcon } from "lucide-react";
import { Table } from "../../../../common/Table";
import { FilterGroup } from "../../../../common/FilterGroup";
import { ExportButtons } from "../../../../common/ExportButtons";
import StatusModal from "../../../../common/StatusModal";
import SearchBar from "../../../../common/SearchBar"; 
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

  const exportConfig: ExportConfig<TerceroupdateDTO> = {
    filename: `Reporte_Terceros`,
    data: filteredData,
    columns: [
      { header: "NIT/CÉDULA", dataKey: "identificacion" },
      { header: "DV", dataKey: "dv" },
      {
        header: "RAZÓN SOCIAL",
        dataKey: (t) => (t.tipoPersonaId === 1 ? `${t.nombres} ${t.apellidos}` : t.nombreComercial) || "SIN NOMBRE",
      },
      { header: "EMAIL", dataKey: "email" },
      { header: "TELÉFONO", dataKey: "telefono" },
      { header: "CATEGORÍA", dataKey: (t) => (t.categoriaId === 1 ? "CLIENTE" : "PROVEEDOR") },
      { header: "ESTADO", dataKey: (t) => (t.activo ? "ACTIVO" : "DESVINCULADO") },
    ],
  };

  const confirmAction = async () => {
    if (!confirmModal.terceroId) return;
    try {
      const response = await desvincularTercero(confirmModal.terceroId);
      setResultModal({ show: true, success: response.success, message: response.message });
      if (response.success) {
        setLocalData((prev) =>
          prev.map((t) => t.id === confirmModal.terceroId ? { ...t, activo: !confirmModal.isActivo } : t)
        );
      }
    } catch (err: any) {
      setResultModal({ show: true, success: false, message: err.message || "Error" });
    } finally {
      setConfirmModal({ show: false });
    }
  };

  const columns = [
    {
      header: "Terceros",
      className: "min-w-[300px] sticky left-0 bg-white group-hover:bg-slate-50 z-20 transition-colors",
      render: (t: TerceroupdateDTO) => {
        const esNatural = t.tipoPersonaId === 1;
        return (
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${esNatural ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"}`}>
              {esNatural ? <User size={18} /> : <Building2 size={18} />}
            </div>
            <div className="flex flex-col">
              <span className={`font-black uppercase text-[11px] tracking-tight ${t.activo ? "text-slate-800" : "text-slate-400 italic"}`}>
                {(esNatural ? `${t.nombres} ${t.apellidos}` : t.nombreComercial) || "SIN NOMBRE"}
              </span>
              <div className="flex gap-1.5 mt-1">
                <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase ${t.categoriaId === 1 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                  {t.categoriaId === 1 ? "Cliente" : "Proveedor"}
                </span>
                <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase ${t.activo ? "bg-blue-100 text-blue-700" : "bg-rose-100 text-rose-700"}`}>
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
          <span className="font-bold text-slate-700 text-xs">{t.identificacion}</span>
          <span className="text-[10px] text-slate-400 font-black uppercase">DV: {t.dv}</span>
        </div>
      ),
    },
    {
      header: "Acciones",
      className: "text-right sticky right-0 bg-white group-hover:bg-slate-50 z-20 transition-colors",
      render: (t: TerceroupdateDTO) => (
        <div className="flex justify-end gap-2">
          {/* Botón Editar Reutilizable */}
          <button
            onClick={() => onEdit(t)}
            className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
          >
            <Edit3 size={15} strokeWidth={2.5} />
          </button>
          
          {/* Botón Vincular/Desvincular */}
          <button
            onClick={() => setConfirmModal({ show: true, terceroId: t.id, isActivo: t.activo })}
            className={`p-2.5 rounded-xl transition-all shadow-sm active:scale-95 ${
              t.activo
                ? "bg-slate-50 text-slate-400 hover:bg-rose-600 hover:text-white"
                : "bg-slate-50 text-slate-400 hover:bg-emerald-600 hover:text-white"
            }`}
          >
            {t.activo ? <UserMinus size={15} strokeWidth={2.5} /> : <LinkIcon size={15} strokeWidth={2.5} />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Filtros y Exportación */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
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

      {/* Buscador Reutilizable */}
      <SearchBar 
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Buscar por identificación, nombre o razón social..."
      />

      {/* Tabla con Estilo Blanco y Sombra */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <Table columns={columns} data={filteredData} />
      </div>

      {/* Modales de Estado */}
      <StatusModal
        show={confirmModal.show}
        type="confirm"
        message={confirmModal.isActivo ? "¿Seguro que desea desvincular este tercero?" : "¿Desea vincular este tercero?"}
        onClose={() => setConfirmModal({ show: false })}
        onConfirm={confirmAction}
      />
      
      <StatusModal
        show={resultModal.show}
        success={resultModal.success}
        message={resultModal.message || ""}
        onClose={() => setResultModal((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default TercerosList;