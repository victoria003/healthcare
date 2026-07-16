"use client";

import React, { useEffect } from"react";

export default function Error({
 error,
 reset,
}: {
 error: Error & { digest?: string };
 reset: () => void;
}) {
 useEffect(() => {
 console.error(error);
 }, [error]);

 return (
 <div className="flex flex-col items-center justify-center min-h-screen bg-bg-alt px-5 text-center">
 <div className="w-16 h-16 bg-bg rounded-full flex items-center justify-center text-accent-light mb-6 mx-auto">
 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
 </svg>
 </div>
 <h2 className="text-xl font-bold text-primary tracking-tight">Something went wrong</h2>
 <p className="text-text-tertiary text-base mt-2 max-w-md">
 An error occurred within the marketplace system. Please reload or click reset to try again.
 </p>
 <button
 onClick={() => reset()}
 className="mt-6 px-5 py-2.5 bg-orange-655 hover:bg-accent-light text-white rounded-xl text-base font-medium transition-colors cursor-pointer"
 >
 Try Again
 </button>
 </div>
 );
}
