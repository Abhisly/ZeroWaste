import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Download, Printer } from 'lucide-react';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
}

export function DocumentViewerModal({ isOpen, onClose, documentName }: DocumentViewerModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-4xl bg-[#111] border border-white/10 rounded-2xl shadow-2xl z-[101] overflow-hidden flex flex-col"
            style={{ maxHeight: '90vh' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold">{documentName}</h3>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">Secure Document Viewer</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Print Document">
                  <Printer className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Download Document">
                  <Download className="w-5 h-5" />
                </button>
                <div className="w-px h-6 bg-white/10 mx-1" />
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Close">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Viewer Content (Mock) */}
            <div className="p-6 bg-black flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center justify-center min-h-[500px]">
              <div className="w-full max-w-2xl bg-[#E8ECEF] rounded-lg shadow-inner flex flex-col items-center p-12 min-h-[600px] text-gray-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/50 -rotate-45 translate-x-16 -translate-y-16" />
                
                <FileText className="w-16 h-16 text-gray-400 mb-6" />
                <h2 className="text-2xl font-black text-gray-600 text-center uppercase tracking-widest leading-relaxed mb-12">
                  {documentName}
                </h2>
                
                <div className="space-y-6 w-full max-w-md">
                  <div className="flex gap-4">
                    <div className="h-4 bg-gray-300 rounded-full w-12" />
                    <div className="h-4 bg-gray-300 rounded-full w-full" />
                  </div>
                  <div className="flex gap-4">
                    <div className="h-4 bg-gray-300 rounded-full w-24" />
                    <div className="h-4 bg-gray-300 rounded-full w-full" />
                  </div>
                  <div className="flex gap-4">
                    <div className="h-4 bg-gray-300 rounded-full w-8" />
                    <div className="h-4 bg-gray-300 rounded-full w-3/4" />
                  </div>
                  <div className="flex gap-4">
                    <div className="h-4 bg-gray-300 rounded-full w-16" />
                    <div className="h-4 bg-gray-300 rounded-full w-5/6" />
                  </div>
                  <div className="flex gap-4">
                    <div className="h-4 bg-gray-300 rounded-full w-20" />
                    <div className="h-4 bg-gray-300 rounded-full w-4/6" />
                  </div>
                </div>
                
                <div className="mt-auto pt-16 w-full flex justify-end">
                   <div className="w-32 h-32 border-4 border-dashed border-blue-500/40 rounded-full flex items-center justify-center -rotate-[15deg] shadow-sm bg-blue-50/50">
                      <span className="font-black text-xl text-blue-500/60 uppercase tracking-widest">Valid</span>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
