import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { getNombreColegioFromToken, getLogoUrlFromToken } from '../../../utils/jwt';
import Sidebar from '../../Layout/Sidebar';
import { useAuth } from '../../../hooks/useAuth';

const Dashboard = () => {
  const { token } = useAuth();
  const nombre = getNombreColegioFromToken(token);
  
  const [logoUrl, setLogoUrl] = useState<string | null>(() => {
    return localStorage.getItem('logoUrl') || getLogoUrlFromToken(token);
  });

  useEffect(() => {
    const defaultLogo = getLogoUrlFromToken(token);
    if (defaultLogo && !localStorage.getItem('logoUrl')) {
      localStorage.setItem('logoUrl', defaultLogo);
      setLogoUrl(defaultLogo);
    }
  }, [token]);

  useEffect(() => {
    const handleLogoUpdate = (e: any) => {
      setLogoUrl(e.detail);
    };

    window.addEventListener('logoUpdate', handleLogoUpdate);
    return () => window.removeEventListener('logoUpdate', handleLogoUpdate);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar nombreColegio={nombre} logoUrl={logoUrl} />
      <main className="flex-1 flex flex-col">
      

        <section className="p-8 overflow-y-auto">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;