import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Printer, Download } from "lucide-react";
import { getVentasByColegio } from "../../../../services/venta/ventaService";
import { InvoiceTemplate } from "./ListVentas/InvoiceTemplate";
import type { FacturaVentaReadDTO } from "../../../../models/Venta";
import LoadingOverlay from "../../../shared/LoadingOverlay";
import Button from "../../../common/Button";
import { exportInvoiceToPDF } from "../../../../utils/exportInvoicePDF";

const VentasViewerPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [factura, setFactura] = useState<FacturaVentaReadDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFactura = async () => {
      try {
        setLoading(true);
        // Note: For now we fetch all and find the one. Ideally in the future you'd have a getVentaById endpoint.
        const res = await getVentasByColegio();
        if (res.success && res.data) {
          const found = res.data.find(f => f.id === Number(id));
          if (found) setFactura(found);
        }
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchFactura();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!factura) return;
    try {
      const token = localStorage.getItem('token');
      await exportInvoiceToPDF(factura, token);
    } catch (error) {
      console.error("Error generando PDF", error);
    }
  };

  if (loading) return <LoadingOverlay message="Cargando documento..." />;

  if (!factura) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-xl font-black text-slate-800 mb-4">No se encontro la factura</h2>
        <Button onClick={() => navigate('/dashboard/ventas')} variant="primary">Volver a Ventas</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header bar (no printable) */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm print:hidden sticky top-0 z-50">
        <Button variant="outline" onClick={() => navigate('/dashboard/ventas')} icon={ArrowLeft}>
          Volver
        </Button>
        <h1 className="text-sm font-black text-slate-700 uppercase tracking-widest hidden md:block">
          Factura #{factura.numero}
        </h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleDownloadPDF} icon={Download}>
            PDF
          </Button>
          <Button variant="primary" onClick={handlePrint} icon={Printer}>
            Imprimir
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 custom-scrollbar print:p-0 bg-slate-100 print:bg-white flex justify-center">
        <div 
          ref={printRef}
          className="bg-white shadow-xl print:shadow-none min-h-[1056px] w-[816px] origin-top"
        >
          <InvoiceTemplate factura={factura} />
        </div>
      </div>
    </div>
  );
};

export default VentasViewerPage;
