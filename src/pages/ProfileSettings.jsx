import { Mail, Lock, Key, CheckCircle2, Loader2, ShieldCheck, ArrowLeft, Send, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import api from "../api/axios";

export default function ProfileSettings() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ newEmail: "", newPassword: "", code: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for eye toggle
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });

  const showAlert = (msg, type) => {
    setAlert({ show: true, msg, type });
    setTimeout(() => setAlert({ show: false, msg: "", type: "" }), 4000);
  };

  const getOTP = async (e) => {
    e.preventDefault();
    if (!form.newEmail && !form.newPassword) {
      return showAlert("Please provide a new email or password to update.", "error");
    }
    
    setLoading(true);
    try {
      await api.post("/auth/profile/request-otp", { newEmail: form.newEmail });
      setStep(2);
      showAlert("Verification code has been sent to your email address.", "success");
    } catch (err) { 
      showAlert("Failed to send verification code. Please try again.", "error"); 
    } finally { 
      setLoading(false); 
    }
  };

  const verifyAndUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/profile/verify-update", form);
      showAlert("Profile updated successfully! Redirecting...", "success");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) { 
      showAlert(err.response?.data?.message || "Invalid or expired OTP code.", "error"); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- Floating Toast Notification --- */}
      {alert.show && (
        <div className={`fixed top-10 right-10 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-2xl backdrop-blur-md animate-in slide-in-from-right duration-300 ${
          alert.type === "success" 
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
            : "bg-rose-500/10 border-rose-500/20 text-rose-400"
        }`}>
          <div className={`p-2 rounded-lg ${alert.type === "success" ? "bg-emerald-500/20" : "bg-rose-500/20"}`}>
            {alert.type === "success" ? <CheckCircle2 size={18} /> : <ShieldCheck size={18} />}
          </div>
          <p className="text-sm font-bold tracking-wide">{alert.msg}</p>
        </div>
      )}

      {/* --- Main Card --- */}
      <div className="bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl rounded-[3rem] p-1 shadow-2xl">
        <div className="bg-[#0f172a] rounded-[2.8rem] p-8 md:p-12 border border-slate-800/50">
          
          <div className="text-center mb-10">
            <div className="h-20 w-20 bg-indigo-600/10 text-indigo-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner border border-indigo-500/20">
              <ShieldCheck size={40} strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Security Settings</h2>
            <p className="text-slate-500 mt-2 font-medium">Protect and update your administrative credentials</p>
          </div>

          {step === 1 ? (
            <form onSubmit={getOTP} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-2">Update Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
                  <input 
                    className="w-full bg-slate-950/50 p-4 pl-14 rounded-2xl border border-slate-800 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-200 placeholder:text-slate-700" 
                    placeholder="Enter new email address" 
                    onChange={e => setForm({...form, newEmail: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-2">Update Security Password</label>
                <div className="relative group">
                  <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
                  <input 
                    className="w-full bg-slate-950/50 p-4 pl-14 pr-14 rounded-2xl border border-slate-800 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-200 placeholder:text-slate-700" 
                    type={showPassword ? "text" : "password"} // Dynamic type
                    placeholder="Enter new strong password" 
                    onChange={e => setForm({...form, newPassword: e.target.value})} 
                  />
                  {/* Eye Toggle Button */}
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button 
                disabled={loading} 
                className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18}/> Request Verification Code</>}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyAndUpdate} className="space-y-8 animate-in slide-in-from-right-10 duration-500">
              <div className="bg-indigo-500/5 border border-indigo-500/20 p-6 rounded-[2rem] text-center">
                <p className="text-indigo-400 text-sm font-medium leading-relaxed">
                  We've sent a 6-digit security code to your email. <br/> Please enter it below to authorize changes.
                </p>
              </div>

              <div className="space-y-4">
                <input 
                  className="w-full bg-slate-950/50 p-6 rounded-3xl text-center text-4xl font-mono tracking-[0.5em] border-2 border-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none text-white transition-all" 
                  maxLength="6" 
                  placeholder="000000" 
                  onChange={e => setForm({...form, code: e.target.value})} 
                  required 
                />
              </div>

              <div className="space-y-3">
                <button 
                  disabled={loading} 
                  className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20 active:scale-[0.98]"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle2 size={20}/> Confirm & Save Changes</>}
                </button>
                
                <button 
                  type="button"
                  onClick={() => setStep(1)} 
                  className="w-full py-3 text-slate-500 text-sm font-bold hover:text-slate-300 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={16} /> Back to Edit Info
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}