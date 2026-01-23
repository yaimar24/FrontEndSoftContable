import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ArrowRight } from "lucide-react";
import InputField from "../../common/InputField";
import StatusModal from "../../common/StatusModal";
import { login as loginApi } from "../../../services/auth/authService";
import type { LoginRequest, LoginResponse } from "../../../models/Auth";
import { useAuth } from "../../../hooks/useAuth";
import Button from "../../common/Button";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({
    show: false,
    success: false,
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload: LoginRequest = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const res: LoginResponse = await loginApi(payload);

      if (res.success && res.data?.token && res.data.expiration) {
        // Guardamos token en el AuthContext
        authLogin(res.data.token, res.data.expiration);

        setModal({
          show: true,
          success: true,
          message: "¡Login exitoso! Redirigiendo al panel...",
        });

        // Redirigir al dashboard después de 1.5s para mostrar modal
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        // Error del backend (email/contraseña incorrectos)
        setModal({
          show: true,
          success: false,
          message: res.message || "Error desconocido en login",
        });
      }
    } catch (err) {
      console.error(err);
      setModal({
        show: true,
        success: false,
        message: (err as Error).message || "Error de conexión al servidor",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans p-4">
      <div className="bg-white rounded-3xl shadow-2xl border-t-[6px] border-[#1e3a8a] w-full max-w-md overflow-hidden">
        {/* Logo */}
        <div className="p-8 text-center bg-white border-b border-slate-100">
          <img
            src="/sicpie.png"
            alt="Logo SICPIE"
            className="h-20 mx-auto mb-4"
          />
          <h1 className="text-2xl font-black text-slate-900 uppercase">
            Iniciar Sesión SICPIE
          </h1>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <InputField
            label="Correo Electrónico"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ejemplo@colegio.edu.co"
            icon={Mail}
            required
          />

          <InputField
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            icon={Lock}
            required
          />

          {/* Botón Login */}
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading} 
            className="py-5" 
          >
            Entrar al Sistema
            <ArrowRight size={16} />
          </Button>

        </form>

        {/* Footer */}
        <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 text-center space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            ¿No tienes cuenta?
          </p>
          <button
            onClick={() => navigate("/register")}
            className="text-sm font-black text-[#1e3a8a] hover:text-emerald-600 transition-colors uppercase"
          >
            Regístrate ahora
          </button>
        </div>
      </div>

      {/* Modal de estado */}
      <StatusModal
        show={modal.show}
        success={modal.success}
        message={modal.message}
        onClose={() => setModal((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default LoginForm;
