import { NextResponse } from"next/server";
import { PaymentsRepository } from"../../../repositories/paymentsRepository";

export async function GET(request: Request) {
 try {
 const { searchParams } = new URL(request.url);
 const bookingId = searchParams.get("bookingId");

 let list = await PaymentsRepository.getInvoices();

 if (bookingId) {
 list = list.filter((inv: any) => inv.bookingId === bookingId);
 }

 return NextResponse.json({ success: true, invoices: list });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
