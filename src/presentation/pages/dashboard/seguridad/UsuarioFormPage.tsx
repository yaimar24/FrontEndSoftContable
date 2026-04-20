import React, { useState, useEffect } from "react";
import { Shield, Save, ArrowLeft, UserCircle, Lock, Key, Boxes } from "lucide-react";
import Button from "../../../components/atoms/Button";
import StatusModal from "../../../components/organisms/StatusModal";
import InputField from "../../../components/atoms/InputField";
import {
  getModulosDisponibles,
  crearUsuario,
  editarUsuario,
} from "../../../../data/services/seguridad/seguridadService";
import type { ModuloPlan, UsuarioReadDTO } from "../../../../domain/models/Seguridad";

interface Props {
  initialData?: UsuarioReadDTO | null;
  isSelf?: boolean;
  onBack: () => void;
}

const UsuarioFormPage: React.FC<Props> = ({ initialData, isSelf = false, onBack }) => {
  const isEditing = !!initialData;

  const [nombre, setNombre] = useState(initialData?.nombre || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [password, setPassword] = useState("");
  const [rolNombre, setRolNombre] = useState(initialData?.rolNombre || "");
  const [rolDescripcion, setRolDescripcion] = useState("");
  const [modulosSeleccionados, setModulosSeleccionados] = useState<number[]>(
    initialData?.modulosPermitidos || []
  );

  const [modulosDisponibles, setModulosDisponibles] = useState<ModuloPlan[]>([]);
  const [saving, setSaving] = useState(false);
  const [_error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [resultModal, setResultModal] = useState({ show: false, success: false, message: "" });

  useEffect(() => {
    const load = async () => {
      const res = await getModulosDisponibles();
      if (res.success && res.data) setModulosDisponibles(res.data);
    };
    load();
  }, []);

  const toggleModulo = (id: number) => {
    setModulosSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const validate = (): string | null => {
    if (!nombre.trim() || !email.trim()) return "Nombre y email son obligatorios.";
    if (!isEditing && !password.trim()) return "La contraseña es obligatoria.";
    if (!isSelf && !rolNombre.trim()) return "El nombre del rol es obligatorio.";
    if (!isSelf && modulosSeleccionados.length === 0) return "Debe seleccionar al menos un módulo.";
    return null;
  };

  const handleSaveClick = () => {
    const err = validate();
    if (err) {
      setResultModal({ show: true, success: false, message: err });
      return;
    }
    setError("");
    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirm(false);
    setSaving(true);
    try {
      if (isEditing && initialData) {
        const payload: Record<string, unknown> = {
          nombre: nombre.trim(),
          email: email.trim(),
        };
        if (password.trim()) payload.password = password;
        if (!isSelf) {
          payload.rolNombre = rolNombre.trim();
          payload.modulosPermitidos = modulosSeleccionados;
        }
        const res = await editarUsuario(initialData.id, payload);
        if (res.success) {
          setResultModal({ show: true, success: true, message: "Usuario actualizado exitosamente." });
        } else {
          setResultModal({ show: true, success: false, message: res.message || "Error al actualizar usuario." });
        }
      } else {
        const res = await crearUsuario({
          nombre: nombre.trim(),
          email: email.trim(),
          password,
          rolNombre: rolNombre.trim(),
          rolDescripcion: rolDescripcion.trim() || undefined,
          modulosPermitidos: modulosSeleccionados,
        });
        if (res.success) {
          setResultModal({ show: true, success: true, message: "Usuario creado exitosamente." });
        } else {
          setResultModal({ show: true, success: false, message: res.message || "Error al crear usuario." });
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error inesperado.";
      setResultModal({ show: true, success: false, message: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 pb-20 px-4 animate-in fade-in duration-500">
      <StatusModal
        show={showConfirm}
        type="confirm"
        onConfirm={handleConfirmSave}
        onClose={() => setShowConfirm(false)}
        message={isEditing ? "¿Actualizar este usuario?" : "¿Crear este nuevo usuario?"}
      />

      <StatusModal
        show={resultModal.show}
        success={resultModal.success}
        message={resultModal.message}
        onClose={() => {
          setResultModal((m) => ({ ...m, show: false }));
          if (resultModal.success) onBack();
        }}
      />

      {/* Sticky Header */}
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm sticky top-4 z-20 border border-slate-100">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
            <ArrowLeft size={20} className="text-slate-500" />
          </button>
          <div>
            <h1 className="text-lg font-black text-slate-800 uppercase flex items-center gap-2 tracking-tight">
              <Shield size={22} className="text-blue-600" />
              {isEditing ? (isSelf ? "Editar Mi Perfil" : "Editar Usuario") : "Nuevo Usuario"}
            </h1>
            {isSelf && (
              <p className="text-[11px] text-amber-600 font-semibold mt-0.5 pl-[30px]">
                No puede modificar sus propios roles ni módulos.
              </p>
            )}
          </div>
        </div>
        <Button onClick={handleSaveClick} icon={Save} isLoading={saving} loadingText="Guardando...">
          {isEditing ? "Actualizar" : "Guardar"}
        </Button>
      </div>

      {/* Form Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Credenciales */}
        <div className="space-y-5">
          <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex flex-col gap-1 pb-3 mb-4 border-b border-slate-50">
              <h3 className="font-black text-slate-700 flex items-center gap-2 text-xs uppercase tracking-widest">
                <UserCircle size={16} className="text-blue-500" /> Información Personal
              </h3>
            </div>
            <div className="space-y-4">
              <InputField
                label="Nombre completo"
                name="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Juan Pérez"
                icon={UserCircle}
                required
              />
              <InputField
                label="Correo electrónico"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@correo.com"
                required
              />
              <InputField
                label={isEditing ? "Nueva contraseña (dejar vacío para no cambiar)" : "Contraseña"}
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isEditing ? "Solo si desea cambiarla" : "Mínimo 6 caracteres"}
                icon={Lock}
                required={!isEditing}
              />
            </div>
          </section>
        </div>

        {/* Right Column: Rol + Módulos */}
        <div className="lg:col-span-2 space-y-5">
          <section className={`bg-white p-6 rounded-2xl border border-slate-100 shadow-sm ${isSelf ? "opacity-60" : ""}`}>
            <div className="flex flex-col gap-1 pb-3 mb-4 border-b border-slate-50">
              <h3 className="font-black text-slate-700 flex items-center gap-2 text-xs uppercase tracking-widest">
                <Key size={16} className="text-indigo-500" /> Rol y Permisos
                {isSelf && <span className="text-amber-500 text-[10px] normal-case font-semibold">(bloqueado para edición propia)</span>}
              </h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Nombre del Rol"
                  name="rolNombre"
                  value={rolNombre}
                  onChange={(e) => setRolNombre(e.target.value)}
                  placeholder="Ej: Auxiliar contable, Finanzas"
                  icon={Key}
                  disabled={isSelf}
                  required={!isSelf}
                />
                {!isEditing && (
                  <InputField
                    label="Descripción del rol (opcional)"
                    name="rolDescripcion"
                    value={rolDescripcion}
                    onChange={(e) => setRolDescripcion(e.target.value)}
                    placeholder="Ej: Acceso limitado a ventas"
                  />
                )}
              </div>
            </div>
          </section>

          <section className={`bg-white p-6 rounded-2xl border border-slate-100 shadow-sm ${isSelf ? "opacity-60 pointer-events-none" : ""}`}>
            <div className="flex flex-col gap-1 pb-3 mb-4 border-b border-slate-50">
              <h3 className="font-black text-slate-700 flex items-center gap-2 text-xs uppercase tracking-widest">
                <Boxes size={16} className="text-emerald-500" /> Módulos Permitidos
                {isSelf && <span className="text-amber-500 text-[10px] normal-case font-semibold">(bloqueado)</span>}
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {modulosDisponibles.map((mod) => (
                <label
                  key={mod.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all text-xs font-bold ${
                    modulosSeleccionados.includes(mod.id)
                      ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                      : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={modulosSeleccionados.includes(mod.id)}
                    onChange={() => toggleModulo(mod.id)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    disabled={isSelf}
                  />
                  {mod.nombre}
                </label>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UsuarioFormPage;
