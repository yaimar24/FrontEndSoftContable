import React, { useState, useEffect } from "react";
import { Shield, UserPlus, Users, Edit2, Power } from "lucide-react";
import { Table } from "../../../components/organisms/Table";
import type { Column } from "../../../components/organisms/Table";
import PageHeader from "../../../components/organisms/PageHeader";
import SearchBar from "../../../components/molecules/SearchBar";
import StatusModal from "../../../components/organisms/StatusModal";
import { getUsuarios, toggleActivoUsuario } from "../../../../data/services/seguridad/seguridadService";
import type { UsuarioReadDTO } from "../../../../domain/models/Seguridad";
import { useFilter } from "../../../../application/hooks/useGenericFilter";
import CrearUsuarioModal from "./CrearUsuarioModal";
import EditarUsuarioModal from "./EditarUsuarioModal";

const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<UsuarioReadDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [editUsuario, setEditUsuario] = useState<UsuarioReadDTO | null>(null);
  const [confirmToggle, setConfirmToggle] = useState<UsuarioReadDTO | null>(null);
  const [resultModal, setResultModal] = useState({ show: false, success: false, message: "" });

  const { searchTerm, setSearchTerm, filteredData } = useFilter(usuarios, {
    searchFields: ["nombre", "email", "rolNombre"],
  });

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res = await getUsuarios();
      if (res.success && res.data) {
        setUsuarios(res.data);
      }
    } catch (err: any) {
      setResultModal({ show: true, success: false, message: err.message || "Error al cargar usuarios" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleUsuarioCreado = () => {
    setShowCrearModal(false);
    setResultModal({ show: true, success: true, message: "Usuario creado exitosamente." });
    fetchUsuarios();
  };

  const handleUsuarioEditado = () => {
    setEditUsuario(null);
    setResultModal({ show: true, success: true, message: "Usuario actualizado exitosamente." });
    fetchUsuarios();
  };

  const handleToggleActivo = async () => {
    if (!confirmToggle) return;
    try {
      const res = await toggleActivoUsuario(confirmToggle.id);
      if (res.success) {
        setResultModal({ show: true, success: true, message: `Usuario ${confirmToggle.activo ? 'deshabilitado' : 'habilitado'} exitosamente.` });
        fetchUsuarios();
      } else {
        setResultModal({ show: true, success: false, message: res.message || "Error al cambiar estado." });
      }
    } catch (err: any) {
      setResultModal({ show: true, success: false, message: err.message || "Error inesperado." });
    } finally {
      setConfirmToggle(null);
    }
  };

  const isProtectedRole = (u: UsuarioReadDTO) =>
    u.rolNombre === "Administrador" || u.rolNombre === "SuperAdmin";

  const columns: Column<UsuarioReadDTO>[] = [
    {
      header: "Usuario",
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${u.activo ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
            {u.nombre.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className={`font-bold text-sm ${u.activo ? 'text-slate-800' : 'text-slate-400 line-through'}`}>{u.nombre}</span>
            <span className="text-[10px] text-slate-400">{u.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Rol",
      render: (u) => (
        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
          {u.rolNombre}
        </span>
      ),
    },
    {
      header: "Módulos",
      render: (u) => (
        <span className="text-xs font-bold text-slate-500">
          {u.modulosPermitidos.length} módulos
        </span>
      ),
    },
    {
      header: "Estado",
      render: (u) => (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${u.activo ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-500 border border-red-100'}`}>
          {u.activo ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      header: "Acciones",
      render: (u) => (
        <div className="flex items-center gap-2">
          {!isProtectedRole(u) && (
            <>
              <button
                onClick={() => setEditUsuario(u)}
                className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                title="Editar usuario"
              >
                <Edit2 size={15} />
              </button>
              <button
                onClick={() => setConfirmToggle(u)}
                className={`p-2 rounded-lg transition-all ${u.activo ? 'text-slate-400 hover:text-red-600 hover:bg-red-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                title={u.activo ? "Deshabilitar" : "Habilitar"}
              >
                <Power size={15} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-5 space-y-5 max-w-[1600px] mx-auto">
      <PageHeader
        icon={Shield}
        title="Gestión de Usuarios"
        subtitle="Administra los usuarios y sus permisos de acceso"
      />

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Buscar usuario..." />
        <button
          onClick={() => setShowCrearModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
        >
          <UserPlus size={18} />
          Crear Usuario
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Users size={40} strokeWidth={1.5} />
            <p className="mt-3 font-bold text-sm">No se encontraron usuarios</p>
          </div>
        ) : (
          <Table columns={columns} data={filteredData} />
        )}
      </div>

      {/* Modal Crear Usuario */}
      {showCrearModal && (
        <CrearUsuarioModal
          onClose={() => setShowCrearModal(false)}
          onSuccess={handleUsuarioCreado}
        />
      )}

      {/* Modal Editar Usuario */}
      {editUsuario && (
        <EditarUsuarioModal
          usuario={editUsuario}
          onClose={() => setEditUsuario(null)}
          onSuccess={handleUsuarioEditado}
        />
      )}

      {/* Confirm Toggle */}
      <StatusModal
        show={!!confirmToggle}
        type="confirm"
        message={confirmToggle ? `¿Estás seguro de ${confirmToggle.activo ? 'deshabilitar' : 'habilitar'} a "${confirmToggle.nombre}"?${confirmToggle.activo ? ' No podrá iniciar sesión.' : ''}` : ''}
        onConfirm={handleToggleActivo}
        onClose={() => setConfirmToggle(null)}
        confirmText={confirmToggle?.activo ? "Sí, deshabilitar" : "Sí, habilitar"}
        cancelText="Cancelar"
      />

      {/* Result Modal */}
      <StatusModal
        show={resultModal.show}
        type={resultModal.success ? "success" : "error"}
        message={resultModal.message}
        onClose={() => setResultModal({ ...resultModal, show: false })}
      />
    </div>
  );
};

export default UsuariosPage;
