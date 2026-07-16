import { NextResponse } from"next/server";
import { AuthService } from"../../../../services/auth.service";

export async function POST(request: Request) {
 try {
 const body = await request.json();
 
 let firstName = body.firstName ||"";
 let lastName = body.lastName ||"";
 
 if (body.fullName && !firstName && !lastName) {
 const parts = body.fullName.trim().split(/\s+/);
 firstName = parts[0] ||"Demo";
 lastName = parts.slice(1).join("") ||"User";
 }

 const { email, password, role } = body;
 const phone = body.phone ||"+91 90000 00000";

 // Mappings from frontend role string (e.g. 'Patient' or 'patient') to valid roles
 let mappedRole = role ||"patient";
 if (mappedRole.toLowerCase() ==="patient") mappedRole ="patient";
 else if (mappedRole.toLowerCase() ==="agency") mappedRole ="agency";
 else if (mappedRole.toLowerCase() ==="professional") mappedRole ="professional";

 // Check required fields
 if (!email || !firstName || !lastName || !password || !mappedRole) {
 return NextResponse.json({ success: false, error:"Missing required registration parameters." }, { status: 400 });
 }

 const result = await AuthService.register({
 firstName,
 lastName,
 email,
 phone,
 password,
 role: mappedRole,
 });

 if (!result.success) {
 return NextResponse.json({ success: false, error: result.error }, { status: 400 });
 }

 return NextResponse.json({
 success: true,
 user: result.user,
 token: result.token,
 refreshToken: result.refreshToken,
 });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
