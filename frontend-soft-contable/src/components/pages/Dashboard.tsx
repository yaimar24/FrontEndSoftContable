import { Outlet } from 'react-router-dom';
import { getEmailFromToken } from '../../utils/jwt';
import { PanelLeft } from 'lucide-react'; // Si usas este icono
import Sidebar from '../Layout/Sidebar';
import { useAuth } from '../../hooks/useAuth';

const Dashboard = () => {
  const { token, logout } = useAuth();
  const nombre = getEmailFromToken(token);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar nombreColegio={nombre} onLogout={logout} />
      
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
    
            <PanelLeft size={20} /> 
            <span className="text-xs font-bold uppercase tracking-widest">Panel de Control</span>
          </div>
        </header>

        <section className="p-8 overflow-y-auto">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;