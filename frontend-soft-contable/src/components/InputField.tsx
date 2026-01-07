import type { ChangeEvent } from 'react';

interface InputFieldProps {
  label: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  type?: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string; 
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  icon: Icon,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
}) => (
  <div className="flex flex-col space-y-1 relative">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>

    {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />}

    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full bg-slate-50 border-2 rounded-2xl p-4 focus:ring-2 outline-none transition-all
        ${Icon ? 'pl-12' : ''}
        ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-100 focus:ring-blue-500'}
      `}
      required={required}
    />

    {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
  </div>
);

export default InputField;
