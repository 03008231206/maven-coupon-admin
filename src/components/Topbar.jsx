import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { clearAuth, getAdmin } from "../auth/authStorage";
import { LogOut, User, Bell } from "lucide-react";

export default function Topbar() {
  const navigate = useNavigate();
  const admin = getAdmin();

  const logout = async () => {
    try {
      // Backend logic untouched
      await api.post("/admin/logout");
    } catch (err) {
      // ignore
    }
    clearAuth();
    navigate("/login");
  };

  return (
    <header className="h-16 border-b border-slate-800/60 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6 md:px-8">
      
      {/* Left Side: Greeting (Hidden on very small screens to save space) */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
          <span className="opacity-50 tracking-wider uppercase text-[10px] font-bold">Admin Panel</span>
          <span className="text-slate-700">/</span>
          <span className="text-slate-200 font-medium">Dashboard</span>
        </div>
      </div>

      {/* Right Side: Admin Info & Actions */}
      <div className="flex items-center gap-4 md:gap-6">
        
        {/* Notification Icon (Clean Placeholder) */}
        <button className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all">
          <Bell size={18} />
        </button>

        <div className="h-8 w-[1px] bg-slate-800 hidden sm:block"></div>

        {/* Admin Profile Info */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-slate-100 leading-none mb-1">
              {admin?.email?.split('@')[0] || "Admin"}
            </p>
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-tight">
              {admin?.role || "Manager"}
            </p>
          </div>
          
          <div className="h-9 w-9 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-indigo-400 shadow-inner">
            <User size={20} />
          </div>
        </div>

        {/* Logout Button: Clean Outline Style */}
        <button
          onClick={logout}
          className="
            flex items-center gap-2 px-4 py-2 rounded-xl
            border border-rose-500/30 text-rose-400 text-xs font-bold
            hover:bg-rose-500 hover:text-white hover:border-rose-500
            transition-all duration-300 active:scale-95
          "
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}