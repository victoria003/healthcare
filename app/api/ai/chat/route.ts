import { NextResponse } from"next/server";
import { AIService } from"../../../../services/aiService";

export async function POST(request: Request) {
 try {
 const body = await request.json();
 const { messages, context } = body;

 const userMessage = messages?.[messages.length - 1]?.text || messages?.[messages.length - 1]?.content ||"How should I clean a tracheostomy tube?";

 const resultText = await AIService.generateClinicalChat(userMessage, context);

 return NextResponse.json({ success: true, text: resultText });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
