import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface FileUploadProps {
  label: string;
  accept?: string;
  onFileSelect: (file: File | null) => void;
  required?: boolean;
}

export function FileUpload({ label, accept = "image/*,application/pdf", onFileSelect, required = false }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    onFileSelect(selectedFile);
  };

  const clearFile = () => {
    setFile(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const isImage = file?.type.startsWith('image/');

  return (
    <div className="w-full space-y-2">
      <label className="text-xs font-bold text-white/70 uppercase tracking-widest flex items-center gap-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {!file ? (
        <div 
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-white/40 hover:bg-white/5 transition-all group"
        >
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Upload className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
          </div>
          <div className="text-center">
            <p className="text-sm text-white font-medium">Click to upload document</p>
            <p className="text-xs text-white/40 mt-1">PDF, JPG or PNG (max. 5MB)</p>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 relative"
        >
          <div className="w-12 h-12 rounded-lg bg-black/50 flex items-center justify-center shrink-0 overflow-hidden">
             {isImage ? (
                <ImageIcon className="w-5 h-5 text-blue-400" />
             ) : (
                <FileText className="w-5 h-5 text-orange-400" />
             )}
          </div>
          <div className="flex-1 min-w-0 pr-8">
            <p className="text-sm font-medium text-white truncate">{file.name}</p>
            <p className="text-xs text-white/40">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button 
            type="button"
            onClick={clearFile}
            className="absolute right-4 p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      <input 
        type="file" 
        ref={inputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />
    </div>
  );
}
