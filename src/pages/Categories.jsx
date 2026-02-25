import { useEffect, useState } from "react";
import api from "../api/axios";
import { Plus, Trash2, Edit3, Loader2, X, Tag, LayoutGrid, Image as ImageIcon, Hash, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState(""); 
  const [editId, setEditId] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/categories/admin/all");
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");

    try {
      setBtnLoading(true);
      const payload = { 
        name: name.trim(), 
        slug: slug, 
        image: image, 
        isActive: true 
      };

      if (editId) {
        await api.put(`/categories/admin/${editId}`, payload);
      } else {
        await api.post("/categories/admin", payload);
      }

      setName("");
      setImage("");
      setEditId(null);
      fetchCategories();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Operation failed"));
    } finally {
      setBtnLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete category? Products linked to it might be affected.")) return;
    try {
      await api.delete(`/categories/admin/${id}`);
      fetchCategories();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 p-6 font-inter selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Header - Modern Minimalist Style */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-[40px] font-bold text-[#1E293B] leading-[1.2] tracking-[-0.02em]">Taxonomy</h1>
          <h2 className="text-[24px] font-medium text-[#4B5563] mt-2">Manage visual segments for your deals.</h2>
        </div>
        <div className="flex items-center gap-3 px-5 py-3 bg-[#F8FAFC] border border-slate-200 rounded-2xl shadow-sm">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <LayoutGrid className="text-[#6366F1]" size={20} />
          </div>
          <span className="text-[#1E293B] font-semibold text-lg">{categories.length} Segments</span>
        </div>
      </div>

      <hr className="border-slate-200" />

      {/* Form Section - Clean Glassmorphism Effect */}
      <div className="bg-white border border-slate-200 p-2 rounded-[2.5rem] shadow-sm overflow-hidden transition-all focus-within:ring-4 focus-within:ring-indigo-500/5">
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-14px font-medium text-slate-500 ml-1">Category Label</label>
              <div className="relative group">
                <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6366F1] transition-colors" size={20} />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Smart Home Technology"
                  className="w-full pl-14 pr-5 py-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 outline-none focus:border-[#6366F1] focus:bg-white transition-all text-[18px] text-[#1E293B] placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Image URL Input */}
            <div className="space-y-2">
              <label className="text-14px font-medium text-slate-500 ml-1">Cover Image URL</label>
              <div className="relative group">
                <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6366F1] transition-colors" size={20} />
                <input
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full pl-14 pr-5 py-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 outline-none focus:border-[#6366F1] focus:bg-white transition-all text-[18px] text-[#1E293B] placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end items-center gap-4">
            {editId && (
              <button 
                type="button" 
                onClick={() => {setEditId(null); setName(""); setImage("");}}
                className="px-6 py-4 rounded-2xl text-slate-500 font-bold hover:text-slate-800 transition-all flex items-center gap-2"
              >
                <X size={20} /> Discard Changes
              </button>
            )}
            <button
              type="submit"
              disabled={btnLoading}
              className="px-10 py-4 rounded-2xl bg-[#6366F1] hover:bg-indigo-600 text-white font-bold transition-all flex items-center gap-3 disabled:opacity-50 shadow-lg shadow-indigo-200"
            >
              {btnLoading ? <Loader2 className="animate-spin" size={20} /> : (editId ? <Edit3 size={20} /> : <Plus size={20} />)}
              <span className="tracking-tight">{editId ? "Save Changes" : "Create New Segment"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Grid List - Card Revamp */}
      {loading ? (
        <div className="flex flex-col items-center py-24 gap-4">
          <div className="relative">
             <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-400 font-medium animate-pulse">Synchronizing taxonomy...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
          <AnimatePresence mode="popLayout">
            {categories.map((c) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={c._id} 
                className="group bg-white border border-slate-200 rounded-[32px] overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500"
              >
                {/* Visual Header */}
                <div className="h-40 bg-[#F8FAFC] relative overflow-hidden flex items-center justify-center">
                  {c.image ? (
                    <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="bg-indigo-50 p-6 rounded-3xl">
                        <Hash size={40} className="text-indigo-200 group-hover:rotate-12 transition-transform" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md text-[12px] font-black px-3 py-1 rounded-full text-indigo-600 shadow-sm border border-indigo-100 uppercase tracking-widest">
                       Category
                    </span>
                  </div>
                </div>

                <div className="p-7">
                  <div className="flex flex-col gap-4">
                    <div className="space-y-1">
                      <h3 className="text-[22px] font-bold text-[#1E293B] group-hover:text-[#6366F1] transition-colors leading-tight">
                        {c.name}
                      </h3>
                      <p className="text-[14px] text-slate-400 font-medium flex items-center gap-1">
                        <ChevronRight size={14} className="text-[#6366F1]" /> {c.slug}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="flex gap-2 w-full">
                        <button
                          onClick={() => { setEditId(c._id); setName(c.name); setImage(c.image || ""); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                          className="flex-1 flex justify-center items-center gap-2 py-3 bg-[#F8FAFC] text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all font-semibold text-sm"
                        >
                          <Edit3 size={16} /> Edit
                        </button>
                        <button
                          onClick={() => deleteCategory(c._id)}
                          className="px-4 py-3 bg-[#F8FAFC] text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}