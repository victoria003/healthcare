interface PendingOtp {
  code: string;
  expiresAt: number;
  role: string;
}

export const otpStore = new Map<string, PendingOtp>();
