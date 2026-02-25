import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Link, useLocation } from 'react-router-dom';
import { useState } from "react";
import { clearAuth, getAdmin } from "../auth/authStorage"; 
import { 
  LayoutDashboard, Store, Ticket, Layers, Rss, 
  MessageSquare, Settings, ShieldCheck, 
  LogOut, Menu, X, UserCircle, Tag, Check 
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const admin = getAdmin(); 

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  // ✅ Pure Code-Based Logo (Exactly from your Navbar code)
  const Logo = () => (
    <div className="flex items-center gap-3">
      {/* Icon Box with Tag & Check Badge */}
      <div className="relative w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
        <Tag size={20} />

        {/* Check Badge */}
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center border border-slate-200">
          <Check size={14} className="text-indigo-600" strokeWidth={3} />
        </div>
      </div>

      {/* Brand Text */}
      <div className="leading-tight">
        <div className="font-extrabold text-white tracking-tight text-lg">
          Maven<span className="text-indigo-500">Coupon</span>
        </div>
        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
          Admin Panel 
        </div>
      </div>
    </div>
  );

  const navItem = "px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-3 border border-transparent";
  const navActive = "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-[1.02] border-indigo-500/50";
  const navNormal = "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100 hover:translate-x-1";

  const NavLinks = () => (
    <div className="space-y-1.5">
      <NavLink to="/" end className={({ isActive }) => `${navItem} ${isActive ? navActive : navNormal}`}>
        <LayoutDashboard size={18} /> Dashboard
      </NavLink>
      <NavLink to="/stores" className={({ isActive }) => `${navItem} ${isActive ? navActive : navNormal}`}>
        <Store size={18} /> Stores
      </NavLink>
      <NavLink to="/coupons" className={({ isActive }) => `${navItem} ${isActive ? navActive : navNormal}`}>
        <Ticket size={18} /> Stores Coupons
      </NavLink>
      <NavLink to="/deals" className={({ isActive }) => `${navItem} ${isActive ? navActive : navNormal}`}>
        <Ticket size={18} /> Stores Deals
      </NavLink>
      <NavLink to="/admin/categories" className={({ isActive }) => `${navItem} ${isActive ? navActive : navNormal}`}>
        <Layers size={18} /> Categories
      </NavLink>
      <NavLink to="/blogs" className={({ isActive }) => `${navItem} ${isActive ? navActive : navNormal}`}>
        <Rss size={18} /> Blogs
      </NavLink>
    <NavLink to="/admin/testimonials" className={({ isActive }) => `${navItem} ${isActive ? navActive : navNormal}`}>
      <div className="flex items-center gap-3 flex-1">
        <MessageSquare size={18} /> Testimonials
      </div>
      <span className="bg-[#F59E0B] text-white text-[9px] px-1.5 py-0.5 rounded-md font-black uppercase">New</span>
    </NavLink>
      <NavLink to="/contact-messages" className={({ isActive }) => `${navItem} ${isActive ? navActive : navNormal}`}>
        <MessageSquare size={18} /> Messages
      </NavLink>
      <div className="my-6 border-t border-slate-800/50 mx-2" />
      <p className="text-[10px] font-bold text-slate-500 px-4 mb-3 uppercase tracking-[0.2em]">Security & Admin</p>
      <NavLink to="/admin/profile" className={({ isActive }) => `${navItem} ${isActive ? navActive : navNormal}`}>
        <Settings size={18} /> My Profile
      </NavLink>
      {admin?.role === "SUPER_ADMIN" && (
        <NavLink 
          to="/admin/manage-admins" 
          className={({ isActive }) => `${navItem} ${isActive ? navActive : 'text-amber-500/80 hover:bg-amber-500/5 hover:text-amber-400'}`}
        >
          <ShieldCheck size={18} /> Manage Staff
        </NavLink>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex font-['Inter',_sans-serif]">
      
      {/* 🖥️ DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-[280px] bg-[#020617] border-r border-slate-800/60 p-6 flex-col sticky top-0 h-screen">
        <div className="mb-10 px-2">
          <Logo />
        </div>

        <nav className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <NavLinks />
        </nav>

        <button 
          onClick={handleLogout} 
          className="mt-6 flex items-center gap-3 px-4 py-3.5 rounded-xl border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300 font-bold group"
        >
          <LogOut size={18} className="group-hover:translate-x-1 transition-transform" /> 
          Logout Session
        </button>
      </aside>

      {/* 🏗️ MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* 📱 MOBILE HEADER */}
        <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-[#020617] border-b border-slate-800/60 sticky top-0 z-40 backdrop-blur-md">
          <Logo />
          <button 
            onClick={() => setMobileOpen(true)} 
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
          >
            <Menu size={20} />
          </button>
        </header>

        {/* 📱 MOBILE DRAWER */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-[280px] bg-[#020617] p-6 flex flex-col shadow-2xl transition-all duration-300 border-r border-slate-800">
              <div className="flex items-center justify-between mb-8">
                <Logo />
                <button onClick={() => setMobileOpen(false)} className="p-2 text-slate-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              <nav onClick={() => setMobileOpen(false)}>
                <NavLinks />
              </nav>
            </div>
          </div>
        )}

        {/* 🚀 PAGE CONTENT */}
        <main className="flex-1 p-5 md:p-8 lg:p-10">
          {/* Top Bar / Stats Header Area */}
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">System Overview</h2>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-indigo-400">
                  <UserCircle size={24} />
                </div>
                <div>
                  <p className="text-white font-bold text-xl tracking-tight leading-tight">
                    {admin?.email?.split('@')[0] || 'Administrator'}
                  </p>
                  <p className="text-xs text-indigo-500 font-medium">Session Active • {admin?.role}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="animate-in fade-in duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}