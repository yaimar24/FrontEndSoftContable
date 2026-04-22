import type { ElementType } from 'react';
import { ShieldCheck, FileText, ShoppingCart, Calculator, Users, Package, BookOpen, Lock, Landmark } from 'lucide-react';

export const MODULE_ICON: Record<number, { icon: ElementType; color: string }> = {
  2:  { icon: FileText,    color: 'text-blue-500' },
  3:  { icon: ShoppingCart, color: 'text-indigo-500' },
  4:  { icon: Calculator,  color: 'text-violet-500' },
  5:  { icon: Users,       color: 'text-emerald-500' },
  6:  { icon: Package,     color: 'text-amber-500' },
  7:  { icon: BookOpen,    color: 'text-cyan-500' },
  8:  { icon: ShieldCheck, color: 'text-slate-500' },
  9:  { icon: Lock,        color: 'text-rose-500' },
  10: { icon: Landmark,    color: 'text-teal-500' },
};

export const MODULE_LABEL: Record<number, string> = {
  2: 'Ventas', 3: 'Compras', 4: 'Contabilidad', 5: 'Terceros',
  6: 'Productos', 7: 'PUC', 8: 'Perfil', 9: 'Seguridad', 10: 'Cartera',
};

export const PLAN_BADGE: Record<string, string> = {
  Básico:   'bg-slate-100 text-slate-600',
  Estándar: 'bg-blue-50 text-blue-700',
  Premium:  'bg-amber-50 text-amber-700',
};
