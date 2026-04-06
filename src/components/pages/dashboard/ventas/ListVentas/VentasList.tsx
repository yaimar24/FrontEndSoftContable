import { Eye, FileText } from "lucide-react";
import { ExportButtons } from "../../../../common/ExportButtons";
import SearchBar from "../../../../common/SearchBar";
import { Table } from "../../../../common/Table";
import type { FacturaVentaReadDTO } from "../../../../../models/Venta";
import { useFilter } from "../../../../../hooks/useGenericFilter";
import { exportToExcel, exportToPDF, type ExportConfig } from "../../../../../utils/exportUtils";

interface Props {
  data: FacturaVentaReadDTO[];
  onEdit?: (id: number) => void;
}

const getEstadoInfo = (estado: string | number) => {
  const map: Record<string, { label: string, color: string }> = {
    '1': { label: 'Borrador', color: 'bg-slate-100 text-slate-600 border-slate-200' },
    '2': { label: 'Aprobada', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    '3': { label: 'Enviada', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    '4': { label: 'Pagada', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    '5': { label: 'Anulada', color: 'bg-rose-50 text-rose-600 border-rose-100' },
    '6': { label: 'Pendiente Abono', color: 'bg-amber-50 text-amber-600 border-amber-100' },
    
    'Borrador': { label: 'Borrador', color: 'bg-slate-100 text-slate-600 border-slate-200' },
    'Aprobada': { label: 'Aprobada', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    'Enviada': { label: 'Enviada', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    'Pagada': { label: 'Pagada', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    'Anulada': { label: 'Anulada', color: 'bg-rose-50 text-rose-600 border-rose-100' },
    'PendienteConAbono': { label: 'Pendiente Abono', color: 'bg-amber-50 text-amber-600 border-amber-100' }
  };
  return map[estado?.toString()] || { label: estado?.toString() || 'Desconocido', color: 'bg-gray-50 text-gray-600 border-gray-100' };
};

const VentasList: React.FC<Props> = ({ data = [], onEdit }) => {
  const { searchTerm, setSearchTerm, filteredData } = useFilter(data || [], {   
    searchFields: ["numero", "clienteNombre", "tipoFacturaNombre"],
  });

  const exportConfig: ExportConfig<FacturaVentaReadDTO> = {
    filename: `Reporte_Ventas`,
    data: filteredData,
    columns: [
      { header: "NÚMERO", dataKey: "numero" },
      { header: "CLIENTE", dataKey: "clienteNombre" },
      { header: "FECHA", dataKey: (v) => new Date(v.fechaElaboracion).toLocaleDateString() },     
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
            <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">Fecha: {new Date(v.fechaElaboracion).toLocaleDateString()}</span>
          </div>
        </div>
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
          <button onClick={() => onEdit?.(v.id)} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="Ver Detalles">
            <Eye size={15} strokeWidth={2.5} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="flex-1" />
        <ExportButtons
          onExportExcel={() => exportToExcel(exportConfig)}
          onExportPDF={() => exportToPDF(exportConfig)}
        />
      </div>

      <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar por número o cliente" />

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <Table columns={columns} data={filteredData} />
      </div>
    </div>
  );
};
export default VentasList;
