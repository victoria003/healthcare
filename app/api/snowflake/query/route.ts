import { NextResponse } from"next/server";
import { executeQuery } from"../../../../lib/database/executeQuery";

export async function POST(request: Request) {
 try {
 const body = await request.json();
 const { sql } = body;

 if (!sql) {
 return NextResponse.json({ success: false, error:"SQL statement is required" }, { status: 400 });
 }

 const startTime = Date.now();
 try {
 const rows = await executeQuery(sql);
 const executionTimeMs = Date.now() - startTime;

 return NextResponse.json({
 success: true,
 sql,
 rows,
 meta: {
 fields: Object.keys(rows[0] || {}),
 executionTimeMs,
 }
 });
 } catch (queryErr: any) {
 return NextResponse.json({
 success: false,
 error:`Snowflake Query Execution Failed: ${queryErr.message}`
 }, { status: 500 });
 }
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
