import { useEffect, useState } from "react";
import api from "../api/axios";
import { UserPlus, Trash2, Shield, UserCheck, Loader2, X, Mail, Lock, User, ShieldAlert } from "lucide-react";

export default function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "ADMIN" });
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });

  const showAlert = (msg, type) => {
    setAlert({ show: true, msg, type });
    setTimeout(() => setAlert({ show: false, msg: "", type: "" }), 4000);
  };

  const fetchAdmins = async () => {
    try {
      const res = await api.get("/auth/admins/all");
      setAdmins(res.data);
    } catch (err) { 
      showAlert("Could not load staff members.", "error");
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/admins/register", form);
      showAlert("New administrator added successfully! ✅", "success");
      setShowForm(false);
      setForm({ name: "", email: "", password: "", role: "ADMIN" });
      fetchAdmins();
    } catch (err) { 
      showAlert(err.response?.data?.message || "Error registering new admin", "error"); 
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to revoke access for this administrator?")) {
      try {
        await api.delete(`/auth/admins/${id}`);
        showAlert("Administrator removed from the system.", "success");
        fetchAdmins();
      } catch (err) { 
        showAlert("Failed to delete administrator.", "error"); 
      }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <Loader2 className="animate-spin text-indigo-500" size={40}/>
      <p className="text-slate-500 font-medium animate-pulse">Syncing team data...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
      
      {/* --- Floating Toast Notification --- */}
      {alert.show && (
        <div className={`fixed top-10 right-10 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-2xl backdrop-blur-md animate-in slide-in-from-right duration-300 ${
          alert.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400"
        }`}>
          {alert.type === "success" ? <UserCheck size={18} /> : <ShieldAlert size={18} />}
          <p className="text-sm font-bold tracking-wide">{alert.msg}</p>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Team Management</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage administrative staff and system access levels.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-xl ${
            showForm 
              ? "bg-slate-800 text-slate-300 hover:bg-slate-700" 
              : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/20"
          }`}
        >
          {showForm ? <><X size={18} /> Close Panel</> : <><UserPlus size={18} /> Add New Staff</>}
        </button>
      </div>

      {/* Registration Form */}
      {showForm && (
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-[2.5rem] p-1 animate-in zoom-in-95 duration-300 shadow-2xl">
          <form onSubmit={handleAdd} className="bg-[#0f172a] rounded-[2.2rem] p-8 border border-slate-800/50">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <UserPlus size={20} className="text-indigo-500" /> New Administrator Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input type="text" placeholder="Full Name" className="w-full bg-slate-950/50 p-3.5 pl-12 rounded-xl border border-slate-800 text-white outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all" onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input type="email" placeholder="Email Address" className="w-full bg-slate-950/50 p-3.5 pl-12 rounded-xl border border-slate-800 text-white outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all" onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input type="password" placeholder="Password" className="w-full bg-slate-950/50 p-3.5 pl-12 rounded-xl border border-slate-800 text-white outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all" onChange={e => setForm({...form, password: e.target.value})} required />
              </div>
              <button className="bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Staff List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {admins.map(admin => (
          <div key={admin._id} className="bg-[#0f172a] border border-slate-800/60 p-6 rounded-[2rem] flex justify-between items-center group hover:border-indigo-500/40 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/5">
            <div className="flex items-center gap-5">
              <div className={`h-14 w-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner border transition-transform group-hover:scale-110 duration-300 ${
                admin.role === 'SUPER_ADMIN' 
                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                  : 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
              }`}>
                {admin.name[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-slate-100 truncate">{admin.name}</h3>
                  {admin.role === 'SUPER_ADMIN' && <Shield size={16} className="text-amber-500 fill-amber-500/10" />}
                </div>
                <p className="text-slate-500 text-xs font-medium tracking-tight truncate">{admin.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl border ${
                admin.role === 'SUPER_ADMIN' 
                  ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' 
                  : 'border-indigo-500/20 text-indigo-400 bg-indigo-500/5'
              }`}>
                {admin.role.replace('_', ' ')}
              </span>
              
              {admin.role !== 'SUPER_ADMIN' ? (
                <button 
                  onClick={() => handleDelete(admin._id)} 
                  className="p-2.5 rounded-xl bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300"
                  title="Remove Administrator"
                >
                  <Trash2 size={20} />
                </button>
              ) : (
                <div className="p-2.5 opacity-0 cursor-default"><Trash2 size={20} /></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}