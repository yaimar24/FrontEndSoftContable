const fs = require('fs');
const file = 'src/presentation/pages/contabilidad/ContabilidadNuevoPage.tsx';
let content = fs.readFileSync(file, 'utf-8');

// Replace isValid condition
const isValidRegex = /const isValid = validMovimientos\.length >= 2 && isCuadrado;\s*console\.log\("isValid=", isValid,.*?validMovimientos\);/gs;
content = content.replace(isValidRegex, '');

// Update handleSave to have validation logic and alert instead of silent return
const oldSaveRegex = /const handleSave = async \(\) => \{\s*if \(\!isValid\) return;/gs;
content = content.replace(oldSaveRegex, `
  const handleSave = async () => {
    if (!fecha) {
      alert("Por favor seleccione una fecha.");
      return;
    }
    if (!descripcion.trim()) {
      alert("Por favor agregue una descripción.");
      return;
    }
    if (validMovimientos.length < 2) {
      alert("Debe agregar y completar al menos 2 líneas de movimiento (seleccione la cuenta de la lista).");
      return;
    }
    if (!isCuadrado) {
      alert("Los totales de Débito y Crédito no cuadran o son cero.");
      return;
    }
`);

// Update the button className and remove disabled
const oldBtnRegex = /disabled=\{\!isValid \|\| loading\}[\s\S]*?className=\{`px-8 py-4 rounded-2xl font-black text-sm uppercase\s*tracking-widest shadow-xl transition-all w-full md:w-auto \$\{isValid \?\s*'bg-\[\#1e3a8a\] text-white hover:bg-blue-900 hover:shadow-\[\#1e3a8a\]\/20\s*shadow-\[\#1e3a8a\]\/30' : 'bg-slate-200 text-slate-400 cursor-not-allowed\s*shadow-none border-2 border-slate-200'\}`\}/gs;

const newBtn = `disabled={loading}
              className={\`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all w-full md:w-auto \${loading ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border-2 border-slate-200' : 'bg-[#1e3a8a] text-white hover:bg-blue-900 hover:shadow-[#1e3a8a]/20 shadow-[#1e3a8a]/30'}\`}`;

content = content.replace(oldBtnRegex, newBtn);

fs.writeFileSync(file, content);
