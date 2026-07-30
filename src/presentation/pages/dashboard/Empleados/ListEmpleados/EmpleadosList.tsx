import React, { useState } from "react";
import { Edit3, User, UserMinus } from "lucide-react";
import { Table } from "@/presentation/components/organisms/Table";
import SearchBar from "@/presentation/components/molecules/SearchBar";
import { ExportButtons } from "@/presentation/components/molecules/ExportButtons";
import StatusModal from "@/presentation/components/organisms/StatusModal";
import { useFilter } from "@/application/hooks/useGenericFilter";
import type { EmpleadoUpdateDTO } from "@/domain/models/Empleado";
import { cambiarEstadoEmpleado } from "@/data/services/empleado/empleadoService";
import {
  exportToExcel,
  exportToPDF,
  type ExportConfig,
} from "@/utils/exportUtils";

interface EmpleadosListProps {
  data: EmpleadoUpdateDTO[];
  onEdit: (empleado: EmpleadoUpdateDTO) => void;
  isServer?: boolean;
  paginationProps?: any;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  loading?: boolean;
}



const EmpleadosList: React.FC<EmpleadosListProps> = ({ data, onEdit, isServer, paginationProps, searchTerm: externalSearchTerm, onSearchChange, loading }) => {
  let tableData = data;
  let searchTerm = externalSearchTerm ?? "";
  let setSearchTerm = onSearchChange ?? (() => {});

  if (!isServer) {
    const filter = useFilter(data, {
      searchFields: ["nombres", "apellidos", "numeroDocumento", "correoElectronico"],
    });
    searchTerm = filter.searchTerm;
    setSearchTerm = filter.setSearchTerm;
    tableData = filter.filteredData;
  }

  const [confirmModal, setConfirmModal] = useState<{ show: boolean; empleadoId?: string; isActivo?: boolean }>({ show: false });
  const [resultModal, setResultModal] = useState<{ show: boolean; success?: boolean; message?: string }>({ show: false });

  const exportConfig: ExportConfig<EmpleadoUpdateDTO> = {
    filename: `Reporte_Empleados`,
    data: tableData,
    columns: [
      { header: "Nombres", dataKey: "nombres" },
      { header: "Apellidos", dataKey: "apellidos" },
      { header: "Documento", dataKey: "numeroDocumento" },
      { header: "Correo", dataKey: "correoElectronico" },
      { header: "Estado", dataKey: (e) => (e.activo ? "ACTIVO" : "INACTIVO") },
    ],
  };

  const confirmAction = async () => {
    if (!confirmModal.empleadoId) return;
    try {
      const response = await cambiarEstadoEmpleado(confirmModal.empleadoId);
      setResultModal({ show: true, success: response.success, message: response.message });
      // Si necesitas refrescar la lista, llama a un callback del padre o muestra un mensaje
    } catch (err: any) {
      setResultModal({ show: true, success: false, message: err.message || "Error" });
    } finally {
      setConfirmModal({ show: false });
    }
  };

  const columns = [
    {
      header: "Empleado",
      className: "min-w-[220px] sticky left-0 bg-white group-hover:bg-slate-50 z-20 transition-colors",
      render: (e: EmpleadoUpdateDTO) => (
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <User size={18} />
          </div>
          <div className="flex flex-col">
            <span className={`font-black uppercase text-[11px] tracking-tight ${e.activo ? "text-slate-800" : "text-slate-400 italic"}`}>
              {e.nombres} {e.apellidos}
            </span>
            <span className="text-[10px] text-slate-400 font-black uppercase">{e.numeroDocumento}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Correo",
      className: "min-w-[180px]",
      render: (e: EmpleadoUpdateDTO) => (
        <span className="font-bold text-slate-700 text-xs">{e.correoElectronico}</span>
      ),
    },
    {
      header: "Acciones",
      className: "text-right sticky right-0 bg-white group-hover:bg-slate-50 z-20 transition-colors",
      render: (e: EmpleadoUpdateDTO) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onEdit(e)}
            className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
          >
            <Edit3 size={15} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => setConfirmModal({ show: true, empleadoId: e.id, isActivo: e.activo })}
            className={`p-2.5 rounded-xl transition-all shadow-sm active:scale-95 ${
              e.activo
                ? "bg-slate-50 text-slate-400 hover:bg-rose-600 hover:text-white"
                : "bg-slate-50 text-slate-400 hover:bg-emerald-600 hover:text-white"
            }`}
          >
            {e.activo ? <UserMinus size={15} strokeWidth={2.5} /> : <User size={15} strokeWidth={2.5} />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="w-full lg:w-1/3">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por nombre, documento o correo..."
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <ExportButtons
            onExportExcel={() => exportToExcel(exportConfig)}
            onExportPDF={() => exportToPDF(exportConfig)}
          />
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <Table columns={columns} data={tableData} isServer={isServer} serverPagination={paginationProps} />
        {loading && <div className="p-8 text-center text-slate-400">Cargando empleados...</div>}
      </div>
      <StatusModal
        show={confirmModal.show}
        type="confirm"
        message={confirmModal.isActivo ? "¿Seguro que desea desactivar este empleado?" : "¿Desea activar este empleado?"}
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

export default EmpleadosList;
