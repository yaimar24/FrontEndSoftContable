import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, Printer, Download } from "lucide-react";
import { getVentaById } from "../../../../data/services/venta/ventaService";
import { InvoiceTemplate } from "./ListVentas/InvoiceTemplate";
import type { FacturaVentaReadDTO } from "../../../../domain/models/Venta";
import LoadingOverlay from "../../../components/shared/LoadingOverlay";
import Button from "../../../components/atoms/Button";
import { exportInvoiceToPDF } from "../../../../utils/exportInvoicePDF";

const InvoicePrintPage: React.FC = () => {
  const { id } = useParams();
    const [factura, setFactura] = useState<FacturaVentaReadDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchFactura = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await getVentaById(Number(id));
      if (res.success && res.data) {
        setFactura(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFactura();
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
        <h2 className="text-xl font-black text-slate-800 mb-4">No se encontr� la factura</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header bar (no printable) */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm print:hidden sticky top-0 z-50">
        <Button variant="outline" onClick={() => window.close()} icon={ArrowLeft}>
          Cerrar Pesta�a
        </Button>
        <h1 className="text-sm font-black text-slate-700 uppercase tracking-widest hidden md:block">
          Factura #{factura.numero}
        </h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleDownloadPDF} icon={Download}>
            Descargar PDF
          </Button>
          <Button variant="primary" onClick={handlePrint} icon={Printer}>
            Imprimir
          </Button>
        </div>
      </div>

      {/* Main Print Area */}
      <div className="flex-1 overflow-auto p-5 print:p-0 flex justify-center custom-scrollbar">
        <div className="bg-white shadow-xl print:shadow-none min-h-[1056px] w-[816px] origin-top">
          <InvoiceTemplate factura={factura} />
        </div>
      </div>
    </div>
  );
};

export default InvoicePrintPage;
