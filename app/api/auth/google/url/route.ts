import { NextResponse } from"next/server";

export async function GET(request: Request) {
 try {
 const host = request.headers.get("host") ||"localhost:3000";
 const protocol = host.includes("localhost") || host.includes("127.0.0.1") ?"http" :"https";
 const redirectUri =`${protocol}://${host}/auth/callback`;
 const params = new URLSearchParams({
 client_id: process.env.GOOGLE_CLIENT_ID ||"homecare-marketplace-client-id",
 redirect_uri: redirectUri,
 response_type:"code",
 scope:"openid email profile",
 });

 const authUrl =`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
 return NextResponse.json({ success: true, url: authUrl });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
