import { useEffect, useState } from "react";
import api from "../api/axios";
import { Check, Trash2, Store, Star, MessageSquare } from "lucide-react";

export default function AdminTestimonials() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      const res = await api.get("/admin/testimonials");
      setData(res.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleApprove = async (id) => {
    await api.put(`/admin/testimonials/approve/${id}`);
    setData(data.map(t => t._id === id ? { ...t, status: 'approved' } : t));
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete permanently?")) return;
    await api.delete(`/admin/testimonials/${id}`);
    setData(data.filter(t => t._id !== id));
  };

  if (loading) return <div className="p-10 text-slate-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Store Reviews</h1>
        <span className="bg-indigo-600/20 text-indigo-400 px-4 py-1 rounded-full text-xs font-bold border border-indigo-500/30">
          {data.length} Total
        </span>
      </div>

      <div className="grid gap-4">
        {data.map((t) => (
          <div key={t._id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between gap-6 transition-hover hover:border-slate-700">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${t.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  {t.status}
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                  <Store size={14} /> {t.store?.name}
                </div>
              </div>
              <h3 className="text-white font-bold">{t.name} <span className="text-slate-500 font-normal text-sm">— {t.email}</span></h3>
              <p className="text-slate-400 mt-2 italic text-sm">"{t.comment}"</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {t.status === 'pending' && (
                <button onClick={() => handleApprove(t._id)} className="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20">
                  <Check size={20} />
                </button>
              )}
              <button onClick={() => handleDelete(t._id)} className="p-2.5 bg-slate-800 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all border border-slate-700">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}