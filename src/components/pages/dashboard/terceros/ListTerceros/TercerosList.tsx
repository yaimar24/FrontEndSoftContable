import React, { useState } from "react";
import {
  Search,
  Edit3,
  Mail,
  Phone,
  Building2,
  User,
  UserMinus,
  Link,
} from "lucide-react";
import StatusModal from "../../../../common/StatusModal";
import { Table } from "../../../../common/Table";
import { desvincularTercero } from "../../../../../services/terceros/terceroService";
import type {
  TerceroCreateDTO,
  TerceroupdateDTO,
} from "../../../../../models/Tercero";

interface TercerosListProps {
  data: TerceroupdateDTO[];
  onEdit: (tercero: TerceroupdateDTO) => void;
}

const TercerosList: React.FC<TercerosListProps> = ({ data, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState("");
  // Agregamos isActivo al modal para saber qué acción confirmar
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    terceroId?: string;
    isActivo?: boolean;
  }>({ show: false });
  const [resultModal, setResultModal] = useState<{
    show: boolean;
    success?: boolean;
    message?: string;
  }>({ show: false });
  const [localData, setLocalData] = useState(data);

  React.useEffect(() => setLocalData(data), [data]);

  const handleToggleVinculo = (terceroId: string, isActivo: boolean) => {
    setConfirmModal({ show: true, terceroId, isActivo });
  };

  const confirmAction = async () => {
    if (!confirmModal.terceroId) return;

    try {
      const response = await desvincularTercero(confirmModal.terceroId);
      setResultModal({
        show: true,
        success: response.success,
        message: response.message,
      });

      if (response.success) {
        // En lugar de filtrar (borrar), actualizamos el campo 'activo'
        setLocalData((prev) =>
          prev.map((t) =>
            t.id === confirmModal.terceroId
              ? { ...t, activo: !confirmModal.isActivo }
              : t
          )
        );
      }
    } catch (err: unknown) {
      let message = "Error al procesar";

      if (err instanceof Error) {
        message = err.message;
      }

      setResultModal({
        show: true,
        success: false,
        message,
      });
    } finally {
      setConfirmModal({ show: false });
    }
  };

  const filteredData = localData.filter((t) => {
    const nombreCompleto =
      `${t.nombres} ${t.apellidos} ${t.nombreComercial}`.toLowerCase();
    return (
      nombreCompleto.includes(searchTerm.toLowerCase()) ||
      t.identificacion?.includes(searchTerm)
    );
  });

  const columns = [
    {
      header: "Tercero / Razón Social",
      className:
        "min-w-[300px] sticky left-0 bg-white group-hover:bg-slate-50 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]",
      render: (t: TerceroCreateDTO) => {
        const esPersonaNatural = t.tipoPersonaId === 1;
        const nombreAMostrar = esPersonaNatural
          ? `${t.nombres} ${t.apellidos}`
          : t.nombreComercial;
        return (
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                esPersonaNatural
                  ? "bg-blue-50 text-blue-600"
                  : "bg-purple-50 text-purple-600"
              }`}
            >
              {esPersonaNatural ? <User size={16} /> : <Building2 size={16} />}
            </div>
            <div className="flex flex-col">
              {/* El nombre se pone gris si está desvinculado */}
              <span
                className={`font-black tracking-tight uppercase leading-tight ${
                  t.activo ? "text-slate-800" : "text-slate-400 italic"
                }`}
              >
                {nombreAMostrar || "SIN NOMBRE"}
              </span>

              <div className="flex items-center gap-1.5 mt-1">
                {/* Badge de Categoría original */}
                <span
                  className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase w-fit ${
                    t.categoriaId === 1
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {t.categoriaId === 1 ? "Cliente" : "Proveedor"}
                </span>

                {/* Nuevo Badge de Estado */}
                <span
                  className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase w-fit ${
                    t.activo
                      ? "bg-blue-100 text-blue-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {t.activo ? "Activo" : "Desvinculado"}
                </span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Identificación",
      className: "min-w-[140px]",
      render: (t: TerceroCreateDTO) => (
        <div className={`flex flex-col ${!t.activo && "opacity-50"}`}>
          <span className="font-bold text-slate-700 tabular-nums">
            {t.identificacion}
          </span>
          <span className="text-[10px] text-slate-400 font-bold">
            DV: {t.dv}
          </span>
        </div>
      ),
    },
    {
      header: "Contacto",
      className: "min-w-[200px]",
      render: (t: TerceroCreateDTO) => (
        <div
          className={`flex flex-col text-[11px] font-bold text-slate-500 lowercase ${
            !t.activo && "opacity-50"
          }`}
        >
          <span className="flex items-center gap-1">
            <Mail size={12} className="text-blue-400" /> {t.email}
          </span>
          <span className="flex items-center gap-1">
            <Phone size={12} className="text-blue-400" /> {t.telefono}
          </span>
        </div>
      ),
    },
    {
      header: "Acciones",
      className:
        "text-right sticky right-0 bg-white group-hover:bg-slate-50 z-20",
      render: (t: TerceroupdateDTO) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onEdit(t)}
            title="Editar Tercero"
            className="p-2.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-xl transition-all duration-300 border border-blue-100 group/btn"
          >
            <Edit3
              size={16}
              className="group-hover/btn:scale-110 transition-transform"
            />
          </button>

          {/* Botón dinámico según el estado 'activo' */}
          {t.activo ? (
            <button
              onClick={() => handleToggleVinculo(t.id, true)}
              title="Desvincular"
              className="p-2.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl transition-all duration-300 border border-rose-100 group/btn"
            >
              <UserMinus
                size={16}
                className="group-hover/btn:scale-110 transition-transform"
              />
            </button>
          ) : (
            <button
              onClick={() => handleToggleVinculo(t.id, false)}
              title="Vincular"
              className="p-2.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white rounded-xl transition-all duration-300 border border-emerald-100 group/btn"
            >
              <Link
                size={16}
                className="group-hover/btn:scale-110 transition-transform"
              />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors"
            size={20}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="BUSCAR TERCERO..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-500/5 transition-all text-[11px] font-bold uppercase"
          />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
        <Table columns={columns} data={filteredData} />
      </div>

      <StatusModal
        show={confirmModal.show}
        type="confirm"
        message={
          confirmModal.isActivo
            ? "¿Desea desvincular este tercero del colegio? Sus datos se conservarán en el sistema central."
            : "¿Desea vincular nuevamente este tercero al colegio?"
        }
        onClose={() => setConfirmModal({ show: false })}
        onConfirm={confirmAction}
        confirmText={
          confirmModal.isActivo
            ? "Confirmar Desvinculación"
            : "Confirmar Vinculación"
        }
        cancelText="Volver"
      />

      <StatusModal
        show={resultModal.show}
        success={resultModal.success}
        message={resultModal.message || ""}
        onClose={() => setResultModal({ show: false })}
      />
    </div>
  );
};

export default TercerosList;
