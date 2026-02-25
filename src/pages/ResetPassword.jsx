// import { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../api/axios";
// import { Lock, ShieldCheck, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";

// export default function ResetPassword() {
//   const { token } = useParams();
//   const navigate = useNavigate();

//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: "", text: "" });

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       return setMessage({ type: "error", text: "Passwords do not match!" });
//     }

//     setLoading(true);
//     try {
//       // const res = await api.post(`/admin/reset-password/${token}`, { password });
//       const res = await api.post(`/auth/reset-password/${token}`, { password });
//       setMessage({ type: "success", text: res.data.message || "Password updated successfully!" });
//       setTimeout(() => navigate("/login"), 3000);
//     } catch (err) {
//       setMessage({ 
//         type: "error", 
//         text: err.response?.data?.message || "Something went wrong" 
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-['Inter',_sans-serif]">
//       {/* Background Decorative Glows */}
//       <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
//         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
//         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
//       </div>

//       <div className="w-full max-w-md relative">
//         {/* Brand Logo (Optional but recommended for Auth) */}
//         <div className="flex justify-center mb-8">
//           <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/20">
//             <ShieldCheck className="text-white" size={28} />
//           </div>
//         </div>

//         <div className="bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl rounded-[2.5rem] p-1 shadow-2xl">
//           <div className="bg-[#0f172a] rounded-[2.2rem] p-8 md:p-10 border border-slate-800/50">
            
//             <div className="text-center mb-8">
//               <h1 className="text-2xl font-bold text-white tracking-tight">Set New Password</h1>
//               <p className="text-slate-500 text-sm mt-2">Almost there! Choose a secure password for your account.</p>
//             </div>

//             {/* Modern Alerts */}
//             {message.text && (
//               <div className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 animate-in fade-in zoom-in duration-300 ${
//                 message.type === "success" 
//                 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
//                 : "bg-rose-500/10 border-rose-500/20 text-rose-400"
//               }`}>
//                 {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
//                 <p className="text-xs font-bold">{message.text}</p>
//               </div>
//             )}

//             <form onSubmit={onSubmit} className="space-y-5">
//               <div className="space-y-2">
//                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">New Password</label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors">
//                     <Lock size={18} />
//                   </div>
//                   <input
//                     type="password"
//                     placeholder="••••••••"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 text-white outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Confirm Password</label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors">
//                     <Lock size={18} />
//                   </div>
//                   <input
//                     type="password"
//                     placeholder="••••••••"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 text-white outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300"
//                     required
//                   />
//                 </div>
//               </div>

//               <button
//                 disabled={loading}
//                 className="w-full mt-4 group relative flex items-center justify-center gap-3 rounded-2xl py-4 font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? (
//                   <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                 ) : (
//                   <>
//                     Reset Password
//                     <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
//                   </>
//                 )}
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* Footer Link */}
//         <p className="text-center mt-8 text-slate-500 text-sm">
//           Remembered your password?{" "}
//           <button onClick={() => navigate("/login")} className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
//             Back to Login
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
// Eye aur EyeOff icons add kar diye hain toggle ke liye
import { Lock, ShieldCheck, AlertCircle, CheckCircle2, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // ✅ Password visibility toggle karne ke liye states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setMessage({ type: "error", text: "Passwords do not match!" });
    }

    setLoading(true);
    try {
      // ✅ Path ko /auth/ par update kar diya hai jaisa hum ne discuss kiya tha
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      setMessage({ type: "success", text: res.data.message || "Password updated successfully!" });
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setMessage({ 
        type: "error", 
        text: err.response?.data?.message || "Something went wrong" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-['Inter',_sans-serif]">
      {/* Background Decorative Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Brand Logo */}
        <div className="flex justify-center mb-8">
          <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/20">
            <ShieldCheck className="text-white" size={28} />
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl rounded-[2.5rem] p-1 shadow-2xl">
          <div className="bg-[#0f172a] rounded-[2.2rem] p-8 md:p-10 border border-slate-800/50">
            
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white tracking-tight">Set New Password</h1>
              <p className="text-slate-500 text-sm mt-2">Almost there! Choose a secure password for your account.</p>
            </div>

            {/* Modern Alerts */}
            {message.text && (
              <div className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 animate-in fade-in zoom-in duration-300 ${
                message.type === "success" 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                : "bg-rose-500/10 border-rose-500/20 text-rose-400"
              }`}>
                {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <p className="text-xs font-bold">{message.text}</p>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-5">
              {/* New Password Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">New Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors pointer-events-none">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 text-white outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300"
                    required
                  />
                  {/* Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors"
                    title={showPassword ? "Hide Password" : "Show Password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors pointer-events-none">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 text-white outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300"
                    required
                  />
                  {/* Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors"
                    title={showConfirmPassword ? "Hide Password" : "Show Password"}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full mt-4 group relative flex items-center justify-center gap-3 rounded-2xl py-4 font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Reset Password
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center mt-8 text-slate-500 text-sm">
          Remembered your password?{" "}
          <button onClick={() => navigate("/login")} className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
}