import { useEffect, useState } from "react";
import api from "../api/axios";
import { 
  Trash2, 
  Eye, 
  Mail, 
  CheckCircle2, 
  Inbox, 
  Clock, 
  User, 
  Loader2,
  ChevronRight,
  ArchiveX,
  CircleDot
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/contact");
      setMessages(res.data || []);
    } catch (err) {
      console.error("ADMIN CONTACT ERROR:", err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggleRead = async (id) => {
    try {
      await api.patch(`/contact/${id}/toggle-read`);
      // Update local state instead of full reload for better UX
      setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: !m.isRead } : m));
      if (active?._id === id) setActive(prev => ({ ...prev, isRead: !prev.isRead }));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMsg = async (id) => {
    if (!confirm("Permanently remove this conversation?")) return;
    try {
      await api.delete(`/contact/${id}`);
      setActive(null);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">Support Inbox</h1>
          <p className="text-slate-500 font-medium">Manage inquiries from your affiliate audience.</p>
        </div>
        <div className="flex items-center gap-3 px-5 py-2.5 bg-slate-900/50 border border-slate-800 rounded-2xl">
          <Inbox className="text-indigo-400" size={18} />
          <span className="text-white font-bold text-sm tracking-widest">{messages.length} Total</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[600px]">
        
        {/* LEFT LIST: MESSAGE FEED */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl rounded-[2rem] overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-slate-800/50 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Recent Inquiries</h3>
              <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            </div>

            <div className="overflow-y-auto max-h-[600px] custom-scrollbar">
              {loading ? (
                <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-indigo-500" /></div>
              ) : messages.length === 0 ? (
                <div className="p-10 text-center space-y-3">
                  <ArchiveX className="mx-auto text-slate-700" size={40} />
                  <p className="text-slate-500 font-bold text-xs uppercase">No messages found</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800/50">
                  {messages.map((m) => (
                    <button
                      key={m._id}
                      onClick={() => setActive(m)}
                      className={`w-full text-left p-6 transition-all relative group ${
                        active?._id === m._id ? "bg-indigo-600/10" : "hover:bg-slate-800/30"
                      }`}
                    >
                      {active?._id === m._id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />}
                      
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center border transition-colors ${
                          !m.isRead ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400" : "bg-slate-950 border-slate-800 text-slate-600"
                        }`}>
                          <User size={20} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-200 truncate pr-2 tracking-tight">{m.name}</span>
                            {!m.isRead && <CircleDot size={8} className="text-indigo-500 fill-indigo-500" />}
                          </div>
                          <p className="text-xs text-slate-500 truncate mb-3">{m.email}</p>
                          <p className="text-xs text-slate-400 line-clamp-1 italic">"{m.message}"</p>
                        </div>
                        <ChevronRight size={14} className={`mt-1 transition-transform ${active?._id === m._id ? "translate-x-1 text-indigo-400" : "text-slate-700"}`} />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PREVIEW: DETAILED VIEW */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!active ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-[2.5rem] p-10 text-center space-y-4"
              >
                <div className="p-6 bg-slate-900 rounded-full border border-slate-800">
                  <Mail className="text-slate-700" size={32} />
                </div>
                <div>
                  <h3 className="text-slate-400 font-bold">Select a message</h3>
                  <p className="text-slate-600 text-xs mt-1">Choose a conversation from the sidebar to view full details.</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key={active._id}
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
                className="bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl rounded-[2.5rem] p-1 shadow-2xl h-full"
              >
                <div className="bg-[#0f172a] rounded-[2.2rem] h-full flex flex-col border border-slate-800/50 overflow-hidden">
                  
                  {/* Header Actions */}
                  <div className="p-8 border-b border-slate-800/50 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
                        <User size={28} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">{active.name}</h2>
                        <div className="flex items-center gap-2 text-slate-500">
                          <Mail size={12} />
                          <span className="text-xs font-medium uppercase tracking-widest">{active.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleRead(active._id)}
                        className={`p-3 rounded-xl border transition-all ${
                          active.isRead 
                          ? "bg-slate-950 border-slate-800 text-slate-500 hover:text-white" 
                          : "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                        }`}
                        title={active.isRead ? "Mark as Unread" : "Mark as Read"}
                      >
                        <CheckCircle2 size={20} />
                      </button>
                      <button
                        onClick={() => deleteMsg(active._id)}
                        className="p-3 bg-slate-950 border border-slate-800 text-slate-500 hover:bg-rose-600 hover:text-white hover:border-rose-600 rounded-xl transition-all shadow-lg"
                        title="Delete Message"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="p-8 flex-1 overflow-y-auto space-y-8">
                    <div className="flex items-center gap-3 px-4 py-2 bg-slate-950/50 border border-slate-800 rounded-full w-fit">
                      <Clock className="text-indigo-400" size={14} />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Received on: {new Date(active.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-4 top-0 bottom-0 w-1 bg-indigo-500/20 rounded-full" />
                      <p className="text-slate-300 leading-[1.8] text-lg font-medium whitespace-pre-line italic">
                        "{active.message}"
                      </p>
                    </div>
                  </div>

                  {/* Quick Reply Trigger (Visual Only) */}
                  <div className="p-8 border-t border-slate-800/50 bg-slate-950/20">
                    <a 
                      href={`mailto:${active.email}`}
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm tracking-widest uppercase flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/20"
                    >
                      <Mail size={18} />
                      Compose Email Reply
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}