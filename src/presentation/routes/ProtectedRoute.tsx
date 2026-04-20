import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getModulosFromToken, getRoleFromToken } from '../../utils/jwt';
import { getModuloIdForPath, getFirstAllowedRoute } from '../../domain/models/Seguridad';
import { usePerfil } from '../../application/context/PerfilContext';

const ProtectedRoute = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  // Hooks siempre se llaman en el mismo orden (regla de React)
  const { modulos: perfilModulos, isAdmin: perfilIsAdmin, loading } = usePerfil();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Permisos frescos del contexto con fallback al JWT mientras carga
  const jwtModulos = getModulosFromToken(token);
  const jwtRole = getRoleFromToken(token);
  const jwtIsAdmin = jwtRole === 'Administrador';

  const modulos = loading ? jwtModulos : perfilModulos;
  const isAdmin = loading ? jwtIsAdmin : perfilIsAdmin;

  const requiredModulo = getModuloIdForPath(location.pathname);

  if (requiredModulo && !isAdmin && !modulos.includes(requiredModulo)) {
    const fallback = getFirstAllowedRoute(modulos);
    if (fallback === location.pathname) {
      return <Navigate to="/login" replace />;
    }
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
