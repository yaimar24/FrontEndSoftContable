import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Calculator, Users, ShoppingCart, ShoppingBag, Package, Building2, TrendingUp, TrendingDown, ArrowRight, Activity, Wallet, FileText } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { getNombreColegioFromToken, getLogoUrlFromToken } from '../../../utils/jwt';
import { motion } from 'framer-motion';
import { getDashboardDatos, type DashboardDTO } from '../../../services/dashboard/dashboardService';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import LoadingOverlay from '../../shared/LoadingOverlay';

const formatCurrency = (val: number) => 
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

const formatShortDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return `${d.getDate()} ${d.toLocaleString('es-CO', { month: 'short' }).substring(0, 3)} ${d.getFullYear()}`;
};

const DashboardHome = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [data, setData] = useState<DashboardDTO | null>(null);
  const [loading, setLoading] = useState(true);
  
  const nombreColegio = getNombreColegioFromToken(token) || "Mi Empresa";
  
  let perfilInstitucional: any = {};
  try {
    const storedPerfil = localStorage.getItem('perfilInstitucional');
    if (storedPerfil) perfilInstitucional = JSON.parse(storedPerfil);
  } catch (e) {
    // Ignorar
  }

  const nombreMostrar = perfilInstitucional?.nombreColegio || nombreColegio;
  const rawLogoUrl = localStorage.getItem('logoUrl') || (token ? getLogoUrlFromToken(token) : null);
  const logoUrl = rawLogoUrl ? (rawLogoUrl.startsWith('http') ? rawLogoUrl : `${import.meta.env.VITE_API_URL}${rawLogoUrl}`) : null;

  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      try {
        const response = await getDashboardDatos();
        if (isMounted) {
          if (response.success && response.data) {
             setData(response.data);
          }
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) setLoading(false);
      }
    };
    fetchDashboard();
    return () => { isMounted = false; };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  if (loading) {
     return <LoadingOverlay message="Cargando dashboard..." />;
  }

  const d = data!;

  return (
    <div className="w-full h-full min-h-screen bg-slate-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="tuto-dash-header flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200"
        >
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-md transform scale-110"></div>
              {logoUrl ? (
                <img src={logoUrl} alt="Logo Empresa" className="relative h-16 w-16 md:h-20 md:w-20 rounded-full object-cover border-4 border-white shadow-sm bg-white" />
              ) : (
                <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center border-4 border-white shadow-sm">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-1">Panel de Control</p>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
                Hola, {nombreMostrar} 👋
              </h1>
              <p className="text-sm font-medium text-slate-500 mt-1">
                Aquí tienes un resumen de hoy, {new Intl.DateTimeFormat('es-CO', { dateStyle: 'long' }).format(new Date())}.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Top Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Ventas Mes */}
            <motion.div variants={itemVariants} className="tuto-dash-ventas bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <TrendingUp size={120} />
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Ventas Mes</p>
              <h3 className="text-3xl font-black text-emerald-600 tracking-tight">{formatCurrency(d.ventas.totalMesActual)}</h3>
              <div className="mt-4 flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-md text-sm font-bold ${d.ventas.porcentajeCambio >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                   {d.ventas.porcentajeCambio >= 0 ? '↑' : '↓'} {Math.abs(d.ventas.porcentajeCambio)}%
                </span>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">{d.ventas.cantidadMesActual} facturas</span>
              </div>
            </motion.div>

            {/* Compras Mes */}
            <motion.div variants={itemVariants} className="tuto-dash-compras bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <TrendingDown size={120} />
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Compras Mes</p>
              <h3 className="text-3xl font-black text-rose-600 tracking-tight">{formatCurrency(d.compras.totalMesActual)}</h3>
              <div className="mt-4 flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-md text-sm font-bold ${d.compras.porcentajeCambio <= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                   {d.compras.porcentajeCambio > 0 ? '↑' : '↓'} {Math.abs(d.compras.porcentajeCambio)}%
                </span>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">{d.compras.cantidadMesActual} facturas</span>
              </div>
            </motion.div>

            {/* Cartera */}
            <motion.div variants={itemVariants} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
               <div className="absolute -right-4 -top-4 opacity-5">
                <Wallet size={120} />
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Cartera Por Cobrar</p>
              <h3 className="text-3xl font-black text-blue-600 tracking-tight">{formatCurrency(d.cartera.totalPorCobrar)}</h3>
              <div className="mt-4 flex flex-col gap-2">
                 <div className="flex gap-2">
                    <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">{d.cartera.facturasPendientes} Pendientes</span>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">{d.cartera.facturasConAbono} Con Abono</span>
                 </div>
                 <p className="text-xs font-bold text-slate-500">Recaudado este mes: <span className="text-emerald-600">{formatCurrency(d.cartera.totalRecaudadoMes)}</span></p>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart Area */}
            <motion.div variants={itemVariants} className="col-span-1 lg:col-span-3 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[300px]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
                 <h2 className="text-sm font-black text-slate-400 tracking-widest uppercase flex items-center gap-2">
                    <Activity size={18} className="text-indigo-500" />
                    Dinámica de Ventas y Compras (Últimos 6 Meses)
                 </h2>
                 <div className="flex gap-4 mt-4 sm:mt-0 text-xs font-bold text-slate-500">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span>Ventas</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-rose-500"></span>Compras</div>
                 </div>
              </div>
              <div className="h-64 sm:h-72 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={d.resumenMensual.map(r => ({ ...r, mesNombre: r.mesNombre.substring(0,3).toUpperCase() }))} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                       <Tooltip
                          cursor={{ fill: 'transparent' }}
                          formatter={(value: any) => formatCurrency(Number(value) || 0)}
                          contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}
                       />
                       <XAxis dataKey="mesNombre" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                       <Bar dataKey="totalVentas" fill="#10b981" radius={[6, 6, 6, 6]} barSize={30} />
                       <Bar dataKey="totalCompras" fill="#f43f5e" radius={[6, 6, 6, 6]} barSize={30} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
            </motion.div>

            {/* List Activity */}
            <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">Últimos Movimientos</h2>
              </div>
              <div className="p-0">
                <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto">
                  {d.ultimosMovimientos.length === 0 ? (
                    <div className="py-12 text-center text-slate-400">
                      <FileText size={32} className="mx-auto mb-3 opacity-20" />
                      <p className="text-sm font-medium">Aún no hay actividad registrada.</p>
                    </div>
                  ) : (
                    d.ultimosMovimientos.map((act, i) => {
                      const isVenta = act.tipo === 'VENTA';
                      const isCompra = act.tipo === 'COMPRA';
                      return (
                      <div key={i} className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 ${isVenta ? 'text-emerald-500' : isCompra ? 'text-rose-500' : 'text-blue-500'}`}>
                             {isVenta ? <ShoppingCart size={18}/> : isCompra ? <ShoppingBag size={18}/> : <Calculator size={18} />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                               <p className="font-bold text-slate-800 text-sm tracking-tight">{act.numero}</p>
                               <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-md ${isVenta ? 'bg-emerald-50 text-emerald-600' : isCompra ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>{act.tipo}</span>
                            </div>
                            <p className="text-xs font-medium text-slate-500 mt-0.5">{act.terceroNombre} • {formatShortDate(act.fecha)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                           <span className={`font-black text-sm block ${isCompra ? 'text-rose-600' : 'text-slate-800'}`}>
                              {isVenta ? '+' : isCompra ? '-' : ''}{formatCurrency(act.monto)}
                           </span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase">{act.estado}</span>
                        </div>
                      </div>
                    )})
                  )}
                </div>
              </div>
            </motion.div>

            {/* Side Modules & Counters */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Counters */}
              <div className="grid grid-cols-1 gap-4">
                 <div onClick={() => navigate('/dashboard/terceros')} className="cursor-pointer bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between hover:-translate-y-1 transition-transform group">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                         <Users size={18} />
                      </div>
                      <span className="font-bold text-slate-500 uppercase tracking-widest text-xs">Clientes</span>
                   </div>
                   <span className="text-xl font-black text-slate-800">{d.contadores.totalClientes}</span>
                 </div>
                 
                 <div onClick={() => navigate('/dashboard/terceros')} className="cursor-pointer bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between hover:-translate-y-1 transition-transform group">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                         <Building2 size={18} />
                      </div>
                      <span className="font-bold text-slate-500 uppercase tracking-widest text-xs">Proveedores</span>
                   </div>
                   <span className="text-xl font-black text-slate-800">{d.contadores.totalProveedores}</span>
                 </div>

                 <div onClick={() => navigate('/dashboard/productos')} className="cursor-pointer bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between hover:-translate-y-1 transition-transform group">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                         <Package size={18} />
                      </div>
                      <span className="font-bold text-slate-500 uppercase tracking-widest text-xs">Productos</span>
                   </div>
                   <span className="text-xl font-black text-slate-800">{d.contadores.totalProductos}</span>
                 </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHome;
