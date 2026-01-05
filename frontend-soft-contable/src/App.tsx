import  { useState, type ChangeEvent, type FormEvent } from 'react';
import Step1BasicInfo from './components/Step1BasicInfo';
import ProgressBar from './components/ProgressBar';
import SuccessModal from './components/SuccessModal';
import Step2Legal from './components/Step2Legal';
import Step3Account from './components/Step3Account';
import sicpie from './assets/sicpie.png';

interface FormData {
  nombreColegio: string;
  nit: string;
  direccion: string;
  resDian: string;
  fechaCertificado: string;
  representanteLegal: string;
  cedula: string;
  email: string;
  password: string;
  confirmPassword: string;
  planSeleccionado: string;
}

const App: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    nombreColegio: '',
    nit: '',
    direccion: '',
    resDian: '',
    fechaCertificado: '',
    representanteLegal: '',
    cedula: '',
    email: '',
    password: '',
    confirmPassword: '',
    planSeleccionado: 'Premium',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setStep(1);
    setFormData({
      nombreColegio: '', nit: '', direccion: '',
      resDian: '', fechaCertificado: '', representanteLegal: '', cedula: '',
      email: '', password: '', confirmPassword: '', planSeleccionado: 'Premium',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border-t-[6px] border-[#1e3a8a]">
        
    {/* Header */}
<div className="p-8 text-center bg-white border-b border-slate-100">
  {/* Logo */}
  <div className="flex justify-center mb-4">
    <img src={sicpie} alt="Logo SICPIE" className="h-20 w-auto object-contain" />
  </div>

  {/* Título y subtítulo */}
  <h1 className="text-2xl font-black uppercase tracking-tight">Registro SICPIE</h1>
  <p className="text-slate-500 text-sm mt-1">Configura tu entorno SaaS en pocos minutos</p>

  {/* Barra de progreso */}
  <ProgressBar step={step} />
</div>

  <form onSubmit={handleSubmit} className="p-6 md:p-12">
  {step === 1 && <Step1BasicInfo formData={formData} handleChange={handleChange} nextStep={nextStep} />}
  {step === 2 && <Step2Legal formData={formData} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />}
  {step === 3 && <Step3Account formData={formData} handleChange={handleChange} prevStep={prevStep} />}
</form>
      </div>

      <SuccessModal showModal={showModal} closeModal={closeModal} nombreColegio={formData.nombreColegio} />
    </div>
  );
};

export default App;
