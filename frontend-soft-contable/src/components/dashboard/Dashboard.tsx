import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard Protegido</h1>
      <p>¡Bienvenido! Solo usuarios autenticados pueden ver esto.</p>
      <button
        onClick={handleLogout}
        className="mt-6 px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Dashboard;
