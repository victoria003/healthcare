import { NextResponse } from"next/server";
import { otpStore } from"../../../../../lib/auth/otpStore";

export async function POST(request: Request) {
 try {
 const body = await request.json();
 const { email, phone, role } = body;
 const target = email || phone;

 if (!target) {
 return NextResponse.json({ success: false, error:"Email or phone number is required" }, { status: 400 });
 }

 const code = Math.floor(100000 + Math.random() * 900000).toString();
 const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins validity

 otpStore.set(target, { code, expiresAt, role });

 return NextResponse.json({
 success: true,
 message:`Verification OTP code generated. For demo verification, your 6-digit code is: ${code}`,
 code
 });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
