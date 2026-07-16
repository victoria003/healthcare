import React from"react";

export default function Loading() {
 return (
 <div className="flex flex-col items-center justify-center min-h-screen bg-bg-alt">
 <div className="relative w-16 h-16">
 <div className="absolute inset-0 rounded-full border-4 border-border"></div>
 <div className="absolute inset-0 rounded-full border-4 border-accent border-t-transparent animate-spin"></div>
 </div>
 <h3 className="mt-6 text-base font-semibold tracking-wide text-text-secondary uppercase">
 Loading Marketplace Resources...
 </h3>
 </div>
 );
}
