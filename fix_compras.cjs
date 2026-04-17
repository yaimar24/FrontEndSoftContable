const fs = require('fs');
let p = 'src/presentation/pages/dashboard/compras/CreateCompras/CreateCompras.tsx';
let txt = fs.readFileSync(p, 'utf8');

// 1. Ensure solo contado options
txt = txt.replace(/options=\{\[\s*\{\s*id:\s*'CONTADO',\s*nombre:\s*'De Contado \(Pago Total\)'\s*\},\s*\{\s*id:\s*'CREDITO',\s*nombre:\s*'[^\n]*?'\s*\}\s*\]\}/g,
"options={[{ id: 'CONTADO', nombre: 'Solo de Contado (Pago Total)' }]} disabled");

// 2. Remove the {condicionPago === 'CREDITO' ? ... : (   and just leave the div behind it.
txt = txt.replace(/\{condicionPago === 'CREDITO' \? \( <div[\s\S]*?\} <\/div> <divv className='col-span-1 md:col-span-2 text-center mt-2 p-3 bg-amber-50 border border-amber-100 rounded-xl'> <p className='text-xs text-amber-600 font-medium'>Factura a Cr[^\n]*?<\/p> <\/div> <\/div> \) : \(/g, '(');

txt = txt.replace(/\{condicionPago === 'CREDITO' \? \( <div[\s\S]*?Factura a Cr.*?<\/p> <\/div> <\/div> \) : \(/g, '(');

// Remove the validation for diasCredito
txt = txt.replace(/if \(!formData\.diasCredito \|\| formData\.diasCredito < 1 \|\| formData\.diasCredito > 365\) newErrors\.diasCredito = "1-365 días";/g, '');

fs.writeFileSync(p, txt);
