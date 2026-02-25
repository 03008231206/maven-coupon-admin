const [alert, setAlert] = useState({ show: false, msg: "", type: "" });

const showAlert = (msg, type) => {
  setAlert({ show: true, msg, type });
  setTimeout(() => setAlert({ show: false, msg: "", type: "" }), 4000);
};

const handlePasswordChange = async () => {
  try {
    // Backend logic untouched
    await api.put("/admin/update-password", { oldPassword, newPassword });
    
    showAlert("Password updated successfully! ✅", "success");
    setOldPassword(""); // Form saaf karne ke liye
    setNewPassword("");
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Something went wrong";
    showAlert(errorMsg + " ❌", "error");
  }
};
{/* Floating Alert Notification */}
{alert.show && (
  <div className={`fixed top-10 right-10 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-2xl backdrop-blur-md animate-in slide-in-from-right duration-300 ${
    alert.type === "success" 
      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
      : "bg-rose-500/10 border-rose-500/20 text-rose-400"
  }`}>
    <div className={`p-2 rounded-lg ${alert.type === "success" ? "bg-emerald-500/20" : "bg-rose-500/20"}`}>
      {alert.type === "success" ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
    </div>
    <p className="text-sm font-bold tracking-wide">{alert.msg}</p>
  </div>
)}