import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, ArrowLeft, KeyRound, Timer } from "lucide-react";
import InputField from "../../components/atoms/InputField";
import StatusModal from "../../components/organisms/StatusModal";
import Button from "../../components/atoms/Button";
import { resetPassword, forgotPassword } from "../../../data/services/auth/authService";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = (location.state as { email?: string })?.email || "";

  const [email] = useState(emailFromState);
  const [codigo, setCodigo] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [modal, setModal] = useState({ show: false, success: false, message: "" });

  // Timer countdown (15 min)
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cooldown for resend button
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (!emailFromState) {
      navigate("/forgot-password");
    }
  }, [emailFromState, navigate]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      await forgotPassword({ email });
      setSecondsLeft(15 * 60);
      setResendCooldown(60);
      setModal({
        show: true,
        success: true,
        message: "Código reenviado. Revisa tu correo.",
      });
    } catch {
      setModal({
        show: true,
        success: false,
        message: "No se pudo reenviar el código.",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (codigo.length !== 6) {
      setModal({ show: true, success: false, message: "El código debe tener 6 dígitos." });
      return;
    }
    if (nuevaPassword.length < 6) {
      setModal({ show: true, success: false, message: "La contraseña debe tener al menos 6 caracteres." });
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPassword({ email, codigo, nuevaPassword });

      setModal({
        show: true,
        success: res.success,
        message: res.message || (res.success ? "Contraseña restablecida exitosamente." : "Error al restablecer la contraseña."),
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
        {/* Header */}
        <div className="p-5 text-center bg-white border-b border-slate-100">
          <img src="/sicpie.png" alt="Logo SICPIE" className="h-20 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-slate-900 uppercase">
            Restablecer Contraseña
          </h1>
          <p className="text-xs text-slate-400 font-bold mt-2 uppercase tracking-widest">
            Ingresa el código enviado a tu correo
          </p>
        </div>

        {/* Timer */}
        <div className="flex items-center justify-center gap-2 py-3 bg-slate-50 border-b border-slate-100">
          <Timer size={16} className={secondsLeft > 0 ? "text-blue-500" : "text-red-500"} />
          <span className={`text-sm font-black tracking-wider ${secondsLeft > 0 ? "text-slate-700" : "text-red-500"}`}>
            {secondsLeft > 0 ? formatTime(secondsLeft) : "Código expirado"}
          </span>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Email readonly */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Correo</label>
            <div className="bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-500">
              {email}
            </div>
          </div>

          {/* Código de 6 dígitos */}
          <InputField
            label="Código de verificación"
            type="text"
            name="codigo"
            value={codigo}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 6);
              setCodigo(val);
            }}
            placeholder="000000"
            icon={KeyRound}
            required
            maxLength={6}
          />

          {/* Nueva contraseña */}
          <InputField
            label="Nueva Contraseña"
            type="password"
            name="nuevaPassword"
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            icon={Lock}
            showToggle
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            required
          />

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            loadingText="Restableciendo..."
            className="py-5"
            disabled={secondsLeft === 0}
          >
            Restablecer Contraseña
          </Button>

          {/* Reenviar código */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending || resendCooldown > 0}
              className="text-xs font-black text-[#1e3a8a] hover:text-emerald-600 transition-colors uppercase disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendCooldown > 0
                ? `Reenviar código (${resendCooldown}s)`
                : "Reenviar código"}
            </button>
          </div>
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
            navigate("/login");
          }
        }}
      />
    </div>
  );
};

export default ResetPasswordPage;
