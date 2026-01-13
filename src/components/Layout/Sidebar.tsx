import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, User, LogOut, 
  ChevronLeft, ChevronRight, GraduationCap 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';
import AuthContext from '../../context/AuthContext'; 
import StatusModal from '../common/StatusModal';

interface SidebarProps {
  nombreColegio: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ nombreColegio }) => {
  // isCollapsed controla el estado visual (ancho)
  const [isCollapsed, setIsCollapsed] = useState(false);
  // isManuallyClosed rastrea si el usuario usó el botón para cerrarlo
  const [isManuallyClosed, setIsManuallyClosed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  // --- LÓGICA DE EXPANSIÓN POR HOVER ---
  
  const handleMouseEnter = () => {
    // Si estaba colapsado (ya sea manual o por defecto), lo abrimos al entrar
    if (isCollapsed) {
      setIsCollapsed(false);
    }
  };

  const handleMouseLeave = () => {
    // Si el usuario lo había cerrado manualmente, lo volvemos a colapsar al salir
    if (isManuallyClosed) {
      setIsCollapsed(true);
    }
  };

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    setIsManuallyClosed(newState); // Registramos que el usuario tomó acción manual
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
      navigate('/login', { replace: true });
    }, 800);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 px-3 py-3 rounded-2xl font-bold transition-all relative group ${
      isActive 
        ? 'bg-blue-50 text-[#1e3a8a]' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
    }`;

  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: LayoutDashboard },
    { path: "/dashboard/perfil", name: "Perfil", icon: User },
  ];

  return (
    <>
      <motion.aside 
        initial={false}
        animate={{ 
          width: isCollapsed ? 85 : 280,
          transition: { type: 'spring', stiffness: 300, damping: 30 } 
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="h-screen bg-white border-r border-slate-100 flex flex-col sticky top-0 z-30 shadow-sm"
      >
        {/* BOTÓN COLAPSAR (MANUAL) */}
        <button 
          onClick={toggleCollapse}
          className="absolute -right-3 top-12 bg-white border border-slate-100 rounded-full p-1.5 shadow-md hover:scale-110 transition-transform text-slate-400 hover:text-blue-600 z-50"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* HEADER: LOGO */}
        <div className="p-6 flex flex-col items-center">
          <motion.div 
            layout
            className="bg-gradient-to-br from-[#1e3a8a] to-blue-600 text-white rounded-[1.5rem] flex items-center justify-center text-2xl font-black shadow-xl shadow-blue-100"
            style={{ width: isCollapsed ? 45 : 64, height: isCollapsed ? 45 : 64 }}
          >
            {nombreColegio?.charAt(0).toUpperCase() || <GraduationCap size={isCollapsed ? 20 : 32} />}
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
                  {nombreColegio || 'Institución'}
                </h2>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">En línea</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* NAVEGACIÓN */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.path === "/dashboard"} className={linkClass}>
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

        {/* FOOTER: BOTÓN DE LOGOUT */}
        <div className="p-4 border-t border-slate-50">
          <Button
            variant="danger"
            fullWidth
            isLoading={isLoggingOut}
            loadingText={isCollapsed ? "" : "Saliendo..."}
            icon={LogOut}
            onClick={handleLogoutIntent}
            className={isCollapsed ? "px-0 justify-center h-12" : "h-12"}
          >
            {!isCollapsed && "Finalizar sesión"}
          </Button>
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