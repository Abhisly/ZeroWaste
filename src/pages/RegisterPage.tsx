import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Utensils, HeartHandshake, ShieldCheck, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RestaurantRegistration } from '@/components/registration/RestaurantRegistration';
import { NgoRegistration } from '@/components/registration/NgoRegistration';
import { AgentRegistration } from '@/components/registration/AgentRegistration';

export default function RegisterPage() {
  const { portal } = useParams<{ portal: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for "Landing Page" glow effect
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 25, stiffness: 150 };
  const glowX = useSpring(mouseX, springConfig);
  const glowY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const configMap: Record<string, any> = {
    restaurant: {
      title: 'Restaurant Registration',
      subtitle: 'PARTNER REGISTRATION',
      slogan: "Don't Waste It.",
      icon: Utensils,
      color: 'from-orange-500/20 to-orange-950/40',
      accent: 'text-orange-400',
      ring: 'focus:ring-orange-500/30',
      btn: 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20',
      bgImage: '/assets/restaurant_bg.png',
      glow: 'rgba(249, 115, 22, 0.4)',
    },
    ngo: {
      title: 'NGO Portal',
      subtitle: 'PARTNER REGISTRATION',
      slogan: "Rescue Today.",
      icon: HeartHandshake,
      color: 'from-purple-500/20 to-purple-950/40',
      accent: 'text-purple-400',
      ring: 'focus:ring-purple-500/30',
      btn: 'bg-purple-500 hover:bg-purple-600 shadow-purple-500/20',
      bgImage: '/assets/ngo_bg.png',
      glow: 'rgba(168, 85, 247, 0.4)',
    },
    agent: {
      title: 'Agent Registration',
      subtitle: 'LOGISTICS REGISTRATION',
      slogan: "Deliver Hope.",
      icon: ShieldCheck,
      color: 'from-blue-500/20 to-blue-950/40',
      accent: 'text-blue-400',
      ring: 'focus:ring-blue-500/30',
      btn: 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20',
      bgImage: '/assets/agent_bg.png',
      glow: 'rgba(59, 130, 246, 0.4)',
    },
  };
  const config = configMap[portal || 'restaurant'] || configMap.restaurant;
  const Icon = config.icon;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate(`/login/${portal}`);
    }, 1500);
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden font-sans"
    >
      {/* Brand Logo - Top Left */}
      <div className="absolute top-8 left-8 z-50">
        <span
          onClick={() => navigate('/')}
          className="text-4xl md:text-5xl font-display font-black tracking-tighter flex items-center cursor-pointer transition-transform hover:scale-105 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        >
          <span className="text-white">Zero</span>
          <span className={cn(config.accent, "opacity-90")}>Waste</span>
        </span>
      </div>
      {/* Immersive "Gradient Image" Background System */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Dynamic Glow following cursor */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-300"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([x, y]: any) => `radial-gradient(circle at ${x * 100}% ${y * 100}%, ${config.glow} 0%, transparent 60%)`
            )
          }}
        />
        {/* Removed Background Image */}
      </div>

      {/* Main Layout Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 h-screen flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-12 pt-24 pb-12 overflow-y-auto lg:overflow-visible">

        {/* Left Side: Hero Page Branding */}
        <div className="flex-1 w-full flex flex-col items-start justify-center pointer-events-none select-none order-2 lg:order-1 hidden md:flex">
          <motion.div
            initial={{ opacity: 0, x: -40, filter: 'blur(20px)' }}
            animate={{ opacity: 0.9, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col items-start"
          >
            <p className={cn("text-xs md:text-sm font-black tracking-[0.3em] uppercase mb-4", config.accent)}>
              {config.subtitle}
            </p>
            <h1 className="text-5xl md:text-7xl xl:text-[90px] font-display font-black tracking-[-0.02em] text-white leading-[1.1] drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              {config.slogan}
            </h1>
          </motion.div>
        </div>

        {/* Right Side: Register Card */}
        <div className="flex-1 w-full flex justify-center lg:justify-end items-center order-1 lg:order-2 my-10 lg:my-0">
          <motion.div
            initial={{ opacity: 0, y: 40, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
            className="w-full max-w-[600px] relative z-10"
          >
            <div className="bg-[#111111]/90 backdrop-blur-xl p-8 rounded-xl border border-white/5 relative overflow-hidden shadow-2xl">

              <div className="flex flex-col items-start mb-8 text-left">
                <h2 className="text-3xl font-bold tracking-tight mb-2">Create Account</h2>
                <p className="text-sm text-gray-400">
                  Register as a <span className={cn("font-bold", config.accent)}>{portal}</span>.
                </p>
              </div>

              {/* Render Specific Flow Based on Portal */}
              <div className="w-full">
                {portal === 'restaurant' && <RestaurantRegistration />}
                {portal === 'ngo' && <NgoRegistration />}
                {portal === 'agent' && <AgentRegistration />}
              </div>

              <p className="mt-10 text-center text-sm font-medium text-white/40">
                Already have an account?{' '}
                <button
                  onClick={() => navigate(`/login/${portal}`)}
                  className="text-white font-black hover:underline underline-offset-4"
                >
                  SIGN IN
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
