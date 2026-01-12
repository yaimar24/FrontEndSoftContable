import { useState, useEffect } from "react";
import { useRegisterForm } from "../../hooks/useRegisterForm";
import Step1BasicInfo from "./Step/Step1BasicInfo";
import Step2Legal from "./Step/Step2Legal";
import Step3Account from "./Step/Step3Account";
import StatusModal from "../common/StatusModal";
import LoadingOverlay from "../shared/LoadingOverlay";
import { registerColegio } from "../../services/colegio/colegioService";
import { getParametros } from "../../services/colegio/parametrosService";
import type { 
  Colegio, Ciudad, ActividadEconomica, TipoIdentificacion, 
  RegimenIva, Tributo, ResponsabilidadFiscal 
} from "../../models/Colegio";

export interface ParametrosSistema {
  ciudades: Ciudad[];
  actividadesEconomicas: ActividadEconomica[];
  tiposIdentificacion: TipoIdentificacion[];
  regimenesIva: RegimenIva[];
  tributos: Tributo[];
  responsabilidadesFiscales: ResponsabilidadFiscal[];
}

export interface RegistroFormData extends Partial<Colegio> {
  nombreRepresentante?: string;
  numeroIdentificacionRepresentante?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  logo?: File;
}

const initialData: RegistroFormData = {
  nombreColegio: "", nit: "", direccion: "", ciudadId: 0, telefono: "",
  actividadEconomicaId: "", tarifaIca: "", manejaAiu: false, ivaRetencion: false,
  nombreRepresentante: "", numeroIdentificacionRepresentante: "",
  tipoIdentificacionId: 0, regimenIvaId: 0, tributoId: 0, responsabilidadFiscalId: 0,
  email: "", password: "", confirmPassword: "", planSeleccionado: "Premium", rolesId: 1
};

export const RegisterForm: React.FC = () => {
  const { formData, handleChange, nextStep, prevStep, step, resetForm } = useRegisterForm<RegistroFormData>(initialData);
  const [modal, setModal] = useState({ show: false, success: true, message: "" });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parametros, setParametros] = useState<ParametrosSistema | null>(null);

  useEffect(() => {
    getParametros()
      .then((data) => {
        if (data) setParametros(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { nombreRepresentante, numeroIdentificacionRepresentante, tipoIdentificacionId, ...datos } = formData;
      const finalData: Colegio = {
        ...datos,
        representantesLegales: [{
          id: 0,
          nombre: nombreRepresentante || "",
          numeroIdentificacion: numeroIdentificacionRepresentante || "",
          tipoIdentificacionId: Number(tipoIdentificacionId)
        }]
      } as Colegio;

      const res = await registerColegio(finalData);
      setModal({ show: true, success: res.success, message: res.message });
    } catch (error) {
      setModal({ show: true, success: false, message: "Error en el servidor" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Verificación de seguridad: No renderizar pasos que requieren parámetros si no están listos
  const isReady = parametros && 
                  parametros.tiposIdentificacion && 
                  parametros.regimenesIva;

  return (
    <>
      {(loading || isSubmitting) && <LoadingOverlay message={loading ? "Cargando..." : "Procesando..."} />}
      
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border-t-[8px] border-[#1e3a8a] max-w-4xl mx-auto">
        <div className="p-8 text-center border-b border-slate-100">
          <img src="sicpie.png" alt="SICPIE" className="h-16 mx-auto mb-2" />
        </div>

        <div className="p-6 md:p-12">
          {step === 1 && isReady && (
            <Step1BasicInfo 
              formData={formData} 
              handleChange={handleChange} 
              nextStep={nextStep} 
              ciudades={parametros.ciudades} 
              actividadesEconomicas={parametros.actividadesEconomicas} 
            />
          )}
          {step === 2 && isReady && (
            <Step2Legal 
              formData={formData} 
              handleChange={handleChange} 
              nextStep={nextStep} 
              prevStep={prevStep} 
              params={parametros} 
            />
          )}
          {step === 3 && (
            <Step3Account 
              formData={formData} 
              handleChange={handleChange} 
              prevStep={prevStep} 
              onSubmit={handleSubmit} 
            />
          )}
        </div>

        <StatusModal
          {...modal}
          onClose={() => {
            setModal(m => ({ ...m, show: false }));
            if (modal.success) resetForm();
          }}
        />
      </div>
    </>
  );
};