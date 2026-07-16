import React from "react";

export interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  children: React.ReactNode;
}

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string }[];
  placeholder?: string;
  error?: string;
  helperText?: string;
}

export interface TextAreaInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  helperText?: string;
}

export interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export interface TimeSlotSelectorProps {
  slots: string[];
  selectedSlot?: string;
  onSelectSlot: (slot: string) => void;
  error?: string;
  helperText?: string;
}

export interface ReviewCardProps {
  title: string;
  items: { label: string; value: string }[];
}

export interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
  completedSteps: number[];
}

export interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
  onCancel: () => void;
  isNextDisabled?: boolean;
  isPreviousDisabled?: boolean;
}
