// import { useEffect, useMemo, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import api from "../api/axios";
// import { 
//   Search, Plus, Edit3, Trash2, Store, 
//   Link as LinkIcon, Loader2, CheckCircle2, X, Star
// } from "lucide-react";

// export default function Coupons() {
//   const [loading, setLoading] = useState(true);
//   const [stores, setStores] = useState([]);
//   const [coupons, setCoupons] = useState([]);
//   const [search, setSearch] = useState("");
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [editingId, setEditingId] = useState(null);
//   const [showForm, setShowForm] = useState(false);

//   // Form State - Exactly as your theme needs
//   const [form, setForm] = useState({
//     store: "", title: "", cardName: "", code: "", description: "",
//     discountType: "PERCENT", discountValue: 0, expiryDate: "",
//     affiliateUrl: "", isActive: true, featured: false,
//   });

//   const loadAll = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const [storesRes, couponsRes] = await Promise.all([
//         api.get("/stores"),
//         api.get("/coupons"),
//       ]);
//       setStores(storesRes.data || []);
//       setCoupons(couponsRes.data || []);
//     } catch (err) {
//       setError("Sync Error: Failed to fetch records");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { loadAll(); }, []);

//   const resetForm = () => {
//     setEditingId(null);
//     setShowForm(false);
//     setForm({
//       store: "", title: "", cardName: "", code: "", description: "",
//       discountType: "PERCENT", discountValue: 0, expiryDate: "",
//       affiliateUrl: "", isActive: true, featured: false,
//     });
//     setError("");
//   };

//   const filteredCoupons = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     if (!q) return coupons;
//     return coupons.filter((c) => {
//       const storeName = c?.store?.name?.toLowerCase() || "";
//       const title = c?.title?.toLowerCase() || "";
//       const cardName = c?.cardName?.toLowerCase() || "";
//       const code = c?.code?.toLowerCase() || "";
//       return storeName.includes(q) || title.includes(q) || code.includes(q) || cardName.includes(q);
//     });
//   }, [coupons, search]);

//   // ✅ FIXED SUBMIT LOGIC
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setError("");

//     try {
//       const payload = { 
//         ...form, 
//         discountValue: Number(form.discountValue || 0),
//         link: form.affiliateUrl, // Backend logic check: 'link' is required
//         expiryDate: form.expiryDate || null 
//       };

//       if (editingId) {
//         await api.put(`/coupons/${editingId}`, payload);
//       } else {
//         await api.post("/coupons", payload);
//       }
      
//       resetForm();
//       await loadAll();
//     } catch (err) {
//       console.error("Submission Error:", err.response?.data);
//       setError(err.response?.data?.message || "Database Error: Failed to commit offer");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const onEdit = (coupon) => {
//     setEditingId(coupon._id);
//     setForm({
//       store: coupon?.store?._id || "",
//       title: coupon?.title || "",
//       cardName: coupon?.cardName || "",
//       code: coupon?.code || "",
//       description: coupon?.description || "",
//       discountType: coupon?.discountType || "PERCENT",
//       discountValue: coupon?.discountValue || 0,
//       expiryDate: coupon?.expiryDate ? new Date(coupon.expiryDate).toISOString().slice(0, 10) : "",
//       affiliateUrl: coupon?.link || "", 
//       isActive: coupon?.isActive ?? true,
//       featured: coupon?.featured ?? false,
//     });
//     setShowForm(true);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const onDelete = async (id) => {
//     if (!confirm("Remove this offer?")) return;
//     try {
//       await api.delete(`/coupons/${id}`);
//       await loadAll();
//     } catch (err) {
//       setError("Action Failed");
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 p-6 font-inter">
      
//       {/* Header section */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/50 pb-8">
//         <div>
//           <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase underline decoration-violet-500">Offers Console</h1>
//           <p className="text-slate-500 font-medium">Manage promo codes and brand badges.</p>
//         </div>
//         <div className="flex items-center gap-4">
//           <div className="relative group hidden md:block">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
//             <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="bg-slate-950/40 border border-slate-800/60 pl-12 pr-4 py-3.5 rounded-2xl text-slate-100 outline-none w-64 text-sm focus:border-violet-500/50" />
//           </div>
//           <button onClick={() => { if(showForm) resetForm(); else setShowForm(true); }} className="bg-violet-600 hover:bg-violet-500 text-white px-7 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-lg shadow-violet-600/20">
//             {showForm ? <X size={18} /> : <Plus size={18} />}
//             {showForm ? "Cancel" : "New Offer"}
//           </button>
//         </div>
//       </div>

//       {error && (
//         <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl text-rose-500 text-sm font-bold">
//           {error}
//         </div>
//       )}

//       {/* Form Section */}
//       <AnimatePresence>
//         {showForm && (
//           <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-gradient-to-br from-slate-800/20 to-slate-900/20 border border-slate-800/60 rounded-[2.8rem] p-1">
//             <form onSubmit={handleSubmit} className="bg-[#0b1222] rounded-[2.6rem] p-10 border border-slate-700/30">
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 {/* Brand Selection */}
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Assigned Store</label>
//                   <select value={form.store} onChange={(e) => setForm({...form, store: e.target.value})} className="w-full bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60 text-slate-200 outline-none text-sm appearance-none" required>
//                     <option value="" className="bg-slate-900">SELECT BRAND...</option>
//                     {stores.map(s => <option key={s._id} value={s._id} className="bg-slate-900">{s.name.toUpperCase()}</option>)}
//                   </select>
//                 </div>

//                 {/* Card Badge Input */}
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Card Badge (e.g. 50% OFF)</label>
//                   <input value={form.cardName} onChange={(e) => setForm({...form, cardName: e.target.value})} placeholder="e.g. 70% OFF" className="w-full bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60 text-amber-500 font-black outline-none text-sm uppercase" />
//                 </div>

//                 {/* Promo Code */}
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Promo Code</label>
//                   <input value={form.code} onChange={(e) => setForm({...form, code: e.target.value})} placeholder="e.g. SAVE20" className="w-full bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60 text-violet-400 font-black outline-none text-sm uppercase" />
//                 </div>

//                 {/* Headline */}
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Headline Title</label>
//                   <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="e.g. Flat 30% Off" className="w-full bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60 text-slate-200 outline-none text-sm focus:border-violet-500/50" required />
//                 </div>

//                 {/* ✅ FEATURED TOGGLE */}
//                 <div className="md:col-span-2 bg-slate-950/40 p-6 rounded-[2rem] border border-slate-800/60 flex items-center justify-between">
//                   <div className="flex items-center gap-4">
//                     <div className={`p-3 rounded-xl transition-all ${form.featured ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-800 text-slate-500'}`}>
//                       <Star size={20} fill={form.featured ? "currentColor" : "none"} />
//                     </div>
//                     <div>
//                       <p className="text-sm font-black text-white uppercase tracking-wider">Featured Offer</p>
//                       <p className="text-[11px] text-slate-500 font-medium italic">If active, this deal will appear on the Home Page Top 20.</p>
//                     </div>
//                   </div>
//                   <button 
//                     type="button"
//                     onClick={() => setForm({...form, featured: !form.featured})}
//                     className={`w-14 h-8 rounded-full transition-all relative ${form.featured ? 'bg-violet-600' : 'bg-slate-700'}`}
//                   >
//                     <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${form.featured ? 'left-7' : 'left-1'}`} />
//                   </button>
//                 </div>

//                 {/* Affiliate URL */}
//                 <div className="space-y-2 md:col-span-2">
//                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Affiliate URL</label>
//                   <div className="relative">
//                     <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
//                     <input value={form.affiliateUrl} onChange={(e) => setForm({...form, affiliateUrl: e.target.value})} placeholder="https://..." className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-950/40 border border-slate-800/60 text-slate-200 outline-none text-sm focus:border-violet-500/50" required />
//                   </div>
//                 </div>
//               </div>

//               <button type="submit" disabled={saving} className="mt-12 w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-violet-600/20">
//                 {saving ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={18} />}
//                 {editingId ? "Update Coupon" : "Deploy Coupon"}
//               </button>
//             </form>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* List section */}
//       <div className="grid grid-cols-1 gap-5">
//         {loading ? (
//           <Loader2 className="animate-spin mx-auto text-violet-500" size={40} />
//         ) : filteredCoupons.map((c) => (
//           <motion.div layout key={c._id} className="bg-[#0f172a]/60 border border-slate-800/50 p-6 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-violet-500/30 transition-all hover:bg-slate-900/40">
//             <div className="flex-1 space-y-3">
//               <div className="flex items-center gap-4">
//                 <h3 className="text-lg font-black text-white group-hover:text-violet-400 transition-colors uppercase tracking-tight">{c.title}</h3>
//                 {c.featured && (
//                   <div className="flex items-center gap-1 bg-amber-500/10 text-amber-500 px-2 py-1 rounded-lg border border-amber-500/20">
//                     <Star size={12} fill="currentColor" />
//                     <span className="text-[9px] font-black uppercase">Featured</span>
//                   </div>
//                 )}
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {c.cardName && (
//                   <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-sm">
//                     {c.cardName}
//                   </span>
//                 )}
//                 <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
//                   {c.code || "NO CODE"}
//                 </span>
//                 <span className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase px-3 py-1.5 bg-slate-950/50 border border-slate-800/60 rounded-full">
//                   <Store size={10} /> {c?.store?.name}
//                 </span>
//               </div>
//             </div>
//             <div className="flex gap-3">
//               <button onClick={() => onEdit(c)} className="p-3.5 rounded-xl bg-slate-800/40 text-slate-400 hover:text-white hover:bg-violet-600 transition-all"><Edit3 size={18} /></button>
//               <button onClick={() => onDelete(c._id)} className="p-3.5 rounded-xl bg-slate-800/40 text-slate-500 hover:text-white hover:bg-rose-600 transition-all"><Trash2 size={18} /></button>
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import { 
  Search, Plus, Edit3, Trash2, Store, 
  Link as LinkIcon, Loader2, CheckCircle2, X, Star, ChevronDown
} from "lucide-react";

export default function Coupons() {
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Store Search & Suggestion States
  const [storeSearch, setStoreSearch] = useState("");
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);

  const [form, setForm] = useState({
    store: "", title: "", cardName: "", code: "", description: "",
    discountType: "PERCENT", discountValue: 0, expiryDate: "",
    affiliateUrl: "", isActive: true, featured: false,
  });

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [storesRes, couponsRes] = await Promise.all([
        api.get("/stores"),
        api.get("/coupons"),
      ]);
      setStores(storesRes.data || []);
      setCoupons(couponsRes.data || []);
    } catch (err) {
      setError("Sync Error: Failed to fetch records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setStoreSearch("");
    setForm({
      store: "", title: "", cardName: "", code: "", description: "",
      discountType: "PERCENT", discountValue: 0, expiryDate: "",
      affiliateUrl: "", isActive: true, featured: false,
    });
    setError("");
  };

  const filteredCoupons = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return coupons;
    return coupons.filter((c) => {
      const storeName = c?.store?.name?.toLowerCase() || "";
      const title = c?.title?.toLowerCase() || "";
      const cardName = c?.cardName?.toLowerCase() || "";
      const code = c?.code?.toLowerCase() || "";
      return storeName.includes(q) || title.includes(q) || code.includes(q) || cardName.includes(q);
    });
  }, [coupons, search]);

  // Store Suggestion Logic
  const filteredStores = useMemo(() => {
    if (!storeSearch) return stores;
    return stores.filter(s => 
      s.name.toLowerCase().includes(storeSearch.toLowerCase())
    );
  }, [stores, storeSearch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = { 
        ...form, 
        discountValue: Number(form.discountValue || 0),
        link: form.affiliateUrl,
        expiryDate: form.expiryDate || null 
      };

      if (editingId) {
        await api.put(`/coupons/${editingId}`, payload);
      } else {
        await api.post("/coupons", payload);
      }
      
      resetForm();
      await loadAll();
    } catch (err) {
      setError(err.response?.data?.message || "Database Error: Failed to commit offer");
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (coupon) => {
    setEditingId(coupon._id);
    setStoreSearch(coupon?.store?.name || "");
    setForm({
      store: coupon?.store?._id || "",
      title: coupon?.title || "",
      cardName: coupon?.cardName || "",
      code: coupon?.code || "",
      description: coupon?.description || "",
      discountType: coupon?.discountType || "PERCENT",
      discountValue: coupon?.discountValue || 0,
      expiryDate: coupon?.expiryDate ? new Date(coupon.expiryDate).toISOString().slice(0, 10) : "",
      affiliateUrl: coupon?.link || "", 
      isActive: coupon?.isActive ?? true,
      featured: coupon?.featured ?? false,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id) => {
    if (!confirm("Remove this offer?")) return;
    try {
      await api.delete(`/coupons/${id}`);
      await loadAll();
    } catch (err) {
      setError("Action Failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 p-6 font-inter">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/50 pb-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase underline decoration-violet-500">Offers Console</h1>
          <p className="text-slate-500 font-medium">Manage promo codes and brand badges.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="bg-slate-950/40 border border-slate-800/60 pl-12 pr-4 py-3.5 rounded-2xl text-slate-100 outline-none w-64 text-sm focus:border-violet-500/50" />
          </div>
          <button onClick={() => { if(showForm) resetForm(); else setShowForm(true); }} className="bg-violet-600 hover:bg-violet-500 text-white px-7 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-lg shadow-violet-600/20">
            {showForm ? <X size={18} /> : <Plus size={18} />}
            {showForm ? "Cancel" : "New Offer"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl text-rose-500 text-sm font-bold">
          {error}
        </div>
      )}

      {/* Form Section */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-gradient-to-br from-slate-800/20 to-slate-900/20 border border-slate-800/60 rounded-[2.8rem] p-1">
            <form onSubmit={handleSubmit} className="bg-[#0b1222] rounded-[2.6rem] p-10 border border-slate-700/30">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Searchable Store Selection */}
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Assigned Store</label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={storeSearch}
                      onChange={(e) => {
                        setStoreSearch(e.target.value);
                        setShowStoreDropdown(true);
                      }}
                      onFocus={() => setShowStoreDropdown(true)}
                      placeholder="TYPE TO SEARCH STORE..."
                      className="w-full bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60 text-slate-200 outline-none text-sm uppercase"
                      required
                    />
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" size={18} />
                  </div>

                  {/* Dropdown Suggestion List */}
                  {showStoreDropdown && (
                    <div className="absolute z-50 w-full mt-2 bg-[#161e2e] border border-slate-700 rounded-2xl max-h-60 overflow-y-auto shadow-2xl">
                      {filteredStores.length > 0 ? (
                        filteredStores.map(s => (
                          <div 
                            key={s._id}
                            onClick={() => {
                              setForm({...form, store: s._id});
                              setStoreSearch(s.name.toUpperCase());
                              setShowStoreDropdown(false);
                            }}
                            className="p-4 hover:bg-violet-600 text-slate-200 text-xs font-bold cursor-pointer transition-colors border-b border-slate-800/50 last:border-0"
                          >
                            {s.name.toUpperCase()}
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-slate-500 text-xs italic">No stores found...</div>
                      )}
                    </div>
                  )}
                  {/* Click outside closer helper */}
                  {showStoreDropdown && <div className="fixed inset-0 z-40" onClick={() => setShowStoreDropdown(false)} />}
                </div>

                {/* Card Badge Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Card Badge (e.g. 50% OFF)</label>
                  <input value={form.cardName} onChange={(e) => setForm({...form, cardName: e.target.value})} placeholder="e.g. 70% OFF" className="w-full bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60 text-amber-500 font-black outline-none text-sm uppercase" />
                </div>

                {/* Promo Code */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Promo Code</label>
                  <input value={form.code} onChange={(e) => setForm({...form, code: e.target.value})} placeholder="e.g. SAVE20" className="w-full bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60 text-violet-400 font-black outline-none text-sm uppercase" />
                </div>

                {/* Headline */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Headline Title</label>
                  <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="e.g. Flat 30% Off" className="w-full bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60 text-slate-200 outline-none text-sm focus:border-violet-500/50" required />
                </div>

                {/* FEATURED TOGGLE */}
                <div className="md:col-span-2 bg-slate-950/40 p-6 rounded-[2rem] border border-slate-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl transition-all ${form.featured ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-800 text-slate-500'}`}>
                      <Star size={20} fill={form.featured ? "currentColor" : "none"} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-white uppercase tracking-wider">Featured Offer</p>
                      <p className="text-[11px] text-slate-500 font-medium italic">If active, this deal will appear on the Home Page Top 20.</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setForm({...form, featured: !form.featured})}
                    className={`w-14 h-8 rounded-full transition-all relative ${form.featured ? 'bg-violet-600' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${form.featured ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                {/* Affiliate URL */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Affiliate URL</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input value={form.affiliateUrl} onChange={(e) => setForm({...form, affiliateUrl: e.target.value})} placeholder="https://..." className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-950/40 border border-slate-800/60 text-slate-200 outline-none text-sm focus:border-violet-500/50" required />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={saving} className="mt-12 w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-violet-600/20">
                {saving ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={18} />}
                {editingId ? "Update Coupon" : "Deploy Coupon"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List section */}
      <div className="grid grid-cols-1 gap-5">
        {loading ? (
          <Loader2 className="animate-spin mx-auto text-violet-500" size={40} />
        ) : filteredCoupons.map((c) => (
          <motion.div layout key={c._id} className="bg-[#0f172a]/60 border border-slate-800/50 p-6 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-violet-500/30 transition-all hover:bg-slate-900/40">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-black text-white group-hover:text-violet-400 transition-colors uppercase tracking-tight">{c.title}</h3>
                {c.featured && (
                  <div className="flex items-center gap-1 bg-amber-500/10 text-amber-500 px-2 py-1 rounded-lg border border-amber-500/20">
                    <Star size={12} fill="currentColor" />
                    <span className="text-[9px] font-black uppercase">Featured</span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {c.cardName && (
                  <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-sm">
                    {c.cardName}
                  </span>
                )}
                <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                  {c.code || "NO CODE"}
                </span>
                <span className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase px-3 py-1.5 bg-slate-950/50 border border-slate-800/60 rounded-full">
                  <Store size={10} /> {c?.store?.name}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => onEdit(c)} className="p-3.5 rounded-xl bg-slate-800/40 text-slate-400 hover:text-white hover:bg-violet-600 transition-all"><Edit3 size={18} /></button>
              <button onClick={() => onDelete(c._id)} className="p-3.5 rounded-xl bg-slate-800/40 text-slate-500 hover:text-white hover:bg-rose-600 transition-all"><Trash2 size={18} /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}