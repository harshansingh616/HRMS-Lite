import { NavLink } from "react-router-dom";

const linkBase =
  "px-3 py-2 rounded-lg text-sm font-medium transition border border-transparent";
const linkActive = "bg-slate-900 text-white";
const linkInactive = "text-slate-700 hover:bg-slate-100";

export function Layout({ children }) {
  return (
    <div className="w-full min-h-screen bg-slate-50">
      <header className="bg-black">
  <div className="w-full px-6 py-4 flex items-center justify-between">
    <div className="font-semibold text-white">HRMS Lite</div>

    <nav className="w-full flex gap-2">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          [
            "px-3 py-2 rounded-lg text-sm font-medium transition",
            "text-white",
            isActive ? "bg-white/15" : "hover:bg-white/10",
          ].join(" ")
        }
      >
        Employees
      </NavLink>

      <NavLink
        to="/attendance"
        className={({ isActive }) =>
          [
            "px-3 py-2 rounded-lg text-sm font-medium transition",
            "text-white",
            isActive ? "bg-white/15" : "hover:bg-white/10",
          ].join(" ")
        }
      >
        Attendance
      </NavLink>
    </nav>
  </div>
</header>
      <main className="w-full px-6 py-6">{children}</main>
    </div>
  );
}