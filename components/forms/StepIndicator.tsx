import React from"react";
import { Check } from"lucide-react";
import { StepIndicatorProps } from"@/types/form";

export default function StepIndicator({ currentStep, totalSteps, stepTitles, completedSteps }: StepIndicatorProps) {
 return (
 <div className="w-full py-4 select-none">
 <div className="flex items-center justify-between">
 {stepTitles.map((title, idx) => {
 const stepNum = idx + 1;
 const isCompleted = completedSteps.includes(stepNum);
 const isActive = currentStep === stepNum;
 
 return (
 <React.Fragment key={title}>
 {idx > 0 && (
 <div className={`flex-1 h-0.5 mx-2 ${
 isCompleted ?"bg-accent-light" :"bg-slate-200"
 }`} />
 )}
 <div className="flex flex-col items-center gap-1.5 relative">
 <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border transition-all ${
 isCompleted
 ?"bg-accent-light border-orange-600 text-white"
 : isActive
 ?"bg-primary border-slate-900 text-white ring-2 ring-accent/20"
 :"bg-white border-border text-text-tertiary"
 }`}>
 {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
 </div>
 <span className={`text-sm uppercase tracking-wider font-extrabold whitespace-nowrap absolute top-10 ${
 isActive ?"text-primary" :"text-text-tertiary"
 }`}>
 {title}
 </span>
 </div>
 </React.Fragment>
 );
 })}
 </div>
 <div className="h-6" /> {/* Spacer for sub-labels */}
 </div>
 );
}
