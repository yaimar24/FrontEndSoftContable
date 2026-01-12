import type { ElementType } from "react";

// Definimos las variantes de color
const BUTTON_VARIANTS = {
  primary: "bg-[#1e3a8a] text-white hover:bg-[#152a61] shadow-blue-900/20",
  secondary: "bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-none",
  success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-900/20",
  danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-rose-900/20",
  outline: "border-2 border-slate-200 text-slate-500 hover:bg-slate-50 shadow-none",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof BUTTON_VARIANTS;
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: string; // Texto personalizado cuando carga
  icon?: ElementType;    // Para pasar el icono como componente (ej: icon={Save})
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = "primary", 
  fullWidth = false,
  isLoading = false,
  loadingText = "Procesando...",
  icon: Icon,
  className = "", 
  ...props 
}) => {
  
  // Estilos base compartidos
  const baseStyles = "inline-flex items-center justify-center gap-3 font-black py-4 px-6 rounded-2xl transition-all text-[10px] sm:text-xs tracking-[0.15em] uppercase shadow-lg active:scale-[0.97] disabled:opacity-70 disabled:pointer-events-none select-none";
  
  // Lógica de ancho
  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${widthStyle} ${BUTTON_VARIANTS[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          {/* Spinner centralizado */}
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>{loadingText}</span>
        </>
      ) : (
        <>
          {/* Si hay un icono, lo renderiza antes del texto */}
          {Icon && <Icon size={18} strokeWidth={2.5} />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;