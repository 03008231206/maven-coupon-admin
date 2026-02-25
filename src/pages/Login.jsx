import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { setAuth } from "../auth/authStorage";
import { Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Eye icon state
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    setLoading(true);

    try {
      const res = await api.post(
        "/auth/login", 
        { email, password },
        { withCredentials: true }
      );

      const { accessToken, admin } = res.data;
      setAuth({ accessToken, admin });
      navigate("/");
    } catch (err) {
      setErrMsg(
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Check credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Decorative Background Blur */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />

      <div className="w-full max-w-md relative">
        {/* Brand Identity */}
        <div className="flex justify-center mb-8">
          <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/30">
            <ShieldCheck className="text-white" size={32} />
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl rounded-[2.5rem] p-1 shadow-2xl">
          <div className="bg-[#0f172a] rounded-[2.2rem] p-8 md:p-10 border border-slate-800/50">
            
            {/* Header */}
            <div className="mb-10 text-center">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Admin Gateway
              </h1>
              <p className="text-slate-500 text-sm mt-2">
                Sign in to manage your affiliate network
              </p>
            </div>

            {/* Error Display */}
            {errMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                <div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                {errMsg}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={onSubmit} className="space-y-6">
              
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-2">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-950/50 border border-slate-800 text-slate-100 placeholder:text-slate-700 outline-none transition-all focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-2">
                  Secret Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"} // Dynamic Type
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-950/50 border border-slate-800 text-slate-100 placeholder:text-slate-700 outline-none transition-all focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10"
                  />
                  {/* --- EYE ICON BUTTON --- */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-indigo-400 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                disabled={loading}
                type="submit"
                className="w-full group relative flex items-center justify-center gap-3 rounded-2xl py-4 font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Access Dashboard"
                )}
              </button>
            </form>

            {/* Forgot Password */}
            <div className="mt-8 text-center">
              <button 
                type="button" 
                onClick={() => navigate("/forgot-password")}
                className="text-xs text-slate-500 hover:text-indigo-400 font-bold transition-colors"
              >
                Forget Password?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}