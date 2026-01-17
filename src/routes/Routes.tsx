import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../components/pages/dashboard/Dashboard";
import LoginForm from "../components/pages/login/LoginForm";
import ProtectedRoute from "./ProtectedRoute"; // Importa el protector
import PerfilForm from "../components/pages/dashboard/perfil/PerfilPage";
import PucPage from "../components/pages/dashboard/puc/PucPage";
import TercerosPage from "../components/pages/dashboard/terceros/TercerosPage";
import { RegisterForm } from "../components/pages/register/RegisterForm";

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
          <Route index element={
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <h2 className="text-2xl font-black uppercase tracking-widest">Bienvenido</h2>
              <p className="text-sm font-bold">Selecciona una opción en el menú lateral</p>
            </div>
          } />
          <Route path="puc" element={<PucPage />} />
          <Route path="perfil" element={<PerfilForm />} />
          <Route path="terceros" element={<TercerosPage />} />
        </Route>
      </Route>

      {/* REDIRECCIÓN GLOBAL */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  </Router>
);

export default AppRoutes;