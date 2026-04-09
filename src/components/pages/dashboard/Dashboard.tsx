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
    <div className="flex min-h-screen bg-slate-50 print:bg-white print:!block">
      <div className="print:hidden">
        <Sidebar nombreColegio={nombre} logoUrl={logoUrl} />
      </div>
      <main className="flex-1 flex flex-col print:!block print:overflow-visible print:p-0 print:m-0">
      

        <section className="p-8 overflow-y-auto print:p-0 print:overflow-visible print:m-0">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
