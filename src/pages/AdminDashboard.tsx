import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
 LayoutDashboard, Users, Shield, Settings, History, User,
 TrendingUp, AlertCircle, CheckCircle2, ShieldCheck,
 BarChart3, Activity, Zap, Server, Globe, Search, MoreVertical,
 ChevronRight, ArrowUpRight, ArrowDownRight, Utensils, X, Info,
 Save, CheckCheck, XCircle, Building2, Phone, Mail, MapPin,
 FileText, ToggleLeft, ToggleRight, SlidersHorizontal, Lock,
 Eye, EyeOff, Trash2, Edit3, Power, AlertTriangle, Terminal,
 RefreshCw, Download, Bell, Wifi, Cpu, HardDrive
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '@/components/DashboardLayout';
import { cn } from '@/lib/utils';
import { DocumentViewerModal } from '@/components/DocumentViewerModal';


const systemData = [
 { time: '00:00', load: 32 }, { time: '04:00', load: 28 }, { time: '08:00', load: 45 },
 { time: '12:00', load: 88 }, { time: '16:00', load: 76 }, { time: '20:00', load: 54 }, { time: '23:59', load: 41 },
];

const MOCK_USERS: any[] = [];
const MOCK_VERIFICATIONS: any[] = [];

function generateLog(level: string, msg: string, ts: string) {
 return { level, msg, ts };
}

const INITIAL_LOGS: any[] = [];

export default function AdminDashboard() {
 const [searchParams, setSearchParams] = useSearchParams();
 const activeTab = searchParams.get('tab') || 'Overview';
 const setActiveTab = (tab: string) => setSearchParams({ tab });

 const [previewDoc, setPreviewDoc] = useState<string | null>(null);

 // User Management state
 const [users, setUsers] = useState(MOCK_USERS);
 const [userSearch, setUserSearch] = useState('');
 const [userRoleFilter, setUserRoleFilter] = useState('All');

 // Verifications state
 const [verifications, setVerifications] = useState(MOCK_VERIFICATIONS);
 const [selectedVerif, setSelectedVerif] = useState<any>(null);

 // Logs state
 const [logs, setLogs] = useState(INITIAL_LOGS);
 const [logFilter, setLogFilter] = useState('All');
 const logsEndRef = useRef<HTMLDivElement>(null);

 // Environment state
 const [envSettings, setEnvSettings] = useState({
 emailAlerts: true, aiRouting: true, autoVerification: false,
 maintenanceMode: false, publicApi: true, analyticsTracking: true,
 maxDonationRadius: 10, pickupTimeout: 120, maxUsersPerNode: 500,
 });

 // Profile state
 const [adminProfile, setAdminProfile] = useState({
 name: 'System Administrator', id: 'SA-ROOT-001', email: 'admin@zerowaste.in',
 clearance: 'LEVEL 5 — FULL ACCESS', lastLogin: '2026-03-17T08:00:00',
 phone: '+91 98000 00001',
 });
 const [profileSaved, setProfileSaved] = useState(false);
 const [showPwChange, setShowPwChange] = useState(false);
 const [showPw, setShowPw] = useState(false);

 // Auto-scroll logs
 useEffect(() => {
 if (activeTab === 'System Logs') logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
 }, [activeTab, logs]);

 // Simulate live log entries
 useEffect(() => {
 if (activeTab !== 'System Logs') return;
 const interval = setInterval(() => {
 const entries = [
 { level: 'INFO', msg: 'Heartbeat check — all systems nominal.' },
 { level: 'INFO', msg: `Donation #${Math.floor(Math.random() * 9000 + 1000)} listed by restaurant.` },
 { level: 'WARN', msg: `Response time elevated on node BLR-0${Math.floor(Math.random() * 9 + 1)}.` },
 { level: 'INFO', msg: 'NGO pickup confirmed — item rescued.' },
 ];
 const entry = entries[Math.floor(Math.random() * entries.length)];
 const now = new Date();
 const ts = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
 setLogs(prev => [...prev.slice(-50), { ...entry, ts }]);
 }, 4000);
 return () => clearInterval(interval);
 }, [activeTab]);

 const sidebarItems = [
 { icon: LayoutDashboard, label: 'Overview', active: activeTab === 'Overview', onClick: () => setActiveTab('Overview') },
 { icon: Users, label: 'User Management', active: activeTab === 'User Management', onClick: () => setActiveTab('User Management') },
 { icon: Shield, label: 'Verifications', active: activeTab === 'Verifications', onClick: () => setActiveTab('Verifications') },
 { icon: Server, label: 'System Logs', active: activeTab === 'System Logs', onClick: () => setActiveTab('System Logs') },
 { icon: Settings, label: 'Environment', active: activeTab === 'Environment', onClick: () => setActiveTab('Environment') },
 { icon: User, label: 'Profile', active: activeTab === 'Profile', onClick: () => setActiveTab('Profile') },
 ];

 // ─── Overview ─────────────────────────────────────────────────────────
 const renderOverview = () => (
 <div className="space-y-10 relative">
 <div className="absolute inset-0 z-0 opacity-5 pointer-events-none overflow-hidden">
 {/* Background removed for purer black aesthetic matching LandingPage */}
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
 {[
 { label: 'Active Nodes', value: '428', trend: '+14%', isUp: true, icon: Server, color: 'text-green-400', bg: 'bg-green-500/10' },
 { label: 'Total Users', value: users.length.toString(), trend: '+22%', isUp: true, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
 { label: 'System Uptime', value: '99.98%', trend: 'Stable', isUp: true, icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
 { label: 'Threats Blocked', value: '12', trend: '-85%', isUp: false, icon: ShieldCheck, color: 'text-red-400', bg: 'bg-red-500/10' },
 ].map((stat, i) => {
 const Icon = stat.icon;
 return (
 <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5, scale: 1.02 }} className="glass-dark p-6 rounded-[32px] border-white/5 flex flex-col gap-4 group cursor-default shadow-2xl backdrop-blur-3xl">
 <div className="flex justify-between items-start">
 <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg", stat.bg)}><Icon className={cn("w-7 h-7", stat.color)} /></div>
 <div className={cn("flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg shadow-xl", stat.isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400')}>
 {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{stat.trend}
 </div>
 </div>
 <div>
 <p className="text-3xl font-display font-semibold tracking-tight">{stat.value}</p>
 <p className="text-xs font-bold text-white/40 uppercase tracking-wide mt-1">{stat.label}</p>
 <p className="text-[10px] font-bold text-white/10 mt-1 ">Real-time telemetry active</p>
 </div>
 </motion.div>
 );
 })}
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
 <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2 glass-dark rounded-[40px] p-8 border-white/5 overflow-hidden shadow-2xl backdrop-blur-3xl">
 <div className="flex justify-between items-center mb-10">
 <div>
 <h3 className="text-2xl font-display font-semibold tracking-tight flex items-center gap-3 underline decoration-green-500/30 underline-offset-8">NETWORK LOAD <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" /></h3>
 <p className="text-sm font-bold text-white/30 uppercase tracking-[0.3em] mt-3">Global Traffic Analysis Matrix</p>
 </div>
 <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
 {['1H', '1D', '1W'].map(t => (
 <button key={t} className={cn("px-6 py-2.5 rounded-xl text-[10px] font-semibold transition-all uppercase tracking-wide", t === '1D' ? 'bg-green-500 text-white shadow-xl' : 'text-white/30 hover:text-white hover:bg-white/5')}>{t}</button>
 ))}
 </div>
 </div>
 <div className="h-[300px] w-full">
 <ResponsiveContainer width="100%" height="100%">
 <LineChart data={systemData}>
 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
 <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#ffffff20', fontSize: 10, fontWeight: 800 }} dy={10} />
 <YAxis axisLine={false} tickLine={false} tick={{ fill: '#ffffff20', fontSize: 10, fontWeight: 800 }} />
 <Tooltip contentStyle={{ backgroundColor: '#050505', border: '1px solid #ffffff10', borderRadius: '16px', fontWeight: 800, color: '#fff' }} itemStyle={{ color: '#fff' }} />
 <Line type="monotone" dataKey="load" stroke="#22c55e" strokeWidth={6} dot={{ r: 6, fill: '#22c55e', strokeWidth: 0 }} activeDot={{ r: 12, fill: '#fff', strokeWidth: 4, stroke: '#22c55e' }} />
 </LineChart>
 </ResponsiveContainer>
 </div>
 </motion.div>

 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="glass-dark rounded-[40px] p-8 border-white/5 flex flex-col shadow-2xl backdrop-blur-3xl">
 <div className="flex justify-between items-center mb-10">
 <h3 className="text-2xl font-display font-semibold tracking-tight">System Health</h3>
 <span className="text-[10px] font-semibold py-1 px-3 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full shadow-lg">OPERATIONAL</span>
 </div>
 <div className="space-y-10 flex-1">
 {[
 { label: 'Database Cluster', value: 92, status: 'Healthy', color: 'bg-emerald-500' },
 { label: 'API Gateway', value: 78, status: 'Optimal', color: 'bg-blue-500' },
 { label: 'Edge Nodes', value: 45, status: 'Under Load', color: 'bg-amber-500' },
 { label: 'Auth Service', value: 99, status: 'Stable', color: 'bg-green-500' },
 ].map((item, i) => (
 <div key={i} className="space-y-4">
 <div className="flex justify-between items-end">
 <p className="font-semibold text-sm tracking-tight uppercase ">{item.label}</p>
 <span className="text-[10px] font-semibold text-white/20 uppercase tracking-wide">{item.status} ({item.value}%)</span>
 </div>
 <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
 <motion.div initial={{ width: 0 }} animate={{ width: `${item.value}%` }} transition={{ duration: 1.5, delay: i * 0.1, ease: "easeOut" }} className={cn("h-full rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)]", item.color)} />
 </div>
 </div>
 ))}
 </div>
 <button onClick={() => setActiveTab('System Logs')} className="w-full py-6 mt-12 rounded-[28px] bg-white/5 border border-white/[0.03] text-[11px] font-semibold tracking-[0.4em] hover:bg-white/10 hover:border-white/20 transition-all uppercase shadow-2xl active:scale-95">VIEW SYSTEM LOGS</button>
 </motion.div>
 </div>
 </div>
 );

 // ─── User Management ──────────────────────────────────────────────────
 const renderUserManagement = () => {
 const filtered = users.filter(u =>
 (userRoleFilter === 'All' || u.role === userRoleFilter) &&
 (u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))
 );
 const toggleStatus = (id: string) => {
 setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
 };
 return (
 <div className="space-y-8 relative z-10">
 <div className="flex flex-col md:flex-row justify-between items-start gap-4">
 <div>
 <h1 className="text-4xl font-display font-semibold tracking-tighter">User Management</h1>
 <p className="text-sm font-bold text-white/20 uppercase tracking-[0.4em] mt-2">{users.length} registered entities across the network</p>
 </div>
 <div className="flex gap-3 flex-wrap">
 {['All', 'Restaurant', 'NGO', 'Agent'].map(r => (
 <button key={r} onClick={() => setUserRoleFilter(r)} className={cn("px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all", userRoleFilter === r ? 'bg-green-500 text-white shadow-lg' : 'bg-white/5 text-white/30 hover:text-white hover:bg-white/10')}>{r}</button>
 ))}
 </div>
 </div>
 <div className="relative">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
 <input type="text" placeholder="Search users by name or email..." value={userSearch} onChange={e => setUserSearch(e.target.value)} className="w-full bg-white/2 border border-white/5 rounded-2xl py-4 pl-12 pr-8 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all placeholder:text-white/10" />
 </div>
 <div className="glass-dark rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
 <div className="grid grid-cols-[2fr_1fr_2fr_1fr_1fr_auto] gap-4 px-8 py-5 border-b border-white/5 text-[10px] font-semibold text-white/20 uppercase tracking-wide">
 <span>Name</span><span>Role</span><span>Email</span><span>Joined</span><span>Status</span><span>Actions</span>
 </div>
 <div className="divide-y divide-white/5">
 {filtered.map((user, i) => (
 <motion.div key={user.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="grid grid-cols-[2fr_1fr_2fr_1fr_1fr_auto] gap-4 px-8 py-5 hover:bg-white/2 transition-colors items-center">
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0 font-semibold text-sm text-white/40">{user.name[0]}</div>
 <p className="font-semibold text-sm truncate">{user.name}</p>
 </div>
 <span className={cn("px-2 py-1 rounded-lg text-[9px] font-semibold tracking-wide w-fit", user.role === 'Restaurant' ? 'bg-orange-500/10 text-orange-400' : user.role === 'NGO' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400')}>{user.role}</span>
 <p className="text-xs text-white/40 font-bold truncate">{user.email}</p>
 <p className="text-xs text-white/30 font-bold">{user.joined}</p>
 <span className={cn("px-2 py-1 rounded-lg text-[9px] font-semibold tracking-wide w-fit", user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : user.status === 'Suspended' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400')}>{user.status}</span>
 <div className="flex gap-2">
 <button onClick={() => toggleStatus(user.id)} className={cn("p-2 rounded-xl transition-all", user.status === 'Active' ? 'bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white')}>
 <Power className="w-4 h-4" />
 </button>
 <button onClick={() => setUsers(prev => prev.filter(u => u.id !== user.id))} className="p-2 rounded-xl bg-white/5 text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all">
 <Trash2 className="w-4 h-4" />
 </button>
 </div>
 </motion.div>
 ))}
 {filtered.length === 0 && <div className="flex items-center justify-center py-12 text-white/20"><p className="font-semibold text-sm uppercase tracking-wide">No users match your filter</p></div>}
 </div>
 </div>
 </div>
 );
 };

 // ─── Verifications ────────────────────────────────────────────────────
 const renderVerifications = () => {
 const handleAction = (id: string, status: string) => {
 setVerifications(prev => prev.map(v => v.id === id ? { ...v, status } : v));
 setSelectedVerif(null);
 };
 return (
 <div className="space-y-8 relative z-10">
 <div className="flex justify-between items-end">
 <div>
 <h1 className="text-4xl font-display font-semibold tracking-tighter">Verification Queue</h1>
 <p className="text-sm font-bold text-white/20 uppercase tracking-[0.4em] mt-2">Review and approve organizations joining the network</p>
 </div>
 <div className="flex gap-4">
 <div className="glass-dark border border-white/[0.03] p-4 rounded-2xl"><p className="text-[10px] font-semibold text-white/30 tracking-wide mb-1">Pending</p><p className="text-2xl font-semibold text-yellow-400">{verifications.filter(v => v.status === 'Pending').length}</p></div>
 <div className="glass-dark border border-white/[0.03] p-4 rounded-2xl"><p className="text-[10px] font-semibold text-white/30 tracking-wide mb-1">Approved</p><p className="text-2xl font-semibold text-emerald-400">{verifications.filter(v => v.status === 'Approved').length}</p></div>
 </div>
 </div>
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 <div className="lg:col-span-1 space-y-4">
 {verifications.map(v => (
 <button key={v.id} onClick={() => setSelectedVerif(selectedVerif?.id === v.id ? null : v)} className={cn("w-full p-6 rounded-[28px] border transition-all text-left group", selectedVerif?.id === v.id ? 'bg-green-500/10 border-green-500/40' : 'glass-dark border-white/[0.03] hover:border-white/20')}>
 <div className="flex justify-between items-start mb-4">
 <span className={cn("px-2 py-1 rounded-lg text-[9px] font-semibold uppercase tracking-tighter", v.type === 'Restaurant' ? 'bg-orange-500/20 text-orange-400' : v.type === 'NGO' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400')}>{v.type}</span>
 <span className={cn("text-[10px] font-semibold", v.status === 'Pending' ? 'text-yellow-500' : v.status === 'Approved' ? 'text-emerald-400' : 'text-red-400')}>{v.status.toUpperCase()}</span>
 </div>
 <h3 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors">{v.name}</h3>
 <p className="text-xs text-white/30 mt-1">Submitted: {v.submitted}</p>
 </button>
 ))}
 </div>
 <div className="lg:col-span-2">
 {selectedVerif ? (
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-dark border border-white/[0.03] rounded-[40px] overflow-hidden shadow-2xl sticky top-4">
 <div className="p-8 border-b border-white/[0.03] flex justify-between items-center bg-white/3">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400"><Building2 className="w-6 h-6" /></div>
 <div><h2 className="text-2xl font-semibold text-white">{selectedVerif.name}</h2><p className="text-sm text-white/30">System ID: {selectedVerif.id.toUpperCase()}</p></div>
 </div>
 {selectedVerif.status === 'Pending' && (
 <div className="flex gap-3">
 <button onClick={() => handleAction(selectedVerif.id, 'Rejected')} className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all"><XCircle className="w-5 h-5" /></button>
 <button onClick={() => handleAction(selectedVerif.id, 'Approved')} className="px-6 py-3 rounded-xl bg-green-500 text-white font-bold flex items-center gap-2 hover:bg-green-600 transition-all shadow-lg"><CheckCircle2 className="w-5 h-5" /> Approve</button>
 </div>
 )}
 </div>
 <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
 <div className="space-y-6">
 <div><p className="text-[10px] font-semibold text-white/30 uppercase tracking-wide mb-3">Organization Details</p>
 <div className="space-y-3">
 <div className="flex items-center gap-3 text-white/60"><MapPin className="w-4 h-4 text-green-400" /><span>{selectedVerif.address}</span></div>
 <div className="flex items-center gap-3 text-white/60"><ShieldCheck className="w-4 h-4 text-green-400" /><span>License: {selectedVerif.license}</span></div>
 <div className="flex items-center gap-3 text-white/60"><Phone className="w-4 h-4 text-green-400" /><span>{selectedVerif.contact}</span></div>
 </div>
 </div>
 <div><p className="text-[10px] font-semibold text-white/30 uppercase tracking-wide mb-3">Uploaded Documents</p>
 {selectedVerif.documents.map((doc: string, idx: number) => (
 <div key={idx} onClick={() => setPreviewDoc(doc)} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/[0.03] hover:border-white/20 transition-all cursor-pointer mb-2 group">
 <div className="flex items-center gap-3"><FileText className="w-4 h-4 text-white/30 group-hover:text-green-400" /><span className="text-white/60 group-hover:text-white text-xs">{doc}</span></div>
 <Eye className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
 </div>
 ))}
 </div>
 </div>
 <div className="bg-white/3 rounded-2xl p-6 border border-white/[0.03]">
 <h4 className="font-bold text-white mb-4 flex items-center gap-2"><Info className="w-4 h-4 text-green-400" /> Reviewer Notes</h4>
 <textarea className="w-full h-32 bg-black/40 border border-white/[0.03] rounded-xl p-4 text-white/60 focus:outline-none focus:border-green-500/50 transition-all text-sm resize-none" placeholder="Add verification notes..." />
 <button className="w-full mt-4 py-3 rounded-xl border border-white/[0.03] text-white/40 font-bold hover:bg-white/5 transition-all text-xs uppercase tracking-wide">Request More Information</button>
 </div>
 </div>
 </motion.div>
 ) : (
 <div className="h-[400px] border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center text-center">
 <ShieldCheck className="w-12 h-12 text-white/10 mb-4" />
 <p className="font-semibold text-sm text-white/20 uppercase tracking-wide">Select an organization from the left</p>
 </div>
 )}
 </div>
 </div>
 </div>
 );
 };

 // ─── System Logs ──────────────────────────────────────────────────────
 const renderSystemLogs = () => {
 const filtered = logs.filter(l => logFilter === 'All' || l.level === logFilter);
 return (
 <div className="space-y-6 relative z-10">
 <div className="flex flex-col md:flex-row justify-between items-start gap-4">
 <div>
 <h1 className="text-4xl font-display font-semibold tracking-tighter">System Logs</h1>
 <p className="text-sm font-bold text-white/20 uppercase tracking-[0.4em] mt-2">Live audit trail · Auto-updating every 4s</p>
 </div>
 <div className="flex gap-3 items-center">
 <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold"><div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> LIVE</div>
 {['All', 'INFO', 'WARN', 'ERROR'].map(f => (
 <button key={f} onClick={() => setLogFilter(f)} className={cn("px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all", logFilter === f ? (f === 'ERROR' ? 'bg-red-500 text-white' : f === 'WARN' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white') : 'bg-white/5 text-white/30 hover:text-white hover:bg-white/10')}>{f}</button>
 ))}
 </div>
 </div>
 <div className="glass-dark rounded-[40px] border border-white/5 shadow-2xl overflow-hidden">
 <div className="flex items-center gap-4 px-8 py-4 border-b border-white/5 bg-white/2">
 <Terminal className="w-4 h-4 text-green-400" />
 <span className="text-xs font-semibold text-white/30 uppercase tracking-wide font-mono">zerowaste-core-v7.4 // root@sys-admin</span>
 <div className="ml-auto flex gap-2">
 <button onClick={() => setLogs(INITIAL_LOGS)} className="p-2 rounded-lg hover:bg-white/5 transition-colors text-white/20 hover:text-white"><RefreshCw className="w-4 h-4" /></button>
 <button className="p-2 rounded-lg hover:bg-white/5 transition-colors text-white/20 hover:text-white"><Download className="w-4 h-4" /></button>
 </div>
 </div>
 <div className="p-6 h-[500px] overflow-y-auto custom-scrollbar font-mono space-y-2">
 <AnimatePresence initial={false}>
 {filtered.map((log, i) => (
 <motion.div key={`${log.ts}-${i}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-start gap-4 text-xs group hover:bg-white/2 px-3 py-1.5 rounded-xl transition-colors">
 <span className="text-white/20 shrink-0 w-16">{log.ts}</span>
 <span className={cn("shrink-0 w-12 font-semibold", log.level === 'ERROR' ? 'text-red-400' : log.level === 'WARN' ? 'text-yellow-400' : 'text-green-400')}>{log.level}</span>
 <span className="text-white/60 group-hover:text-white transition-colors">{log.msg}</span>
 </motion.div>
 ))}
 </AnimatePresence>
 <div ref={logsEndRef} />
 </div>
 </div>
 </div>
 );
 };

 // ─── Environment ──────────────────────────────────────────────────────
 const renderEnvironment = () => {
 const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
 <button onClick={onChange} className={cn("w-14 h-7 rounded-full transition-all relative border shrink-0", value ? 'bg-green-500 border-green-400' : 'bg-white/10 border-white/[0.03]')}>
 <div className={cn("w-5 h-5 rounded-full bg-white shadow-lg absolute top-0.5 transition-all", value ? 'left-8' : 'left-0.5')} />
 </button>
 );
 return (
 <div className="space-y-8 relative z-10 max-w-4xl">
 <div>
 <h1 className="text-4xl font-display font-semibold tracking-tighter">Environment Config</h1>
 <p className="text-sm font-bold text-white/20 uppercase tracking-[0.4em] mt-2">System-wide feature flags and thresholds</p>
 </div>

 <div className="glass-dark rounded-[40px] border border-white/[0.03] p-8 shadow-2xl space-y-6">
 <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wide flex items-center gap-2"><ToggleRight className="w-4 h-4 text-green-400" /> Feature Toggles</h3>
 {[
 { key: 'emailAlerts', label: 'Email Alerts', desc: 'Send notification emails for critical events' },
 { key: 'aiRouting', label: 'AI Smart Routing', desc: 'Use ML-based NGO-to-donor matching algorithm' },
 { key: 'autoVerification', label: 'Auto-Verification', desc: 'Skip manual review for trusted organization types' },
 { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Restricts access to admin panel only — USE WITH CAUTION' },
 { key: 'publicApi', label: 'Public API Access', desc: 'Allow third-party app access via API keys' },
 { key: 'analyticsTracking', label: 'Analytics Tracking', desc: 'Aggregate usage data for performance insights' },
 ].map(({ key, label, desc }) => (
 <div key={key} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 gap-4">
 <div>
 <p className="font-semibold text-sm">{label}</p>
 <p className="text-xs text-white/30 mt-0.5">{desc}</p>
 </div>
 <Toggle value={(envSettings as any)[key]} onChange={() => setEnvSettings(prev => ({ ...prev, [key]: !(prev as any)[key] }))} />
 </div>
 ))}
 </div>

 <div className="glass-dark rounded-[40px] border border-white/[0.03] p-8 shadow-2xl space-y-6">
 <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wide flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-green-400" /> Operational Thresholds</h3>
 {[
 { key: 'maxDonationRadius', label: 'Max Donation Radius', unit: 'km', min: 1, max: 50 },
 { key: 'pickupTimeout', label: 'Pickup Timeout Window', unit: 'mins', min: 30, max: 480 },
 { key: 'maxUsersPerNode', label: 'Max Users per Node', unit: 'users', min: 100, max: 2000 },
 ].map(({ key, label, unit, min, max }) => (
 <div key={key} className="space-y-3 py-4 border-b border-white/5 last:border-0">
 <div className="flex justify-between items-center">
 <p className="font-semibold text-sm">{label}</p>
 <span className="px-3 py-1 rounded-xl bg-green-500/10 text-green-400 text-xs font-semibold border border-green-500/20">{(envSettings as any)[key]} {unit}</span>
 </div>
 <input type="range" min={min} max={max} value={(envSettings as any)[key]} onChange={e => setEnvSettings(prev => ({ ...prev, [key]: +e.target.value }))} className="w-full accent-green-500 h-2 rounded-full cursor-pointer" />
 <div className="flex justify-between text-[10px] font-semibold text-white/20"><span>{min} {unit}</span><span>{max} {unit}</span></div>
 </div>
 ))}
 </div>

 <button className="px-10 py-5 rounded-2xl bg-green-500 text-white font-semibold tracking-wide hover:bg-green-600 transition-all shadow-xl shadow-green-500/20 active:scale-95 flex items-center gap-3">
 <Save className="w-5 h-5" /> APPLY CONFIGURATION
 </button>
 </div>
 );
 };

 // ─── Profile ──────────────────────────────────────────────────────────
 const renderProfile = () => (
 <div className="max-w-4xl mx-auto space-y-8 relative z-10">
 <div>
 <h1 className="text-4xl font-display font-semibold tracking-tighter">Admin Profile</h1>
 <p className="text-sm font-bold text-white/20 uppercase tracking-[0.4em] mt-2">System administrator credentials</p>
 </div>
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-dark rounded-[48px] p-10 border border-white/[0.03] shadow-2xl">
 <div className="flex items-center gap-8 mb-10 pb-10 border-b border-white/5">
 <div className="w-24 h-24 rounded-[28px] bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
 <ShieldCheck className="w-12 h-12 text-green-400" />
 </div>
 <div>
 <h2 className="text-3xl font-display font-semibold ">{adminProfile.name}</h2>
 <div className="flex flex-wrap gap-3 mt-3">
 <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] font-semibold border border-green-500/20">ROOT ACCESS</span>
 <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-[10px] font-semibold border border-red-500/20">{adminProfile.clearance}</span>
 <span className="px-3 py-1 rounded-full bg-white/5 text-white/40 text-[10px] font-semibold border border-white/[0.03]">ID: {adminProfile.id}</span>
 </div>
 </div>
 </div>
 <form onSubmit={e => { e.preventDefault(); setProfileSaved(true); setTimeout(() => setProfileSaved(false), 3000); }} className="space-y-8">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 {[
 { label: 'Full Name', key: 'name', icon: User },
 { label: 'Admin ID', key: 'id', icon: ShieldCheck },
 { label: 'Email Address', key: 'email', icon: Mail },
 { label: 'Contact', key: 'phone', icon: Phone },
 ].map(({ label, key, icon: Icon }) => (
 <div key={key} className="space-y-3">
 <label className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.3em] pl-2">{label}</label>
 <div className="relative group">
 <Icon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-green-400 transition-colors" />
 <input type="text" value={(adminProfile as any)[key]} onChange={e => setAdminProfile({ ...adminProfile, [key]: e.target.value })} className="w-full bg-white/2 border border-white/5 rounded-[20px] py-5 pl-14 pr-5 text-sm font-semibold focus:outline-none focus:bg-white/5 focus:ring-2 focus:ring-green-500/20 transition-all" />
 </div>
 </div>
 ))}
 </div>
 <div className="flex gap-4 pt-4 flex-wrap">
 <button type="submit" className="px-10 py-5 rounded-2xl bg-green-500 text-white font-semibold tracking-wide hover:bg-green-600 transition-all shadow-xl shadow-green-500/20 active:scale-95 flex items-center gap-3">
 <Save className="w-5 h-5" /> SAVE CHANGES
 </button>
 <button type="button" onClick={() => setShowPwChange(!showPwChange)} className="px-8 py-5 rounded-2xl bg-white/5 border border-white/[0.03] text-white/60 font-semibold tracking-wide hover:bg-white/10 transition-all flex items-center gap-3">
 <Lock className="w-5 h-5" /> CHANGE PASSWORD
 </button>
 <AnimatePresence>
 {profileSaved && (
 <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-emerald-400 font-semibold text-sm self-center">
 <CheckCheck className="w-5 h-5" /> Changes saved!
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 </form>
 <AnimatePresence>
 {showPwChange && (
 <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-8 pt-8 border-t border-white/5 overflow-hidden">
 <h4 className="font-semibold text-sm uppercase tracking-wide mb-6 flex items-center gap-2"><Lock className="w-4 h-4 text-green-400" /> Change Password</h4>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {['Current Password', 'New Password', 'Confirm Password'].map(label => (
 <div key={label} className="space-y-3">
 <label className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.3em]">{label}</label>
 <div className="relative">
 <input type={showPw ? 'text' : 'password'} className="w-full bg-white/2 border border-white/5 rounded-[20px] py-5 pl-5 pr-14 text-sm font-semibold focus:outline-none focus:bg-white/5 focus:ring-2 focus:ring-green-500/20 transition-all placeholder:text-white/10" placeholder="••••••••" />
 <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">{showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
 </div>
 </div>
 ))}
 </div>
 <button className="mt-6 px-8 py-4 rounded-2xl bg-green-500 text-white font-semibold text-xs tracking-wide hover:bg-green-600 transition-all active:scale-95">UPDATE PASSWORD</button>
 </motion.div>
 )}
 </AnimatePresence>
 </motion.div>

 <div className="grid grid-cols-3 gap-6">
 {[
 { label: 'Last Login', value: '13:40 IST', icon: Activity, color: 'text-green-400' },
 { label: 'Total Actions', value: '1,284', icon: BarChart3, color: 'text-blue-400' },
 { label: 'Security Score', value: '99/100', icon: ShieldCheck, color: 'text-emerald-400' },
 ].map((s, i) => (
 <div key={i} className="glass-dark rounded-[32px] p-6 border border-white/5 flex items-center gap-6">
 <s.icon className={cn('w-8 h-8', s.color)} />
 <div><p className="text-2xl font-display font-semibold">{s.value}</p><p className="text-[9px] text-white/30 font-semibold tracking-wide">{s.label}</p></div>
 </div>
 ))}
 </div>
 </div>
 );

 return (
 <DashboardLayout sidebarItems={sidebarItems} title="System Administrator" portalType="admin">
 <div className="relative min-h-[calc(100vh-160px)]">
 <AnimatePresence mode="wait">
 <motion.div key={activeTab} initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.98 }} transition={{ duration: 0.3, ease: "easeOut" }}>
 {activeTab === 'Overview' && renderOverview()}
 {activeTab === 'User Management' && renderUserManagement()}
 {activeTab === 'Verifications' && renderVerifications()}
 {activeTab === 'System Logs' && renderSystemLogs()}
 {activeTab === 'Environment' && renderEnvironment()}
 {activeTab === 'Profile' && renderProfile()}
 </motion.div>
 </AnimatePresence>
 </div>
 
 <DocumentViewerModal 
 isOpen={!!previewDoc} 
 onClose={() => setPreviewDoc(null)} 
 documentName={previewDoc || ''} 
 />
 </DashboardLayout>
 );
}
