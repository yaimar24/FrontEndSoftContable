import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "@/presentation/pages/dashboard/Dashboard";
import LoginForm from "@/presentation/pages/login/LoginForm";
import ProtectedRoute from "./ProtectedRoute"; // Importa el protector
import PerfilForm from "@/presentation/pages/dashboard/perfil/PerfilPage";
import PucPage from "@/presentation/pages/dashboard/puc/PucPage";
import { RegisterForm } from "@/presentation/pages/register/RegisterForm";
import TercerosPage from "@/presentation/pages/dashboard/terceros/TercerosPage";
import VentasPage from "@/presentation/pages/dashboard/ventas/VentasPage";
import VentasViewerPage from "@/presentation/pages/dashboard/ventas/VentasViewerPage";
import InvoicePrintPage from "@/presentation/pages/dashboard/ventas/InvoicePrintPage";
import RecibosList from "@/presentation/pages/dashboard/ventas/recibos/RecibosList";
import ReciboCajaViewer from "@/presentation/pages/dashboard/ventas/recibos/ReciboCajaViewer";
import ProductosPage from "@/presentation/pages/dashboard/producto/ProductosPage";
import DashboardHome from "@/presentation/pages/dashboard/DashboardHome";
import ComprasPage from "@/presentation/pages/dashboard/compras/ComprasPage";
import ComprasViewerPage from "@/presentation/pages/dashboard/compras/ComprasViewerPage";
import CompraPrintPage from "@/presentation/pages/dashboard/compras/CompraPrintPage";
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
