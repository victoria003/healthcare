import React from"react";
import PrimaryButton from"../dashboard/PrimaryButton";
import SecondaryButton from"../dashboard/SecondaryButton";
import { WizardNavigationProps } from"@/types/form";

export default function WizardNavigation({
 currentStep,
 totalSteps,
 onPrevious,
 onNext,
 onFinish,
 onCancel,
 isNextDisabled = false,
 isPreviousDisabled = false,
}: WizardNavigationProps) {
 const isFirstStep = currentStep === 1;
 const isLastStep = currentStep === totalSteps;

 return (
 <div className="flex items-center justify-between border-t border-border-light pt-6 mt-8 w-full select-none">
 <SecondaryButton
 type="button"
 onClick={onCancel}
 className="text-rose-600 border-rose-200 hover:bg-rose-50 :bg-rose-950/20"
 >
 Cancel
 </SecondaryButton>

 <div className="flex items-center gap-6">
 {!isFirstStep && (
 <SecondaryButton
 type="button"
 onClick={onPrevious}
 disabled={isPreviousDisabled}
 >
 Previous
 </SecondaryButton>
 )}

 {isLastStep ? (
 <PrimaryButton
 type="button"
 onClick={onFinish}
 disabled={isNextDisabled}
 >
 Finish
 </PrimaryButton>
 ) : (
 <PrimaryButton
 type="button"
 onClick={onNext}
 disabled={isNextDisabled}
 >
 Next
 </PrimaryButton>
 )}
 </div>
 </div>
 );
}
