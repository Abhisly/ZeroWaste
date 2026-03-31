import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleMap, useJsApiLoader, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import {
  ArrowLeft, MapPin, Navigation, Package, Clock,
  CheckCircle2, Phone, MessageSquare, Truck, ShieldCheck,
  Zap, Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

const containerStyle = {
    width: '100%',
    height: '100%'
};

// Generic demonstration coordinates
const center = { lat: 28.6139, lng: 77.2090 };
const origin = { lat: 28.5355, lng: 77.2410 };
const destination = { lat: 28.6505, lng: 77.2303 };

const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#050505" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#000000" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
  { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#181818" }] },
  { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] },
  { featureType: "road.local", elementType: "geometry.fill", stylers: [{ color: "#1f1f1f" }] },
  { featureType: "transit", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] }
];

export default function LiveDeliveryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  
  const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY || ""
  });

  const directionsCallback = (
      result: google.maps.DirectionsResult | null,
      status: google.maps.DirectionsStatus
  ) => {
      if (status === 'OK' && result) {
          setDirections(result);
      }
  };

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
      <div className="w-full md:w-[480px] bg-white/[0.02] backdrop-blur-3xl border-r border-white/5 flex flex-col h-screen z-30 relative shadow-2xl">
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
              <span className="text-[10px] font-black text-emerald-400 tracking-widest uppercase">LIVE SIGNAL</span>
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-4xl font-display font-black tracking-tighter uppercase">DELIVERY RE-0428</h1>
            <p className="text-[10px] font-semibold text-white/30 tracking-[0.4em] uppercase">Hyper-Local Food Logistics</p>
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
              <h3 className="text-2xl font-display font-black tracking-tight uppercase text-white/90">
                {getStatus()}
              </h3>
              <div className="flex items-center justify-center gap-4 text-xs font-semibold text-white/30 tracking-widest uppercase">
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
                      "text-[9px] font-semibold tracking-widest uppercase transition-colors duration-500",
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
                  <p className="text-xs font-semibold text-white/40 mt-1 truncate">{node.addr}</p>
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
      <div className="flex-1 relative bg-[#050505] overflow-hidden min-h-[50vh] md:min-h-screen">
        
        {/* Real Google Map Integration */}
        <div className="absolute inset-0">
          {isLoaded ? (
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={12}
                options={{
                    styles: darkMapStyle,
                    disableDefaultUI: true,
                    zoomControl: true,
                }}
            >
                {!directions && (
                    <DirectionsService
                        options={{
                            destination: destination,
                            origin: origin,
                            travelMode: google.maps.TravelMode.DRIVING
                        }}
                        callback={directionsCallback}
                    />
                )}
                {directions && (
                    <DirectionsRenderer
                        options={{
                            directions: directions,
                            polylineOptions: {
                                strokeColor: "#f97316", // Orange delivery line matching theme
                                strokeWeight: 6,
                                strokeOpacity: 0.8
                            },
                        }}
                    />
                )}
            </GoogleMap>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/50 space-y-4">
                <Globe className="w-16 h-16 animate-pulse" />
                <div className="font-black tracking-widest text-sm uppercase">INITIALIZING SATELLITE LINK...</div>
            </div>
          )}
        </div>

        {/* Tactical Overlays */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent pointer-events-none" />
        
        {/* Tactical UI Elements */}
        <div className="absolute bottom-10 right-10 flex gap-4 pointer-events-none z-10">
          {[
            { label: 'LAT', val: '28.6139° N' },
            { label: 'LNG', val: '77.2090° E' },
            { label: 'ALT', val: '216m' }
          ].map((p, i) => (
            <div key={i} className="bg-white/[0.02] backdrop-blur-3xl px-6 py-4 rounded-2xl border border-white/5 space-y-1 shadow-2xl">
              <p className="text-[8px] font-black text-white/20 tracking-[0.2em]">{p.label}</p>
              <p className="text-xs font-semibold text-white/60 font-mono tracking-tight">{p.val}</p>
            </div>
          ))}
        </div>
      </div>

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
      `}</style>
    </div>
  );
}
