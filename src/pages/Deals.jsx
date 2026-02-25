// import { useEffect, useMemo, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import api from "../api/axios";
// import { 
//   Zap, Search, Plus, Edit3, Trash2, Store, Tag, 
//   Link as LinkIcon, Loader2, CheckCircle2, X, Star, BadgeCheck
// } from "lucide-react";

// export default function Deals() {
//   const [loading, setLoading] = useState(true);
//   const [stores, setStores] = useState([]); // Stores for dropdown
//   const [deals, setDeals] = useState([]);   // Deals for list
//   const [search, setSearch] = useState("");
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [editingId, setEditingId] = useState(null);
//   const [showForm, setShowForm] = useState(false);

//   // ✅ Deals specific form (CardName added for searching like '50% OFF')
//   const [form, setForm] = useState({
//     store: "", title: "", cardName: "", description: "",
//     discountType: "PERCENT", discountValue: 0,
//     affiliateUrl: "", isActive: true, featured: false,
//   });

//   // ✅ Fetching both Stores (for dropdown) and Deals (for list)
//   const loadAll = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const [storesRes, dealsRes] = await Promise.all([
//         api.get("/stores"),
//         api.get("/deals"), // Backend route for deals
//       ]);
//       setStores(storesRes.data || []);
//       setDeals(dealsRes.data || []);
//     } catch (err) {
//       setError("Sync Error: Failed to fetch records");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { loadAll(); }, []);

//   const resetForm = () => {
//     setEditingId(null);
//     setShowForm(false);
//     setForm({
//       store: "", title: "", cardName: "", description: "",
//       discountType: "PERCENT", discountValue: 0,
//       affiliateUrl: "", isActive: true, featured: false,
//     });
//   };

//   // ✅ Search logic: Title, Store, and CardName (50% OFF)
//   const filteredDeals = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     if (!q) return deals;
//     return deals.filter((d) => {
//       const storeName = d?.store?.name?.toLowerCase() || "";
//       const title = d?.title?.toLowerCase() || "";
//       const cardName = d?.cardName?.toLowerCase() || "";
//       return storeName.includes(q) || title.includes(q) || cardName.includes(q);
//     });
//   }, [deals, search]);

//   const submit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setError("");
//     try {
//       // payload link rename for backend if necessary
//       const payload = { ...form, link: form.affiliateUrl }; 
//       if (editingId) {
//         await api.put(`/deals/${editingId}`, payload);
//       } else {
//         await api.post("/deals", payload);
//       }
//       resetForm();
//       await loadAll();
//     } catch (err) {
//       setError("Database Error: Failed to commit deal");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const onEdit = (deal) => {
//     setEditingId(deal._id);
//     setForm({
//       store: deal?.store?._id || "",
//       title: deal?.title || "",
//       cardName: deal?.cardName || "",
//       description: deal?.description || "",
//       discountType: deal?.discountType || "PERCENT",
//       discountValue: deal?.discountValue || 0,
//       affiliateUrl: deal?.link || "", 
//       isActive: deal?.isActive ?? true,
//       featured: deal?.featured ?? false,
//     });
//     setShowForm(true);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const onDelete = async (id) => {
//     if (!confirm("Remove this deal?")) return;
//     try {
//       await api.delete(`/deals/${id}`);
//       await loadAll();
//     } catch (err) {
//       setError("Action Failed: Could not delete record");
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 p-4">
      
//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/50 pb-8">
//         <div>
//           <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase underline decoration-emerald-500">Deals Console</h1>
//           <p className="text-slate-500 font-medium">Flash offers & discounts (No Coupon Codes Required)</p>
//         </div>
//         <div className="flex items-center gap-4">
//           <div className="relative group hidden md:block">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-400" size={18} />
//             <input
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search 50% or Brand..."
//               className="bg-slate-950/40 border border-slate-800/60 pl-12 pr-4 py-3.5 rounded-2xl text-slate-100 outline-none transition-all w-64 text-sm"
//             />
//           </div>
//           <button 
//             onClick={() => { setShowForm(!showForm); if(!showForm) setEditingId(null); }}
//             className="bg-emerald-600 hover:bg-emerald-500 text-white px-7 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-emerald-900/20"
//           >
//             {showForm ? <X size={18} /> : <Plus size={18} />}
//             {showForm ? "Cancel" : "New Deal"}
//           </button>
//         </div>
//       </div>

//       {/* Form Section */}
//       <AnimatePresence>
//         {showForm && (
//           <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
//             className="bg-gradient-to-br from-slate-800/20 to-slate-900/20 border border-slate-800/60 rounded-[2.5rem] p-1"
//           >
//             <form onSubmit={submit} className="bg-[#0b1222] rounded-[2.3rem] p-8 border border-slate-700/30">
//               <div className="flex items-center gap-4 mb-8">
//                 <div className="h-10 w-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400">
//                   <Zap size={20} />
//                 </div>
//                 <h2 className="text-xl font-black text-white uppercase">{editingId ? "Update Flash Deal" : "New Entity Creation"}</h2>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* 1. Store Selection - FIXED LOGIC */}
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Brand</label>
//                   <select 
//                     value={form.store} 
//                     onChange={(e) => setForm({...form, store: e.target.value})} 
//                     className="w-full bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-slate-200 outline-none focus:border-emerald-500/50 text-sm" 
//                     required
//                   >
//                     <option value="">SELECT A STORE...</option>
//                     {stores.map(s => <option key={s._id} value={s._id}>{s.name.toUpperCase()}</option>)}
//                   </select>
//                 </div>

//                 {/* 2. Card Name (Searching Field) */}
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Card Badge (e.g. 50% OFF)</label>
//                   <input value={form.cardName} onChange={(e) => setForm({...form, cardName: e.target.value})} placeholder="50% OFF" className="w-full bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-emerald-400 font-black outline-none focus:border-emerald-500 text-sm placeholder:text-slate-800" required />
//                 </div>

//                 {/* 3. Headline */}
//                 <div className="space-y-2 md:col-span-2">
//                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Public Headline Title</label>
//                   <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="e.g. Flat 50% Off On All Winter Collection" className="w-full bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-slate-200 outline-none focus:border-emerald-500/50 text-sm" required />
//                 </div>

//                 {/* 4. Affiliate URL */}
//                 <div className="space-y-2 md:col-span-2">
//                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Redirect Target (Link)</label>
//                   <div className="relative">
//                     <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
//                     <input value={form.affiliateUrl} onChange={(e) => setForm({...form, affiliateUrl: e.target.value})} placeholder="https://brand.com/deal-page" className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-200 outline-none text-sm" required />
//                   </div>
//                 </div>

//                 {/* 5. Status & Featured */}
//                 <div className="flex gap-6 md:col-span-2 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
//                    <label className="flex items-center gap-3 cursor-pointer">
//                       <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-600 focus:ring-0" />
//                       <span className="text-[10px] font-black text-slate-400 uppercase">Live Status</span>
//                    </label>
//                    <label className="flex items-center gap-3 cursor-pointer">
//                       <input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0" />
//                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Feature on Home</span>
//                    </label>
//                 </div>
//               </div>

//               <button type="submit" disabled={saving} className="mt-8 w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/20">
//                 {saving ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={18} />}
//                 {editingId ? "Commit Changes" : "Deploy Flash Offer"}
//               </button>
//             </form>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* List Display */}
//       <div className="grid grid-cols-1 gap-4">
//         {loading ? (
//           <div className="flex flex-col items-center py-20">
//             <Loader2 className="animate-spin text-emerald-500 mb-4" size={40} />
//             <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">Loading Database...</p>
//           </div>
//         ) : (
//           filteredDeals.map((d) => (
//             <motion.div layout key={d._id} className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-emerald-500/20 transition-all duration-300">
//               <div className="flex-1 space-y-3 w-full">
//                 <div className="flex items-center gap-3">
//                   <h3 className="text-lg font-bold text-white uppercase group-hover:text-emerald-400 transition-colors">{d.title}</h3>
//                   {d.featured && <Star size={14} className="text-amber-500 fill-amber-500" />}
//                 </div>
                
//                 <div className="flex flex-wrap gap-2">
//                   <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full uppercase tracking-tighter">
//                     {d.cardName}
//                   </span>
//                   <span className="flex items-center gap-2 text-[9px] font-black text-slate-500 bg-slate-950 px-3 py-1 rounded-full border border-slate-800 uppercase">
//                     <Store size={10} /> {d?.store?.name}
//                   </span>
//                   <span className="flex items-center gap-2 text-[9px] font-black text-slate-500 bg-slate-950 px-3 py-1 rounded-full border border-slate-800 uppercase italic">
//                     <BadgeCheck size={10} className="text-emerald-500" /> Verified
//                   </span>
//                 </div>
//               </div>
              
//               <div className="flex gap-2">
//                 <button onClick={() => onEdit(d)} className="p-3 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-emerald-600 transition-all"><Edit3 size={18} /></button>
//                 <button onClick={() => onDelete(d._id)} className="p-3 rounded-xl bg-slate-800 text-slate-500 hover:text-white hover:bg-rose-600 transition-all"><Trash2 size={18} /></button>
//               </div>
//             </motion.div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }


import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import { 
  Zap, Search, Plus, Edit3, Trash2, Store, Tag, 
  Link as LinkIcon, Loader2, CheckCircle2, X, Star, BadgeCheck, ChevronDown
} from "lucide-react";

export default function Deals() {
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState([]); 
  const [deals, setDeals] = useState([]);   
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Store Search & Suggestion States
  const [storeSearch, setStoreSearch] = useState("");
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);

  const [form, setForm] = useState({
    store: "", title: "", cardName: "", description: "",
    discountType: "PERCENT", discountValue: 0,
    affiliateUrl: "", isActive: true, featured: false,
  });

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [storesRes, dealsRes] = await Promise.all([
        api.get("/stores"),
        api.get("/deals"), 
      ]);
      setStores(storesRes.data || []);
      setDeals(dealsRes.data || []);
    } catch (err) {
      setError("Sync Error: Failed to fetch records");
      console.error(err);
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
      store: "", title: "", cardName: "", description: "",
      discountType: "PERCENT", discountValue: 0,
      affiliateUrl: "", isActive: true, featured: false,
    });
  };

  const filteredDeals = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return deals;
    return deals.filter((d) => {
      const storeName = d?.store?.name?.toLowerCase() || "";
      const title = d?.title?.toLowerCase() || "";
      const cardName = d?.cardName?.toLowerCase() || "";
      return storeName.includes(q) || title.includes(q) || cardName.includes(q);
    });
  }, [deals, search]);

  // Store Suggestion Logic for Form
  const filteredStores = useMemo(() => {
    if (!storeSearch) return stores;
    return stores.filter(s => 
      s.name.toLowerCase().includes(storeSearch.toLowerCase())
    );
  }, [stores, storeSearch]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, link: form.affiliateUrl }; 
      if (editingId) {
        await api.put(`/deals/${editingId}`, payload);
      } else {
        await api.post("/deals", payload);
      }
      resetForm();
      await loadAll();
    } catch (err) {
      setError("Database Error: Failed to commit deal");
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (deal) => {
    setEditingId(deal._id);
    setStoreSearch(deal?.store?.name || ""); // Set store name in search box
    setForm({
      store: deal?.store?._id || "",
      title: deal?.title || "",
      cardName: deal?.cardName || "",
      description: deal?.description || "",
      discountType: deal?.discountType || "PERCENT",
      discountValue: deal?.discountValue || 0,
      affiliateUrl: deal?.link || "", 
      isActive: deal?.isActive ?? true,
      featured: deal?.featured ?? false,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id) => {
    if (!confirm("Remove this deal?")) return;
    try {
      await api.delete(`/deals/${id}`);
      await loadAll();
    } catch (err) {
      setError("Action Failed: Could not delete record");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 p-4">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/50 pb-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase underline decoration-emerald-500">Deals Console</h1>
          <p className="text-slate-500 font-medium">Flash offers & discounts (No Coupon Codes Required)</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-400" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search 50% or Brand..."
              className="bg-slate-950/40 border border-slate-800/60 pl-12 pr-4 py-3.5 rounded-2xl text-slate-100 outline-none transition-all w-64 text-sm"
            />
          </div>
          <button 
            onClick={() => { if(showForm) resetForm(); else setShowForm(true); }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-7 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-emerald-900/20"
          >
            {showForm ? <X size={18} /> : <Plus size={18} />}
            {showForm ? "Cancel" : "New Deal"}
          </button>
        </div>
      </div>

      {/* Form Section */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-slate-800/20 to-slate-900/20 border border-slate-800/60 rounded-[2.5rem] p-1"
          >
            <form onSubmit={submit} className="bg-[#0b1222] rounded-[2.3rem] p-8 border border-slate-700/30">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-10 w-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400">
                  <Zap size={20} />
                </div>
                <h2 className="text-xl font-black text-white uppercase">{editingId ? "Update Flash Deal" : "New Entity Creation"}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Searchable Store Selection */}
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Brand</label>
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
                      className="w-full bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-slate-200 outline-none focus:border-emerald-500/50 text-sm uppercase"
                      required
                    />
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" size={18} />
                  </div>

                  {/* Dropdown Suggestions */}
                  {showStoreDropdown && (
                    <div className="absolute z-50 w-full mt-2 bg-[#161e2e] border border-slate-700 rounded-xl max-h-60 overflow-y-auto shadow-2xl">
                      {filteredStores.length > 0 ? (
                        filteredStores.map(s => (
                          <div 
                            key={s._id}
                            onClick={() => {
                              setForm({...form, store: s._id});
                              setStoreSearch(s.name.toUpperCase());
                              setShowStoreDropdown(false);
                            }}
                            className="p-4 hover:bg-emerald-600 text-slate-200 text-xs font-bold cursor-pointer transition-colors border-b border-slate-800/50 last:border-0 uppercase"
                          >
                            {s.name}
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-slate-500 text-xs italic text-center">No brands found...</div>
                      )}
                    </div>
                  )}
                  {/* Click outside to close helper */}
                  {showStoreDropdown && <div className="fixed inset-0 z-40" onClick={() => setShowStoreDropdown(false)} />}
                </div>

                {/* 2. Card Name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Card Badge (e.g. 50% OFF)</label>
                  <input value={form.cardName} onChange={(e) => setForm({...form, cardName: e.target.value})} placeholder="50% OFF" className="w-full bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-emerald-400 font-black outline-none focus:border-emerald-500 text-sm placeholder:text-slate-800" required />
                </div>

                {/* 3. Headline */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Public Headline Title</label>
                  <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="e.g. Flat 50% Off On All Winter Collection" className="w-full bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-slate-200 outline-none focus:border-emerald-500/50 text-sm" required />
                </div>

                {/* 4. Affiliate URL */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Redirect Target (Link)</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                    <input value={form.affiliateUrl} onChange={(e) => setForm({...form, affiliateUrl: e.target.value})} placeholder="https://brand.com/deal-page" className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-200 outline-none text-sm" required />
                  </div>
                </div>

                {/* 5. Status & Featured */}
                <div className="flex gap-6 md:col-span-2 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
                   <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-600 focus:ring-0" />
                      <span className="text-[10px] font-black text-slate-400 uppercase">Live Status</span>
                   </label>
                   <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Feature on Home</span>
                   </label>
                </div>
              </div>

              <button type="submit" disabled={saving} className="mt-8 w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/20">
                {saving ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={18} />}
                {editingId ? "Commit Changes" : "Deploy Flash Offer"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List Display */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="flex flex-col items-center py-20">
            <Loader2 className="animate-spin text-emerald-500 mb-4" size={40} />
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">Loading Database...</p>
          </div>
        ) : (
          filteredDeals.map((d) => (
            <motion.div layout key={d._id} className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-emerald-500/20 transition-all duration-300">
              <div className="flex-1 space-y-3 w-full">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-white uppercase group-hover:text-emerald-400 transition-colors">{d.title}</h3>
                  {d.featured && <Star size={14} className="text-amber-500 fill-amber-500" />}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full uppercase tracking-tighter">
                    {d.cardName}
                  </span>
                  <span className="flex items-center gap-2 text-[9px] font-black text-slate-500 bg-slate-950 px-3 py-1 rounded-full border border-slate-800 uppercase">
                    <Store size={10} /> {d?.store?.name}
                  </span>
                  <span className="flex items-center gap-2 text-[9px] font-black text-slate-500 bg-slate-950 px-3 py-1 rounded-full border border-slate-800 uppercase italic">
                    <BadgeCheck size={10} className="text-emerald-500" /> Verified
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button onClick={() => onEdit(d)} className="p-3 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-emerald-600 transition-all"><Edit3 size={18} /></button>
                <button onClick={() => onDelete(d._id)} className="p-3 rounded-xl bg-slate-800 text-slate-500 hover:text-white hover:bg-rose-600 transition-all"><Trash2 size={18} /></button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}