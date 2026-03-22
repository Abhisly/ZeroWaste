import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  LayoutDashboard, PlusCircle, List, Truck, History, User,
  Leaf, Package, Clock, CheckCircle2, TrendingUp, AlertCircle,
  Filter, Search, MoreHorizontal, ChevronRight, MapPin, Calendar,
  ShieldCheck, HeartHandshake, Utensils, X, Info, Save,
  Building2, Phone, Mail, Globe, Star, BarChart3, Edit3,
  CheckCheck, XCircle, ArrowUpRight, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import DashboardLayout from '@/components/DashboardLayout';
import { cn } from '@/lib/utils';

const chartData = [
  { name: 'Mon', donations: 40 },
  { name: 'Tue', donations: 30 },
  { name: 'Wed', donations: 65 },
  { name: 'Thu', donations: 45 },
  { name: 'Fri', donations: 90 },
  { name: 'Sat', donations: 70 },
  { name: 'Sun', donations: 85 },
];

const HISTORY_DATA = [
  { id: 'h1', food: 'Vegetable Biryani', qty: '25 Plates', ngo: 'Helping Hands Foundation', date: '2026-03-16', status: 'Completed', meals: 25 },
  { id: 'h2', food: 'Assorted Bread', qty: '12 kg', ngo: 'City Shelter NGO', date: '2026-03-15', status: 'Completed', meals: 30 },
  { id: 'h3', food: 'Mixed Fruit Platter', qty: '8 kg', ngo: 'Hope House', date: '2026-03-14', status: 'Completed', meals: 20 },
  { id: 'h4', food: 'Dal & Rice Set', qty: '30 Plates', ngo: 'Feeding India', date: '2026-03-13', status: 'Completed', meals: 30 },
  { id: 'h5', food: 'Sandwich Trays', qty: '50 Units', ngo: 'Youth Hub', date: '2026-03-12', status: 'Rejected', meals: 0 },
  { id: 'h6', food: 'Pizza (Leftover)', qty: '10 Boxes', ngo: 'N/A', date: '2026-03-11', status: 'Expired', meals: 0 },
];

function Zap(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  );
}

export default function RestaurantDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'Dashboard';

  const [donations, setDonations] = useState(() => {
    const saved = localStorage.getItem('zw_global_donations');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, food: 'Premium Sushi Set', qty: '12 Trays', expires: '2H LEFT', status: 'Pending', iconId: 'utensils', color: 'text-orange-400', donor: 'Amul Restaurant', distance: '0km', time: '2H LEFT', type: 'Cooked' },
      { id: 2, food: 'Organic Salads', qty: '25 Units', expires: '4H LEFT', status: 'Pending', iconId: 'utensils', color: 'text-teal-400', donor: 'Amul Restaurant', distance: '0km', time: '4H LEFT', type: 'Produce' },
    ];
  });

  const [historyFilter, setHistoryFilter] = useState('All');
  const [historySearch, setHistorySearch] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Amul Restaurant',
    address: '12 MG Road, Bengaluru, Karnataka - 560001',
    license: 'FSSAI-2024-BLR-00421',
    contact: '+91 98765 43210',
    email: 'amul.rest@zerowaste.in',
    website: 'www.amulrestaurant.com',
    bio: 'A premium vegetarian restaurant committed to zero food waste. We serve 200+ guests daily and donate surplus food to local NGOs through the ZeroWaste network.',
  });

  useEffect(() => {
    localStorage.setItem('zw_global_donations', JSON.stringify(donations));
  }, [donations]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'zw_global_donations' && e.newValue) {
        setDonations(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const setActiveTab = (tab: string) => { setSearchParams({ tab }); };

  const pickupRequests = donations.filter((d: any) => d.status === 'In Transit');
  const activeDonations = donations.filter((d: any) => d.status === 'Pending' || d.status === 'In Transit');

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: activeTab === 'Dashboard', onClick: () => setActiveTab('Dashboard') },
    { icon: PlusCircle, label: 'Add Food', active: activeTab === 'Add Food', onClick: () => setActiveTab('Add Food') },
    { icon: List, label: 'Active Donations', active: activeTab === 'Active Donations', onClick: () => setActiveTab('Active Donations') },
    { icon: Truck, label: 'Pickup Requests', active: activeTab === 'Pickup Requests', onClick: () => setActiveTab('Pickup Requests') },
    { icon: History, label: 'History', active: activeTab === 'History', onClick: () => setActiveTab('History') },
    { icon: User, label: 'Profile', active: activeTab === 'Profile', onClick: () => setActiveTab('Profile') },
  ];

  const handleAddFood = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newDonation = {
      id: Date.now(),
      food: formData.get('food') as string,
      qty: formData.get('qty') as string,
      expires: 'Just added',
      status: 'Pending',
      ngo: 'N/A',
      iconId: 'utensils',
      color: 'text-orange-400',
      donor: profile.name,
      distance: '0km',
      time: 'Just listed',
      type: 'Cooked',
    };
    setDonations([newDonation, ...donations]);
    (e.target as HTMLFormElement).reset();
    setActiveTab('Active Donations');
  };

  const handleMarkReady = (id: number) => {
    setDonations(donations.map((d: any) => d.id === id ? { ...d, status: 'Ready' } : d));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  // ─── Render: Dashboard ───────────────────────────────────────────────
  const renderDashboard = () => (
    <div className="space-y-10">
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none overflow-hidden">
        <img src="/assets/restaurant_bg.png" className="w-full h-full object-cover blur-sm scale-110" alt="" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {[
          { label: 'Total Donated', value: `${1240 + (donations.filter((d: any) => d.status === 'Completed').length) * 10}kg`, sub: '+12% from last month', icon: Package, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { label: 'Active Listings', value: activeDonations.length.toString(), sub: 'Real-time sync', icon: List, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Saved Costs', value: `$${840 + (donations.filter((d: any) => d.status === 'Completed').length) * 50}`, sub: 'Tax benefits estimate', icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'CO₂ Saved', value: `${450 + (donations.filter((d: any) => d.status === 'Completed').length) * 5}kg`, sub: 'Eco-impact score: High', icon: Leaf, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5, scale: 1.02 }} className="glass-dark p-6 rounded-[32px] border-white/5 flex flex-col gap-4 group cursor-default shadow-2xl backdrop-blur-3xl">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg", stat.bg)}>
                <Icon className={cn("w-7 h-7", stat.color)} />
              </div>
              <div>
                <p className="text-3xl font-display font-black tracking-tight">{stat.value}</p>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest mt-1">{stat.label}</p>
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
              <h3 className="text-2xl font-display font-black tracking-tight flex items-center gap-3 italic">DONATION TRENDS <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.8)]" /></h3>
              <p className="text-sm font-bold text-white/30 uppercase tracking-widest mt-1">Weekly Volume Coverage Analysis</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#ffffff20', fontSize: 12, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#ffffff20', fontSize: 12, fontWeight: 700 }} />
                <Tooltip contentStyle={{ backgroundColor: '#050505', border: '1px solid #ffffff10', borderRadius: '16px', fontWeight: 800, color: '#fff' }} itemStyle={{ color: '#fff' }} />
                <Area type="monotone" dataKey="donations" stroke="#f97316" strokeWidth={4} fillOpacity={1} fill="url(#colorDonations)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="glass-dark rounded-[40px] p-8 border-white/5 flex flex-col shadow-2xl backdrop-blur-3xl">
          <h3 className="text-2xl font-display font-black tracking-tight mb-8 italic uppercase">Pulse Audit</h3>
          <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {[
              { action: 'Donation Accepted', details: 'Helping Hands Foundation', time: '10M AGO', icon: CheckCircle2, color: 'text-teal-400' },
              { action: 'Pickup Pending', details: 'Assorted Rice (20kg)', time: '2H AGO', icon: Clock, color: 'text-orange-400' },
              { action: 'Verification Step', details: 'License renewed until 2027', time: '1D AGO', icon: ShieldCheck, color: 'text-purple-400' },
              { action: 'System Alert', details: 'New NGO joined your area', time: '2D AGO', icon: AlertCircle, color: 'text-red-400' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-start gap-4 group cursor-pointer hover:translate-x-1 transition-transform">
                  <div className={cn("mt-1 p-2 rounded-xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform shadow-lg", item.color)}><Icon className="w-4 h-4" /></div>
                  <div className="flex-1 border-b border-white/5 pb-4">
                    <div className="flex justify-between items-start">
                      <p className="font-black text-sm tracking-tight">{item.action}</p>
                      <span className="text-[10px] font-black text-white/20 tracking-tighter">{item.time}</span>
                    </div>
                    <p className="text-[10px] font-bold text-white/40 mt-1 uppercase italic">{item.details}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={() => setActiveTab('History')} className="w-full py-4 mt-6 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black tracking-[0.3em] hover:bg-white/10 transition-all uppercase shadow-lg active:scale-95">OPEN LOGS</button>
        </motion.div>
      </div>
    </div>
  );

  // ─── Render: Active Donations ────────────────────────────────────────
  const renderActiveDonations = () => (
    <div className="space-y-8 relative z-10">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-4xl font-display font-black tracking-tighter italic">ACTIVE LISTINGS</h1>
          <p className="text-sm font-bold text-white/30 uppercase tracking-[0.4em] mt-2">Global Surplus Network Sync</p>
        </div>
        <button onClick={() => setActiveTab('Add Food')} className="px-8 py-4 rounded-2xl bg-orange-500 text-white font-black text-sm tracking-[0.2em] flex items-center gap-3 hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 active:scale-95 uppercase">
          <PlusCircle className="w-5 h-5" /> PUBLISH NEW
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {donations.map((listing: any) => (
            <motion.div key={listing.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9, x: 50 }} whileHover={{ y: -8 }} className="glass-dark rounded-[40px] overflow-hidden border border-white/10 relative group shadow-2xl backdrop-blur-3xl">
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div className={cn("px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em] text-white border border-white/10 shadow-lg", listing.color)}>{listing.status.toUpperCase()}</div>
                  <div className="flex gap-2"><div className="w-2 h-2 rounded-full bg-white/20 animate-pulse" /><div className="w-2 h-2 rounded-full bg-white/20" /></div>
                </div>
                <h4 className="text-3xl font-display font-black tracking-tight mb-2 leading-tight uppercase italic">{listing.food}</h4>
                <div className="space-y-4 mt-8">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/2 border border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40"><Package className="w-5 h-5" /></div>
                    <div><p className="text-[10px] font-black tracking-widest text-white/20 uppercase">QUANTITY</p><p className="text-sm font-black italic">{listing.qty}</p></div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/2 border border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400"><Clock className="w-5 h-5" /></div>
                    <div><p className="text-[10px] font-black tracking-widest text-orange-500/30 uppercase">SECURITY WINDOW</p><p className="text-sm font-black italic text-orange-400">{listing.expires}</p></div>
                  </div>
                </div>
                <div className="mt-10 flex gap-4">
                  <button className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black tracking-[0.3em] hover:bg-white/10 transition-all uppercase shadow-lg active:scale-95">MANAGE</button>
                  <button onClick={() => setDonations(donations.filter((d: any) => d.id !== listing.id))} className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shadow-lg active:scale-90 group">
                    <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {donations.length === 0 && (
          <div className="col-span-3 flex flex-col items-center justify-center py-32 border border-dashed border-white/10 rounded-[48px]">
            <Package className="w-16 h-16 text-white/10 mb-4" />
            <p className="text-white/20 font-black uppercase tracking-widest text-sm">No active listings. Add surplus food above.</p>
          </div>
        )}
      </div>
    </div>
  );

  // ─── Render: Add Food ─────────────────────────────────────────────────
  const renderAddFood = () => (
    <div className="max-w-4xl mx-auto py-10 relative z-10">
      <div className="flex flex-col items-center text-center mb-16">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-24 h-24 rounded-[32px] bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-8 shadow-2xl relative">
          <div className="absolute inset-0 bg-orange-500 blur-3xl opacity-20" />
          <PlusCircle className="w-12 h-12 text-orange-500 relative z-10" />
        </motion.div>
        <h1 className="text-5xl font-display font-black tracking-tighter italic">PUBLISH SURPLUS</h1>
        <p className="text-sm font-bold text-white/20 uppercase tracking-[0.4em] mt-4 flex items-center gap-3"><Info className="w-4 h-4" /> SECURE BLOCKCHAIN-BACKED LOGISTICS</p>
      </div>
      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-dark rounded-[64px] p-16 border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] backdrop-blur-3xl">
        <form className="space-y-12" onSubmit={handleAddFood}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] pl-4 italic">Surplus Designation</label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/10 group-focus-within:text-orange-500 transition-colors"><Utensils className="w-5 h-5" /></div>
                <input name="food" type="text" placeholder="e.g. Mixed Continental Buffet Trays" className="w-full bg-white/2 border border-white/5 rounded-[24px] py-6 pl-16 pr-8 text-white focus:outline-none focus:bg-white/5 focus:ring-4 focus:ring-orange-500/10 transition-all font-black placeholder:text-white/10 shadow-inner" required />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] pl-4 italic">Precise Volume</label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/10 group-focus-within:text-orange-500 transition-colors"><Package className="w-5 h-5" /></div>
                <input name="qty" type="text" placeholder="e.g. 15kg or 25 Plates" className="w-full bg-white/2 border border-white/5 rounded-[24px] py-6 pl-16 pr-8 text-white focus:outline-none focus:bg-white/5 focus:ring-4 focus:ring-orange-500/10 transition-all font-black placeholder:text-white/10 shadow-inner" required />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] pl-4 italic">Critical Security Window</label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/10 group-focus-within:text-orange-500 transition-colors z-10"><Calendar className="w-5 h-5" /></div>
                <input type="datetime-local" className="w-full bg-white/2 border border-white/5 rounded-[24px] py-6 pl-16 pr-8 text-white focus:outline-none focus:bg-white/5 focus:ring-4 focus:ring-orange-500/10 transition-all font-black shadow-inner [color-scheme:dark]" required />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] pl-4 italic">Pickup Node</label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/10 group-focus-within:text-orange-500 transition-colors"><MapPin className="w-5 h-5" /></div>
                <input type="text" defaultValue="AMUL RESTAURANT HUB-01" className="w-full bg-white/2 border border-white/5 rounded-[24px] py-6 pl-16 pr-8 text-white focus:outline-none focus:bg-white/5 focus:ring-4 focus:ring-orange-500/10 transition-all font-black shadow-inner" required />
              </div>
            </div>
            <div className="space-y-4 md:col-span-2">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] pl-4 italic">Logistics Instructions</label>
              <textarea placeholder="Include handling requirements, allergen alerts, or specific loading bay directions..." rows={5} className="w-full bg-white/2 border border-white/5 rounded-[32px] py-8 px-10 text-white focus:outline-none focus:bg-white/5 focus:ring-4 focus:ring-orange-500/10 transition-all font-black placeholder:text-white/10 shadow-inner resize-none"></textarea>
            </div>
          </div>
          <button type="submit" className="w-full py-8 rounded-[32px] bg-orange-500 text-white font-black text-xl tracking-[0.3em] hover:bg-orange-600 active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(249,115,22,0.3)] mt-12 flex items-center justify-center gap-4 group">
            INITIATE BROADCAST <TrendingUp className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>
        </form>
      </motion.div>
    </div>
  );

  // ─── Render: Pickup Requests ──────────────────────────────────────────
  const renderPickupRequests = () => (
    <div className="space-y-8 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-display font-black tracking-tighter italic uppercase">Pickup Requests</h1>
          <p className="text-sm font-bold text-white/20 uppercase tracking-[0.4em] mt-2">NGOs en route to collect your surplus</p>
        </div>
        <div className={cn("px-4 py-2 rounded-full text-xs font-black border", pickupRequests.length > 0 ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-white/5 text-white/30 border-white/10')}>
          {pickupRequests.length} ACTIVE PICKUP{pickupRequests.length !== 1 ? 'S' : ''}
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {pickupRequests.length > 0 ? pickupRequests.map((req: any, i: number) => (
          <motion.div key={req.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ delay: i * 0.05 }} className="glass-dark rounded-[40px] p-8 border border-white/10 shadow-2xl backdrop-blur-3xl">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="w-20 h-20 rounded-[24px] bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                <Truck className="w-10 h-10 text-orange-400" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-2xl font-display font-black uppercase italic">{req.food}</h3>
                  <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-black tracking-widest border border-orange-500/20">EN ROUTE</span>
                </div>
                <div className="flex flex-wrap gap-4 text-xs font-black text-white/30">
                  <span className="flex items-center gap-2"><Package className="w-4 h-4 text-orange-400" />{req.qty}</span>
                  <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-orange-400" />Picked up {req.startTime || 'recently'}</span>
                  <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-orange-400" />NGO collecting from your location</span>
                </div>
              </div>
              <div className="flex gap-3 shrink-0">
                <button onClick={() => handleMarkReady(req.id)} className="px-6 py-3 rounded-2xl bg-orange-500 text-white font-black text-xs tracking-widest hover:bg-orange-600 transition-all shadow-lg active:scale-95">
                  MARK READY
                </button>
                <button onClick={() => setDonations(donations.map((d: any) => d.id === req.id ? { ...d, status: 'Completed' } : d))} className="px-6 py-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-black text-xs tracking-widest hover:bg-emerald-500 hover:text-white transition-all active:scale-95">
                  CONFIRM COLLECTED
                </button>
              </div>
            </div>
          </motion.div>
        )) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-40 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-[64px] text-center">
            <div className="w-24 h-24 rounded-[32px] bg-white/5 flex items-center justify-center mb-8 relative">
              <div className="absolute inset-0 rounded-[32px] border-2 border-dashed border-white/10 animate-[spin_8s_linear_infinite]" />
              <Truck className="w-12 h-12 text-white/20" />
            </div>
            <h4 className="text-3xl font-display font-black italic uppercase mb-3">No Active Pickups</h4>
            <p className="text-sm font-bold text-white/20 uppercase tracking-[0.4em]">When an NGO claims your donation, it appears here</p>
            <button onClick={() => setActiveTab('Add Food')} className="mt-8 px-8 py-4 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20 font-black text-xs tracking-widest hover:bg-orange-500 hover:text-white transition-all">
              ADD FOOD DONATION
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // ─── Render: History ──────────────────────────────────────────────────
  const renderHistory = () => {
    const allHistory = [
      ...HISTORY_DATA,
      ...donations.filter((d: any) => d.status === 'Completed').map((d: any) => ({
        id: `live-${d.id}`,
        food: d.food,
        qty: d.qty,
        ngo: d.ngo || 'Unassigned',
        date: new Date().toISOString().split('T')[0],
        status: 'Completed',
        meals: parseInt(d.qty) || 10,
      })),
    ];
    const filtered = allHistory.filter(h => (historyFilter === 'All' || h.status === historyFilter) && (h.food.toLowerCase().includes(historySearch.toLowerCase()) || h.ngo.toLowerCase().includes(historySearch.toLowerCase())));
    const totalMeals = allHistory.filter(h => h.status === 'Completed').reduce((acc, h) => acc + h.meals, 0);

    return (
      <div className="space-y-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-display font-black tracking-tighter italic uppercase">Donation History</h1>
            <p className="text-sm font-bold text-white/20 uppercase tracking-[0.4em] mt-2">Full audit trail · {allHistory.length} records</p>
          </div>
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-orange-500/10 border border-orange-500/20">
            <Star className="w-5 h-5 text-orange-400" />
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Total Meals Served</p>
              <p className="text-xl font-black text-orange-400">{totalMeals.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input type="text" placeholder="Search food or NGO..." value={historySearch} onChange={e => setHistorySearch(e.target.value)} className="w-full bg-white/2 border border-white/5 rounded-2xl py-4 pl-12 pr-8 text-sm font-black focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-white/10" />
          </div>
          <div className="flex gap-2">
            {['All', 'Completed', 'Rejected', 'Expired'].map(f => (
              <button key={f} onClick={() => setHistoryFilter(f)} className={cn("px-5 py-3 rounded-2xl text-xs font-black tracking-widest transition-all", historyFilter === f ? 'bg-orange-500 text-white shadow-lg' : 'bg-white/5 text-white/30 hover:text-white hover:bg-white/10')}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-dark rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-[2fr_1fr_2fr_1fr_1fr] gap-4 px-8 py-5 border-b border-white/5 text-[10px] font-black text-white/20 uppercase tracking-widest">
            <span>Food Item</span><span>Quantity</span><span>NGO Partner</span><span>Date</span><span>Status</span>
          </div>
          <div className="divide-y divide-white/5">
            <AnimatePresence>
              {filtered.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="grid grid-cols-[2fr_1fr_2fr_1fr_1fr] gap-4 px-8 py-5 hover:bg-white/2 transition-colors items-center group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0"><Utensils className="w-4 h-4 text-white/20" /></div>
                    <p className="font-black text-sm truncate">{item.food}</p>
                  </div>
                  <p className="text-sm text-white/60 font-bold">{item.qty}</p>
                  <div className="flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-white/20 shrink-0" />
                    <p className="text-sm text-white/60 font-bold truncate">{item.ngo}</p>
                  </div>
                  <p className="text-xs text-white/40 font-bold">{item.date}</p>
                  <span className={cn("px-3 py-1 rounded-full text-[9px] font-black tracking-widest w-fit", item.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : item.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-white/5 text-white/30 border border-white/10')}>
                    {item.status}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <div className="flex items-center justify-center py-16 text-white/20">
                <p className="font-black text-sm uppercase tracking-widest">No records match your filter</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ─── Render: Profile ──────────────────────────────────────────────────
  const renderProfile = () => (
    <div className="max-w-4xl mx-auto space-y-8 relative z-10">
      <div>
        <h1 className="text-4xl font-display font-black tracking-tighter italic uppercase">Restaurant Profile</h1>
        <p className="text-sm font-bold text-white/20 uppercase tracking-[0.4em] mt-2">Manage your organization details</p>
      </div>

      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-dark rounded-[48px] p-10 border border-white/10 shadow-2xl">
        <div className="flex items-center gap-8 mb-10 pb-10 border-b border-white/5">
          <div className="w-24 h-24 rounded-[28px] bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
            <Building2 className="w-12 h-12 text-orange-400" />
          </div>
          <div>
            <h2 className="text-3xl font-display font-black italic">{profile.name}</h2>
            <div className="flex flex-wrap gap-3 mt-3">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black border border-emerald-500/20 flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> VERIFIED</span>
              <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-[10px] font-black border border-orange-500/20">RESTAURANT</span>
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black border border-blue-500/20 flex items-center gap-1.5"><Star className="w-3 h-3" /> 4.9 RATING</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { label: 'Restaurant Name', key: 'name', icon: Building2, placeholder: 'e.g. Amul Restaurant' },
              { label: 'FSSAI License', key: 'license', icon: ShieldCheck, placeholder: 'e.g. FSSAI-2024-BLR-00421' },
              { label: 'Contact Number', key: 'contact', icon: Phone, placeholder: '+91 98765 43210' },
              { label: 'Email Address', key: 'email', icon: Mail, placeholder: 'contact@restaurant.com' },
              { label: 'Website', key: 'website', icon: Globe, placeholder: 'www.yourrestaurant.com' },
              { label: 'Address', key: 'address', icon: MapPin, placeholder: 'Full address with PIN code' },
            ].map(({ label, key, icon: Icon, placeholder }) => (
              <div key={key} className="space-y-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] pl-2">{label}</label>
                <div className="relative group">
                  <Icon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-orange-400 transition-colors" />
                  <input type="text" value={(profile as any)[key]} onChange={e => setProfile({ ...profile, [key]: e.target.value })} placeholder={placeholder} className="w-full bg-white/2 border border-white/5 rounded-[20px] py-5 pl-14 pr-5 text-sm font-black focus:outline-none focus:bg-white/5 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-white/10" />
                </div>
              </div>
            ))}
            <div className="space-y-3 md:col-span-2">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] pl-2">Mission Statement</label>
              <textarea value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} rows={4} className="w-full bg-white/2 border border-white/5 rounded-[20px] py-5 px-5 text-sm font-black focus:outline-none focus:bg-white/5 focus:ring-2 focus:ring-orange-500/20 transition-all resize-none placeholder:text-white/10" />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button type="submit" className="px-10 py-5 rounded-2xl bg-orange-500 text-white font-black tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 active:scale-95 flex items-center gap-3">
              <Save className="w-5 h-5" /> SAVE CHANGES
            </button>
            <AnimatePresence>
              {profileSaved && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                  <CheckCheck className="w-5 h-5" /> Profile saved successfully!
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { label: 'Total Donations', value: donations.length + HISTORY_DATA.length, icon: Package, color: 'text-orange-400' },
          { label: 'Meals Contributed', value: '835+', icon: Utensils, color: 'text-emerald-400' },
          { label: 'Partner NGOs', value: '6', icon: HeartHandshake, color: 'text-purple-400' },
        ].map((s, i) => (
          <div key={i} className="glass-dark rounded-[32px] p-6 border border-white/5 flex items-center gap-6">
            <s.icon className={cn('w-8 h-8', s.color)} />
            <div>
              <p className="text-2xl font-display font-black">{s.value}</p>
              <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <DashboardLayout sidebarItems={sidebarItems} title="Restaurant Intel" portalType="restaurant">
      <div className="relative min-h-[calc(100vh-160px)]">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }} transition={{ duration: 0.3, ease: "easeOut" }}>
            {activeTab === 'Dashboard' && renderDashboard()}
            {activeTab === 'Active Donations' && renderActiveDonations()}
            {activeTab === 'Add Food' && renderAddFood()}
            {activeTab === 'Pickup Requests' && renderPickupRequests()}
            {activeTab === 'History' && renderHistory()}
            {activeTab === 'Profile' && renderProfile()}
          </motion.div>
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
