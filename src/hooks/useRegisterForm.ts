import { useState, type ChangeEvent, type Dispatch, type SetStateAction } from 'react';

export const useRegisterForm = <T extends object>(initialData: T) => {
  const [formData, setFormData] = useState<T>(initialData);
  const [step, setStep] = useState(1);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'file') {
      const { files } = e.target as HTMLInputElement;
      if (files && files.length > 0) {
        setFormData(prev => ({ ...prev, [name]: files[0] }));
      }
      return;
    }

    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }

    if (name.endsWith('Id')) {
      const numericValue = value === "" ? 0 : parseInt(value, 10);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  
  const resetForm = () => {
    setFormData(initialData);
    setStep(1);
  };

  return { 
    formData, 
    handleChange, 
    nextStep, 
    prevStep, 
    step, 
    resetForm, 
    setFormData: setFormData as Dispatch<SetStateAction<T>> 
  };
};