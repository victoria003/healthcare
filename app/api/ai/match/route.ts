import { NextResponse } from"next/server";
import { AIService } from"../../../../services/aiService";

export async function POST(request: Request) {
 try {
 const body = await request.json();
 const { patientNeeds } = body;

 const matchAnalysis = await AIService.runMatchmaking(patientNeeds);

 return NextResponse.json({ success: true, matchAnalysis });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
