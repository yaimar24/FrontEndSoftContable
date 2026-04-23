import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Plus, ArrowRight } from "lucide-react";
import { getNotasByFacturaVenta, getNotasByFacturaCompra } from "../../../../data/services/notaCreditoDebito/notaCreditoDebitoService";
import type { NotaCreditoDebitoReadDTO } from "../../../../domain/models/NotaCreditoDebito";
import { TipoNotaCredDeb } from "../../../../domain/models/NotaCreditoDebito";
import Button from "../../../components/atoms/Button";
import { formatCurrencyDecimals as formatCurrency, formatDateShort } from "../../../../utils/formatters";
import { getNotaEstadoInfo } from "../../../../utils/statusHelpers";

interface NotasFacturaSectionProps {
  facturaId: number;
  facturaNumero?: string;
  origen: "venta" | "compra";
  onCreateNota: (tipo: number) => void;
}

const NotasFacturaSection: React.FC<NotasFacturaSectionProps> = ({
  facturaId,
  origen,
  onCreateNota,
}) => {
  const navigate = useNavigate();
  const [notas, setNotas] = useState<NotaCreditoDebitoReadDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res =
          origen === "venta"
            ? await getNotasByFacturaVenta(facturaId)
            : await getNotasByFacturaCompra(facturaId);
        if (res.success && res.data) {
          setNotas(((res.data as { items?: NotaCreditoDebitoReadDTO[] }).items) || []);
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [facturaId, origen]);

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          type="button"
          variant="primary"
          icon={Plus}
          onClick={() => onCreateNota(TipoNotaCredDeb.NotaCredito)}
          className="text-[10px]"
        >
          Nota Crédito
        </Button>
        <Button
          type="button"
          variant="secondary"
          icon={Plus}
          onClick={() => onCreateNota(TipoNotaCredDeb.NotaDebito)}
          className="text-[10px]"
        >
          Nota Débito
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-slate-400 text-sm py-8 text-center">Cargando notas...</div>
      ) : notas.length === 0 ? (
        <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8 text-center">
          <span className="text-2xl block mb-2">📋</span>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
            No hay notas asociadas a esta factura
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-3">Número</th>
                <th className="px-6 py-3">Tipo</th>
                <th className="px-6 py-3">Motivo</th>
                <th className="px-6 py-3 text-right">Total</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Fecha</th>
                <th className="px-6 py-3 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {notas.map((nota) => {
                const { label, color } = getNotaEstadoInfo(nota.estadoNombre);
                return (
                  <tr key={nota.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 font-bold text-slate-800">
                        <FileText size={14} className="text-blue-400" />
                        {nota.numero}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          nota.tipoId === 1
                            ? "bg-blue-50 text-blue-600"
                            : "bg-orange-50 text-orange-600"
                        }`}
                      >
                        {nota.tipoNombre}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{nota.motivoNombre}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-800">
                      {formatCurrency(nota.totalNeto)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${color}`}>
                        {label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatDateShort(nota.fechaElaboracion)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/dashboard/notas/${nota.id}`)}
                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"
                        title="Ver detalle"
                      >
                        <ArrowRight size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NotasFacturaSection;
