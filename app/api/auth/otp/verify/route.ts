import { NextResponse } from"next/server";
import { JWTLib } from"../../../../../lib/auth/jwt";
import { otpStore } from"../../../../../lib/auth/otpStore";
import { UserRepository } from"../../../../../repositories/userRepository";
import { AuditRepository } from"../../../../../repositories/auditRepository";

async function generateTokens(user: { id: string; email: string; role: string; fullName: string }) {
 const payload = { id: user.id, email: user.email, role: user.role, fullName: user.fullName };
 const accessToken = await JWTLib.signAccessToken(payload);
 const refreshToken = await JWTLib.signRefreshToken(payload);
 return { accessToken, refreshToken };
}

export async function POST(request: Request) {
 try {
 const body = await request.json();
 const { email, phone, code } = body;
 const target = email || phone;

 if (!target || !code) {
 return NextResponse.json({ success: false, error:"Target and code are required" }, { status: 400 });
 }

 const pending = otpStore.get(target);

 if (!pending) {
 return NextResponse.json({ success: false, error:"No pending OTP request found for this account" }, { status: 400 });
 }

 if (Date.now() > pending.expiresAt) {
 otpStore.delete(target);
 return NextResponse.json({ success: false, error:"OTP code has expired. Please request a new one." }, { status: 400 });
 }

 if (pending.code !== code) {
 return NextResponse.json({ success: false, error:"Incorrect verification code. Please try again." }, { status: 400 });
 }

 // Handshake success. Get or auto-register user in Snowflake
 let user = await UserRepository.findByEmail(email ||"") || await UserRepository.findByPhone(phone ||"");
 if (!user) {
 user = await UserRepository.create({
 email: email ||`${Date.now()}@homecare.in`,
 fullName: email ? email.split("@")[0].toUpperCase() :"New Patient Profile",
 role: (pending.role ||"Patient") as any,
 phone: phone ||"+91 9000000000",
 avatarUrl:"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
 status:"active" as any,
 passwordHash:"$2a$10$wK1F5Q.xNfR1p6g2P2HGeOi0.V.KkFpDqYkP/8JNz6vK7q5.w2K6u", // placeholder hash
 });
 }

 otpStore.delete(target);

 await AuditRepository.createLog(
 user.id,
"User Login",
`Successfully verified OTP via ${email ?"Email" :"Phone"}. Role: ${user.role}`,
 request.headers.get("x-forwarded-for") ||"127.0.0.1"
 );

 const tokens = await generateTokens(user);

 return NextResponse.json({
 success: true,
 user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role, phone: user.phone, status: user.status },
 token: tokens.accessToken,
 refreshToken: tokens.refreshToken
 });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
