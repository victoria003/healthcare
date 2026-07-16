import { NextResponse } from"next/server";
import { AuthService } from"../../../../services/auth.service";
import { CookiesLib } from"../../../../lib/auth/cookies";

export async function POST(request: Request) {
 try {
 const authHeader = request.headers.get("authorization");
 let token = authHeader && authHeader.split("")[1];

 if (!token) {
 token = await CookiesLib.getAccessToken();
 }

 if (!token) {
 return NextResponse.json({ success: false, error:"Access token required" }, { status: 401 });
 }

 const currentUserRes = await AuthService.getCurrentUser(token);
 if (!currentUserRes.success || !currentUserRes.user) {
 return NextResponse.json({ success: false, error:"Unauthorized access" }, { status: 401 });
 }

 const body = await request.json();
 const { oldPassword, newPassword } = body;

 const result = await AuthService.changePassword(currentUserRes.user.id, oldPassword, newPassword);

 if (!result.success) {
 return NextResponse.json({ success: false, error: result.error }, { status: 400 });
 }

 return NextResponse.json({ success: true });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
