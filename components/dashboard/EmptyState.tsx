"use client";

import React from"react";
import { useRouter } from"next/navigation";
import PrimaryButton from"./PrimaryButton";
import SecondaryButton from"./SecondaryButton";
import { EmptyStateProps } from"@/types/dashboard";

export default function EmptyState({ icon, title, description, buttonLabel, buttonLink }: EmptyStateProps) {
 const router = useRouter();

 return (
 <div className="flex flex-col items-center justify-center py-24 px-6 text-center border-2 border-dashed border-border rounded-2xl bg-bg-alt/50">
 {/* Icon container */}
 <div className="w-20 h-20 rounded-full bg-bg-alt text-text-tertiary flex items-center justify-center mb-6 shadow-sm">
 {React.cloneElement(icon as React.ReactElement<any>, { className:"w-10 h-10" })}
 </div>

 {/* Title */}
 <h4 className="text-xl font-bold text-primary">
 {title}
 </h4>

 {/* Description */}
 <p className="text-base text-text-tertiary mt-3 max-w-md leading-relaxed">
 {description}
 </p>

 {/* Actions */}
 {buttonLabel && buttonLink && (
 <div className="flex items-center gap-6 mt-8">
 <PrimaryButton
 onClick={() => router.push(buttonLink)}
 >
 {buttonLabel}
 </PrimaryButton>
 </div>
 )}
 </div>
 );
}
