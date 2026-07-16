import React, { useState, useEffect } from"react";
import { X } from"lucide-react";

export interface AgencyFormData {
 id?: string;
 name: string;
 email: string;
 phone: string;
 registrationNumber: string;
 gstNumber: string;
}

interface AgencyModalProps {
 isOpen: boolean;
 onClose: () => void;
 onSubmit: (data: AgencyFormData) => Promise<void>;
 initialData?: AgencyFormData | null;
 mode:"create" |"edit";
}

export default function AgencyModal({ isOpen, onClose, onSubmit, initialData, mode }: AgencyModalProps) {
 const [formData, setFormData] = useState<AgencyFormData>({
 name:"",
 email:"",
 phone:"",
 registrationNumber:"",
 gstNumber:"",
 });
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");

 useEffect(() => {
 if (isOpen) {
 if (initialData) {
 setFormData(initialData);
 } else {
 setFormData({ name:"", email:"", phone:"", registrationNumber:"", gstNumber:"" });
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
 {mode ==="create" ?"Add Agency" :"Edit Agency"}
 </h2>
 <button onClick={onClose} className="p-1 rounded-lg text-text-tertiary hover:text-text-secondary hover:bg-bg-alt :bg-primary transition-colors">
 <X className="w-5 h-5" />
 </button>
 </div>

 <form onSubmit={handleSubmit} className="p-6 space-y-4 text-base">
 {error && <div className="p-3 rounded-lg bg-rose-50 text-rose-600 text-sm font-semibold">{error}</div>}
 
 <div className="space-y-1">
 <label className="text-sm font-semibold text-text-secondary">Agency Name</label>
 <input
 required
 type="text"
 value={formData.name}
 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
 className="w-full px-3 py-2 rounded-lg border border-border bg-transparent text-primary outline-none focus:border-indigo-500 transition-colors"
 />
 </div>

 <div className="space-y-1">
 <label className="text-sm font-semibold text-text-secondary">Email</label>
 <input
 required
 type="email"
 value={formData.email}
 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
 className="w-full px-3 py-2 rounded-lg border border-border bg-transparent text-primary outline-none focus:border-indigo-500 transition-colors"
 />
 </div>

 <div className="space-y-1">
 <label className="text-sm font-semibold text-text-secondary">Phone</label>
 <input
 required
 type="text"
 value={formData.phone}
 onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
 className="w-full px-3 py-2 rounded-lg border border-border bg-transparent text-primary outline-none focus:border-indigo-500 transition-colors"
 />
 </div>

 <div className="space-y-1">
 <label className="text-sm font-semibold text-text-secondary">Registration Number</label>
 <input
 required
 type="text"
 value={formData.registrationNumber}
 onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
 className="w-full px-3 py-2 rounded-lg border border-border bg-transparent text-primary outline-none focus:border-indigo-500 transition-colors"
 />
 </div>
 
 <div className="space-y-1">
 <label className="text-sm font-semibold text-text-secondary">GST Number</label>
 <input
 type="text"
 value={formData.gstNumber}
 onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
 className="w-full px-3 py-2 rounded-lg border border-border bg-transparent text-primary outline-none focus:border-indigo-500 transition-colors"
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
 className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary disabled:opacity-50 transition-colors"
 >
 {loading ?"Saving..." : mode ==="create" ?"Create" :"Save Changes"}
 </button>
 </div>
 </form>
 </div>
 </div>
 );
}
