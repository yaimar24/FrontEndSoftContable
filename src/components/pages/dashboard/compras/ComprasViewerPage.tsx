import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../../common/Button';
import LoadingOverlay from '../../../shared/LoadingOverlay';
import { getCompraById } from '../../../../services/compra/compraService';
import type { FacturaCompraReadDTO } from '../../../../models/FacturaCompra';
import { ArrowLeft, Printer, ShoppingCart, FileText } from 'lucide-react';

const ComprasViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [compra, setCompra] = useState<FacturaCompraReadDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCompra(Number(id));
    }
  }, [id]);

  const fetchCompra = async (compraId: number) => {
    try {
      setLoading(true);
      const res = await getCompraById(compraId);
      if (res.success && res.data) {
        setCompra(res.data);
      } else {
        setError(res.message || 'Error al cargar la compra');
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <LoadingOverlay message="Cargando compra..." />;
  
  if (error || !compra) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-xl font-black text-slate-800 mb-4">{error || 'Factura no encontrada'}</h2>
        <Button onClick={() => navigate('/dashboard/factura-compra')} variant="primary">Volver a Compras</Button>
      </div>
    );
  }

  // Determine Badge Colors
  let badgeColor = "bg-slate-100 text-slate-600";
  if (compra.estadoNombre === "Registrada") badgeColor = "bg-emerald-100 text-emerald-600"; // verde
  if (compra.estadoNombre === "Anulada") badgeColor = "bg-red-100 text-red-600"; // rojo

  const formatCurrency = (val: number) => val.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });

  return (
    <div className="min-h-screen bg-slate-50 pb-20 print:bg-white print:p-0 print:m-0">
      {/* Header bar (no printable) */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-40 print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/dashboard/factura-compra')} icon={ArrowLeft}>
            Volver
          </Button>
          <div className="hidden sm:flex items-center gap-3">
             <h1 className="text-xl font-black text-slate-800 tracking-tight">Compra #{compra.numero}</h1>
             <span className={`px-3 py-1 rounded-full text-xs font-bold ${badgeColor}`}>
               {compra.estadoNombre}
             </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" onClick={handlePrint} icon={Printer}>       
            Imprimir
          </Button>
        </div>
      </div>

      {/* Main Content Area (Printable Dashboard View) */}
      <div className="max-w-6xl mx-auto mt-8 px-4 print:mt-0 print:px-0 space-y-6">
         
         {/* Encabezado */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Proveedor</p>
               <p className="text-base font-black text-slate-800">{compra.proveedorNombre}</p>
               <p className="text-sm text-slate-500 font-medium">Dir: {compra.proveedorDireccion || 'N/A'}</p>
               <p className="text-sm text-slate-500 font-medium">Tel: {compra.proveedorTelefono || 'N/A'}</p>
            </div>
            <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Colegio</p>
               <p className="text-sm font-bold text-slate-700">{compra.colegioNombre}</p>
               <p className="text-sm text-slate-500 font-medium">NIT: {compra.colegioNit || 'N/A'}</p>
            </div>
            <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Fecha Elaboración</p>
               <p className="text-sm font-bold text-slate-700">{new Intl.DateTimeFormat('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(compra.fechaElaboracion))}</p>
            </div>
            <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Medio de Pago</p>
               <p className="text-sm font-bold text-slate-700 text-indigo-600">{compra.medioPagoCodigo} - {compra.medioPagoNombre || 'N/A'}</p>
            </div>
         </div>

         {/* Grid de Tablas: Productos */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Productos (Colspan 2) */}
            <div className="lg:col-span-2 space-y-6">
               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                     <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                        <ShoppingCart size={18} className="text-indigo-500" />
                        Detalle de Ítems
                     </h3>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                           <tr>
                              <th className="px-6 py-3">Ítem / Descripción</th>
                              <th className="px-6 py-3">Cuenta Contable</th>
                              <th className="px-6 py-3 text-center">Cant</th>
                              <th className="px-6 py-3 text-right">V. Unitario</th>
                              <th className="px-6 py-3 text-right">Subtotal</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm font-medium">
                           {compra.detalles?.map(det => (
                              <tr key={det.id} className="hover:bg-slate-50">
                                 <td className="px-6 py-4 text-slate-800">
                                   <p className="font-bold">{det.tipoItemNombre}</p>
                                   <p className="text-xs text-slate-500">{det.descripcion || det.productoNombre}</p>
                                 </td>
                                 <td className="px-6 py-4 text-slate-600 text-xs whitespace-nowrap">
                                   {det.cuentaContableCodigo ? `${det.cuentaContableCodigo} - ${det.cuentaContableNombre || ''}` : '—'}
                                 </td>
                                 <td className="px-6 py-4 text-center text-slate-600">{det.cantidad}</td>
                                 <td className="px-6 py-4 text-right text-slate-600">{formatCurrency(det.valorUnitario)}</td>
                                 <td className="px-6 py-4 text-right text-slate-800 font-bold">{formatCurrency(det.valorTotal)}</td>
                              </tr>
                           ))}
                           {(!compra.detalles || compra.detalles.length === 0) && (
                              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">No hay detalles.</td></tr>
                           )}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>

            {/* Right Column: Resumen Totales */}
            <div className="lg:col-span-1 space-y-6">
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="font-black text-slate-700 mb-6 uppercase tracking-widest text-sm flex items-center gap-2">
                     <FileText size={18} className="text-slate-400"/> Resumen
                  </h3>
                  
                  <div className="space-y-4 text-sm font-medium text-slate-600">
                     <div className="flex justify-between">
                        <span>Total Bruto</span>
                        <span className="font-bold text-slate-800">{formatCurrency(compra.totalBruto)}</span>
                     </div>
                     <div className="flex justify-between text-blue-600">
                        <span>Descuentos</span>
                        <span>-{formatCurrency(compra.descuentoTotal)}</span>
                     </div>
                     <div className="flex justify-between text-rose-600">
                        <span>Impuestos</span>
                        <span>+{formatCurrency(compra.totalImpuestoCargo)}</span>
                     </div>
                     <div className="flex justify-between text-emerald-600">
                        <span>Retenciones</span>
                        <span>-{formatCurrency(compra.totalRetencion)}</span>
                     </div>

                     <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center">
                        <span className="font-black text-slate-800 uppercase tracking-wider text-xs">Total Neto</span>
                        <span className="text-2xl font-black text-indigo-600">{formatCurrency(compra.totalNeto)}</span>
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
};

export default ComprasViewerPage;
