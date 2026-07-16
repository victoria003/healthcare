import { NextResponse } from"next/server";
import { AuthService } from"../../../../services/auth.service";

export async function POST(request: Request) {
 try {
 const body = await request.json();
 const { email } = body;

 const result = await AuthService.forgotPassword(email);

 if (!result.success) {
 return NextResponse.json({ success: false, error: result.error }, { status: 400 });
 }

 return NextResponse.json({ success: true });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
