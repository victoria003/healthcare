/**
 * Enterprise Validation Engines
 */

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone: string): boolean {
  // Validate standard Indian/Global numbers (+91 XXXXX XXXXX)
  const re = /^\+?[1-9]\d{1,14}$/;
  return re.test(phone.replace(/\s+/g, ""));
}

export function validateVitals(vitals: { systolic?: number; diastolic?: number; heartRate?: number; spO2?: number }): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (vitals.systolic !== undefined && (vitals.systolic < 50 || vitals.systolic > 250)) {
    errors.push("Systolic blood pressure reading out of physiological bounds.");
  }
  if (vitals.diastolic !== undefined && (vitals.diastolic < 30 || vitals.diastolic > 150)) {
    errors.push("Diastolic blood pressure reading out of physiological bounds.");
  }
  if (vitals.spO2 !== undefined && (vitals.spO2 < 50 || vitals.spO2 > 100)) {
    errors.push("Oxygen saturation level must be within 50% and 100%.");
  }
  return {
    valid: errors.length === 0,
    errors
  };
}
