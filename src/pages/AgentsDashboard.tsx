import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, LayoutDashboard, Settings, Bell, Search, User } from 'lucide-react';
import VerificationAgentDashboard from './VerificationAgentDashboard';
import DeliveryAgentDashboard from './DeliveryAgentDashboard';
import { cn } from '@/lib/utils';

export default function AgentsDashboard() {
    const { role } = useParams<{ role: string }>();
    const navigate = useNavigate();

    const isVerify = role === 'verify';

    return (
        <div className="min-h-screen bg-black text-white flex font-sans">
            {/* Sidebar */}
            <aside className="w-24 md:w-72 border-r border-white/10 flex flex-col p-6 sticky top-0 h-screen transition-all">
                <div className="flex items-center gap-3 mb-12 px-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/20">
                        Z
                    </div>
                    <span className="text-3xl font-display font-black tracking-tighter hidden md:block">
                        Zero<span className="text-blue-500">Waste</span>
                    </span>
                </div>

                <nav className="flex-1 space-y-2">
                    <button className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-blue-500/10 text-blue-400 font-bold transition-all">
                        <LayoutDashboard className="w-6 h-6" />
                        <span className="hidden md:block">Dashboard</span>
                    </button>
                    <button className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 font-bold transition-all group">
                        <Bell className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="hidden md:block">Notifications</span>
                    </button>
                    <button className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 font-bold transition-all group">
                        <Settings className="w-6 h-6 group-hover:rotate-45 transition-transform" />
                        <span className="hidden md:block">Settings</span>
                    </button>
                </nav>

                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-4 px-4 py-4 rounded-2xl text-red-500/60 hover:text-red-500 hover:bg-red-500/5 font-bold transition-all"
                >
                    <LogOut className="w-6 h-6" />
                    <span className="hidden md:block">Secure Log Out</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-h-screen overflow-y-auto">
                <header className="h-24 px-8 border-b border-white/10 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-xl z-50">
                    <div className="relative w-96 hidden lg:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search logistics matrix..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all text-white"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex -space-x-2">
                            <div className="w-10 h-10 rounded-full border-2 border-black bg-blue-500 flex items-center justify-center text-xs font-bold">A</div>
                            <div className="w-10 h-10 rounded-full border-2 border-black bg-orange-500 flex items-center justify-center text-xs font-bold">B</div>
                        </div>
                        <div className="h-8 w-px bg-white/10" />
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-white uppercase tracking-tight">Agent Portal</p>
                                <p className="text-xs text-blue-500 font-bold">{isVerify ? 'Verification' : 'Delivery'} Unit</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                                <User className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </header>

                <section className="p-8 max-w-[1600px] mx-auto">
                    {isVerify ? <VerificationAgentDashboard /> : <DeliveryAgentDashboard />}
                </section>
            </main>
        </div>
    );
}
