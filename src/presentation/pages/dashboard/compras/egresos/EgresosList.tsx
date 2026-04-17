import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getComprobantesEgreso } from "../../../../../data/services/comprobanteEgreso/comprobanteEgresoService";
import type { ComprobanteEgresoRead } from "../../../../../domain/models/ComprobanteEgreso";
import { Table } from "../../../../components/organisms/Table";
import PageHeader from "../../../../components/organisms/PageHeader";
import { useGlobalLoading as useLoading } from "../../../../../application/context/LoadingContext";
import { Eye, FileText, Banknote } from "lucide-react";
import SearchBar from "../../../../components/molecules/SearchBar";
import { useFilter } from "../../../../../application/hooks/useGenericFilter";

export const EgresosList = () => {
  const [data, setData] = useState<ComprobanteEgresoRead[]>([]);
  const { show, hide } = useLoading();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEgresos();
  }, []);

  const fetchEgresos = async () => {
    try {
      show();
      const res = await getComprobantesEgreso();
      if (res.success && res.data) {
        // En endpoints con paginación, los items vienen en res.data.items
        setData(res.data.items || res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      hide();
    }
  };

  const { searchTerm, setSearchTerm, filteredData } = useFilter(data || [], {
    searchFields: ["numero", "proveedorNombre", "facturaCompraNumero", "medioPagoNombre", "referencia"],
  });

  const columns = [
    {
      header: "Nro. Egreso",
      render: (v: ComprobanteEgresoRead) => (
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600">
            <FileText size={18} />
          </div>
          <span className="font-black uppercase text-[11px] text-slate-800">{v.numero}</span>
        </div>
      )
    },
    {
      header: "Factura",
      render: (v: ComprobanteEgresoRead) => (
        <button onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/factura-compra/${v.facturaCompraId}`); }} className="font-bold text-[10px] text-blue-600 uppercase hover:underline">
          {v.facturaCompraNumero}
        </button>
      )
    },
    {
      header: "Proveedor",
      render: (v: ComprobanteEgresoRead) => (
        <span className="font-bold text-[10px] text-slate-700 uppercase">{v.proveedorNombre}</span>
      )
    },
    {
      header: "Medio de Pago",
      render: (v: ComprobanteEgresoRead) => (
        <span className="font-bold text-[10px] text-slate-600 uppercase">{v.medioPagoId} - {v.medioPagoNombre}</span>
      )
    },
    {
      header: "Monto",
      render: (v: ComprobanteEgresoRead) => (
        <span className="font-bold text-slate-700">${v.monto?.toLocaleString()}</span>
      )
    },
    {
      header: "Tipo",
      render: (v: ComprobanteEgresoRead) => (
        <span className={`px-2 py-1 text-[9px] font-black uppercase border rounded-lg ${v.esAbono ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
          {v.esAbono ? 'Abono' : 'Pago Total'}
        </span>
      )
    },
    {
      header: "Fecha",
      render: (v: ComprobanteEgresoRead) => (
        <span className="text-[10px] font-bold text-slate-600">
          {new Date(v.fechaEgreso).toLocaleDateString()}
        </span>
      )
    },
    {
      header: "Referencia",
      render: (v: ComprobanteEgresoRead) => (
        <span className="text-[10px] text-slate-500">{v.referencia || "-"}</span>
      )
    },
    {
      header: "Acciones",
      className: "text-right",
      render: (v: ComprobanteEgresoRead) => (
        <div className="flex justify-end gap-2">
          <button onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/factura-compra/egresos/${v.id}`); }} className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-orange-600 hover:text-white transition-all shadow-sm" title="Ver Detalles">
            <Eye size={15} strokeWidth={2.5} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Comprobantes de Egreso"
        subtitle="Listado general de los comprobantes de pago emitidos"
        icon={Banknote}
      />

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="w-full lg:w-1/3">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar por egreso, factura o proveedor..." />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <Table columns={columns} data={filteredData} />
      </div>
    </div>
  );
};
export default EgresosList;