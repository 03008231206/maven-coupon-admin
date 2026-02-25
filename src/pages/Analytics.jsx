import { useEffect, useState } from "react";
import api from "../api/axios";
import { getAccessToken } from "../auth/authStorage";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  Store, 
  Ticket, 
  FileText, 
  MousePointer2, 
  RefreshCcw, 
  Activity,
  Award
} from "lucide-react";
import { motion } from "framer-motion";

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl p-6 rounded-[2rem] relative overflow-hidden group">
      <div className={`absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
        <Icon size={100} strokeWidth={1} />
      </div>
      <div className="relative z-10 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2.5 rounded-xl bg-slate-950 border border-slate-800 ${color}`}>
            <Icon size={20} />
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</span>
        </div>
        <div className="text-4xl font-black text-white tracking-tighter italic">
          {value.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default function Analytics() {
  const [data, setData] = useState({ stores: 0, coupons: 0, blogs: 0, clicks: 0, topStores: [] });
  const [dailyClicks, setDailyClicks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const token = getAccessToken();
      const headers = { Authorization: `Bearer ${token}` };
      const [res, clicksRes] = await Promise.all([
        api.get("/admin/analytics/overview", { headers }),
        api.get("/admin/analytics/daily-clicks", { headers })
      ]);
      setData(res.data);
      setDailyClicks(clicksRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAnalytics(); }, []);

  const compareData = [
    { name: "Stores", value: data.stores, color: "#6366f1" },
    { name: "Coupons", value: data.coupons, color: "#a855f7" },
    { name: "Blogs", value: data.blogs, color: "#ec4899" },
  ];

  if (loading) return (
    <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-500/20 rounded-full animate-spin border-t-indigo-500" />
        <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500" />
      </div>
      <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Crunching Data...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-1000">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">Intelligence</h1>
          <p className="text-slate-500 font-medium">Real-time performance metrics and traffic insights.</p>
        </div>
        <button
          onClick={loadAnalytics}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all hover:bg-slate-800"
        >
          <RefreshCcw size={16} /> Sync Data
        </button>
      </div>

      {/* Grid: Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Stores" value={data.stores} icon={Store} color="text-indigo-400" />
        <StatCard title="Active Coupons" value={data.coupons} icon={Ticket} color="text-purple-400" />
        <StatCard title="Blog Reach" value={data.blogs} icon={FileText} color="text-pink-400" />
        <StatCard title="Engagement (Clicks)" value={data.clicks} icon={MousePointer2} color="text-emerald-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 1) Area Chart: Traffic Trend */}
        <div className="lg:col-span-8 bg-slate-900/40 border border-slate-800/60 rounded-[2.5rem] p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-indigo-400" size={24} />
              <h3 className="text-xl font-black text-white tracking-tight">Traffic Velocity</h3>
            </div>
            <div className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-full animate-pulse">
              Live Feed
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyClicks}>
                <defs>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" hide />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', color: '#fff' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Area type="monotone" dataKey="clicks" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorClicks)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2) Bar Chart: Distribution */}
        <div className="lg:col-span-4 bg-slate-900/40 border border-slate-800/60 rounded-[2.5rem] p-8 flex flex-col">
          <h3 className="text-xl font-black text-white tracking-tight mb-8">Inventory Split</h3>
          <div className="flex-1 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compareData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b' }} />
                <Bar dataKey="value" radius={[12, 12, 12, 12]} barSize={40}>
                  {compareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3) Top Stores Table-style Grid */}
        <div className="lg:col-span-12 bg-slate-900/40 border border-slate-800/60 rounded-[2.5rem] overflow-hidden">
          <div className="p-8 border-b border-slate-800/50 flex items-center gap-3">
            <Award className="text-amber-500" size={24} />
            <h3 className="text-xl font-black text-white tracking-tight">Performance Leaders</h3>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {data.topStores.map((s, idx) => (
                <div key={s.storeId} className="bg-slate-950/50 border border-slate-800 p-5 rounded-3xl group hover:border-indigo-500/50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-black text-slate-800 group-hover:text-indigo-500/20 transition-colors">0{idx + 1}</span>
                      <h4 className="font-black text-slate-200 uppercase tracking-tight">{s.name}</h4>
                    </div>
                    <span className="text-xs font-black text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg">
                      {s.clicks} CLICKS
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(s.clicks / (data.topStores[0]?.clicks || 1)) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}