const fs = require('fs');
let content = fs.readFileSync('src/components/pages/dashboard/ventas/ListVentas/InvoiceTemplate.tsx', 'utf8');

const replacements = {
  'bg-white': 'bg-[#ffffff]',
  'text-white': 'text-[#ffffff]',
  'text-slate-800': 'text-[#1e293b]',
  'border-slate-200/60': 'border-[#e2e8f0]',
  'border-slate-200': 'border-[#e2e8f0]',
  'bg-slate-100': 'bg-[#f1f5f9]',
  'text-slate-400': 'text-[#94a3b8]',
  'text-blue-900': 'text-[#1e3a8a]',
  'text-slate-500': 'text-[#64748b]',
  'bg-slate-50': 'bg-[#f8fafc]',
  'text-blue-600': 'text-[#2563eb]',
  'border-slate-100': 'border-[#f1f5f9]',
  'text-slate-600': 'text-[#475569]',
  'border-blue-800/50': 'border-[#93c5fd]',
  'divide-slate-100': 'divide-[#f1f5f9]',
  'bg-blue-50/50': 'bg-[#eff6ff]',
  'text-emerald-600': 'text-[#059669]',
  'bg-emerald-50/50': 'bg-[#ecfdf5]',
  'text-red-500': 'text-[#ef4444]'
};

for (const [key, value] of Object.entries(replacements)) {
  const regex = new RegExp(`\\b${key.replace(/\//g, '\\/')}\\b`, 'g');
  content = content.replace(regex, value);
}

fs.writeFileSync('src/components/pages/dashboard/ventas/ListVentas/InvoiceTemplate.tsx', content, 'utf8');
console.log('Colors replaced!');
