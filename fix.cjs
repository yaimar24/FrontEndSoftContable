const fs = require('fs');
let p = 'src/presentation/pages/dashboard/compras/CreateCompras/CreateCompras.tsx';
let txt = fs.readFileSync(p, 'utf8');

// Match the specific string from the file replacing it manually
let idx = txt.indexOf("{condicionPago === 'CREDITO' ? ( <div className='grid");
if (idx !== -1) {
  let endIdx = txt.indexOf(') : (', idx);
  if (endIdx !== -1) {
    let toReplace = txt.substring(idx, endIdx + 5);
    txt = txt.replace(toReplace, '(');
  }
}
fs.writeFileSync(p, txt);
