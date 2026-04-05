import { useNavigate } from 'react-router-dom';
import { Calculator, Users, ShoppingCart, Package, Building2 } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { getNombreColegioFromToken, getLogoUrlFromToken } from '../../../utils/jwt';

const DashboardHome = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const nombreColegio = getNombreColegioFromToken(token) || "Mi Empresa";
  
  let perfilInstitucional: any = {};
  try {
    const storedPerfil = localStorage.getItem('perfilInstitucional');
    if (storedPerfil) perfilInstitucional = JSON.parse(storedPerfil);
  } catch (e) {
    // Ignorar si no hay perfil válido
  }

  const nombreMostrar = perfilInstitucional?.nombreColegio || nombreColegio;
  
  const rawLogoUrl = localStorage.getItem('logoUrl') || (token ? getLogoUrlFromToken(token) : null);
  const logoUrl = rawLogoUrl ? (rawLogoUrl.startsWith('http') ? rawLogoUrl : `${import.meta.env.VITE_API_URL}${rawLogoUrl}`) : null;

  const quickLinks = [
    {
      title: "Ventas y Facturación",
      description: "Gestiona las facturas y ventas a clientes",
      icon: <ShoppingCart className="w-8 h-8 text-blue-600" />,
      path: "/dashboard/ventas",
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      textColor: "text-blue-900"
    },
    {
      title: "Productos y Servicios",
      description: "Administra tu inventario y catálogo",
      icon: <Package className="w-8 h-8 text-emerald-600" />,
      path: "/dashboard/productos",
      color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
      textColor: "text-emerald-900"
    },
    {
      title: "Terceros",
      description: "Directorio de clientes y proveedores",
      icon: <Users className="w-8 h-8 text-purple-600" />,
      path: "/dashboard/terceros",
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
      textColor: "text-purple-900"
    },
    {
      title: "Cuentas Contables (PUC)",
      description: "Plan único de cuentas y estructura financiera",
      icon: <Calculator className="w-8 h-8 text-orange-600" />,
      path: "/dashboard/puc",
      color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
      textColor: "text-orange-900"
    },
    {
      title: "Perfil Institucional",
      description: "Configura la información de tu empresa",
      icon: <Building2 className="w-8 h-8 text-slate-600" />,
      path: "/dashboard/perfil",
      color: "bg-slate-100 border-slate-300 hover:bg-slate-200",
      textColor: "text-slate-900"
    }
  ];

  return (
    <div className="w-full h-full flex flex-col items-center pt-8 px-4 sm:px-8 pb-12">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-12 text-center mb-10 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-600 to-emerald-500"></div>
        <div className="flex flex-col items-center justify-center">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-24 object-contain mb-6 drop-shadow-sm" />
          ) : (
            <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-slate-200">
              <Building2 className="w-10 h-10 text-slate-400" />
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight leading-tight">
            ¡Bienvenido a <span className="text-blue-700">{nombreMostrar}</span>!
          </h1>
          <p className="text-slate-500 mt-4 text-lg font-medium max-w-2xl mx-auto">
            Tu sistema contable y de facturación está listo. Selecciona una de las opciones a continuación para empezar a trabajar.
          </p>
        </div>
      </div>

      <div className="w-full max-w-5xl">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 pl-2">Accesos Rápidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => navigate(link.path)}
              className={`flex flex-col items-start text-left p-6 rounded-2xl border transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md ${link.color}`}
            >
              <div className="bg-white p-3 rounded-xl shadow-sm border border-white/40 mb-4">
                {link.icon}
              </div>
              <div className="flex flex-col">
                <span className={`font-black text-xl mb-2 leading-tight ${link.textColor}`}>
                  {link.title}
                </span>
                <span className="text-sm font-medium text-slate-600 leading-snug">
                  {link.description}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;