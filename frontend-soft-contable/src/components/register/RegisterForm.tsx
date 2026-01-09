import { useState, useEffect } from "react";
import { useRegisterForm } from "../../hooks/useRegisterForm";
import Step1BasicInfo from "./Step/Step1BasicInfo";
import Step2Legal from "./Step/Step2Legal";
import Step3Account from "./Step/Step3Account";
import StatusModal from "../SuccessModal";
import LoadingOverlay from "../shared/LoadingOverlay";
import { registerColegio } from "../../services/colegioService";
import { getParametros } from "../../services/parametrosService";
import type {
  ActividadEconomica,
  Ciudad,
  Colegio,
  RegimenIva,
  TipoIdentificacion,
  Tributo,
} from "../../models/Colegio";

interface ParametrosSistema {
  ciudades: Ciudad[];
  actividadesEconomicas: ActividadEconomica[];
  tiposIdentificacion: TipoIdentificacion[];
  regimenesIva: RegimenIva[];
  tributos: Tributo[];
  responsabilidadesFiscales: Maestro[];
}

interface Maestro { id: number; nombre: string; }

export interface RegistroFormData extends Partial<Colegio> {
  nombreRepresentante?: string;
  numeroIdentificacionRepresentante?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  logo?: File;
}

export const RegisterForm: React.FC = () => {
  const initialData: RegistroFormData = {
    nombreColegio: "", nit: "", direccion: "", ciudadId: 0, telefono: "",
    actividadEconomicaId: "", tarifaIca: "", manejaAiu: false, ivaRetencion: false,
    nombreRepresentante: "", numeroIdentificacionRepresentante: "",
    tipoIdentificacionId: 0, regimenIvaId: 0, tributoId: 0, responsabilidadFiscalId: 0,
    email: "", password: "", confirmPassword: "", planSeleccionado: "Premium", logo: undefined,
  };

  const { formData, handleChange, setFormData, nextStep, prevStep, step, resetForm } = 
    useRegisterForm<RegistroFormData>(initialData);

  const [modal, setModal] = useState({ show: false, success: true, message: "" });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parametros, setParametros] = useState<ParametrosSistema | null>(null);

  useEffect(() => {
    getParametros()
      .then((data: ParametrosSistema) => { setParametros(data); setLoading(false); })
      .catch((err: Error) => { console.error(err); setLoading(false); });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await registerColegio(formData as unknown as Colegio);
      setModal({ show: true, success: response.success, message: response.message });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Error de red";
      setModal({ show: true, success: false, message: `Error: ${errorMsg}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {loading && <LoadingOverlay message="Cargando" />}
      {isSubmitting && <LoadingOverlay message="Procesando" />}

      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border-t-[8px] border-[#1e3a8a] max-w-4xl mx-auto">
        <div className="p-8 text-center bg-white border-b border-slate-100">
          <img src="sicpie.png" alt="SICPIE" className="h-16 mx-auto mb-4" />
        </div>

        <div className="p-6 md:p-12">
          {step === 1 && parametros && (
            <Step1BasicInfo
              formData={formData}
              handleChange={handleChange}
              nextStep={nextStep}
              ciudades={parametros.ciudades}
              actividadesEconomicas={parametros.actividadesEconomicas}
            />
          )}
          {step === 2 && parametros && (
            <Step2Legal
              formData={formData}
              handleChange={handleChange}
              nextStep={nextStep}
              prevStep={prevStep}
              tipoIdentificaciones={parametros.tiposIdentificacion}
              regimenIvas={parametros.regimenesIva}
              tributos={parametros.tributos}
              responsabilidadesFiscales={parametros.responsabilidadesFiscales}
            />
          )}
          {step === 3 && (
            <Step3Account
              formData={formData}
              handleChange={handleFileChange}
              prevStep={prevStep}
              onSubmit={handleSubmit}
            />
          )}
        </div>

        <StatusModal
          show={modal.show}
          success={modal.success}
          message={modal.message}
          onClose={() => {
            setModal((m) => ({ ...m, show: false }));
            if (modal.success) resetForm();
          }}
        />
      </div>
    </>
  );
};