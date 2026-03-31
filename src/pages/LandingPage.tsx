import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { LayoutDashboard, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const ZeroWasteLogo = ({ className, accentColor = "white" }: { className?: string; accentColor?: string }) => (
  <div className={cn("flex items-center font-display font-black tracking-tighter", className)}>
    <span className="text-white">Zero</span>
    <span style={{ color: accentColor }}>Waste</span>
  </div>
);

export default function LandingPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const navigate = useNavigate();

  const portals = [
    {
      id: 'restaurant',
      title: 'Restaurant',
      accent: 'orange',
      accentHex: '#f97316',
      loginPath: '/login/restaurant',
      registerPath: '/register/restaurant',
    },
    {
      id: 'ngo',
      title: 'NGO',
      accent: 'purple',
      accentHex: '#a855f7',
      loginPath: '/login/ngo',
      registerPath: '/register/ngo',
    },
    {
      id: 'agent',
      title: 'Agent',
      accent: 'blue',
      accentHex: '#3b82f6',
      loginPath: '/login/agent',
      registerPath: '/register/agent',
    },
    {
      id: 'admin',
      title: 'Admin',
      accent: 'green',
      accentHex: '#22c55e',
      loginPath: '/login/admin',
      registerPath: null,
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-black text-white selection:bg-white/20 overflow-hidden font-sans"
    >
      {/* Header - Minimal and disappears on expansion */}
      <AnimatePresence>
        {!expandedId && (
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-50 p-8 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl md:text-5xl font-display font-black tracking-tighter flex items-center pointer-events-auto">
                <span className="text-white">Zero</span>
                <span className="text-orange-500">Waste</span>
              </span>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Grid Container */}
      <div className="h-full w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        {portals.map((portal) => (
          <PortalPanel
            key={portal.id}
            portal={portal}
            isExpanded={expandedId === portal.id}
            isAnyExpanded={expandedId !== null}
            onExpand={() => setExpandedId(portal.id)}
            onCollapse={() => setExpandedId(null)}
            navigate={navigate}
          />
        ))}
      </div>
    </motion.div>
  );
}

function PortalPanel({ portal, isExpanded, isAnyExpanded, onExpand, onCollapse, navigate }: any) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Magnetic / Tilt Effect Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);

  // Content magnetic pull
  const contentX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-30, 30]), springConfig);
  const contentY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-30, 30]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isExpanded) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const accentThemes: any = {
    orange: 'rgba(249, 115, 22, 0.4)',
    purple: 'rgba(168, 85, 247, 0.4)',
    blue: 'rgba(59, 130, 246, 0.4)',
    green: 'rgba(34, 197, 94, 0.4)',
  };

  const buttonStyles: any = {
    orange: 'bg-orange-600 hover:bg-orange-500 shadow-orange-500/20',
    purple: 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/20',
    blue: 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20',
    green: 'bg-green-600 hover:bg-green-500 shadow-green-500/20',
  };

  return (
    <motion.div
      ref={containerRef}
      layout
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => !isAnyExpanded && onExpand()}
      className={cn(
        "relative overflow-hidden cursor-pointer group perspective-1000",
        isExpanded ? "fixed inset-0 z-40" : "h-full w-full border border-white/5",
        isAnyExpanded && !isExpanded ? "opacity-0 pointer-events-none scale-95" : "opacity-100",
        !isExpanded && isHovered && "z-10 bg-white/[0.02]"
      )}
      style={{
        rotateX: isExpanded ? 0 : rotateX,
        rotateY: isExpanded ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Dynamic Glow following cursor */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: isHovered && !isExpanded ? 1 : 0,
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]: any) => `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, ${accentThemes[portal.accent]} 0%, transparent 60%)`
          )
        }}
      />

      {/* Expanded Theme Gradient Reveal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-1 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 70% 30%, ${portal.accentHex}15 0%, transparent 50%),
                           radial-gradient(circle at 30% 70%, ${portal.accentHex}10 0%, transparent 50%),
                           linear-gradient(to bottom right, transparent, ${portal.accentHex}05)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Background Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className={cn(
          "absolute inset-0 transition-opacity duration-1000 bg-gradient-to-br from-black/90 via-black/40 to-black/90",
          isExpanded ? "opacity-100" : "opacity-40"
        )} />
      </div>

      {/* Initial View (Grid State) */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-20 h-full w-full flex flex-col items-center justify-center p-8 text-center"
            style={{
              x: contentX,
              y: contentY,
              translateZ: 50,
            }}
          >
            <motion.h3
              animate={{
                letterSpacing: isHovered ? "0.15em" : "0.05em",
                opacity: isHovered ? 1 : 0.7,
                scale: isHovered ? 1.1 : 1
              }}
              className="text-5xl md:text-6xl lg:text-8xl font-display font-black tracking-widest uppercase transition-all duration-700 pointer-events-none drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]"
            >
              {portal.title}
            </motion.h3>
            <motion.div
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
              className="mt-6 flex items-center gap-2 text-white/60 font-medium tracking-[0.3em] uppercase text-xs"
            >
              <span>Initialize Protocol</span>
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded View (100% state) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-30 h-full w-full flex flex-col p-8 md:p-24 overflow-y-auto"
          >
            {/* Header / Close Button */}
            <div className="flex justify-between items-start">
              <motion.button
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                onClick={(e) => { e.stopPropagation(); onCollapse(); }}
                className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 backdrop-blur-xl shadow-2xl"
                style={{
                  // @ts-ignore
                  '--hover-border': portal.accentHex,
                }}
              >
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                <span className="text-sm font-black tracking-widest uppercase text-white/80 group-hover:text-white">Go Back</span>
              </motion.button>

              <div className="flex items-center gap-6">
                <ZeroWasteLogo className="text-4xl md:text-6xl" accentColor={portal.accentHex} />
                <div className="hidden md:block border-l border-white/10 pl-6">
                  <p className="text-[10px] font-black tracking-[0.4em] uppercase opacity-40 mb-1">ZeroWaste Protocol</p>
                  <p className="text-sm font-bold tracking-tight text-white/60">System Ready</p>
                </div>
              </div>
            </div>

            {/* Content Reveal */}
            <div className="mt-auto max-w-5xl">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h2 className="text-7xl md:text-[8rem] lg:text-[10rem] font-display font-black tracking-tighter leading-[0.85] mb-8 text-white">
                  {portal.title}<br />
                  <span className={cn(
                    "text-transparent bg-clip-text bg-gradient-to-r",
                    portal.accent === 'orange' ? 'from-orange-500 to-orange-200' :
                      portal.accent === 'purple' ? 'from-purple-500 to-purple-200' :
                        portal.accent === 'blue' ? 'from-blue-500 to-blue-200' : 'from-green-500 to-green-200'
                  )}>Environment</span>
                </h2>
              </motion.div>

              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-xl md:text-3xl text-white/50 max-w-3xl leading-relaxed mb-16 font-medium"
              >
                {portal.id === 'restaurant' && "Maximize your sustainability impact. Deploy your surplus food to community networks through our mission-critical logistics engine."}
                {portal.id === 'ngo' && "The nexus of community support. Access a real-time inventory of surplus food and coordinate distribution with tactical efficiency."}
                {portal.id === 'agent' && "Precision in every delivery. Verify organizations and facilitate the movement of life-saving resources across the Redistribution Matrix."}
                {portal.id === 'admin' && "Complete system oversight. Monitor high-level redistribution metrics, secure the verification protocol, and optimize the global matrix."}
              </motion.p>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex flex-wrap gap-8"
              >
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(portal.loginPath); }}
                  className={cn(
                    "px-16 py-6 rounded-3xl text-white font-black text-xl flex items-center gap-4 transition-all hover:scale-[1.05] active:scale-[0.98] shadow-2xl",
                    buttonStyles[portal.accent]
                  )}
                >
                  Sign In
                  <ArrowRight className="w-8 h-8" />
                </button>

                {portal.registerPath && (
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(portal.registerPath); }}
                    className="px-16 py-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-2xl text-white font-black text-xl transition-all hover:scale-[1.05] active:scale-[0.98]"
                  >
                    Create Account
                  </button>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
