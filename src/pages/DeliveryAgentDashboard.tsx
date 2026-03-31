import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, MapPin, Package, Clock, CheckCircle2, Navigation, ArrowRight, User, Phone, Map as MapIcon, ChevronRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import MapView from './MapView';

const MOCK_DELIVERIES = [
 {
 id: 'd1',
 restaurant: 'Sunset Bistro',
 restaurantAddr: '789 Skyline Blvd, Heights',
 ngo: 'City Shelter',
 ngoAddr: '101 Downtown Ave, Central',
 type: 'Prepared Meals',
 quantity: '25 kgs',
 time: '2:30 PM Today',
 status: 'Available',
 distance: '4.2 km'
 },
 {
 id: 'd2',
 restaurant: 'Green Bowl',
 restaurantAddr: '444 Nature Way, Westside',
 ngo: 'Youth Hub',
 ngoAddr: '222 Park Lane, Eastside',
 type: 'Fresh Produce',
 quantity: '15 kgs',
 time: '4:00 PM Today',
 status: 'Available',
 distance: '2.8 km'
 }
];

export default function DeliveryAgentDashboard() {
 const [deliveries, setDeliveries] = useState(MOCK_DELIVERIES);
 const [activeDelivery, setActiveDelivery] = useState<any>(null);
 const [isLive, setIsLive] = useState(false);

 const handleAccept = (delivery: any) => {
 setActiveDelivery({ ...delivery, status: 'Accepted' });
 setDeliveries(prev => prev.filter(d => d.id !== delivery.id));
 };

 const handleStartPickup = () => {
 setActiveDelivery(prev => ({ ...prev, status: 'In Transit' }));
 setIsLive(true);
 };

 const handleComplete = () => {
 setActiveDelivery(null);
 setIsLive(false);
 };

 if (isLive && activeDelivery) {
 return (
 <div className="fixed inset-0 z-[60] bg-black">
 <MapView
 onClose={() => setIsLive(false)}
 onComplete={handleComplete}
 delivery={activeDelivery}
 />
 </div>
 );
 }

 return (
 <div className="space-y-8">
 <div className="flex justify-between items-end">
 <div>
 <h1 className="text-4xl font-display font-semibold tracking-tight text-white mb-2">Delivery Portal</h1>
 <p className="text-gray-400">Manage your pickups and deliveries across the network.</p>
 </div>
 <div className="flex gap-4">
 <div className="bg-white/5 border border-white/[0.03] p-4 rounded-xl backdrop-blur-md">
 <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Today's Goal</p>
 <p className="text-2xl font-semibold text-blue-400 font-mono">12/15 <span className="text-xs text-gray-600">KG</span></p>
 </div>
 <div className="bg-white/5 border border-white/[0.03] p-4 rounded-xl backdrop-blur-md">
 <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Earnings</p>
 <p className="text-2xl font-semibold text-green-400">$42.00</p>
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* Left Side: Active & Available */}
 <div className="lg:col-span-2 space-y-8">
 {/* Active Delivery Card */}
 <AnimatePresence mode="wait">
 {activeDelivery && (
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 className="bg-blue-600 rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-blue-500/20"
 >
 <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

 <div className="relative z-10">
 <div className="flex justify-between items-start mb-8">
 <div>
 <span className="text-[10px] font-semibold uppercase tracking-[0.2em] bg-white/20 px-3 py-1 rounded-full text-white mb-2 inline-block">
 Active Mission
 </span>
 <h2 className="text-3xl font-semibold text-white">In Progress Delivery</h2>
 </div>
 <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center">
 <Truck className="w-8 h-8 text-white" />
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
 <div className="space-y-4">
 <div className="flex items-start gap-4">
 <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mt-1">
 <MapPin className="w-4 h-4 text-white" />
 </div>
 <div>
 <p className="text-xs text-blue-100 uppercase font-semibold tracking-wide mb-1">Pickup From</p>
 <p className="text-lg font-bold text-white leading-tight">{activeDelivery.restaurant}</p>
 <p className="text-sm text-blue-100/60 transition-colors hover:text-white cursor-pointer">{activeDelivery.restaurantAddr}</p>
 </div>
 </div>
 <div className="flex items-start gap-4">
 <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center mt-1">
 <Navigation className="w-4 h-4 text-white" />
 </div>
 <div>
 <p className="text-xs text-blue-100 uppercase font-semibold tracking-wide mb-1">Drop To</p>
 <p className="text-lg font-bold text-white leading-tight">{activeDelivery.ngo}</p>
 <p className="text-sm text-blue-100/60 transition-colors hover:text-white cursor-pointer">{activeDelivery.ngoAddr}</p>
 </div>
 </div>
 </div>
 <div className="bg-black/20 rounded-2xl p-6 backdrop-blur-md">
 <div className="grid grid-cols-2 gap-4">
 <div>
 <p className="text-[10px] text-blue-100 font-bold uppercase mb-1">Items</p>
 <p className="text-white font-semibold">{activeDelivery.type}</p>
 </div>
 <div>
 <p className="text-[10px] text-blue-100 font-bold uppercase mb-1">Weight</p>
 <p className="text-white font-semibold">{activeDelivery.quantity}</p>
 </div>
 </div>
 </div>
 </div>

 <button
 onClick={handleStartPickup}
 className="w-full bg-white text-blue-600 py-5 rounded-2xl font-semibold text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
 >
 Open Live Navigation <ArrowRight className="w-6 h-6" />
 </button>
 </div>
 </motion.div>
 )}
 </AnimatePresence>

 {/* Available Deliveries */}
 <div className="space-y-4">
 <div className="flex items-center gap-3">
 <Package className="w-5 h-5 text-blue-500" />
 <h3 className="text-xl font-semibold text-white">Available in your area</h3>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {deliveries.map((d) => (
 <motion.div
 key={d.id}
 layout
 className="bg-white/5 border border-white/[0.03] rounded-2xl p-6 hover:border-white/20 transition-all group"
 >
 <div className="flex justify-between items-start mb-6">
 <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
 <MapIcon className="w-6 h-6" />
 </div>
 <div className="text-right">
 <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Distance</p>
 <p className="text-white font-bold">{d.distance}</p>
 </div>
 </div>

 <div className="space-y-3 mb-6">
 <div className="flex items-center gap-3 text-sm">
 <div className="min-w-[4px] h-4 bg-orange-500 rounded-full" />
 <p className="text-gray-300 font-medium">From: <span className="text-white">{d.restaurant}</span></p>
 </div>
 <div className="flex items-center gap-3 text-sm">
 <div className="min-w-[4px] h-4 bg-teal-500 rounded-full" />
 <p className="text-gray-300 font-medium">To: <span className="text-white">{d.ngo}</span></p>
 </div>
 </div>

 <div className="flex gap-2">
 <button
 onClick={() => handleAccept(d)}
 disabled={!!activeDelivery}
 className="flex-1 bg-white/10 hover:bg-white text-white hover:text-black py-3 rounded-xl font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
 >
 Accept
 </button>
 <button className="p-3 rounded-xl border border-white/[0.03] text-gray-500 hover:text-white hover:border-white/30 transition-all">
 <ChevronRight className="w-5 h-5" />
 </button>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </div>

 {/* Right Side: Stats & Profile */}
 <div className="space-y-8">
 <div className="bg-white/5 border border-white/[0.03] rounded-3xl p-8 backdrop-blur-md">
 <div className="flex items-center gap-4 mb-8 text-left">
 <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-semibold">
 D1
 </div>
 <div className="bg-transparent text-left">
 <h3 className="text-xl font-bold text-white">Alex Driver</h3>
 <p className="text-blue-400 flex items-center gap-1">
 <ShieldCheck className="w-3 h-3" />
 Verified Elite
 </p>
 </div>
 </div>

 <div className="space-y-4">
 <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
 <div className="flex items-center gap-3 text-left">
 <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
 <CheckCircle2 className="w-5 h-5" />
 </div>
 <div>
 <p className="text-[10px] font-semibold text-gray-500 uppercase">Success Rate</p>
 <p className="text-white font-bold">99.2%</p>
 </div>
 </div>
 </div>
 <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
 <div className="flex items-center gap-3 text-left">
 <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-500">
 <Clock className="w-5 h-5" />
 </div>
 <div>
 <p className="text-[10px] font-semibold text-gray-500 uppercase">Avg On-Time</p>
 <p className="text-white font-bold">14 mins</p>
 </div>
 </div>
 </div>
 </div>
 </div>

 <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/[0.03] rounded-3xl p-8">
 <h4 className="text-white font-bold mb-6 flex items-center gap-2">
 <Phone className="w-4 h-4 text-blue-400" />
 Emergency Support
 </h4>
 <div className="space-y-3">
 <button className="w-full py-4 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 font-semibold text-xs uppercase tracking-wide">
 S.O.S Button
 </button>
 <button className="w-full py-4 rounded-xl bg-white/5 text-gray-400 font-bold text-xs uppercase tracking-wide">
 Live Chat Support
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
