import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, User, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  nombreColegio: string | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ nombreColegio, onLogout }) => {
  // Clases para NavLink activo/inactivo
  const linkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
      isActive ? 'bg-[#1e3a8a] text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-[#1e3a8a]'
    }`;

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col sticky top-0">
      <div className="p-8 border-b border-slate-50 flex flex-col items-center">
        <div className="bg-[#1e3a8a] text-white rounded-2xl w-16 h-16 flex items-center justify-center text-2xl font-black mb-4">
          {nombreColegio?.charAt(0).toUpperCase() || 'S'}
        </div>
        <h2 className="text-sm font-black text-slate-800 text-center truncate w-full px-2">
          {nombreColegio || 'Institución'}
        </h2>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Administrador</span>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        <NavLink to="/dashboard" end className={linkClass}>
          <LayoutDashboard size={20} />
          <span className="text-sm">Dashboard</span>
        </NavLink>

        <NavLink to="/dashboard/perfil" className={linkClass}>
          <User size={20} />
          <span className="text-sm">Mi Perfil</span>
        </NavLink>

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all">
          <Settings size={20} />
          <span className="text-sm">Configuración</span>
        </button>
      </nav>

      <div className="p-4 mt-auto">
        <button 
          onClick={onLogout} 
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut size={20} />
          <span className="text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;