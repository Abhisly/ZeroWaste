import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle, XCircle, FileText, Info, Building2, MapPin, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

const MOCK_VERIFICATIONS = [
    {
        id: 'v1',
        name: 'Gourmet Garden',
        type: 'Restaurant',
        address: '123 Culinary Ave, Foodville',
        license: 'REST-5521-X',
        contact: '+1 555-0101',
        status: 'Pending',
        documents: ['fssai_license.pdf', 'identity_proof.jpg']
    },
    {
        id: 'v2',
        name: 'Helping Hands NGO',
        type: 'NGO',
        address: '456 Community Rd, Hope City',
        license: 'NGO-8890-Z',
        contact: '+1 555-0202',
        status: 'Pending',
        documents: ['80g_certificate.pdf', 'trust_deed.pdf']
    }
];

export default function VerificationAgentDashboard() {
    const [verifications, setVerifications] = useState(MOCK_VERIFICATIONS);
    const [selectedItem, setSelectedItem] = useState<typeof MOCK_VERIFICATIONS[0] | null>(null);

    const handleAction = (id: string, newStatus: string) => {
        setVerifications(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
        if (selectedItem?.id === id) {
            setSelectedItem(null);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-display font-black tracking-tight text-white mb-2">Verification Queue</h1>
                    <p className="text-gray-400">Review and approve organizations joining the platform.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-md">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Pending</p>
                        <p className="text-2xl font-black text-blue-400">{verifications.filter(v => v.status === 'Pending').length}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-md">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Approved</p>
                        <p className="text-2xl font-black text-green-400">{verifications.filter(v => v.status === 'Approved').length}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List */}
                <div className="lg:col-span-1 space-y-4">
                    {verifications.map((v) => (
                        <motion.div
                            key={v.id}
                            onClick={() => setSelectedItem(v)}
                            className={cn(
                                "p-6 rounded-2xl border transition-all cursor-pointer group",
                                selectedItem?.id === v.id
                                    ? "bg-blue-500/10 border-blue-500/50"
                                    : "bg-white/5 border-white/10 hover:border-white/20"
                            )}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={cn(
                                    "px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter",
                                    v.type === 'Restaurant' ? "bg-orange-500/20 text-orange-400" : "bg-teal-500/20 text-teal-400"
                                )}>
                                    {v.type}
                                </div>
                                <div className={cn(
                                    "text-[10px] font-bold",
                                    v.status === 'Pending' ? "text-yellow-500" :
                                        v.status === 'Approved' ? "text-green-500" : "text-red-500"
                                )}>
                                    {v.status.toUpperCase()}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{v.name}</h3>
                            <p className="text-sm text-gray-500 line-clamp-1 mt-1">{v.address}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Details View */}
                <div className="lg:col-span-2">
                    {selectedItem ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#111111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl sticky top-24"
                        >
                            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                                        <Building2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-white">{selectedItem.name}</h2>
                                        <p className="text-sm text-gray-400">System ID: {selectedItem.id.toUpperCase()}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleAction(selectedItem.id, 'Rejected')}
                                        className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleAction(selectedItem.id, 'Approved')}
                                        className="px-6 py-3 rounded-xl bg-blue-500 text-white font-bold flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        Approve Organization
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Organization Details</p>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-gray-300">
                                                <MapPin className="w-4 h-4 text-blue-400" />
                                                <span>{selectedItem.address}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-300">
                                                <ShieldCheck className="w-4 h-4 text-blue-400" />
                                                <span>License No: {selectedItem.license}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-300">
                                                <Phone className="w-4 h-4 text-blue-400" />
                                                <span>Contact: {selectedItem.contact}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Uploaded Documents</p>
                                        <div className="grid grid-cols-1 gap-2">
                                            {selectedItem.documents.map((doc, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group cursor-pointer">
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                                                        <span className="text-gray-300 group-hover:text-white">{doc}</span>
                                                    </div>
                                                    <Info className="w-4 h-4 text-gray-600" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                    <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                        <Info className="w-4 h-4 text-blue-400" />
                                        Reviewer Notes
                                    </h4>
                                    <textarea
                                        className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-gray-300 focus:outline-none focus:border-blue-500/50 transition-all text-sm resize-none"
                                        placeholder="Add notes about this verification..."
                                    ></textarea>
                                    <button className="w-full mt-4 py-3 rounded-xl border border-white/10 text-white/60 font-bold hover:bg-white/5 transition-all text-xs uppercase tracking-widest">
                                        Request More Information
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-[500px] border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center p-12">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                <ShieldCheck className="w-10 h-10 text-gray-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Select an Organization</h3>
                            <p className="text-gray-500 max-w-sm">Please choose an organization from the left to begin the verification process.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
