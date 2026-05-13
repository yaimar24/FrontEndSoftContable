import React, { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  GraduationCap,
  FolderTree,
  Users,
  ShoppingBag,
  Receipt,
  Package,
  BookOpen,
  HelpCircle,
  Shield,
  Landmark,
  type LucideIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AuthContext from "../../../application/context/AuthContext";
import StatusModal from "../organisms/StatusModal";
import { useTutorial } from "../../../application/context/TutorialContext";
import { usePerfil } from "../../../application/context/PerfilContext";

interface SidebarProps {
  nombreColegio: string | null;
  logoUrl?: string | null;
}

interface MenuItem {
  path: string;
  name: string;
  icon: LucideIcon;
  moduloId?: number;
  hasSubItems?: boolean;
  isSubItem?: boolean;
  parent?: string;
}

type SectionKey = "principal" | "operacion" | "administracion";

const MENU_ITEMS: MenuItem[] = [
  { path: "/dashboard", name: "Inicio", icon: LayoutDashboard },
  { path: "/dashboard/perfil", name: "Perfil", icon: User, moduloId: 8 },
  { path: "/dashboard/terceros", name: "Terceros", icon: Users, moduloId: 5 },
  { path: "/dashboard/puc", name: "Cuentas(puc)", icon: FolderTree, moduloId: 7 },
  { path: "/dashboard/productos", name: "Productos", icon: Package, moduloId: 6 },
  { path: "/dashboard/ventas", name: "Ventas", icon: ShoppingBag, hasSubItems: true, moduloId: 2 },
  { path: "/dashboard/ventas/recibos", name: "Recibos", icon: ShoppingBag, isSubItem: true, parent: "/dashboard/ventas", moduloId: 2 },
  { path: "/dashboard/cartera", name: "Cartera", icon: Landmark, moduloId: 10 },
  { path: "/dashboard/cuentas-por-pagar", name: "Cuentas por pagar", icon: Landmark, moduloId: 11 },
  { path: "/dashboard/factura-compra", name: "Compras", icon: Receipt, hasSubItems: true, moduloId: 3 },
  { path: "/dashboard/factura-compra/egresos", name: "Egresos", icon: Receipt, isSubItem: true, parent: "/dashboard/factura-compra", moduloId: 3 },
  { path: "/dashboard/asientos-contables", name: "Comprobantes contables", icon: BookOpen, hasSubItems: true, moduloId: 4 },
  { path: "/dashboard/asientos-contables/nuevo", name: "Movimiento manual", icon: BookOpen, isSubItem: true, parent: "/dashboard/asientos-contables", moduloId: 4 },
  { path: "/dashboard/asientos-contables/libro-auxiliar", name: "Auxiliar contable", icon: BookOpen, isSubItem: true, parent: "/dashboard/asientos-contables", moduloId: 4 },
  { path: "/dashboard/asientos-contables/configuracion", name: "Configuración", icon: BookOpen, isSubItem: true, parent: "/dashboard/asientos-contables", moduloId: 4 },
  { path: "/dashboard/seguridad", name: "Seguridad", icon: Shield, moduloId: 9 },
];

const SECTION_ORDER: SectionKey[] = ["principal", "operacion", "administracion"];

const getFullUrl = (path: string | null | undefined) => {
  if (!path) return null;
  return path.startsWith("http") ? path : `${import.meta.env.VITE_API_URL}${path}`;
};

const getInitialOpenSubMenus = (pathname: string) => {
  return MENU_ITEMS.filter((item) => item.hasSubItems).reduce<Record<string, boolean>>((acc, item) => {
    acc[item.path] = pathname.startsWith(item.path);
    return acc;
  }, {});
};

const getSectionKey = (item: MenuItem): SectionKey => {
  if (item.path === "/dashboard" || item.path === "/dashboard/perfil") {
    return "principal";
  }

  if (item.path === "/dashboard/seguridad") {
    return "administracion";
  }

  return "operacion";
};

const getSectionTitle = (key: SectionKey) => {
  if (key === "principal") return "Principal";
  if (key === "administracion") return "Administración";
  return "Operación";
};

const Sidebar: React.FC<SidebarProps> = ({ nombreColegio, logoUrl }) => {
  const displayLogoUrl = getFullUrl(logoUrl);
  const [isPinned, setIsPinned] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const isCollapsed = !isPinned && !isHovered;
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboardHome = location.pathname === '/dashboard';
  const { startTutorial, stopTutorial } = useTutorial();
  const { modulos: userModulos, isAdmin } = usePerfil();
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>(() => getInitialOpenSubMenus(location.pathname));

  const toggleSubMenu = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenSubMenus((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  useEffect(() => {
    stopTutorial();
  }, [location.pathname, stopTutorial]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const toggleCollapse = () => {
    setIsPinned(!isPinned);
  };

  const handleLogoutIntent = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmLogout = () => {
    setShowConfirmModal(false);
    setIsLoggingOut(true);

    if (auth) {
      auth.logout();
    }

    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 800);
  };

  const linkClass = (isActive: boolean, isSubItem?: boolean) => {
    let base = "group relative flex items-center rounded-2xl transition-colors duration-200 ";

    if (isSubItem && !isCollapsed) {
      base += "ml-11 gap-3 px-3 py-2 text-[12px] font-medium ";
    } else if (isCollapsed) {
      base += "justify-center px-0 py-3 ";
    } else {
      base += "gap-3 px-3 py-3 ";
    }

    base += isActive
      ? "bg-slate-100 text-slate-950 "
      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 ";

    return base;
  };

  const visibleMenuItems = MENU_ITEMS.filter((item) => {
    if (isAdmin) return true;
    if (!item.moduloId) return true;
    return userModulos.includes(item.moduloId);
  });

  const menuSections = SECTION_ORDER.map((key) => ({
    key,
    title: getSectionTitle(key),
    items: visibleMenuItems.filter((item) => getSectionKey(item) === key),
  })).filter((section) => section.items.length > 0);

  const isSubMenuOpen = (path: string) => openSubMenus[path] || location.pathname.startsWith(path);

  return (
    <>
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? 88 : 276,
          transition: { type: "spring", stiffness: 300, damping: 30 },
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="sticky top-0 z-30 flex h-screen shrink-0 flex-col border-r border-slate-200 bg-white"
      >
        <button
          onClick={toggleCollapse}
          type="button"
          aria-label={isPinned ? "Contraer barra lateral" : "Fijar barra lateral"}
          className="tuto-collapse absolute -right-3 top-8 z-50 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:text-slate-900"
        >
          {!isPinned ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className="flex h-full flex-col px-3 py-5">
          <div className={`flex ${isCollapsed ? "flex-col items-center gap-3" : "items-center gap-3"} px-2`}>
              <motion.div
                layout
                className="flex items-center justify-center overflow-hidden rounded-2xl bg-slate-900 text-lg font-bold text-white"
                style={{
                  width: isCollapsed ? 44 : 52,
                  height: isCollapsed ? 44 : 52,
                }}
              >
                {displayLogoUrl ? (
                  <img
                    src={displayLogoUrl}
                    alt="Logo del Colegio"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex items-center justify-center">
                    {nombreColegio?.charAt(0).toUpperCase() || <GraduationCap size={isCollapsed ? 18 : 24} />}
                  </span>
                )}
              </motion.div>

              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="min-w-0 flex-1"
                  >
                    <h2 className="truncate text-sm font-semibold text-slate-900">
                      {nombreColegio || "Institución"}
                    </h2>
                  </motion.div>
                )}
              </AnimatePresence>
          </div>

          <nav className="tuto-menu mt-8 flex-1 overflow-y-auto pr-1">
            <div className="space-y-6">
              {menuSections.map((section) => (
                <section key={section.key}>
                  {!isCollapsed && (
                    <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {section.title}
                    </div>
                  )}

                  <div className="space-y-1">
                    {section.items.map((item) => {
                      if (item.isSubItem && item.parent && !isSubMenuOpen(item.parent)) {
                        return null;
                      }

                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          end={item.path === "/dashboard" || item.path === "/dashboard/asientos-contables"}
                          className={({ isActive }) => linkClass(isActive, item.isSubItem)}
                          style={{ display: isCollapsed && item.isSubItem ? "none" : "flex" }}
                        >
                          {({ isActive }) => (
                            <>
                              {isActive && !item.isSubItem && (
                                <motion.div layoutId="activeTab" className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-slate-900" />
                              )}

                              {item.isSubItem ? (
                                <div className={`ml-1 h-1.5 w-1.5 rounded-full transition-colors ${isActive ? "bg-slate-900" : "bg-slate-300 group-hover:bg-slate-400"}`} />
                              ) : (
                                <div
                                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${isActive ? "bg-white text-slate-900 ring-1 ring-slate-200" : "text-slate-400 group-hover:bg-white group-hover:text-slate-700"}`}
                                >
                                  <item.icon size={18} strokeWidth={isActive ? 2.4 : 2} />
                                </div>
                              )}

                              {!isCollapsed && (
                                <motion.span
                                  initial={{ opacity: 0, x: -6 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className={`min-w-0 flex-1 whitespace-nowrap ${item.isSubItem ? "text-[12px] text-slate-500" : "text-[13px] font-medium"}`}
                                >
                                  {item.name}
                                </motion.span>
                              )}

                              {item.hasSubItems && !isCollapsed && (
                                <button
                                  type="button"
                                  onClick={(e) => toggleSubMenu(e, item.path)}
                                  aria-label={isSubMenuOpen(item.path) ? `Ocultar ${item.name}` : `Mostrar ${item.name}`}
                                  className={`z-10 flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${isSubMenuOpen(item.path) ? "bg-slate-200 text-slate-700" : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"}`}
                                >
                                  {isSubMenuOpen(item.path) ? <ChevronDown size={15} strokeWidth={2.8} /> : <ChevronRight size={15} strokeWidth={2.4} />}
                                </button>
                              )}

                              {isCollapsed && (
                                <div className="pointer-events-none absolute left-16 z-50 whitespace-nowrap rounded-lg bg-slate-950 px-2.5 py-1.5 text-[10px] font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                                  {item.name}
                                </div>
                              )}
                            </>
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </nav>

          <div className="mt-4 border-t border-slate-200 pt-4">
              {!isDashboardHome && (
                <button
                  onClick={startTutorial}
                  type="button"
                  className={`tuto-help group relative flex w-full items-center rounded-2xl transition-colors ${isCollapsed ? "justify-center py-3" : "gap-3 px-3 py-3"} text-slate-500 hover:bg-slate-50 hover:text-slate-900`}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-colors group-hover:bg-white group-hover:text-slate-700">
                    <HelpCircle size={18} strokeWidth={2.2} />
                  </div>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[13px] font-medium"
                    >
                      Ayuda / Tutorial
                    </motion.span>
                  )}
                  {isCollapsed && (
                    <div className="pointer-events-none absolute left-16 z-50 whitespace-nowrap rounded-lg bg-slate-950 px-2.5 py-1.5 text-[10px] font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                      Ayuda / Tutorial
                    </div>
                  )}
                </button>
              )}

              <button
                onClick={handleLogoutIntent}
                type="button"
                disabled={isLoggingOut}
                className={`tuto-logout group relative mt-1 flex w-full items-center rounded-2xl transition-colors ${isCollapsed ? "justify-center py-3" : "gap-3 px-3 py-3"} text-slate-500 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-60`}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-colors group-hover:bg-white group-hover:text-rose-600">
                  <LogOut size={18} strokeWidth={2.2} />
                </div>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[13px] font-medium"
                  >
                    {isLoggingOut ? "Saliendo..." : "Cerrar sesión"}
                  </motion.span>
                )}
                {isCollapsed && (
                  <div className="pointer-events-none absolute left-16 z-50 whitespace-nowrap rounded-lg bg-slate-950 px-2.5 py-1.5 text-[10px] font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    {isLoggingOut ? "Saliendo..." : "Cerrar sesión"}
                  </div>
                )}
              </button>
          </div>
        </div>
      </motion.aside>

      <StatusModal
        show={showConfirmModal}
        type="confirm"
        message="¿Estás seguro de que deseas cerrar tu sesión? Tendrás que ingresar tus credenciales nuevamente."
        onConfirm={handleConfirmLogout}
        onClose={() => setShowConfirmModal(false)}
        confirmText="Sí, salir ahora"
        cancelText="No, continuar trabajando"
      />
    </>
  );
};

export default Sidebar;

