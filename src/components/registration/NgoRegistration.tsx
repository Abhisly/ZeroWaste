import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Lock, FileText, MapPin, Building, Check, HeartHandshake, Users } from 'lucide-react';
import { Stepper } from '../Stepper';
import { FileUpload } from '../FileUpload';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const STEPS = ['Basic Info', 'Organization', 'Documents'];

export function NgoRegistration() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // OTP State
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState('');

  const [formData, setFormData] = useState({
    ngoName: '',
    coordinatorName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    registrationNumber: '',
    ngoType: 'Food',
    peopleServed: '',
    declaration: false,
  });

  const updateForm = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = () => {
    if (currentStep === 0) return formData.ngoName && formData.coordinatorName && formData.email && formData.password && formData.password === formData.confirmPassword && isOtpVerified;
    if (currentStep === 1) return formData.registrationNumber && formData.ngoType && formData.peopleServed;
    if (currentStep === 2) return formData.declaration;
    return true;
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      setOtpError('Please enter an email address first.');
      return;
    }
    setIsSendingOtp(true);
    setOtpError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await res.json();
      if (data.success) {
        setIsOtpSent(true);
      } else {
        setOtpError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setOtpError('Server error while sending OTP');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setOtpError('Please enter the OTP.');
      return;
    }
    setIsVerifyingOtp(true);
    setOtpError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp })
      });
      const data = await res.json();
      if (data.success) {
        setIsOtpVerified(true);
        setIsOtpSent(false);
        setVerificationSuccess('OTP Verified Successfully!');
        // Automatically progress to next step after success message
        setTimeout(() => {
          setVerificationSuccess('');
          setCurrentStep(1);
        }, 1500);
      } else {
        setOtpError(data.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setOtpError('Server error while verifying OTP');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleNext = () => {
    if (validateStep()) setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    else alert("Please fill all required fields correctly.");
  };

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) {
       alert("Please agree to the declaration and complete uploads.");
       return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
  };

  if (isSuccess) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-purple-400" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Application Submitted!</h2>
        <p className="text-white/60 mb-8 max-w-md">
          Your NGO profile is currently <strong className="text-purple-400">Under Review</strong>.
          Verification agents will cross-check your documents. You'll receive an email once approved.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="bg-white text-black px-8 py-3 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-white/90 transition-colors"
        >
          Return to Home
        </button>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      <Stepper steps={STEPS} currentStep={currentStep} />
      
      <div className="mt-8 bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div key="step0" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
               <h3 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Basic Information</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <label className="text-xs text-white/50 px-1">NGO Name *</label>
                   <div className="relative group">
                     <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                     <input type="text" value={formData.ngoName} onChange={e => updateForm('ngoName', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:bg-white/10 transition-all outline-none" required />
                   </div>
                 </div>
                 <div className="space-y-1">
                   <label className="text-xs text-white/50 px-1">Coordinator Name *</label>
                   <div className="relative group">
                     <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                     <input type="text" value={formData.coordinatorName} onChange={e => updateForm('coordinatorName', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:bg-white/10 transition-all outline-none" required />
                   </div>
                 </div>
                 <div className="space-y-1">
                   <label className="text-xs text-white/50 px-1">Email Address (OTP Verification) *</label>
                   <div className="relative group flex gap-2">
                     <div className="relative flex-1">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                       <input 
                         type="email" 
                         value={formData.email} 
                         disabled={isOtpVerified}
                         onChange={e => {
                           updateForm('email', e.target.value);
                           setIsOtpVerified(false);
                           setIsOtpSent(false);
                           setOtpError('');
                         }} 
                         className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:bg-white/10 transition-all outline-none disabled:opacity-50" 
                         required 
                       />
                     </div>
                     {!isOtpVerified ? (
                       <button type="button" onClick={handleSendOtp} disabled={isSendingOtp} className="bg-purple-500/20 text-purple-400 px-4 rounded-xl text-xs font-bold hover:bg-purple-500/30 transition-colors whitespace-nowrap disabled:opacity-50">
                         {isSendingOtp ? 'Sending...' : (isOtpSent ? 'Resend OTP' : 'Send OTP')}
                       </button>
                     ) : (
                       <div className="bg-green-500/20 text-green-400 px-4 flex items-center justify-center rounded-xl text-xs font-bold whitespace-nowrap">
                         <Check className="w-4 h-4 mr-1"/> Verified
                       </div>
                     )}
                   </div>
                   {otpError && (
                      <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-xs text-red-500 px-1 mt-1 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span> {otpError}
                      </motion.p>
                    )}
                    {verificationSuccess && (
                      <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-xs text-green-500 px-1 mt-1 flex items-center gap-1 font-bold">
                        <Check className="w-3 h-3" /> {verificationSuccess}
                      </motion.p>
                    )}
                   {isOtpSent && !isOtpVerified && (
                     <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="pt-2 flex gap-2">
                       <input 
                         type="text" 
                         value={otp} 
                         onChange={e => setOtp(e.target.value)} 
                         placeholder="Enter 6-digit OTP" 
                         className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white focus:bg-white/10 outline-none text-center tracking-[0.5em] font-mono text-lg" 
                         maxLength={6} 
                       />
                       <button type="button" onClick={handleVerifyOtp} disabled={isVerifyingOtp} className="bg-green-500 hover:bg-green-600 text-white px-6 rounded-xl text-xs font-bold transition-colors shadow-lg shadow-green-500/20 disabled:opacity-50">
                         {isVerifyingOtp ? 'Verifying...' : 'Verify'}
                       </button>
                     </motion.div>
                   )}
                 </div>
                 <div className="space-y-1">
                   <label className="text-xs text-white/50 px-1">Phone Number *</label>
                   <div className="relative group">
                     <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                     <input type="tel" value={formData.phone} onChange={e => updateForm('phone', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:bg-white/10 transition-all outline-none" required />
                   </div>
                 </div>
                 <div className="space-y-1">
                   <label className="text-xs text-white/50 px-1">Password *</label>
                   <div className="relative group">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                     <input type="password" value={formData.password} onChange={e => updateForm('password', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:bg-white/10 transition-all outline-none" required />
                   </div>
                 </div>
                 <div className="space-y-1">
                   <label className="text-xs text-white/50 px-1">Confirm Password *</label>
                   <div className="relative group">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                     <input type="password" value={formData.confirmPassword} onChange={e => updateForm('confirmPassword', e.target.value)} className={cn("w-full bg-white/5 border rounded-xl py-3 pl-11 pr-4 text-white focus:bg-white/10 transition-all outline-none", formData.password !== formData.confirmPassword && formData.confirmPassword ? "border-red-500/50" : "border-white/10")} required />
                   </div>
                 </div>
               </div>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div key="step1" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
               <h3 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Organization Details</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <label className="text-xs text-white/50 px-1">NGO Registration Number *</label>
                   <div className="relative group">
                     <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                     <input type="text" value={formData.registrationNumber} onChange={e => updateForm('registrationNumber', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:bg-white/10 transition-all outline-none" placeholder="12A / 80G / Darpan ID" required />
                   </div>
                 </div>
                 <div className="space-y-1">
                   <label className="text-xs text-white/50 px-1">Type of NGO *</label>
                   <select value={formData.ngoType} onChange={e => updateForm('ngoType', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:bg-white/10 transition-all outline-none appearance-none">
                     <option value="Food" className="bg-neutral-900">Food Distribution</option>
                     <option value="Shelter" className="bg-neutral-900">Shelter / Orpanage</option>
                     <option value="Mixed" className="bg-neutral-900">Mixed Operations</option>
                   </select>
                 </div>
                 <div className="space-y-1 md:col-span-2">
                   <label className="text-xs text-white/50 px-1">Number of People Served Daily *</label>
                   <div className="relative group">
                     <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                     <input type="number" min="0" value={formData.peopleServed} onChange={e => updateForm('peopleServed', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:bg-white/10 transition-all outline-none" required />
                   </div>
                 </div>
               </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div key="step4" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
               <h3 className="text-xl font-bold mb-2 border-b border-white/10 pb-2">Document Uploads</h3>
               <p className="text-sm text-white/50 mb-6">Upload mandatory NGO verification documents. Max 5MB per file.</p>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FileUpload label="NGO Registration Certificate" required onFileSelect={(f) => console.log(f)} />
                 <FileUpload label="Coordinator ID Proof" required onFileSelect={(f) => console.log(f)} />
                 <FileUpload label="Government Approval (80G/12A)" onFileSelect={(f) => console.log(f)} />
                 <FileUpload label="Recent Distribution Photos" accept="image/*" onFileSelect={(f) => console.log(f)} />
               </div>

               <div className="mt-8 bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 flex items-start gap-3">
                 <input type="checkbox" id="declaration" checked={formData.declaration} onChange={e => updateForm('declaration', e.target.checked)} className="mt-1 accent-purple-500 w-4 h-4" />
                 <label htmlFor="declaration" className="text-sm text-white/80 cursor-pointer">
                   <strong>Declaration:</strong> We ensure that all food received will be distributed fairly, transparently, and safely under hygienic conditions to those in need.
                 </label>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
          <button 
            type="button" 
            onClick={handleBack}
            className={cn("px-6 py-2 rounded-xl text-sm font-bold transition-all", currentStep === 0 ? "opacity-0 pointer-events-none" : "hover:bg-white/10 text-white")}
          >
            BACK
          </button>
          
          {currentStep < STEPS.length - 1 ? (
            <button 
              type="button" 
              onClick={handleNext}
              className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-2 rounded-xl text-sm font-bold tracking-wider transition-colors shadow-lg shadow-purple-500/20"
            >
              CONTINUE
            </button>
          ) : (
            <button 
              type="button" 
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-2 rounded-xl text-sm font-bold tracking-wider transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2 active:scale-95"
            >
              {isLoading ? <span className="animate-pulse">SUBMITTING...</span> : 'SUBMIT APPLICATION'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
