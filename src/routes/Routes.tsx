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
import InvoicePrintPage from "../components/pages/dashboard/ventas/InvoicePrintPage";
import RecibosList from "../components/pages/dashboard/ventas/recibos/RecibosList";
import ReciboCajaViewer from "../components/pages/dashboard/ventas/recibos/ReciboCajaViewer";
import ProductosPage from "../components/pages/dashboard/producto/ProductosPage";
import DashboardHome from "../components/pages/dashboard/DashboardHome";
import ComprasPage from "../components/pages/dashboard/compras/ComprasPage";
import ComprasViewerPage from "../components/pages/dashboard/compras/ComprasViewerPage";
import CompraPrintPage from "../components/pages/dashboard/compras/CompraPrintPage";
const AppRoutes = () => (
  <Router>
    <Routes>
      {/* RUTAS P�BLICAS */}
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
          <Route path="ventas/:id" element={<VentasViewerPage />} />          <Route path="factura-compra" element={<ComprasPage />} />
          <Route path="factura-compra/:id" element={<ComprasViewerPage />} />          <Route path="productos" element={<ProductosPage />} />
        </Route>
        {/* RUTA DE SOLO IMPRESI�N EXTERNA AL LAYOUT DEL DASHBOARD */}
        <Route path="/invoice/:id" element={<InvoicePrintPage />} />
        <Route path="/purchase-invoice/:id" element={<CompraPrintPage />} />      </Route>
      {/* REDIRECCI�N GLOBAL */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  </Router>
);

export default AppRoutes;
