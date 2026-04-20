import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import InputField from "../../../components/atoms/InputField";
import {
  getModulosDisponibles,
  editarUsuario,
} from "../../../../data/services/seguridad/seguridadService";
import type { ModuloPlan, UsuarioReadDTO } from "../../../../domain/models/Seguridad";

interface Props {
  usuario: UsuarioReadDTO;
  isSelf?: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EditarUsuarioModal: React.FC<Props> = ({ usuario, isSelf = false, onClose, onSuccess }) => {
  const [nombre, setNombre] = useState(usuario.nombre);
  const [email, setEmail] = useState(usuario.email);
  const [password, setPassword] = useState("");
  const [rolNombre, setRolNombre] = useState(usuario.rolNombre);
  const [modulosSeleccionados, setModulosSeleccionados] = useState<number[]>(usuario.modulosPermitidos);

  const [modulosDisponibles, setModulosDisponibles] = useState<ModuloPlan[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nombre.trim() || !email.trim()) {
      setError("Nombre y email son obligatorios.");
      return;
    }
    if (!isSelf && !rolNombre.trim()) {
      setError("El nombre del rol es obligatorio.");
      return;
    }
    if (!isSelf && modulosSeleccionados.length === 0) {
      setError("Debe seleccionar al menos un módulo.");
      return;
    }

    setSaving(true);
    try {
      const payload: Record<string, any> = {
        nombre: nombre.trim(),
        email: email.trim(),
      };
      if (password.trim()) {
        payload.password = password;
      }
      // Solo enviar rol/módulos si NO es edición propia
      if (!isSelf) {
        payload.rolNombre = rolNombre.trim();
        payload.modulosPermitidos = modulosSeleccionados;
      }

      const res = await editarUsuario(usuario.id, payload);
      if (res.success) {
        onSuccess();
      } else {
        setError(res.message || "Error al actualizar usuario.");
      }
    } catch (err: any) {
      setError(err.message || "Error inesperado.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-slate-800">{isSelf ? 'Editar Mi Perfil' : 'Editar Usuario'}</h2>
            {isSelf && (
              <p className="text-[11px] text-amber-600 font-semibold mt-0.5">No puede modificar sus propios roles ni módulos.</p>
            )}
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <InputField
            label="Nombre completo"
            name="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Juan Pérez"
          />
          <InputField
            label="Correo electrónico"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@correo.com"
          />
          <InputField
            label="Nueva contraseña (dejar vacío para no cambiar)"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Solo si desea cambiarla"
          />
          <InputField
            label="Nombre del Rol"
            name="rolNombre"
            value={rolNombre}
            onChange={(e) => setRolNombre(e.target.value)}
              placeholder="Ej: Auxiliar contabe, Finanzas"
            disabled={isSelf}
          />

          {/* Módulos checkboxes */}
          <div className={isSelf ? 'opacity-50 pointer-events-none' : ''}>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Módulos permitidos {isSelf && <span className="text-amber-500">(bloqueado)</span>}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {modulosDisponibles.map((mod) => (
                <label
                  key={mod.id}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all text-xs font-bold ${
                    modulosSeleccionados.includes(mod.id)
                      ? "bg-blue-50 border-blue-200 text-blue-700"
                      : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={modulosSeleccionados.includes(mod.id)}
                    onChange={() => toggleModulo(mod.id)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  {mod.nombre}
                </label>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-xs font-bold text-red-500 bg-red-50 px-3 py-2 rounded-xl">{error}</p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md shadow-blue-200 disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarUsuarioModal;
