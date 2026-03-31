import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
 LogOut, User, Bell, Menu, X,
 Search, Sparkles, AlertCircle, CheckCircle2,
 Settings, ChevronDown, Package, Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SidebarItem {
 icon: any;
 label: string;
 active?: boolean;
 onClick?: () => void;
}

interface DashboardLayoutProps {
 children: ReactNode;
 sidebarItems: SidebarItem[];
 title: string;
 portalType: 'restaurant' | 'ngo' | 'admin' | 'agent';
}

export default function DashboardLayout({ children, sidebarItems, title, portalType }: DashboardLayoutProps) {
 const [isSidebarOpen, setIsSidebarOpen] = useState(true);
 const [showNotifications, setShowNotifications] = useState(false);
 const navigate = useNavigate();

 useState(() => {
 document.title = `ZeroWaste | ${title}`;
 return () => { document.title = 'ZeroWaste | Mission-Critical Food Logistics'; };
 });

 useEffect(() => {
 document.title = `ZeroWaste | ${title}`;
 }, [title, portalType]);

 const themeConfig = {
 restaurant: {
 accent: 'bg-orange-500',
 accentHex: '#f97316',
 text: 'text-orange-400',
 bg: 'bg-orange-500/10',
 border: 'border-orange-500/20',
 wordColor: 'text-orange-400',
 },
 ngo: {
 accent: 'bg-purple-500',
 accentHex: '#a855f7',
 text: 'text-purple-400',
 bg: 'bg-purple-500/10',
 border: 'border-purple-500/20',
 wordColor: 'text-purple-400',
 },
 admin: {
 accent: 'bg-green-500',
 accentHex: '#22c55e',
 text: 'text-green-400',
 bg: 'bg-green-500/10',
 border: 'border-green-500/20',
 wordColor: 'text-green-400',
 },
 agent: {
 accent: 'bg-blue-500',
 accentHex: '#3b82f6',
 text: 'text-blue-400',
 bg: 'bg-blue-500/10',
 border: 'border-blue-500/20',
 wordColor: 'text-blue-400',
 },
 }[portalType];

 const notifications = [
 { title: 'URGENT RESCUE', text: 'New surplus at Amul Rest.', time: '2M AGO', icon: AlertCircle, color: 'text-red-400' },
 { title: 'PICKUP VERIFIED', text: 'Helping Hands accepted.', time: '15M AGO', icon: CheckCircle2, color: 'text-teal-400' },
 { title: 'SYSTEM SIGNAL', text: 'New regional nodes active.', time: '1H AGO', icon: Sparkles, color: 'text-purple-400' },
 ];

 return (
 <motion.div
 initial={{ opacity: 0, filter: 'blur(10px)' }}
 animate={{ opacity: 1, filter: 'blur(0px)' }}
 exit={{ opacity: 0, filter: 'blur(10px)' }}
 transition={{ duration: 0.5 }}
 className="min-h-screen bg-black text-white flex font-sans overflow-hidden"
 >
 {/* Ambient Background Glows mirroring LandingPage */}
 <div className="absolute inset-0 z-0 pointer-events-none" style={{
 background: `radial-gradient(circle at 15% 30%, ${themeConfig.accentHex}10 0%, transparent 60%),
 radial-gradient(circle at 85% 70%, ${themeConfig.accentHex}08 0%, transparent 60%)`
 }} />

 {/* Sidebar */}
 <motion.aside
 initial={false}
 animate={{ width: isSidebarOpen ? 320 : 96 }}
 className="bg-white/[0.01] border-r border-white/5 flex flex-col h-screen z-50 relative backdrop-blur-xl"
 >
 <div className="px-8 py-6 flex items-center h-28 shrink-0 border-b border-white/5">
 {isSidebarOpen ? (
 <motion.div
 initial={{ opacity: 0, x: -10 }}
 animate={{ opacity: 1, x: 0 }}
 className="flex flex-col"
 >
 <div className="flex items-center font-display font-black tracking-tighter text-4xl">
 <span className="text-white">Zero</span>
 <span className={themeConfig.wordColor}>Waste</span>
 </div>
 <span className="text-[9px] font-black text-white/30 tracking-[0.35em] uppercase mt-2">{portalType} PORTAL</span>
 </motion.div>
 ) : (
 <motion.span
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 className={`text-xl font-display font-black ${themeConfig.wordColor}`}
 >
 ZW
 </motion.span>
 )}
 </div>

 <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
 {sidebarItems.map((item, i) => {
 const Icon = item.icon;
 return (
 <button
 key={i}
 onClick={item.onClick}
 className={cn(
 "flex items-center gap-4 p-4 rounded-2xl transition-all group relative overflow-hidden text-sm",
 item.active ? "bg-white/5 text-white" : "text-white/40 hover:bg-white/2 hover:text-white"
 )}
 >
 {item.active && (
 <motion.div
 layoutId="sidebar-active"
 className={cn("absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full", themeConfig.accent)}
 />
 )}
 <Icon className={cn("w-6 h-6 transition-transform group-hover:scale-110", item.active && themeConfig.text)} />
 {isSidebarOpen && <span className="font-semibold tracking-tight">{item.label}</span>}
 </button>
 );
 })}
 </nav>

 <div className="p-4 border-t border-white/5 shrink-0">
 <button
 onClick={() => navigate('/')}
 className="flex items-center gap-4 p-4 w-full rounded-2xl text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-all group font-semibold text-sm"
 >
 <LogOut className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
 {isSidebarOpen && <span>DISCONNECT</span>}
 </button>
 </div>
 </motion.aside>

 {/* Main Content Area */}
 <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
 {/* Top Header */}
 <header className="h-24 bg-white/[0.01] backdrop-blur-xl border-b border-white/5 px-8 flex items-center justify-between shrink-0">
 <div className="flex items-center gap-6">
 <button
 onClick={() => setIsSidebarOpen(!isSidebarOpen)}
 className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition-all"
 >
 {isSidebarOpen ? <X className="w-5 h-5 opacity-40" /> : <Menu className="w-5 h-5 opacity-40" />}
 </button>
 <div>
 <h2 className="text-xl font-display font-black tracking-tight uppercase">{title}</h2>
 <p className="text-[10px] font-black text-white/20 tracking-[0.3em] uppercase mt-0.5">V7.4 // LOGISTICS CLEARANCE ACTIVE</p>
 </div>
 </div>

 <div className="flex items-center gap-4">
 {/* Notifications */}
 <div className="relative">
 <button
 onClick={() => setShowNotifications(!showNotifications)}
 className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition-all relative group"
 >
 <Bell className="w-5 h-5 opacity-40 group-hover:opacity-100" />
 <span className={cn("absolute top-3 right-3 w-2 h-2 rounded-full animate-pulse", themeConfig.accent)} />
 </button>

 <AnimatePresence>
 {showNotifications && (
 <motion.div
 initial={{ opacity: 0, y: 10, scale: 0.95 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 10, scale: 0.95 }}
 className="absolute top-16 right-0 w-80 bg-black/90 border border-white/[0.03] rounded-[32px] p-6 shadow-2xl z-[100] backdrop-blur-3xl"
 >
 <div className="flex justify-between items-center mb-6">
 <h4 className="text-xs font-black tracking-widest uppercase">Pulse Monitor</h4>
 <span className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">3 Signals</span>
 </div>
 <div className="space-y-4">
 {notifications.map((n, i) => (
 <div key={i} className="flex gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group">
 <div className={cn("w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5", n.color)}>
 <n.icon className="w-5 h-5" />
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-xs font-semibold truncate tracking-tight">{n.title}</p>
 <p className="text-[10px] font-bold text-white/40 truncate mt-0.5">{n.text}</p>
 <p className="text-[8px] font-semibold text-white/20 mt-1 uppercase tracking-wide">{n.time}</p>
 </div>
 </div>
 ))}
 </div>
 <button className="w-full py-4 mt-6 rounded-2xl bg-white/5 hover:bg-white/10 text-[9px] font-semibold tracking-[0.2em] uppercase transition-all">
 ARCHIVE SIGNALS
 </button>
 </motion.div>
 )}
 </AnimatePresence>
 </div>

 <div className="flex items-center gap-4 pl-6 ml-2 border-l border-white/5">
 <div className="text-right hidden sm:block">
 <p className="text-xs font-semibold tracking-tight">{portalType === 'restaurant' ? 'Amul Rest.' : portalType === 'ngo' ? 'Mission Hub' : 'System Root'}</p>
 <p className="text-[8px] font-semibold text-white/20 tracking-wide uppercase">NODE ACTIVE</p>
 </div>
 <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shadow-lg group overflow-hidden relative">
 <div className={cn("absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity", themeConfig.accent)} />
 <User className="w-6 h-6 text-white/40 group-hover:text-white transition-colors relative z-10" />
 </div>
 </div>
 </div>
 </header>

 {/* Dynamic Content Scroll Area */}
 <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5 }}
 className="max-w-7xl mx-auto"
 >
 {children}
 </motion.div>
 </div>
 </main>

 {/* Global CSS for Custom Scrollbar and Other Tweaks */}
 <style>{`
 .custom-scrollbar::-webkit-scrollbar {
 width: 4px;
 }
 .custom-scrollbar::-webkit-scrollbar-track {
 background: transparent;
 }
 .custom-scrollbar::-webkit-scrollbar-thumb {
 background: rgba(255, 255, 255, 0.05);
 border-radius: 10px;
 }
 .custom-scrollbar::-webkit-scrollbar-thumb:hover {
 background: rgba(255, 255, 255, 0.1);
 }
 `}</style>
 </motion.div>
 );
}
