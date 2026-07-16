import React, { useState, useEffect } from"react";
import { X } from"lucide-react";

export interface ProfessionalFormData {
 id?: string;
 fullName: string;
 email: string;
 phone: string;
 experienceYears: number;
}

interface ProfessionalModalProps {
 isOpen: boolean;
 onClose: () => void;
 onSubmit: (data: ProfessionalFormData) => Promise<void>;
 initialData?: ProfessionalFormData | null;
 mode:"create" |"edit";
}

export default function ProfessionalModal({ isOpen, onClose, onSubmit, initialData, mode }: ProfessionalModalProps) {
 const [formData, setFormData] = useState<ProfessionalFormData>({
 fullName:"",
 email:"",
 phone:"",
 experienceYears: 0,
 });
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");

 useEffect(() => {
 if (isOpen) {
 if (initialData) {
 setFormData(initialData);
 } else {
 setFormData({ fullName:"", email:"", phone:"", experienceYears: 0 });
 }
 setError("");
 }
 }, [isOpen, initialData]);

 if (!isOpen) return null;

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setLoading(true);
 setError("");
 try {
 await onSubmit(formData);
 onClose();
 } catch (err: any) {
 setError(err.message ||"Something went wrong.");
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-primary/50 backdrop-blur-sm">
 <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-border">
 <div className="flex items-center justify-between p-6 border-b border-border-light">
 <h2 className="text-lg font-bold text-primary">
 {mode ==="create" ?"Add Professional" :"Edit Professional"}
 </h2>
 <button onClick={onClose} className="p-1 rounded-lg text-text-tertiary hover:text-text-secondary hover:bg-bg-alt :bg-primary transition-colors">
 <X className="w-5 h-5" />
 </button>
 </div>

 <form onSubmit={handleSubmit} className="p-6 space-y-4 text-base">
 {error && <div className="p-3 rounded-lg bg-rose-50 text-rose-600 text-sm font-semibold">{error}</div>}
 
 <div className="space-y-1">
 <label className="text-sm font-semibold text-text-secondary">Full Name</label>
 <input
 required
 type="text"
 value={formData.fullName}
 onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
 className="w-full px-3 py-2 rounded-lg border border-border bg-transparent text-primary outline-none focus:border-accent-light transition-colors"
 />
 </div>

 <div className="space-y-1">
 <label className="text-sm font-semibold text-text-secondary">Email</label>
 <input
 required
 type="email"
 value={formData.email}
 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
 className="w-full px-3 py-2 rounded-lg border border-border bg-transparent text-primary outline-none focus:border-accent-light transition-colors"
 />
 </div>

 <div className="space-y-1">
 <label className="text-sm font-semibold text-text-secondary">Phone</label>
 <input
 required
 type="text"
 value={formData.phone}
 onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
 className="w-full px-3 py-2 rounded-lg border border-border bg-transparent text-primary outline-none focus:border-accent-light transition-colors"
 />
 </div>

 <div className="space-y-1">
 <label className="text-sm font-semibold text-text-secondary">Experience (Years)</label>
 <input
 required
 type="number"
 min="0"
 value={formData.experienceYears}
 onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })}
 className="w-full px-3 py-2 rounded-lg border border-border bg-transparent text-primary outline-none focus:border-accent-light transition-colors"
 />
 </div>

 <div className="pt-4 flex items-center justify-end gap-6 border-t border-border-light">
 <button
 type="button"
 onClick={onClose}
 className="px-5 py-2 rounded-lg text-sm font-semibold text-text-secondary hover:bg-bg-alt :bg-primary transition-colors"
 >
 Cancel
 </button>
 <button
 type="submit"
 disabled={loading}
 className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-accent-light hover:bg-accent-light disabled:opacity-50 transition-colors"
 >
 {loading ?"Saving..." : mode ==="create" ?"Create" :"Save Changes"}
 </button>
 </div>
 </form>
 </div>
 </div>
 );
}
