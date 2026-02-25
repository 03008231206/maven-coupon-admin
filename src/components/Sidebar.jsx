import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, Store, Ticket, FileText, 
  BarChart3, Mail, Layers, Menu, X 
} from "lucide-react";

// Clean Base Styles
const linkBase = "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium tracking-tight";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { to: "/", icon: <LayoutDashboard size={18} />, label: "Dashboard", end: true },
    { to: "/stores", icon: <Store size={18} />, label: "Stores" },
    { to: "/coupons", icon: <Ticket size={18} />, label: "Coupons" },
    { to: "/blogs", icon: <FileText size={18} />, label: "Blogs" },
    { to: "/analytics", icon: <BarChart3 size={18} />, label: "Analytics" },
    { to: "/contact-messages", icon: <Mail size={18} />, label: "Messages" },
    { to: "/admin/categories", icon: <Layers size={18} />, label: "Categories" },
  ];

  return (
    <>
      {/* 📱 Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* 🌑 Overlay for Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 🚀 Sidebar Main */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        w-64 bg-[#020617] border-r border-slate-800/60 p-5 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <div className="h-4 w-4 bg-white rounded-sm" />
          </div>
          <span className="text-xl font-bold text-slate-50 tracking-tighter">
            Affiliate<span className="text-indigo-500">Pro</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive
                    ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.05)]"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100 border border-transparent"
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Support/Help (Optional) */}
        <div className="absolute bottom-8 left-5 right-5">
          <div className="p-4 bg-slate-900/50 border border-slate-800/50 rounded-2xl">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-1">System Status</p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs text-slate-300 font-medium">All systems live</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}