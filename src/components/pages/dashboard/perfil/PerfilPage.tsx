import React from "react";
import { Save } from "lucide-react";
import { useAuth } from "../../../../hooks/useAuth";

import StatusModal from "../../../common/StatusModal";
import Button from "../../../common/Button";

import { SeccionDatosBasicos } from "./section/SeccionDatosBasicos";
import { SeccionFiscal } from "./section/SeccionFiscal";
import { SeccionRepresentante } from "./section/SeccionRepresentante";

import { usePerfilForm } from "../../../../hooks/usePerfilForm";
import type { ParametrosSistema } from "../../../../models/Parametros";
import PageHeader from "../../../Layout/PageHeader";

const PerfilPage: React.FC = () => {
  const { token } = useAuth();

  const {
    colegioId,
    formData,
    parametros,
    showConfirm,
    setShowConfirm,
    resultModal,
    setResultModal,
    handleChange,
    handleRepChange,
    handleSave,
  } = usePerfilForm(token);

  return (
    <div className="p-10 max-w-[1600px] mx-auto relative">

      {/* Modals */}
      <StatusModal
        show={showConfirm}
        type="confirm"
        message="¿Deseas aplicar los cambios?"
        onConfirm={handleSave}
        onClose={() => setShowConfirm(false)}
      />

      <StatusModal
        show={resultModal.show}
        success={resultModal.success}
        message={resultModal.message}
        onClose={() => setResultModal((m) => ({ ...m, show: false }))}
      />

      {/* Header */}
      <PageHeader
        title="Perfil Institucional"
        subtitle="Configuración de la entidad"
        idTag={colegioId}
        actions={
          <Button
            onClick={() => setShowConfirm(true)}
            icon={Save}
          >
            Guardar Cambios
          </Button>
        }
      />

      {/* Form Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-100">
        <div className="space-y-6">
          <SeccionDatosBasicos
            formData={formData}
            ciudades={parametros?.ciudades ?? []}
            onChange={handleChange}
          />

          <SeccionRepresentante
            representantes={formData.representantesLegales ?? []}
            tiposId={parametros?.tiposIdentificacion ?? []}
            onRepChange={handleRepChange}
          />
        </div>

        <SeccionFiscal
          formData={formData}
          parametros={parametros ?? ({} as ParametrosSistema)}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default PerfilPage;
