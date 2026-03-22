import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, Navigation, Package, Clock,
  CheckCircle2, Phone, MessageSquare, Truck, ShieldCheck,
  Zap, Activity, Globe, AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LiveDeliveryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('status');

  // Simulate delivery progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const getStatus = () => {
    if (progress < 25) return 'INITIALIZING LOGISTICS';
    if (progress < 50) return 'NGO VERIFICATION COMPLETE';
    if (progress < 75) return 'PICKUP SYNCHRONIZED';
    if (progress < 100) return 'EN ROUTE TO DESTINATION';
    return 'MISSION ACCOMPLISHED';
  };

  const steps = [
    { label: 'MANIFEST', icon: Package, threshold: 0 },
    { label: 'VERIFIED', icon: ShieldCheck, threshold: 25 },
    { label: 'DEPARTED', icon: Truck, threshold: 50 },
    { label: 'DELIVERED', icon: CheckCircle2, threshold: 100 },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col md:flex-row overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Left Interface - Interactive Command Center */}
      <div className="w-full md:w-[480px] glass-dark border-r border-white/5 flex flex-col h-screen z-30 relative shadow-2xl">
        {/* Header Block */}
        <div className="p-8 border-b border-white/5 bg-black/40 backdrop-blur-3xl">
          <div className="flex items-center justify-between mb-8">
            <motion.button
              whileHover={{ x: -5 }}
              onClick={() => navigate(-1)}
              className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-white/60" />
            </motion.button>
            <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-400 tracking-widest uppercase italic">LIVE SIGNAL</span>
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-4xl font-display font-black tracking-tighter italic">DELIVERY RE-0428</h1>
            <p className="text-[10px] font-bold text-white/30 tracking-[0.4em] uppercase">Hyper-Local Food Logistics</p>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {/* Status Monitor */}
          <div className="text-center space-y-6">
            <div className="relative inline-block">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-dashed border-teal-500/30 scale-125"
              />
              <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-teal-500/20 to-teal-950/40 flex items-center justify-center text-teal-400 border border-teal-500/30 shadow-[0_0_50px_rgba(20,184,166,0.15)] relative z-10">
                <Navigation className="w-10 h-10" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-display font-black tracking-tight uppercase italic text-white/90">
                {getStatus()}
              </h3>
              <div className="flex items-center justify-center gap-4 text-xs font-black text-white/30 tracking-widest uppercase">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 12 MINS REMAINING</span>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> 2.4 KM / HR</span>
              </div>
            </div>
          </div>

          {/* Precision Navigation Timeline */}
          <div className="relative px-4">
            <div className="absolute top-4 left-0 w-full h-1 bg-white/5 rounded-full" />
            <motion.div
              className="absolute top-4 left-0 h-1 bg-gradient-to-r from-orange-500 to-teal-500 rounded-full shadow-[0_0_15px_rgba(20,184,166,0.3)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            <div className="flex justify-between relative z-10">
              {steps.map((step, i) => {
                const Icon = step.icon;
                const isReached = progress >= step.threshold;
                return (
                  <div key={i} className="flex flex-col items-center gap-4">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: isReached ? 1.1 : 1,
                        backgroundColor: isReached ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,0.4)'
                      }}
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-500",
                        isReached ? "border-transparent text-black" : "border-white/10 text-white/20"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    <span className={cn(
                      "text-[9px] font-black tracking-widest uppercase transition-colors duration-500",
                      isReached ? "text-white" : "text-white/20"
                    )}>{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Logistic Entities */}
          <div className="grid grid-cols-1 gap-4">
            {[
              { label: 'ORIGIN NODE', name: 'AMUL RESTAURANT', addr: 'Sector 4, Urban Corridor', icon: MapPin, color: 'text-orange-400', bg: 'bg-orange-500/10' },
              { label: 'TARGET NODE', name: 'HOPE FOUNDATION', addr: 'Green Valley, West Block', icon: MapPin, color: 'text-teal-400', bg: 'bg-teal-500/10' },
              { label: 'PAYLOAD', name: '28 VEG MEALS', addr: 'Total weight approx. 14kg', icon: Package, color: 'text-purple-400', bg: 'bg-purple-500/10' },
            ].map((node, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 5 }}
                className="p-6 rounded-[28px] bg-white/4 border border-white/5 flex items-start gap-5 hover:bg-white/6 transition-all"
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0", node.bg)}>
                  <node.icon className={cn("w-7 h-7", node.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-white/30 tracking-[0.3em] uppercase mb-1">{node.label}</p>
                  <p className="font-display font-black text-lg tracking-tight truncate">{node.name}</p>
                  <p className="text-xs font-bold text-white/40 mt-1 truncate">{node.addr}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Comm Deck */}
        <div className="p-8 border-t border-white/5 bg-black/40 backdrop-blur-3xl flex gap-4">
          <button className="flex-1 group relative flex items-center justify-center gap-3 py-5 rounded-2xl bg-white text-black font-black text-[10px] tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98] uppercase">
            <Phone className="w-4 h-4" /> CONTACT AGENT
          </button>
          <button className="w-20 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all">
            <MessageSquare className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Right Visualization - Tactical Map Overlay */}
      <div className="flex-1 relative bg-black overflow-hidden min-h-[50vh] md:min-h-screen">
        {/* Cinematic Map Background */}
        <div
          className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center"
          style={{ filter: 'grayscale(1) contrast(1.5) brightness(0.6)' }}
        />

        {/* Tactical Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/60" />
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <Globe className="w-[800px] h-[800px] animate-pulse" />
        </div>

        {/* Global Grid Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />

        {/* Precision Route Visualization */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'drop-shadow(0 0 15px rgba(20,184,166,0.6))' }}>
          <motion.path
            d="M 30% 70% Q 50% 50% 70% 30%"
            fill="none"
            stroke="#14b8a6"
            strokeWidth="5"
            strokeDasharray="2 12"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="animate-[tactical_30s_linear_infinite]"
          />
        </svg>

        {/* Mission Nodes */}
        <div className="absolute top-[30%] left-[70%] -translate-x-1/2 -translate-y-1/2 group">
          <div className="absolute -inset-8 bg-teal-500/10 blur-xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
          <div className="relative flex flex-col items-center">
            <div className="px-4 py-2 glass-dark rounded-xl border border-white/20 text-[9px] font-black mb-4 shadow-2xl tracking-widest uppercase">
              DESTINATION
            </div>
            <div className="w-8 h-8 rounded-full bg-teal-500 border-8 border-black shadow-[0_0_30px_rgba(20,184,166,1)]" />
          </div>
        </div>

        <div className="absolute top-[70%] left-[30%] -translate-x-1/2 -translate-y-1/2 group">
          <div className="absolute -inset-8 bg-orange-500/10 blur-xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
          <div className="relative flex flex-col items-center">
            <div className="px-4 py-2 glass-dark rounded-xl border border-white/20 text-[9px] font-black mb-4 shadow-2xl tracking-widest uppercase">
              ORIGIN
            </div>
            <div className="w-8 h-8 rounded-full bg-orange-500 border-8 border-black shadow-[0_0_30px_rgba(249,115,22,1)]" />
          </div>
        </div>

        {/* Real-time Asset Tracking */}
        <motion.div
          className="absolute w-14 h-14 z-20"
          style={{
            top: `${70 - (progress * 0.4)}%`,
            left: `${30 + (progress * 0.4)}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="absolute inset-0 bg-white/20 blur-xl rounded-full animate-pulse" />
          <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.4)] border border-white/20 relative">
            <Truck className="w-7 h-7 text-black" />
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -inset-4 border border-white/30 rounded-full"
            />
          </div>
        </motion.div>

        {/* Tactical UI Elements */}
        <div className="absolute bottom-10 right-10 flex gap-4">
          {[
            { label: 'LAT', val: '28.6139° N' },
            { label: 'LNG', val: '77.2090° E' },
            { label: 'ALT', val: '216m' }
          ].map((p, i) => (
            <div key={i} className="glass-dark px-6 py-4 rounded-2xl border border-white/5 space-y-1">
              <p className="text-[8px] font-black text-white/20 tracking-[0.2em]">{p.label}</p>
              <p className="text-xs font-bold text-white/60 font-mono tracking-tight">{p.val}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes tactical {
          to {
            stroke-dashoffset: -1000;
          }
        }
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
      `}</style>
    </div>
  );
}
