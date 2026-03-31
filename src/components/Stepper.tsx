import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full py-6">
      <div className="flex justify-between items-center relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-white/10 -z-10" />
        
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-white transition-all duration-300 -z-10"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div key={index} className="flex flex-col items-center gap-2 relative z-10">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted || isActive ? '#ffffff' : '#111111',
                  borderColor: isCompleted || isActive ? '#ffffff' : 'rgba(255,255,255,0.2)',
                  color: isCompleted || isActive ? '#000000' : '#ffffff',
                }}
                className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors duration-300 shadow-xl",
                  isActive && "ring-4 ring-white/20"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </motion.div>
              <span className={cn(
                "text-[10px] md:text-xs font-bold uppercase tracking-widest absolute top-10 w-32 text-center",
                isActive ? "text-white" : "text-white/40"
              )}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
