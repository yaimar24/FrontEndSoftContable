import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../components/pages/dashboard/Dashboard";
import LoginForm from "../components/pages/login/LoginForm";
import ProtectedRoute from "./ProtectedRoute"; // Importa el protector
import PerfilForm from "../components/pages/dashboard/perfil/PerfilPage";
import PucPage from "../components/pages/dashboard/puc/PucPage";
import { RegisterForm } from "../components/pages/register/RegisterForm";
import TercerosPage from "../components/pages/dashboard/terceros/TercerosPage";
import VentasPage from "../components/pages/dashboard/ventas/VentasPage";
import VentasViewerPage from "../components/pages/dashboard/ventas/VentasViewerPage";
import RecibosList from "../components/pages/dashboard/ventas/recibos/RecibosList";
import ReciboCajaViewer from "../components/pages/dashboard/ventas/recibos/ReciboCajaViewer";
import ProductosPage from "../components/pages/dashboard/producto/ProductosPage";
import DashboardHome from "../components/pages/dashboard/DashboardHome";

const AppRoutes = () => (
  <Router>
    <Routes>
      {/* RUTAS PÚBLICAS */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />

      {/* RUTAS PROTEGIDAS */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />}>
          {/* Contenido por defecto */}
          <Route index element={<DashboardHome />} />
          <Route path="puc" element={<PucPage />} />
          <Route path="perfil" element={<PerfilForm />} />
          <Route path="terceros" element={<TercerosPage />} />
          <Route path="ventas" element={<VentasPage />} />
          <Route path="ventas/recibos" element={<RecibosList />} />
          <Route path="ventas/recibos/:id" element={<ReciboCajaViewer />} />
          <Route path="ventas/:id" element={<VentasViewerPage />} />
          <Route path="ventas/:id" element={<VentasViewerPage />} />
          <Route path="productos" element={<ProductosPage />} />
        </Route>
        {/* RUTA DE SOLO IMPRESIÓN EXTERNA AL LAYOUT DEL DASHBOARD */}
        
      </Route>

      {/* REDIRECCIÓN GLOBAL */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  </Router>
);

export default AppRoutes;
