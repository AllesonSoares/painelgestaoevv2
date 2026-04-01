import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Home, Briefcase, Layers, User, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
  { label: "Início", path: "/inicio", icon: Home },
  { label: "Carteira", path: "/carteira", icon: Briefcase },
  { label: "Esteiras", path: "/esteiras", icon: Layers },
  { label: "Perfil", path: "/perfil", icon: User },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("auth_id_user")) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-50 top-0 left-0 h-full w-64 bg-card border-r border-border flex flex-col transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-16 flex items-center justify-center border-b border-border">
          <span className="text-xl font-bold text-primary">Evogard</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-card border-b border-border flex items-center px-4 gap-4 sticky top-0 z-30">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6 text-foreground" />
          </button>
          <span className="text-lg font-semibold text-foreground">Painel</span>
          <div className="ml-auto text-sm text-muted-foreground">
            {sessionStorage.getItem("auth_nome") || ""}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
