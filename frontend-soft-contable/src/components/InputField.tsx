import { type ChangeEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputFieldProps {
  label: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  type?: string;
  name: string;
  value: string | number | boolean; 
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  maxLength?: number; 
  onlyNumbers?: boolean; 
  allowDecimals?: boolean; 
  showToggle?: boolean; 
  showPassword?: boolean; 
  setShowPassword?: (val: boolean) => void;
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
  maxLength,
  onlyNumbers = false,
  allowDecimals = false,
  showToggle = false,
  showPassword,
  setShowPassword,
}) => {

  // Filtro de teclado para proteger el campo
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onlyNumbers) {
      const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'];
      
      // Si permitimos decimales, dejamos pasar el punto o la coma
      if (allowDecimals && (e.key === '.' || e.key === ',')) return;
      
      if (allowedKeys.includes(e.key)) return;

      // Bloquear si no es número
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
      }
    }
  };

  return (
    <div className="flex flex-col space-y-1 relative">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative group">
        {Icon && (
          <Icon 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors z-10" 
            size={20} 
          />
        )}

        <input
          type={type === 'password' && showToggle ? (showPassword ? 'text' : 'password') : type}
          name={name}
          {...(type === 'checkbox' 
             ? { checked: !!value } 
             : { value: value === undefined || value === null ? '' : String(value) }
          )}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          maxLength={maxLength}
          inputMode={onlyNumbers ? (allowDecimals ? "decimal" : "numeric") : undefined}
          className={`w-full bg-slate-50 border-2 rounded-2xl p-4 focus:ring-2 outline-none transition-all
            ${Icon ? 'pl-12' : ''}
            ${showToggle ? 'pr-12' : ''}
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-100 focus:ring-blue-500'}
            ${type === 'checkbox' ? 'w-5 h-5 cursor-pointer accent-blue-600' : ''}
          `}
          required={required}
        />

        {/* Toggle password */}
        {showToggle && setShowPassword && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
};

export default InputField;