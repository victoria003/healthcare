import { NextResponse } from"next/server";
import { AuthService } from"../../../../services/auth.service";

export async function POST(request: Request) {
 try {
 const body = await request.json();
 const { email, password, role } = body;

 const ipAddress = request.headers.get("x-forwarded-for") ||"127.0.0.1";
 const userAgent = request.headers.get("user-agent") ||"Mozilla/5.0";

 const result = await AuthService.login({ email, password, role }, ipAddress, userAgent);

 if (!result.success) {
 return NextResponse.json(
 { success: false, error: result.error ||"Login failed", message: result.error ||"Login failed" },
 { status: 401 }
 );
 }

 return NextResponse.json({
 success: true,
 user: result.user,
 token: result.token,
 refreshToken: result.refreshToken,
 });
 } catch (error: any) {
 return NextResponse.json(
 { success: false, error: error.message, message: error.message },
 { status: 500 }
 );
 }
}
