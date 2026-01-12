import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Verificamos si existe el token en el storage
  const isAuthenticated = !!localStorage.getItem('token');

  if (!isAuthenticated) {
    // Redirigir al login si no está autenticado
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderiza las rutas hijas (el Dashboard)
  return <Outlet />;
};

export default ProtectedRoute;