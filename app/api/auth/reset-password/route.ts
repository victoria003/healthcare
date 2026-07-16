import { NextResponse } from"next/server";
import { AuthService } from"../../../../services/auth.service";

export async function POST(request: Request) {
 try {
 const body = await request.json();
 const { token, newPassword } = body;

 if (!token) {
 return NextResponse.json({ success: false, error:"Reset token is required" }, { status: 400 });
 }

 const result = await AuthService.resetPassword(token, newPassword);

 if (!result.success) {
 return NextResponse.json({ success: false, error: result.error }, { status: 400 });
 }

 return NextResponse.json({ success: true });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
