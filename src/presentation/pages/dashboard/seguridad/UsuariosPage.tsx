import React, { useState, useEffect } from "react";
import { Shield, UserPlus, Users, Edit2, Power } from "lucide-react";
import { Table } from "../../../components/organisms/Table";
import type { Column } from "../../../components/organisms/Table";
import PageHeader from "../../../components/organisms/PageHeader";
import SearchBar from "../../../components/molecules/SearchBar";
import StatusModal from "../../../components/organisms/StatusModal";
import LoadingOverlay from "../../../components/shared/LoadingOverlay";
import { getUsuarios, toggleActivoUsuario } from "../../../../data/services/seguridad/seguridadService";
import type { UsuarioReadDTO } from "../../../../domain/models/Seguridad";
import { useFilter } from "../../../../application/hooks/useGenericFilter";
import { usePerfil } from "../../../../application/context/PerfilContext";
import { useTutorial } from "../../../../application/context/TutorialContext";
import UsuarioFormPage from "./UsuarioFormPage";

const UsuariosPage: React.FC = () => {
  const { perfil } = usePerfil();
  const { setSteps } = useTutorial();
  const [view, setView] = useState<"lista" | "formulario">("lista");
  const [selectedUsuario, setSelectedUsuario] = useState<UsuarioReadDTO | null>(null);
  const [usuarios, setUsuarios] = useState<UsuarioReadDTO[]>([]);
  const [loading, setLoading] = useState(true);
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al cargar usuarios";
      setResultModal({ show: true, success: false, message: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === "lista") {
      fetchUsuarios();
      setSteps([
        {
          target: '.tuto-header-seguridad',
          content: 'Este es el módulo de Seguridad. Aquí gestionas los usuarios, roles y permisos de acceso al sistema.',
        },
        {
          target: '.tuto-btn-seguridad-lista',
          content: 'Consulta la lista completa de usuarios registrados en el sistema.',
        },
        {
          target: '.tuto-btn-seguridad-nuevo',
          content: 'Crea un nuevo usuario y asígnale un rol con permisos específicos.',
        },
        {
          target: '.tuto-seguridad-search',
          content: 'Busca usuarios por nombre, correo electrónico o rol asignado.',
        },
        {
          target: '.tuto-seguridad-table',
          content: 'Tabla de usuarios con acciones: editar datos o habilitar/deshabilitar acceso.',
        },
      ]);
    } else {
      setSteps([
        {
          target: '.tuto-header-seguridad',
          content: 'Formulario de usuario. Aquí puedes crear o editar la información de un usuario.',
        },
      ]);
    }
  }, [view, setSteps]);

  const handleEdit = (u: UsuarioReadDTO) => {
    setSelectedUsuario(u);
    setView("formulario");
  };

  const handleBackToList = () => {
    setView("lista");
    setSelectedUsuario(null);
  };

  const handleToggleActivo = async () => {
    if (!confirmToggle) return;
    try {
      const res = await toggleActivoUsuario(confirmToggle.id);
      if (res.success) {
        setResultModal({ show: true, success: true, message: `Usuario ${confirmToggle.activo ? "deshabilitado" : "habilitado"} exitosamente.` });
        fetchUsuarios();
      } else {
        setResultModal({ show: true, success: false, message: res.message || "Error al cambiar estado." });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error inesperado.";
      setResultModal({ show: true, success: false, message: msg });
    } finally {
      setConfirmToggle(null);
    }
  };

  const isSelf = (u: UsuarioReadDTO) => perfil?.id === u.id;
  const isOtherAdmin = (u: UsuarioReadDTO) =>
    !isSelf(u) && (u.rolNombre === "Administrador" || u.rolNombre === "SuperAdmin");

  const columns: Column<UsuarioReadDTO>[] = [
    {
      header: "Usuario",
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${u.activo ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-400"}`}>
            {u.nombre.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className={`font-bold text-sm ${u.activo ? "text-slate-800" : "text-slate-400 line-through"}`}>{u.nombre}</span>
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
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${u.activo ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-500 border border-red-100"}`}>
          {u.activo ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      header: "Acciones",
      render: (u) => {
        const self = isSelf(u);
        const otherAdmin = isOtherAdmin(u);
        if (otherAdmin) return <div />;
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleEdit(u)}
              className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
              title={self ? "Editar mi perfil" : "Editar usuario"}
            >
              <Edit2 size={15} />
            </button>
            {!self && (
              <button
                onClick={() => setConfirmToggle(u)}
                className={`p-2 rounded-lg transition-all ${u.activo ? "text-slate-400 hover:text-red-600 hover:bg-red-50" : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"}`}
                title={u.activo ? "Deshabilitar" : "Habilitar"}
              >
                <Power size={15} />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-5 space-y-5 max-w-[1600px] mx-auto">
      {loading && view === "lista" && <LoadingOverlay message="Sincronizando usuarios..." />}

      <div className="tuto-header-seguridad">
      <PageHeader
        icon={Shield}
        title="Gestión de Usuarios"
        subtitle={view === "lista" && !loading ? `${usuarios.length} Usuarios registrados` : undefined}
        switcher={
          <>
            <button
              onClick={handleBackToList}
              className={`tuto-btn-seguridad-lista flex items-center gap-2 px-6 py-2.5 rounded-[1.1rem] text-[10px] font-black uppercase tracking-widest transition-all
                ${view === "lista" ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-400 hover:text-slate-600"}`}
            >
              <Users size={14} /> Lista de Usuarios
            </button>
            <button
              onClick={() => { setSelectedUsuario(null); setView("formulario"); }}
              className={`tuto-btn-seguridad-nuevo flex items-center gap-2 px-6 py-2.5 rounded-[1.1rem] text-[10px] font-black uppercase tracking-widest transition-all
                ${view === "formulario" && !selectedUsuario ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-400 hover:text-slate-600"}`}
            >
              <UserPlus size={14} /> Nuevo Usuario
            </button>
          </>
        }
      />
      </div>

      <main className="animate-in fade-in slide-in-from-bottom-3 duration-700">
        {view === "lista" ? (
          <>
            {/* Search Bar */}
            <div className="tuto-seguridad-search flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar usuario..." />
            </div>

            {/* Table */}
            <div className="tuto-seguridad-table bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {filteredData.length === 0 && !loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <Users size={40} strokeWidth={1.5} />
                  <p className="mt-3 font-bold text-sm">No se encontraron usuarios</p>
                </div>
              ) : (
                <Table columns={columns} data={filteredData} />
              )}
            </div>
          </>
        ) : (
          <UsuarioFormPage
            initialData={selectedUsuario}
            isSelf={selectedUsuario ? isSelf(selectedUsuario) : false}
            onBack={handleBackToList}
          />
        )}
      </main>

      {/* Confirm Toggle */}
      <StatusModal
        show={!!confirmToggle}
        type="confirm"
        message={confirmToggle ? `¿Estás seguro de ${confirmToggle.activo ? "deshabilitar" : "habilitar"} a "${confirmToggle.nombre}"?${confirmToggle.activo ? " No podrá iniciar sesión." : ""}` : ""}
        onConfirm={handleToggleActivo}
        onClose={() => setConfirmToggle(null)}
        confirmText={confirmToggle?.activo ? "Sí, deshabilitar" : "Sí, habilitar"}
        cancelText="Cancelar"
      />

      {/* Result Modal */}
      <StatusModal
        show={resultModal.show}
        success={resultModal.success}
        message={resultModal.message}
        onClose={() => setResultModal({ ...resultModal, show: false })}
      />
    </div>
  );
};

export default UsuariosPage;
