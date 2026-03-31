import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Utensils, HeartHandshake, ShieldCheck, ArrowLeft, Mail, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const { portal } = useParams<{ portal: string }>();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      title: 'Restaurant Portal',
      subtitle: 'PARTNER LOGIN',
      slogan: "Don't Waste It.",
      icon: Utensils,
      color: 'from-orange-500/20 to-orange-950/40',
      accent: 'text-orange-400',
      ring: 'focus:ring-orange-500/30',
      btn: 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20',
      demoEmail: 'restaurant@demo.com',
      demoPass: 'demo123',
      dashboardPath: '/dashboard/restaurant',
      bgImage: '/assets/restaurant_bg.png',
      glow: 'rgba(249, 115, 22, 0.4)',
    },
    ngo: {
      title: 'NGO Portal',
      subtitle: 'VOLUNTEER LOGIN',
      slogan: "Rescue Today.",
      icon: HeartHandshake,
      color: 'from-purple-500/20 to-purple-950/40',
      accent: 'text-purple-400',
      ring: 'focus:ring-purple-500/30',
      btn: 'bg-purple-500 hover:bg-purple-600 shadow-purple-500/20',
      demoEmail: 'ngo@demo.com',
      demoPass: 'demo123',
      dashboardPath: '/dashboard/ngo',
      bgImage: '/assets/ngo_bg.png',
      glow: 'rgba(168, 85, 247, 0.4)',
    },
    admin: {
      title: 'Admin Portal',
      subtitle: 'STAFF ACCESS',
      slogan: "System Secure.",
      icon: ShieldCheck,
      color: 'from-green-500/20 to-green-950/40',
      accent: 'text-green-400',
      ring: 'focus:ring-green-500/30',
      btn: 'bg-green-500 hover:bg-green-600 shadow-green-500/20',
      demoEmail: 'admin@zerowaste.com',
      demoPass: 'admin123',
      dashboardPath: '/dashboard/admin',
      bgImage: '/assets/admin_bg.png',
      glow: 'rgba(34, 197, 94, 0.4)',
    },
    agent: {
      title: 'Agents Portal',
      subtitle: 'LOGISTICS ACCESS',
      slogan: "Deliver Hope.",
      icon: ShieldCheck,
      color: 'from-blue-500/20 to-blue-950/40',
      accent: 'text-blue-400',
      ring: 'focus:ring-blue-500/30',
      btn: 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20',
      demoEmail: 'verify@agent.com',
      demoPass: 'agent123',
      dashboardPath: '/dashboard/agent',
      bgImage: '/assets/agent_bg.png',
      glow: 'rgba(59, 130, 246, 0.4)',
    },
  };
  const config = configMap[portal || 'restaurant'] || configMap.restaurant;
  const Icon = config.icon;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      console.log('Backend response:', data);

      if (data.success) {
        if (portal === 'agent') {
          if (email === 'verify@agent.com') {
            navigate('/dashboard/agent/verify');
          } else if (email === 'delivery@agent.com') {
            navigate('/dashboard/agent/delivery');
          } else {
            navigate(config.dashboardPath);
          }
        } else {
          navigate(config.dashboardPath);
        }
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Fallback for demo if server is not running
      setTimeout(() => {
        navigate(config.dashboardPath);
      }, 1000);
    } finally {
      setIsLoading(false);
    }
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

        {/* Subtle Scanned Layer */}
        <div className="absolute inset-0 bg-black/60 z-0" />
      </div>

      {/* Main Layout Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 h-screen flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-12 pt-24 pb-12">

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

        {/* Right Side: Login Card */}
        <div className="flex-1 w-full flex justify-center lg:justify-end items-center order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, y: 40, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
            className="w-full max-w-[440px] relative z-10"
          >
            <div className="bg-[#111111]/90 backdrop-blur-xl p-8 rounded-xl border border-white/5 relative overflow-hidden group shadow-2xl">

              <div className="flex flex-col items-start mb-8">
                <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h2>
                <p className="text-sm text-gray-400">
                  Sign in to your <span className={cn("font-bold", config.accent)}>{config.title.split(' ')[0]}</span> account.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.1 } }
                  }}
                  className="space-y-5"
                >
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    className="relative group"
                  >
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-white transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      required
                      className={cn(
                        "w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-white/20 focus:outline-none focus:bg-white/10 transition-all",
                        config.ring
                      )}
                    />
                  </motion.div>
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    className="relative group"
                  >
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-white transition-colors" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      className={cn(
                        "w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-white/20 focus:outline-none focus:bg-white/10 transition-all",
                        config.ring
                      )}
                    />
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-between items-center text-xs px-2"
                >
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative w-4 h-4">
                      <input type="checkbox" className="peer absolute inset-0 opacity-0 cursor-pointer" />
                      <div className="w-4 h-4 rounded-md border border-white/20 bg-white/5 peer-checked:bg-white transition-all flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-black rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                      </div>
                    </div>
                    <span className="text-white/60 group-hover:text-white transition-colors">Keep me signed in</span>
                  </label>
                  <button type="button" className="text-white/60 hover:text-white font-bold transition-colors">HELP?</button>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "w-full py-5 rounded-2xl text-white font-black text-sm tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl uppercase",
                    config.btn
                  )}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>SIGN IN TO ACCOUNT <Icon className="w-4 h-4" /></>
                  )}
                </motion.button>
              </form>

              <div className="mt-10 flex flex-col items-center gap-6">
                <button
                  type="button"
                  onClick={() => { setEmail(config.demoEmail); setPassword(config.demoPass); }}
                  className="text-[10px] font-black tracking-[0.2em] text-white/40 hover:text-white transition-all border-b border-white/10 pb-1"
                >
                  LOAD DEMO CREDENTIALS
                </button>

                {portal !== 'admin' && (
                  <p className="text-sm font-medium text-white/40">
                    New to the platform?{' '}
                    <button
                      onClick={() => navigate(`/register/${portal}`)}
                      className="text-white font-black hover:underline underline-offset-4"
                    >
                      JOIN NOW
                    </button>
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
