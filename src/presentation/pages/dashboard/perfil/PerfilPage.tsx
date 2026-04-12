import React, { useEffect } from "react";
import { Save, Building2 } from "lucide-react";
import { useAuth } from "../../../../application/hooks/useAuth";

import StatusModal from "../../../components/organisms/StatusModal";
import Button from "../../../components/atoms/Button";

import { SeccionDatosBasicos } from "./section/SeccionDatosBasicos";
import { SeccionFiscal } from "./section/SeccionFiscal";
import { SeccionRepresentante } from "./section/SeccionRepresentante";

import { usePerfilForm } from "../../../../application/hooks/usePerfilForm";
import type { Parametros } from "../../../../domain/models/Parametros";
import PageHeader from "../../../components/organisms/PageHeader";
import { useTutorial } from "../../../../application/context/TutorialContext";

const PerfilPage: React.FC = () => {
  const { token } = useAuth();
  const { setSteps } = useTutorial();

  const {
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

  useEffect(() => {
    setSteps([
      {
        target: '.tuto-perfil-header',
        content: 'Aquí configuras la información general de tu institución. Estos datos aparecen en las facturas y documentos.',
      },
      {
        target: '.tuto-perfil-save',
        content: 'Cuando termines de editar, guarda los cambios presionando este botón.',
      },
      {
        target: '.tuto-perfil-datos',
        content: 'Completa los datos básicos como NIT, nombre, teléfono, municipio y dirección de la institución.',
      },
      {
        target: '.tuto-perfil-representante',
        content: 'Registra aquí los datos del representante legal de la institución.',
      },
      {
        target: '.tuto-perfil-fiscal',
        content: 'Configura la información fiscal: tipo de contribuyente, régimen tributario, responsabilidades fiscales y resolución de facturación.',
      }
    ]);
  }, [setSteps]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto relative">

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
      <div className="tuto-perfil-header">
        <PageHeader
          title="Perfil Institucional"
          subtitle="Configuración de la entidad"
          icon={Building2}
          actions={
            <div className="tuto-perfil-save">
              <Button
                onClick={() => setShowConfirm(true)}
                icon={Save}
              >
                Guardar Cambios
              </Button>
            </div>
          }
        />
      </div>

      {/* Form Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 opacity-100 items-start">
        <div className="tuto-perfil-datos">
          <SeccionDatosBasicos
            formData={formData}
            departamentos={parametros?.departamentos ?? []}
            municipios={parametros?.municipios ?? []}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-5">
          <div className="tuto-perfil-fiscal">
            <SeccionFiscal
              formData={formData}
              parametros={parametros ?? ({} as Parametros)}
              onChange={handleChange}
            />
          </div>

          <div className="tuto-perfil-representante">
            <SeccionRepresentante
              representantes={formData.representantesLegales ?? []}
              tiposId={parametros?.tiposIdentificacion ?? []}
              onRepChange={handleRepChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilPage;
