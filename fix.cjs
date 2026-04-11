const fs = require('fs');
let file = 'src/presentation/pages/contabilidad/ContabilidadNuevoPage.tsx';
let txt = fs.readFileSync(file, 'utf8');
txt = txt.replace(/Por favor agregue una descripciï¿½n\./g, 'Por favor agregue una descripción.');
txt = txt.replace(/2 lï¿½neas/g, '2 líneas');
txt = txt.replace(/Los totales de Dï¿½bito y Crï¿½dito/g, 'Los totales de Débito y Crédito');
fs.writeFileSync(file, txt, 'utf8');
