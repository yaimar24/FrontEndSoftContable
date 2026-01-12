import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../components/pages/Dashboard";
import LoginForm from "../components/login/LoginForm";
import { RegisterForm } from "../components/register/RegisterForm";
import ProtectedRoute from "./ProtectedRoute"; // Importa el protector
import PerfilForm from "../components/dashboard/Perfil";

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
          <Route path="perfil" element={<PerfilForm />} />
        </Route>
      </Route>

      {/* REDIRECCIÓN GLOBAL */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  </Router>
);

export default AppRoutes;