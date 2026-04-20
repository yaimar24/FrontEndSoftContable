import React, { useState, useEffect } from 'react';
import { Eye, FileText, ArrowRight } from "lucide-react";
import { ExportButtons } from "../../../../components/molecules/ExportButtons";
import SearchBar from "../../../../components/molecules/SearchBar";
import { Table } from "../../../../components/organisms/Table";
import type { FacturaVentaReadDTO } from "../../../../../domain/models/Venta";
import { useFilter } from "../../../../../application/hooks/useGenericFilter";
import { exportToExcel, exportToPDF, type ExportConfig } from "../../../../../utils/exportUtils";

interface Props {
  data: FacturaVentaReadDTO[];
  onPreview?: (v: FacturaVentaReadDTO) => void;
  onDetails?: (id: number) => void;
  isServer?: boolean;
  paginationProps?: any;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

const getEstadoInfo = (estado: string | number) => {
  const map: Record<string, { label: string, color: string }> = {
    '0': { label: 'Borrador', color: 'bg-slate-100 text-slate-600 border-slate-200' },
    '1': { label: 'Pendiente', color: 'bg-amber-50 text-amber-600 border-amber-100' },
    '2': { label: 'Aprobada', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    '3': { label: 'Enviada', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    '4': { label: 'Pagada', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    '5': { label: 'Anulada', color: 'bg-rose-50 text-rose-600 border-rose-100' },
    
    'Borrador': { label: 'Borrador', color: 'bg-slate-100 text-slate-600 border-slate-200' },
    'Pendiente': { label: 'Pendiente', color: 'bg-amber-50 text-amber-600 border-amber-100' },
    'Aprobada': { label: 'Aprobada', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    'Enviada': { label: 'Enviada', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    'Pagada': { label: 'Pagada', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    'Anulada': { label: 'Anulada', color: 'bg-rose-50 text-rose-600 border-rose-100' }
  };
  return map[estado?.toString()] || { label: estado?.toString() || 'Desconocido', color: 'bg-gray-50 text-gray-600 border-gray-100' };
};

const VentasList: React.FC<Props> = ({  data = [], onPreview, onDetails , isServer, paginationProps, searchTerm: externalSearchTerm, onSearchChange }) => {
const [localData, setLocalData] = useState<FacturaVentaReadDTO[]>(Array.isArray(data) ? data : []);

  useEffect(() => {
    if (data && (data as any).items) {
      setLocalData((data as any).items);
    } else if (Array.isArray(data)) {
      setLocalData(data);
    }
  }, [data]);

  const { searchTerm: internalSearchTerm, setSearchTerm: internalSetSearchTerm, filteredData: rawFiltered } = useFilter(localData || [], {
    searchFields: ["numero", "clienteNombre", "tipoFacturaNombre"],
  });
  
  const searchTerm = isServer ? (externalSearchTerm ?? internalSearchTerm) : internalSearchTerm;
  const setSearchTerm = isServer ? (onSearchChange ?? internalSetSearchTerm) : internalSetSearchTerm;

  // Ordenar por fechaRegistro descendente (más recientes primero)
  const filteredData = [...rawFiltered].sort((a, b) => {
    const dateA = a.fechaRegistro ? new Date(a.fechaRegistro).getTime() : 0;
    const dateB = b.fechaRegistro ? new Date(b.fechaRegistro).getTime() : 0;
    return dateB - dateA;
  });

  const exportConfig: ExportConfig<FacturaVentaReadDTO> = {
    filename: `Reporte_Ventas`,
    data: filteredData,
    columns: [
      { header: "NÚMERO", dataKey: "numero" },
      { header: "CLIENTE", dataKey: "clienteNombre" },
      { header: "FECHA ELABORACIÓN", dataKey: (v) => new Date(v.fechaElaboracion).toLocaleDateString() },
      { header: "FECHA REGISTRO", dataKey: (v) => v.fechaRegistro ? new Date(v.fechaRegistro).toLocaleString() : 'N/A' },
      { header: "TIPO", dataKey: "tipoFacturaNombre" },
      { header: "TOTAL", dataKey: (v) => `$${v.totalNeto.toLocaleString()}` },
      { header: "ESTADO", dataKey: "estadoNombre" },
    ],
  };

  const columns = [
    {
      header: "Factura",
      className: "min-w-[280px]",
      render: (v: FacturaVentaReadDTO) => (
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <FileText size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-black uppercase text-[11px] text-slate-800">{v.numero || 'S/N'} - {v.tipoFacturaNombre}</span>
            <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">Elaboración: {new Date(v.fechaElaboracion).toLocaleDateString()}</span>
          </div>
        </div>
      )
    },
    {
      header: "Registro",
      render: (v: FacturaVentaReadDTO) => (
        <span className="text-[10px] font-bold text-slate-500">
          {v.fechaRegistro ? new Date(v.fechaRegistro).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }) : '—'}
        </span>
      )
    },
    {
      header: "Cliente",
      render: (v: FacturaVentaReadDTO) => (
        <span className="font-bold text-[10px] text-slate-700 uppercase">{v.clienteNombre}</span>
      )
    },
    {
      header: "Total Neto",
      render: (v: FacturaVentaReadDTO) => (
        <span className="font-bold text-slate-700">${v.totalNeto?.toLocaleString()}</span>
      )
    },
    {
      header: "Saldo Pendiente",
      render: (v: FacturaVentaReadDTO) => (
        <span className={`font-bold ${v.saldo > 0 ? 'text-rose-500' : 'text-emerald-600'}`}>${v.saldo?.toLocaleString()}</span>
      )
    },
    {
      header: "Vencimiento",
      render: (v: FacturaVentaReadDTO) => {
        if (!v.esCredito || !v.fechaVencimiento) return <span className="text-[10px] text-slate-400 font-bold px-2 py-0.5 bg-slate-50 rounded-md border border-slate-100 uppercase tracking-wider">Contado</span>;
        
        const isOverdue = new Date(v.fechaVencimiento) < new Date() && v.estadoId !== 2; // Assuming 2 is fully paid / Pagada based on earlier checks
        
        return (
          <div className="flex flex-col gap-1 items-start">
             <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${isOverdue ? 'text-rose-600 bg-rose-50 border-rose-200' : 'text-slate-600 bg-slate-100 border-slate-200'}`}>
               {isOverdue && '⚠️ '}{new Date(v.fechaVencimiento).toLocaleDateString()}
             </span>
          </div>
        );
      }
    },
    {
      header: "Estado",
      render: (v: FacturaVentaReadDTO) => {
        const info = getEstadoInfo(v.estadoId);
        return (
          <span className={`px-3 py-1 text-[9px] font-black uppercase border rounded-lg ${info.color}`}>
            {info.label}
          </span>
        )
      }
    },
    {
      header: "Acciones",
      className: "text-right",
      render: (v: FacturaVentaReadDTO) => (
        <div className="flex justify-end gap-2">
          <button onClick={() => onPreview?.(v)} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="Vista Previa PDF">
            <Eye size={15} strokeWidth={2.5} />
          </button>
          <button onClick={() => onDetails?.(v.id)} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-700 hover:text-white transition-all shadow-sm" title="Ver Detalles de Factura">
            <ArrowRight size={15} strokeWidth={2.5} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="tuto-ventas-search w-full lg:w-1/3">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar por número o cliente" />
        </div>

        <div className="tuto-ventas-export w-full sm:w-auto self-end">
          <ExportButtons
            onExportExcel={() => exportToExcel(exportConfig)}
            onExportPDF={() => exportToPDF(exportConfig)}
          />
        </div>
      </div>

      <div className="tuto-ventas-table bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <Table columns={columns} 
          data={filteredData}
          isServer={isServer}
          serverPagination={paginationProps}
        />
      </div>
    </div>
  );
};
export default VentasList;
