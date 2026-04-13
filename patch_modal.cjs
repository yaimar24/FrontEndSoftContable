const fs = require('fs');
const file = 'src/presentation/components/organisms/Modal.tsx';
let txt = fs.readFileSync(file, 'utf8');

txt = txt.replace(
  /  subtitle\?: string;\n  children: React.ReactNode;/,
  "  subtitle?: string;\n  maxWidth?: string;\n  children: React.ReactNode;"
);

txt = txt.replace(
  /const Modal: React\.FC<ModalProps> = \({ isOpen, onClose, title, subtitle, children }\) => {/,
  "const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, subtitle, maxWidth = 'max-w-lg', children }) => {"
);

txt = txt.replace(
  /className="bg-white rounded-2xl w-full max-w-lg shadow-\[0_20px_50px_rgba\(0,0,0,0\.1\)\] border border-slate-100 overflow-hidden outline-none"/,
  "className={g-white rounded-2xl w-full  max-h-[90vh] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden outline-none}"
);

txt = txt.replace(
  /        \{\/\* Contenido Inyectado \*\/}\n        <div className="p-5 pt-6">/,
  "        {/* Contenido Inyectado */}\n        <div className=\"p-5 pt-6 overflow-y-auto flex-1\">"
);

fs.writeFileSync(file, txt);
