import { NextResponse } from"next/server";
import bcrypt from"bcryptjs";
import { AgencyRepository } from"../../../../repositories/agencyRepository";
import { UserRepository } from"../../../../repositories/userRepository";
import { AuditRepository } from"../../../../repositories/auditRepository";

export async function POST(request: Request) {
 try {
 const body = await request.json();
 const { name, email, phone, ownerName, password, registrationNumber, gstNumber, panNumber, city, state, pincode, description } = body;

 if (!name || !email || !ownerName) {
 return NextResponse.json({ success: false, error:"Missing required registration parameters" }, { status: 400 });
 }

 // Check if email already exists
 const existingUser = await UserRepository.findByEmail(email);
 if (existingUser) {
 return NextResponse.json({ success: false, error:"An administrator with this email already exists" }, { status: 400 });
 }

 // 1. Create the agency profile
 const agency = await AgencyRepository.create({
 name,
 ownerName,
 phone: phone ||"+91 9000012345",
 email,
 registrationNumber: registrationNumber ||`REG-${Date.now()}`,
 gstNumber: gstNumber ||"36AAAAN4512Q1ZX",
 panNumber: panNumber ||"AAANP4512Q",
 city: city ||"Hyderabad",
 state: state ||"Telangana",
 pincode: pincode ||"500081",
 description: description ||"Home healthcare and nursing agency."
 });

 if (body.status) {
 agency.status = body.status;
 if (body.status ==="approved") {
 agency.verified = true;
 agency.rating = 4.9;
 agency.reviewCount = 5;
 }
 }

 // 2. Create the associated agency admin user
 const passwordHash = bcrypt.hashSync(password ||"password123", 10);
 const newUser = await UserRepository.create({
 email,
 fullName: ownerName,
 role:"Agency Admin" as any, // Matches core UserRole
 phone: phone ||"+91 9000012345",
 avatarUrl:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
 status:"active" as any,
 passwordHash,
 });

 // Write audit trails
 await AuditRepository.createLog(
 newUser.id,
"Agency Registration",
`Successfully registered agency"${name}" and owner profile.`,
 request.headers.get("x-forwarded-for") ||"127.0.0.1"
 );

 return NextResponse.json({ success: true, agency, user: newUser });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
