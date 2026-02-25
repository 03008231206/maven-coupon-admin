import { useEffect, useState } from "react";
import api from "../api/axios";
import { getAccessToken } from "../auth/authStorage";
import { 
  Store, Link as LinkIcon, Image as ImageIcon, 
  CheckCircle, AlertCircle, Edit3, Trash2, 
  Star, Power, Plus, X, Layers 
} from "lucide-react";

/* ---------------- Inputs (Enhanced Dark Glass Theme) ---------------- */

function Input({ label, icon: Icon, ...props }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">{label}</label>
      <div className="relative group">
        {Icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-violet-400 transition-colors"><Icon size={18} /></div>}
        <input
          {...props}
          className={`w-full rounded-2xl border border-slate-800/60 bg-slate-950/40 ${Icon ? 'pl-12' : 'px-4'} py-4
          text-sm text-slate-100 placeholder:text-slate-700
          focus:border-violet-500/50 focus:ring-8 focus:ring-violet-500/5
          outline-none transition-all duration-500`}
        />
      </div>
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">{label}</label>
      <textarea
        {...props}
        className="w-full min-h-[120px] rounded-2xl border border-slate-800/60 bg-slate-950/40 px-4 py-4
        text-sm text-slate-100 placeholder:text-slate-700
        focus:border-violet-500/50 focus:ring-8 focus:ring-violet-500/5
        outline-none transition-all duration-500 resize-none"
      />
    </div>
  );
}

function Toggle({ label, checked, onChange, activeColor = "bg-violet-600" }) {
  return (
    <button 
      type="button" 
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 group cursor-pointer bg-slate-900/50 px-4 py-2 rounded-2xl border border-slate-800/50 hover:border-slate-700 transition-all"
    >
      <div className={`w-10 h-5 rounded-full p-1 transition-all duration-500 ${checked ? activeColor : 'bg-slate-700'}`}>
        <div className={`bg-white w-3 h-3 rounded-full transition-all duration-500 transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
      <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-200 uppercase tracking-wider transition-colors">{label}</span>
    </button>
  );
}

/* ---------------- Main Page ---------------- */

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [form, setForm] = useState({
    name: "", slug: "", description: "", affiliateUrl: "", logoUrl: "", isActive: true, featured: false, category: ""
  });

  const [editingId, setEditingId] = useState(null);
  const [categorySearch, setCategorySearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const token = getAccessToken();
  const headers = { Authorization: `Bearer ${token}` };

  const resetForm = () => {
    setForm({ name: "", slug: "", description: "", affiliateUrl: "", logoUrl: "", isActive: true, featured: false, category: "" });
    setEditingId(null);
    setCategorySearch("");
  };

  const autoSlug = (text) => text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

  const loadData = async () => {
    setLoading(true);
    try {
      const [stRes, catRes] = await Promise.all([
        api.get("/admin/stores", { headers }),
        api.get("/categories/admin/all", { headers })
      ]);
      setStores(stRes.data || []);
      setCategories(catRes.data || []);
    } catch {
      setErrMsg("Network Error: Failed to sync database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // ✅ FIXED: ADDED DELETE FUNCTION
  const onDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this store permanently?")) return;
    setErrMsg(""); setSuccessMsg("");
    try {
      await api.delete(`/admin/stores/${id}`, { headers });
      setSuccessMsg("Entity successfully purged");
      loadData();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrMsg("Execution Error: Delete operation failed");
    }
  };

  const handleChange = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const submit = async (e) => {
    e.preventDefault();
    setErrMsg(""); setSuccessMsg("");
    if (!form.name || !form.slug || !form.category) {
      setErrMsg("Integrity Error: Missing required fields"); return;
    }

    try {
      if (editingId) {
        await api.put(`/admin/stores/${editingId}`, form, { headers });
        setSuccessMsg("Proprietary data updated");
      } else {
        await api.post("/admin/stores", form, { headers });
        setSuccessMsg("Brand successfully onboarded");
      }
      resetForm(); loadData();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      setErrMsg("Execution Error: Write operation failed");
    }
  };

  const onEdit = (store) => {
    setEditingId(store._id);
    setForm({
      name: store.name || "", slug: store.slug || "", description: store.description || "",
      affiliateUrl: store.affiliateUrl || "", logoUrl: store.logoUrl || "",
      isActive: store.isActive ?? true, featured: store.featured ?? false,
      category: store.category?._id || store.category || ""
    });

    if (store.category?.name) {
      setCategorySearch(store.category.name);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-1000 p-4">
      
      {/* Brand Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/50 pb-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Store Console</h1>
          <p className="text-slate-500 font-medium mt-1">Orchestrate your high-performing affiliate ecosystem.</p>
        </div>
        
        {editingId && (
          <button onClick={resetForm} className="group flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-500/5 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all font-bold text-xs uppercase tracking-widest">
            <X size={16} /> Discard Changes
          </button>
        )}
      </div>

      {/* Success/Error Toasts */}
      <div className="fixed top-24 right-8 z-50 space-y-4 w-80">
        {errMsg && (
          <div className="flex items-center gap-3 p-5 bg-slate-950 border-l-4 border-rose-500 rounded-r-2xl text-rose-400 shadow-2xl animate-in slide-in-from-right">
            <AlertCircle size={20} /> <span className="text-xs font-black uppercase tracking-widest">{errMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="flex items-center gap-3 p-5 bg-slate-950 border-l-4 border-emerald-500 rounded-r-2xl text-emerald-400 shadow-2xl animate-in slide-in-from-right">
            <CheckCircle size={20} /> <span className="text-xs font-black uppercase tracking-widest">{successMsg}</span>
          </div>
        )}
      </div>

      {/* Editor */}
      <div className="bg-gradient-to-br from-slate-800/20 to-slate-900/20 border border-slate-800/60 rounded-[3rem] p-1 shadow-3xl">
        <form onSubmit={submit} className="bg-[#0b1222] rounded-[2.8rem] p-8 md:p-12 border border-slate-700/30">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-12 w-12 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-400 border border-violet-500/20">
              {editingId ? <Edit3 size={22} /> : <Plus size={22} />}
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">{editingId ? "Modify Infrastructure" : "Deploy New Entity"}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            <Input label="Store Name" icon={Store} value={form.name} placeholder="e.g. NIKE GLOBAL"
              onChange={(e) => { handleChange("name", e.target.value); if (!editingId) handleChange("slug", autoSlug(e.target.value)); }} 
            />
            <Input label="Namespace (Slug)" icon={LinkIcon} value={form.slug} placeholder="nike-store"
              onChange={(e) => handleChange("slug", autoSlug(e.target.value))} 
            />

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Select Category</label>
              <div className="relative">
                <Layers className="absolute left-4 top-4 text-slate-600" size={18} />
                <input
                  type="text"
                  placeholder="Search category..."
                  value={categorySearch}
                  onChange={(e) => { setCategorySearch(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full rounded-2xl border border-slate-800/60 bg-slate-950/40 pl-12 pr-4 py-4 text-sm text-slate-100 placeholder:text-slate-700 focus:border-violet-500/50 outline-none transition-all"
                />
                {showSuggestions && categorySearch && (
                  <div className="absolute z-50 mt-2 w-full max-h-60 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
                    {filteredCategories.length > 0 ? (
                      filteredCategories.slice(0, 50).map((c) => (
                        <div key={c._id} onClick={() => { handleChange("category", c._id); setCategorySearch(c.name); setShowSuggestions(false); }}
                          className="px-4 py-3 text-sm text-slate-300 hover:bg-violet-600 hover:text-white cursor-pointer transition-all">
                          {c.name}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-slate-500">No categories found</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <Input label="Affiliate URL" icon={LinkIcon} value={form.affiliateUrl} placeholder="https://portal.affiliate.com" onChange={(e) => handleChange("affiliateUrl", e.target.value)} />
            </div>
            
            <div className="md:col-span-2">
              <Input label="Logo URL" icon={ImageIcon} value={form.logoUrl} placeholder="https://assets.cdn.com/brand.png" onChange={(e) => handleChange("logoUrl", e.target.value)} />
            </div>

            <div className="md:col-span-2"><Textarea label="Description" value={form.description} placeholder="Define the store's value proposition..." onChange={(e) => handleChange("description", e.target.value)} /></div>

            <div className="flex flex-wrap gap-4 md:col-span-2">
              <Toggle label="Active Node" checked={form.isActive} onChange={(v) => handleChange("isActive", v)} />
              <Toggle label="Priority Partner" checked={form.featured} onChange={(v) => handleChange("featured", v)} activeColor="bg-amber-500" />
            </div>
          </div>

          <button className="mt-12 w-full group relative flex items-center justify-center gap-3 rounded-[1.5rem] py-5 font-black text-xs uppercase tracking-[0.3em] text-white bg-violet-600 hover:bg-violet-500 shadow-[0_20px_50px_rgba(109,40,217,0.2)] transition-all duration-500 active:scale-[0.97]">
            {editingId ? "Synchronize Database" : "Add Store"}
          </button>
        </form>
      </div>

      {/* Database View */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
            Active Records <span className="bg-violet-500/10 text-violet-400 px-3 py-1 rounded-full text-[10px] border border-violet-500/20">{stores.length}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {stores.map((store) => (
            <div key={store._id} className="group bg-[#0f172a]/60 border border-slate-800/50 rounded-[2.2rem] p-6 hover:border-violet-500/30 transition-all duration-500">
              <div className="flex items-center gap-6">
                <div className="w-24 h-16 rounded-2xl bg-white p-2.5 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  <img src={store.logoUrl || ""} alt={store.name} className="max-h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                     <h3 className="text-lg font-black text-white truncate uppercase tracking-tight">{store.name}</h3>
                     {store.featured && <Star size={14} className="text-amber-500 fill-amber-500 animate-pulse" />}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-violet-400 bg-violet-500/5 px-2 py-0.5 rounded border border-violet-500/10">/{store.slug}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{store.category?.name || "Global"}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 pt-5 border-t border-slate-800/50">
                <button onClick={() => onEdit(store)} className="p-3 rounded-xl bg-slate-800/50 text-slate-400 hover:text-white hover:bg-violet-600 transition-all"><Edit3 size={18} /></button>
                <div className="flex-1 flex gap-2">
                  <div className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] text-center border ${store.isActive ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' : 'border-slate-700 text-slate-600'}`}>
                    {store.isActive ? "Online" : "Offline"}
                  </div>
                  <div className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] text-center border ${store.featured ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' : 'border-slate-700 text-slate-600'}`}>
                    {store.featured ? "Featured" : "Standard"}
                  </div>
                </div>
                {/* Delete Button calling onDelete */}
                <button onClick={() => onDelete(store._id)} className="p-3 rounded-xl bg-slate-800/50 text-slate-500 hover:text-white hover:bg-rose-600 transition-all"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// import { useEffect, useState } from "react";
// import api from "../api/axios";
// import { getAccessToken } from "../auth/authStorage";
// import { 
//   Store, Link as LinkIcon, Image as ImageIcon, 
//   CheckCircle, AlertCircle, Edit3, Trash2, 
//   Star, Power, Plus, X, Layers 
// } from "lucide-react";

// /* ---------------- Inputs (Enhanced Dark Glass Theme) ---------------- */

// function Input({ label, icon: Icon, ...props }) {
//   return (
//     <div className="space-y-2">
//       <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">{label}</label>
//       <div className="relative group">
//         {Icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-violet-400 transition-colors"><Icon size={18} /></div>}
//         <input
//           {...props}
//           className={`w-full rounded-2xl border border-slate-800/60 bg-slate-950/40 ${Icon ? 'pl-12' : 'px-4'} py-4
//           text-sm text-slate-100 placeholder:text-slate-700
//           focus:border-violet-500/50 focus:ring-8 focus:ring-violet-500/5
//           outline-none transition-all duration-500`}
//         />
//       </div>
//     </div>
//   );
// }

// function Textarea({ label, ...props }) {
//   return (
//     <div className="space-y-2">
//       <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">{label}</label>
//       <textarea
//         {...props}
//         className="w-full min-h-[120px] rounded-2xl border border-slate-800/60 bg-slate-950/40 px-4 py-4
//         text-sm text-slate-100 placeholder:text-slate-700
//         focus:border-violet-500/50 focus:ring-8 focus:ring-violet-500/5
//         outline-none transition-all duration-500 resize-none"
//       />
//     </div>
//   );
// }

// function Toggle({ label, checked, onChange, activeColor = "bg-violet-600" }) {
//   return (
//     <button 
//       type="button" 
//       onClick={() => onChange(!checked)}
//       className="flex items-center gap-3 group cursor-pointer bg-slate-900/50 px-4 py-2 rounded-2xl border border-slate-800/50 hover:border-slate-700 transition-all"
//     >
//       <div className={`w-10 h-5 rounded-full p-1 transition-all duration-500 ${checked ? activeColor : 'bg-slate-700'}`}>
//         <div className={`bg-white w-3 h-3 rounded-full transition-all duration-500 transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
//       </div>
//       <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-200 uppercase tracking-wider transition-colors">{label}</span>
//     </button>
//   );
// }

// /* ---------------- Main Page ---------------- */

// export default function Stores() {
//   const [stores, setStores] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [errMsg, setErrMsg] = useState("");
//   const [successMsg, setSuccessMsg] = useState("");

//   const [form, setForm] = useState({
//     name: "", slug: "", description: "", affiliateUrl: "", logoUrl: "", isActive: true, featured: false, category: ""
//   });

//   const [editingId, setEditingId] = useState(null);

//   // ✅ NEW STATES (Search Feature)
//   const [categorySearch, setCategorySearch] = useState("");
//   const [showSuggestions, setShowSuggestions] = useState(false);

//   const token = getAccessToken();
//   const headers = { Authorization: `Bearer ${token}` };

//   const resetForm = () => {
//     setForm({ name: "", slug: "", description: "", affiliateUrl: "", logoUrl: "", isActive: true, featured: false, category: "" });
//     setEditingId(null);
//     setCategorySearch("");
//   };

//   const autoSlug = (text) => text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

//   const loadData = async () => {
//     setLoading(true);
//     try {
//       const [stRes, catRes] = await Promise.all([
//         api.get("/admin/stores", { headers }),
//         api.get("/categories/admin/all", { headers })
//       ]);
//       setStores(stRes.data || []);
//       setCategories(catRes.data || []);
//     } catch {
//       setErrMsg("Network Error: Failed to sync database");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { loadData(); }, []);

//   const handleChange = (k, v) => setForm((p) => ({ ...p, [k]: v }));

//   // ✅ Filtered categories
//   const filteredCategories = categories.filter(c =>
//     c.name.toLowerCase().includes(categorySearch.toLowerCase())
//   );

//   const submit = async (e) => {
//     e.preventDefault();
//     setErrMsg(""); setSuccessMsg("");
//     if (!form.name || !form.slug || !form.category) {
//       setErrMsg("Integrity Error: Missing required fields"); return;
//     }

//     try {
//       if (editingId) {
//         await api.put(`/admin/stores/${editingId}`, form, { headers });
//         setSuccessMsg("Proprietary data updated");
//       } else {
//         await api.post("/admin/stores", form, { headers });
//         setSuccessMsg("Brand successfully onboarded");
//       }
//       resetForm(); loadData();
//       setTimeout(() => setSuccessMsg(""), 3000);
//     } catch {
//       setErrMsg("Execution Error: Write operation failed");
//     }
//   };

//   const onEdit = (store) => {
//     setEditingId(store._id);
//     setForm({
//       name: store.name || "", slug: store.slug || "", description: store.description || "",
//       affiliateUrl: store.affiliateUrl || "", logoUrl: store.logoUrl || "",
//       isActive: store.isActive ?? true, featured: store.featured ?? false,
//       category: store.category?._id || store.category || ""
//     });

//     if (store.category?.name) {
//       setCategorySearch(store.category.name);
//     }

//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   return (
//     <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-1000">
      
//       {/* Brand Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/50 pb-8">
//         <div>
//           <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Store Console</h1>
//           <p className="text-slate-500 font-medium mt-1">Orchestrate your high-performing affiliate ecosystem.</p>
//         </div>
        
//         {editingId && (
//           <button onClick={resetForm} className="group flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-500/5 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all font-bold text-xs uppercase tracking-widest">
//             <X size={16} /> Discard Changes
//           </button>
//         )}
//       </div>

//       {/* Success/Error Toasts */}
//       <div className="fixed top-24 right-8 z-50 space-y-4 w-80">
//         {errMsg && (
//           <div className="flex items-center gap-3 p-5 bg-slate-950 border-l-4 border-rose-500 rounded-r-2xl text-rose-400 shadow-2xl animate-in slide-in-from-right">
//             <AlertCircle size={20} /> <span className="text-xs font-black uppercase tracking-widest">{errMsg}</span>
//           </div>
//         )}
//         {successMsg && (
//           <div className="flex items-center gap-3 p-5 bg-slate-950 border-l-4 border-emerald-500 rounded-r-2xl text-emerald-400 shadow-2xl animate-in slide-in-from-right">
//             <CheckCircle size={20} /> <span className="text-xs font-black uppercase tracking-widest">{successMsg}</span>
//           </div>
//         )}
//       </div>

//       {/* Editor - Glassmorphism Card */}
//       <div className="bg-gradient-to-br from-slate-800/20 to-slate-900/20 border border-slate-800/60 rounded-[3rem] p-1 shadow-3xl">
//         <form onSubmit={submit} className="bg-[#0b1222] rounded-[2.8rem] p-8 md:p-12 border border-slate-700/30">
//           <div className="flex items-center gap-4 mb-10">
//             <div className="h-12 w-12 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-400 border border-violet-500/20">
//               {editingId ? <Edit3 size={22} /> : <Plus size={22} />}
//             </div>
//             <h2 className="text-2xl font-black text-white uppercase tracking-tight">{editingId ? "Modify Infrastructure" : "Deploy New Entity"}</h2>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
//             <Input label="Store Name" icon={Store} value={form.name} placeholder="e.g. NIKE GLOBAL"
//               onChange={(e) => { handleChange("name", e.target.value); if (!editingId) handleChange("slug", autoSlug(e.target.value)); }} 
//             />
//             <Input label="Namespace (Slug)" icon={LinkIcon} value={form.slug} placeholder="nike-store"
//               onChange={(e) => handleChange("slug", autoSlug(e.target.value))} 
//             />

//             {/* Category Section Only Modified */}
//       <div className="md:col-span-2 space-y-2">
//         <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">
//          Select Category
//         </label>

//         <div className="relative">
//           <Layers className="absolute left-4 top-4 text-slate-600" size={18} />

//           <input
//             type="text"
//             placeholder="Search category..."
//             value={categorySearch}
//             onChange={(e) => {
//               setCategorySearch(e.target.value);
//               setShowSuggestions(true);
//             }}
//             onFocus={() => setShowSuggestions(true)}
//             className="w-full rounded-2xl border border-slate-800/60 bg-slate-950/40 pl-12 pr-4 py-4 text-sm text-slate-100 placeholder:text-slate-700 focus:border-violet-500/50 outline-none transition-all"
//           />

//           {showSuggestions && categorySearch && (
//             <div className="absolute z-50 mt-2 w-full max-h-60 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
//               {filteredCategories.length > 0 ? (
//                 filteredCategories.slice(0, 50).map((c) => (
//                   <div
//                     key={c._id}
//                     onClick={() => {
//                       handleChange("category", c._id);
//                       setCategorySearch(c.name);
//                       setShowSuggestions(false);
//                     }}
//                     className="px-4 py-3 text-sm text-slate-300 hover:bg-violet-600 hover:text-white cursor-pointer transition-all"
//                   >
//                     {c.name}
//                   </div>
//                 ))
//               ) : (
//                 <div className="px-4 py-3 text-sm text-slate-500">
//                   No categories found
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//             <div className="md:col-span-2">
//               <Input label="Affiliate URL" icon={LinkIcon} value={form.affiliateUrl} placeholder="https://portal.affiliate.com/id=..."
//                 onChange={(e) => handleChange("affiliateUrl", e.target.value)} 
//               />
//             </div>
            
//             <div className="md:col-span-2">
//               <Input label="Logo URL" icon={ImageIcon} value={form.logoUrl} placeholder="https://assets.cdn.com/brand.png"
//                 onChange={(e) => handleChange("logoUrl", e.target.value)} 
//               />
//             </div>

//             {form.logoUrl?.trim() && (
//               <div className="md:col-span-2 p-8 bg-slate-950/80 border border-slate-800 rounded-[2rem] flex flex-col items-center shadow-inner">
//                 <img src={form.logoUrl} alt="Preview" className="h-24 object-contain brightness-110 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]" 
//                   onError={(e) => e.currentTarget.src = "https://via.placeholder.com/200x80?text=ASSET+NOT+FOUND"} 
//                 />
//               </div>
//             )}

//             <div className="md:col-span-2"><Textarea label="Description" value={form.description} placeholder="Define the store's value proposition..." onChange={(e) => handleChange("description", e.target.value)} /></div>

//             <div className="flex flex-wrap gap-4 md:col-span-2">
//               <Toggle label="Active Node" checked={form.isActive} onChange={(v) => handleChange("isActive", v)} />
//               <Toggle label="Priority Partner" checked={form.featured} onChange={(v) => handleChange("featured", v)} activeColor="bg-amber-500" />
//             </div>
//           </div>

//           <button className="mt-12 w-full group relative flex items-center justify-center gap-3 rounded-[1.5rem] py-5 font-black text-xs uppercase tracking-[0.3em] text-white bg-violet-600 hover:bg-violet-500 shadow-[0_20px_50px_rgba(109,40,217,0.2)] transition-all duration-500 active:scale-[0.97]">
//             {editingId ? "Synchronize Database" : "Add Store"}
//           </button>
//         </form>
//       </div>

//       {/* Database View */}
//       <div className="space-y-6">
//         <div className="flex items-center justify-between px-4">
//           <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
//             Active Records <span className="bg-violet-500/10 text-violet-400 px-3 py-1 rounded-full text-[10px] border border-violet-500/20">{stores.length}</span>
//           </h2>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {stores.map((store) => (
//             <div key={store._id} className="group bg-[#0f172a]/60 border border-slate-800/50 rounded-[2.2rem] p-6 hover:border-violet-500/30 transition-all duration-500">
//               <div className="flex items-center gap-6">
//                 <div className="w-24 h-16 rounded-2xl bg-white p-2.5 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
//                   <img src={store.logoUrl || ""} alt={store.name} className="max-h-full object-contain" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2">
//                      <h3 className="text-lg font-black text-white truncate uppercase tracking-tight">{store.name}</h3>
//                      {store.featured && <Star size={14} className="text-amber-500 fill-amber-500 animate-pulse" />}
//                   </div>
//                   <div className="flex items-center gap-2 mt-1">
//                     <span className="text-[10px] font-bold text-violet-400 bg-violet-500/5 px-2 py-0.5 rounded border border-violet-500/10">/{store.slug}</span>
//                     <span className="text-[10px] font-bold text-slate-500 uppercase">{store.category?.name || "Global"}</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-6 flex items-center gap-3 pt-5 border-t border-slate-800/50">
//                 <button onClick={() => onEdit(store)} className="p-3 rounded-xl bg-slate-800/50 text-slate-400 hover:text-white hover:bg-violet-600 transition-all"><Edit3 size={18} /></button>
//                 <div className="flex-1 flex gap-2">
//                   <div className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] text-center border ${store.isActive ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' : 'border-slate-700 text-slate-600'}`}>
//                     {store.isActive ? "Online" : "Offline"}
//                   </div>
//                   <div className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] text-center border ${store.featured ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' : 'border-slate-700 text-slate-600'}`}>
//                     {store.featured ? "Featured" : "Standard"}
//                   </div>
//                 </div>
//                 <button onClick={() => onDelete(store._id)} className="p-3 rounded-xl bg-slate-800/50 text-slate-500 hover:text-white hover:bg-rose-600 transition-all"><Trash2 size={18} /></button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }