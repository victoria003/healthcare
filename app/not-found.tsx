import React from"react";
import Link from"next/link";

export default function NotFound() {
 return (
 <div className="flex flex-col items-center justify-center min-h-screen bg-bg-alt px-5 text-center animate-fade-in">
 <h1 className="text-7xl font-extrabold text-accent-light tracking-widest font-mono">404</h1>
 <h2 className="text-xl font-bold text-primary tracking-tight mt-4">Page Not Found</h2>
 <p className="text-text-tertiary text-base mt-2 max-w-sm">
 We couldn't find the page or medical record you're trying to access.
 </p>
 <Link
 href="/"
 className="mt-6 px-5 py-2.5 bg-primary hover:bg-primary text-white rounded-xl text-base font-medium transition-all"
 >
 Return to Dashboard
 </Link>
 </div>
 );
}
