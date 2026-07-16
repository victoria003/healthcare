import { NextResponse } from"next/server";
import { AuthService } from"../../../../services/auth.service";
import { CookiesLib } from"../../../../lib/auth/cookies";

export async function POST(request: Request) {
 try {
 let refreshToken: string | undefined = undefined;

 // Try reading from request body
 try {
 const body = await request.json();
 refreshToken = body.refreshToken;
 } catch {
 // Body might be empty or not JSON
 }

 // Fallback to cookie
 if (!refreshToken) {
 refreshToken = await CookiesLib.getRefreshToken();
 }

 if (!refreshToken) {
 return NextResponse.json({ success: false, error:"Refresh token is required" }, { status: 400 });
 }

 const result = await AuthService.refresh(refreshToken);
 if (!result.success) {
 return NextResponse.json({ success: false, error: result.error }, { status: 401 });
 }

 return NextResponse.json({
 success: true,
 token: result.token,
 refreshToken: result.refreshToken,
 });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
