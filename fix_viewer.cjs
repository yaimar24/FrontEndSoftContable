const fs = require('fs');
let content = fs.readFileSync('src/components/pages/dashboard/ventas/VentasViewerPage.tsx', 'utf8');

content = content.replace(/bg-white/g, 'bg-[#ffffff]');
content = content.replace(/text-slate-800/g, 'text-[#1e293b]');
content = content.replace(/bg-slate-50/g, 'bg-[#f8fafc]');
content = content.replace(/bg-slate-100/g, 'bg-[#f1f5f9]');
content = content.replace(/text-slate-700/g, 'text-[#334155]');
content = content.replace(/border-slate-200/g, 'border-[#e2e8f0]');

fs.writeFileSync('src/components/pages/dashboard/ventas/VentasViewerPage.tsx', content, 'utf8');
console.log('Viewer colors replaced!');
