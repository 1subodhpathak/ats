import { NavLink } from "react-router-dom";
import {
  FolderClock,
  Home,
  LayoutDashboard,
  ScanSearch,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/check-ats", label: "Check ATS", icon: ScanSearch },
  { to: "/repository", label: "Repository", icon: FolderClock },
];

function Sidebar() {
  return (
    <aside className="surface-card sticky top-[72px] h-fit p-3">
      <p className="px-3 pb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        ATS Workspace
      </p>
      <nav className="space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition",
                isActive
                  ? "bg-[#0a66c2] text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              ].join(" ")
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
