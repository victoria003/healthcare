"use client";

import React, { useState } from"react";
import { Plus, X, Calendar, UserCheck, ShieldAlert, Sparkles, MessageSquare } from"lucide-react";
import { motion, AnimatePresence } from"motion/react";

interface MobileFABProps {
 onQuickAction: (actionId: string) => void;
 userRole?: string;
}

export function MobileFAB({ onQuickAction, userRole ="Patient" }: MobileFABProps) {
 const [isOpen, setIsOpen] = useState(false);

 const toggleOpen = () => setIsOpen(!isOpen);

 // Define quick actions depending on the current user role
 const getActionsByRole = () => {
 switch (userRole) {
 case"Patient":
 case"Family Member":
 return [
 { id:"book-service", label:"Schedule Care Treatment", icon: <Calendar className="w-4 h-4 text-accent" /> },
 { id:"consult-ai", label:"Ask Gemini Advisor", icon: <Sparkles className="w-4 h-4 text-secondary" /> },
 ];
 case"Home Healthcare Agency":
 case"Agency Admin":
 return [
 { id:"assign-staff", label:"Assign New Staff", icon: <UserCheck className="w-4 h-4 text-secondary" /> },
 { id:"audit-compliance", label:"Verify Qualifications", icon: <ShieldAlert className="w-4 h-4 text-accent-light" /> },
 ];
 case"Nurse":
 case"Caregiver":
 return [
 { id:"start-duty", label:"Check-in Duty Slot", icon: <UserCheck className="w-4 h-4 text-accent" /> },
 { id:"consult-ai", label:"Verify Treatments", icon: <Sparkles className="w-4 h-4 text-secondary" /> },
 ];
 default:
 return [
 { id:"book-service", label:"Schedule Care Treatment", icon: <Calendar className="w-4 h-4 text-accent" /> },
 { id:"consult-ai", label:"Ask Gemini Advisor", icon: <Sparkles className="w-4 h-4 text-secondary" /> },
 ];
 }
 };

 const actions = getActionsByRole();

 return (
 <div className="md:hidden fixed bottom-20 right-6 z-40">
 <AnimatePresence>
 {isOpen && (
 <div className="flex flex-col gap-6 mb-3 items-end">
 {actions.map((act) => (
 <motion.button
 key={act.id}
 initial={{ opacity: 0, scale: 0.8, y: 10 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.8, y: 10 }}
 onClick={() => {
 onQuickAction(act.id);
 setIsOpen(false);
 }}
 className="flex items-center gap-6 bg-white border border-border py-2 px-3.5 rounded-2xl shadow-xl text-sm font-bold text-primary cursor-pointer"
 >
 <span>{act.label}</span>
 {act.icon}
 </motion.button>
 ))}
 </div>
 )}
 </AnimatePresence>

 {/* Main Trigger FAB Button */}
 <motion.button
 whileTap={{ scale: 0.9 }}
 onClick={toggleOpen}
 className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl focus:outline-none border border-border-light cursor-pointer"
 >
 <AnimatePresence mode="wait">
 {isOpen ? (
 <motion.div
 key="close"
 initial={{ rotate: -90, opacity: 0 }}
 animate={{ rotate: 0, opacity: 1 }}
 exit={{ rotate: 90, opacity: 0 }}
 >
 <X className="w-5 h-5" />
 </motion.div>
 ) : (
 <motion.div
 key="plus"
 initial={{ rotate: 90, opacity: 0 }}
 animate={{ rotate: 0, opacity: 1 }}
 exit={{ rotate: -90, opacity: 0 }}
 >
 <Plus className="w-5 h-5" />
 </motion.div>
 )}
 </AnimatePresence>
 </motion.button>
 </div>
 );
}
