import { useDeferredValue, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  CalendarDays,
  Clock3,
  FolderTree,
  History,
  Landmark,
  Package,
  Receipt,
  Search,
  Shield,
  ShoppingBag,
  User,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '../../../application/hooks/useAuth';
import { useModuleAccess } from '../../../application/hooks/useModuleAccess';
import { usePerfil } from '../../../application/context/PerfilContext';
import type { Colegio } from '../../../domain/models/Colegio';
import { getDashboardRecentActivity } from '../../../utils/dashboardRecentActivity';
import { getLogoUrlFromToken, getNombreColegioFromToken, getRoleFromToken } from '../../../utils/jwt';

interface ShortcutItem {
  path: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const shortcutItems: ShortcutItem[] = [
  { path: '/dashboard/perfil', title: 'Perfil', description: 'Ajusta la información institucional.', icon: User },
  { path: '/dashboard/terceros', title: 'Terceros', description: 'Consulta clientes y proveedores.', icon: Users },
  { path: '/dashboard/puc', title: 'PUC', description: 'Organiza tu plan de cuentas.', icon: FolderTree },
  { path: '/dashboard/productos', title: 'Productos', description: 'Administra tu catálogo.', icon: Package },
  { path: '/dashboard/ventas', title: 'Ventas', description: 'Crea y revisa facturas.', icon: ShoppingBag },
  { path: '/dashboard/factura-compra', title: 'Compras', description: 'Lleva el control de compras.', icon: Receipt },
  { path: '/dashboard/cartera', title: 'Cartera', description: 'Haz seguimiento a tus cobros.', icon: Landmark },
  { path: '/dashboard/asientos-contables', title: 'Contabilidad', description: 'Gestiona comprobantes y auxiliares.', icon: BookOpen },
  { path: '/dashboard/seguridad', title: 'Seguridad', description: 'Configura usuarios y permisos.', icon: Shield },
];

const parsePerfilInstitucional = (): Partial<Colegio> => {
  try {
    const storedPerfil = localStorage.getItem('perfilInstitucional');
    return storedPerfil ? JSON.parse(storedPerfil) : {};
  } catch {
    return {};
  }
};

const resolveLogoUrl = (rawLogoUrl: string | null) => {
  if (!rawLogoUrl) return null;
  return rawLogoUrl.startsWith('http') ? rawLogoUrl : `${import.meta.env.VITE_API_URL}${rawLogoUrl}`;
};

const formatRelativeTime = (dateString: string) => {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMinutes = Math.max(1, Math.round(diffMs / 60000));

  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `Hace ${diffHours} h`;

  const diffDays = Math.round(diffHours / 24);
  return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
};

const DashboardHome = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { canNavigateTo, isAdmin } = useModuleAccess();
  const { rolNombre } = usePerfil();
  const [moduleSearch, setModuleSearch] = useState('');

  const perfilInstitucional = parsePerfilInstitucional();
  const nombreColegio = getNombreColegioFromToken(token) || 'Mi Empresa';
  const nombreMostrar = perfilInstitucional.nombreColegio || nombreColegio;
  const rawLogoUrl = localStorage.getItem('logoUrl') || (token ? getLogoUrlFromToken(token) : null);
  const logoUrl = resolveLogoUrl(rawLogoUrl);
  const roleLabel = rolNombre || getRoleFromToken(token) || (isAdmin ? 'Administrador' : 'Usuario');
  const fechaActual = new Intl.DateTimeFormat('es-CO', { dateStyle: 'long' }).format(new Date());
  const deferredModuleSearch = useDeferredValue(moduleSearch.trim().toLowerCase());

  const visibleModules = shortcutItems.filter((item) => canNavigateTo(item.path));
  const featuredModules = visibleModules.slice(0, 4);
  const filteredModules = deferredModuleSearch
    ? visibleModules.filter((item) => {
        const searchableText = `${item.title} ${item.description}`.toLowerCase();
        return searchableText.includes(deferredModuleSearch);
      })
    : featuredModules;

  const recentActivity = getDashboardRecentActivity()
    .filter((item) => canNavigateTo(item.path))
    .slice(0, 4)
    .map((item) => {
      const relatedShortcut = shortcutItems.find((shortcut) => item.path.startsWith(shortcut.path));

      return {
        ...item,
        icon: relatedShortcut?.icon ?? History,
        helperText: relatedShortcut?.description ?? 'Visitado recientemente dentro del sistema.',
      };
    });

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.09),transparent_60%)]" />
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-900 text-lg font-semibold text-white">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo institución" className="h-full w-full object-cover" />
              ) : (
                nombreMostrar.charAt(0).toUpperCase() || <Building2 size={22} />
              )}
            </div>

            <div className="relative z-10">
              <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600">
                Inicio
              </span>
              <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Bienvenido de nuevo, {nombreMostrar}
              </h1>

              <div className="mt-5 flex flex-wrap gap-2.5">
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                  {roleLabel}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                  <CalendarDays size={14} />
                  {fechaActual}
                </span>
                {perfilInstitucional.municipioNombre && (
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                    {perfilInstitucional.municipioNombre}
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(330px,0.95fr)]">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Exploración</p>
                <h2 className="mt-2 text-lg font-semibold text-slate-900">Módulos</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Busca más módulos cuando los necesites.
                </p>
              </div>

              <label className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 lg:max-w-sm">
                <Search size={18} className="shrink-0" />
                <input
                  type="text"
                  value={moduleSearch}
                  onChange={(event) => setModuleSearch(event.target.value)}
                  placeholder="Buscar módulos"
                  className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </label>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filteredModules.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500 sm:col-span-2 xl:col-span-3">
                  {deferredModuleSearch
                    ? 'No encontramos módulos que coincidan con esa búsqueda.'
                    : 'No hay módulos visibles para mostrar en este inicio.'}
                </div>
              ) : (
                filteredModules.map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => navigate(item.path)}
                    className="group rounded-3xl border border-slate-200 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                      <item.icon size={18} />
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{item.description}</p>
                    <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-400 transition-colors group-hover:text-slate-700">
                      Abrir módulo
                      <ArrowUpRight size={14} />
                    </div>
                  </button>
                ))
              )}
            </div>

          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Actividad reciente</p>
                <h2 className="mt-2 text-lg font-semibold text-slate-900">Lo último que revisaste</h2>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <Clock3 size={18} />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {recentActivity.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm leading-6 text-slate-500">
                  Cuando empieces a navegar por módulos, aquí aparecerán tus accesos recientes para retomar más rápido.
                </div>
              ) : (
                recentActivity.map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => navigate(item.path)}
                    className="group flex w-full items-start gap-3 rounded-3xl border border-slate-200 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                      <item.icon size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-semibold text-slate-900">{item.label}</p>
                        <span className="shrink-0 text-xs font-medium text-slate-400">{formatRelativeTime(item.visitedAt)}</span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-500">{item.helperText}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
