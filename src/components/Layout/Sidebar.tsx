import React, { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  FolderTree,
  Users,
  ShoppingBag,
  ShoppingCart,
  Receipt,
  Package,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../common/Button";
import AuthContext from "../../context/AuthContext";
import StatusModal from "../common/StatusModal";
import { useTutorial } from "../../context/TutorialContext";

interface SidebarProps {
  nombreColegio: string | null;
  logoUrl?: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ nombreColegio, logoUrl }) => {  const getFullUrl = (path: string | null | undefined) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `${import.meta.env.VITE_API_URL}${path}`;
  };
  const displayLogoUrl = getFullUrl(logoUrl);
  // isPinned determina si la barra de navegación se mantiene desplegada y fija.
  // isHovered detecta si el ratón está encima para expandir temporalmente.
  const [isPinned, setIsPinned] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const isCollapsed = !isPinned && !isHovered;

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { startTutorial, stopTutorial } = useTutorial();

  const isDashboardHome = location.pathname === '/dashboard';

  // Detener tutorial al cambiar de ruta
  useEffect(() => {
    stopTutorial();
  }, [location.pathname, stopTutorial]);

  // --- LÓGICA DE EXPANSIÓN POR HOVER ---

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const toggleCollapse = () => {
    setIsPinned(!isPinned);
  };

  // --- LÓGICA DE CIERRE DE SESIÓN ---

  const handleLogoutIntent = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmLogout = () => {
    setShowConfirmModal(false);
    setIsLoggingOut(true);

    if (auth) {
      auth.logout();
    }

    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 800);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-3 rounded-2xl font-bold transition-all relative group ${
      isActive
        ? "bg-blue-50 text-[#1e3a8a]"
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
    }`;

  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: LayoutDashboard },
    { path: "/dashboard/perfil", name: "Perfil", icon: User },
    { path: "/dashboard/terceros", name: "Terceros", icon:  Users},
    { path: "/dashboard/puc", name: "Cuentas(puc)", icon: FolderTree },
    { path: "/dashboard/ventas", name: "Ventas", icon:  ShoppingBag },
    { path: "/dashboard/factura-compra", name: "Compras", icon: Receipt  },
    { path: "/dashboard/productos", name: "Productos", icon:  Package  },   
  ];

  return (
    <>
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? 85 : 280,
          transition: { type: "spring", stiffness: 300, damping: 30 },
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="h-screen bg-white border-r border-slate-100 flex flex-col sticky top-0 z-30 shadow-sm"
      >
        {/* BOTÓN COLAPSAR (MANUAL) */}
        <button
          onClick={toggleCollapse}
          className="tuto-collapse absolute -right-3 top-12 bg-white border border-slate-100 rounded-full p-1.5 shadow-md hover:scale-110 transition-transform text-slate-400 hover:text-blue-600 z-50"
        >
          {!isPinned ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* HEADER: LOGO */}
        <div className="p-6 flex flex-col items-center">
          <motion.div
            layout
              className="bg-gradient-to-br from-[#1e3a8a] to-blue-600 text-white rounded-[1.5rem] flex items-center justify-center text-2xl font-black shadow-xl shadow-blue-100 overflow-hidden relative"
              style={{
                width: isCollapsed ? 45 : 64,
                height: isCollapsed ? 45 : 64,
              }}
            >
              {displayLogoUrl ? (
                <img
                  src={displayLogoUrl}
                  alt="Logo del Colegio"
                  className="w-full h-full object-cover"
                />
              ) : (
                nombreColegio?.charAt(0).toUpperCase() || (
                  <GraduationCap size={isCollapsed ? 20 : 32} />
                )
              )}
            </motion.div>
            <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="mt-4 text-center overflow-hidden"
              >
                <h2 className="text-sm font-black text-slate-800 truncate w-48 px-2 uppercase tracking-tight">
                  {nombreColegio || "Institución"}
                </h2>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    En línea
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* NAVEGACIÓN */}
        <nav className="tuto-menu flex-1 px-4 py-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              className={linkClass}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[13px] whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 w-1 h-6 bg-[#1e3a8a] rounded-r-full"
                    />
                  )}
                  {/* Tooltip visible solo cuando está colapsado y NO se está haciendo hover general */}
                  {isCollapsed && (
                    <div className="absolute left-16 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* FOOTER: BOTÓN DE AYUDA Y LOGOUT */}
        <div className="p-4 border-t border-slate-100 mt-auto space-y-2">
          {/* BOTÓN DE AYUDA */}
          {!isDashboardHome && (
          <button
            onClick={startTutorial}
            className={`tuto-help w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 rounded-2xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all font-bold group relative`}
          >
            <HelpCircle size={22} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[13px] uppercase tracking-widest whitespace-nowrap"
              >
                Ayuda / Tutorial
              </motion.span>
            )}
            
            {/* Tooltip para estado colapsado */}
            {isCollapsed && (
              <div className="absolute left-16 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 font-medium tracking-normal">
                Ayuda / Tutorial
              </div>
            )}
          </button>
          )}
        
          <button
            onClick={handleLogoutIntent}
            disabled={isLoggingOut}
            className={`tuto-logout w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 rounded-2xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all font-bold group relative`}
          >
            <LogOut size={22} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[13px] uppercase tracking-widest whitespace-nowrap"
              >
                {isLoggingOut ? "Saliendo..." : "Cerrar sesión"}
              </motion.span>
            )}
            
            {/* Tooltip para estado colapsado */}
            {isCollapsed && (
              <div className="absolute left-16 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 font-medium tracking-normal">
                {isLoggingOut ? "Saliendo..." : "Cerrar sesión"}
              </div>
            )}
          </button>
        </div>
      </motion.aside>

      {/* MODAL DE CONFIRMACIÓN */}
      <StatusModal
        show={showConfirmModal}
        type="confirm"
        message="¿Estás seguro de que deseas cerrar tu sesión? Tendrás que ingresar tus credenciales nuevamente."
        onConfirm={handleConfirmLogout}
        onClose={() => setShowConfirmModal(false)}
        confirmText="Sí, salir ahora"
        cancelText="No, continuar trabajando"
      />
    </>
  );
};

export default Sidebar;
