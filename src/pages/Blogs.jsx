// import { useEffect, useState } from "react";
// import api from "../api/axios";
// import { getAccessToken } from "../auth/authStorage";
// import { 
//   FileText, 
//   Plus, 
//   Trash2, 
//   Edit3, 
//   Link, 
//   Image as ImageIcon, 
//   Loader2, 
//   Eye, 
//   Hash, 
//   CheckCircle2, 
//   X 
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// export default function Blogs() {
//   const token = getAccessToken();
//   const headers = { Authorization: `Bearer ${token}` };

//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingId, setEditingId] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [form, setForm] = useState({
//     title: "", slug: "", excerpt: "", content: "", coverImage: "", tagsText: "", isActive: true, featured: false
//   });

//   const loadBlogs = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get("/blogs", { headers });
//       setBlogs(Array.isArray(res.data) ? res.data : []);
//     } catch (err) { console.error(err); }
//     finally { setLoading(false); }
//   };

//   useEffect(() => { loadBlogs(); }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const payload = {
//       ...form,
//       image: form.coverImage,
//       tags: form.tagsText.split(",").map(t => t.trim()).filter(Boolean)
//     };

//     try {
//       if (editingId) {
//         await api.put(`/blogs/${editingId}`, payload, { headers });
//       } else {
//         await api.post("/blogs", payload, { headers });
//       }
//       resetForm();
//       loadBlogs();
//     } catch (err) { alert(err.response?.data?.message || "Error saving blog"); }
//   };

//   const resetForm = () => {
//     setForm({ title: "", slug: "", excerpt: "", content: "", coverImage: "", tagsText: "", isActive: true, featured: false });
//     setEditingId(null);
//     setShowForm(false);
//   };

//   const onDelete = async (id) => {
//     if (!confirm("Remove this article permanently?")) return;
//     try {
//       await api.delete(`/blogs/${id}`, { headers });
//       loadBlogs();
//     } catch (err) { console.error(err); }
//   };

//   const getImageUrl = (img) => {
//     if (!img) return "https://placehold.co/600x400?text=No+Image";
//     return img.startsWith('http') || img.startsWith('data:') 
//       ? img 
//       : `http://localhost:5000/${img.replace(/^\//, '')}`;
//   };

//   return (
//     <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      
//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
//         <div>
//           <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">Editorial</h1>
//           <p className="text-slate-500 font-medium">Draft and publish articles for your audience.</p>
//         </div>
//         <button 
//           onClick={() => { setShowForm(!showForm); if(!showForm) setEditingId(null); }}
//           className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
//         >
//           {showForm ? <X size={18} /> : <Plus size={18} />}
//           {showForm ? "Close Editor" : "New Article"}
//         </button>
//       </div>

//       {/* FORM SECTION */}
//       <AnimatePresence>
//         {showForm && (
//           <motion.div 
//             initial={{ opacity: 0, y: -20 }} 
//             animate={{ opacity: 1, y: 0 }} 
//             exit={{ opacity: 0, y: -20 }}
//             className="bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl rounded-[2.5rem] p-1 shadow-2xl"
//           >
//             <form onSubmit={handleSubmit} className="bg-[#0f172a] rounded-[2.2rem] p-8 border border-slate-800/50">
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
//                 {/* Left Side: Inputs */}
//                 <div className="lg:col-span-2 space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-2">
//                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Article Title</label>
//                       <input className="w-full bg-slate-950/50 p-4 rounded-2xl border border-slate-800 text-white outline-none focus:border-indigo-500/50" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Best 50% Off Deals" required />
//                     </div>
//                     <div className="space-y-2">
//                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">URL Slug</label>
//                       <input className="w-full bg-slate-950/50 p-4 rounded-2xl border border-slate-800 text-indigo-400 outline-none focus:border-indigo-500/50 font-mono" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} placeholder="best-deals-2024" required />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Cover Image URL</label>
//                     <div className="relative">
//                       <Link className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
//                       <input className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-950/50 border border-slate-800 text-white outline-none focus:border-indigo-500/50" value={form.coverImage} onChange={e => setForm({...form, coverImage: e.target.value})} placeholder="https://image-link.com/photo.jpg" />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Blog Content (Markdown supported)</label>
//                     <textarea className="w-full bg-slate-950/50 p-4 rounded-2xl border border-slate-800 text-slate-300 outline-none focus:border-indigo-500/50 min-h-[250px] leading-relaxed" value={form.content} onChange={e => setForm({...form, content: e.target.value})} placeholder="Start writing your story..." />
//                   </div>
//                 </div>

//                 {/* Right Side: Preview & Settings */}
//                 <div className="space-y-6">
//                   <div className="bg-slate-950/50 rounded-[2rem] border border-slate-800 p-6 space-y-4">
//                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Live Cover Preview</label>
//                     <div className="aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center">
//                       {form.coverImage ? (
//                         <img src={getImageUrl(form.coverImage)} className="w-full h-full object-cover" alt="Preview" />
//                       ) : (
//                         <ImageIcon size={40} className="text-slate-800" />
//                       )}
//                     </div>
//                     <div className="space-y-2">
//                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Tags (Comma separated)</label>
//                       <div className="relative">
//                         <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
//                         <input className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-indigo-500/50 text-sm" value={form.tagsText} onChange={e => setForm({...form, tagsText: e.target.value})} placeholder="deals, promo, shoes" />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex flex-col gap-4 px-4">
//                     <label className="flex items-center gap-3 cursor-pointer group">
//                       <input type="checkbox" className="w-5 h-5 rounded-lg bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} />
//                       <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">Published</span>
//                     </label>
//                     <label className="flex items-center gap-3 cursor-pointer group">
//                       <input type="checkbox" className="w-5 h-5 rounded-lg bg-slate-950 border-slate-800 text-amber-500 focus:ring-0" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} />
//                       <span className="text-sm font-bold text-slate-400 group-hover:text-amber-500 transition-colors">Featured Story</span>
//                     </label>
//                   </div>

//                   <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2">
//                     <CheckCircle2 size={20} />
//                     {editingId ? "Update Content" : "Publish Now"}
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* LIST SECTION */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {loading ? (
//           <div className="col-span-full flex flex-col items-center py-20 space-y-4">
//             <Loader2 className="animate-spin text-indigo-500" size={40} />
//             <p className="text-slate-500 font-bold tracking-widest text-xs uppercase">Syncing Articles...</p>
//           </div>
//         ) : blogs.length === 0 ? (
//           <div className="col-span-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-[3rem] text-slate-600">
//             <FileText size={48} strokeWidth={1} className="mb-4" />
//             <p className="font-medium">The editorial is empty. Draft your first blog!</p>
//           </div>
//         ) : (
//           blogs.map(b => (
//             <motion.div 
//               layout key={b._id}
//               className="group bg-slate-900/40 border border-slate-800/60 rounded-[2.5rem] overflow-hidden hover:border-indigo-500/40 transition-all duration-500 flex flex-col"
//             >
//               <div className="aspect-[16/9] relative overflow-hidden bg-slate-950">
//                 <img src={getImageUrl(b.image)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={b.title} />
//                 {!b.isActive && (
//                   <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-slate-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-700">
//                     Draft
//                   </div>
//                 )}
//                 {b.featured && (
//                    <div className="absolute top-4 right-4 bg-amber-500 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
//                    Featured
//                  </div>
//                 )}
//               </div>

//               <div className="p-6 flex-1 flex flex-col">
//                 <h3 className="text-xl font-black text-white leading-tight mb-2 group-hover:text-indigo-400 transition-colors line-clamp-2">
//                   {b.title}
//                 </h3>
//                 <p className="text-xs text-slate-500 font-mono mb-4">/{b.slug}</p>
                
//                 <div className="flex flex-wrap gap-2 mb-6">
//                   {b.tags?.slice(0, 3).map((tag, idx) => (
//                     <span key={idx} className="text-[9px] font-bold text-slate-400 bg-slate-950 px-2 py-1 rounded-md border border-slate-800 uppercase tracking-tighter">
//                       #{tag}
//                     </span>
//                   ))}
//                 </div>

//                 <div className="mt-auto pt-4 border-t border-slate-800/50 flex gap-2">
//                   <button 
//                     onClick={() => { 
//                       setEditingId(b._id); 
//                       setForm({...b, coverImage: b.image, tagsText: b.tags?.join(",")}); 
//                       setShowForm(true);
//                       window.scrollTo({ top: 0, behavior: 'smooth' });
//                     }} 
//                     className="flex-1 p-3 bg-slate-800/50 text-slate-400 hover:text-white hover:bg-indigo-600 rounded-xl transition-all flex items-center justify-center gap-2 font-bold text-xs uppercase"
//                   >
//                     <Edit3 size={14} /> Edit
//                   </button>
//                   <button 
//                     onClick={() => onDelete(b._id)} 
//                     className="p-3 bg-slate-800/50 text-slate-400 hover:text-white hover:bg-rose-600 rounded-xl transition-all"
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import api from "../api/axios";
import { getAccessToken } from "../auth/authStorage";
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Link, 
  Image as ImageIcon, 
  Loader2, 
  Hash, 
  CheckCircle2, 
  X 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Blogs() {
  const token = getAccessToken();
  const headers = { Authorization: `Bearer ${token}` };

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "", coverImage: "", tagsText: "", isActive: true, featured: false
  });

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/blogs", { headers });
      setBlogs(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadBlogs(); }, []);

  const resetForm = () => {
    setForm({ title: "", slug: "", excerpt: "", content: "", coverImage: "", tagsText: "", isActive: true, featured: false });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Safety: Ensure tagsText is a string before splitting
    const tagsArray = (form.tagsText || "").toString().split(",").map(t => t.trim()).filter(Boolean);

    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      content: form.content,
      image: form.coverImage,
      tags: tagsArray,
      isActive: form.isActive,
      featured: form.featured
    };

    try {
      if (editingId) {
        await api.put(`/blogs/${editingId}`, payload, { headers });
      } else {
        await api.post("/blogs", payload, { headers });
      }
      resetForm();
      loadBlogs();
    } catch (err) { 
      alert(err.response?.data?.message || "Error saving blog"); 
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Remove this article permanently?")) return;
    try {
      await api.delete(`/blogs/${id}`, { headers });
      loadBlogs();
    } catch (err) { console.error(err); }
  };

  const getImageUrl = (img) => {
    if (!img) return "https://placehold.co/600x400?text=No+Image";
    return img.startsWith('http') || img.startsWith('data:') 
      ? img 
      : `http://localhost:5000/${img.replace(/^\//, '')}`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">Editorial</h1>
          <p className="text-slate-500 font-medium">Draft and publish articles for your audience.</p>
        </div>
        <button 
          type="button"
          onClick={() => { 
            if (showForm) {
              resetForm();
            } else {
              setEditingId(null);
              setForm({ title: "", slug: "", excerpt: "", content: "", coverImage: "", tagsText: "", isActive: true, featured: false });
              setShowForm(true);
            }
          }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Close Editor" : "New Article"}
        </button>
      </div>

      {/* FORM SECTION */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className="bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl rounded-[2.5rem] p-1 shadow-2xl"
          >
            {/* Form tag wraps everything and handles submission */}
            <form onSubmit={handleSubmit} className="bg-[#0f172a] rounded-[2.2rem] p-8 border border-slate-800/50">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Side: Inputs */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Article Title</label>
                      <input className="w-full bg-slate-950/50 p-4 rounded-2xl border border-slate-800 text-white outline-none focus:border-indigo-500/50" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Best 50% Off Deals" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">URL Slug</label>
                      <input className="w-full bg-slate-950/50 p-4 rounded-2xl border border-slate-800 text-indigo-400 outline-none focus:border-indigo-500/50 font-mono" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} placeholder="best-deals-2024" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Cover Image URL</label>
                    <div className="relative">
                      <Link className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                      <input className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-950/50 border border-slate-800 text-white outline-none focus:border-indigo-500/50" value={form.coverImage} onChange={e => setForm({...form, coverImage: e.target.value})} placeholder="https://image-link.com/photo.jpg" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Blog Content</label>
                    <textarea className="w-full bg-slate-950/50 p-4 rounded-2xl border border-slate-800 text-slate-300 outline-none focus:border-indigo-500/50 min-h-[250px] leading-relaxed" value={form.content} onChange={e => setForm({...form, content: e.target.value})} placeholder="Start writing your story..." />
                  </div>
                </div>

                {/* Right Side: Preview & Settings */}
                <div className="space-y-6">
                  <div className="bg-slate-950/50 rounded-[2rem] border border-slate-800 p-6 space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Live Cover Preview</label>
                    <div className="aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center">
                      {form.coverImage ? (
                        <img src={getImageUrl(form.coverImage)} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <ImageIcon size={40} className="text-slate-800" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Tags (Comma separated)</label>
                      <div className="relative">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                        <input className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-indigo-500/50 text-sm" value={form.tagsText} onChange={e => setForm({...form, tagsText: e.target.value})} placeholder="deals, promo" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 px-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 rounded-lg bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} />
                      <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">Published</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 rounded-lg bg-slate-950 border-slate-800 text-amber-500 focus:ring-0" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} />
                      <span className="text-sm font-bold text-slate-400 group-hover:text-amber-500 transition-colors">Featured Story</span>
                    </label>
                  </div>

                  {/* Submission Button */}
                  <button 
                    type="submit" 
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={20} />
                    {editingId ? "Update Content" : "Publish Now"}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIST SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {loading ? (
          <div className="col-span-full flex flex-col items-center py-20 space-y-4">
            <Loader2 className="animate-spin text-indigo-500" size={40} />
            <p className="text-slate-500 font-bold tracking-widest text-xs uppercase">Syncing Articles...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="col-span-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-[3rem] text-slate-600">
            <FileText size={48} strokeWidth={1} className="mb-4" />
            <p className="font-medium">The editorial is empty. Draft your first blog!</p>
          </div>
        ) : (
          blogs.map(b => (
            <motion.div 
              layout key={b._id}
              className="group bg-slate-900/40 border border-slate-800/60 rounded-[2.5rem] overflow-hidden hover:border-indigo-500/40 transition-all duration-500 flex flex-col"
            >
              <div className="aspect-[16/9] relative overflow-hidden bg-slate-950">
                <img src={getImageUrl(b.image)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={b.title} />
                {!b.isActive && (
                  <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-slate-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-700">
                    Draft
                  </div>
                )}
                {b.featured && (
                   <div className="absolute top-4 right-4 bg-amber-500 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                   Featured
                 </div>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-black text-white leading-tight mb-2 group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {b.title}
                </h3>
                <p className="text-xs text-slate-500 font-mono mb-4">/{b.slug}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {b.tags?.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="text-[9px] font-bold text-slate-400 bg-slate-950 px-2 py-1 rounded-md border border-slate-800 uppercase tracking-tighter">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-4 border-t border-slate-800/50 flex gap-2">
                  <button 
                    type="button"
                    onClick={() => { 
                      setEditingId(b._id); 
                      setForm({
                        title: b.title || "",
                        slug: b.slug || "",
                        excerpt: b.excerpt || "",
                        content: b.content || "",
                        coverImage: b.image || "",
                        tagsText: Array.isArray(b.tags) ? b.tags.join(", ") : "",
                        isActive: b.isActive ?? true,
                        featured: b.featured ?? false
                      }); 
                      setShowForm(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    className="flex-1 p-3 bg-slate-800/50 text-slate-400 hover:text-white hover:bg-indigo-600 rounded-xl transition-all flex items-center justify-center gap-2 font-bold text-xs uppercase"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button 
                    type="button"
                    onClick={() => onDelete(b._id)} 
                    className="p-3 bg-slate-800/50 text-slate-400 hover:text-white hover:bg-rose-600 rounded-xl transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}