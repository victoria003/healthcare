import { NextResponse } from"next/server";
import { AuthService } from"../../../../services/auth.service";
import { CookiesLib } from"../../../../lib/auth/cookies";

export async function POST(request: Request) {
 try {
 const authHeader = request.headers.get("authorization");
 let token = authHeader && authHeader.split("")[1];

 if (!token) {
 token = await CookiesLib.getAccessToken() || await CookiesLib.getRefreshToken();
 }

 if (token) {
 await AuthService.logout(token);
 } else {
 // Clear cookies regardless
 await CookiesLib.clearAuthCookies();
 }

 return NextResponse.json({ success: true });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
