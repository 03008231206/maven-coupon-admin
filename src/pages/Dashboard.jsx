// import { useEffect, useState } from "react";
// import api from "../api/axios";
// import { getAccessToken } from "../auth/authStorage";
// import { 
//   Store, 
//   Ticket, 
//   BookOpen, 
//   MousePointer2, 
//   Loader2, 
//   Zap,
//   ShieldCheck,
//   PieChart as PieIcon
// } from "lucide-react";
// import {
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   Cell,
//   CartesianGrid
// } from "recharts";

// /* ---------------- Stat Card Component ---------------- */
// function StatCard({ title, value, icon: Icon, color }) {
//   return (
//     <div className="bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl rounded-[2rem] p-6 hover:border-indigo-500/30 transition-all duration-300 group">
//       <div className="flex justify-between items-start">
//         <div>
//           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</p>
//           <h3 className="text-3xl font-black mt-2 text-white tabular-nums tracking-tight">{value}</h3>
//         </div>
//         <div className={`p-3 rounded-2xl ${color} bg-opacity-10 transition-transform group-hover:scale-110 duration-300`}>
//           <Icon className={color.replace('bg-', 'text-')} size={24} />
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ---------------- Main Dashboard Page ---------------- */
// export default function Dashboard() {
//   const [stats, setStats] = useState({ stores: 0, coupons: 0, blogs: 0, clicks: 0, topProducts: [] });
//   const [loading, setLoading] = useState(true);
//   const token = getAccessToken();

//   useEffect(() => {
//     const loadDashboard = async () => {
//       setLoading(true);
//       try {
//         const res = await api.get("/admin/analytics/overview", { 
//           headers: { Authorization: `Bearer ${token}` } 
//         });
//         setStats(res.data);
//       } catch (err) {
//         console.error("Sync Error", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadDashboard();
//   }, [token]);

//   // Data for the Bar Chart
//   const compareData = [
//     { name: "Stores", value: stats.stores || 0, color: "#6366f1" },
//     { name: "Coupons", value: stats.coupons || 0, color: "#a855f7" },
//     { name: "Blogs", value: stats.blogs || 0, color: "#ec4899" },
//   ];

//   if (loading) return (
//     <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
//       <Loader2 className="animate-spin text-indigo-500" size={48} />
//       <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Generating Intelligence...</p>
//     </div>
//   );

//   return (
//     <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">Inventory Control</h1>
//           <p className="text-slate-500 text-sm font-medium">Monitoring asset distribution and platform health.</p>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard title="Total Stores" value={stats.stores} icon={Store} color="bg-blue-500" />
//         <StatCard title="Live Coupons" value={stats.coupons} icon={Ticket} color="bg-purple-500" />
//         <StatCard title="Content Pieces" value={stats.blogs} icon={BookOpen} color="bg-emerald-500" />
//         <StatCard title="User Clicks" value={stats.clicks} icon={MousePointer2} color="bg-rose-500" />
//       </div>

//       {/* Inventory Split Section */}
//       <div className="bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl">
//         <div className="flex items-center gap-3 mb-10">
//           <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
//             <PieIcon size={22} />
//           </div>
//           <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">Inventory Split</h2>
//         </div>

//         <div className="w-full h-[400px]">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={compareData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.3} />
//               <XAxis 
//                 dataKey="name" 
//                 axisLine={false} 
//                 tickLine={false} 
//                 tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} 
//               />
//               <YAxis 
//                 axisLine={false} 
//                 tickLine={false} 
//                 tick={{fill: '#475569', fontSize: 12}} 
//               />
//               {/* Tooltip Styling for Visibility */}
//               <Tooltip 
//                 cursor={{fill: '#1e293b', opacity: 0.4}} 
//                 contentStyle={{ 
//                   backgroundColor: '#0f172a', 
//                   borderRadius: '16px', 
//                   border: '1px solid #334155', 
//                   padding: '12px',
//                   boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
//                 }}
//                 itemStyle={{ 
//                   color: '#ffffff', 
//                   fontWeight: 'bold',
//                   fontSize: '14px'
//                 }}
//                 labelStyle={{
//                   color: '#6366f1', 
//                   marginBottom: '4px',
//                   fontWeight: '900',
//                   textTransform: 'uppercase',
//                   fontSize: '10px',
//                   letterSpacing: '0.1em'
//                 }}
//               />
//               <Bar dataKey="value" radius={[15, 15, 0, 0]} barSize={80}>
//                 {compareData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//               </Bar>
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Bottom Insights */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Top Assets */}
//         <div className="bg-slate-900/40 border border-slate-800/60 rounded-[2.5rem] p-8">
//           <div className="flex items-center gap-3 mb-6">
//             <Zap className="text-amber-500" size={20} />
//             <h2 className="text-lg font-bold text-white uppercase italic">Top Performing Assets</h2>
//           </div>
//           <div className="space-y-4">
//             {stats.topProducts?.length > 0 ? (
//               stats.topProducts.slice(0, 5).map((p, idx) => (
//                 <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/40 border border-slate-800 hover:border-indigo-500/50 transition-colors">
//                   <div className="flex items-center gap-4">
//                     <span className="text-xs font-black text-slate-700">0{idx + 1}</span>
//                     <h4 className="text-sm font-bold text-slate-200">{p.name || p.title}</h4>
//                   </div>
//                   <span className="text-indigo-400 font-black text-sm tabular-nums">{p.clicks}</span>
//                 </div>
//               ))
//             ) : (
//               <p className="text-slate-600 italic text-sm text-center py-10">Waiting for data signals...</p>
//             )}
//           </div>
//         </div>

//         {/* System Health */}
//         <div className="bg-slate-900/40 border border-slate-800/60 rounded-[2.5rem] p-8 flex flex-col justify-between">
//           <div>
//             <h2 className="text-lg font-bold text-white mb-6 uppercase italic">System Health</h2>
//             <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-4">
//               <ShieldCheck className="text-emerald-400 shrink-0" size={20} />
//               <p className="text-xs text-slate-400 leading-relaxed font-medium">
//                 Affiliate tracking engines are operating at peak performance. Data synchronization is active and secure.
//               </p>
//             </div>
//           </div>
//           <button className="mt-8 w-full py-4 rounded-2xl bg-slate-800 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] border border-slate-700/50 hover:bg-slate-700 hover:text-white transition-all">
//             Download Audit Report
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import api from "../api/axios";
import { getAccessToken } from "../auth/authStorage";
import { 
  Store, 
  Ticket, 
  BookOpen, 
  MousePointer2, 
  Loader2, 
  Zap,
  ShieldCheck,
  PieChart as PieIcon
} from "lucide-react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  CartesianGrid
} from "recharts";

/* ---------------- Stat Card Component ---------------- */
function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl rounded-[2rem] p-6 hover:border-indigo-500/30 transition-all duration-300 group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</p>
          <h3 className="text-3xl font-black mt-2 text-white tabular-nums tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10 transition-transform group-hover:scale-110 duration-300`}>
          <Icon className={color.replace('bg-', 'text-')} size={24} />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Main Dashboard Page ---------------- */
export default function Dashboard() {
  const [stats, setStats] = useState({ stores: 0, coupons: 0, blogs: 0, clicks: 0, topProducts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const token = getAccessToken(); // Token inside useEffect for fresh value
        const res = await api.get("/admin/analytics/overview", { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        
        // Clicks mapping fix
        setStats({
          stores: res.data.stores || 0,
          coupons: res.data.coupons || 0,
          blogs: res.data.blogs || 0,
          clicks: res.data.clicks || 0,
          topProducts: res.data.topProducts || []
        });
      } catch (err) {
        console.error("Sync Error", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []); // Static dependency array to prevent unnecessary re-runs

  // Data for the Bar Chart
  const compareData = [
    { name: "Stores", value: stats.stores || 0, color: "#6366f1" },
    { name: "Coupons", value: stats.coupons || 0, color: "#a855f7" },
    { name: "Blogs", value: stats.blogs || 0, color: "#ec4899" },
  ];

  if (loading) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-indigo-500" size={48} />
      <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Generating Intelligence...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">Inventory Control</h1>
          <p className="text-slate-500 text-sm font-medium">Monitoring asset distribution and platform health.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Stores" value={stats.stores} icon={Store} color="bg-blue-500" />
        <StatCard title="Live Coupons" value={stats.coupons} icon={Ticket} color="bg-purple-500" />
        <StatCard title="Content Pieces" value={stats.blogs} icon={BookOpen} color="bg-emerald-500" />
        <StatCard title="User Clicks" value={stats.clicks} icon={MousePointer2} color="bg-rose-500" />
      </div>

      {/* Inventory Split Section */}
      <div className="bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
            <PieIcon size={22} />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">Inventory Split</h2>
        </div>

        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={compareData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.3} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#475569', fontSize: 12}} 
              />
              <Tooltip 
                cursor={{fill: '#1e293b', opacity: 0.4}} 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderRadius: '16px', 
                  border: '1px solid #334155', 
                  padding: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                }}
                itemStyle={{ 
                  color: '#ffffff', 
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
                labelStyle={{
                  color: '#6366f1', 
                  marginBottom: '4px',
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  fontSize: '10px',
                  letterSpacing: '0.1em'
                }}
              />
              <Bar dataKey="value" radius={[15, 15, 0, 0]} barSize={80}>
                {compareData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Assets */}
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-[2.5rem] p-8">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="text-amber-500" size={20} />
            <h2 className="text-lg font-bold text-white uppercase italic">Top Performing Assets</h2>
          </div>
          <div className="space-y-4">
            {stats.topProducts?.length > 0 ? (
              stats.topProducts.slice(0, 5).map((p, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/40 border border-slate-800 hover:border-indigo-500/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-black text-slate-700">0{idx + 1}</span>
                    <h4 className="text-sm font-bold text-slate-200">{p.name || p.title}</h4>
                  </div>
                  <span className="text-indigo-400 font-black text-sm tabular-nums">{p.clicks}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-600 italic text-sm text-center py-10">Waiting for data signals...</p>
            )}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-[2.5rem] p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-white mb-6 uppercase italic">System Health</h2>
            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-4">
              <ShieldCheck className="text-emerald-400 shrink-0" size={20} />
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Affiliate tracking engines are operating at peak performance. Data synchronization is active and secure.
              </p>
            </div>
          </div>
          <button className="mt-8 w-full py-4 rounded-2xl bg-slate-800 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] border border-slate-700/50 hover:bg-slate-700 hover:text-white transition-all">
            Download Audit Report
          </button>
        </div>
      </div>
    </div>
  );
}