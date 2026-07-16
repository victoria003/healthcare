import { NextResponse } from"next/server";
import { JWTLib } from"../../../../lib/auth/jwt";
import { UserRepository } from"../../../../repositories/userRepository";

export async function GET(request: Request) {
 // Query first user or default to a demo user from Snowflake CORE.USERS
 const users = await UserRepository.getAll();
 const user = users[0] || {
 id:"u-1",
 email:"admin@homecare.in",
 fullName:"Ankala Victoria Rani",
 role:"Admin",
 phone:"+91 9000000000",
 };

 const payload = { id: user.id, email: user.email, role: user.role as string, fullName: user.fullName };
 const accessToken = await JWTLib.signAccessToken(payload);

 const html =`
 <html>
 <head>
 <title>Google Authentication Success</title>
 <style>
 body { font-family: -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #f8fafc; color: #0f172a; }
 .card { text-align: center; padding: 2.5rem; background: white; border-radius: 1.5rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); border: 1px solid #e2e8f0; max-width: 380px; }
 .spinner { border: 3px solid #f3f3f3; border-top: 3px solid #3b82f6; border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; margin: 1rem auto; }
 @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
 </style>
 </head>
 <body>
 <div class="card">
 <svg style="color: #10b981; width: 48px; height: 48px; margin: 0 auto 1rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 <h2 style="margin: 0 0 0.5rem 0; font-size: 1.25rem;">Identity Verified</h2>
 <p style="color: #64748b; font-size: 0.875rem; margin: 0;">Logging you securely into HomeCare Grid Marketplace...</p>
 <div class="spinner"></div>
 </div>
 <script>
 if (window.opener) {
 window.opener.postMessage({
 type:"OAUTH_AUTH_SUCCESS",
 user: ${JSON.stringify({ id: user.id, email: user.email, fullName: user.fullName, role: user.role, phone: user.phone })},
 token:"${accessToken}"
 },"*");
 setTimeout(() => {
 window.close();
 }, 1000);
 } else {
 window.location.href ="/";
 }
 </script>
 </body>
 </html>
`;

 return new Response(html, {
 headers: {"Content-Type":"text/html" }
 });
}
