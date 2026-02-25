import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { Mail, ArrowLeft, Loader2, KeyRound, CheckCircle2, AlertCircle } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage({ type: "success", text: res.data.message || "Recovery link sent to your inbox!" });
    } catch (err) {
      setMessage({ 
        type: "error", 
        text: err.response?.data?.message || "Failed to process request. Please check your email." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />

      <div className="w-full max-w-md relative">
        {/* Header Icon */}
        <div className="flex justify-center mb-8">
          <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/30 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <KeyRound className="text-white" size={28} />
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl rounded-[2.5rem] p-1 shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="bg-[#0f172a] rounded-[2.2rem] p-8 md:p-10 border border-slate-800/50">
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white tracking-tight">Recovery Mode</h2>
              <p className="text-slate-500 text-sm mt-2">
                Enter your admin email to receive a secure password reset link.
              </p>
            </div>

            {/* Modern Notification Area */}
            {message.text && (
              <div className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 ${
                message.type === "success" 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                : "bg-rose-500/10 border-rose-500/20 text-rose-400"
              }`}>
                {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <p className="text-[11px] font-bold tracking-tight leading-tight">{message.text}</p>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-2">Registered Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <input
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-950/50 border border-slate-800 text-white outline-none transition-all focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-700"
                    required
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Send Recovery Link"
                )}
              </button>
            </form>

            <div className="mt-8 text-center border-t border-slate-800/50 pt-6">
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-indigo-400 font-bold transition-colors group"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Return to Login
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] text-slate-600 uppercase tracking-[0.3em] font-medium">
          Secure Authorization System
        </p>
      </div>
    </div>
  );
}