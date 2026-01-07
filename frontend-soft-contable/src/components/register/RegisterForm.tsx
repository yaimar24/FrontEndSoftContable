import { useState } from "react";
import { registerColegio } from "../../services/colegioService";
import { useRegisterForm } from "../../hooks/useRegisterForm";
import Step1BasicInfo from "./Step/Step1BasicInfo";
import Step2Legal from "./Step/Step2Legal";
import Step3Account from "./Step/Step3Account";
import ProgressBar from "../ProgressBar";
import StatusModal from "../SuccessModal";

export const RegisterForm: React.FC = () => {
  const initialData = {
    /*...*/
  };
  const {
    formData,
    handleChange,
    nextStep,
    prevStep,
    step,
    resetForm,
    setFormData,
  } = useRegisterForm(initialData);

  const [modal, setModal] = useState({
    show: false,
    success: true,
    message: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0])
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

 const handleSubmit = async () => { 
  try {
    const response = await registerColegio(formData);
    setModal({
      show: true,
      success: response.success,
      message: response.message,
    });
  } catch (err) {
    setModal({ show: true, success: false, message: "Ocurrió un error" });
  }
};

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-t-[6px] border-[#1e3a8a]">
      <div className="p-8 text-center bg-white border-b border-slate-100">
        <img src="sicpie.png" alt="Logo" className="h-20 mx-auto" />
        <h1>Registro SICPIE</h1>
        <ProgressBar step={step} />
      </div>
      <form onSubmit={handleSubmit}  className="p-6 md:p-12">
        {step === 1 && (
          <Step1BasicInfo
            formData={formData}
            handleChange={handleChange}
            nextStep={nextStep}
          />
        )}
        {step === 2 && (
          <Step2Legal
            formData={formData}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}

         {step === 3 && (
        <Step3Account
          formData={formData}
          handleChange={handleChange}
          prevStep={prevStep}
          onSubmit={handleSubmit} // enviamos submit padre
        />  )}
      </form>
      <StatusModal
        show={modal.show}
        success={modal.success}
        message={modal.message}
        onClose={() => {
          setModal((prev) => ({ ...prev, show: false }));
          if (modal.success) resetForm();
        }}
      />
    </div>
  );
};
