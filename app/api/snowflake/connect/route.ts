import { NextResponse } from"next/server";
import { executeQuery, getSnowflakeConfig } from"../../../../lib/database/executeQuery";

export async function POST(request: Request) {
 try {
 const config = getSnowflakeConfig();
 const hasEnvConfig = !!(config.account && config.username && config.privateKey);

 if (!hasEnvConfig) {
 return NextResponse.json({
 success: false,
 error:"Snowflake credentials are not fully configured in your environment variables. Please check .env file."
 }, { status: 400 });
 }

 try {
 await executeQuery("SELECT 1 as TEST_VAL");
 return NextResponse.json({
 success: true,
 message:"Snowflake REST API pipeline connected and verified successfully!",
 config: {
 isConnected: true,
 account: config.account,
 username: config.username,
 warehouse: config.warehouse,
 database: config.database,
 schema: config.schema
 }
 });
 } catch (connError: any) {
 return NextResponse.json({
 success: false,
 error:`Failed to connect to Snowflake REST API: ${connError.message}`
 }, { status: 401 });
 }
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
