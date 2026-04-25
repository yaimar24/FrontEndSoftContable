import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { ErrorBoundary } from "../components/shared/ErrorBoundary";
import LoadingOverlay from "../components/shared/LoadingOverlay";

// Layout (no lazy - siempre necesario)
import Dashboard from "@/presentation/pages/dashboard/Dashboard";

// Lazy-loaded pages
const LoginForm = lazy(() => import("@/presentation/pages/login/LoginForm"));
const ForgotPasswordPage = lazy(() => import("@/presentation/pages/login/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("@/presentation/pages/login/ResetPasswordPage"));
const RegisterForm = lazy(() => import("@/presentation/pages/register/RegisterForm").then(m => ({ default: m.RegisterForm })));
const DashboardHome = lazy(() => import("@/presentation/pages/dashboard/DashboardHome"));
const PerfilForm = lazy(() => import("@/presentation/pages/dashboard/perfil/PerfilPage"));
const PucPage = lazy(() => import("@/presentation/pages/dashboard/puc/PucPage"));
const TercerosPage = lazy(() => import("@/presentation/pages/dashboard/terceros/TercerosPage"));
const VentasPage = lazy(() => import("@/presentation/pages/dashboard/ventas/VentasPage"));
const VentasViewerPage = lazy(() => import("@/presentation/pages/dashboard/ventas/VentasViewerPage"));
const InvoicePrintPage = lazy(() => import("@/presentation/pages/dashboard/ventas/InvoicePrintPage"));
const RecibosList = lazy(() => import("@/presentation/pages/dashboard/ventas/recibos/RecibosList"));
const ReciboCajaViewer = lazy(() => import("@/presentation/pages/dashboard/ventas/recibos/ReciboCajaViewer"));
const ProductosPage = lazy(() => import("@/presentation/pages/dashboard/producto/ProductosPage"));
const ComprasPage = lazy(() => import("@/presentation/pages/dashboard/compras/ComprasPage"));
const EgresosList = lazy(() => import("@/presentation/pages/dashboard/compras/egresos/EgresosList"));
const EgresoViewer = lazy(() => import("@/presentation/pages/dashboard/compras/egresos/EgresoViewer"));
const ComprasViewerPage = lazy(() => import("@/presentation/pages/dashboard/compras/ComprasViewerPage"));
const CompraPrintPage = lazy(() => import("@/presentation/pages/dashboard/compras/CompraPrintPage"));
const ContabilidadPage = lazy(() => import("@/presentation/pages/contabilidad/ContabilidadPage").then(m => ({ default: m.ContabilidadPage })));
const ContabilidadDetailPage = lazy(() => import("@/presentation/pages/contabilidad/ContabilidadDetailPage").then(m => ({ default: m.ContabilidadDetailPage })));
const ContabilidadNuevoPage = lazy(() => import("@/presentation/pages/contabilidad/ContabilidadNuevoPage").then(m => ({ default: m.ContabilidadNuevoPage })));
const ContabilidadConfiguracionPage = lazy(() => import("@/presentation/pages/contabilidad/ContabilidadConfiguracionPage").then(m => ({ default: m.ContabilidadConfiguracionPage })));
const ContabilidadLibroAuxiliarPage = lazy(() => import("@/presentation/pages/contabilidad/ContabilidadLibroAuxiliarPage").then(m => ({ default: m.ContabilidadLibroAuxiliarPage })));
const SeguridadPage = lazy(() => import("@/presentation/pages/dashboard/seguridad/SeguridadPage"));
const CarteraPage = lazy(() => import("@/presentation/pages/dashboard/cartera/CarteraPage"));
const NotasPage = lazy(() => import("@/presentation/pages/dashboard/notas/NotasPage"));
const NotaViewerPage = lazy(() => import("@/presentation/pages/dashboard/notas/NotaViewerPage"));

const AppRoutes = () => (
  <Router>
    <ErrorBoundary>
      <Suspense fallback={<LoadingOverlay message="Cargando..." />}>
        <Routes>
          {/* RUTAS PÚBLICAS */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* RUTAS PROTEGIDAS */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<DashboardHome />} />
              <Route path="puc" element={<PucPage />} />
              <Route path="perfil" element={<PerfilForm />} />
              <Route path="terceros" element={<TercerosPage />} />
              <Route path="ventas" element={<VentasPage />} />
              <Route path="ventas/recibos" element={<RecibosList />} />
              <Route path="ventas/recibos/ver/:id" element={<ReciboCajaViewer />} />
              <Route path="ventas/:id" element={<VentasViewerPage />} />
              <Route path="factura-compra" element={<ComprasPage />} />
              <Route path="factura-compra/egresos" element={<EgresosList />} />
              <Route path="factura-compra/:id" element={<ComprasViewerPage />} />
              <Route path="productos" element={<ProductosPage />} />
              <Route path="factura-compra/egresos/:id" element={<EgresoViewer />} />
              <Route path="asientos-contables" element={<ContabilidadPage />} />
              <Route path="asientos-contables/nuevo" element={<ContabilidadNuevoPage />} />
              <Route path="asientos-contables/configuracion" element={<ContabilidadConfiguracionPage />} />
              <Route path="asientos-contables/libro-auxiliar" element={<ContabilidadLibroAuxiliarPage />} />
              <Route path="asientos-contables/:id" element={<ContabilidadDetailPage />} />
              <Route path="seguridad" element={<SeguridadPage />} />
              <Route path="cartera" element={<CarteraPage />} />
              <Route path="notas" element={<NotasPage />} />
              <Route path="notas/:id" element={<NotaViewerPage />} />
            </Route>
            <Route path="/invoice/:id" element={<InvoicePrintPage />} />
            <Route path="/purchase-invoice/:id" element={<CompraPrintPage />} />
          </Route>

          {/* REDIRECCIÓN GLOBAL */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  </Router>
);

export default AppRoutes;

