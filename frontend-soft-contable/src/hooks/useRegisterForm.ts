import { useState, type ChangeEvent } from 'react';
import type { Colegio } from '../models/Colegio';

export const useRegisterForm = (initialData: Colegio) => {
  const [formData, setFormData] = useState<Colegio>(initialData);
  const [step, setStep] = useState(1);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  const resetForm = () => {
    setFormData(initialData);
    setStep(1);
  };

  return { formData, handleChange, nextStep, prevStep, step, resetForm, setFormData };
};
