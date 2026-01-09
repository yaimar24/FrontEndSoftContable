import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../components/pages/Dashboard";
import LoginForm from "../components/login/LoginForm";
import { RegisterForm } from "../components/register/RegisterForm";
import PerfilForm from "../components/dashboard/perfil"; // Importa el index.tsx del perfil

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      
      {/* RUTAS DEL DASHBOARD ANIDADAS */}
      <Route path="/dashboard" element={<Dashboard />}>
        {/* Contenido por defecto en /dashboard */}
        <Route index element={
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <h2 className="text-2xl font-black uppercase tracking-widest">Bienvenido</h2>
            <p className="text-sm font-bold">Selecciona una opción en el menú lateral</p>
          </div>
        } />
        
        {/* Contenido en /dashboard/perfil */}
        <Route path="perfil" element={<PerfilForm />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  </Router>
);

export default AppRoutes;