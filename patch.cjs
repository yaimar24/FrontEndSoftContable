const fs = require('fs');
const file = 'src/presentation/components/organisms/PlanCuotasSection.tsx';
let txt = fs.readFileSync(file, 'utf8');

const s1 = '      </div>\r\n\r\n      <div className="overflow-x-auto">';
const s2 = '      </div>\n\n      <div className="overflow-x-auto">';

let replaced = false;
if (txt.includes(s1)) {
  txt = txt.replace(s1,       <button type="button" onClick={() => setIsModalOpen(true)} className="text-xs bg-slate-100 text-slate-600 px-4 py-2 rounded-lg font-black hover:bg-slate-200 transition-colors uppercase tracking-widest mt-2 self-start">Ver Plan de Cuotas</button>
      </div></div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Detalle Plan de Cuotas">
      <div className="overflow-x-auto mx-4 mb-4 mt-2 border border-slate-200 rounded-xl">);
  replaced = true;
} else if (txt.includes(s2)) {
  txt = txt.replace(s2,       <button type="button" onClick={() => setIsModalOpen(true)} className="text-xs bg-slate-100 text-slate-600 px-4 py-2 rounded-lg font-black hover:bg-slate-200 transition-colors uppercase tracking-widest mt-2 self-start">Ver Plan de Cuotas</button>
      </div></div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Detalle Plan de Cuotas">
      <div className="overflow-x-auto mx-4 mb-4 mt-2 border border-slate-200 rounded-xl">);
  replaced = true;
}

if (!replaced) console.log("Could not find div.overflow-x-auto block", txt.indexOf('overflow-x-auto'));

txt = txt.replace(/<\/table>\s*<\/div>\s*<\/div>$/, '</table></div></Modal></>');
fs.writeFileSync(file, txt);
console.log('saved');
