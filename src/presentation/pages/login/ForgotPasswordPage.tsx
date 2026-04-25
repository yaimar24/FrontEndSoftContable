import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, Send } from "lucide-react";
import InputField from "../../components/atoms/InputField";
import StatusModal from "../../components/organisms/StatusModal";
import Button from "../../components/atoms/Button";
import { forgotPassword } from "../../../data/services/auth/authService";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, success: false, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await forgotPassword({ email });

      setModal({
        show: true,
        success: res.success,
        message: res.message || "recibirás un código de verificación.",
      });
    } catch (err) {
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
      <div className="bg-white rounded-2xl shadow-2xl border-t-[6px] border-[#1e3a8a] w-full max-w-md overflow-hidden">
        {/* Logo */}
        <div className="p-5 text-center bg-white border-b border-slate-100">
          <img src="/sicpie.png" alt="Logo SICPIE" className="h-20 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-slate-900 uppercase">
            Recuperar Contraseña
          </h1>
          <p className="text-xs text-slate-400 font-bold mt-2 uppercase tracking-widest">
            Ingresa tu correo para recibir un código de verificación
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <InputField
            label="Correo Electrónico"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@colegio.edu.co"
            icon={Mail}
            required
            autoComplete="email"
          />

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            loadingText="Enviando..."
            icon={Send}
            className="py-5"
          >
            Enviar Código
          </Button>
        </form>

        {/* Footer */}
        <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 text-center">
          <button
            onClick={() => navigate("/login")}
            className="inline-flex items-center gap-2 text-sm font-black text-[#1e3a8a] hover:text-emerald-600 transition-colors uppercase"
          >
            <ArrowLeft size={16} />
            Volver al Login
          </button>
        </div>
      </div>

      <StatusModal
        show={modal.show}
        success={modal.success}
        message={modal.message}
        onClose={() => {
          setModal((prev) => ({ ...prev, show: false }));
          if (modal.success) {
            navigate("/reset-password", { state: { email } });
          }
        }}
      />
    </div>
  );
};

export default ForgotPasswordPage;
