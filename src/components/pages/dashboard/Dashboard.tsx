import { Outlet } from 'react-router-dom';
import { getEmailFromToken } from '../../../utils/jwt';
import Sidebar from '../../Layout/Sidebar';
import { useAuth } from '../../../hooks/useAuth';

const Dashboard = () => {
  const { token } = useAuth();
  const nombre = getEmailFromToken(token);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar nombreColegio={nombre}  />
      
      <main className="flex-1 flex flex-col">
      

        <section className="p-8 overflow-y-auto">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;