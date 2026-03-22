import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, MapPin, Flag, ArrowLeft, MoreVertical, Phone, MessageSquare, Shield, Clock, ChevronRight, X, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MapViewProps {
    onClose: () => void;
    onComplete: () => void;
    delivery: any;
}

export default function MapView({ onClose, onComplete, delivery }: MapViewProps) {
    const [progress, setProgress] = useState(0);
    const [eta, setEta] = useState(12);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 0.5;
            });
            setEta(prev => Math.max(1, prev - 0.1));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative h-screen w-full bg-slate-900 border-none">
            {/* Mock Map Background */}
            <div className="absolute inset-0 overflow-hidden bg-[#0a0a0a]">
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(#3b82f6 0.5px, transparent 1px)',
                        backgroundSize: '30px 30px'
                    }}
                />

                {/* Mock Grid Lines */}
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                        backgroundSize: '100px 100px'
                    }}
                />

                {/* Dynamic Route Line */}
                <svg className="absolute inset-0 w-full h-full">
                    <motion.path
                        d="M 200 600 Q 400 300 800 500"
                        fill="none"
                        stroke="#1e293b"
                        strokeWidth="12"
                        strokeLinecap="round"
                    />
                    <motion.path
                        d="M 200 600 Q 400 300 800 500"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="1000"
                        strokeDashoffset={1000 - (progress * 10)}
                    />
                </svg>

                {/* Pickup Pin */}
                <div className="absolute top-[600px] left-[200px] -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                        <div className="w-12 h-12 bg-orange-500/20 rounded-full animate-ping absolute inset-0" />
                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center relative shadow-2xl shadow-orange-500/50">
                            <MapPin className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                {/* Dropoff Pin */}
                <div className="absolute top-[500px] left-[800px] -translate-x-1/2 -translate-y-1/2">
                    <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center shadow-2xl shadow-teal-500/50">
                        <Flag className="w-6 h-6 text-white" />
                    </div>
                </div>

                {/* Driver Indicator */}
                <motion.div
                    style={{
                        position: 'absolute',
                        left: 200 + (progress * 6),
                        top: 600 - (progress * 1),
                    }}
                    className="z-20 -translate-x-1/2 -translate-y-1/2"
                >
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-blue-500">
                        <Navigation className="w-5 h-5 text-blue-600 rotate-45" />
                    </div>
                </motion.div>
            </div>

            {/* Top Bar Overlay */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start pointer-events-none">
                <button
                    onClick={onClose}
                    className="pointer-events-auto p-4 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10 text-white hover:bg-black/80 transition-all shadow-2xl"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                <div className="bg-black/80 backdrop-blur-3xl p-6 rounded-3xl border border-white/10 shadow-2xl min-w-[320px] pointer-events-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">ETA TO DESTINATION</p>
                            <h2 className="text-4xl font-display font-black text-white">{Math.ceil(eta)} MINS</h2>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <p className="text-sm font-bold text-gray-300">Live: Heading to {delivery.ngo}</p>
                    </div>
                </div>
            </div>

            {/* Bottom Panel Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-center pointer-events-none">
                <div className="bg-black/90 backdrop-blur-3xl w-full max-w-4xl p-8 rounded-[40px] border border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] pointer-events-auto flex flex-col md:flex-row items-center gap-8">
                    <div className="flex items-center gap-6 flex-1 text-left">
                        <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white shadow-xl">
                            <Package className="w-10 h-10" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white mb-1">{delivery.type} Rescue</h3>
                            <p className="text-gray-400 font-medium">From: <span className="text-white">{delivery.restaurant}</span></p>
                        </div>
                    </div>

                    <div className="h-12 w-px bg-white/10 hidden md:block" />

                    <div className="flex gap-4">
                        <div className="flex items-center gap-4 text-left">
                            <button className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                                <Phone className="w-6 h-6" />
                            </button>
                            <button className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                                <MessageSquare className="w-6 h-6" />
                            </button>
                        </div>
                        <button
                            onClick={onComplete}
                            className="px-10 py-5 bg-blue-600 rounded-[24px] text-white font-black text-lg hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-500/20"
                        >
                            Confirm Delivery
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
