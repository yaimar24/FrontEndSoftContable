import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Printer, Download, Banknote, FileText } from "lucide-react";
import { getVentaById } from "../../../../data/services/venta/ventaService";
import { InvoiceTemplate } from "./ListVentas/InvoiceTemplate";
import type { FacturaVentaReadDTO, ReciboCajaRead } from "../../../../domain/models/Venta";
import LoadingOverlay from "../../../components/shared/LoadingOverlay";
import Button from "../../../components/atoms/Button";
import { exportInvoiceToPDF } from "../../../../utils/exportInvoicePDF";        
import { AsientosContablesSection } from "../../../components/organisms/AsientosContablesSection";
import { PaymentModal } from "./ListVentas/PaymentModal";
import { PlanCuotasSection } from "../../../components/organisms/PlanCuotasSection";

const VentasViewerPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [factura, setFactura] = useState<FacturaVentaReadDTO | null>(null);     
  const [loading, setLoading] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  const fetchFactura = async (background = false) => {
    if (!id) return;
    try {
      if (!background) setLoading(true);
      const res = await getVentaById(Number(id));
      if (res.success && res.data) {
        setFactura(res.data);
      }
    } finally {
      if (!background) setLoading(false);
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
        <Button onClick={() => navigate('/dashboard/ventas')} variant="primary">Volver a Ventas</Button>
      </div>
    );
  }

  // Determine Badge Colors
  let badgeColor = "bg-slate-100 text-slate-600";
  if (factura.estadoNombre === "Pendiente") badgeColor = "bg-slate-100 text-slate-600"; // gris
  if (factura.estadoNombre === "Aprobada") badgeColor = "bg-blue-100 text-blue-600"; // azul
  if (factura.estadoNombre === "Enviada") badgeColor = "bg-orange-100 text-orange-600"; // naranja
  if (factura.estadoNombre === "PendienteConAbono") badgeColor = "bg-yellow-100 text-yellow-700"; // amarillo
  if (factura.estadoNombre === "Pagada") badgeColor = "bg-emerald-100 text-emerald-600"; // verde
  if (factura.estadoNombre === "Anulada") badgeColor = "bg-red-100 text-red-600"; // rojo

  const formatCurrency = (val: number) => val.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });

  // "Registrar Pago" button condition
  const canPay = factura.saldo > 0 && factura.estadoNombre !== "Anulada";

  return (
    <div className="min-h-screen bg-slate-50 pb-20 print:bg-white print:p-0 print:min-h-0 print:m-0">
      {/* Header bar (no printable) */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-40 print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/dashboard/ventas')} icon={ArrowLeft}>
            Volver
          </Button>
          <div className="hidden sm:flex items-center gap-3">
             <h1 className="text-xl font-black text-slate-800 tracking-tight">Factura #{factura.numero}</h1>
             <span className={`px-3 py-1 rounded-full text-xs font-bold ${badgeColor}`}>
               {factura.estadoNombre === "PendienteConAbono" ? "Abonada" : factura.estadoNombre}
             </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {canPay && (
            <Button
              variant="secondary"
              icon={Banknote}
              onClick={() => setIsPaymentModalOpen(true)}
              className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 border-emerald-100 shadow-none"
            >
              Registrar Pago
            </Button>
          )}
          <Button variant="outline" onClick={handleDownloadPDF} icon={Download}>
            PDF
          </Button>
          <Button variant="primary" onClick={handlePrint} icon={Printer}>       
            Imprimir
          </Button>
        </div>
      </div>

      {/* Main Content Area (Not the printable, but the Dashboard View) */}
      <div className="max-w-6xl mx-auto mt-8 px-4 print:hidden space-y-4">
         
         {/* Encabezado */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Cliente</p>
               <p className="text-base font-black text-slate-800">{factura.clienteNombre}</p>
               <p className="text-sm text-slate-500 font-medium">ID: {factura.clienteId}</p>
            </div>
            <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Colegio</p>
               <p className="text-sm font-bold text-slate-700">{factura.colegioNombre}</p>
               <p className="text-sm text-slate-500 font-medium">NIT: {factura.colegioNit}</p>
            </div>
            <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Fecha Elaboración</p>
               <p className="text-sm font-bold text-slate-700">{new Intl.DateTimeFormat('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(factura.fechaElaboracion))}</p>
            </div>
            <div>
               {factura.esCredito ? (
                 <>
                   <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Tipo de Pago</p>
                   <p className="text-sm font-bold text-emerald-700">A Crédito</p>
                   <p className="text-sm text-slate-500 font-medium">Frecuencia: {factura.frecuenciaPagoNombre}</p>
                   <p className="text-sm text-slate-500 font-medium">Cuotas: {factura.numeroCuotas}</p>
                 </>
               ) : (
                 <>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tipo de Pago / Medio</p>
                   <p className="text-sm font-bold text-slate-700">Contado</p>
                   <p className="text-sm font-bold text-emerald-600">{factura.medioPagoNombre || 'N/A'}</p>
                 </>
               )}
            </div>
         </div>

         {/* Grid de Tablas: Productos y Recibos */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Left Column: Productos (Colspan 2) */}
            <div className="lg:col-span-2 space-y-4">
               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                     <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                        <FileText size={18} className="text-blue-500" />
                        Detalle de Productos
                     </h3>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                           <tr>
                              <th className="px-6 py-3">Producto</th>
                              <th className="px-6 py-3 text-center">Cant</th>
                              <th className="px-6 py-3 text-right">V. Unitario</th>
                              <th className="px-6 py-3 text-center">Impuestos</th>
                              <th className="px-6 py-3 text-right">Subtotal</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm font-medium">
                           {factura.detalles?.map(det => (
                              <tr key={det.id} className="hover:bg-slate-50">
                                 <td className="px-6 py-4 text-slate-800">{det.productoNombre || det.descripcion}</td>
                                 <td className="px-6 py-4 text-center text-slate-600">{det.cantidad}</td>
                                 <td className="px-6 py-4 text-right text-slate-600">{formatCurrency(det.valorUnitario)}</td>
                                 <td className="px-6 py-4 text-center">
                                    <div className="flex flex-col gap-1 items-center">
                                       {det.impuestoCargoNombre && <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold">{det.impuestoCargoNombre} +{det.impuestoCargo}</span>}
                                       {det.retencionNombre && <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-bold">{det.retencionNombre} -{det.impuestoRetencion}</span>}
                                       {(!det.impuestoCargoNombre && !det.retencionNombre) && <span className="text-slate-400">-</span>}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4 text-right text-slate-800 font-bold">{formatCurrency(det.valorTotal)}</td>
                              </tr>
                           ))}
                           {(!factura.detalles || factura.detalles.length === 0) && (
                              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">No hay productos.</td></tr>
                           )}
                        </tbody>
                     </table>
                  </div>
               </div>
               {/* Plan de Cuotas (solo si es crédito) */}
               {factura.esCredito && factura.cuotas && factura.cuotas.length > 0 && (
                 <PlanCuotasSection
                   cuotas={factura.cuotas}
                   cuotasPendientes={factura.cuotasPendientes ?? null}
                   cuotasVencidas={factura.cuotasVencidas ?? null}
                   proximaCuotaValor={factura.proximaCuotaValor ?? null}
                   proximaCuotaVencimiento={factura.proximaCuotaVencimiento ?? null}
                 />
               )}
               {/* Tabla de Recibos Vinculados */}
               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                     <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                        <Banknote size={18} className="text-emerald-500" />
                        Recibos Vinculados
                     </h3>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                           <tr>
                              <th className="px-6 py-3">Recibo</th>
                              <th className="px-6 py-3">Fecha</th>
                              <th className="px-6 py-3">Medio</th>
                              <th className="px-6 py-3">Tipo</th>
                              <th className="px-6 py-3 text-right">Monto</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm font-medium">
                           {factura.recibos?.map((recibo: ReciboCajaRead) => (
                              <tr key={recibo.id} className="hover:bg-slate-50">
                                 <td className="px-6 py-4">
                                    <Link to={`/dashboard/ventas/recibos/${recibo.id}`} className="text-blue-600 font-bold hover:underline">
                                       {recibo.numero}
                                    </Link>
                                 </td>
                                 <td className="px-6 py-4 text-slate-600">{new Intl.DateTimeFormat('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(recibo.fechaRecibo))}</td>
                                 <td className="px-6 py-4 text-slate-600">{recibo.medioPagoNombre}</td>
                                 <td className="px-6 py-4">
                                     <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${recibo.esAbono ? 'bg-yellow-50 text-yellow-700' : 'bg-emerald-50 text-emerald-700'}`}>
                                        {recibo.esAbono ? "Abono" : "Pago total"}
                                     </span>
                                 </td>
                                 <td className="px-6 py-4 text-right text-slate-800 font-bold">{formatCurrency(recibo.monto)}</td>
                              </tr>
                           ))}
                           {(!factura.recibos || factura.recibos.length === 0) && (
                              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">No hay recibos vinculados.</td></tr>
                           )}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>

            {/* Right Column: Resumen */}
            <div className="lg:col-span-1">
               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
                  <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-6">Resumen</h3>
                  
                  <div className="space-y-4 text-sm font-medium">
                     <div className="flex justify-between items-center text-slate-600">
                        <span>Total Bruto</span>
                        <span>{formatCurrency(factura.totalBruto)}</span>
                     </div>
                     {(factura.descuentoTotal > 0) && (
                        <div className="flex justify-between items-center text-slate-600">
                           <span>Descuentos</span>
                           <span className="text-red-500">-{formatCurrency(factura.descuentoTotal)}</span>
                        </div>
                     )}
                     <div className="flex justify-between items-center text-slate-600">
                        <span>Subtotal</span>
                        <span>{formatCurrency(factura.subtotal)}</span>
                     </div>
                     <div className="flex justify-between items-center text-slate-600 border-t border-slate-100 pt-4">
                        <span>Impuestos (+)</span>
                        <span>{formatCurrency(factura.totalImpuestoCargo)}</span>
                     </div>
                     <div className="flex justify-between items-center text-slate-600">
                        <span>Retenciones (-)</span>
                        <span>{formatCurrency(factura.totalRetencion)}</span>
                     </div>
                     
                     <div className="pt-4 border-t border-slate-200 mt-4">
                        <div className="flex justify-between items-center mb-2">
                           <span className="font-bold text-slate-800 text-base">Total Neto</span>
                           <span className="font-black text-slate-800 text-lg">{formatCurrency(factura.totalNeto)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                           <span className="font-bold text-emerald-600 text-sm">Total Pagado</span>
                           <span className="font-black text-emerald-600 text-sm">{formatCurrency(factura.totalPagado)}</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl mt-4">
                           <span className={`font-bold ${factura.saldo > 0 ? 'text-red-500' : 'text-slate-500'} text-sm`}>Saldo Pendiente</span>
                           <span className={`font-black ${factura.saldo > 0 ? 'text-red-500' : 'text-slate-500'} text-lg`}>{formatCurrency(factura.saldo)}</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Comprobantes contables Section */}
               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-4">
                  <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                     <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                        <Banknote size={18} className="text-blue-500" />
                        Comprobantes contables
                     </h3>
                  </div>
                  <div className="p-4">
                     <AsientosContablesSection tipoDocumento="FacturaVenta" documentoId={factura.id} />
                  </div>
               </div>
            </div>
         </div>
      </div>

      <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          factura={factura}
          onSuccess={() => fetchFactura(true)}
      />

      {/* Hidden Printable Template */}
      <div className="hidden print:block">
         <InvoiceTemplate factura={factura} />
      </div>
    </div>
  );
};

export default VentasViewerPage;

