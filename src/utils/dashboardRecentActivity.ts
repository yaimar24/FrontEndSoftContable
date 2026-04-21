export interface DashboardRecentActivityItem {
  path: string;
  label: string;
  visitedAt: string;
}

const DASHBOARD_RECENT_ACTIVITY_KEY = 'dashboardRecentActivity';

const dashboardRouteLabels = [
  { path: '/dashboard/asientos-contables/configuracion', label: 'Configuración contable' },
  { path: '/dashboard/asientos-contables/libro-auxiliar', label: 'Auxiliar contable' },
  { path: '/dashboard/asientos-contables/nuevo', label: 'Movimiento manual' },
  { path: '/dashboard/ventas/recibos', label: 'Recibos' },
  { path: '/dashboard/factura-compra/egresos', label: 'Egresos' },
  { path: '/dashboard/asientos-contables', label: 'Contabilidad' },
  { path: '/dashboard/factura-compra', label: 'Compras' },
  { path: '/dashboard/productos', label: 'Productos' },
  { path: '/dashboard/terceros', label: 'Terceros' },
  { path: '/dashboard/cartera', label: 'Cartera' },
  { path: '/dashboard/ventas', label: 'Ventas' },
  { path: '/dashboard/perfil', label: 'Perfil' },
  { path: '/dashboard/puc', label: 'PUC' },
  { path: '/dashboard/seguridad', label: 'Seguridad' },
];

const matchesPath = (pathname: string, routePath: string) => {
  return pathname === routePath || pathname.startsWith(`${routePath}/`);
};

const resolveDashboardRoute = (pathname: string) => {
  return dashboardRouteLabels.find((item) => matchesPath(pathname, item.path)) ?? null;
};

export const getDashboardRecentActivity = (): DashboardRecentActivityItem[] => {
  try {
    const raw = localStorage.getItem(DASHBOARD_RECENT_ACTIVITY_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is DashboardRecentActivityItem =>
        typeof item?.path === 'string' && typeof item?.label === 'string' && typeof item?.visitedAt === 'string'
    );
  } catch {
    return [];
  }
};

export const recordDashboardRecentActivity = (pathname: string) => {
  if (!pathname.startsWith('/dashboard') || pathname === '/dashboard') {
    return;
  }

  const route = resolveDashboardRoute(pathname);
  if (!route) return;

  const nextItem: DashboardRecentActivityItem = {
    path: route.path,
    label: route.label,
    visitedAt: new Date().toISOString(),
  };

  const current = getDashboardRecentActivity();
  const deduped = current.filter((item) => item.path !== nextItem.path);

  localStorage.setItem(
    DASHBOARD_RECENT_ACTIVITY_KEY,
    JSON.stringify([nextItem, ...deduped].slice(0, 6))
  );
};