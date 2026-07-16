import { NextResponse } from"next/server";
import { AIService } from"../../../../services/aiService";

export async function POST(request: Request) {
 try {
 const body = await request.json();
 const { vitalsLog, carePlan } = body;

 const summary = await AIService.runVitalsSummary(vitalsLog, carePlan);

 return NextResponse.json({ success: true, summary });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
