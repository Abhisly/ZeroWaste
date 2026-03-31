import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
 LayoutDashboard, List, Map as MapIcon, History, User,
 Heart, Package, Clock, CheckCircle2, TrendingUp, AlertCircle,
 Filter, Search, MoreHorizontal, ChevronRight, MapPin, Navigation,
 ShieldCheck, HeartHandshake, Utensils, Truck, X, Info,
 Save, Building2, Phone, Mail, Globe, Star, CheckCheck,
 Zap, Users, BarChart3, Leaf, Award, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import DashboardLayout from '@/components/DashboardLayout';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, any> = {
 utensils: Utensils, package: Package, heart: Heart, clock: Clock, truck: Truck,
};

const chartData = [
 { name: 'Jan', meals: 450 },
 { name: 'Feb', meals: 520 },
 { name: 'Mar', meals: 610 },
 { name: 'Apr', meals: 580 },
 { name: 'May', meals: 720 },
 { name: 'Jun', meals: 850 },
];

const IMPACT_HISTORY = [
 { id: 'ih1', date: '2026-03-16', food: 'Vegetable Biryani', donor: 'Amul Restaurant', qty: '25 Plates', meals: 25, people: 20, co2: '3.1kg', status: 'Delivered' },
 { id: 'ih2', date: '2026-03-15', food: 'Assorted Bread', donor: 'Golden Bakery', qty: '12 kg', meals: 30, people: 25, co2: '1.8kg', status: 'Delivered' },
 { id: 'ih3', date: '2026-03-14', food: 'Mixed Fruits', donor: 'Fresh Mart', qty: '15 kg', meals: 20, people: 18, co2: '2.4kg', status: 'Delivered' },
 { id: 'ih4', date: '2026-03-12', food: 'Dal & Rice', donor: 'Spice Garden', qty: '30 Plates', meals: 30, people: 28, co2: '4.2kg', status: 'Delivered' },
 { id: 'ih5', date: '2026-03-10', food: 'Sandwich Trays', donor: 'Cafe Bloom', qty: '50 Units', meals: 50, people: 40, co2: '2.0kg', status: 'Delivered' },
];

// Static map pins
const MAP_PINS = [
 { id: 1, x: 30, y: 30, label: 'Amul Restaurant', type: 'donor', distance: '2.4km', food: 'Vegetable Biryani' },
 { id: 2, x: 65, y: 25, label: 'Golden Bakery', type: 'donor', distance: '0.8km', food: 'Assorted Bread' },
 { id: 3, x: 80, y: 60, label: 'Fresh Mart', type: 'donor', distance: '5.2km', food: 'Mixed Fruits' },
 { id: 4, x: 20, y: 70, label: 'Spice Garden', type: 'donor', distance: '3.1km', food: 'Dal & Rice' },
 { id: 5, x: 50, y: 50, label: 'Mission Hub (You)', type: 'ngo', distance: '0km', food: '' },
];

export default function NgoDashboard() {
 const navigate = useNavigate();
 const [searchParams, setSearchParams] = useSearchParams();
 const activeTab = searchParams.get('tab') || 'Overview';

 const [globalDonations, setGlobalDonations] = useState<any[]>(() => {
 const saved = localStorage.getItem('zw_global_donations');
 if (saved) return JSON.parse(saved);
 return [
 { id: 101, donor: 'Amul Restaurant', food: 'Vegetable Biryani', qty: '25 Plates', distance: '2.4km', time: '12M LEFT', status: 'Pending', iconId: 'utensils', color: 'text-red-400', type: 'Cooked' },
 { id: 102, donor: 'Golden Bakery', food: 'Assorted Bread', qty: '12kg', distance: '0.8km', time: '45M LEFT', status: 'Pending', iconId: 'package', color: 'text-orange-400', type: 'Bakery' },
 { id: 103, donor: 'Fresh Mart', food: 'Mixed Fruits', qty: '15kg', distance: '5.2km', time: '2H LEFT', status: 'Pending', iconId: 'heart', color: 'text-purple-400', type: 'Produce' },
 ];
 });

 const availableFood = globalDonations.filter(d => d.status === 'Pending');

 const [activePickups, setActivePickups] = useState<any[]>(() => {
 const saved = localStorage.getItem('zw_ngo_active_pickups');
 if (saved) return JSON.parse(saved);
 return [];
 });

 const [selectedPin, setSelectedPin] = useState<any>(null);
 const [profileSaved, setProfileSaved] = useState(false);
 const [historySearch, setHistorySearch] = useState('');
 const [profile, setProfile] = useState({
 name: 'Mission Hub NGO',
 registrationNo: 'NGO-MH-2024-00812',
 address: '14 Community Lane, Bengaluru, Karnataka - 560002',
 contact: '+91 80 2345 6789',
 email: 'missions@missionhub.org',
 website: 'www.missionhub.org',
 mission: 'We rescue surplus food from restaurants and deliver it to underprivileged communities, shelters, and orphanages across Bengaluru, eliminating food waste while feeding those in need.',
 });

 useEffect(() => {
 localStorage.setItem('zw_global_donations', JSON.stringify(globalDonations));
 localStorage.setItem('zw_ngo_active_pickups', JSON.stringify(activePickups));
 }, [globalDonations, activePickups]);

 useEffect(() => {
 const handleStorageChange = (e: StorageEvent) => {
 if (e.key === 'zw_global_donations' && e.newValue) setGlobalDonations(JSON.parse(e.newValue));
 };
 window.addEventListener('storage', handleStorageChange);
 return () => window.removeEventListener('storage', handleStorageChange);
 }, []);

 const setActiveTab = (tab: string) => { setSearchParams({ tab }); };

 const sidebarItems = [
 { icon: LayoutDashboard, label: 'Overview', active: activeTab === 'Overview', onClick: () => setActiveTab('Overview') },
 { icon: List, label: 'Available Food', active: activeTab === 'Available Food', onClick: () => setActiveTab('Available Food') },
 { icon: MapIcon, label: 'Live Map', active: activeTab === 'Live Map', onClick: () => setActiveTab('Live Map') },
 { icon: Navigation, label: 'Active Pickups', active: activeTab === 'Active Pickups', onClick: () => setActiveTab('Active Pickups') },
 { icon: History, label: 'Impact History', active: activeTab === 'Impact History', onClick: () => setActiveTab('Impact History') },
 { icon: User, label: 'Profile', active: activeTab === 'Profile', onClick: () => setActiveTab('Profile') },
 ];

 const handleRescue = (foodItem: any) => {
 const updatedGlobal = globalDonations.map(d => d.id === foodItem.id ? { ...d, status: 'In Transit' } : d);
 setGlobalDonations(updatedGlobal);
 setActivePickups([{ ...foodItem, status: 'IN TRANSIT', startTime: new Date().toLocaleTimeString() }, ...activePickups]);
 setActiveTab('Active Pickups');
 };

 // ─── Overview ─────────────────────────────────────────────────────────
 const renderOverview = () => (
 <div className="space-y-10">
 <div className="absolute inset-0 z-0 opacity-5 pointer-events-none overflow-hidden">
 {/* Background removed for purer black aesthetic matching LandingPage */}
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
 {[
 { label: 'Meals Served', value: '4,280', sub: 'Across 12 regions', icon: Heart, color: 'text-purple-400', bg: 'bg-purple-500/10' },
 { label: 'Active Pickups', value: activePickups.length.toString(), sub: 'In-progress rescues', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
 { label: 'People Reached', value: '1,150', sub: 'Unique beneficiaries', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
 { label: 'Efficiency', value: '94%', sub: 'Logistics score: Optimal', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
 ].map((stat, i) => {
 const Icon = stat.icon;
 return (
 <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5, scale: 1.02 }} className="glass-dark p-6 rounded-[32px] border-white/5 flex flex-col gap-4 group cursor-default shadow-2xl backdrop-blur-3xl">
 <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg", stat.bg)}>
 <Icon className={cn("w-7 h-7", stat.color)} />
 </div>
 <div>
 <p className="text-3xl font-display font-semibold tracking-tight">{stat.value}</p>
 <p className="text-xs font-bold text-white/40 uppercase tracking-wide mt-1">{stat.label}</p>
 <p className="text-[10px] font-bold text-white/20 mt-1">{stat.sub}</p>
 </div>
 </motion.div>
 );
 })}
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="lg:col-span-2 glass-dark rounded-[40px] p-8 border-white/5 shadow-2xl backdrop-blur-3xl">
 <div className="flex justify-between items-center mb-10">
 <div>
 <h3 className="text-2xl font-display font-semibold tracking-tight flex items-center gap-3 ">STRATEGIC IMPACT <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.8)]" /></h3>
 <p className="text-sm font-bold text-white/30 uppercase tracking-wide mt-1">Beneficiary Reach Optimization Analysis</p>
 </div>
 </div>
 <div className="h-[300px] w-full">
 <ResponsiveContainer width="100%" height="100%">
 <BarChart data={chartData}>
 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#ffffff20', fontSize: 12, fontWeight: 700 }} dy={10} />
 <YAxis axisLine={false} tickLine={false} tick={{ fill: '#ffffff20', fontSize: 12, fontWeight: 700 }} />
 <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#050505', border: '1px solid #ffffff10', borderRadius: '16px', fontWeight: 800, color: '#fff' }} itemStyle={{ color: '#fff' }} />
 <Bar dataKey="meals" radius={[12, 12, 0, 0]}>
 {chartData.map((_, index) => <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#a855f7' : '#a855f720'} />)}
 </Bar>
 </BarChart>
 </ResponsiveContainer>
 </div>
 </motion.div>

 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="glass-dark rounded-[40px] p-8 border-white/5 flex flex-col shadow-2xl backdrop-blur-3xl">
 <div className="flex justify-between items-center mb-8">
 <h3 className="text-2xl font-display font-semibold tracking-tight">URGENT SIGNALS</h3>
 <span className="text-[10px] font-semibold py-1 px-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full">LIVE</span>
 </div>
 <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
 <AnimatePresence mode="popLayout">
 {availableFood.slice(0, 3).map((item) => {
 const Icon = ICON_MAP[item.iconId] || Utensils;
 return (
 <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: 50 }} onClick={() => handleRescue(item)} className="p-5 rounded-2xl bg-white/2 border border-white/5 group hover:bg-white/5 transition-all cursor-pointer shadow-lg">
 <div className="flex justify-between items-start mb-4">
 <div className="px-2 py-1 rounded-lg text-[8px] font-semibold tracking-wide text-white shadow-xl bg-purple-500/40">{item.status}</div>
 <span className="text-[10px] font-semibold text-white/20 uppercase tracking-tighter">{item.time}</span>
 </div>
 <div className="flex gap-4">
 <div className={cn("shrink-0 p-3 rounded-2xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform", item.color)}><Icon className="w-5 h-5" /></div>
 <div className="flex-1 min-w-0">
 <p className="font-semibold text-sm truncate uppercase tracking-tight">{item.food}</p>
 <p className="text-[10px] font-bold text-white/30 flex items-center gap-1.5 mt-1 uppercase tracking-wide"><MapPin className="w-3.5 h-3.5" /> {item.distance} » {item.donor}</p>
 </div>
 </div>
 </motion.div>
 );
 })}
 </AnimatePresence>
 {availableFood.length === 0 && (
 <div className="flex flex-col items-center justify-center py-16 opacity-20 ">
 <CheckCircle2 className="w-12 h-12 mb-4" />
 <p className="text-xs uppercase tracking-[0.3em]">Sector Secured</p>
 </div>
 )}
 </div>
 <button onClick={() => setActiveTab('Available Food')} className="w-full py-5 mt-8 rounded-2xl bg-purple-500 text-white text-[10px] font-semibold tracking-[0.3em] hover:bg-purple-600 transition-all shadow-2xl shadow-purple-500/30 uppercase active:scale-95">RESCUE PORTAL ACTIVATE</button>
 </motion.div>
 </div>
 </div>
 );

 // ─── Available Food ───────────────────────────────────────────────────
 const renderAvailableFood = () => (
 <div className="space-y-8 relative z-10">
 <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
 <div>
 <h1 className="text-4xl font-display font-semibold tracking-tighter">SURPLUS REGISTRY</h1>
 <p className="text-sm font-bold text-white/20 uppercase tracking-[0.5em] mt-2">Tactical food redirection network</p>
 </div>
 <div className="flex gap-4 w-full md:w-auto">
 <div className="relative group flex-1 md:flex-none">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-purple-400 transition-colors" />
 <input type="text" placeholder="Query donors or inventory..." className="w-full md:w-64 bg-white/2 border border-white/5 rounded-2xl py-4 pl-14 pr-8 text-xs font-semibold focus:outline-none focus:bg-white/5 focus:ring-4 focus:ring-purple-500/10 transition-all shadow-inner placeholder:text-white/10" />
 </div>
 <button className="p-4 bg-white/2 rounded-2xl border border-white/5 hover:bg-white/5 transition-all text-white/20 hover:text-white group"><Filter className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" /></button>
 </div>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 <AnimatePresence mode="popLayout">
 {availableFood.map((food) => (
 <motion.div key={food.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} whileHover={{ y: -8 }} className="glass-dark rounded-[40px] overflow-hidden border border-white/[0.03] group shadow-2xl backdrop-blur-3xl">
 <div className="p-10 relative">
 <div className="absolute top-0 right-0 p-8"><span className="text-[10px] font-semibold text-red-500/50 animate-pulse uppercase tracking-[0.3em] ">{food.status}</span></div>
 <div className="mb-4">
 <div className={cn("w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4", food.color)}>
 {(() => { const Icon = ICON_MAP[food.iconId] || Utensils; return <Icon className="w-6 h-6" />; })()}
 </div>
 <span className="px-5 py-2 rounded-full bg-white/2 text-[10px] font-semibold text-purple-400 border border-purple-500/10 shadow-lg">{food.type?.toUpperCase()} UNIT</span>
 </div>
 <h4 className="text-3xl font-display font-semibold tracking-tight mb-4 leading-tight ">{food.food}</h4>
 <div className="space-y-6 mt-10">
 <div className="flex items-center gap-4 text-white/40">
 <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"><Utensils className="w-5 h-5" /></div>
 <span className="text-sm font-semibold uppercase tracking-wide shrink-0">{food.donor}</span>
 <div className="h-px bg-white/5 flex-1" />
 </div>
 <div className="flex justify-between items-end p-6 rounded-3xl bg-white/2 border border-white/5 shadow-inner">
 <div className="space-y-2"><p className="text-[10px] font-semibold text-white/10 tracking-[0.3em]">LOAD CAPACITY</p><p className="text-2xl font-display font-semibold">{food.qty}</p></div>
 <div className="text-right space-y-2"><p className="text-[10px] font-semibold text-white/10 uppercase tracking-[0.3em]">PROXIMITY</p><p className="text-sm font-semibold flex items-center gap-2 justify-end text-purple-400"><Navigation className="w-4 h-4" /> {food.distance}</p></div>
 </div>
 </div>
 <button onClick={() => handleRescue(food)} className="w-full py-6 mt-10 rounded-[28px] bg-purple-500 text-white text-[11px] font-semibold tracking-[0.4em] hover:bg-purple-600 transition-all uppercase shadow-xl shadow-purple-500/20 active:scale-95">INITIATE RESCUE</button>
 </div>
 </motion.div>
 ))}
 </AnimatePresence>
 {availableFood.length === 0 && (
 <div className="col-span-3 flex flex-col items-center justify-center py-32 border border-dashed border-white/[0.03] rounded-[48px]">
 <CheckCircle2 className="w-16 h-16 text-purple-400/30 mb-4" />
 <p className="text-white/20 font-semibold uppercase tracking-wide text-sm">All surplus has been claimed!</p>
 </div>
 )}
 </div>
 </div>
 );

 // ─── Active Pickups ───────────────────────────────────────────────────
 const renderActivePickups = () => (
 <div className="space-y-12 relative z-10">
 <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
 <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="w-24 h-24 rounded-[32px] bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shadow-2xl relative">
 <div className="absolute inset-0 bg-purple-500 blur-3xl opacity-20 animate-pulse" />
 <Navigation className="w-12 h-12 text-purple-400 relative z-10" />
 </motion.div>
 <h1 className="text-5xl font-display font-semibold tracking-tighter">MISSION LOGISTICS</h1>
 <p className="text-base font-bold text-white/20 uppercase tracking-[0.6em]">Real-time operational tracking · Sector Alpha</p>
 </div>
 <div className="grid grid-cols-1 gap-8">
 <AnimatePresence mode="popLayout">
 {activePickups.map((pickup: any) => (
 <motion.div key={pickup.id} layout initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-dark rounded-[56px] p-10 border border-white/[0.03] flex flex-col md:flex-row items-center gap-10 group shadow-2xl backdrop-blur-3xl">
 <div className="w-24 h-24 bg-purple-500/10 rounded-[28px] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500"><Truck className="w-12 h-12 text-purple-400" /></div>
 <div className="flex-1 space-y-4 text-center md:text-left">
 <div className="flex flex-wrap gap-6 items-center justify-center md:justify-start">
 <h4 className="text-3xl font-display font-semibold tracking-tight ">{pickup.donor} · {pickup.food}</h4>
 <span className="px-5 py-2 rounded-full bg-purple-500 text-white text-[10px] font-semibold tracking-[0.2em] shadow-xl">EN ROUTE</span>
 </div>
 <div className="flex flex-wrap items-center gap-6 justify-center md:justify-start">
 <p className="text-xs font-semibold text-white/30 flex items-center gap-2.5 bg-white/5 py-2 px-5 rounded-full border border-white/5"><Clock className="w-4 h-4 text-purple-500" /> DEPLOYED AT {pickup.startTime}</p>
 <p className="text-xs font-semibold text-white/30 flex items-center gap-2.5 bg-white/5 py-2 px-5 rounded-full border border-white/5"><MapPin className="w-4 h-4 text-purple-500" /> DISTANCE: {pickup.distance}</p>
 </div>
 </div>
 <div className="flex gap-4 shrink-0">
 <button onClick={() => navigate(`/delivery/${pickup.id}`)} className="px-10 py-5 rounded-[24px] bg-white text-black font-semibold text-[11px] tracking-[0.3em] hover:scale-105 active:scale-95 transition-all uppercase shadow-2xl shadow-white/10">LIVE TRACK</button>
 <button onClick={() => setActivePickups(activePickups.filter((p: any) => p.id !== pickup.id))} className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/[0.03] text-white/20 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all flex items-center justify-center shadow-lg active:scale-90"><X className="w-7 h-7" /></button>
 </div>
 </motion.div>
 ))}
 </AnimatePresence>
 {activePickups.length === 0 && (
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-[64px] shadow-inner">
 <div className="relative mb-10">
 <div className="w-32 h-32 rounded-full border-2 border-dashed border-white/[0.03] animate-[spin_10s_linear_infinite]" />
 <div className="absolute inset-0 flex items-center justify-center opacity-20"><Zap className="w-12 h-12 text-purple-400" /></div>
 </div>
 <p className="text-sm font-semibold text-white/10 uppercase tracking-[0.6em]">No operational signals in local vicinity</p>
 <button onClick={() => setActiveTab('Available Food')} className="mt-8 px-8 py-4 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold text-xs tracking-wide hover:bg-purple-500 hover:text-white transition-all">VIEW AVAILABLE FOOD</button>
 </motion.div>
 )}
 </div>
 </div>
 );

 // ─── Live Map ─────────────────────────────────────────────────────────
 const renderLiveMap = () => (
 <div className="space-y-8 relative z-10">
 <div className="flex flex-col md:flex-row justify-between items-start gap-4">
 <div>
 <h1 className="text-4xl font-display font-semibold tracking-tighter">Live Rescue Map</h1>
 <p className="text-sm font-bold text-white/20 uppercase tracking-[0.4em] mt-2">Real-time donor network · Bengaluru Metro Area</p>
 </div>
 <div className="flex gap-3">
 <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold"><div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" /> NGO HUB</span>
 <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold"><div className="w-2 h-2 rounded-full bg-orange-400" /> DONOR</span>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* Map Area */}
 <div className="lg:col-span-2">
 <div className="glass-dark rounded-[40px] border border-white/[0.03] overflow-hidden shadow-2xl relative" style={{ height: '500px' }}>
 {/* Map background grid */}
 <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(168,85,247,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
 {/* Glow center */}
 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
 <div className="w-64 h-64 rounded-full bg-purple-500/5 border border-purple-500/10" />
 <div className="absolute w-48 h-48 rounded-full bg-purple-500/5 border border-purple-500/10" />
 <div className="absolute w-32 h-32 rounded-full bg-purple-500/10 border border-purple-500/15" />
 </div>
 {/* SVG map pins */}
 <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
 {/* Connection lines from center to each donor */}
 {MAP_PINS.filter(p => p.type === 'donor').map(pin => (
 <line key={pin.id} x1="50" y1="50" x2={pin.x} y2={pin.y} stroke="rgba(168,85,247,0.15)" strokeWidth="0.5" strokeDasharray="2 2" />
 ))}
 </svg>
 {/* Interactive pins */}
 {MAP_PINS.map(pin => (
 <button key={pin.id} onClick={() => setSelectedPin(selectedPin?.id === pin.id ? null : pin)} style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: 'translate(-50%, -50%)' }} className="absolute z-10 group flex flex-col items-center">
 <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shadow-2xl border transition-all group-hover:scale-125", pin.type === 'ngo' ? 'bg-purple-500 border-purple-400 shadow-purple-500/50' : 'bg-orange-500/20 border-orange-500/50 hover:bg-orange-500', selectedPin?.id === pin.id && pin.type !== 'ngo' && 'bg-orange-500 scale-125')}>
 {pin.type === 'ngo' ? <Heart className="w-5 h-5 text-white" /> : <Utensils className="w-5 h-5 text-orange-400 group-hover:text-white" />}
 </div>
 {pin.type === 'ngo' && <div className="w-3 h-3 rounded-full bg-purple-500/30 border border-purple-500/50 mt-1" />}
 <span className="absolute -bottom-8 text-[9px] font-semibold text-white/40 whitespace-nowrap bg-black/60 px-2 py-0.5 rounded-full border border-white/5 hidden group-hover:block">{pin.label}</span>
 </button>
 ))}
 </div>
 </div>

 {/* Side Panel */}
 <div className="space-y-4">
 {selectedPin ? (
 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-dark rounded-[32px] p-6 border border-purple-500/20 shadow-2xl">
 <div className="flex items-center gap-3 mb-4">
 <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center"><Utensils className="w-5 h-5 text-orange-400" /></div>
 <div>
 <p className="font-semibold text-sm">{selectedPin.label}</p>
 <p className="text-[10px] text-white/30 uppercase tracking-wide">{selectedPin.distance} away</p>
 </div>
 </div>
 {selectedPin.food && (
 <div className="p-4 rounded-2xl bg-white/2 border border-white/5 mb-4">
 <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wide mb-1">Available Surplus</p>
 <p className="font-semibold">{selectedPin.food}</p>
 </div>
 )}
 {selectedPin.type === 'donor' && (
 <button onClick={() => { const food = availableFood.find(f => f.donor === selectedPin.label); if (food) handleRescue(food); }} className="w-full py-4 rounded-2xl bg-purple-500 text-white font-semibold text-xs tracking-wide hover:bg-purple-600 transition-all active:scale-95">INITIATE RESCUE</button>
 )}
 </motion.div>
 ) : (
 <div className="glass-dark rounded-[32px] p-6 border border-white/5 text-center">
 <MapPin className="w-8 h-8 text-purple-400/30 mx-auto mb-3" />
 <p className="text-xs text-white/20 font-semibold uppercase tracking-wide">Click a pin on the map to view donor details</p>
 </div>
 )}

 <div className="glass-dark rounded-[32px] p-6 border border-white/5 shadow-xl">
 <h4 className="font-semibold text-sm uppercase tracking-wide mb-4 text-white/60">Nearby Donors</h4>
 <div className="space-y-3">
 {MAP_PINS.filter(p => p.type === 'donor').map(pin => (
 <button key={pin.id} onClick={() => setSelectedPin(pin)} className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-colors text-left group">
 <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0"><Utensils className="w-4 h-4 text-orange-400" /></div>
 <div className="flex-1 min-w-0">
 <p className="font-semibold text-xs truncate group-hover:text-white text-white/70">{pin.label}</p>
 <p className="text-[10px] text-white/30">{pin.distance}</p>
 </div>
 <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-purple-400 shrink-0" />
 </button>
 ))}
 </div>
 </div>
 </div>
 </div>
 </div>
 );

 // ─── Impact History ───────────────────────────────────────────────────
 const renderImpactHistory = () => {
 const allHistory = [
 ...IMPACT_HISTORY,
 ...activePickups.filter((p: any) => p.status === 'COMPLETED').map((p: any) => ({
 id: `live-${p.id}`, date: new Date().toISOString().split('T')[0],
 food: p.food, donor: p.donor, qty: p.qty, meals: 15, people: 12, co2: '2.0kg', status: 'Delivered',
 })),
 ];
 const filtered = allHistory.filter(h => h.food.toLowerCase().includes(historySearch.toLowerCase()) || h.donor.toLowerCase().includes(historySearch.toLowerCase()));
 const totalMeals = allHistory.reduce((acc, h) => acc + h.meals, 0);
 const totalPeople = allHistory.reduce((acc, h) => acc + h.people, 0);

 return (
 <div className="space-y-8 relative z-10">
 <div className="flex flex-col md:flex-row justify-between items-start gap-6">
 <div>
 <h1 className="text-4xl font-display font-semibold tracking-tighter">Impact History</h1>
 <p className="text-sm font-bold text-white/20 uppercase tracking-[0.4em] mt-2">Every rescue that made a difference</p>
 </div>
 </div>

 {/* Impact Stats */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 {[
 { label: 'Total Rescues', value: allHistory.length, icon: CheckCircle2, color: 'text-purple-400' },
 { label: 'Meals Delivered', value: totalMeals.toLocaleString(), icon: Utensils, color: 'text-orange-400' },
 { label: 'People Fed', value: totalPeople.toLocaleString(), icon: Users, color: 'text-blue-400' },
 { label: 'CO₂ Offset', value: '17.5kg', icon: Leaf, color: 'text-emerald-400' },
 ].map((s, i) => (
 <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-dark rounded-[28px] p-5 border border-white/5 flex items-center gap-4">
 <s.icon className={cn('w-8 h-8 shrink-0', s.color)} />
 <div>
 <p className="text-xl font-display font-semibold">{s.value}</p>
 <p className="text-[9px] text-white/30 font-semibold uppercase tracking-wide">{s.label}</p>
 </div>
 </motion.div>
 ))}
 </div>

 <div className="relative">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
 <input type="text" placeholder="Search rescues by food or donor..." value={historySearch} onChange={e => setHistorySearch(e.target.value)} className="w-full bg-white/2 border border-white/5 rounded-2xl py-4 pl-12 pr-8 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all placeholder:text-white/10" />
 </div>

 {/* Timeline */}
 <div className="space-y-4">
 {filtered.map((item, i) => (
 <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="glass-dark rounded-[32px] p-6 border border-white/5 shadow-xl flex flex-col md:flex-row items-start md:items-center gap-6 hover:border-purple-500/20 transition-all group">
 <div className="w-16 h-16 rounded-[20px] bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
 <Heart className="w-8 h-8 text-purple-400" />
 </div>
 <div className="flex-1 space-y-2">
 <div className="flex flex-wrap items-center gap-3">
 <h4 className="font-display font-semibold text-xl ">{item.food}</h4>
 <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-semibold border border-emerald-500/20">{item.status}</span>
 </div>
 <p className="text-xs font-bold text-white/30 flex items-center gap-2"><Utensils className="w-3.5 h-3.5" /> {item.donor} · {item.qty}</p>
 </div>
 <div className="flex gap-6 shrink-0 text-center">
 <div><p className="text-2xl font-display font-semibold text-purple-400">{item.meals}</p><p className="text-[9px] text-white/20 font-semibold tracking-wide">Meals</p></div>
 <div><p className="text-2xl font-display font-semibold text-blue-400">{item.people}</p><p className="text-[9px] text-white/20 font-semibold tracking-wide">People</p></div>
 <div><p className="text-lg font-display font-semibold text-emerald-400">{item.co2}</p><p className="text-[9px] text-white/20 font-semibold uppercase tracking-wide">CO₂ Saved</p></div>
 <div className="text-right"><p className="text-xs font-semibold text-white/20">{item.date}</p></div>
 </div>
 </motion.div>
 ))}
 {filtered.length === 0 && (
 <div className="flex items-center justify-center py-16 border border-dashed border-white/5 rounded-[40px]">
 <p className="text-white/20 font-semibold text-sm uppercase tracking-wide">No records found</p>
 </div>
 )}
 </div>
 </div>
 );
 };

 // ─── Profile ──────────────────────────────────────────────────────────
 const renderProfile = () => (
 <div className="max-w-4xl mx-auto space-y-8 relative z-10">
 <div>
 <h1 className="text-4xl font-display font-semibold tracking-tighter">NGO Profile</h1>
 <p className="text-sm font-bold text-white/20 uppercase tracking-[0.4em] mt-2">Manage your organization details</p>
 </div>
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-dark rounded-[48px] p-10 border border-white/[0.03] shadow-2xl">
 <div className="flex items-center gap-8 mb-10 pb-10 border-b border-white/5">
 <div className="w-24 h-24 rounded-[28px] bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
 <Heart className="w-12 h-12 text-purple-400" />
 </div>
 <div>
 <h2 className="text-3xl font-display font-semibold ">{profile.name}</h2>
 <div className="flex flex-wrap gap-3 mt-3">
 <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20 flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> VERIFIED NGO</span>
 <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-semibold border border-purple-500/20">80G CERTIFIED</span>
 <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-[10px] font-semibold border border-orange-500/20 flex items-center gap-1.5"><Award className="w-3 h-3" /> ELITE PARTNER</span>
 </div>
 </div>
 </div>
 <form onSubmit={(e) => { e.preventDefault(); setProfileSaved(true); setTimeout(() => setProfileSaved(false), 3000); }} className="space-y-8">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 {[
 { label: 'Organization Name', key: 'name', icon: Building2 },
 { label: 'Registration Number', key: 'registrationNo', icon: ShieldCheck },
 { label: 'Contact Number', key: 'contact', icon: Phone },
 { label: 'Email Address', key: 'email', icon: Mail },
 { label: 'Website', key: 'website', icon: Globe },
 { label: 'Address', key: 'address', icon: MapPin },
 ].map(({ label, key, icon: Icon }) => (
 <div key={key} className="space-y-3">
 <label className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.3em] pl-2">{label}</label>
 <div className="relative group">
 <Icon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-purple-400 transition-colors" />
 <input type="text" value={(profile as any)[key]} onChange={e => setProfile({ ...profile, [key]: e.target.value })} className="w-full bg-white/2 border border-white/5 rounded-[20px] py-5 pl-14 pr-5 text-sm font-semibold focus:outline-none focus:bg-white/5 focus:ring-2 focus:ring-purple-500/20 transition-all" />
 </div>
 </div>
 ))}
 <div className="space-y-3 md:col-span-2">
 <label className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.3em] pl-2">Mission Statement</label>
 <textarea value={profile.mission} onChange={e => setProfile({ ...profile, mission: e.target.value })} rows={4} className="w-full bg-white/2 border border-white/5 rounded-[20px] py-5 px-5 text-sm font-semibold focus:outline-none focus:bg-white/5 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none" />
 </div>
 </div>
 <div className="flex items-center gap-4 pt-4">
 <button type="submit" className="px-10 py-5 rounded-2xl bg-purple-500 text-white font-semibold tracking-wide hover:bg-purple-600 transition-all shadow-xl shadow-purple-500/20 active:scale-95 flex items-center gap-3">
 <Save className="w-5 h-5" /> SAVE CHANGES
 </button>
 <AnimatePresence>
 {profileSaved && (
 <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
 <CheckCheck className="w-5 h-5" /> Profile saved!
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 </form>
 </motion.div>
 <div className="grid grid-cols-3 gap-6">
 {[
 { label: 'Total Rescues', value: IMPACT_HISTORY.length + activePickups.length, icon: HeartHandshake, color: 'text-purple-400' },
 { label: 'Meals Delivered', value: '4,280+', icon: Utensils, color: 'text-orange-400' },
 { label: 'Active Partners', value: '8', icon: Building2, color: 'text-blue-400' },
 ].map((s, i) => (
 <div key={i} className="glass-dark rounded-[32px] p-6 border border-white/5 flex items-center gap-6">
 <s.icon className={cn('w-8 h-8', s.color)} />
 <div><p className="text-2xl font-display font-semibold">{s.value}</p><p className="text-[10px] text-white/30 font-semibold tracking-wide">{s.label}</p></div>
 </div>
 ))}
 </div>
 </div>
 );

 return (
 <DashboardLayout sidebarItems={sidebarItems} title="NGO Vector" portalType="ngo">
 <div className="relative min-h-[calc(100vh-160px)]">
 <AnimatePresence mode="wait">
 <motion.div key={activeTab} initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }} transition={{ duration: 0.3, ease: "easeOut" }}>
 {activeTab === 'Overview' && renderOverview()}
 {activeTab === 'Available Food' && renderAvailableFood()}
 {activeTab === 'Live Map' && renderLiveMap()}
 {activeTab === 'Active Pickups' && renderActivePickups()}
 {activeTab === 'Impact History' && renderImpactHistory()}
 {activeTab === 'Profile' && renderProfile()}
 </motion.div>
 </AnimatePresence>
 </div>
 </DashboardLayout>
 );
}
