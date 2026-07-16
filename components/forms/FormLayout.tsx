import React from"react";

export default function FormLayout({ children }: { children: React.ReactNode }) {
 return (
 <div className="max-w-4xl mx-auto w-full space-y-6 md:space-y-8 py-4">
 {children}
 </div>
 );
}
