import { NextResponse } from"next/server";
import { AuthService } from"../../../../services/auth.service";
import { CookiesLib } from"../../../../lib/auth/cookies";

export async function GET(request: Request) {
 try {
 // 1. Check Auth Header
 const authHeader = request.headers.get("authorization");
 let token = authHeader && authHeader.split("")[1];

 // 2. Fallback to Cookie
 if (!token) {
 token = await CookiesLib.getAccessToken();
 }

 if (!token) {
 return NextResponse.json({ success: false, error:"Access token required" }, { status: 401 });
 }

 const result = await AuthService.getCurrentUser(token);
 if (!result.success) {
 return NextResponse.json({ success: false, error: result.error }, { status: 401 });
 }

 return NextResponse.json({
 success: true,
 user: result.user,
 });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
