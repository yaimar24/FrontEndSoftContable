import React from 'react';
import { Save } from 'lucide-react';
import { useAuth } from '../../../../hooks/useAuth';

import StatusModal from '../../../common/StatusModal';
import Button from '../../../common/Button';
import { SeccionDatosBasicos } from './section/SeccionDatosBasicos';
import { SeccionFiscal } from './section/SeccionFiscal';
import { SeccionRepresentante } from './section/SeccionRepresentante';
import { usePerfilForm } from '../../../../hooks/usePerfilForm';
import type { ParametrosSistema } from '../../../../models/parametros';


const PerfilPage: React.FC = () => {
  const { token } = useAuth();

  const {
    colegioId,
    loading,
    isSaving,
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

  if (loading) {
    return (
      <div className="p-20 text-center font-bold text-slate-400 animate-pulse">
        CARGANDO...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
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
        onClose={() => setResultModal(m => ({ ...m, show: false }))}
      />

      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 sticky top-4 z-20 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-800 uppercase">Perfil Institucional</h1>
          <p className="text-[10px] text-blue-500 font-black">ID: {colegioId ?? '-'}</p>
        </div>
        <Button onClick={() => setShowConfirm(true)} icon={Save} isLoading={isSaving}>
          Guardar Cambios
        </Button>
      </div>

      {/* Form Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Datos Básicos */}
          <SeccionDatosBasicos
            formData={formData}
            ciudades={parametros?.ciudades ?? []}
            onChange={handleChange}
          />

          {/* Representantes */}
          <SeccionRepresentante
            representantes={formData.representantesLegales ?? []}
            tiposId={parametros?.tiposIdentificacion ?? []}
            onRepChange={handleRepChange}
          />
        </div>

        {/* Fiscal */}
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
